import AxiosDigestAuth from "@mhoc/axios-digest-auth";
import { SwitchPoolParams } from "./common-types";

const ANTMINER_DEFAULTS = {
  MINER_USERNAME: "root",
  MINER_PWD: "root",
};
const ANTMINER_DIGESTAUTH = new AxiosDigestAuth({
  username: ANTMINER_DEFAULTS.MINER_USERNAME,
  password: ANTMINER_DEFAULTS.MINER_PWD,
});

const EMPTY_POOL_CONFIG = {
  url: "",
  user: "",
  pass: "",
};

type AntminerMinerPoolInfo = {
  url: string;
  user: string;
  pass: string;
};

type PoolValidationInfo = {
  macAddress: string;
};

type MinerValidator = (param: PoolValidationInfo) => SwitchPoolParams;

type PoolConfigInfo = {
  "bitmain-fan-ctrl": boolean;
  "bitmain-fan-pwm": string;
  "freq-level": string;
  "miner-mode": string;
  pools: AntminerMinerPoolInfo[];
};

async function getSytemInfo(ipAddress: string): Promise<PoolValidationInfo> {
  return await ANTMINER_DIGESTAUTH.request({
    headers: { Accept: "application/json" },
    method: "GET",
    url: `http://${ipAddress}/cgi-bin/get_system_info.cgi`,
  }).then((res) => {
    return { macAddress: res.data["macaddr"] };
  });
}

function verifyMinerIsForClient(params: SwitchPoolParams): MinerValidator {
  return (validationInfo: PoolValidationInfo) => {
    if (validationInfo.macAddress != params.macAddress) {
      // send an email about miner ip address switching
      throw Error("Miner mismatch. The MAC does not match the expected IP.");
    }
    return params;
  };
}

function getMinerConfig(
  params: SwitchPoolParams
): () => Promise<PoolConfigInfo> {
  return async () => {
    return await ANTMINER_DIGESTAUTH.request({
      headers: { Accept: "application/json" },
      method: "GET",
      url: `http://${params.ipAddress}/cgi-bin/get_miner_conf.cgi`,
    }).then((res) => {
      const minerConfig = res.data;
      const pools: AntminerMinerPoolInfo[] = minerConfig["pools"];
      return {
        "bitmain-fan-ctrl": minerConfig["bitmain-fan-ctrl"],
        "bitmain-fan-pwm": minerConfig["bitmain-fan-pwm"],
        "freq-level": minerConfig["bitmain-freq-level"],
        "miner-mode": minerConfig["bitmain-work-mode"],
        pools: pools,
      };
    });
  };
}

function updateMinerConfig(
  switchPoolParams: SwitchPoolParams
): (poolConfig: PoolConfigInfo) => Promise<any> {
  return async (poolConfig: PoolConfigInfo) => {
    return await ANTMINER_DIGESTAUTH.request({
      headers: { Accept: "application/json" },
      method: "POST",
      url: `http://${switchPoolParams.ipAddress}/cgi-bin/set_miner_conf.cgi`,
      data: buildNewMinerConfig(switchPoolParams, poolConfig),
    });
  };
}

function buildNewMinerConfig(
  switchPoolInfo: SwitchPoolParams,
  poolConfig: PoolConfigInfo
): PoolConfigInfo {
  const newPoolConfig = { ...poolConfig };
  newPoolConfig.pools = [
    {
      url: switchPoolInfo.pool.url,
      user: switchPoolInfo.pool.username,
      pass: "",
    },
    EMPTY_POOL_CONFIG,
    EMPTY_POOL_CONFIG,
  ];
  return newPoolConfig;
}

export async function switchAntminerPool(
  params: SwitchPoolParams
): Promise<any> {
  return await getSytemInfo(params.ipAddress)
    .then(verifyMinerIsForClient(params))
    .then(getMinerConfig(params))
    .then(updateMinerConfig(params));
}

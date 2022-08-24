import { logger } from "@/utils/logger";
import { waitInMilliseconds } from "@/utils/timer";
import AxiosDigestAuth from "@mhoc/axios-digest-auth";
import { database } from "agenda/dist/agenda/database";
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
  "miner-mode": number;
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
        "miner-mode": parseInt(minerConfig["bitmain-work-mode"]),
        pools: pools,
      };
    });
  };
}

function updateMinerConfig(
  switchPoolParams: SwitchPoolParams
): (poolConfig: PoolConfigInfo) => Promise<any> {
  return async (poolConfig: PoolConfigInfo) => {
    const data = buildNewMinerConfig(switchPoolParams, poolConfig);
    logger.info(
      `Data passed for Bitmain update req: \n${JSON.stringify(data)}`
    );
    return await ANTMINER_DIGESTAUTH.request({
      headers: { Accept: "application/json" },
      method: "POST",
      url: `http://${switchPoolParams.ipAddress}/cgi-bin/set_miner_conf.cgi`,
      data: data,
    });
  };
}

function verifyLivePoolStatus(
  switchPoolParams: SwitchPoolParams
): () => Promise<any> {
  return async () => {
    return await ANTMINER_DIGESTAUTH.request({
      headers: { Accept: "application/json" },
      method: "GET",
      url: `http://${switchPoolParams.ipAddress}/cgi-bin/pools.cgi`,
    }).then((resp: any) => {
      const currentPoolInfo = resp.data["POOLS"][0];
      if (
        !(
          currentPoolInfo.url == switchPoolParams.pool.url &&
          currentPoolInfo.user == switchPoolParams.pool.username &&
          currentPoolInfo.status == "Alive" &&
          currentPoolInfo.priority == 0
        )
      ) {
        const errorMsg = `Bitmain miner pool update has not taken effect.
        Please check miner: ${JSON.stringify(switchPoolParams)}`;
        logger.error(errorMsg);
        throw Error(errorMsg);
      }
    });
  };
}

async function rebootMiner(switchPoolParams: SwitchPoolParams) {
  return await ANTMINER_DIGESTAUTH.request({
    headers: { Accept: "application/json" },
    method: "GET",
    url: `http://${switchPoolParams.ipAddress}/cgi-bin/reboot.cgi`,
  });
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
  params: SwitchPoolParams,
  retries: number = 3
): Promise<any> {
  return await getSytemInfo(params.ipAddress)
    .then(verifyMinerIsForClient(params))
    .then(getMinerConfig(params))
    .then(updateMinerConfig(params))
    .then(() => waitInMilliseconds(300000)) // 300 seconds = 5 minutes
    .then(verifyLivePoolStatus(params))
    .catch((e) => {
      const remainingTries = retries - 1;
      if (remainingTries <= 0) {
        throw e;
      }

      logger.error(
        `Error occurred while attempting to switch Antminer's Pool: ${params}.
        Error msg: ${e}.
        Will reboot the miner and try again.`
      );

      return rebootMiner(params)
        .then(() => waitInMilliseconds(300000)) // 300 seconds = 5 minutes
        .then(() => switchAntminerPool(params, remainingTries));
    });
}

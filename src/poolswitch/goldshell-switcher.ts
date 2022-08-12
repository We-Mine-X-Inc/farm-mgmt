const axios = require("axios").default;
import { SwitchPoolParams } from "./common-types";

const GOLDSHELL_DEFAULTS = {
  POOL_PWD: "123",
  MINER_USERNAME: "admin",
  MINER_PWD: "123456789",
};

type SessionInfo = {
  ipAddress: string;
  authToken: string;
};

type GoldshellMinerPoolInfo = {
  url: string;
  active: boolean;
  dragid: number;
  user: string;
  "pool-priority": number;
  pass: string;
  legal: boolean;
};

type PoolValidationInfo = {
  sessionInfo: SessionInfo;
  macAddress: string;
};

type MinerValidator = (param: PoolValidationInfo) => SessionInfo;

type ApplyPoolSwitchInfo = {
  sessionInfo: SessionInfo;
  pools: GoldshellMinerPoolInfo[];
};

async function loginToMiner(ipAddress: string): Promise<SessionInfo> {
  return await axios({
    method: "get",
    url: `http://${ipAddress}/user/login?username=${GOLDSHELL_DEFAULTS.MINER_USERNAME}&password=${GOLDSHELL_DEFAULTS.MINER_PWD}`,
  }).then((res: any) => {
    return { ipAddress: ipAddress, authToken: res.data["JWT Token"] };
  });
}

async function getSettings(
  sessionInfo: SessionInfo
): Promise<PoolValidationInfo> {
  return await axios({
    method: "get",
    url: `http://${sessionInfo.ipAddress}/mcb/setting`,
    headers: {
      Authorization: `Bearer ${sessionInfo.authToken}`,
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  }).then((res) => {
    return {
      sessionInfo: sessionInfo,
      macAddress: res.data.name,
    };
  });
}

function verifyMinerIsForClient(params: SwitchPoolParams): MinerValidator {
  return (validationInfo: PoolValidationInfo) => {
    if (validationInfo.macAddress != params.macAddress) {
      throw Error("Miner mismatch. The MAC does not match the expected IP.");
    }
    return validationInfo.sessionInfo;
  };
}

async function getPools(
  sessionInfo: SessionInfo
): Promise<ApplyPoolSwitchInfo> {
  return await axios({
    method: "get",
    url: `http://${sessionInfo.ipAddress}/mcb/pools`,
    headers: {
      Authorization: `Bearer ${sessionInfo.authToken}`,
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  }).then((res) => {
    return {
      sessionInfo: sessionInfo,
      pools: res.data,
    };
  });
}

async function deletePools(
  poolSwitchInfo: ApplyPoolSwitchInfo
): Promise<SessionInfo> {
  const sessionInfo = poolSwitchInfo.sessionInfo;
  if (poolSwitchInfo.pools.length <= 0) {
    return new Promise((resolve) => {
      resolve(sessionInfo);
    });
  }
  return Promise.all(
    poolSwitchInfo.pools.map((pool) => {
      return axios({
        method: "put",
        url: `http://${sessionInfo.ipAddress}/mcb/delpool`,
        headers: {
          Authorization: `Bearer ${sessionInfo.authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        data: pool,
      });
    })
  ).then(() => {
    return sessionInfo;
  });
}

function addPool(switchPoolInfo: SwitchPoolParams) {
  return async (sessionInfo: SessionInfo) => {
    return await axios({
      method: "put",
      url: `http://${sessionInfo.ipAddress}/mcb/newpool`,
      headers: {
        Authorization: `Bearer ${sessionInfo.authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Connection: "keep-alive",
      },
      data: buildNewPool(switchPoolInfo),
    });
  };
}

function buildNewPool(
  switchPoolInfo: SwitchPoolParams
): GoldshellMinerPoolInfo {
  return {
    legal: true,
    url: switchPoolInfo.pool.url,
    user: switchPoolInfo.pool.username,
    pass: GOLDSHELL_DEFAULTS.POOL_PWD,
    dragid: 0,
    active: false,
    "pool-priority": 0,
  };
}

export async function switchGoldshellPool(
  params: SwitchPoolParams
): Promise<any> {
  return await loginToMiner(params.ipAddress)
    .then(getSettings)
    .then(verifyMinerIsForClient(params))
    .then(getPools)
    .then(deletePools)
    .then(addPool(params));
}

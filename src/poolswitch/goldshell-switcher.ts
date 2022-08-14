const axios = require("axios").default;
import { logger } from "@/utils/logger";
import { waitInMilliseconds } from "@/utils/timer";
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

function addPool(switchPoolParams: SwitchPoolParams) {
  return async (sessionInfo: SessionInfo): Promise<SessionInfo> => {
    const data = buildNewPool(switchPoolParams);
    logger.info(
      `Data passed for Goldshell update req: \n${JSON.stringify(data)}`
    );
    return await axios({
      method: "put",
      url: `http://${sessionInfo.ipAddress}/mcb/newpool`,
      headers: {
        Authorization: `Bearer ${sessionInfo.authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Connection: "keep-alive",
      },
      data: buildNewPool(switchPoolParams),
    }).then(() => {
      return sessionInfo;
    });
  };
}

function verifyLivePoolStatus(switchPoolParams: SwitchPoolParams) {
  return async (sessionInfo: SessionInfo) => {
    return await axios({
      method: "get",
      url: `http://${sessionInfo.ipAddress}/mcb/pools`,
      headers: {
        Authorization: `Bearer ${sessionInfo.authToken}`,
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
    }).then((res) => {
      const currentPoolInfo = res.data[0];
      if (
        !(
          currentPoolInfo.url == switchPoolParams.pool.url &&
          currentPoolInfo.user == switchPoolParams.pool.username &&
          currentPoolInfo.active &&
          currentPoolInfo["pool-priority"] == 0
        )
      ) {
        const errorMsg = `Goldshell miner pool update has not taken effect.
        Please check miner: ${JSON.stringify(switchPoolParams)}`;
        logger.error(errorMsg);
        throw Error(errorMsg);
      }
    });
  };
}

function buildNewPool(
  switchPoolParams: SwitchPoolParams
): GoldshellMinerPoolInfo {
  return {
    legal: true,
    url: switchPoolParams.pool.url,
    user: switchPoolParams.pool.username,
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
    .then(addPool(params))
    .then(waitInMilliseconds(5000)) // 5 seconds
    .then(verifyLivePoolStatus(params));
}

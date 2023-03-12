const axios = require("axios").default;
import { format as prettyFormat } from "pretty-format";
import {
  SLACK_POOL_SWITCHING_INFO_URL,
  SLACK_POOL_SWITCHING_ERROR_URL,
} from "@/config";
import { VerifyOperationsParams } from "@/poolswitch/common-types";
import { Miner } from "@/interfaces/miner.interface";

export function sendSuccessfulSwitchEmail(
  verifyPoolParams: VerifyOperationsParams
) {
  const text = `
    Successfully Switched to Pool
    
    The server was able to successfully switch for params: ${prettyFormat(
      verifyPoolParams
    )}.`;

  sendInfo(text);
}

export function sendFailureSwitchEmail({
  verifyPoolParams,
  error,
}: {
  verifyPoolParams: VerifyOperationsParams;
  error: string;
}) {
  const text = `
    Failed to Switch to Pool

    The server was unable to switch the pool for params: ${prettyFormat(
      verifyPoolParams
    )}.
      
    ${error}`;

  sendError(text);
}

export function sendMinerOnlineNotification(miner: Miner) {
  const text = `
    Miner Is Now Online
    
    The following miner came online:
    ${prettyFormat(miner)}.`;

  sendInfo(text);
}

export function sendMinerOfflineNotification(miner: Miner) {
  const text = `
    Miner Is Now Offline
    
    The following miner went offline:
    ${prettyFormat(miner)}.`;

  sendError(text);
}

function sendInfo(text) {
  sendNotification({ url: SLACK_POOL_SWITCHING_INFO_URL, text });
}

function sendError(text) {
  sendNotification({ url: SLACK_POOL_SWITCHING_ERROR_URL, text });
}

function sendNotification(params: { url: string; text: string }) {
  axios({
    method: "post",
    url: params.url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: { text: params.text },
  });
}

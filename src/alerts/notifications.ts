const axios = require("axios").default;
import {
  SLACK_POOL_SWITCHING_INFO_URL,
  SLACK_POOL_SWITCHING_ERROR_URL,
} from "@/config";
import { SwitchPoolParams } from "@/poolswitch/common-types";

export function sendSuccessfulSwitchEmail(params: {
  switchParams: SwitchPoolParams;
}) {
  const text = `
    Successfully Switched to Pool
    
    The server was able to successfully switch for params: ${JSON.stringify(
      params.switchParams
    )}.`;

  sendInfo(text);
}

export function sendFailureSwitchEmail(params: {
  switchParams: SwitchPoolParams;
  error: string;
}) {
  const text = `
    Failed to Switch to Pool

    The server was unable to switch the pool for params: ${JSON.stringify(
      params.switchParams
    )}.
      
    ${params.error}`;

  sendError(text);
}

export function sendResumeSwitchEmail(params: { jobInfo: any; jobData: any }) {
  const text = `
    Successfully Resumed Mining
    
    The server has resumed mining of the following job: ${JSON.stringify(
      params.jobInfo
    )} with the following new info: ${JSON.stringify(params.jobData)}.`;

  sendInfo(text);
}

export function sendFailureToRemoveInterruptedJob(e: string) {
  const text = `
    Failed to Remove Obsolete Interrupted Job

    The server was unable to garbage collect the obsolete interrupted
    job due to the following error:
    
    ${e}.`;

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

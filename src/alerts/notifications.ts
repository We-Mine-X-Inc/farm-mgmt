import { EMAIL_DOMAIN, NOTIFICATION_EMAIL_RECIPIENTS } from "@/config";
import { SwitchPoolParams } from "@/poolswitch/common-types";
import getTransporter from "./mailer";

export function sendSuccessfulSwitchEmail(params: {
  switchParams: SwitchPoolParams;
}) {
  getTransporter().sendMail({
    to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
    subject: `Successfully Switched to Pool`,
    text: `The server was able to successfully switch for params: ${JSON.stringify(
      params.switchParams
    )}.`,
  });
}

export function sendFailureSwitchEmail(params: {
  switchParams: SwitchPoolParams;
  error: string;
}) {
  getTransporter().sendMail({
    to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
    subject: `Failed to Switch to Pool`,
    text: `The server was unable to switch the pool for params: ${JSON.stringify(
      params.switchParams
    )}.\n ${params.error}`,
  });
}

export function sendResumeSwitchEmail(params: {
  jobInfo: any;
  updatedJobData: any;
}) {
  getTransporter().sendMail({
    to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
    subject: `Successfully Resumed Mining`,
    text: `The server has resumed mining of the following job: ${JSON.stringify(
      params.jobInfo
    )} with the following new info: ${JSON.stringify(params.updatedJobData)}.`,
  });
}

export function sendFailureToRemoveInterruptedJob(e: string) {
  getTransporter().sendMail({
    to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
    subject: `Failed to Remove Obsolete Interrupted Job`,
    text: `The server was unable to garbage collect the obsolete interrupted
    job due to the following error: ${e}.`,
  });
}

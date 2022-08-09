import { EMAIL_DOMAIN, NOTIFICATION_EMAIL_RECIPIENTS } from "@/config";
import { SwitchPoolParams } from "@/poolswitch/common-types";
import getTransporter from "./mailer";

export function sendSuccessfulSwitchEmail(params: {
  toClient: boolean;
  switchParams: SwitchPoolParams;
}) {
  //   const poolType = params.toClient ? "Client" : "Company";
  //   getTransporter().sendMail({
  //     to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
  //     subject: `Successfully Switched to ${poolType} Pool`,
  //     text: `The server was able to successfully switch for params: ${JSON.stringify(
  //       params.switchParams
  //     )}.`,
  //   });
}

export function sendFailureSwitchEmail(params: {
  toClient: boolean;
  switchParams: SwitchPoolParams;
  error: any;
}) {
  //   const poolType = params.toClient ? "Client" : "Company";
  //   getTransporter().sendMail({
  //     to: NOTIFICATION_EMAIL_RECIPIENTS + EMAIL_DOMAIN,
  //     subject: `Failed to Switch to ${poolType} Pool`,
  //     text: `The server was unable to switch the pool for params: ${JSON.stringify(
  //       params.switchParams
  //     )}.\n ${params.error}`,
  //   });
}

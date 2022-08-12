import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
  SLACK_POOL_SWITCHING_INFO_URL,
  SLACK_POOL_SWITCHING_ERROR_URL,
} = process.env;

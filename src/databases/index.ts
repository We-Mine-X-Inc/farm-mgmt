import { DB_HOST, DB_DATABASE, DB_PASSWORD, DB_CLUSTER } from "@config";

export const dbConnection = {
  url: `mongodb+srv://${DB_HOST}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_DATABASE}`,
};

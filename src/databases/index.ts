import {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_IS_SRV,
  DB_PASSWORD,
  DB_CLUSTER,
} from "@config";

export const dbConnection = {
  // url: `mongodb${DB_IS_SRV ? '+srv' : ''}://${DB_HOST}:${DB_PORT? DB_PORT:DB_PASSWORD}${DB_CLUSTER ? '@' + DB_CLUSTER:''}/${DB_DATABASE}`,
  url: `  mongodb+srv://dev:eZ0.hQ5%2BhJ8_aE8%40@cluster0.j6vfjac.mongodb.net`,
};

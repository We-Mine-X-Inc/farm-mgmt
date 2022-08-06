import App from "@/app";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import PoolSwitchRoute from "./routes/pool-switch.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new PoolSwitchRoute(),
]);

app.listen();

import App from "@/app";
import IndexRoute from "@routes/index.route";
import CustomersRoute from "@/routes/customer.route";
import validateEnv from "@utils/validateEnv";
import PoolSwitchRoute from "./routes/pool-switch.route";
import CoinMarketInfosRoute from "./routes/coin-market-info.route";
import FacilityInfosRoute from "./routes/facility-info.route";
import InventoryItemsRoute from "./routes/inventory-item.route";
import MgmtAccountsRoute from "./routes/mgmt-account.route";
import MinerMarketInfosRoute from "./routes/miner-market-info.route";
import PoolsRoute from "./routes/pool.route";
import SupplierQuotesRoute from "./routes/supplier-quote.route";
import FacilitySetupRoute from "./routes/facility-setup.route";
import MinersRoute from "./routes/miner.route";

validateEnv();

const app = new App([
  new CoinMarketInfosRoute(),
  new CustomersRoute(),
  new FacilityInfosRoute(),
  new FacilitySetupRoute(),
  new IndexRoute(),
  new InventoryItemsRoute(),
  new MgmtAccountsRoute(),
  new MinerMarketInfosRoute(),
  new MinersRoute(),
  new PoolSwitchRoute(),
  new PoolsRoute(),
  new SupplierQuotesRoute(),
]);

app.listen();

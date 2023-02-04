import { Types } from "mongoose";

export type FacilityInfo = {
  _id: Types.ObjectId;
  name: string;
  address: string;
  estPowerUsageInKiloWatts: number;
  estPowerCapacityInKiloWatts: number;
  estPowerCostInMicros: number; // $0.06 => 600
  farenheitTemp: number;
  isAutoManaged: boolean;
};

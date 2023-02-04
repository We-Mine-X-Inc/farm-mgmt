import { model, Schema, Document } from "mongoose";
import { FacilityInfo } from "@/interfaces/facility-info.interface";

const facilityInfoSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: Number,
    required: true,
  },
  estPowerUsageInKiloWatts: {
    type: Number,
    required: true,
  },
  estPowerCapacityInKiloWatts: {
    type: Number,
    required: true,
  },
  estPowerCostInMicros: {
    type: Number,
    required: true,
  },
  farenheitTemp: {
    type: Number,
    required: true,
  },
  isAutoManaged: {
    type: Boolean,
    required: true,
  },
});

const facilityInfoModel = model<FacilityInfo & Document>(
  "FacilityInfo",
  facilityInfoSchema
);

export default facilityInfoModel;

import { HashRateUnitType } from "@/interfaces/performance/hash-rate.interface";

export const HashRateSchema = {
  unit: { type: Number, enum: HashRateUnitType },
  quantity: { type: Number },
};

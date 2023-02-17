export enum HashRateUnitType {
  UNKNOWN = 0,
  GIGA_PER_SEC = 1,
  TERA_PER_SEC = 2,
}

export type HashRate = {
  unit: HashRateUnitType;
  quantity: number;
};

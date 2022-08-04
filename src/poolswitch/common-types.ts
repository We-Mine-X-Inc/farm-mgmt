type MinMinerPoolInfo = {
  url: string;
  user: string;
};

export type SwitchPoolParamsWithoutCompanyPool = {
  ipAddress: string;
  macAddress: string;
  clientPool: MinMinerPoolInfo;
  toClientPool: boolean;
};

export type SwitchPoolParams = {
  ipAddress: string;
  macAddress: string;
  clientPool: MinMinerPoolInfo;
  toClientPool: boolean;
  companyPool: MinMinerPoolInfo;
};

type MinMinerPoolInfo = {
  url: string;
  username: string;
};

export type SwitchPoolParams = {
  ipAddress: string;
  macAddress: string;
  pool: MinMinerPoolInfo;
};

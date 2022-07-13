export interface MiningBatchInfo {
    _id: String;
    remainingTime: Number;
    startTimes: [Date];
    interruptTimes: [Date];
    batchId: String;
    miningContract: {clientMiningTime: Number};
    clientPool: {};
    companyPool: {};
    minerAPI: {};
    clientMAC: String;
  }
  
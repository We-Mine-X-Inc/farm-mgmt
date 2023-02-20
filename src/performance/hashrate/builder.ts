import { HashRate } from "@/interfaces/performance/hash-rate.interface";

export function buildInitialWorkerContributions() {
  return {
    clientWorkers: {},
    companyWorkers: {},
  };
}

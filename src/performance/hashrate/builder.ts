import { HashRate } from "@/interfaces/performance/hash-rate.interface";

export function buildInitialWorkerContributions() {
  return {
    clientWorkers: new Map<string, HashRate>(),
    companyWorkers: new Map<string, HashRate>(),
  };
}

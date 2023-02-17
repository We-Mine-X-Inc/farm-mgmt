import { logger } from "@/utils/logger";

export function jobErrorCatcher(jobFunc: (...args) => Promise<any>) {
  return async (...params) => {
    try {
      await jobFunc(...params);
    } catch (error) {
      logger.error(error);
    }
  };
}

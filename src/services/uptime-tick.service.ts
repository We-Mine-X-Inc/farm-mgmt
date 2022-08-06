import { CreateUptimeTickDto } from "@/dtos/uptime-tick.dto";
import { UptimeTick } from "@interfaces/uptime-tick.interface";
import uptimeTickModel from "@models/uptime-tick.model";
import { isEmpty } from "@utils/util";

class UptimeTickService {
  public uptimeTicks = uptimeTickModel;

  public async findAllTicks(): Promise<UptimeTick[]> {
    return await this.uptimeTicks.find();
  }

  public async findMostRecentTick(): Promise<UptimeTick> {
    return await this.uptimeTicks.findOne().sort({ datetime: -1 });
  }

  public async createUptimeTick(
    uptimeTickData: CreateUptimeTickDto
  ): Promise<UptimeTick> {
    // Make more graceful by logging this error and configuring a corresponding alert.
    if (isEmpty(uptimeTickData)) throw new Error("Requires uptick data.");

    return await this.uptimeTicks.create({ ...uptimeTickData });
  }

  public async deleteAll(thresholdDate: Date): Promise<Number> {
    const deletionOutcome: any = await this.uptimeTicks.deleteMany({
      datetime: { $lte: thresholdDate },
    });

    return deletionOutcome.deletedCount;
  }
}

export default UptimeTickService;

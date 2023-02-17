import { CreateMinerDto } from "@/dtos/miner.dto";
import { HttpException } from "@exceptions/HttpException";
import { Miner, MINER_FILEDS_TO_POPULATE } from "@/interfaces/miner.interface";
import minerModel from "@/models/miner.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class MinerService {
  public miners = minerModel;

  public async findAllMiners(): Promise<Miner[]> {
    const miners: Miner[] = await this.miners
      .find()
      .populate(MINER_FILEDS_TO_POPULATE);
    return miners;
  }

  public async findMinerByFriendlyId(friendlyMinerId: string): Promise<Miner> {
    if (isEmpty(friendlyMinerId))
      throw new HttpException(400, "You're not a friendlyMinerId");

    const findMiner: Miner = await this.miners
      .findOne({ friendlyMinerId })
      .populate(MINER_FILEDS_TO_POPULATE);

    if (!findMiner) throw new HttpException(409, "You're not miner");

    return findMiner;
  }

  public async findMinerById(minerId: Types.ObjectId): Promise<Miner> {
    if (isEmpty(minerId.id)) throw new HttpException(400, "You're not minerId");

    const findMiner: Miner = await this.miners
      .findOne({ _id: minerId })
      .populate(MINER_FILEDS_TO_POPULATE);

    if (!findMiner) throw new HttpException(409, "You're not miner");

    return findMiner;
  }

  public async createMiner(minerData: CreateMinerDto): Promise<Miner> {
    if (isEmpty(minerData))
      throw new HttpException(400, "You're not minerData");

    const findMiner: Miner = await this.miners.findOne({
      macAddress: minerData.macAddress,
    });
    if (findMiner)
      throw new HttpException(
        409,
        `You're MAC Address ${minerData.macAddress} already exists`
      );

    const createMinerData: Miner = await this.miners.create({ ...minerData });

    return createMinerData;
  }

  public async updateMiner(
    minerId: Types.ObjectId,
    minerData: CreateMinerDto
  ): Promise<Miner> {
    if (isEmpty(minerData))
      throw new HttpException(400, "You're not minerData");

    if (minerData.macAddress) {
      const findMiner: Miner = await this.miners.findOne({
        macAddress: minerData.macAddress,
      });
      if (findMiner && !findMiner._id.equals(minerId))
        throw new HttpException(
          409,
          `You're MAC Address ${minerData.macAddress} already exists.`
        );
    }

    const updateMinerById: Miner = await this.miners.findByIdAndUpdate(
      minerId,
      { ...minerData }
    );
    if (!updateMinerById) throw new HttpException(409, "You're not miner.");

    return updateMinerById;
  }

  public async deleteMiner(minerId: Types.ObjectId): Promise<Miner> {
    const deleteMinerById: Miner = await this.miners.findByIdAndDelete(minerId);
    if (!deleteMinerById) throw new HttpException(409, "You're not miner.");

    return deleteMinerById;
  }
}

export default MinerService;

import { CreateMinerDto } from "@dtos/miners.dto";
import { HttpException } from "@exceptions/HttpException";
import { Miner } from "@interfaces/miners.interface";
import minerModel from "@models/miners.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

class MinerService {
  public miners = minerModel;

  public async findAllMiners(): Promise<Miner[]> {
    const miners: Miner[] = await this.miners.find().lean();
    return miners;
  }

  public async findMinerById(minerId: Types.ObjectId): Promise<Miner> {
    if (isEmpty(minerId)) throw new HttpException(400, "You're not minerId");

    const findMiner: Miner = await this.miners.findOne({ _id: minerId });
    if (!findMiner) throw new HttpException(409, "You're not user");

    return findMiner;
  }

  public async createMiner(minerData: CreateMinerDto): Promise<Miner> {
    if (isEmpty(minerData))
      throw new HttpException(400, "You're not minerData");

    const findMiner: Miner = await this.miners.findOne({ mac: minerData.mac });
    if (findMiner)
      throw new HttpException(
        409,
        `You're MAC Address ${minerData.mac} already exists`
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

    if (minerData.mac) {
      const findMiner: Miner = await this.miners.findOne({
        mac: minerData.mac,
      });
      if (findMiner && !findMiner._id.equals(minerId))
        throw new HttpException(
          409,
          `You're MAC Address ${minerData.mac} already exists`
        );
    }

    const updateMinerById: Miner = await this.miners.findByIdAndUpdate(
      minerId,
      { ...minerData }
    );
    if (!updateMinerById) throw new HttpException(409, "You're not miner");

    return updateMinerById;
  }

  public async deleteMiner(minerId: Types.ObjectId): Promise<Miner> {
    const deleteMinerById: Miner = await this.miners.findByIdAndDelete(minerId);
    if (!deleteMinerById) throw new HttpException(409, "You're not user");

    return deleteMinerById;
  }
}

export default MinerService;

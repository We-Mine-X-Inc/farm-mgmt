import { CreatePoolDto } from "@/dtos/pool.dto";
import { HttpException } from "@exceptions/HttpException";
import { POOL_FIELDS_TO_POPULATE, Pool } from "@/interfaces/pool.interface";
import poolModel from "@/models/pool.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class PoolService {
  public pools = poolModel;

  public async findAllPools(): Promise<Pool[]> {
    const pools: Pool[] = await this.pools
      .find()
      .populate(POOL_FIELDS_TO_POPULATE);
    return pools;
  }

  public async findPoolById(poolId: Types.ObjectId): Promise<Pool> {
    if (isEmpty(poolId)) throw new HttpException(400, "You're not poolId");

    const findPool = await this.pools
      .findOne({ _id: poolId })
      .populate(POOL_FIELDS_TO_POPULATE);
    if (!findPool) throw new HttpException(409, "You're not pool");

    return findPool;
  }

  public async createPool(poolData: CreatePoolDto): Promise<Pool> {
    if (isEmpty(poolData)) throw new HttpException(400, "You're not poolData");

    const findPool: Pool = await this.pools.findOne({
      ...poolData,
    });
    if (findPool)
      throw new HttpException(
        409,
        `Duplicate pool not permitted: ${poolData}. `
      );

    const createPoolData: Pool = await this.pools.create({ ...poolData });

    return createPoolData;
  }

  public async deletePool(poolId: Types.ObjectId): Promise<Pool> {
    const deletePoolById: Pool = await this.pools.findByIdAndDelete(poolId);
    if (!deletePoolById) throw new HttpException(409, "You're not pool");

    return deletePoolById;
  }
}

export default PoolService;

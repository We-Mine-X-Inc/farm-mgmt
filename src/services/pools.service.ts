import { CreatePoolDto } from "@dtos/pools.dto";
import { HttpException } from "@exceptions/HttpException";
import { Pool, PoolPurposeType } from "@interfaces/pools.interface";
import poolModel from "@models/pools.model";
import { isEmpty } from "@utils/util";

type RobustFindParams = {
  minerId: string;
  purpose: PoolPurposeType;
};

class PoolService {
  public pools = poolModel;

  public async findAllPools(): Promise<Pool[]> {
    const pools: Pool[] = await this.pools.find();
    return pools;
  }

  public async findPoolById(poolId: string): Promise<Pool> {
    if (isEmpty(poolId)) throw new HttpException(400, "You're not poolId");

    const findPool: Pool = await this.pools.findOne({ _id: poolId });
    if (!findPool) throw new HttpException(409, "You're not pool");

    return findPool;
  }

  public async findPool(params: RobustFindParams): Promise<Pool> {
    if (isEmpty(params)) throw new HttpException(400, "You're not minerId");

    const findPool: Pool = await this.pools.findOne(params);
    if (!findPool) throw new HttpException(409, "You're not pool");

    return findPool;
  }

  public async createPool(poolData: CreatePoolDto): Promise<Pool> {
    if (isEmpty(poolData)) throw new HttpException(400, "You're not poolData");

    const findPool: Pool = await this.pools.findOne({
      minerId: poolData.minerId,
      purpose: poolData.purpose,
    });
    if (findPool)
      throw new HttpException(
        409,
        `A pool for the miner ${poolData.minerId} already exists. Multiple pools not yet suppoerted.`
      );

    const createPoolData: Pool = await this.pools.create({ ...poolData });

    return createPoolData;
  }

  public async updatePool(
    poolId: string,
    poolData: CreatePoolDto
  ): Promise<Pool> {
    if (isEmpty(poolData)) throw new HttpException(400, "You're not poolData");

    if (poolData.minerId) {
      const findPool: Pool = await this.pools.findOne({
        minerId: poolData.minerId,
        purpose: poolData.purpose,
      });
      if (findPool && findPool._id != poolId)
        throw new HttpException(
          409,
          `You specified the wrong miner ${poolData.minerId} and purpose ${poolData.purpose} for pool updates.`
        );
    }

    const updatePoolById: Pool = await this.pools.findByIdAndUpdate(poolId, {
      ...poolData,
    });
    if (!updatePoolById) throw new HttpException(409, "You're not pool");

    return updatePoolById;
  }

  public async deletePool(poolId: string): Promise<Pool> {
    const deletePoolById: Pool = await this.pools.findByIdAndDelete(poolId);
    if (!deletePoolById) throw new HttpException(409, "You're not pool");

    return deletePoolById;
  }
}

export default PoolService;

import { CreateMinerMarketInfoDto } from "@/dtos/miner-market-info.dto";
import { HttpException } from "@exceptions/HttpException";
import { MinerMarketInfo } from "@/interfaces/miner-market-info.interface";
import minerMarketInfoModel from "@/models/miner-market-info.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class MinerMarketInfoService {
  public minerMarketInfos = minerMarketInfoModel;

  public async findAllMinerMarketInfos(): Promise<MinerMarketInfo[]> {
    const minerMarketInfos: MinerMarketInfo[] = await this.minerMarketInfos
      .find()
      .lean();
    return minerMarketInfos;
  }

  public async findMinerMarketInfoById(
    minerMarketInfoId: Types.ObjectId
  ): Promise<MinerMarketInfo> {
    if (isEmpty(minerMarketInfoId._id.id))
      throw new HttpException(400, "You're not minerMarketInfoId");

    const findMinerMarketInfo: MinerMarketInfo =
      await this.minerMarketInfos.findOne({
        _id: minerMarketInfoId,
      });
    if (!findMinerMarketInfo)
      throw new HttpException(409, "You're not minerMarketInfo");

    return findMinerMarketInfo;
  }

  public async createMinerMarketInfo(
    minerMarketInfoData: CreateMinerMarketInfoDto
  ): Promise<MinerMarketInfo> {
    if (isEmpty(minerMarketInfoData))
      throw new HttpException(400, "You're not minerMarketInfoData");

    const findMinerMarketInfo: MinerMarketInfo =
      await this.minerMarketInfos.findOne({
        coinType: minerMarketInfoData.coinType,
        minerInventoryItem: minerMarketInfoData.minerInventoryItem,
      });
    if (findMinerMarketInfo)
      throw new HttpException(
        409,
        `A minerMarketInfo for the info ${prettyFormat(minerMarketInfoData)}
        already exists.`
      );

    const createMinerMarketInfoData: MinerMarketInfo =
      await this.minerMarketInfos.create({
        ...minerMarketInfoData,
      });

    return createMinerMarketInfoData;
  }

  public async updateMinerMarketInfo(
    minerMarketInfoId: Types.ObjectId,
    minerMarketInfoData: CreateMinerMarketInfoDto
  ): Promise<MinerMarketInfo> {
    if (isEmpty(minerMarketInfoData))
      throw new HttpException(400, "You're not minerMarketInfoData");

    if (
      minerMarketInfoData.coinType &&
      minerMarketInfoData.minerInventoryItem
    ) {
      const findMinerMarketInfo: MinerMarketInfo =
        await this.minerMarketInfos.findOne({
          coinType: minerMarketInfoData.coinType,
          minerInventoryItem: minerMarketInfoData.minerInventoryItem,
        });
      if (
        findMinerMarketInfo &&
        !findMinerMarketInfo._id.equals(minerMarketInfoId)
      )
        throw new HttpException(
          409,
          `You change the CoinType or ItemId of an existing MinerMarketInfo object. Please create
          a new object if you want a different CoinType + InventoryItem pair.`
        );
    }

    const updateMinerMarketInfoById: MinerMarketInfo =
      await this.minerMarketInfos.findByIdAndUpdate(minerMarketInfoId, {
        ...minerMarketInfoData,
      });
    if (!updateMinerMarketInfoById) {
      throw new HttpException(409, "You're not minerMarketInfo");
    }

    return updateMinerMarketInfoById;
  }

  public async deleteMinerMarketInfo(
    minerMarketInfoId: Types.ObjectId
  ): Promise<MinerMarketInfo> {
    const deleteMinerMarketInfoById: MinerMarketInfo =
      await this.minerMarketInfos.findByIdAndDelete(minerMarketInfoId);
    if (!deleteMinerMarketInfoById) {
      throw new HttpException(409, "You're not minerMarketInfo");
    }

    return deleteMinerMarketInfoById;
  }
}

export default MinerMarketInfoService;

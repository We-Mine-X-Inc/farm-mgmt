import { CreateCoinMarketInfoDto } from "@/dtos/coin-market-info.dto";
import { HttpException } from "@exceptions/HttpException";
import { CoinMarketInfo } from "@/interfaces/coin-market-info.interface";
import coinMarketInfoModel from "@/models/coin-market-info.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class CoinMarketInfoService {
  public coinMarketInfos = coinMarketInfoModel;

  public async findAllCoinMarketInfos(): Promise<CoinMarketInfo[]> {
    const coinMarketInfos: CoinMarketInfo[] = await this.coinMarketInfos
      .find()
      .lean();
    return coinMarketInfos;
  }

  public async findCoinMarketInfoById(
    coinMarketInfoId: Types.ObjectId
  ): Promise<CoinMarketInfo> {
    if (isEmpty(coinMarketInfoId._id.id))
      throw new HttpException(400, "You're not coinMarketInfoId");

    const findCoinMarketInfo: CoinMarketInfo =
      await this.coinMarketInfos.findOne({
        _id: coinMarketInfoId,
      });
    if (!findCoinMarketInfo)
      throw new HttpException(409, "You're not coinMarketInfo");

    return findCoinMarketInfo;
  }

  public async createCoinMarketInfo(
    coinMarketInfoData: CreateCoinMarketInfoDto
  ): Promise<CoinMarketInfo> {
    if (isEmpty(coinMarketInfoData))
      throw new HttpException(400, "You're not coinMarketInfoData");

    const findCoinMarketInfo: CoinMarketInfo =
      await this.coinMarketInfos.findOne({
        coinType: coinMarketInfoData.coinType,
      });
    if (findCoinMarketInfo)
      throw new HttpException(
        409,
        `A coinMarketInfo for the coinType ${prettyFormat(
          coinMarketInfoData.coinType
        )}
        already exists.`
      );

    const createCoinMarketInfoData: CoinMarketInfo =
      await this.coinMarketInfos.create({
        ...coinMarketInfoData,
      });

    return createCoinMarketInfoData;
  }

  public async updateCoinMarketInfo(
    coinMarketInfoId: Types.ObjectId,
    coinMarketInfoData: CreateCoinMarketInfoDto
  ): Promise<CoinMarketInfo> {
    if (isEmpty(coinMarketInfoData))
      throw new HttpException(400, "You're not coinMarketInfoData");

    if (coinMarketInfoData.coinType) {
      const findCoinMarketInfo: CoinMarketInfo =
        await this.coinMarketInfos.findOne({
          coinType: coinMarketInfoData.coinType,
        });
      if (
        findCoinMarketInfo &&
        !findCoinMarketInfo._id.equals(coinMarketInfoId)
      )
        throw new HttpException(
          409,
          `You cannot update the coinType of an existing CoinMarketInfo. Create a new object
          if you want a different CoinType. `
        );
    }

    const updateCoinMarketInfoById: CoinMarketInfo =
      await this.coinMarketInfos.findByIdAndUpdate(coinMarketInfoId, {
        ...coinMarketInfoData,
      });
    if (!updateCoinMarketInfoById) {
      throw new HttpException(409, "You're not coinMarketInfo");
    }

    return updateCoinMarketInfoById;
  }

  public async deleteCoinMarketInfo(
    coinMarketInfoId: Types.ObjectId
  ): Promise<CoinMarketInfo> {
    const deleteCoinMarketInfoById: CoinMarketInfo =
      await this.coinMarketInfos.findByIdAndDelete(coinMarketInfoId);
    if (!deleteCoinMarketInfoById) {
      throw new HttpException(409, "You're not coinMarketInfo");
    }

    return deleteCoinMarketInfoById;
  }
}

export default CoinMarketInfoService;

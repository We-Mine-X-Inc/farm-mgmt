import { CreateFacilityInfoDto } from "@/dtos/facility-info.dto";
import { HttpException } from "@exceptions/HttpException";
import { FacilityInfo } from "@/interfaces/facility-info.interface";
import facilityInfoModel from "@/models/facility-info.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class FacilityInfoService {
  public facilityInfos = facilityInfoModel;

  public async findAllFacilityInfos(): Promise<FacilityInfo[]> {
    const facilityInfos: FacilityInfo[] = await this.facilityInfos
      .find()
      .lean();
    return facilityInfos;
  }

  public async findFacilityInfoById(
    facilityInfoId: Types.ObjectId
  ): Promise<FacilityInfo> {
    if (isEmpty(facilityInfoId._id.id))
      throw new HttpException(400, "You're not facilityInfoId");

    const findFacilityInfo: FacilityInfo = await this.facilityInfos.findOne({
      _id: facilityInfoId,
    });
    if (!findFacilityInfo)
      throw new HttpException(409, "You're not facilityInfo");

    return findFacilityInfo;
  }

  public async createFacilityInfo(
    facilityInfoData: CreateFacilityInfoDto
  ): Promise<FacilityInfo> {
    if (isEmpty(facilityInfoData))
      throw new HttpException(400, "You're not facilityInfoData");

    const findFacilityInfo: FacilityInfo = await this.facilityInfos.findOne({
      name: facilityInfoData.name,
    });
    if (findFacilityInfo)
      throw new HttpException(
        409,
        `A facilityInfo for the miner ${prettyFormat(facilityInfoData.name)}
        already exists.`
      );

    const createFacilityInfoData: FacilityInfo =
      await this.facilityInfos.create({
        ...facilityInfoData,
      });

    return createFacilityInfoData;
  }

  public async updateFacilityInfo(
    facilityInfoId: Types.ObjectId,
    facilityInfoData: CreateFacilityInfoDto
  ): Promise<FacilityInfo> {
    // if (isEmpty(facilityInfoData))
    //   throw new HttpException(400, "You're not facilityInfoData");

    if (facilityInfoData.name) {
      const findFacilityInfo: FacilityInfo = await this.facilityInfos.findOne({
        name: facilityInfoData.name,
      });
      if (findFacilityInfo && !findFacilityInfo._id.equals(facilityInfoId))
        throw new HttpException(
          409,
          `You cannot apply an existing facilityInfo to a miner. You must create
          a new facilityInfo with the name already set.`
        );
    }

    const updateFacilityInfoById: FacilityInfo =
      await this.facilityInfos.findByIdAndUpdate(facilityInfoId, {
        ...facilityInfoData,
        isAutoManaged: facilityInfoData.isAutoManaged == "on",
      });
    if (!updateFacilityInfoById) {
      throw new HttpException(409, "You're not facilityInfo");
    }

    return updateFacilityInfoById;
  }

  public async deleteFacilityInfo(
    facilityInfoId: Types.ObjectId
  ): Promise<FacilityInfo> {
    const deleteFacilityInfoById: FacilityInfo =
      await this.facilityInfos.findByIdAndDelete(facilityInfoId);
    if (!deleteFacilityInfoById) {
      throw new HttpException(409, "You're not facilityInfo");
    }

    return deleteFacilityInfoById;
  }
}

export default FacilityInfoService;

import { NextFunction, Request, Response } from "express";
import { CreateFacilityInfoDto } from "@/dtos/facility-info.dto";
import { FacilityInfo } from "@/interfaces/facility-info.interface";
import FacilityInfoService from "@services/facility-info.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for FacilityInfo API calls. This class/object is the first
 * code to be reached after routing.
 */
class FacilityInfosController {
  public facilityInfoService = new FacilityInfoService();

  public getFacilityInfos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllFacilityInfosData: FacilityInfo[] =
        await this.facilityInfoService.findAllFacilityInfos();

      res
        .status(200)
        .json({ data: findAllFacilityInfosData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getFacilityInfoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const facilityInfoId: string = req.params.id;
      const findOneFacilityInfoData: FacilityInfo =
        await this.facilityInfoService.findFacilityInfoById(
          new Types.ObjectId(facilityInfoId)
        );

      res
        .status(200)
        .json({ data: findOneFacilityInfoData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createFacilityInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const facilityInfoData: CreateFacilityInfoDto = req.body;
      const createFacilityInfoData: FacilityInfo =
        await this.facilityInfoService.createFacilityInfo(facilityInfoData);

      res
        .status(201)
        .json({ data: createFacilityInfoData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateFacilityInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("updating object with data");
      console.log(req.body);
      const facilityInfoId: string = req.params.id;
      const facilityInfoData: CreateFacilityInfoDto = req.body;
      const updateFacilityInfoData: FacilityInfo =
        await this.facilityInfoService.updateFacilityInfo(
          new Types.ObjectId(facilityInfoId),
          facilityInfoData
        );

      res
        .status(200)
        .json({ data: updateFacilityInfoData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteFacilityInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const facilityInfoId: string = req.params.id;
      const deleteFacilityInfoData: FacilityInfo =
        await this.facilityInfoService.deleteFacilityInfo(
          new Types.ObjectId(facilityInfoId)
        );

      res
        .status(200)
        .json({ data: deleteFacilityInfoData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default FacilityInfosController;

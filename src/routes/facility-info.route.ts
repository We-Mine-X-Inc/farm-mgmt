import { Router } from "express";
import FacilityInfosController from "@/controllers/facility-info.controller";
import { CreateFacilityInfoDto } from "@/dtos/facility-info.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class FacilityInfosRoute implements Routes {
  public path = "/facilityInfos";
  public router = Router();
  public facilityInfosController = new FacilityInfosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.facilityInfosController.getFacilityInfos
    );
    this.router.get(
      `${this.path}/:id`,
      this.facilityInfosController.getFacilityInfoById
    );
    this.router.post(
      `${this.path}/:id`,
      validationMiddleware(CreateFacilityInfoDto, "body", true),
      this.facilityInfosController.updateFacilityInfo
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateFacilityInfoDto, "body", true),
      this.facilityInfosController.updateFacilityInfo
    );
    this.router.delete(
      `${this.path}/:id`,
      this.facilityInfosController.deleteFacilityInfo
    );
  }
}

export default FacilityInfosRoute;

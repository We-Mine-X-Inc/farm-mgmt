import { NextFunction, Request, Response } from "express";
import {
  CreateContractDto,
  MutatableContractFields,
  UpdateContractDto,
} from "@/dtos/contract.dto";
import { Contract } from "@/interfaces/contract.interface";
import ContractService from "@services/contract.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for Contract API calls. This class/object is the first
 * code to be reached after routing.
 */
class ContractsController {
  public contractService = new ContractService();

  public getContracts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllContractsData: Contract[] =
        await this.contractService.findAllContracts();

      res.status(200).json({ data: findAllContractsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getContractById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contractId: string = req.params.id;
      const findOneContractData: Contract =
        await this.contractService.findContractById(
          new Types.ObjectId(contractId)
        );

      res.status(200).json({ data: findOneContractData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createContract = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contractData: CreateContractDto = req.body;
      const createContractData: Contract =
        await this.contractService.createContract(contractData);

      res.status(201).json({ data: createContractData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateContract = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contractId: string = req.params.id;
      const request: UpdateContractDto = req.body;
      const updateContractData: Contract =
        await this.contractService.updateContract(request);

      res.status(200).json({ data: updateContractData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteContract = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contractId: string = req.params.id;
      const deleteContractData: Contract =
        await this.contractService.deleteContract(
          new Types.ObjectId(contractId)
        );

      res.status(200).json({ data: deleteContractData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default ContractsController;

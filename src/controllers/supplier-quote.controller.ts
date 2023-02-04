import { NextFunction, Request, Response } from "express";
import { CreateSupplierQuoteDto } from "@/dtos/supplier-quote.dto";
import { SupplierQuote } from "@/interfaces/supplier-quote.interface";
import SupplierQuoteService from "@services/supplier-quote.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for SupplierQuote API calls. This class/object is the first
 * code to be reached after routing.
 */
class SupplierQuotesController {
  public supplierQuoteService = new SupplierQuoteService();

  public getSupplierQuotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllSupplierQuotesData: SupplierQuote[] =
        await this.supplierQuoteService.findAllSupplierQuotes();

      res
        .status(200)
        .json({ data: findAllSupplierQuotesData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getSupplierQuoteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierQuoteId: string = req.params.id;
      const findOneSupplierQuoteData: SupplierQuote =
        await this.supplierQuoteService.findSupplierQuoteById(
          new Types.ObjectId(supplierQuoteId)
        );

      res
        .status(200)
        .json({ data: findOneSupplierQuoteData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createSupplierQuote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierQuoteData: CreateSupplierQuoteDto = req.body;
      const createSupplierQuoteData: SupplierQuote =
        await this.supplierQuoteService.createSupplierQuote(supplierQuoteData);

      res
        .status(201)
        .json({ data: createSupplierQuoteData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateSupplierQuote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierQuoteId: string = req.params.id;
      const supplierQuoteData: CreateSupplierQuoteDto = req.body;
      const updateSupplierQuoteData: SupplierQuote =
        await this.supplierQuoteService.updateSupplierQuote(
          new Types.ObjectId(supplierQuoteId),
          supplierQuoteData
        );

      res
        .status(200)
        .json({ data: updateSupplierQuoteData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteSupplierQuote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierQuoteId: string = req.params.id;
      const deleteSupplierQuoteData: SupplierQuote =
        await this.supplierQuoteService.deleteSupplierQuote(
          new Types.ObjectId(supplierQuoteId)
        );

      res
        .status(200)
        .json({ data: deleteSupplierQuoteData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default SupplierQuotesController;

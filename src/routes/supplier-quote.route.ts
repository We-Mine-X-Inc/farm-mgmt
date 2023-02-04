import { Router } from "express";
import SupplierQuotesController from "@/controllers/supplier-quote.controller";
import { CreateSupplierQuoteDto } from "@/dtos/supplier-quote.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class SupplierQuotesRoute implements Routes {
  public path = "/supplierQuotes";
  public router = Router();
  public supplierQuotesController = new SupplierQuotesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.supplierQuotesController.getSupplierQuotes
    );
    this.router.get(
      `${this.path}/:id`,
      this.supplierQuotesController.getSupplierQuoteById
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateSupplierQuoteDto, "body"),
      this.supplierQuotesController.createSupplierQuote
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateSupplierQuoteDto, "body", true),
      this.supplierQuotesController.updateSupplierQuote
    );
    this.router.delete(
      `${this.path}/:id`,
      this.supplierQuotesController.deleteSupplierQuote
    );
  }
}

export default SupplierQuotesRoute;

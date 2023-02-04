import { NextFunction, Request, Response } from "express";
import { CreateCustomerDto } from "@/dtos/customer.dto";
import { Customer } from "@/interfaces/customer.interface";
import CustomerService from "@services/customer.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for Customer API calls. This class/object is the first
 * code to be reached after routing.
 */
class CustomersController {
  public customerService = new CustomerService();

  public getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllCustomersData: Customer[] =
        await this.customerService.findAllCustomer();

      res.status(200).json({ data: findAllCustomersData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId: string = req.params.id;
      const findOneCustomerData: Customer =
        await this.customerService.findCustomerById(
          new Types.ObjectId(customerId)
        );

      res.status(200).json({ data: findOneCustomerData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerData: CreateCustomerDto = req.body;
      const createCustomerData: Customer =
        await this.customerService.createCustomer(customerData);

      res.status(201).json({ data: createCustomerData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId: string = req.params.id;
      const customerData: CreateCustomerDto = req.body;
      const updateCustomerData: Customer =
        await this.customerService.updateCustomer(
          new Types.ObjectId(customerId),
          customerData
        );

      res.status(200).json({ data: updateCustomerData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId: string = req.params.id;
      const deleteCustomerData: Customer =
        await this.customerService.deleteCustomer(
          new Types.ObjectId(customerId)
        );

      res.status(200).json({ data: deleteCustomerData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default CustomersController;

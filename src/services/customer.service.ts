import { CreateCustomerDto } from "@/dtos/customer.dto";
import { HttpException } from "@exceptions/HttpException";
import { Customer } from "@/interfaces/customer.interface";
import customerModel from "@/models/customer.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class CustomerService {
  public customers = customerModel;

  public async findAllCustomer(): Promise<Customer[]> {
    const customers: Customer[] = await this.customers.find().lean();
    return customers;
  }

  public async findCustomerById(customerId: Types.ObjectId): Promise<Customer> {
    if (isEmpty(customerId))
      throw new HttpException(400, "You're not customerId");

    const findCustomer: Customer = await this.customers.findOne({
      _id: customerId,
    });
    if (!findCustomer) throw new HttpException(409, "You're not customer");

    return findCustomer;
  }

  public async createCustomer(
    customerData: CreateCustomerDto
  ): Promise<Customer> {
    if (isEmpty(customerData))
      throw new HttpException(400, "You're not customerData");

    const findCustomer: Customer = await this.customers.findOne({
      email: customerData.email,
    });
    if (findCustomer)
      throw new HttpException(
        409,
        `You're email ${customerData.email} already exists`
      );

    const createCustomerData: Customer = await this.customers.create({
      ...customerData,
    });

    return createCustomerData;
  }

  public async updateCustomer(
    customerId: Types.ObjectId,
    customerData: CreateCustomerDto
  ): Promise<Customer> {
    if (isEmpty(customerData))
      throw new HttpException(400, "You're not customerData");

    if (customerData.email) {
      const findCustomer: Customer = await this.customers.findOne({
        email: customerData.email,
      });
      if (findCustomer && !findCustomer._id.equals(customerId))
        throw new HttpException(
          409,
          `You're email ${customerData.email} already exists`
        );
    }

    const updateCustomerById: Customer = await this.customers.findByIdAndUpdate(
      customerId,
      {
        ...customerData,
      }
    );
    if (!updateCustomerById)
      throw new HttpException(409, "You're not customer");

    return updateCustomerById;
  }

  public async deleteCustomer(customerId: Types.ObjectId): Promise<Customer> {
    const deleteCustomerById: Customer = await this.customers.findByIdAndDelete(
      customerId
    );
    if (!deleteCustomerById)
      throw new HttpException(409, "You're not customer");

    return deleteCustomerById;
  }
}

export default CustomerService;

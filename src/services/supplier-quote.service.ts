import { CreateSupplierQuoteDto } from "@/dtos/supplier-quote.dto";
import { HttpException } from "@exceptions/HttpException";
import { SupplierQuote } from "@/interfaces/supplier-quote.interface";
import supplierQuoteModel from "@/models/supplier-quote.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class SupplierQuoteService {
  public supplierQuotes = supplierQuoteModel;

  public async findAllSupplierQuotes(): Promise<SupplierQuote[]> {
    const supplierQuotes: SupplierQuote[] = await this.supplierQuotes
      .find()
      .lean();
    return supplierQuotes;
  }

  public async findSupplierQuoteById(
    supplierQuoteId: Types.ObjectId
  ): Promise<SupplierQuote> {
    if (isEmpty(supplierQuoteId))
      throw new HttpException(400, "You're not supplierQuoteId");

    const findSupplierQuote: SupplierQuote = await this.supplierQuotes.findOne({
      _id: supplierQuoteId,
    });
    if (!findSupplierQuote)
      throw new HttpException(409, "You're not supplierQuote");

    return findSupplierQuote;
  }

  public async createSupplierQuote(
    supplierQuoteData: CreateSupplierQuoteDto
  ): Promise<SupplierQuote> {
    if (isEmpty(supplierQuoteData))
      throw new HttpException(400, "You're not supplierQuoteData");

    const createSupplierQuoteData: SupplierQuote =
      await this.supplierQuotes.create({ ...supplierQuoteData });

    return createSupplierQuoteData;
  }

  public async updateSupplierQuote(
    supplierQuoteId: Types.ObjectId,
    supplierQuoteData: CreateSupplierQuoteDto
  ): Promise<SupplierQuote> {
    if (isEmpty(supplierQuoteData))
      throw new HttpException(400, "You're not supplierQuoteData");

    const updateSupplierQuoteById: SupplierQuote =
      await this.supplierQuotes.findByIdAndUpdate(supplierQuoteId, {
        ...supplierQuoteData,
      });
    if (!updateSupplierQuoteById)
      throw new HttpException(409, "You're not supplierQuote");

    return updateSupplierQuoteById;
  }

  public async deleteSupplierQuote(
    supplierQuoteId: Types.ObjectId
  ): Promise<SupplierQuote> {
    const deleteSupplierQuoteById: SupplierQuote =
      await this.supplierQuotes.findByIdAndDelete(supplierQuoteId);
    if (!deleteSupplierQuoteById)
      throw new HttpException(409, "You're not supplierQuote");

    return deleteSupplierQuoteById;
  }
}

export default SupplierQuoteService;

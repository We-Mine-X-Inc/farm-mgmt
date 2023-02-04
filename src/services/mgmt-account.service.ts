import { CreateMgmtAccountDto } from "@/dtos/mgmt-account.dto";
import { HttpException } from "@exceptions/HttpException";
import { MgmtAccount } from "@/interfaces/mgmt-account.interface";
import mgmtAccountModel from "@/models/mgmt-account.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class MgmtAccountService {
  public mgmtAccounts = mgmtAccountModel;

  public async findAllMgmtAccount(): Promise<MgmtAccount[]> {
    const mgmtAccounts: MgmtAccount[] = await this.mgmtAccounts.find().lean();
    return mgmtAccounts;
  }

  public async findMgmtAccountById(
    mgmtAccountId: Types.ObjectId
  ): Promise<MgmtAccount> {
    if (isEmpty(mgmtAccountId))
      throw new HttpException(400, "You're not mgmtAccountId");

    const findMgmtAccount: MgmtAccount = await this.mgmtAccounts.findOne({
      _id: mgmtAccountId,
    });
    if (!findMgmtAccount)
      throw new HttpException(409, "You're not mgmtAccount");

    return findMgmtAccount;
  }

  public async createMgmtAccount(
    mgmtAccountData: CreateMgmtAccountDto
  ): Promise<MgmtAccount> {
    if (isEmpty(mgmtAccountData))
      throw new HttpException(400, "You're not mgmtAccountData");

    const findMgmtAccount: MgmtAccount = await this.mgmtAccounts.findOne({
      email: mgmtAccountData.email,
    });
    if (findMgmtAccount)
      throw new HttpException(
        409,
        `You're email ${mgmtAccountData.email} already exists`
      );

    const createMgmtAccountData: MgmtAccount = await this.mgmtAccounts.create({
      ...mgmtAccountData,
    });

    return createMgmtAccountData;
  }

  public async updateMgmtAccount(
    mgmtAccountId: Types.ObjectId,
    mgmtAccountData: CreateMgmtAccountDto
  ): Promise<MgmtAccount> {
    if (isEmpty(mgmtAccountData))
      throw new HttpException(400, "You're not mgmtAccountData");

    if (mgmtAccountData.email) {
      const findMgmtAccount: MgmtAccount = await this.mgmtAccounts.findOne({
        email: mgmtAccountData.email,
      });
      if (findMgmtAccount && !findMgmtAccount._id.equals(mgmtAccountId))
        throw new HttpException(
          409,
          `You're email ${mgmtAccountData.email} already exists`
        );
    }

    const updateMgmtAccountById: MgmtAccount =
      await this.mgmtAccounts.findByIdAndUpdate(mgmtAccountId, {
        ...mgmtAccountData,
      });
    if (!updateMgmtAccountById)
      throw new HttpException(409, "You're not mgmtAccount");

    return updateMgmtAccountById;
  }

  public async deleteMgmtAccount(
    mgmtAccountId: Types.ObjectId
  ): Promise<MgmtAccount> {
    const deleteMgmtAccountById: MgmtAccount =
      await this.mgmtAccounts.findByIdAndDelete(mgmtAccountId);
    if (!deleteMgmtAccountById)
      throw new HttpException(409, "You're not mgmtAccount");

    return deleteMgmtAccountById;
  }
}

export default MgmtAccountService;

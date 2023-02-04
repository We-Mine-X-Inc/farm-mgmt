import { CreateContractDto } from "@/dtos/contract.dto";
import { HttpException } from "@exceptions/HttpException";
import { Contract } from "@/interfaces/contract.interface";
import contractModel from "@/models/contract.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

export type GetContractRequest = {
  minerId: Types.ObjectId;
};

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class ContractService {
  public contracts = contractModel;

  public async findAllContracts(): Promise<Contract[]> {
    const contracts: Contract[] = await this.contracts.find().lean();
    return contracts;
  }

  public async findContractById(contractId: Types.ObjectId): Promise<Contract> {
    if (isEmpty(contractId._id.id))
      throw new HttpException(400, "You're not contractId");

    const findContract: Contract = await this.contracts.findOne({
      _id: contractId,
    });
    if (!findContract) throw new HttpException(409, "You're not contract");

    return findContract;
  }

  // Redesign this to be more robust and expressive of situations when a miner is under
  // the company's control as opposed to under customer contract. This will require changes
  // in the interface of Miner. We can probably move the finalPool information to the miner
  // itself as opposed to within the Contract. This will act as the default pool when the miner
  // is not under customer contract.
  public async findContractByMiner(
    request: GetContractRequest
  ): Promise<Contract> {
    if (!request) throw new HttpException(400, "You're not GetContractRequest");

    const findContract: Contract = await this.contracts.findOne({
      miner: request.minerId,
    });
    if (!findContract) throw new HttpException(409, "You're not contract");

    return findContract;
  }

  public async createContract(
    contractData: CreateContractDto
  ): Promise<Contract> {
    if (isEmpty(contractData))
      throw new HttpException(400, "You're not contractData");

    const findContract: Contract = await this.contracts.findOne({
      miner: contractData.miner,
      isActive: true,
    });
    if (findContract)
      throw new HttpException(
        409,
        `A contract for the miner ${prettyFormat(
          contractData.miner
        )} already exists.`
      );

    const createContractData: Contract = await this.contracts.create({
      ...contractData,
    });

    return createContractData;
  }

  public async updateContract(
    contractId: Types.ObjectId,
    contractData: CreateContractDto
  ): Promise<Contract> {
    if (isEmpty(contractData))
      throw new HttpException(400, "You're not contractData");

    if (contractData.miner) {
      const findContract: Contract = await this.contracts.findOne({
        miner: contractData.miner,
      });
      if (findContract && !findContract._id.equals(contractId))
        throw new HttpException(
          409,
          `You cannot apply an existing contract to a miner. You must create
          a new contract with the minerId already set.`
        );
    }

    const updateContractById: Contract = await this.contracts.findByIdAndUpdate(
      contractId,
      { ...contractData }
    );
    if (!updateContractById) {
      throw new HttpException(409, "You're not contract");
    }

    return updateContractById;
  }

  public async deleteContract(contractId: Types.ObjectId): Promise<Contract> {
    const deleteContractById: Contract = await this.contracts.findByIdAndDelete(
      contractId
    );
    if (!deleteContractById) {
      throw new HttpException(409, "You're not contract");
    }

    return deleteContractById;
  }
}

export default ContractService;

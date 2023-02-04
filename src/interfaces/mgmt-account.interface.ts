import { Types } from "mongoose";

export type ContractModePermissions = {
  canRead: boolean;
  canWrite: boolean;
};

export type CustomerModelPermissions = {
  canRead: boolean;
  canWrite: boolean;
};

export type MinerModelPermissions = {
  canRead: boolean;
  canWrite: boolean;
};

export type PoolModelPermissions = {
  canRead: boolean;
  canWrite: boolean;
};

export type SupplierQuoteModelPermissions = {
  canRead: boolean;
  canWrite: boolean;
};

export type MgmtPermissions = {
  contractModelPermissions: ContractModePermissions;
  customerModelPermissions: CustomerModelPermissions;
  minerModelPermissions: MinerModelPermissions;
  poolModelPermissions: PoolModelPermissions;
  supplierQuoteModelPermissions: SupplierQuoteModelPermissions;
};

export interface MgmtAccount {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  mgmtPermissions: MgmtPermissions;
}

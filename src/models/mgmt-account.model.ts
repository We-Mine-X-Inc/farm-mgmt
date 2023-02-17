import { model, Schema, Document } from "mongoose";
import { MgmtAccount } from "@/interfaces/mgmt-account.interface";

const contractModePermissionsSchema = {
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
};

const customerModelPermissionsSchema = {
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
};

const minerModelPermissionsSchema = {
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
};

const poolModelPermissionsSchema = {
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
};

const supplierQuoteModelPermissionsSchema = {
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
};

const mgmtPermissionsSchema = {
  contractModelPermissions: contractModePermissionsSchema,
  customerModelPermissions: customerModelPermissionsSchema,
  minerModelPermissions: minerModelPermissionsSchema,
  poolModelPermissions: poolModelPermissionsSchema,
  supplierQuoteModelPermissions: supplierQuoteModelPermissionsSchema,
};

const mgmtAccountSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  mgmtPermissions: mgmtPermissionsSchema,
});

const mgmtAccountModel = model<MgmtAccount & Document>(
  "MgmtAccount",
  mgmtAccountSchema
);

export default mgmtAccountModel;

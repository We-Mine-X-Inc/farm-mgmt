import { model, Schema, Document } from "mongoose";
import { MgmtAccount } from "@/interfaces/mgmt-account.interface";

const contractModePermissionsSchema: Schema = new Schema({
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
});

const customerModelPermissionsSchema: Schema = new Schema({
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
});

const minerModelPermissionsSchema: Schema = new Schema({
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
});

const poolModelPermissionsSchema: Schema = new Schema({
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
});

const supplierQuoteModelPermissionsSchema: Schema = new Schema({
  canRead: {
    type: Boolean,
    required: true,
  },
  canWrite: {
    type: Boolean,
    required: true,
  },
});

const mgmtPermissionsSchema: Schema = new Schema({
  contractModelPermissions: contractModePermissionsSchema,
  customerModelPermissions: customerModelPermissionsSchema,
  minerModelPermissions: minerModelPermissionsSchema,
  poolModelPermissions: poolModelPermissionsSchema,
  supplierQuoteModelPermissions: supplierQuoteModelPermissionsSchema,
});

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

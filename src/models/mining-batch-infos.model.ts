import { model, Schema, Document } from 'mongoose';
import { MiningBatchInfo } from '@interfaces/mining-batch-infos.interface';

const miningInterruptionSchema: Schema = new Schema({
  sig_termination: {
    time: Date,
    required: true,
    unique: true,
  },
});

const miningInterruptionModel = model<MiningBatchInfo & Document>('MiningInterruption', miningInterruptionSchema);

export default miningInterruptionModel;

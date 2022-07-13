import { model, Schema, Document } from 'mongoose';
import { MiningInterruption } from '@interfaces/mining-interruptions.interface';

const miningInterruptionSchema: Schema = new Schema({
  sig_termination: {
    time: Date,
    required: true,
    unique: true,
  },
});

const miningInterruptionModel = model<MiningInterruption & Document>('MiningInterruption', miningInterruptionSchema);

export default miningInterruptionModel;

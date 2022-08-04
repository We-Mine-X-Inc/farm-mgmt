import { model, Schema, Document } from 'mongoose';
import { Pool } from '@interfaces/pools.interface';

const poolSchema: Schema = new Schema({
    minerId: {
        type: Schema.Types.ObjectId,
        ref: 'Miner',
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
});

const poolModel = model<Pool & Document>('Pool', poolSchema);

export default poolModel;

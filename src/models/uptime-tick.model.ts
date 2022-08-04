import { model, Schema, Document } from 'mongoose';
import { UptimeTick } from '@/interfaces/uptime-tick.interface';

const uptimeTickSchema: Schema = new Schema({
    datetime: {
        type: Date,
        required: true,
    },
});

const uptimeTickModel = model<UptimeTick & Document>('UptimeTick', uptimeTickSchema);

export default uptimeTickModel;

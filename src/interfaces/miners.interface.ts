import { Types } from 'mongoose';

export interface Miner {
    _id: string;
    userId: Types.ObjectId;
    ipAddress: string;
    mac: string;
    API: string;
    coin: string;
    contract: Types.Subdocument;
}

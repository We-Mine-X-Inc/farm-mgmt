import { Types } from 'mongoose';

export interface Pool {
    _id: string;
    minerId: Types.ObjectId,
    url: string;
    username: string;
}

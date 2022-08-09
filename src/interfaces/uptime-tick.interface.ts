import { Types } from "mongoose";

export interface UptimeTick {
  _id: Types.ObjectId;
  datetime: Date;
}

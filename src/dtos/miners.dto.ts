import { IsIP, IsObject, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMinerDto {
    @IsObject()
    public userId: Types.ObjectId;

    @IsString()
    public mac: string;

    @IsIP()
    public ipAddress: string;

    @IsString()
    public API: string;

    @IsString()
    public coin: string;
}

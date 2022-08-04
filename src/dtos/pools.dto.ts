import { IsObject, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePoolDto {
    @IsObject()
    public minerId: Types.ObjectId;

    @IsString()
    public url: string;

    @IsString()
    public username: string;
}

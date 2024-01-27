import { ILoginResponsePayload } from "@shared-lib/interfaces";
import { IsDate, IsString } from "class-validator";

export class LoginResponsePayload implements ILoginResponsePayload{
    @IsString()
    access_token: string;
    @IsDate()
    expiry_date: Date;
}
import { ILoginCredentialsPayload } from "@shared-lib/interfaces";
import { IsEmail, IsString } from '@nestjs/class-validator';

export class LoginCredentialsPayload implements ILoginCredentialsPayload{
    @IsEmail()
    readonly email: string;
    @IsString()
    readonly password: string;
}
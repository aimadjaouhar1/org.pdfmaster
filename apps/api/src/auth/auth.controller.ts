import { AuthService } from "@api/auth/auth.service";
import { LoginCredentialsPayload } from "@api/auth/models/login-credentials.model";
import { ConnectedUser } from "@shared-lib/types";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from 'express';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
    ) {}

    @Post('/login')
    async login(@Body() credentials: LoginCredentialsPayload, @Res({passthrough: true}) response: Response): Promise<ConnectedUser> {
        return this.authService.login(credentials.email, credentials.password, response);
    }

}
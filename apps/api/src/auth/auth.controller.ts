import { AuthService } from "@api/auth/auth.service";
import { LoginCredentialsPayload } from "@api/auth/models/login-credentials.model";
import { JwtAuthGuard } from "@api/common/guards/jwt-auth.guard";

import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ConnectedUser } from "@shared-lib/types";
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

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res({passthrough: true}) response: Response) {
        this.authService.logout(response);
    }

}
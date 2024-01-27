import { AuthService } from "@api/auth/auth.service";
import { LoginCredentialsPayload } from "@api/auth/payloads/login-credentials.payload";
import { Body, Controller, Post } from "@nestjs/common";


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
    ) {}

    @Post('/login')
    signIn(@Body() credentials: LoginCredentialsPayload) {
        return this.authService.signIn(credentials.username, credentials.password);
    }
}
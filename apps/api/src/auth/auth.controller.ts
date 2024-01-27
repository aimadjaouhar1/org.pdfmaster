import { AuthService } from "@api/auth/auth.service";
import { LoginCredentialsPayload } from "@api/auth/models/login-credentials.model";
import { LoginResponsePayload } from "@api/auth/models/login-response.model";
import { Body, Controller, Post } from "@nestjs/common";


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
    ) {}

    @Post('/login')
    async login(@Body() credentials: LoginCredentialsPayload): Promise<LoginResponsePayload> {
        return this.authService.login(credentials.email, credentials.password);
    }
}
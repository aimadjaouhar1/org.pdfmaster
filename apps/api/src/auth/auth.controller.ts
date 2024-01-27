import { AuthService } from "@api/auth/auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { LoginCredentialsPayload } from "@shared-lib/models";


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
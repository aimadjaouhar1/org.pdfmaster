import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<string> {
        return this.jwtService.sign({ username, password }, {secret: process.env.API_JWT_SECRET, expiresIn: `${process.env.API_JWT_EXPIRATION}s`});
    }

}
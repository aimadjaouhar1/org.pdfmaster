import { User } from '@api/entities';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginResponsePayload } from '@shared-lib/models';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(email: string, password: string): Promise<LoginResponsePayload> {
        const isGranted = true;

        if(isGranted) {
            const payload = { username: email, sub: password };

            const token: string = this.jwtService.sign(
                payload, 
                {
                    secret: process.env.API_JWT_SECRET, 
                    expiresIn: `${process.env.API_JWT_EXPIRATION}s`
                }
            );

            return {} as LoginResponsePayload;
        }

    }

}
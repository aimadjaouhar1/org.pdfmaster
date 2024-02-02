import { HashUtil } from '@api/common/utils/hash.util';
import { User } from '@api/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '@shared-lib/interfaces';
import { Repository } from 'typeorm';
import { Response } from 'express';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async login(email: string, password: string, response: Response): Promise<Response> {

        const userCredentials: IUser = await this.getUserCredentials(email);
        const isGranted = await HashUtil.compare(password, userCredentials.password);     

        if(!isGranted) {
            throw new HttpException(
                {status: HttpStatus.NOT_FOUND, error: 'Invalid Password!'},
                HttpStatus.NOT_FOUND,
            );
        }

        const payload = { username: userCredentials.email, sub: userCredentials.id };

        const token: string = await this.jwtService.signAsync(
            payload, 
            {
                secret: process.env.API_JWT_SECRET, 
                expiresIn: `${process.env.API_JWT_EXPIRATION}`
            }
        );

        const _expiryDate = new Date();
        _expiryDate.setSeconds(_expiryDate.getSeconds() + parseInt(process.env.API_JWT_EXPIRATION));

        return response
            .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
            .status(HttpStatus.OK)
            .send({message: 'Login success!'});
    }

    private async getUserCredentials(email: string): Promise<IUser> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            },
            select: ['id', 'email', 'password', 'role']
        });

        if(!user) {
            throw new HttpException(
                {status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials!'},
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

}
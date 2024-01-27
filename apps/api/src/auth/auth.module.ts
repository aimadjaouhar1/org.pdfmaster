import { AuthController } from '@api/auth/auth.controller';
import { AuthService } from '@api/auth/auth.service';
import { JwtStrategy } from '@api/auth/jwt.strategy';
import { User } from '@api/entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.register({
      secret: process.env.API_JWT_SECRET,
      signOptions: { expiresIn: `${process.env.API_JWT_EXPIRATION}s` },
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
})
export class AuthModule {}

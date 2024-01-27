import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.API_JWT_SECRET,
      signOptions: { expiresIn: `${process.env.API_JWT_EXPIRATION}s` },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

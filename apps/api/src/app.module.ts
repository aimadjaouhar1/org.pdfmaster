import { Module } from '@nestjs/common';
import { AuthModule } from '@api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@api/entities';

const entities = [
  User
];

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([...entities]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [...entities],
      synchronize: Boolean(process.env.DB_SYNC || false), 
      logging: Boolean(process.env.DB_LOGGING || false)
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

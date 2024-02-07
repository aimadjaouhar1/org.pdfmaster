import { Module } from '@nestjs/common';
import { AuthModule } from '@api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@api/entities';
import { PdfController } from '@api/controllers/pdf.controller';
import { PdfService } from '@api/services/pdf.service';
import { MulterModule } from '@nestjs/platform-express';

const entities = [
  User
];

@Module({
  imports: [
    AuthModule,
    MulterModule,
    MulterModule.register({
      dest: './storage',
    }),
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
  controllers: [PdfController],
  providers: [PdfService],
})
export class AppModule {}

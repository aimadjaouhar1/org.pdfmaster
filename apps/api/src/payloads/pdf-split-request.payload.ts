import { IsNotEmpty, IsNumber, IsPositive } from "@nestjs/class-validator";
import { Transform } from 'class-transformer';

export class PdfRequestPayload {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Transform((n) => parseInt(n.value))
    interval: number;
}
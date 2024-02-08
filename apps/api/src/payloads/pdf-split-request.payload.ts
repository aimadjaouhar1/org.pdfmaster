import { IsNotEmpty, IsNumber, IsPositive } from "@nestjs/class-validator";

export class PdfSplitRequestPayload {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    interval: number | string;
}
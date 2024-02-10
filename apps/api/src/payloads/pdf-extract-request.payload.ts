import { IsNotEmpty } from "@nestjs/class-validator";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean } from "class-validator";

export class PdfExtractRequestPayload {
    @IsArray()
    @IsNotEmpty()
    @Transform(({value}) => JSON.parse(value))
    pageIndices: number[] | string;

    @IsBoolean()
    @IsNotEmpty()
    @Transform(({value}) => new Boolean(value))
    separate: boolean;
}
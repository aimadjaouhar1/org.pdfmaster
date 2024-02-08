import { IsNotEmpty } from "@nestjs/class-validator";
import { Transform } from "class-transformer";
import { IsArray } from "class-validator";

export class PdfExtractRequestPayload {
    @IsArray()
    @IsNotEmpty()
    @Transform(({value}) => JSON.parse(value))
    pageIndices: number[] | string;
}
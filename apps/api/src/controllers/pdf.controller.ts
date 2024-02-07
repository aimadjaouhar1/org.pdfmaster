import { PdfRequestPayload } from "@api/payloads";
import { PdfService } from "@api/services/pdf.service";
import { Body, Controller, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';


@Controller('pdf')
export class PdfController {

    constructor(
        private readonly pdfService: PdfService
    ) {}

    @Post('/split')
    @UseInterceptors(FileInterceptor('file'))
    split(@Body() pdfRequestPayload: PdfRequestPayload, @UploadedFile() file: Express.Multer.File, @Res() response: Response) {
      this.pdfService.split(pdfRequestPayload.interval, file, response);
    }
}
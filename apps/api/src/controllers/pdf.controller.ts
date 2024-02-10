import { PdfSplitRequestPayload } from "@api/payloads";
import { PdfExtractRequestPayload } from "@api/payloads/pdf-extract-request.payload";
import { PdfService } from "@api/services/pdf.service";
import { Body, Controller, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';


@Controller('pdf')
export class PdfController {

    constructor(private readonly pdfService: PdfService) {}

    @Post('/extract')
    @UseInterceptors(FileInterceptor('file'))
    extract(@Body() pdfSplitRequestPayload: PdfExtractRequestPayload, @UploadedFile() file: Express.Multer.File, @Res() response: Response) {
      // class-transformer not working with form-data
      this.pdfService.extract(JSON.parse(pdfSplitRequestPayload.pageIndices as string), `${pdfSplitRequestPayload.separate}` == 'true', file, response);
    }

    @Post('/split')
    @UseInterceptors(FileInterceptor('file'))
    split(@Body() pdfSplitRequestPayload: PdfSplitRequestPayload, @UploadedFile() file: Express.Multer.File, @Res() response: Response) {
      this.pdfService.split(parseInt(pdfSplitRequestPayload.interval as string), file, response);
    }
}
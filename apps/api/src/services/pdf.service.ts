import { Injectable, Res } from "@nestjs/common";
import { Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import JSZip from 'jszip';

@Injectable()
export class PdfService {

    async split(_interval: number, file: Express.Multer.File, @Res() response: Response) {
        const buffer = fs.readFileSync(`${file.destination}/${file.filename}`);

        const pdfDoc = await PDFDocument.load(buffer);
        const pageIndices = pdfDoc.getPageIndices();
        const filename = file.originalname.replace('.pdf', '');

        const pdfPartsBytes = pageIndices.reduce(
            (pdfParts, _, index) => (index % _interval == 0) ? [...pdfParts, pageIndices.slice(index, index + _interval)] : pdfParts,
            [])
            .map(async (pdfPartPageIndices) => {
                const doc = await PDFDocument.create();
                (await doc.copyPages(pdfDoc, await pdfPartPageIndices)).forEach(page => doc.addPage(page));

                return await doc.save();
            })

        const zipFile = await this.zipPdfFiles(filename, await Promise.all(pdfPartsBytes));

        response.contentType('application/zip');
        response.attachment(`${filename}.zip`);    
        response.send(zipFile);
    }

    private async zipPdfFiles(filename: string, files: Uint8Array[]) {
        const zip = new JSZip();
        files.forEach((file, index) => zip.file(`${filename}_${index + 1}.pdf`, file));

        return zip.generateAsync({type: "nodebuffer", mimeType: "application/zip"});
    }

}
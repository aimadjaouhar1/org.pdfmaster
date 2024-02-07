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
        const zipFileInfos = [];

        const pdfPartsBytes = pageIndices.reduce(
            (pdfParts, _, index) => (index % _interval == 0) ? [...pdfParts, pageIndices.slice(index, index + _interval)] : pdfParts,
            [])
            .map(async (pdfPartPageIndices, index) => {
                const doc = await PDFDocument.create();
                (await doc.copyPages(pdfDoc, await pdfPartPageIndices)).forEach(page => doc.addPage(page));
                zipFileInfos.push({name: `${filename}_${index + 1}.pdf`, pages: 1, size: undefined });
                
                return await doc.save();
            })

        const files = await Promise.all(pdfPartsBytes);
        const zipFile = await this.zipPdfFiles(filename, files);


        files.forEach((file, index) => zipFileInfos[index].size = file.length);


        response.contentType('application/zip');
        response.attachment(`${filename}.zip`);
        response.setHeader('X-zip-file-infos', JSON.stringify(zipFileInfos));
        response.send(zipFile);
    }

    private async zipPdfFiles(filename: string, files: Uint8Array[]) {
        const zip = new JSZip();
        files.forEach((file, index) => zip.file(`${filename}_${index + 1}.pdf`, file));

        return zip.generateAsync({type: "nodebuffer", mimeType: "application/zip"});
    }

}
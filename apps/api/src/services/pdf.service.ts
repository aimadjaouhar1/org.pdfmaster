import { Injectable, Res } from "@nestjs/common";
import { Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import JSZip from 'jszip';

@Injectable()
export class PdfService {

    async extract(pageIndices: number[], separate: boolean, file: Express.Multer.File, @Res() response: Response) {
        const buffer = fs.readFileSync(`${file.destination}/${file.filename}`);
        const pdfDoc = await PDFDocument.load(buffer);
        const filename = file.originalname.replace('.pdf', '');
        const fileInfos = [];

        let responseType: 'application/pdf' | 'application/zip';
        let attachment: string;
        let header: string;
        let data: Buffer;

        if(separate) {
            const pdfPartsBytes = pageIndices.map(async (indice: number) => {
                const newDoc = await PDFDocument.create();
                (await newDoc.copyPages(pdfDoc, [indice - 1])).forEach(page => newDoc.addPage(page));
                
                fileInfos.push({name: `${filename}_${indice}.pdf`, pages: 1, size: undefined });

                return await newDoc.save();
            });

            const files = await Promise.all(pdfPartsBytes);
            files.forEach((file, index) => fileInfos[index].size = file.length);
            const zipFile = await this.zipPdfFiles(filename, files);

            responseType = 'application/zip';
            attachment = `${filename}_extracted.zip`;
            header = JSON.stringify(fileInfos);
            data = zipFile;
            
        } else {
            const newDoc = await PDFDocument.create();
            (await newDoc.copyPages(pdfDoc, pageIndices.map(numPage => numPage - 1))).forEach(page => newDoc.addPage(page));
            const file = await newDoc.save();

            fileInfos.push({name: `${filename}_extracted.pdf`, pages: 1, size: file.length });

            responseType = 'application/pdf';
            attachment = fileInfos[0].name;
            header = JSON.stringify(fileInfos);
            data = Buffer.from(file);
        }


        response.contentType(responseType);
        response.attachment(attachment);
        response.setHeader('X-file-infos', header);
        response.send(data);
    }

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
            (await doc.copyPages(pdfDoc, pdfPartPageIndices)).forEach(page => doc.addPage(page));
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
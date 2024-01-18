import { Injectable } from "@angular/core";
import { Observable, forkJoin, from } from "rxjs";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import * as pdfjs from 'pdfjs-dist';


@Injectable({ providedIn: 'root' })
export class PdfEditorService {  

    loadPdfDocument(pdfFile: string): Observable<PDFDocumentProxy> {
        return from(pdfjs.getDocument(pdfFile).promise);
    }

    loadPdfPage(pdf: PDFDocumentProxy, pageNum: number): Observable<PDFPageProxy> {
       return from(pdf.getPage(pageNum))
    }

    loadPdfPages(pdf: PDFDocumentProxy, pageNumFrom: number, pageNumTo: number): Observable<PDFPageProxy[]> {
        const observables: Observable<PDFPageProxy>[] = [];

        for (let pageNum = pageNumFrom; pageNum <= (pageNumTo >= pdf.numPages ? pdf.numPages : pageNumTo); pageNum++) {
            observables.push(from(pdf.getPage(pageNum)));
        }
        
        return forkJoin(observables);
    }
}
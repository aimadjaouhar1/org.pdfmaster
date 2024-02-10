import { AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileMimeType } from '@shared-lib/enums';
import { PdfHttp } from '@web/app/http/pdf.http';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfExtractParamsComponent } from '@web/features/pdf-extract/pdf-extract-params/pdf-extract-params.component';
import { FileUploadDropzoneComponent } from '@web/shared/components/file-upload-dropzone/file-upload-dropzone.component';
import { PdfPageListComponent } from '@web/shared/components/pdf-page-list/pdf-page-list.component';
import { PdfViewerComponent } from '@web/shared/components/pdf-viewer/pdf-viewer.component';
import { PDFPageProxy } from 'pdfjs-dist';
import { Observable, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-pdf-extract',
  standalone: true,
  imports: [AsyncPipe, FileUploadDropzoneComponent, PdfPageListComponent, PdfExtractParamsComponent, PdfViewerComponent],
  templateUrl: './pdf-extract.component.html',
  styleUrl: './pdf-extract.component.scss'
})
export class PdfExtractComponent {

  private readonly modalService = inject(NgbModal);
  private readonly pdfEditorService = inject(PdfEditorService);
  private readonly pdfHttp = inject(PdfHttp);

  readonly accept = [FileMimeType.PDF];

  pdfFile?: File;
  loadedPdfPages$?: Observable<PDFPageProxy[]>;

  previewPage?: PDFPageProxy;
  selectedPages: PDFPageProxy[] = [];

  download?: {url: string, filename: string};

  selectAll = false;


  onClickExtract(extractOptions: {selectAll: boolean, separate: boolean}) {
    this.pdfHttp.extract(
      this.pdfFile!, 
      extractOptions.separate, 
      this.selectedPages.map(page => page.pageNumber))
    .pipe(take(1))
    .pipe(map(response => this.prepareDownload(response)))
    .subscribe();

  }
  
  onSelectedPagesChange = (selectedPages: PDFPageProxy[]) => this.selectedPages = selectedPages;

  onPreview(page: PDFPageProxy, modal: TemplateRef<ElementRef>) {
    this.previewPage = page;
    this.modalService.open(modal, {backdrop: true, centered: true, size: 'lg'});
  }

  async onSelectFiles(files: File[]) {
    this.pdfFile = files[0];

    this.loadedPdfPages$ = this.pdfEditorService.loadPdfDocument(await this.pdfFile.arrayBuffer())
      .pipe(switchMap(pdfDoc => this.pdfEditorService.loadPdfPages(pdfDoc, 1, pdfDoc.numPages))
    );
  }

  private prepareDownload(response: HttpResponse<Blob>) {
    const url = URL.createObjectURL(response.body as Blob);

    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
    const originalFilename = filenameMatch ? filenameMatch[1] : 'download';

    this.download = {url: url, filename: originalFilename};

    //const xZipFileInfos = response.headers.get('x-zip-file-infos');
    //this.zipFileInfos = xZipFileInfos ? JSON.parse(xZipFileInfos) : undefined;
    
  }
}
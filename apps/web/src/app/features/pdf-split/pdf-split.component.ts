import { AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, inject } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FileMimeType } from '@shared-lib/enums';
import { PdfHttp } from '@web/app/http/pdf.http';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfSplitParamsComponent } from '@web/features/pdf-split/pdf-split-params/pdf-split-params.component';
import { FileUploadDropzoneComponent } from '@web/shared/components/file-upload-dropzone/file-upload-dropzone.component';
import { PdfDownloadResultModalComponent } from '@web/shared/components/pdf-download-result-modal/pdf-download-result-modal.component';
import { PdfPageListComponent } from '@web/shared/components/pdf-page-list/pdf-page-list.component';
import { PdfViewerComponent } from '@web/shared/components/pdf-viewer/pdf-viewer.component';
import { PDFPageProxy } from 'pdfjs-dist';
import { Observable, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-pdf-split',
  standalone: true,
  imports: [
    NgbModalModule, 
    AsyncPipe, 
    PdfSplitParamsComponent, 
    PdfPageListComponent, 
    FileUploadDropzoneComponent, 
    PdfDownloadResultModalComponent,
    PdfViewerComponent
  ],
  templateUrl: './pdf-split.component.html',
  styleUrl: './pdf-split.component.scss',
})
export class PdfSplitComponent {
  
  private readonly modalService = inject(NgbModal);
  private readonly pdfEditorService = inject(PdfEditorService);
  private readonly pdfHttp = inject(PdfHttp);

  readonly accept = [FileMimeType.PDF];

  pdfFile?: File;
  countPages: number = 0;
  loadedPdfPages$?: Observable<PDFPageProxy[]>;

  fileInfos: {name: string, pages: number, size: number}[] = [];
  download?: {url: string, filename: string};

  previewPage?: PDFPageProxy;
  selectedPages: PDFPageProxy[] = [];

  onSelectedPagesChange = (selectedPages: PDFPageProxy[]) => {this.selectedPages = selectedPages;};

  onPreview(page: PDFPageProxy, modal: TemplateRef<ElementRef>) {
    this.previewPage = page;
    this.modalService.open(modal, {backdrop: true, centered: true, size: 'lg'});
  }

  onSplit(interval: number, modal: TemplateRef<ElementRef>) {
    this.pdfHttp.split(this.pdfFile!, interval)
      .pipe(take(1))
      .pipe(map(response => this.prepareDownload(response)))
      .subscribe();

    this.modalService.open(modal, {keyboard: false, backdrop: 'static', centered: true});
  }

  private prepareDownload(response: HttpResponse<Blob>) {
    const url = URL.createObjectURL(response.body as Blob);

    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
    const originalFilename = filenameMatch ? filenameMatch[1] : 'download';

    this.download = {url: url, filename: originalFilename};

    const xZipFileInfos = response.headers.get('x-zip-file-infos');
    this.fileInfos = xZipFileInfos ? JSON.parse(xZipFileInfos) : undefined;
  }

  async onSelectFiles(files: File[]) {
    this.pdfFile = files[0];

    this.loadedPdfPages$ = this.pdfEditorService.loadPdfDocument(await this.pdfFile.arrayBuffer())
      .pipe(
        map(pdfDoc => {
            this.countPages = pdfDoc.numPages;
            return pdfDoc;
        }),
          switchMap(pdfDoc => this.pdfEditorService.loadPdfPages(pdfDoc, 1, this.countPages)
        )
      );
  }

}

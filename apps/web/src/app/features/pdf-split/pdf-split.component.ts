import { AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, inject } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FileMimeType } from '@shared-lib/enums';
import { PdfHttp } from '@web/app/http/pdf.http';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfSplitParamsComponent } from '@web/features/pdf-split/pdf-split-params/pdf-split-params.component';
import { FileUploadDropzoneComponent } from '@web/shared/components/file-upload-dropzone/file-upload-dropzone.component';
import { PdfPageListComponent } from '@web/shared/components/pdf-page-list/pdf-page-list.component';
import { PDFPageProxy } from 'pdfjs-dist';
import { Observable, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-pdf-split',
  standalone: true,
  imports: [NgbModalModule, AsyncPipe, PdfSplitParamsComponent, PdfPageListComponent, FileUploadDropzoneComponent],
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

  onSplit(interval: number, modal: TemplateRef<ElementRef>) {
    this.pdfHttp.split(this.pdfFile!, interval)
      .pipe(take(1))
      .pipe(map(response => this.prepareDownloadUrl(response)))
      .subscribe();

      this.modalService.open(modal, {keyboard: false, backdrop: 'static', centered: true});
  }

  private prepareDownloadUrl(response: HttpResponse<Blob>) {
    const url = URL.createObjectURL(response.body as Blob);

    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
    const originalFilename = filenameMatch ? filenameMatch[1] : 'download';

    const downloadEl = (document.getElementById('download') as HTMLAnchorElement);
    downloadEl.href = url;
    downloadEl.download = originalFilename;
  }

}

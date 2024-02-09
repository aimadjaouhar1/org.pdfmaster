import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileMimeType } from '@shared-lib/enums';
import { PdfHttp } from '@web/app/http/pdf.http';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { FileUploadDropzoneComponent } from '@web/shared/components/file-upload-dropzone/file-upload-dropzone.component';
import { PdfPageListComponent } from '@web/shared/components/pdf-page-list/pdf-page-list.component';
import { PDFPageProxy } from 'pdfjs-dist';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-pdf-extract',
  standalone: true,
  imports: [AsyncPipe, FileUploadDropzoneComponent, PdfPageListComponent],
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


  async onSelectFiles(files: File[]) {
    this.pdfFile = files[0];

    this.loadedPdfPages$ = this.pdfEditorService.loadPdfDocument(await this.pdfFile.arrayBuffer())
      .pipe(switchMap(pdfDoc => this.pdfEditorService.loadPdfPages(pdfDoc, 1, pdfDoc.numPages))
    );
  }

}
import { Component, Input, inject } from '@angular/core';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfEditorNavigatorComponent } from '@web/shared/components/pdf-editor/pdf-editor-navigator/pdf-editor-navigator.component';
import { PdfEditorToolbarComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pdf-editor-toolbar.component';
import { PDFPageProxy } from 'pdfjs-dist';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";


type Pagination = {page: number, limit: number};


@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [PdfEditorToolbarComponent, PdfEditorNavigatorComponent, AsyncPipe],
  templateUrl: './pdf-editor.component.html',
  styleUrl: './pdf-editor.component.scss',
})
export class PdfEditorComponent {
  
  @Input() pdfFile: string = 'http://localhost:4200/assets/sample.pdf';

  pdfEditorService = inject(PdfEditorService);

  
  pagination: Pagination = {page: 1, limit: 5};

  loadedPdfDocument$ = this.pdfEditorService.loadPdfDocument(this.pdfFile);
  loadedPdfPages$?: Observable<PDFPageProxy[]>;

  constructor() {
    this.loadedPdfDocument$.pipe(takeUntilDestroyed())
      .subscribe(pdfDoc => {
        this.loadedPdfPages$ = this.pdfEditorService.loadPdfPages(pdfDoc, this.pagination.page, this.pagination.limit);
    });
  }


}

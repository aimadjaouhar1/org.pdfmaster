import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { GetViewportParameters } from 'pdfjs-dist/types/src/display/api';
import { PDFPageProxy } from 'pdfjs-dist/types/src/pdf';


@Component({
  selector: 'app-pdf-editor-navigator',
  standalone: true,
  imports: [NgClass, PdfViewerDirective],
  templateUrl: './pdf-editor-navigator.component.html',
  styleUrl: './pdf-editor-navigator.component.scss',
})
export class PdfEditorNavigatorComponent {

  @Input() pages?: PDFPageProxy[] | null;  

  @Output() selectPage = new EventEmitter<PDFPageProxy>();

  selectedPage?: PDFPageProxy;

  viewportParams?: GetViewportParameters = { scale: 0.3 };

  
  onSelectPage = (page: PDFPageProxy) => {  this.selectedPage = page;  this.selectPage.emit(this.selectedPage); }

}

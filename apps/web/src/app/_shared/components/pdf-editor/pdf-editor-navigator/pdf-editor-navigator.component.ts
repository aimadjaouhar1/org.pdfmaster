import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { PDFPageProxy } from 'pdfjs-dist/types/src/pdf';


@Component({
  selector: 'app-pdf-editor-navigator',
  standalone: true,
  imports: [NgClass, PdfViewerDirective],
  templateUrl: './pdf-editor-navigator.component.html',
  styleUrl: './pdf-editor-navigator.component.scss',
})
export class PdfEditorNavigatorComponent implements OnChanges {

  @Input() pages?: PDFPageProxy[] | null;  

  @Output() selectPage = new EventEmitter<PDFPageProxy>();

  selectedPage?: PDFPageProxy;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['pages'].currentValue) this.onSelectPage(changes['pages'].currentValue[0]);
  }
  
  onSelectPage = (page: PDFPageProxy) => {  this.selectedPage = page;  this.selectPage.emit(this.selectedPage); }

}

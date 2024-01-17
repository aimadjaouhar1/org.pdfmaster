import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PDFPageProxy } from 'pdfjs-dist/types/src/pdf';


@Component({
  selector: 'app-pdf-editor-navigator',
  standalone: true,
  imports: [NgClass],
  templateUrl: './pdf-editor-navigator.component.html',
  styleUrl: './pdf-editor-navigator.component.scss',
})
export class PdfEditorNavigatorComponent {

  @Input() pages?: PDFPageProxy[] | null;  

  @Output() selectPage = new EventEmitter<PDFPageProxy>();

  selectedPage?: PDFPageProxy;

  onSelectPage = (page: PDFPageProxy) => {  this.selectedPage = page;  this.selectPage.emit(this.selectedPage); }

}

import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { PDFPageProxy } from 'pdfjs-dist';
import { GetViewportParameters } from 'pdfjs-dist/types/src/display/api';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [TranslateModule, PdfViewerDirective, NgTemplateOutlet],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {

  @Input() pages!: PDFPageProxy[];
  @Input() currentPage?: PDFPageProxy;  

  @Output() zoomIn = new EventEmitter();
  @Output() zoomOut = new EventEmitter();

  numPage?: number;
  countPages?: number;

  viewportParams?: GetViewportParameters = { scale: 1 };
  maxScale = 2.6;
  minScale = 0.6;



  clickZoomIn = () => this.zoomIn.emit();

  clickZoomOut = () => this.zoomOut.emit();

  clickNextPage() {

  }

  clickPrevPage() {
    
  }
}

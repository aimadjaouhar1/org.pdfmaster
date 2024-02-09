import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
export class PdfViewerComponent implements OnChanges {

  @Input() pages!: PDFPageProxy[];
  @Input() currentPage?: PDFPageProxy;  

  @Output() dismiss = new EventEmitter();

  numPage?: number;
  countPages?: number;

  viewportParams?: GetViewportParameters = { scale: 1 };
  maxScale = 2.6;
  minScale = 0.6;


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['pages'].currentValue) this.countPages = this.pages.length > 0 ? this.pages.length : 1;
    if(changes['pages'].currentValue && changes['currentPage'].currentValue) this.numPage = this.pages.length > 0 ? this.pages.indexOf(this.currentPage!) : 1;
  }

  clickZoomIn() {
    this.viewportParams = { scale: this.viewportParams!.scale + 0.1 };
  }

  clickZoomOut() {
    this.viewportParams = { scale: this.viewportParams!.scale - 0.2};
  }

  clickDismiss = () => this.dismiss.emit();

  clickNextPage() {

  }

  clickPrevPage() {
    
  }
}

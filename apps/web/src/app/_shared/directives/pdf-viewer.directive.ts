import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PDFPageProxy } from 'pdfjs-dist';
import { GetViewportParameters } from 'pdfjs-dist/types/src/display/api';

@Directive({
  selector: '[appPdfViewer]',
  standalone: true
})
export class PdfViewerDirective implements OnChanges {

  @Input({required: true}) page?: PDFPageProxy;
  @Input() viewportParameters?: GetViewportParameters;

  @Input() width?: number | null;
  @Input() height?: number | null;


  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes['page'] && changes['page'].currentValue) this.renderPdf(changes['page'].currentValue);
    else if(this.page && changes['viewportParameters'] && changes['viewportParameters'].currentValue) this.renderPdf(this.page);
  }

  private renderPdf(page: PDFPageProxy) {
    const canvas: HTMLCanvasElement = this.el.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if(!this.viewportParameters) {
      const _scale = this.width! / page.getViewport({scale: 1}).width;
      this.viewportParameters = { scale: _scale };
    } 
    
    const viewport = page.getViewport(this.viewportParameters);

    canvas.width = this.width || viewport.width;
    canvas.height = this.height || viewport.height;
    
    page.render({canvasContext: context!, viewport: viewport});

  }
}

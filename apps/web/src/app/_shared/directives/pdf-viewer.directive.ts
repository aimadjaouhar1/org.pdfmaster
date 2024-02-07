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

  ngOnChanges(changes: SimpleChanges){
    if(changes['page'] && changes['page'].currentValue){
      const page = changes['page'].currentValue;

      const canvas: HTMLCanvasElement = this.el.nativeElement as HTMLCanvasElement;
      const context = canvas.getContext('2d');

      const _scale = this.width! / this.page!.getViewport({scale: 1}).width;

      if(!this.viewportParameters) {
       this.viewportParameters = { scale: _scale };
      } 
      
      const viewport = page.getViewport(this.viewportParameters);

      canvas.width = this.width || viewport.width;
      canvas.height = this.height || viewport.height;
      
      page.render({canvasContext: context, viewport: viewport});
    }
  }
}

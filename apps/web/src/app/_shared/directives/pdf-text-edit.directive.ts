import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

@Directive({
  selector: '[appPdfTextEdit]',
  standalone: true
})
export class PdfTextEditDirective implements OnChanges {
  
  @Input({required: true}) textItem!: TextItem;
  @Input({required: true}) scale!: number;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if(this.textItem && this.scale) {     
      const el: HTMLElement = this.el.nativeElement;       
        el.style.width = `${(this.textItem.width + 1) * this.scale}px`;
        el.style.height = `${(this.textItem.height + 3.40) * this.scale}px`;
        el.style.bottom = `${(this.textItem.transform[5] - 3.40) * this.scale}px`;
        el.style.left = `${(this.textItem.transform[4] - 1) * this.scale}px`;

        el.childNodes.forEach(node => {
          const child = node as HTMLElement;
          if(child.className == 'text-layer-action') {
            child.style.top = `${this.textItem.height}px`;
          }
        })
    }
  }

}

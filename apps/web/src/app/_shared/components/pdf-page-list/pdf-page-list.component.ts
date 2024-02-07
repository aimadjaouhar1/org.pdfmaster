import { Component, Input } from '@angular/core';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { PDFPageProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-page-list',
  standalone: true,
  imports: [PdfViewerDirective],
  templateUrl: './pdf-page-list.component.html',
  styleUrl: './pdf-page-list.component.scss',
})
export class PdfPageListComponent {

  @Input() pages?: PDFPageProxy[] | null;  

}

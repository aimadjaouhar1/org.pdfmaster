import { Component } from '@angular/core';
import { PdfSplitParamsComponent } from '@web/features/pdf-split/pdf-split-params/pdf-split-params.component';

@Component({
  selector: 'app-pdf-split',
  standalone: true,
  imports: [PdfSplitParamsComponent],
  templateUrl: './pdf-split.component.html',
  styleUrl: './pdf-split.component.scss',
})
export class PdfSplitComponent {}

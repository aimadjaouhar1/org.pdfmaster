import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-split-params',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './pdf-split-params.component.html',
  styleUrl: './pdf-split-params.component.scss',
})
export class PdfSplitParamsComponent {

  @Input({required: true}) pdfPages!: number;

  @Output() split = new EventEmitter<number>();

  interval!: number;
  pdfCount: number = 0;

  onClickSplit = () => this.split.emit(this.interval);
 
  updateValues() {
    this.pdfCount= this.interval ?  Math.ceil(this.pdfPages / this.interval) : 0;
  }
}

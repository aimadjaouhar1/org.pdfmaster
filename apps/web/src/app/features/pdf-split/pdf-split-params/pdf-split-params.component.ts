import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-split-params',
  standalone: true,
  imports: [NgClass, TranslateModule, ReactiveFormsModule],
  templateUrl: './pdf-split-params.component.html',
  styleUrl: './pdf-split-params.component.scss',
})
export class PdfSplitParamsComponent implements OnChanges {

  @Input({required: true}) pdfPages!: number;

  @Output() split = new EventEmitter<number>();

  pdfCount: number = 0;

  formBuilder = inject(FormBuilder);
  
  splitParamsForm = this.formBuilder.group({
    interval: [1],
  });

  get controls() {
    return this.splitParamsForm?.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['pdfPages'].currentValue) {
      this.controls.interval.addValidators(Validators.max(this.pdfPages));
      this.updateValues();
    }
  }
  onClickSplit = () =>  this.splitParamsForm.valid ? this.split.emit(this.splitParamsForm.getRawValue().interval!) : undefined;
 
  updateValues() {
    const interval = this.controls.interval.value;
    this.pdfCount = interval ?  Math.ceil(this.pdfPages / interval) : 0;
  }
}

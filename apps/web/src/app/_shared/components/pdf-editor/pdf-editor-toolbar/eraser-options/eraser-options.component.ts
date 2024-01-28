import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { EraserOptions } from '@web/app/types/pdf-editor.types';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-eraser-options',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './eraser-options.component.html',
  styleUrl: './eraser-options.component.scss',
})
export class EraserOptionsComponent implements OnChanges {

  @Input({required: true}) defaultEraserOptions!: EraserOptions;

  @Output() changeEraserOptions = new EventEmitter<EraserOptions>();

  formBuilder = inject(FormBuilder);
  
  eraserOptionsForm = this.formBuilder.group({
    size: [0],
  });

  get controls() {
    return this.eraserOptionsForm?.controls;
  }

  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'inside';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defaultEraserOptions'].isFirstChange()) {
      this.eraserOptionsForm.patchValue({
        size: this.defaultEraserOptions.size,
      });
    }
  }

  onSizeChanged() {
    this.changeEraserOptions.emit(this.eraserOptionsForm.getRawValue() as EraserOptions);
  }

}

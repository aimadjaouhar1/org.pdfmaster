import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { PenOptions } from '@web/app/types/pdf-editor.types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';


@Component({
  selector: 'app-pen-options',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, ColorPickerModule],
  templateUrl: './pen-options.component.html',
  styleUrl: './pen-options.component.scss',
})
export class PenOptionsComponent implements OnChanges {
  @Input({required: true}) defaultPenOptions!: PenOptions;

  @Output() changePenOptions = new EventEmitter<PenOptions>();

  color = '';

  formBuilder = inject(FormBuilder);
  
  penOptionsForm = this.formBuilder.group({
    size: [0],
    color: ''
  });

  get controls() {
    return this.penOptionsForm?.controls;
  }

  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'inside';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defaultPenOptions'].isFirstChange()) {
      this.penOptionsForm.patchValue({
        size: this.defaultPenOptions.size,
        color: this.defaultPenOptions.color
      });

      this.color = this.defaultPenOptions.color;
    }
  }

  onOptionsChanged() {
    this.changePenOptions.emit(this.penOptionsForm.getRawValue() as PenOptions);
  }

}

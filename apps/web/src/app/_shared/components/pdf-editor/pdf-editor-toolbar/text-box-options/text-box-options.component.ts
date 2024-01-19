import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxOptions } from '@web/app/types/pdf-editor.type';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-text-box-options',
  standalone: true,
  imports: [NgStyle, NgbDropdownModule, ColorPickerModule, ReactiveFormsModule],
  templateUrl: './text-box-options.component.html',
  styleUrl: './text-box-options.component.scss',
})
export class TextBoxOptionsComponent implements AfterViewInit, OnChanges {
  
  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();

  fonts: string[] = ['Arial', 'Comic'];

  font: string = '';
  size: number = 0;
  color: string = '';

  formBuilder = inject(FormBuilder);
  
  textBoxOptionForm = this.formBuilder.group({
    font: [this.font],
    size: [this.size],
    color: [this.color]
  });

  formValueChanges$ = this.textBoxOptionForm.valueChanges.pipe(takeUntilDestroyed());


  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'inside';

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defaultTextBoxOptions'].isFirstChange()) {

      console.log(changes['defaultTextBoxOptions'])

      this.font  = this.defaultTextBoxOptions!.font;
      this.size  = this.defaultTextBoxOptions!.size;
      this.color = this.defaultTextBoxOptions!.color;
  
      this.textBoxOptionForm.patchValue({
        font: this.font,
        size: this.size,
        color: this.color
      });
    }
  }

  ngAfterViewInit() {
    this.formValueChanges$.subscribe(() => this.changeTextBoxOptions.emit(this.textBoxOptionForm.getRawValue() as TextBoxOptions));
  }

}

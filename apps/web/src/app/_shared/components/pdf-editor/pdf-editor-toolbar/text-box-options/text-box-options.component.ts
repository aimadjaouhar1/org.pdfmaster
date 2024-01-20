import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxOptions } from '@web/app/types/pdf-editor.type';
import { ColorPickerModule } from 'ngx-color-picker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-text-box-options',
  standalone: true,
  imports: [NgStyle, NgbDropdownModule, ColorPickerModule, ReactiveFormsModule],
  templateUrl: './text-box-options.component.html',
  styleUrl: './text-box-options.component.scss',
})
export class TextBoxOptionsComponent implements AfterViewInit, OnChanges {
  
  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Input() selectedTextBoxOptions$!: Observable<TextBoxOptions>;

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


  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'inside';

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defaultTextBoxOptions'].isFirstChange()) {
      this.updateAll(this.defaultTextBoxOptions);
    }
  }

  ngAfterViewInit() {
    this.selectedTextBoxOptions$.subscribe((textBoxOptions: TextBoxOptions) => this.updateAll(textBoxOptions));
  }

  onSelectedFont(font: string) {
    this.font = font;
    this.textBoxOptionForm.patchValue({font: this.font});
    this.onOptionsChanged();
  }

  onOptionsChanged() {
    this.changeTextBoxOptions.emit(this.textBoxOptionForm.getRawValue() as TextBoxOptions);
  }

  private updateAll(textBoxOption: TextBoxOptions) {
    this.font  = textBoxOption!.font;
    this.size  = textBoxOption!.size;
    this.color = textBoxOption!.color;

    this.textBoxOptionForm.patchValue({
      font: this.font,
      size: this.size,
      color: this.color
    });
  }

}

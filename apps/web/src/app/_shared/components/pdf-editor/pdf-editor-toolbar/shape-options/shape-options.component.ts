import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { ShapeOptions } from '@web/app/types/pdf-editor.types';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdownConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-shape-options',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, ColorPickerModule, NgbTooltip],
  templateUrl: './shape-options.component.html',
  styleUrl: './shape-options.component.scss',
})
export class ShapeOptionsComponent implements OnChanges, AfterViewInit {
  @Input({required: true}) defaultShapeOptions!: ShapeOptions;

  @Input() selectedShapeOptions$!: Observable<ShapeOptions>;

  @Input() selectedShape?: string;


  @Output() changeShapeOptions = new EventEmitter<ShapeOptions>();

  fonts: string[] = ['Arial', 'Comic'];

  color: string = '';
  stroke: string = '';
  strokeWidth: number | undefined = 0;

  formBuilder = inject(FormBuilder);
  
  shapeOptionsForm = this.formBuilder.group({
    color: [this.color],
    stroke: [this.stroke],
    strokeWidth: [this.strokeWidth],
    shape: [this.selectedShape]
  });

  formValueChanges$ = this.shapeOptionsForm.valueChanges.pipe(takeUntilDestroyed());


  constructor(config: NgbDropdownConfig) {
    config.autoClose = 'inside';

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['defaultShapeOptions']?.isFirstChange() || changes['selectedShape']) {
      this.updateAll(this.defaultShapeOptions);
    }
  }

  ngAfterViewInit() {
    this.formValueChanges$.subscribe(() => this.changeShapeOptions.emit(this.shapeOptionsForm.getRawValue() as ShapeOptions));
    this.selectedShapeOptions$.subscribe((shapeOptions: ShapeOptions) => this.updateAll(shapeOptions));
  }

  onOptionsChanged() {
    this.changeShapeOptions.emit(this.shapeOptionsForm.getRawValue() as ShapeOptions);
  }

  private updateAll(shapeOptions: ShapeOptions) {
    this.color = shapeOptions!.color;
    this.stroke = shapeOptions!.stroke;
    this.strokeWidth = shapeOptions!.strokeWidth;

    this.shapeOptionsForm.patchValue({
      color: this.color,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      shape: this.selectedShape
    });
  }

}

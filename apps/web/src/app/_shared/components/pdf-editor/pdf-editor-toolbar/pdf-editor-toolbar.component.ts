import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdown, NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EraserOptions, PenOptions, ShapeOptions, TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { EraserOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/eraser-options/eraser-options.component';
import { PenOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pen-options/pen-options.component';
import { ShapeOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/shape-options/shape-options.component';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent, EraserOptionsComponent, PenOptionsComponent, ShapeOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent implements AfterViewInit {

  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Input({required: true}) defaultEraserOptions!: EraserOptions;

  @Input({required: true}) defaultPenOptions!: PenOptions;

  @Input({required: true}) defaultShapeOptions!: ShapeOptions;
  
  @Input() showTextBoxOptions$?: Observable<TextBoxOptions>;

  @Input() showShapeOptions$?: Observable<ShapeOptions>;

  @Input() hideAllOptions$?: Observable<void>;

  @Output() undo = new EventEmitter();

  @Output() redo = new EventEmitter();

  @Output() selectedTool = new EventEmitter<ToolData | undefined>();

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();

  @Output() changeEraserOptions = new EventEmitter<EraserOptions>();

  @Output() changePenOptions = new EventEmitter<PenOptions>();

  @Output() chageShapeOptions = new EventEmitter<ShapeOptions>();


  @ViewChild('textboxdp') public textboxdp!: NgbDropdown;
  @ViewChild('eraserdp') public eraserdp!: NgbDropdown;
  @ViewChild('pendp') public pendp!: NgbDropdown;
  @ViewChild('shapesdp') public shapesdp!: NgbDropdown;
  @ViewChild('shapesOptionsdp') public shapesOptionsdp!: NgbDropdown;

  selectedTextBoxOptions$ = new Subject<TextBoxOptions>;
  selectedShapeOptions$ = new Subject<ShapeOptions>;

  dropdownState$ = new Subject<{dp: NgbDropdown, action: 'toggle' | 'open'}>();

  selectedShape?: string;


  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose = false;

    this.dropdownState$
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        [this.textboxdp, this.eraserdp, this.pendp, this.shapesdp, this.shapesOptionsdp].filter(dp => dp != state.dp).forEach(dp => dp.close());
        if(state.action == 'open') {
          state.dp.open();
        } else if(state.action == 'toggle') {
          state.dp.toggle();
        }
      })
  }
  
  ngAfterViewInit(): void {
    this.showTextBoxOptions$?.subscribe((textBoxOptions: TextBoxOptions) => { 
      this.selectedTextBoxOptions$.next(textBoxOptions);
      this.dropdownState$.next({dp: this.textboxdp, action: 'open'});

    })

    this.showShapeOptions$?.subscribe((shapeOptions: ShapeOptions) => {
      this.selectedShapeOptions$.next(shapeOptions);
      this.shapesOptionsdp.autoClose = false;
      this.dropdownState$.next({dp: this.shapesOptionsdp, action: 'open'});
    });

    this.hideAllOptions$?.subscribe(() => [this.textboxdp, this.eraserdp, this.pendp, this.shapesdp, this.shapesOptionsdp].forEach(dp => dp.close()));
  }

  clickUndo = () => this.undo.emit();

  clickRedo = () => this.redo.emit();

  clickTextBox() {
    this.dropdownState$.next({dp: this.textboxdp, action: 'toggle'})
    this.selectedTool.emit({cursor: 'text', type: 'text'});
  };

  clickEraser() {
    this.dropdownState$.next({dp: this.eraserdp, action: 'toggle'});
    this.selectedTool.emit({cursor: '', type: 'eraser'});
  };

  clickPen() {
    this.dropdownState$.next({dp: this.pendp, action: 'toggle'});
    this.selectedTool.emit({cursor: '', type: 'pen'});
  }

  clickShapes() {
    this.shapesdp.autoClose = 'outside';
    this.dropdownState$.next({dp: this.shapesdp, action: 'toggle'}); 
    this.selectedTool.emit(undefined);
  }

  selectShape(shape: string) {
    this.selectedShape = shape;
    this.shapesdp.close();
    
    this.shapesOptionsdp.autoClose = 'outside';
    this.shapesOptionsdp.open();

    this.selectedTool.emit({cursor: '', type: this.selectedShape});
  }

  onChangeTextBoxOptions = (textBoxOptions: TextBoxOptions) => this.changeTextBoxOptions.emit(textBoxOptions);

  onChangeEraserOptions = (eraserOptions: EraserOptions) => this.changeEraserOptions.emit(eraserOptions);

  onChangePenOptions = (penOptions: PenOptions) => this.changePenOptions.emit(penOptions);

  onChangeShapesOptions = (shapeOptions: ShapeOptions) => this.chageShapeOptions.emit(shapeOptions);


}

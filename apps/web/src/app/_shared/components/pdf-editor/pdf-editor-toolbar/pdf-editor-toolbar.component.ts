import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdown, NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EraserOptions, PenOptions, TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { EraserOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/eraser-options/eraser-options.component';
import { PenOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pen-options/pen-options.component';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent, EraserOptionsComponent, PenOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent implements AfterViewInit {

  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Input({required: true}) defaultEraserOptions!: EraserOptions;

  @Input({required: true}) defaultPenOptions!: PenOptions;

  @Input() showTextBoxOptions$?: Observable<TextBoxOptions>;

  @Output() undo = new EventEmitter();

  @Output() redo = new EventEmitter();

  @Output() selectedTool = new EventEmitter<ToolData>();

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();

  @Output() changeEraserOptions = new EventEmitter<EraserOptions>();

  @Output() changePenOptions = new EventEmitter<PenOptions>();


  @ViewChild('textboxdp') public textboxdp!: NgbDropdown;
  @ViewChild('eraserdp') public eraserdp!: NgbDropdown;
  @ViewChild('pendp') public pendp!: NgbDropdown;


  selectedTextBoxOptions$ = new Subject<TextBoxOptions>;
  
  dropdownState$ = new Subject<NgbDropdown>();


  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose = false;

    this.dropdownState$
      .pipe(takeUntilDestroyed())
      .subscribe(dropdown => {
        [this.textboxdp, this.eraserdp, this.pendp].filter(dp => dp != dropdown).forEach(dp => dp.close());
        dropdown.toggle();
      })
  }
  
  ngAfterViewInit(): void {
    this.showTextBoxOptions$?.subscribe((textBoxOptions: TextBoxOptions) => { 
      this.selectedTextBoxOptions$.next(textBoxOptions);
      this.textboxdp.open(); 
    })
  }

  clickUndo = () => this.undo.emit();

  clickRedo = () => this.redo.emit();

  clickTextBox() {
    this.dropdownState$.next(this.textboxdp)
    this.selectedTool.emit({cursor: 'text', type: 'text'});
  };

  clickEraser() {
    this.dropdownState$.next(this.eraserdp);
    this.selectedTool.emit({cursor: '', type: 'eraser'});
  };

  clickPen() {
    this.dropdownState$.next(this.pendp);
    this.selectedTool.emit({cursor: '', type: 'pen'});
  }

  onChangeTextBoxOptions = (textBoxOptions: TextBoxOptions) => this.changeTextBoxOptions.emit(textBoxOptions);

  onChangeEraserOptions = (eraserOptions: EraserOptions) => this.changeEraserOptions.emit(eraserOptions);

  onChangePenOptions = (penOptions: PenOptions) => this.changePenOptions.emit(penOptions);

}

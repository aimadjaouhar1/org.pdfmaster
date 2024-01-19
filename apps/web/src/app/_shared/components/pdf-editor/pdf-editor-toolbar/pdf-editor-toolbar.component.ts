import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdown, NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EraserOptions, TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { EraserOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/eraser-options/eraser-options.component';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent, EraserOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent implements AfterViewInit {

  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Input({required: true}) defaultEraserOptions!: EraserOptions;

  @Input() showTextBoxOptions$?: Subject<TextBoxOptions>;

  @Output() undo = new EventEmitter();

  @Output() redo = new EventEmitter();

  @Output() selectedTool = new EventEmitter<ToolData>();

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();

  @Output() changeEraserOptions = new EventEmitter<EraserOptions>();


  @ViewChild('textboxdp') public textboxdp!: NgbDropdown;
  @ViewChild('eraserdp') public eraserdp!: NgbDropdown;


  selectedTextBoxOptions$ = new Subject<TextBoxOptions>;
  
  dropdownState$ = new Subject<NgbDropdown>();


  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose = false;

    this.dropdownState$
      .pipe(takeUntilDestroyed())
      .subscribe(dropdown => {
        [this.textboxdp, this.eraserdp].filter(dp => dp != dropdown).forEach(dp => dp.close());
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
    this.dropdownState$.next(this.eraserdp)
    this.selectedTool.emit({cursor: '', type: 'eraser'});
  };

  onChangeTextBoxOptions = (textBoxOptions: TextBoxOptions) => this.changeTextBoxOptions.emit(textBoxOptions);

  onChangeEraserOptions = (eraserOptions: EraserOptions) => this.changeEraserOptions.emit(eraserOptions);


}

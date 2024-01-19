import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent implements AfterViewInit {

  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Input() showTextBoxOptions$?: Subject<TextBoxOptions>;

  @Output() undo = new EventEmitter();

  @Output() redo = new EventEmitter();

  @Output() selectedTool = new EventEmitter<ToolData>();

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();


  @ViewChild(NgbDropdown, { static: true }) public textboxdp!: NgbDropdown;
  

  selectedTextBoxOptions$ = new Subject<TextBoxOptions>;


  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose = false;
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
    this.textboxdp.toggle();
    this.selectedTool.emit({cursor: 'text', type: 'text'});
  };

  onChangeTextBoxOptions = (textBoxOptions: TextBoxOptions) => this.changeTextBoxOptions.emit(textBoxOptions);

}

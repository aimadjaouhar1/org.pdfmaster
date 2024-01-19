import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';


@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent {

  @Input({required: true}) defaultTextBoxOptions!: TextBoxOptions;

  @Output() undo = new EventEmitter();

  @Output() redo = new EventEmitter();

  @Output() selectedTool = new EventEmitter<ToolData>();

  @Output() changeTextBoxOptions = new EventEmitter<TextBoxOptions>();
  

  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose = 'outside';
  }

  clickUndo = () => this.undo.emit();

  clickRedo = () => this.redo.emit();

  clickTextBox = () => this.selectedTool.emit({cursor: 'text', type: 'text'});

  onChangeTextBoxOptions = (textBoxOptions: TextBoxOptions) => this.changeTextBoxOptions.emit(textBoxOptions);

}

import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxOptionsComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/text-box-options/text-box-options.component';

@Component({
  selector: 'app-pdf-editor-toolbar',
  standalone: true,
  imports: [NgbDropdownModule, TextBoxOptionsComponent],
  templateUrl: './pdf-editor-toolbar.component.html',
  styleUrl: './pdf-editor-toolbar.component.scss',
})
export class PdfEditorToolbarComponent {

  @Output() selectedTool = new EventEmitter();

  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom';
    config.container = null;
    config.autoClose;

  }

  clickTextBox = () => this.selectedTool.emit({cursor: 'text', type: 'text'});

}

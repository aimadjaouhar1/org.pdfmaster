import { Component } from '@angular/core';
import { PdfEditorNavigatorComponent } from '@web/shared/components/pdf-editor/pdf-editor-navigator/pdf-editor-navigator.component';
import { PdfEditorToolbarComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pdf-editor-toolbar.component';

@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [PdfEditorToolbarComponent, PdfEditorNavigatorComponent],
  templateUrl: './pdf-editor.component.html',
  styleUrl: './pdf-editor.component.scss',
})
export class PdfEditorComponent {}

import { Component } from '@angular/core';
import { PdfEditorComponent } from '@web/shared/components/pdf-editor/pdf-editor.component';

@Component({
  selector: 'app-pdf-edit',
  standalone: true,
  imports: [PdfEditorComponent],
  templateUrl: './pdf-edit.component.html',
  styleUrl: './pdf-edit.component.scss'
})
export class PdfEditComponent {

}

import { Component } from '@angular/core';
import { FileUploadDropzoneComponent } from '@web/shared/components/file-upload-dropzone/file-upload-dropzone.component';
import { PdfEditorComponent } from '@web/shared/components/pdf-editor/pdf-editor.component';

@Component({
  selector: 'app-pdf-edit',
  standalone: true,
  imports: [PdfEditorComponent, FileUploadDropzoneComponent],
  templateUrl: './pdf-edit.component.html',
  styleUrl: './pdf-edit.component.scss'
})
export class PdfEditComponent {

  pdfFile?: File;
  
  onSelectFiles(files: File[]) {
    this.pdfFile = files[0];
  }

}

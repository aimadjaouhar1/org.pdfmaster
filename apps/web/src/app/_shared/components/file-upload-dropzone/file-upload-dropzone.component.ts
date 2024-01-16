import { Component } from '@angular/core';
import { FileUploadDropzoneDirective } from '@web/shared/directives/file-upload-dropzone.directive';

@Component({
  selector: 'app-file-upload-dropzone',
  standalone: true,
  imports: [FileUploadDropzoneDirective],
  templateUrl: './file-upload-dropzone.component.html',
  styleUrl: './file-upload-dropzone.component.scss'
})
export class FileUploadDropzoneComponent {

  openFileHandler(target: EventTarget | null) {
    const files = Array.from((target as HTMLInputElement).files || []);
    console.log(files);
  }
}

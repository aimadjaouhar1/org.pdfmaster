import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FileMimeType } from '@shared-lib/enums';
import { FileUploadDropzoneDirective } from '@web/shared/directives/file-upload-dropzone.directive';

@Component({
  selector: 'app-file-upload-dropzone',
  standalone: true,
  imports: [FileUploadDropzoneDirective, TranslateModule],
  templateUrl: './file-upload-dropzone.component.html',
  styleUrl: './file-upload-dropzone.component.scss'
})
export class FileUploadDropzoneComponent {

  @Input() accept?: FileMimeType[];

  @Output() selectFiles = new EventEmitter<File[]>();

  openFileHandler(target: EventTarget | null) {
    const files = Array.from((target as HTMLInputElement).files || []);
    this.selectFiles.emit(files);
  }

  dropFileHandler(fileList: FileList | null) {
    const files = Array.from(fileList || []);
    this.selectFiles.emit(files);
  }
}

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileUploadDropzone]',
  standalone: true
})
export class FileUploadDropzoneDirective {

  @HostBinding('class.fileover') fileOver?: boolean;
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public ondrop(evt: { dataTransfer: DataTransfer } & Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}

import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '@web/shared/pipes/file-size.pip';

@Component({
  selector: 'app-pdf-download-result-modal',
  standalone: true,
  imports: [TranslateModule, FileSizePipe],
  templateUrl: './pdf-download-result-modal.component.html',
  styleUrl: './pdf-download-result-modal.component.scss'
})
export class PdfDownloadResultModalComponent {

  @Input() title?: string;
  @Input() content?: string;
  @Input() fileInfos?: {name: string, pages: number, size: number}[]; 
  @Input() download?: {url: string, filename: string};

  onClickDownload() {
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = this.download!.url;
    link.download = this.download!.filename;
    link.click();
  }

}

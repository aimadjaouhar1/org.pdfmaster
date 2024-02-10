import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '@web/shared/pipes/file-size.pip';

@Component({
  selector: 'app-pdf-download-result-modal',
  standalone: true,
  imports: [TranslateModule, FileSizePipe],
  templateUrl: './pdf-download-result-modal.component.html',
  styleUrl: './pdf-download-result-modal.component.scss'
})
export class PdfDownloadResultModalComponent implements OnChanges {

  @Input() title?: string;
  @Input() content?: string;
  @Input() fileInfos?: {name: string, pages: number, size: number}[]; 
  @Input() download?: {url: string, filename: string};

  @ViewChild('downloadBtnEl') downloadBtnEl!: HTMLAnchorElement;
  

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['download'].currentValue) {
      this.downloadBtnEl.href = this.download!.url;
      this.downloadBtnEl.download = this.download!.filename;
    }
  }
  
}

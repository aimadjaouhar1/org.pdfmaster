import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '@web/shared/pipes/file-size.pip';

@Component({
  selector: 'app-pdf-split-success',
  standalone: true,
  imports: [FileSizePipe, TranslateModule],
  templateUrl: './pdf-split-success-modal.component.html',
  styleUrl: './pdf-split-success-modal.component.scss'
})
export class PdfSplitSuccessModalComponent implements OnChanges {

  @Input() zipFileInfos?: {name: string, pages: number, size: number}[]; 

  @Input() download?: {url: string, filename: string};

  @ViewChild('downloadBtnEl') downloadBtnEl!: HTMLAnchorElement;
  

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['download'].currentValue) {
      this.downloadBtnEl.href = this.download!.url;
      this.downloadBtnEl.download = this.download!.filename;
    }
  }

}

import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DragAndDropReorderDirective } from '@web/shared/directives/drag-and-drop-reorder.directive';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { PDFPageProxy } from 'pdfjs-dist';

enum PageActionButton {
  DELETE = 'delete',
  PREVIEW = 'preview',
  DUPLICATE = 'duplicate'
}

@Component({
  selector: 'app-pdf-page-list',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, FormsModule, PdfViewerDirective, NgbTooltip, TranslateModule, DragAndDropReorderDirective],
  templateUrl: './pdf-page-list.component.html',
  styleUrl: './pdf-page-list.component.scss',
})
export class PdfPageListComponent implements OnChanges {
  @Input({ required: true }) pages?: PDFPageProxy[] | null;

  @Input() pageActionButtons?: PageActionButton[] | ('delete' | 'preview' | 'duplicate')[];
  @Input() selection: boolean = false;
  @Input() dragAndDropReorder = false;
  @Input() selectAll = false;

  @Output() preview = new EventEmitter<PDFPageProxy>();
  @Output() duplicate = new EventEmitter<PDFPageProxy>();
  @Output() delete = new EventEmitter<number>();
  @Output() selectedPagesChange = new EventEmitter<PDFPageProxy[]>();

  showDelete = false;
  showDuplicate = false;
  showPreview = false;
  showActionBtns =  false;

  pagesSelection?: boolean[];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['pageActionButtons']?.currentValue) {
      this.showDelete = this.pageActionButtons!.includes(PageActionButton.DELETE);
      this.showDuplicate = this.pageActionButtons!.includes(PageActionButton.DUPLICATE);
      this.showPreview = this.pageActionButtons!.includes(PageActionButton.PREVIEW);
      this.showActionBtns = this.pageActionButtons!.length > 0;
    }

    if(this.selection && changes['pages']?.currentValue) {
      this.pagesSelection = Array(this.pages?.length).fill(false);
    }

    if(changes['selectAll']) {
      this.pagesSelection = Array(this.pages?.length).fill(this.selectAll);
      this.onSelectPageChange();
    }
  }

  onClickPreview = (page: PDFPageProxy) => this.preview.emit(page);

  onClickDuplicate = (page: PDFPageProxy) => this.duplicate.emit(page);

  onClickDelete = (index: number) => this.delete.emit(index);

  onSelectPageChange = () =>  {
    const selectedPages = this.pagesSelection!.map((selected, index) => { return selected ? this.pages![index] : undefined }).filter(page => page) as PDFPageProxy[];
    this.selectedPagesChange.emit(selectedPages);
  }
}



import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-extract-params',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './pdf-extract-params.component.html',
  styleUrl: './pdf-extract-params.component.scss'
})
export class PdfExtractParamsComponent {

  @Input({required: true}) pagesCount!: number;
  @Input({required: true}) selectedPagesCount!: number;
  
  @Output() extract = new EventEmitter<{selectAll: boolean, separate: boolean}>();
  @Output() selectAllChange = new EventEmitter<boolean>();

  selectAll = false;
  separate = false;

  onClickExtract = () => this.extract.emit({selectAll: this.selectAll, separate: this.separate})
  
  onSelectAllChange = () => { 
    this.selectedPagesCount = this.selectAll ? this.pagesCount : this.selectedPagesCount;
    this.separate = this.selectAll ? this.separate : false;
    this.selectAllChange.emit(this.selectAll); 
  }

}

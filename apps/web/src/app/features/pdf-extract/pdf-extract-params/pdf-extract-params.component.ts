import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-extract-params',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './pdf-extract-params.component.html',
  styleUrl: './pdf-extract-params.component.scss'
})
export class PdfExtractParamsComponent {
  
  formBuilder = inject(FormBuilder);
  
  extractParamsForm = this.formBuilder.group({});

  get controls() {
    return this.extractParamsForm?.controls;
  }

  onClickExtract() {
  }
  
}

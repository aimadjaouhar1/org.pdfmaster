import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfExtractParamsComponent } from './pdf-extract-params.component';

describe('PdfExtractParamsComponent', () => {
  let component: PdfExtractParamsComponent;
  let fixture: ComponentFixture<PdfExtractParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfExtractParamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfExtractParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

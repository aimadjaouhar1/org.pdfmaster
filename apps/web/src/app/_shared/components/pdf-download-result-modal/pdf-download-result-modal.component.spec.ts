import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfDownloadResultModalComponent } from './pdf-download-result-modal.component';

describe('PdfDownloadResultModalComponent', () => {
  let component: PdfDownloadResultModalComponent;
  let fixture: ComponentFixture<PdfDownloadResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfDownloadResultModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfDownloadResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

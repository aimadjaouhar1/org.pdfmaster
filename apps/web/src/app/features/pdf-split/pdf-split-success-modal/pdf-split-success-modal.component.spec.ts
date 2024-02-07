import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfSplitSuccessModalComponent } from './pdf-split-success-modal.component';

describe('PdfSplitSuccessComponent', () => {
  let component: PdfSplitSuccessModalComponent;
  let fixture: ComponentFixture<PdfSplitSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfSplitSuccessModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfSplitSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

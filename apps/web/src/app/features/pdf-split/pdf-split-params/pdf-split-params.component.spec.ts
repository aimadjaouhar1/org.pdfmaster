import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfSplitParamsComponent } from './pdf-split-params.component';

describe('PdfSplitParamsComponent', () => {
  let component: PdfSplitParamsComponent;
  let fixture: ComponentFixture<PdfSplitParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfSplitParamsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfSplitParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfPageListComponent } from './pdf-page-list.component';

describe('PdfPageListComponent', () => {
  let component: PdfPageListComponent;
  let fixture: ComponentFixture<PdfPageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

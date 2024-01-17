import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfEditorToolbarComponent } from './pdf-editor-toolbar.component';

describe('PdfEditorToolbarComponent', () => {
  let component: PdfEditorToolbarComponent;
  let fixture: ComponentFixture<PdfEditorToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfEditorToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfEditorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

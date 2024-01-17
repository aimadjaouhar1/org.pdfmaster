import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfEditorNavigatorComponent } from './pdf-editor-navigator.component';

describe('PdfEditorNavigatorComponent', () => {
  let component: PdfEditorNavigatorComponent;
  let fixture: ComponentFixture<PdfEditorNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfEditorNavigatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfEditorNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

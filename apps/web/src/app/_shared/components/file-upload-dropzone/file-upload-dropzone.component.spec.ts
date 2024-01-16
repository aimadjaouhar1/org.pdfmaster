import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadDropzoneComponent } from './file-upload-dropzone.component';

describe('FileUploadDropzoneComponent', () => {
  let component: FileUploadDropzoneComponent;
  let fixture: ComponentFixture<FileUploadDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadDropzoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

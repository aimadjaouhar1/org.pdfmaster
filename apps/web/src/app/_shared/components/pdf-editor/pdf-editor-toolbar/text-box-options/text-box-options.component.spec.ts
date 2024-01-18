import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextBoxOptionsComponent } from './text-box-options.component';

describe('TextBoxOptionsComponent', () => {
  let component: TextBoxOptionsComponent;
  let fixture: ComponentFixture<TextBoxOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBoxOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextBoxOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

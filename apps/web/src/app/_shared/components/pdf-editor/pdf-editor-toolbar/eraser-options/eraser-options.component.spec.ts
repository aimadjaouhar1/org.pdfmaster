import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EraserOptionsComponent } from './eraser-options.component';

describe('EraserOptionsComponent', () => {
  let component: EraserOptionsComponent;
  let fixture: ComponentFixture<EraserOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EraserOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EraserOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

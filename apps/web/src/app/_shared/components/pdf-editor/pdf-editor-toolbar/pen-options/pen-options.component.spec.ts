import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenOptionsComponent } from './pen-options.component';

describe('PenOptionsComponent', () => {
  let component: PenOptionsComponent;
  let fixture: ComponentFixture<PenOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PenOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ex03Surface } from './ex03-surface';

describe('Ex03Surface', () => {
  let component: Ex03Surface;
  let fixture: ComponentFixture<Ex03Surface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ex03Surface],
    }).compileComponents();

    fixture = TestBed.createComponent(Ex03Surface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

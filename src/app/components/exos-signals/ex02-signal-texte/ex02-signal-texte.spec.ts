import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ex02SignalTexte } from './ex02-signal-texte';

describe('Ex02SignalTexte', () => {
  let component: Ex02SignalTexte;
  let fixture: ComponentFixture<Ex02SignalTexte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ex02SignalTexte],
    }).compileComponents();

    fixture = TestBed.createComponent(Ex02SignalTexte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

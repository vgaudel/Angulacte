import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ex01Compteur } from './ex01-compteur';

describe('Ex01Compteur', () => {
  let component: Ex01Compteur;
  let fixture: ComponentFixture<Ex01Compteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ex01Compteur],
    }).compileComponents();

    fixture = TestBed.createComponent(Ex01Compteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

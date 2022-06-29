import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoroscopeTableComponent } from './horoscope-table.component';

describe('HoroscopeTableComponent', () => {
  let component: HoroscopeTableComponent;
  let fixture: ComponentFixture<HoroscopeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoroscopeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoroscopeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

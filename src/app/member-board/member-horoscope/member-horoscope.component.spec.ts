import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHoroscopeComponent } from './member-horoscope.component';

describe('MemberHoroscopeComponent', () => {
  let component: MemberHoroscopeComponent;
  let fixture: ComponentFixture<MemberHoroscopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberHoroscopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberHoroscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

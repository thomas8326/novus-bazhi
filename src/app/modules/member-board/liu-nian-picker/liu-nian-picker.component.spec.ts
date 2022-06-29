import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiuNianPickerComponent } from './liu-nian-picker.component';

describe('LiuNianPickerComponent', () => {
  let component: LiuNianPickerComponent;
  let fixture: ComponentFixture<LiuNianPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiuNianPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiuNianPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

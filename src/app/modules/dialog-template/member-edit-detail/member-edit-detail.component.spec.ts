import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEditDetailComponent } from './member-edit-detail.component';

describe('MemberEditDetailComponent', () => {
  let component: MemberEditDetailComponent;
  let fixture: ComponentFixture<MemberEditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberEditDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

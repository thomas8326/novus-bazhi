import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberControlPanelComponent } from './member-control-panel.component';

describe('MemberControlPanelComponent', () => {
  let component: MemberControlPanelComponent;
  let fixture: ComponentFixture<MemberControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberControlPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

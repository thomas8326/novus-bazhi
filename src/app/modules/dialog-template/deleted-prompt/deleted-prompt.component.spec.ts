import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedPromptComponent } from './deleted-prompt.component';

describe('DeletedPromptComponent', () => {
  let component: DeletedPromptComponent;
  let fixture: ComponentFixture<DeletedPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

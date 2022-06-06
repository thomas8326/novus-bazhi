import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadPropertyChartComponent } from './bad-property-chart.component';

describe('BadPropertyChartComponent', () => {
  let component: BadPropertyChartComponent;
  let fixture: ComponentFixture<BadPropertyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadPropertyChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadPropertyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

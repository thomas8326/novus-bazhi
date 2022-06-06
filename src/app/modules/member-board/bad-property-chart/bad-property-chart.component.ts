import { Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

const MAX_BAD_PROPERTY_COUNT = 5;

@Component({
  selector: 'app-bad-property-chart',
  templateUrl: './bad-property-chart.component.html',
  styleUrls: ['./bad-property-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadPropertyChartComponent implements AfterViewInit {

  @Input() badPropertyMappingList: { key: string, badProperty: string }[] = [];
  @ViewChild('chartContainer') chartContainer?: ElementRef;

  elements: { item: { key: string, badProperty: string }; top: number; left: number; angular: number }[] = [];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.elements = this.generateCycle(this.badPropertyMappingList);
    this.changeDetectorRef.detectChanges();
  }

  generateCycle(
    selectedList: { key: string, badProperty: string }[],
  ): { item: { key: string, badProperty: string }; top: number; left: number; angular: number }[] {
    if (!this.chartContainer) {
      throw new Error('Can not get the ViewChild of charContainer');
    }

    const containerX = 30;
    const containerY = 30;
    const xRadio = this.chartContainer.nativeElement.offsetWidth / (containerX * 2);
    const yRadio = this.chartContainer.nativeElement.offsetHeight / (containerY * 2);
    const circleAngular = 360 / MAX_BAD_PROPERTY_COUNT;
    const circleHeight = (circleAngular * Math.PI) / 180;

    return selectedList.map((item, index) => {
      const left = (Math.sin(circleHeight * index) * containerX + containerX) * xRadio;
      const top = (Math.cos(circleHeight * index) * containerY + containerY) * yRadio;

      return { item, top, left, angular: circleAngular };
    });
  }

}

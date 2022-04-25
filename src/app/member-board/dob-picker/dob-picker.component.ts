import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD HH:mm',
  },
  display: {
    dateInput: 'YYYY/MM/DD HH:mm',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM',
  },
};

export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DobPickerComponent),
  multi: true,
};

@UntilDestroy()
@Component({
  selector: 'app-dob-picker',
  templateUrl: './dob-picker.component.html',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, VALUE_ACCESSOR],
  styleUrls: ['./dob-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DobPickerComponent implements AfterViewInit, OnInit, ControlValueAccessor {
  @ViewChild('formField') formField!: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_date?: any) => {};

  lessThanNextYear = (d: Moment | null): boolean => {
    const current = moment();
    const year = (d || current).year();
    // Prevent Saturday and Sunday from being selected.
    return year <= current.year() + 1;
  };

  isOpen = false;

  date = new FormControl('');

  ngOnInit(): void {
    this.date.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => this.onChange(value));
  }

  ngAfterViewInit() {
    // this.onChange(this.date.value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {
    // Do nothing
  }

  writeValue(time: string) {
    console.log('date', this.date.value);
    console.log('time ', time);
    this.date.setValue(moment(time, ['YYYY/MM/DD HH:mm']));
  }

  get currentHour() {
    return this.date.value.hour();
  }

  get currentMinute() {
    return this.date.value.minute();
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
  }

  addHour(time: number) {
    this.date.value.add(time, 'hours');
    this.date.setValue(this.date.value);
  }

  addMinute(time: number) {
    this.date.value.add(time, 'minutes');
    this.date.setValue(this.date.value);
  }

  changeHour(time: string) {
    this.date.value.hour(time);
    this.date.setValue(this.date.value);
  }

  changeMinute(time: string) {
    this.date.value.minute(time);
    this.date.setValue(this.date.value);
  }
}

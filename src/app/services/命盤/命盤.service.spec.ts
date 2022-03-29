import { TestBed } from '@angular/core/testing';

import { 命盤服務器 } from './命盤.service';

describe('命盤Service', () => {
  let service: 命盤服務器;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(命盤服務器);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

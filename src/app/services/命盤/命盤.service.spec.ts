import { TestBed } from '@angular/core/testing';

import { 命盤Service } from './命盤.service';

describe('命盤Service', () => {
  let service: 命盤Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(命盤Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

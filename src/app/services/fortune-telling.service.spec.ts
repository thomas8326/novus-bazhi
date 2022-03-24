import { TestBed } from '@angular/core/testing';

import { FortuneTellingService } from './fortune-telling.service';

describe('FortuneTellingService', () => {
  let service: FortuneTellingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FortuneTellingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HiveService } from './hive.service';

describe('HiveService', () => {
  let service: HiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

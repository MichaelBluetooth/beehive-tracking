import { TestBed } from '@angular/core/testing';

import { HiveTabsService } from './hive-tabs.service';

describe('HiveTabsService', () => {
  let service: HiveTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveTabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

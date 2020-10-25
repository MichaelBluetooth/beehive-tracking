import { TestBed } from '@angular/core/testing';

import { DeleteHiveDataService } from './delete-hive-data.service';

xdescribe('DeleteHiveService', () => {
  let service: DeleteHiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteHiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

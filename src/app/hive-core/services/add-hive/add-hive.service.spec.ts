import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocalHiveDataService } from '../local-hive-data/local-hive-data.service';

import { AddHiveService } from './add-hive.service';

describe('AddHiveService', () => {
  let service: AddHiveService;
  let mockLocalData: any;

  beforeEach(() => {
    mockLocalData = jasmine.createSpyObj('localHiveService', ['createHive']);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: LocalHiveDataService, useValue: mockLocalData}
      ]
    });
    service = TestBed.inject(AddHiveService);
  });

  it('should add the hive to the local store', () => {
    const mockHive = {label: 'test'};
    mockLocalData.createHive.and.callFake(d => of(d));
    service.addHive(mockHive).subscribe(created => {
      expect(mockLocalData.createHive).toHaveBeenCalledWith(jasmine.objectContaining(mockHive));
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Frame } from 'src/app/hive-core/models/frame';
import { Hive } from 'src/app/hive-core/models/hive';
import { HiveBody } from 'src/app/hive-core/models/hive-body';
import { AppStateService } from 'src/app/hive-core/services/app-state/app-state.service';
import { LocalHiveDataService } from 'src/app/hive-core/services/local-hive-data/local-hive-data.service';

import { CappedHoneyIntentService } from './capped-honey-intent.service';

describe('CappedHoneyIntentService', () => {
  let service: CappedHoneyIntentService;
  const mockState = jasmine.createSpyObj('appState', ['loadFrame']);
  const mockLocalHiveData = jasmine.createSpyObj('localHiveData', ['addFrameNote', 'addHiveNote', 'addBodyNote']);

  beforeEach(() => {
    mockState.currentHive$ = new BehaviorSubject<Hive>(null);
    mockState.currentBody$ = new BehaviorSubject<HiveBody>(null);
    mockState.currentFrame$ = new BehaviorSubject<Frame>(null);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AppStateService, useValue: mockState},
        {provide: LocalHiveDataService, useValue: mockLocalHiveData}
      ]
    });
    service = TestBed.inject(CappedHoneyIntentService);
  });

  it('Adds a note with the right observation checked', () => {
    expect(service.getNote().cappedHoney).toBeTrue();
  });
});

import { TestBed } from '@angular/core/testing';

import { HiveSpeechService } from './hive-speech.service';

describe('HiveSpeechService', () => {
  let service: HiveSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

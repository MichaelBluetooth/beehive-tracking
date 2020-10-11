import { TestBed } from '@angular/core/testing';

import { HiveSpeechRecognitionService } from './hive-speech-recognition.service';

describe('HiveSpeechRecognitionService', () => {
  let service: HiveSpeechRecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveSpeechRecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

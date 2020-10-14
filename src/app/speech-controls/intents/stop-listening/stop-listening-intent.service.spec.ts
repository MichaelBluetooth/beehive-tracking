import { TestBed } from "@angular/core/testing";
import { HiveSpeechRecognitionService } from "../../services/hive-speech-recognition.service";

import { StopListeningIntentService } from "./stop-listening-intent.service";

describe("StopListeningIntentService", () => {
  let service: StopListeningIntentService;
  const mockSpeechSvc = jasmine.createSpyObj("speechRecognitionService", [
    "stopListening",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HiveSpeechRecognitionService, useValue: mockSpeechSvc },
      ],
    });
    service = TestBed.inject(StopListeningIntentService);
  });

  it("stops listening when executed", () => {
    service.execute([]);
    expect(mockSpeechSvc.stopListening).toHaveBeenCalled();
  });
});

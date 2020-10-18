import { TestBed } from "@angular/core/testing";
import { SpeechListeningService } from '../../services/speech-listening.service';

import { StopListeningIntentService } from "./stop-listening-intent.service";

describe("StopListeningIntentService", () => {
  let service: StopListeningIntentService;
  const mockSpeechSvc = jasmine.createSpyObj("listeningSvc", [
    "stopListening",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SpeechListeningService, useValue: mockSpeechSvc },
      ],
    });
    service = TestBed.inject(StopListeningIntentService);
  });

  it("stops listening when executed", () => {
    service.execute([]);
    expect(mockSpeechSvc.stopListening).toHaveBeenCalled();
  });
});

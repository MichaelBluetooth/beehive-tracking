import { TestBed } from "@angular/core/testing";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AlertController } from "@ionic/angular";

import { HiveSpeechRecognitionService } from "./hive-speech-recognition.service";
import { SpeechInterpreterService } from "./speech-interpreter.service";

describe("HiveSpeechRecognitionService", () => {
  let service: HiveSpeechRecognitionService;
  let mockSpeechInterpreter: any;
  let mockIonicSpeechRecognition: any;
  let mockAlert: any;

  beforeEach(() => {
    mockSpeechInterpreter = jasmine.createSpyObj("speechInterpreter", [
      "checkAndExecuteMatch",
    ]);
    mockIonicSpeechRecognition = jasmine.createSpyObj("speechRecognition", [
      "stopListening",
      "isRecognitionAvailable",
      "hasPermission",
      "requestPermission",
      "startListening",
    ]);
    mockAlert = jasmine.createSpyObj("alert", ["create", "present"]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SpeechRecognition, useValue: mockIonicSpeechRecognition },
        {
          provide: SpeechInterpreterService,
          useValue: mockSpeechInterpreter,
        },
        { provide: AlertController, useValue: mockAlert },
      ],
    });
    service = TestBed.inject(HiveSpeechRecognitionService);
  });

  describe("Checking for speech recognition availiability", () => {
    it("should return true when available", (done) => {
      mockIonicSpeechRecognition.isRecognitionAvailable.and.returnValue(
        new Promise((r) => r(true))
      );
      service.checkSpeechAvailability().then((avail) => {
        expect(avail).toBeTrue();
        done();
      });
    });

    it("should return false when not available", (done) => {
      mockIonicSpeechRecognition.isRecognitionAvailable.and.returnValue(
        new Promise((r) => r(false))
      );
      service.checkSpeechAvailability().then((avail) => {
        expect(avail).toBeFalse();
        done();
      });
    });
  });

  describe("Checking for permission", () => {
    it("should return true when already granted", (done) => {
      mockIonicSpeechRecognition.hasPermission.and.returnValue(
        new Promise((r) => r(true))
      );
      service.checkPermission().then((granted) => {
        expect(granted).toBeTrue();
        done();
      });
    });

    it("should return true when the user grants permission", (done) => {
      mockIonicSpeechRecognition.hasPermission.and.returnValue(
        new Promise((r) => r(false))
      );
      mockIonicSpeechRecognition.requestPermission.and.returnValue(
        new Promise((r) => r(true))
      );
      service.checkPermission().then((granted) => {
        expect(granted).toBeTrue();
        done();
      });
    });

    it("should return false when the user does not grant permission", (done) => {
      mockIonicSpeechRecognition.hasPermission.and.returnValue(
        new Promise((r) => r())
      );
      mockIonicSpeechRecognition.requestPermission.and.returnValue(
        new Promise((r, e) => e())
      );
      service.checkPermission().then((granted) => {
        expect(granted).toBeFalse();
        done();
      });
    });
  });

  // describe("Listening for speech", () => {
  //   beforeEach(() => {
  //     // Speech is available
  //     mockIonicSpeechRecognition.isRecognitionAvailable.and.returnValue(
  //       new Promise((r) => r(true))
  //     );

  //     // We already have permission
  //     mockIonicSpeechRecognition.hasPermission.and.returnValue(
  //       new Promise((r) => r(true))
  //     );
  //   });

  //   it("Gathers the matches and passes them to the interpreter", fakeAsync((done) => {
  //     const speechMatches = ['someone', 'said', 'this'];
  //     mockIonicSpeechRecognition.startListening.and.returnValue(of(speechMatches));
  //     service.listen();
  //     tick(500);
  //     expect(mockSpeechInterpreter.checkAndExecuteMatch).toHaveBeenCalledWith(speechMatches);
  //     done();
  //   }));
  // });
});


import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";

import { LoadFrameIntentService } from "./load-frame-intent.service";

describe("LoadFrameIntentService", () => {
  let service: LoadFrameIntentService;
  let mockState: any;
  const mockRouter = jasmine.createSpyObj("router", ["navigate"]);

  beforeEach(() => {
    mockState = jasmine.createSpyObj("appState", ["loadFrame"]);
    mockState.currentBody$ = new BehaviorSubject<HiveBody>(null);
    mockState.currentHive$ = new BehaviorSubject<Hive>(null);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppStateService, useValue: mockState },
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(LoadFrameIntentService);
  });

  describe("matching intents", () => {
    it("should return false if no hive is loaded", () => {
      // we should really never be in this kind of scenario where we've loaded a Hive Body, but no Hive...
      mockState.currentBody$.next({ clientId: "12345" });
      expect(service.isMatch(["load frame 1"])).toBeFalse();
    });

    it("should return false if no hive body is loaded", () => {
      // i.e. I've selected a Hive but no Part
      mockState.currentHive$.next({ clientId: "12345" });
      expect(service.isMatch(["load frame 1"])).toBeFalse();
    });

    it("should return false if the phrase doesn't match", () => {
      // i.e. I've selected a Hive but no Part
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "6789" });
      expect(service.isMatch(["load duh something 1"])).toBeFalse();
    });

    it("should return true the phrase matches and the right state is set", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "6789" });
      expect(service.isMatch(["load frame 2"])).toBeTrue();
    });
  });

  describe("getting the frame index from the phrase", () => {
    it("should get the right number", () => {
      expect(service.getFrameNumber(["load frame 1"])).toBe(0);
    });
  });

  describe("executing the intent", () => {
    beforeEach(() => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }],
      });
    });

    it("should navigate the user to the selected frame", () => {
      service.execute(["load frame 1"]);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        "hives",
        "12345",
        "boxes",
        "6789",
        "frames",
        "13579",
      ]);
    });
  });
});

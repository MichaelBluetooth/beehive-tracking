import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Frame } from "src/app/hive-core/models/frame";
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";

import { PreviousFrameIntentService } from "./previous-frame-intent.service";

describe("PreviousFrameIntentService", () => {
  let service: PreviousFrameIntentService;
  let mockState: any;
  const mockRouter = jasmine.createSpyObj("router", ["navigate"]);

  beforeEach(() => {
    mockState = jasmine.createSpyObj("appState", ["loadFrame"]);
    mockState.currentFrame$ = new BehaviorSubject<Frame>(null);
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
    service = TestBed.inject(PreviousFrameIntentService);
  });

  describe("matching intents", () => {
    it("should return false if no hive is loaded", () => {
      // we should really never be in this kind of scenario where we've loaded a Hive Body, but no Hive...
      mockState.currentBody$.next({ clientId: "12345" });
      mockState.currentFrame$.next({ clientId: "123232" });
      expect(service.isMatch(["previous frame"])).toBeFalse();
    });

    it("should return false if no hive body is loaded", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentFrame$.next({ clientId: "234545" });
      expect(service.isMatch(["previous frame"])).toBeFalse();
    });

    it("should return false if no frame is loaded", () => {
      mockState.currentBody$.next({ clientId: "12345" });
      mockState.currentHive$.next({ clientId: "32892" });
      expect(service.isMatch(["previous frame"])).toBeFalse();
    });

    it("should return false if the phrase doesn't match", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "354789" });
      expect(service.isMatch(["previous thing"])).toBeFalse();
    });

    it("should return true if the phrase matches and the right state is set", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "6789" });
      mockState.currentFrame$.next({ clientId: "4832332" });
      expect(service.isMatch(["previous frame"])).toBeTrue();
    });
  });

  describe("getting the previous frame", () => {
    it("returns the previous frame in the list", () => {
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }, { clientId: "24680" }],
      });
      mockState.currentFrame$.next({ clientId: "24680" });
      expect(service.getTargetFrame()).toEqual({ clientId: "13579" });
    });

    it("returns null if the current frame is the first in the list", () => {
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }, { clientId: "24680" }],
      });
      mockState.currentFrame$.next({ clientId: "13579" });
      expect(service.getTargetFrame()).toEqual(null);
    });
  });

  describe("executing the intent", () => {
    beforeEach(() => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }, { clientId: "24680" }],
      });
      mockState.currentFrame$.next({ clientId: "24680" });
    });

    it("should navigate the user to the selected frame", () => {
      service.execute(["previous frame"]);
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

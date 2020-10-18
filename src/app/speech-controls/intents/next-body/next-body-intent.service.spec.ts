import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Frame } from 'src/app/hive-core/models/frame';
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";

import { NextBodyIntentService } from "./next-body-intent.service";

describe("NextBodyIntentService", () => {
  let service: NextBodyIntentService;
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
    service = TestBed.inject(NextBodyIntentService);
  });

  describe("matching intents", () => {
    it("should return false if no hive is loaded", () => {
      // we should really never be in this kind of scenario where we've loaded a Hive Body, but no Hive...
      mockState.currentBody$.next({ clientId: "12345" });
      expect(service.isMatch(["next body"])).toBeFalse();
    });

    it("should return false if the phrase doesn't match", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "354789" });
      expect(service.isMatch(["next thing"])).toBeFalse();
    });

    it("should return true the phrase matches and the right state is set", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "6789" });
      mockState.currentFrame$.next({ clientId: "4832332" });
      expect(service.isMatch(["next body"])).toBeTrue();
    });

    it("should return true the phrase matches and the right state is set", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      expect(service.isMatch(["next body"])).toBeTrue();
    });

    it("should return true the phrase matches and the right state is set", () => {
      mockState.currentHive$.next({ clientId: "12345" });
      mockState.currentBody$.next({ clientId: "6789" });
      expect(service.isMatch(["next body"])).toBeTrue();
    });
  });

  describe("getting the next body", () => {
    it("returns the next body in the list", () => {
      mockState.currentHive$.next({ clientId: "12345", parts: [{clientId: '6789'}, {clientId: '98765'}] });
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }, { clientId: "24680" }],
      });
      expect(service.getTargetBody()).toEqual({ clientId: "98765" });
    });

    it("returns null if the current body is the last in the list", () => {
      mockState.currentHive$.next({ clientId: "12345", parts: [{clientId: '6789'}, {clientId: '98765'}] });
      mockState.currentBody$.next({
        clientId: "98765"
      });
      expect(service.getTargetBody()).toEqual(null);
    });
  });

  describe("executing the intent", () => {
    beforeEach(() => {
      mockState.currentHive$.next({ clientId: "12345", parts: [{clientId: '6789'}, {clientId: '98765'}]});
      mockState.currentBody$.next({
        clientId: "6789",
        frames: [{ clientId: "13579" }, { clientId: "24680" }],
      });
      mockState.currentFrame$.next({ clientId: "13579" });
    });

    it("should navigate the user to the selected frame", () => {
      service.execute(["next body"]);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        "hives",
        "12345",
        "boxes",
        "98765"
      ]);
    });
  });
});

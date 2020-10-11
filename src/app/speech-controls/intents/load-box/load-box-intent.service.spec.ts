import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Hive } from "src/app/hive-core/models/hive";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LoadBoxIntentService } from "./load-box-intent.service";

describe("LoadHiveIntentService", () => {
  let service: LoadBoxIntentService;
  const mockRouterService = jasmine.createSpyObj("router", ["navigate"]);
  const mockState = jasmine.createSpyObj("hiveTabs", ["loadHive"]);

  beforeEach(() => {
    mockState.currentHive$ = new BehaviorSubject<Hive>(null);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppStateService, useValue: mockState },
        { provide: Router, useValue: mockRouterService },
      ],
    });
    service = TestBed.inject(LoadBoxIntentService);
  });

  [
    { phrase: ["view box 1"], expected: 1 },
    { phrase: ["view box 2"], expected: 2 },
    { phrase: ["view box three", "view box 3"], expected: 3 },
  ].forEach((testCase) => {
    it(`should extract the box number from the phrase '${testCase.phrase}'`, () => {
      expect(service.getBoxNumber(testCase.phrase)).toEqual(testCase.expected);
    });
  });

  it("should navigate to the expected box", () => {
    const mockHive: Hive = {
      id: "123456",
      parts: [
        {
          id: "123456",
        },
      ],
    };
    mockState.currentHive$.next(mockHive);
    spyOn(service, "getBoxNumber").and.returnValue(1);

    service.execute(["view box 1"]);
    expect(mockRouterService.navigate).toHaveBeenCalledWith([
      "hives",
      mockHive.id,
      "boxes",
      mockHive.parts[0].id,
    ]);
  });
});

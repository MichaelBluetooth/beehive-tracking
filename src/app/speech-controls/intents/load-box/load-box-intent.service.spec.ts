import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { HiveTabsService } from "src/app/hive-old/services/hive-tabs.service";
import { Hive } from "src/app/models/hive";
import { LoadBoxIntentService } from "./load-box-intent.service";

fdescribe("LoadHiveIntentService", () => {
  let service: LoadBoxIntentService;
  const mockRouterService = jasmine.createSpyObj("router", ["navigate"]);
  const mockHiveTabsService = jasmine.createSpyObj("hiveTabs", [
    "getCurrentHive",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HiveTabsService, useValue: mockHiveTabsService },
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
    spyOn(service, "getBoxNumber").and.returnValue(1);
    mockHiveTabsService.getCurrentHive.and.returnValue(mockHive);
    service.execute(["view box 1"]);
    expect(mockRouterService.navigate).toHaveBeenCalledWith([
      "hives",
      mockHive.id,
      "boxes",
      mockHive.parts[0].id
    ]);
  });
});

import { TestBed } from "@angular/core/testing";
import { LoadHiveIntentService } from "./load-hive-intent.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { HiveService } from "src/app/hive-old/services/hive.service";

fdescribe("LoadHiveIntentService", () => {
  let service: LoadHiveIntentService;
  const mockRouterService = jasmine.createSpyObj("router", ["navigate"]);
  const mockHiveService = jasmine.createSpyObj("hiveService", ["getHiveByIdx"]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HiveService, useValue: mockHiveService },
        { provide: Router, useValue: mockRouterService },
      ],
    });
    service = TestBed.inject(LoadHiveIntentService);
  });

  [
    { phrase: ["view hive 1"], expected: 1 },
    { phrase: ["view hive 2"], expected: 2 },
    { phrase: ["view hive three", "view hive 3"], expected: 3 },
  ].forEach((testCase) => {
    it(`should extract the hive number from the phrase '${testCase.phrase}'`, () => {
      expect(service.getHiveNumber(testCase.phrase)).toEqual(testCase.expected);
    });
  });

  it("should navigate to the expected hive", () => {
    const mockHive = {
      id: "123456",
    };
    spyOn(service, "getHiveNumber").and.returnValue(1);
    mockHiveService.getHiveByIdx.and.returnValue(of(mockHive));
    service.execute(["view hive 1"]);
    expect(mockRouterService.navigate).toHaveBeenCalledWith([
      "hives",
      mockHive.id,
    ]);
  });
});

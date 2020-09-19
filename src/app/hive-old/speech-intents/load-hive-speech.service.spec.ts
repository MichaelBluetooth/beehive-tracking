import { TestBed } from "@angular/core/testing";
import { LoadHiveSpeechService } from "./load-hive-speech.service";
import { Router } from "@angular/router";
import { of } from 'rxjs';
import { HiveService } from '../services/hive.service';

fdescribe("LoadHiveSpeechService", () => {
  let service: LoadHiveSpeechService;
  const mockRouterService = jasmine.createSpyObj("router", ["navigate"]);
  const mockHiveService = jasmine.createSpyObj("hiveService", ["getHiveByIdx"]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HiveService, useValue: mockHiveService},
        {provide: Router, useValue: mockRouterService}
      ]
    });
    service = TestBed.inject(LoadHiveSpeechService);
  });

  [
    "open hive one",
    "open hive 1",
    "open hyve one",
    "open hyve 1",
    "load hive one",
    "load hive 1",
    "load hyve one",
    "load hyve 1",
    "view hive one",
    "view hive 1",
    "view hyve one",
    "view hyve 1",
    "vue hive one",
    "vue hive 1",
    "vue hyve one",
    "vue hyve 1",
    "open hive two",
    "open hive 2",
    "open hyve two",
    "open hyve 2",
    "load hive two",
    "load hive 2",
    "load hyve two",
    "load hyve 2",
    "view hive two",
    "view hive 2",
    "view hyve two",
    "view hyve 2",
    "vue hive two",
    "vue hive 2",
    "vue hyve two",
    "vue hyve 2",
  ].forEach((testCase) => {
    it(`should match the following phrase: '${testCase}'`, () => {
      expect(service.isMatch([testCase])).toBeTruthy();
    });
  });

  [
    { phrase: ["view hive 1"], expected: 1 },
    { phrase: ["view hive 2"], expected: 2 },
    { phrase: ["view hive three", "view hive 3"], expected: 3 },
  ].forEach((testCase) => {
    it(`should extract the hive number from the phrase '${testCase.phrase}'`, () => {
      expect(service.getHiveNumber(testCase.phrase)).toEqual(
        testCase.expected
      );
    });
  });

  it("should navigate to the expected hive", () => {
    const mockHive = {
      id: '123456'
    };
    spyOn(service, "getHiveNumber").and.returnValue(1);
    mockHiveService.getHiveByIdx.and.returnValue(of(mockHive));
    service.execute(["view hive 1"]);
    expect(mockRouterService.navigate).toHaveBeenCalledWith(['hives', mockHive.id]);
  });
});

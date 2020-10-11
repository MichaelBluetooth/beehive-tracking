import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of, Subject } from "rxjs";
import { Hive } from '../../models/hive';
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { AppStateService } from "./app-state.service";

describe("AppStateService", () => {
  let service: AppStateService;
  let mockLocalService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockLocalService = jasmine.createSpyObj("local", ["getHive"]);
    mockRouter = jasmine.createSpyObj("router", ["navigate"]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalHiveDataService,
          useValue: mockLocalService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    });
    service = TestBed.inject(AppStateService);
  });

  describe("loading a hive", () => {
    it("should emit the local instance (by id)", () => {
      const mockLocalHive: Hive = { id: "12345" };
      mockLocalService.getHive.and.returnValue(of(mockLocalHive));
      spyOn(service.currentHive$, "next");
      service.loadHive("12345", true);
      expect(service.currentHive$.next).toHaveBeenCalledWith(mockLocalHive);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hives', '12345']);
    });

    it("should emit the local instance (by clientId)", () => {
      const mockLocalHive: Hive = { clientId: "834324" };
      mockLocalService.getHive.and.returnValue(of(mockLocalHive));
      spyOn(service.currentHive$, "next");
      service.loadHive("834324", true);
      expect(service.currentHive$.next).toHaveBeenCalledWith(mockLocalHive);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hives', '834324']);
    });
  });
});

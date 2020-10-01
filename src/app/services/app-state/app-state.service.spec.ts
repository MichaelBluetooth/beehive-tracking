import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of, Subject } from "rxjs";
import { Hive } from "src/app/models/hive";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { RemoteHiveDataService } from "../remote-hive-data/remote-hive-data.service";

import { AppStateService } from "./app-state.service";

fdescribe("AppStateService", () => {
  let service: AppStateService;
  let mockLocalService: any;
  let mockRemoteService: any;

  beforeEach(() => {
    mockLocalService = jasmine.createSpyObj("local", ["getHive"]);
    mockRemoteService = jasmine.createSpyObj("local", ["getHive"]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalHiveDataService,
          useValue: mockLocalService,
        },
        {
          provide: RemoteHiveDataService,
          useValue: mockRemoteService,
        },
      ],
    });
    service = TestBed.inject(AppStateService);
  });

  describe("loading a hive", () => {
    it("should emit the local instance and then remote", fakeAsync(() => {
      const mockLocalHive: Hive = { id: "12345" };
      const mockRemoteHive: Hive = { id: "12345" };
      mockLocalService.getHive.and.returnValue(of(mockLocalHive));
      mockRemoteService.getHive.and.callFake(() => {
        const ret = new Subject<Hive>();
        setTimeout(() => ret.next(mockRemoteHive), 100);
        return ret;
      });
      spyOn(service.currentHive$, "next");
      service.loadHive("12345");
      tick(500);
      expect(service.currentHive$.next).toHaveBeenCalledTimes(2);
      expect(service.currentHive$.next).toHaveBeenCalledWith(mockLocalHive); // loaded the local instance
      expect(service.currentHive$.next).toHaveBeenCalledWith(mockRemoteHive); // loaded the data from the remote service
    }));

    it("should not emit the local instance if the remote completed first", fakeAsync(() => {
      const mockLocalHive: Hive = { id: "12345" };
      const mockRemoteHive: Hive = { id: "12345" };
      mockRemoteService.getHive.and.returnValue(of(mockRemoteHive));
      mockLocalService.getHive.and.callFake(() => {
        // the local service happened to take longer than the remote!
        const ret = new Subject<Hive>();
        setTimeout(() => ret.next(mockLocalHive), 100);
        return ret;
      });
      spyOn(service.currentHive$, "next");
      service.loadHive("12345");
      tick(500);
      expect(service.currentHive$.next).toHaveBeenCalledTimes(1);
      expect(service.currentHive$.next).toHaveBeenCalledWith(mockRemoteHive);
    }));
  });
});

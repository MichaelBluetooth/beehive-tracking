import { HttpClient } from "@angular/common/http";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { NullLogger } from "src/app/logger/null-logger";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { PhotoService } from "../photo/photo.service";

import { SyncService } from "./sync.service";

fdescribe("SyncService", () => {
  let service: SyncService;
  let mockHttp: any;
  let mockLocalHiveData: any;
  let mockPhotoService: any;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj("http", ["post"]);
    mockLocalHiveData = jasmine.createSpyObj("local", [
      "getHives",
      "updateHive",
      "updateBody",
      "updateFrame",
      "updateInspection",
    ]);
    mockPhotoService = jasmine.createSpyObj("photo", ["loadSaved"]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: LocalHiveDataService, useValue: mockLocalHiveData },
        { provide: PhotoService, useValue: mockPhotoService },
        {
          provide: LoggerService,
          useValue: {
            getLogger: () => new NullLogger(),
          },
        },
      ],
    });
    service = TestBed.inject(SyncService);
  });

  it("should sync all the hives in order", async((done) => {
    const mockHives = [
      {
        clientId: "1",
        notes: [
          {
            clientId: "3",
          },
        ],
        parts: [
          {
            clientId: "4",
            notes: [
              {
                clientId: "5",
              },
            ],
            frames: [
              {
                clientId: "6",
              },
            ],
          },
        ],
      },
      {
        clientId: "2",
      },
    ];
    let httpCalls = 0;
    mockHttp.post.and.callFake((url, body) => {
      body.id = `id_${httpCalls}`;
      httpCalls++;
      return of(body);
    });
    mockLocalHiveData.getHives.and.returnValue(of(mockHives));
    service.syncAll();

    setTimeout(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "sync/hive",
        jasmine.objectContaining({ clientId: "1" })
      );
      expect(mockHttp.post).toHaveBeenCalledWith(
        "sync/hive",
        jasmine.objectContaining({ clientId: "2" })
      );
      expect(mockHttp.post).toHaveBeenCalledWith(
        "sync/hiveinspection",
        jasmine.objectContaining({ clientId: "3" })
      );
      expect(mockHttp.post).toHaveBeenCalledWith(
        "sync/body",
        jasmine.objectContaining({ clientId: "4" })
      );
      expect(mockHttp.post).toHaveBeenCalledWith(
        "sync/bodyinspection",
        jasmine.objectContaining({ clientId: "5" })
      );

      done();
    }, 4500);
  }));
});

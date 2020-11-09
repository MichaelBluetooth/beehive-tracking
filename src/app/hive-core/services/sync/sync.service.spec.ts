import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { NullLogger } from "src/app/logger/null-logger";

import { SyncService } from "./sync.service";

fdescribe("SyncService", () => {
  let service: SyncService;
  let mockHttp: any;
  let mockLocalHiveData: any;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj("http", ["post"]);
    mockLocalHiveData = jasmine.createSpyObj("local", [
      "getHives",
      "updateHive",
    ]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
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

  it("should sync all the hives in order", () => {
    const mockHives = [
      {
        label: "H1",
        clientId: "123456",
      },
      {
        label: "H2",
        clientId: "98763",
      },
    ];
    let httpCalls = 0;
    mockHttp.and.callFake((url, body) => {
      body.id = `id_${httpCalls}`;
      httpCalls++;
      return of(body);
    });
    mockLocalHiveData.getHives.and.returnValue(of(mockHives));
    service.syncAll();
    expect(mockLocalHiveData.updateHive).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: "id_0" })
    );
    expect(mockLocalHiveData.updateHive).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: "id_2" })
    );
  });
});

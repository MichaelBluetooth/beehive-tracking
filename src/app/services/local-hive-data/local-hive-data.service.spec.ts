import { TestBed } from "@angular/core/testing";
import { Hive } from "src/app/models/hive";

import { LocalHiveDataService } from "./local-hive-data.service";

fdescribe("LocalHiveDataService", () => {
  let service: LocalHiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalHiveDataService);
  });

  beforeEach(() => {
    service.setLocalData(mockData);
  });

  it("should get the hive collection", () => {
    service.getHives().subscribe((hives) => {
      expect(hives).toEqual(mockData);
    });
  });

  it("should find hives by id", () => {
    service.getHive("hive_1").subscribe((hive) => {
      expect(hive).toEqual(mockData[0]);
    });
  });

  it("should find hive bodies by id", () => {
    service.getBody("hive_2_body_1").subscribe((hive) => {
      expect(hive).toEqual(mockData[1].parts[0]);
    });
  });

  it("should find frames by id", () => {
    service.getFrame("hive_2_body_2_frame_1").subscribe((hive) => {
      expect(hive).toEqual(mockData[1].parts[1].frames[0]);
    });
  });
});

const mockData: Hive[] = [
  {
    id: "hive_1",
    parts: [
      {
        id: "hive1_body_1",
        frames: [
          {
            id: "hive1_body_1_frame_1",
            clientId: "client_hive1_body_1_frame_1",
          },
          {
            id: "hive1_body_1_frame_2",
          },
        ],
      },
    ],
  },
  {
    id: "hive_2",
    parts: [
      {
        id: "hive_2_body_1",
        frames: [
          {
            id: "hive_2_body_1_frame_1",
          },
        ],
      },
      {
        id: "hive_2_body_2",
        frames: [
          {
            id: "hive_2_body_2_frame_1",
          },
          {
            id: "hive_2_body_2_frame_2",
          },
        ],
      },
    ],
  },
];

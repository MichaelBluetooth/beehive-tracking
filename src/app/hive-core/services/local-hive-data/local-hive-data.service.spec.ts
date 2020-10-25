import { TestBed } from "@angular/core/testing";
import { Storage } from "@ionic/storage";
import { Hive } from "../../models/hive";
import { Note } from "../../models/note";

import { LocalHiveDataService } from "./local-hive-data.service";

describe("LocalHiveDataService", () => {
  let service: LocalHiveDataService;
  const mockStorage = jasmine.createSpyObj("storage", ["set"]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: mockStorage }],
    });
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
    service.getBody("hive_2_body_1").subscribe((body) => {
      expect(body).toEqual(jasmine.objectContaining(mockData[1].parts[0]));
    });
  });

  it("should find frames by id", () => {
    service.getFrame("hive_2_body_2_frame_1").subscribe((frame) => {
      expect(frame).toEqual(
        jasmine.objectContaining(mockData[1].parts[1].frames[0])
      );
    });
  });

  describe("deleting hives", () => {
    it("should delete the hive by id", () => {
      service.deleteHive("hive_1").subscribe((deleted) => {
        expect(deleted).toBe(true);
      });
    });

    it("should return false when no hive is deleted", () => {
      service.deleteHive("no_found_hive").subscribe((deleted) => {
        expect(deleted).toBe(false);
      });
    });
  });

  describe("deleting boxes", () => {
    it("should delete the box by id", () => {
      service.deleteBox("hive_2_body_1").subscribe((deleted) => {
        expect(deleted).toBe(true);
      });
    });

    it("should return false when no box is deleted", () => {
      service.deleteBox("no_found_body").subscribe((deleted) => {
        expect(deleted).toBe(false);
      });
    });
  });

  describe("deleting frames", () => {
    it("should delete the frame by id", () => {
      service.deleteFrame("hive_2_body_2_frame_2").subscribe((deleted) => {
        expect(deleted).toBe(true);
      });
    });

    it("should return false when no frame is deleted", () => {
      service.deleteFrame("no_frame").subscribe((deleted) => {
        expect(deleted).toBe(false);
      });
    });
  });

  describe("adding notes", () => {
    it("should add a note to the list of hive notes", () => {
      const note: Note = { date: new Date().toISOString() };
      service.addHiveNote("hive_1", note).subscribe(() => {
        service.getHive("hive_1").subscribe((h) => {
          expect(h.notes[0]).toEqual(jasmine.objectContaining(note));
        });
      });
    });

    it("should add a note to the list of box notes", () => {
      const note: Note = { date: new Date().toISOString() };
      service.addHiveNote("hive1_body_1", note).subscribe(() => {
        service.getHive("hive1_body_1").subscribe((b) => {
          expect(b.notes[0]).toEqual(jasmine.objectContaining(note));
        });
      });
    });

    it("should add a note to the list of frame notes", () => {
      const note: Note = { date: new Date().toISOString() };
      service.addFrameNote("hive1_body_1_frame_2", note).subscribe(() => {
        service.getFrame("hive1_body_1_frame_2").subscribe((f) => {
          expect(f.notes[0]).toEqual(jasmine.objectContaining(note));
        });
      });
    });
  });

  describe("Updating existing hives", () => {
    it("should set the hive id", () => {
      const id = "654321";
      service.setLocalData([{ clientId: "12345" }]);
      service.setHiveId("12345", id);
      service.getHive(id).subscribe((hive) => {
        expect(hive).not.toBeNull();
      });
    });

    it("should update an existing hive", () => {
      const existingHive: Hive = {
        label: "original label",
        lastModified: new Date(2020, 11, 2),
        queenLastSpotted: new Date(2020, 11, 2),
        id: "123",
        clientId: "321",
        parts: [
          {
            id: "1234",
            clientId: "4321",
          },
        ],
      };

      const modifiedHive: Hive = {
        label: "new label",
        lastModified: new Date(2021, 11, 2),
        queenLastSpotted: new Date(2021, 11, 2),
        id: "123",
        clientId: "321",
      };
      service.setLocalData([existingHive]);
      service.updateHive(modifiedHive);
      service.getHive("123").subscribe((hive) => {
        expect(hive.label).toEqual(modifiedHive.label);
        expect(hive.queenLastSpotted).toEqual(modifiedHive.queenLastSpotted);
        expect(hive.lastModified).toEqual(modifiedHive.lastModified);
        expect(hive.parts.length).toEqual(existingHive.parts.length);
      });
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

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, concat, from, Observable, Subject } from "rxjs";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { Frame } from "../../models/frame";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
import { Note } from "../../models/note";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { PhotoService } from "../photo/photo.service";

@Injectable({
  providedIn: "root",
})
export class SyncService {
  private logger: Logger;
  private syncing = new BehaviorSubject<boolean>(false);

  get syncing$(): Observable<boolean> {
    return this.syncing.asObservable();
  }

  constructor(
    private http: HttpClient,
    private local: LocalHiveDataService,
    private photoService: PhotoService,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger("SyncService");
  }

  syncAll() {
    this.logger.info("syncAll", `sync started: ${new Date().toISOString()}`);
    this.syncing.next(true);

    this.local.getHives().subscribe((hives) => {
      const hiveReqs = [];
      hives.forEach((hive) => {
        const hivePostBody: Hive = JSON.parse(JSON.stringify(hive));
        delete hivePostBody.notes;
        delete hivePostBody.parts;
        hiveReqs.push(this.http.post("sync/hive", hivePostBody));
      });

      concat(...hiveReqs).subscribe(
        (syncHiveResp) => {
          this.logger.info("syncAll", "sync hive succeeded", syncHiveResp);
          this.local.updateHive(syncHiveResp);
        },
        (syncHiveError) => {
          this.syncing.next(false);
          this.logger.warn("syncAll", "sync hive error", syncHiveError);
        },
        () => {
          this.logger.info("syncAll", "successfully sync'd all hives");

          this.syncHiveNotes(hives).then(() => {
            this.syncHiveParts(hives).subscribe(() => {
              this.syncHivePartNotes(hives).then(() => {
                this.syncFrames(hives).subscribe(() => {
                  this.syncFrameNotes(hives).subscribe(() => {
                    this.syncing.next(false);
                  });
                });
              });
            });
          });
        }
      );
    });
  }

  private async syncHiveNotes(hives: Hive[]) {
    let next;
    const ret = new Promise((r) => {
      next = r;
    });
    const notesReqs = [];

    for (const hive of hives) {
      if (hive.notes) {
        this.syncing.next(true);
        for (const note of hive.notes) {
          const noteReq = JSON.parse(JSON.stringify(note));
          if (note.photo && !note.photo.base64) {
            note.photo.base64 = await this.photoService.loadSaved(note.photo);
          }
          noteReq.photoBase64 = note.photo?.base64;
          noteReq.hiveId = hive.id;
          notesReqs.push(this.http.post("sync/hiveinspection", noteReq));
        }
      }
    }

    if (notesReqs.length === 0) {
      next();
    }

    concat(...notesReqs).subscribe(
      (syncdNote: Note) => {
        this.logger.info("syncAll", "sync hive note succeeded", syncdNote);
        this.local.updateInspection(syncdNote);
      },
      (syncNoteError) => {
        this.syncing.next(false);
        this.logger.warn("syncHiveNotes", "sync note error", syncNoteError);
      },
      () => {
        this.syncing.next(false);
        this.logger.info("syncHiveNotes", "finished syncing all hive notes");
        next();
      }
    );

    return ret;
  }

  private syncHiveParts(hives: Hive[]) {
    const ret = new Subject();
    const hivePartReqs = [];
    hives.forEach((hive) => {
      if (hive.parts) {
        this.syncing.next(true);
        hive.parts.forEach((part) => {
          const partReq: HiveBody = JSON.parse(JSON.stringify(part));
          partReq.hiveId = hive.id;
          delete partReq.frames;
          delete partReq.notes;
          hivePartReqs.push(this.http.post("sync/body", partReq));
        });
      }
    });

    if (hivePartReqs.length === 0) {
      ret.next();
    }

    concat(...hivePartReqs).subscribe(
      (syncdHivePart) => {
        this.logger.info(
          "syncHiveParts",
          "sync hive part succeeded",
          syncdHivePart
        );
        this.local.updateBody(syncdHivePart);
      },
      (syncPartError) => {
        this.logger.warn(
          "syncHiveParts",
          "sync hive part failed",
          syncPartError
        );
      },
      () => {
        this.syncing.next(false);
        this.logger.info("syncHiveParts", "finished syncing all hive notes");
        ret.next();
      }
    );

    return ret.asObservable();
  }

  private syncHivePartNotes(hives: Hive[]) {
    let next;
    const ret = new Promise((r) => {
      next = r;
    });
    const notesReqs = [];

    for (const hive of hives) {
      if (hive.parts) {
        for (const part of hive.parts) {
          if (part.notes) {
            this.syncing.next(true);
            for (const note of part.notes) {
              const noteReq = JSON.parse(JSON.stringify(note));
              noteReq.photoBase64 = note.photo?.webviewPath;
              noteReq.hivePartId = part.id;
              notesReqs.push(this.http.post("sync/bodyinspection", noteReq));
            }
          }
        }
      }
    }

    if (notesReqs.length === 0) {
      next();
    }

    concat(...notesReqs).subscribe(
      (syncdNote: Note) => {
        this.logger.info(
          "syncHivePartNotes",
          "sync hive part note succeeded",
          syncdNote
        );
        this.local.updateInspection(syncdNote);
      },
      (syncNoteError) => {
        this.syncing.next(false);
        this.logger.warn("syncHivePartNotes", "sync note error", syncNoteError);
      },
      () => {
        this.syncing.next(false);
        this.logger.info(
          "syncHivePartNotes",
          "finished syncing all hive part notes"
        );
        next();
      }
    );

    return ret;
  }

  private syncFrames(hives: Hive[]) {
    const ret = new Subject();
    const frameReqs = [];

    hives.forEach((hive) => {
      if (hive.parts) {
        hive.parts.forEach((part) => {
          if (part.frames) {
            this.syncing.next(true);
            part.frames.forEach((frame) => {
              const frameReqPayload: Frame = JSON.parse(JSON.stringify(frame));
              delete frameReqPayload.notes;
              frameReqPayload.hivePartId = part.id;
              frameReqs.push(this.http.post("sync/frame", frameReqPayload));
            });
          }
        });
      }
    });

    if (frameReqs.length === 0) {
      ret.next();
    }

    concat(...frameReqs).subscribe(
      (syncdFrame) => {
        this.logger.info("syncFrames", "sync frame succeeded", syncdFrame);
        this.local.updateFrame(syncdFrame);
      },
      (syncFrameError) => {
        this.syncing.next(false);
        this.logger.warn("syncFrames", "sync frame error", syncFrameError);
      },
      () => {
        this.syncing.next(false);
        this.logger.info("syncFrames", "finished syncing all frames");
        ret.next();
      }
    );

    return ret.asObservable();
  }

  private syncFrameNotes(hives: Hive[]) {
    const ret = new Subject();
    const frameNoteReqs = [];

    hives.forEach((hive) => {
      if (hive.parts) {
        hive.parts.forEach((part) => {
          if (part.frames) {
            part.frames.forEach((frame) => {
              if (frame.notes) {
                this.syncing.next(true);
                frame.notes.forEach((note) => {
                  const frameNoteReqPayload: any = JSON.parse(
                    JSON.stringify(note)
                  );
                  frameNoteReqPayload.frameId = frame.id;
                  frameNoteReqs.push(
                    this.http.post("sync/frameinspection", frameNoteReqPayload)
                  );
                });
              }
            });
          }
        });
      }
    });

    if (frameNoteReqs.length === 0) {
      ret.next();
    }

    concat(...frameNoteReqs).subscribe(
      (syncdInspection: Note) => {
        this.logger.info(
          "syncFrameNotes",
          "sync frame note succeeded",
          syncdInspection
        );
        this.local.updateInspection(syncdInspection);
      },
      (syncFrameNoteError) => {
        this.syncing.next(false);
        this.logger.warn(
          "syncFrameNotes",
          "sync frame error",
          syncFrameNoteError
        );
      },
      () => {
        this.logger.info("syncFrameNotes", "finished syncing all frame notes");
        this.syncing.next(false);
        ret.next();
      }
    );

    return ret.asObservable();
  }
}

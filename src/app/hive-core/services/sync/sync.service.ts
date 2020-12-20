import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  concat,
  from,
  Observable,
  Subject,
  throwError,
} from "rxjs";
import { catchError, map } from "rxjs/operators";
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
      this.syncHives(hives).then(() => {
        this.syncHiveNotes(hives).then(() => {
          this.syncHiveParts(hives).subscribe(() => {
            this.syncHivePartNotes(hives).then(() => {
              this.syncFrames(hives).subscribe(() => {
                this.syncFrameNotes(hives).then(() => {
                  this.syncing.next(false);
                });
              });
            });
          });
        });
      });
    });
  }

  private async syncHives(hives: Hive[]) {
    try {
      let next;
      const ret = new Promise((r) => {
        next = r;
      });
      const reqs = [];

      for (const hive of hives) {
        const hivePostBody = JSON.parse(JSON.stringify(hive));
        delete hivePostBody.notes;
        delete hivePostBody.parts;
        if (hive.photo && !hive.photo.base64) {
          hivePostBody.photoBase64 = await this.photoService.loadSaved(
            hive.photo,
            true
          );
          delete hivePostBody.photo;
        } else if (hive.photo && hive.photo.base64) {
          hivePostBody.photoBase64 = hive.photo.base64;
          delete hivePostBody.photo;
        }

        reqs.push(this.http.post("sync/hive", hivePostBody));
      }

      if (reqs.length === 0) {
        next();
      }

      concat(...reqs).subscribe(
        (syncdHive) => {
          this.logger.info("syncHives", "sync hive succeeded", syncdHive);
          this.local.updateHive(syncdHive);
        },
        (syncError) => {
          this.syncing.next(false);
          this.logger.warn("syncHives", "sync hive error", syncError);
        },
        () => {
          this.syncing.next(false);
          this.logger.info("syncHives", "finished syncing all hives");
          next();
        }
      );

      return ret;
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncHives", "unexpected error", e);
      throw e;
    }
  }

  private async syncHiveNotes(hives: Hive[]) {
    try {
      for (const hive of hives) {
        if (hive.notes) {
          this.syncing.next(true);
          for (const note of hive.notes) {
            const noteReq = JSON.parse(JSON.stringify(note));
            if (note.photo && !note.photo.base64) {
              noteReq.photoBase64 = await this.photoService.loadSaved(
                note.photo,
                true
              );
              delete noteReq.photo;
            } else if (note.photo && note.photo.base64) {
              noteReq.photoBase64 = note.photo.base64;
              delete noteReq.photo;
            }
            noteReq.hiveId = hive.id;
            await this.http
              .post("sync/hiveinspection", noteReq)
              .pipe(
                map((syncdNote: Note) => {
                  this.logger.info(
                    "syncAll",
                    "sync hive note succeeded",
                    syncdNote
                  );
                  this.local.updateInspection(syncdNote);
                }),
                catchError((syncNoteError) => {
                  this.syncing.next(false);
                  this.logger.warn(
                    "syncHiveNotes",
                    "sync note error",
                    syncNoteError
                  );
                  throw syncNoteError;
                })
              )
              .toPromise();
          }
        }
      }

      this.syncing.next(false);
      this.logger.info("syncHiveNotes", "finished syncing all hive notes");
      return Promise.resolve();
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncHiveNotes", "unexpected error", e);
      throw e;
    }
  }

  private syncHiveParts(hives: Hive[]) {
    try {
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
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncHiveParts", "unexpected error", e);
      throw e;
    }
  }

  private async syncHivePartNotes(hives: Hive[]) {
    try {
      for (const hive of hives) {
        if (hive.parts) {
          for (const part of hive.parts) {
            if (part.notes) {
              this.syncing.next(true);
              for (const note of part.notes) {
                const noteReq = JSON.parse(JSON.stringify(note));
                if (note.photo && !note.photo.base64) {
                  noteReq.photoBase64 = await this.photoService.loadSaved(
                    note.photo,
                    true
                  );
                  delete noteReq.photo;
                } else if (note.photo && note.photo.base64) {
                  noteReq.photoBase64 = note.photo.base64;
                  delete noteReq.photo;
                }
                noteReq.hivePartId = part.id;
                await this.http
                  .post("sync/bodyinspection", noteReq)
                  .pipe(
                    map((syncdNote: Note) => {
                      this.logger.info(
                        "syncHivePartNotes",
                        "sync hive part note succeeded",
                        syncdNote
                      );
                      this.local.updateInspection(syncdNote);
                    }),
                    catchError((syncNoteError) => {
                      {
                        this.syncing.next(false);
                        this.logger.warn(
                          "syncHivePartNotes",
                          "sync note error",
                          syncNoteError
                        );
                        throw syncNoteError;
                      }
                    })
                  )
                  .toPromise();
              }
            }
          }
        }
      }

      this.syncing.next(false);
      this.logger.info(
        "syncHivePartNotes",
        "finished syncing all hive part notes"
      );
      return Promise.resolve();
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncHivePartNotes", "unexpected error", e);
      throw e;
    }
  }

  private syncFrames(hives: Hive[]) {
    try {
      const ret = new Subject();
      const frameReqs = [];

      hives.forEach((hive) => {
        if (hive.parts) {
          hive.parts.forEach((part) => {
            if (part.frames) {
              this.syncing.next(true);
              part.frames.forEach((frame) => {
                const frameReqPayload: Frame = JSON.parse(
                  JSON.stringify(frame)
                );
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
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncFrames", "unexpected error", e);
      throw e;
    }
  }

  private async syncFrameNotes(hives: Hive[]) {
    try {
      for (const hive of hives) {
        if (hive.parts) {
          for (const part of hive.parts) {
            if (part.frames) {
              for (const frame of part.frames) {
                if (frame.notes) {
                  this.syncing.next(true);
                  for (const note of frame.notes) {
                    const noteReq: any = JSON.parse(JSON.stringify(note));
                    noteReq.frameId = frame.id;
                    if (note.photo && !note.photo.base64) {
                      noteReq.photoBase64 = await this.photoService.loadSaved(
                        note.photo,
                        true
                      );
                      delete noteReq.photo;
                    } else if (note.photo && note.photo.base64) {
                      noteReq.photoBase64 = note.photo.base64;
                      delete noteReq.photo;
                    }
                    await this.http.post("sync/frameinspection", noteReq).pipe(
                      map((syncdInspection: Note) => {
                        this.logger.info(
                          "syncFrameNotes",
                          "sync frame note succeeded",
                          syncdInspection
                        );
                        this.local.updateInspection(syncdInspection);
                      }),
                      catchError((syncFrameNoteError) => {
                        this.syncing.next(false);
                        this.logger.warn(
                          "syncFrameNotes",
                          "sync frame error",
                          syncFrameNoteError
                        );
                        throw syncFrameNoteError;
                      })
                    ).toPromise();
                  }
                }
              }
            }
          }
        }
      }

      this.logger.info("syncFrameNotes", "finished syncing all frame notes");
      this.syncing.next(false);
      return Promise.resolve();
    } catch (e) {
      this.syncing.next(false);
      this.logger.error("syncHiveParts", "unexpected error", e);
      throw e;
    }
  }
}

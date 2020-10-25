import { HttpClient } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { Platform } from "@ionic/angular";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { Frame } from "../../models/frame";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
import { Note } from "../../models/note";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

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
    private http: HTTP,
    private httpClient: HttpClient,
    private local: LocalHiveDataService,
    private platform: Platform,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger("SyncService");
  }

  async syncAll(): Promise<void> {
    this.logger.info("syncAll", `sync started: ${new Date().toISOString()}`);
    this.syncing.next(true);

    this.local.getHives().subscribe(async (hives) => {
      hives.forEach(async (hive) => {
        const hivePostBody: Hive = JSON.parse(JSON.stringify(hive));
        delete hivePostBody.notes;
        delete hivePostBody.parts;
        try {
          const syncHiveResp = await this.post(
            "https://localhost:5001/sync/hive",
            hivePostBody
          );
          this.local.updateHive(syncHiveResp.data);
          this.syncHiveNotes(hive);
          if (hive.parts) {
            hive.parts.forEach(async (part) => {
              const partPostBody: HiveBody = JSON.parse(JSON.stringify(part));
              delete partPostBody.notes;
              delete partPostBody.frames;
              partPostBody.hiveId = syncHiveResp.data.id;
              const syncPartResp = await this.post(
                "https://localhost:5001/sync/body",
                partPostBody
              );
              this.local.updateBody(syncPartResp.data);
              this.syncBodyNotes(part);

              part.frames.forEach(async (frame) => {
                const framePostBody: Frame = JSON.parse(JSON.stringify(frame));
                delete framePostBody.notes;
                framePostBody.hivePartId = syncPartResp.data.id;
                const syncFrameResp = await this.post(
                  "https://localhost:5001/sync/frame",
                  framePostBody
                );
                this.local.updateFrame(syncFrameResp.data);
                this.syncFrameNotes(frame);
              });
            });
          }
        } catch (err) {
          this.logger.error("syncAll", "error syncing hive", err.message);
        }
      });

      this.logger.info("syncAll", `sync finished: ${new Date().toISOString()}`);
      this.syncing.next(false);
    });
  }

  private async post(url, data): Promise<any> {
    const headers = {};
    if (this.platform.is("cordova")) {
      return this.http.post(url, data, headers);
    } else {
      return this.httpClient
        .post(url, data, headers)
        .pipe(map((resp) => ({ data: resp })))
        .toPromise();
    }
  }

  private syncFrameNotes(frame: Frame) {
    frame.notes.forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.frameId = frame.id;
        const frameNoteResp = await this.post(
          "https://localhost:5001/sync/frameinspection",
          noteReq
        );
        this.local.updateInspection(frameNoteResp.data);
      } catch (err) {
        this.logger.error(
          "syncFrameNotes",
          "error syncing frame notes",
          err.message
        );
      }
    });
  }

  private syncBodyNotes(body: HiveBody) {
    body.notes.forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.hivePartId = body.id;
        const resp = await this.post(
          "https://localhost:5001/sync/bodyinspection",
          noteReq
        );
        this.local.updateInspection(resp.data);
      } catch (err) {
        this.logger.error(
          "syncBodyNotes",
          "error syning body notes",
          err.message
        );
      }
    });
  }

  private syncHiveNotes(hive: Hive) {
    hive.notes.forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.hiveId = hive.id;
        const resp = await this.post(
          "https://localhost:5001/sync/hiveinspection",
          noteReq
        );
        this.local.updateInspection(resp.data);
      } catch (err) {
        this.logger.error(
          "syncHiveNotes",
          "error syncing hive notes",
          err.message
        );
      }
    });
  }
}

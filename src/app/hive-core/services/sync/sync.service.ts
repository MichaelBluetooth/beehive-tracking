import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { HivePageComponent } from "../../components/hive-page/hive-page.component";
import { Frame } from "../../models/frame";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
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
    private http: HttpClient,
    private local: LocalHiveDataService,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger("SyncService");
  }

  syncAll() {
    this.logger.info("syncAll", `sync started: ${new Date().toISOString()}`);
    this.syncing.next(true);

    this.local.getHives().subscribe(async (hives) => {
      (hives || []).forEach(async (hive) => {
        const hivePostBody: Hive = JSON.parse(JSON.stringify(hive));
        delete hivePostBody.notes;
        delete hivePostBody.parts;
        const syncHiveResp = await this.http
          .post("sync/hive", hivePostBody)
          .toPromise();
        this.local.updateHive(syncHiveResp);
        await this.syncHiveNotes(hive);
        await this.syncHiveParts(hive);

        this.syncing.next(false);
      });
    });

    // this.local.getHives().subscribe((hives) => {
    //   hives.forEach(async (hive) => {
    //     const hivePostBody: Hive = JSON.parse(JSON.stringify(hive));
    //     delete hivePostBody.notes;
    //     delete hivePostBody.parts;
    //     const syncHiveResp = this.api.post("sync/hive", hivePostBody);
    //     this.local.updateHive(syncHiveResp.data);
    //     this.syncHiveNotes(hive);
    //     //if (hive.parts) {
    //     //  hive.parts.forEach(async (part) => {
    //     //    const partPostBody: HiveBody = JSON.parse(JSON.stringify(part));
    //     //    delete partPostBody.notes;
    //     //    delete partPostBody.frames;
    //     //    partPostBody.hiveId = syncHiveResp.data.id;
    //     //    const syncPartResp = await this.post("sync/body", partPostBody);
    //     //    this.local.updateBody(syncPartResp.data);
    //     //    this.syncBodyNotes(part);
    //     //
    //     //    part.frames.forEach(async (frame) => {
    //     //      const framePostBody: Frame = JSON.parse(JSON.stringify(frame));
    //     //      delete framePostBody.notes;
    //     //      framePostBody.hivePartId = syncPartResp.data.id;
    //     //      const syncFrameResp = await this.post(
    //     //        "sync/frame",
    //     //        framePostBody
    //     //      );
    //     //      this.local.updateFrame(syncFrameResp.data);
    //     //      this.syncFrameNotes(frame);
    //     //    });
    //     //  });
    //     //}
    //   });

    //   this.logger.info("syncAll", `sync finished: ${new Date().toISOString()}`);
    //   this.syncing.next(false);
    // });
  }

  private syncHiveNotes(hive: Hive) {
    (hive.notes || []).forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.hiveId = hive.id;
        const resp = await this.http
          .post("sync/hiveinspection", noteReq)
          .toPromise();
        this.local.updateInspection(resp as any);
      } catch (err) {
        this.logger.error(
          "syncHiveNotes",
          "error syncing hive notes",
          err.message
        );
      }
    });
  }

  private syncHiveParts(hive: Hive) {
    (hive.parts || []).forEach(async (part) => {
      try {
        const partReq: HiveBody = JSON.parse(JSON.stringify(part));
        partReq.hiveId = hive.id;
        delete partReq.frames;
        delete partReq.notes;
        const resp = await this.http.post("sync/body", partReq).toPromise();
        this.local.updateBody(resp as any);
        await this.syncBodyNotes(part);
        await this.syncFrames(part);
      } catch (err) {
        this.logger.error(
          "syncHiveParts",
          "error syncing hive parts",
          err.message
        );
      }
    });
  }

  private syncBodyNotes(body: HiveBody) {
    (body.notes || []).forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.hivePartId = body.id;
        const resp = await this.http
          .post("sync/bodyinspection", noteReq)
          .toPromise();
        this.local.updateInspection(resp as any);
      } catch (err) {
        this.logger.error(
          "syncBodyNotes",
          "error syning body notes",
          err.message
        );
      }
    });
  }

  private syncFrames(part: HiveBody) {
    (part.frames || []).forEach(async (frame) => {
      const frameReq: Frame = JSON.parse(JSON.stringify(frame));
      frameReq.hivePartId = part.id;
      delete frameReq.notes;
      const resp = await this.http.post("sync/frame", frameReq).toPromise();
      this.local.updateFrame(resp as any);
      await this.syncFrameNotes(frame);
    });
  }

  private syncFrameNotes(frame: Frame) {
    (frame.notes || []).forEach(async (note) => {
      try {
        const noteReq = JSON.parse(JSON.stringify(note));
        noteReq.photoBase64 = note.photo?.webviewPath;
        noteReq.frameId = frame.id;
        const frameNoteResp = await this.http
          .post("sync/frameinspection", noteReq)
          .toPromise();
        this.local.updateInspection(frameNoteResp as any);
      } catch (err) {
        this.logger.error(
          "syncFrameNotes",
          "error syncing frame notes",
          err.message
        );
      }
    });
  }
}

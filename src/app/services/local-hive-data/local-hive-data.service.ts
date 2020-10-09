import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { EMPTY, Observable, of } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { Frame } from "src/app/models/frame";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { Note } from "src/app/models/note";
import { IHiveDataService } from "../interfaces/hive-data.service";

@Injectable({
  providedIn: "root",
})
export class LocalHiveDataService implements IHiveDataService {
  private hives: Hive[] = [];

  constructor(private storage: Storage) {}

  private save(): void {
    this.storage.set("hives", JSON.stringify(this.hives));
  }

  setLocalData(hives: Hive[]): void {
    this.hives = hives;
  }

  getHives(): Observable<Hive[]> {
    return of(this.hives);
  }

  getHive(id: string): Observable<Hive> {
    const idx = this.hives.findIndex((h) => h.id === id || h.clientId === id);
    return idx > -1 ? of(this.hives[idx]) : EMPTY;
  }

  getBody(id: string): Observable<HiveBody> {
    let ret: HiveBody = null;
    this.hives.forEach((hive) => {
      hive.parts?.forEach((part) => {
        if (part.id === id || part.clientId === id) {
          ret = JSON.parse(JSON.stringify(part));
          const thisHive: Hive = JSON.parse(JSON.stringify(hive));
          delete thisHive.parts;
          ret.hive = thisHive;
        }
      });
    });
    return ret !== null ? of(ret) : EMPTY;
  }

  createHive(hive: Hive): Observable<Hive> {
    hive.clientId = uuidv4();
    this.hives.push(hive);
    this.save();
    return of(hive);
  }

  getFrame(id: string): Observable<Frame> {
    let ret: Frame = null;
    this.hives.forEach((hive) => {
      hive.parts?.forEach((part) => {
        part.frames?.forEach((frame) => {
          if (frame.id === id || frame.clientId === id) {
            ret = JSON.parse(JSON.stringify(frame));
            const thisBox: HiveBody = JSON.parse(JSON.stringify(part));
            const thisHive: Hive = JSON.parse(JSON.stringify(hive));
            delete thisBox.frames;
            delete thisHive.parts;
            thisBox.hive = thisHive;
            ret.body = thisBox;
          }
        });
      });
    });
    return ret !== null ? of(ret) : EMPTY;
  }

  deleteHive(id: string): Observable<boolean> {
    const idx = this.hives.findIndex((h) => h.id === id || h.clientId === id);
    if (idx > -1) {
      this.hives.splice(idx, 1);
    }
    this.save();
    return of(idx > -1);
  }

  deleteBox(id: string): Observable<boolean> {
    let deleted = false;
    this.hives.forEach((hive) => {
      const idx = (hive.parts || []).findIndex(
        (b) => b.id === id || b.clientId === id
      );
      if (idx > -1) {
        deleted = true;
        hive.parts.splice(idx, 1);
      }
    });
    this.save();
    return of(deleted);
  }

  deleteFrame(id: string): Observable<boolean> {
    let deleted = false;
    this.hives.forEach((hive) => {
      (hive.parts || []).forEach((part) => {
        const idx = (part.frames || []).findIndex(
          (f) => f.id === id || f.clientId === id
        );
        if (idx > -1) {
          deleted = true;
          part.frames.splice(idx, 1);
        }
      });
    });
    this.save();
    return of(deleted);
  }

  addBody(hiveId: string, body: HiveBody): Observable<Hive> {
    body.clientId = uuidv4();
    if (body.frames) {
      body.frames.forEach((f) => {
        f.clientId = uuidv4();
      });
    }

    const idx = this.hives.findIndex(
      (h) => h.id === hiveId || h.clientId === hiveId
    );
    if (idx > -1) {
      this.hives[idx].parts = [body].concat(this.hives[idx].parts || []);
      this.save();
      return of(this.hives[idx]);
    }
  }

  addHiveNote(hiveId: string, note: Note): Observable<Note> {
    note.clientId = uuidv4();
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      this.hives[idx].notes = [note].concat(this.hives[idx].notes || []);
    }
    this.save();
    return of(note);
  }

  addBodyNote(id: string, note: Note): Observable<Note> {
    note.clientId = uuidv4();
    this.hives.forEach((hive) => {
      const idx = (hive.parts || []).findIndex(
        (b) => b.id === id || b.clientId === id
      );
      if (idx > -1) {
        hive.parts[idx].notes = [note].concat(hive.parts[idx].notes || []);
      }
    });

    this.save();
    return of(note);
  }

  addFrameNote(id: string, note: Note): Observable<Note> {
    note.clientId = uuidv4();
    this.hives.forEach((hive) => {
      (hive.parts || []).forEach((part) => {
        const idx = (part.frames || []).findIndex(
          (f) => f.id === id || f.clientId === id
        );
        if (idx > -1) {
          part.frames[idx].notes = [note].concat(part.frames[idx].notes || []);
        }
      });
    });

    this.save();
    return of(note);
  }

  setHivePhoto(id: string, filepath: string, webviewPath: string): void {
    const idx = this.hives.findIndex((h) => h.id === id || h.clientId === id);
    if (idx > -1) {
      this.hives[idx].photo = {
        filepath,
        webviewPath,
      };

      this.save();
    }
  }
}

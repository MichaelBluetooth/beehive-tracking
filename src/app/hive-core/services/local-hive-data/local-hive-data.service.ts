import { BoundDirectivePropertyAst } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { EMPTY, Observable, of } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { Frame } from "../../models/frame";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
import { Note } from "../../models/note";
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
            ret.hivePart = thisBox;
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

  deleteNote(id: string): Observable<boolean> {
    let deleted = false;
    const check = (thingWithNotes) => {
      (thingWithNotes.notes || []).forEach((n, idx) => {
        if (n.clientId === id || n.id === id) {
          thingWithNotes.notes.splice(idx, 1);
          deleted = true;
        }
      });
    };

    this.hives.forEach((hive) => {
      check(hive);
      (hive.parts || []).forEach((part) => {
        check(part);
        (part.frames || []).forEach((frame) => {
          check(frame);
        });
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
    const idx = this.hives.findIndex(
      (h) => h.id === hiveId || h.clientId === hiveId
    );
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

  setHiveId(clientId: string, id: string): void {
    const idx = this.hives.findIndex((h) => h.clientId === clientId);
    if (idx > -1) {
      this.hives[idx].id = id;
      this.save();
    }
  }

  updateHive(hive: Hive): void {
    const idx = this.hives.findIndex(
      (h) => h.id === hive.id || h.clientId === hive.clientId
    );
    if (idx > -1) {
      this.hives[idx].id = hive.id;
      this.hives[idx].label = hive.label;
      this.hives[idx].lastModified = hive.lastModified;
      this.hives[idx].queenLastSpotted = hive.queenLastSpotted;
      this.save();
    }
  }

  updateBody(body: HiveBody): void {
    this.hives.forEach((h) => {
      const idx = h.parts.findIndex(
        (p) => p.id === body.id || p.clientId === body.clientId
      );
      if (idx > -1) {
        h.parts[idx].id = body.id;
        h.parts[idx].dateAdded = body.dateAdded;
        h.parts[idx].lastModified = body.lastModified;
        h.parts[idx].type = body.type;
        this.save();
      }
    });
  }

  updateFrame(frame: Frame): void {
    this.hives.forEach((hive) => {
      hive.parts?.forEach((part) => {
        const idx = part.frames?.findIndex(
          (f) => f.id === frame.id || f.clientId === frame.clientId
        );
        if (idx > -1) {
          part.frames[idx].id = frame.id;
          part.frames[idx].label = frame.label;
          part.frames[idx].lastModified = frame.lastModified;
          this.save();
        }
      });
    });
  }

  updateInspection(inspection: Note): void {
    const check = (thingWithNotes) => {
      const idx = (thingWithNotes.notes || []).findIndex(
        (n) => n.clientId === inspection.id || n.id === inspection.id
      );
      if (idx > -1) {
        thingWithNotes.notes[idx].id = inspection.id;
        thingWithNotes.notes[idx].lastModified = inspection.lastModified;
        thingWithNotes.notes[idx].details = inspection.details;
        thingWithNotes.notes[idx].eggs = inspection.eggs;
        thingWithNotes.notes[idx].larva = inspection.larva;
        thingWithNotes.notes[idx].orientationFlights = inspection.orientationFlights;
        thingWithNotes.notes[idx].pests = inspection.pests;
        thingWithNotes.notes[idx].queenCells = inspection.queenCells;
        thingWithNotes.notes[idx].queenSpotted = inspection.queenSpotted;
        thingWithNotes.notes[idx].supersedureCells = inspection.supersedureCells;
        thingWithNotes.notes[idx].swarmCells = inspection.swarmCells;
        thingWithNotes.notes[idx].activityLevel = inspection.activityLevel;
        thingWithNotes.notes[idx].brood = inspection.brood;
        thingWithNotes.notes[idx].cappedHoney = inspection.cappedHoney;
        this.save();
      }
    };

    this.hives.forEach((hive) => {
      check(hive);
      (hive.parts || []).forEach((part) => {
        check(part);
        (part.frames || []).forEach((frame) => {
          check(frame);
        });
      });
    });
  }
}

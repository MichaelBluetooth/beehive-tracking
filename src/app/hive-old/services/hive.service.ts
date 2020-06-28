import { Injectable } from "@angular/core";
import { HIVES } from "../../models/MOCK_HIVES";
import { Hive } from "../../models/hive";
import { Observable, of, BehaviorSubject } from "rxjs";
import { HiveBody } from "src/app/models/hive-body";
import { PhotoService } from "./photo.service";
import { Storage } from "@ionic/storage";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import { Note } from "src/app/models/note";

@Injectable({
  providedIn: "root",
})
export class HiveService {
  // private hives: Hive[] = HIVES;
  private hives: Hive[] = [];
  private hivesSubject = new BehaviorSubject<Hive[]>(this.hives);

  get hives$() {
    return this.hivesSubject.asObservable();
  }

  constructor(private photo: PhotoService, private storage: Storage) {}

  async init() {
    return this.storage.get("hives").then(async (hives) => {
      if (hives) {
        this.hives = JSON.parse(hives);
        this.hives.forEach(async (hive) => {
          if (hive.photo) {
            // const readFile = await Filesystem.readFile({
            //   path: hive.photo.filepath,
            //   directory: FilesystemDirectory.Data,
            // });

            // hive.photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
            hive.photo.base64 = await this.photo.loadSaved(hive.photo);
          }

          if (hive.parts) {
            hive.parts.forEach(async (part) => {
              if (part.frames) {
                part.frames.forEach(async (frame) => {
                  if (frame.notes) {
                    frame.notes.forEach(async (note) => {
                      if (note.photo) {
                        // const readNoteFile = await Filesystem.readFile({
                        //   path: hive.photo.filepath,
                        //   directory: FilesystemDirectory.Data,
                        // });

                        // note.photo.base64 = `data:image/jpeg;base64,${readNoteFile.data}`;
                        note.photo.base64 = await this.photo.loadSaved(
                          note.photo
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });

        this.hivesSubject.next(this.hives);
      } else {
        this.hives = [];
      }
    });
  }

  private save(): void {
    this.storage.set("hives", JSON.stringify(this.hives));
  }

  getHives(): Observable<Hive[]> {
    return of(this.hives);
  }

  addHive(newHive: Hive): Observable<Hive> {
    newHive.id = Math.floor(Math.random() * 10000) + 1;
    this.hives.push(newHive);
    this.save();
    this.hivesSubject.next(this.hives);
    return of(newHive);
  }

  setHivePlants(hiveId: any, plants: string[]): Observable<Hive> {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      this.hives[idx].plants = plants;
      this.save();
      return of(this.hives[idx]);
    } else {
      return of(null);
    }
  }

  addBox(hiveId: any, box: HiveBody): Observable<Hive> {
    if (box.frames) {
      box.frames.forEach((f) => {
        f.id = Math.floor(Math.random() * 10000) + 1;
      });
    }

    box.id = Math.floor(Math.random() * 10000) + 1;
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      this.hives[idx].parts = [box].concat(this.hives[idx].parts || []);
      this.save();
      return of(this.hives[idx]);
    } else {
      return of(null);
    }
  }

  addHiveNote(hiveId: any, note: Note) {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      this.hives[idx].notes = [note].concat(this.hives[idx].notes || []);

      if (note.queenSpotted) {
        this.hives[idx].queenLastSpotted = note.date;
      }

      this.save();
      return of(this.hives[idx]);
    } else {
      return of(null);
    }
  }

  getHive(id: any): Observable<Hive> {
    const idx = this.hives.findIndex((h) => h.id === id);
    return idx > -1 ? of(this.hives[idx]) : of(null);
  }

  deleteHive(id: any): Observable<any> {
    const idx = this.hives.findIndex((h) => h.id === id);
    if (idx > -1) {
      this.hives.splice(idx, 1);
      this.save();
    }
    return of(null);
  }

  deleteBox(hiveId: any, boxId: any): Observable<any> {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      const boxIdx = this.hives[idx].parts.findIndex((p) => p.id === boxId);
      if (boxIdx > -1) {
        this.hives[idx].parts.splice(boxIdx, 1);
        this.save();
        return of(this.hives[idx]);
      }
    }
    return of(null);
  }

  addBoxNote(hiveId: any, boxId: any, note: Note): Observable<any> {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      const boxIdx = this.hives[idx].parts.findIndex((p) => p.id === boxId);
      if (boxIdx > -1) {
        this.hives[idx].parts[boxIdx].notes = [note].concat(
          this.hives[idx].parts[boxIdx].notes || []
        );

        if (note.queenSpotted) {
          this.hives[idx].queenLastSpotted = note.date;
        }

        this.save();
        return of(this.hives[idx].parts[boxIdx]);
      }
    }
    return of(null);
  }

  deleteFrame(hiveId: any, boxId: any, frameId: any): Observable<any> {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      const boxIdx = this.hives[idx].parts.findIndex((p) => p.id === boxId);
      if (boxIdx > -1) {
        const frameIdx = this.hives[idx].parts[boxIdx].frames.findIndex(
          (p) => p.id === frameId
        );
        if (frameIdx > -1) {
          this.hives[idx].parts[boxIdx].frames.splice(frameIdx, 1);
          this.save();
          return of(this.hives[idx]);
        }
      }
    }
    return of(null);
  }

  addFrameNote(
    hiveId: any,
    boxId: any,
    frameId: any,
    note: Note
  ): Observable<any> {
    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      const boxIdx = this.hives[idx].parts.findIndex((p) => p.id === boxId);
      if (boxIdx > -1) {
        const frameIdx = this.hives[idx].parts[boxIdx].frames.findIndex(
          (p) => p.id === frameId
        );
        if (frameIdx > -1) {
          this.hives[idx].parts[boxIdx].frames[frameIdx].notes = [note].concat(
            this.hives[idx].parts[boxIdx].frames[frameIdx].notes || []
          );

          if (note.queenSpotted) {
            this.hives[idx].queenLastSpotted = note.date;
          }

          this.save();
          return of(this.hives[idx].parts[boxIdx].frames[frameIdx]);
        }
      }
    }
    return of(null);
  }

  async setHivePhoto(hiveId: any): Promise<Hive> {
    const photo = await this.photo.takePhoto();

    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      this.hives[idx].photo = {
        filepath: photo.filepath,
        webviewPath: photo.webviewPath,
      };
    }

    this.save();

    return null;
  }

  async addFramePhoto(hiveId: any, boxId: any, frameId: any) {
    const photo = await this.photo.takePhoto();

    const idx = this.hives.findIndex((h) => h.id === hiveId);
    if (idx > -1) {
      const boxIdx = this.hives[idx].parts.findIndex((p) => p.id === boxId);
      if (boxIdx > -1) {
        const frameIdx = this.hives[idx].parts[boxIdx].frames.findIndex(
          (p) => p.id === frameId
        );
        if (frameIdx > -1) {
          const note: Note = {
            date: new Date(),
            details: "Frame photograph taken",
            photo: {
              filepath: photo.filepath,
              webviewPath: photo.webviewPath,
            },
          };

          this.hives[idx].parts[boxIdx].frames[frameIdx].notes = [note].concat(
            this.hives[idx].parts[boxIdx].frames[frameIdx].notes || []
          );
          this.save();
          return of(this.hives[idx].parts[boxIdx].frames[frameIdx]);
        }
      }
    }
    return of(null);
  }

  // setHivePhoto(hiveId: any, photo: Photo): Observable<Hive> {
  //   const idx = this.hives.findIndex((h) => h.id === hiveId);
  //   if (idx > -1) {
  //     this.hives[idx].photo = photo;
  //     return of(this.hives[idx]);
  //   } else {
  //     return of(null);
  //   }
  // }
}
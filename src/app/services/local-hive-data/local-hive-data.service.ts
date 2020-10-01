import { Injectable } from "@angular/core";
import { EMPTY, Observable, of } from "rxjs";
import { Frame } from "src/app/models/frame";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { IHiveDataService } from "../interfaces/hive-data.service";

@Injectable({
  providedIn: "root",
})
export class LocalHiveDataService implements IHiveDataService {
  private hives: Hive[] = [];

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
          ret = part;
        }
      });
    });
    return ret !== null ? of(ret) : EMPTY;
  }

  createHive(hive: Hive): Observable<Hive> {
    this.hives.push(hive);
    return of(hive);
  }

  getFrame(id: string): Observable<Frame> {
    let ret: Frame = null;
    this.hives.forEach((hive) => {
      hive.parts?.forEach((part) => {
        part.frames?.forEach((frame) => {
          if (frame.id === id || frame.clientId === id) {
            ret = frame;
          }
        });
      });
    });
    return ret !== null ? of(ret) : EMPTY;
  }
}

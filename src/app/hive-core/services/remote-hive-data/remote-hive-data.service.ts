import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IHiveDataService } from "../interfaces/hive-data.service";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Frame } from '../../models/frame';

@Injectable({
  providedIn: "root",
})
export class RemoteHiveDataService implements IHiveDataService {
  // Using Ionic Native HTTP instead of Angular HttpClient to avoid TLS/SSL and CORs issues
  // https://ionicframework.com/docs/native/http
  constructor(private http: HttpClient) {}

  getHives(): Observable<Hive[]> {
    return this.http.get("hives").pipe(map((resp: Hive[]) => resp));
  }

  getHive(id: string): Observable<Hive> {
    return this.http.get(`hives/${id}`).pipe(map((resp: Hive) => resp));
  }

  createHive(hive: Hive): Observable<Hive> {
    return this.http.post(`hives/`, hive).pipe(map((resp: Hive) => resp));
  }

  updateHive(hive: Hive): Observable<Hive> {
    return this.http.put(`hives/${hive.id}`, hive).pipe(map((resp: Hive) => resp));
  }

  getBody(id: string): Observable<HiveBody> {
    return this.http.get(`hiveparts/${id}`).pipe(map((resp: HiveBody) => resp));
  }

  getFrame(id: string): Observable<Frame> {
    return this.http.get(`frames/${id}`).pipe(map((resp: Frame) => resp));
  }
}

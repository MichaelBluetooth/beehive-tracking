import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HTTP } from "@ionic-native/http/ngx";
import { IHiveDataService } from '../interfaces/hive-data.service';
import { Hive } from '../../models/hive';
import { HiveBody } from '../../models/hive-body';

@Injectable({
  providedIn: "root",
})
export class RemoteHiveDataService implements IHiveDataService {
  // Using Ionic Native HTTP instead of Angular HttpClient to avoid TLS/SSL and CORs issues
  // https://ionicframework.com/docs/native/http
  constructor(private http: HTTP) {}

  getHives(): Observable<Hive[]> {
    const ret = new Subject<Hive[]>();
    this.http.get(`hives`, {}, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }

  getHive(id: string): Observable<Hive> {
    const ret = new Subject<Hive>();
    this.http.get(`hives/${id}`, {}, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }

  createHive(hive: Hive): Observable<Hive>{
    const ret = new Subject<Hive>();
    this.http.post(`hives`, hive, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }

  updateHive(hive: Hive): Observable<Hive>{
    const ret = new Subject<Hive>();
    this.http.put(`hives/${hive.id}`, hive, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }

  getBody(id: string): Observable<HiveBody> {
    const ret = new Subject<HiveBody>();
    this.http.get(`hiveparts/${id}`, {}, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }

  getFrame(id: string): Observable<HiveBody> {
    const ret = new Subject<HiveBody>();
    this.http.get(`frames/${id}`, {}, {}).then((response: any) => {
      ret.next(response.data);
    }).catch(errResponse => {
      // TODO: error handling? maybe log this somewhere
    });

    return ret;
  }
}

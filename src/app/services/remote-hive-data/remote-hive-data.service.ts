import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Hive } from "src/app/models/hive";
import { HTTP } from "@ionic-native/http/ngx";
import { HiveBody } from 'src/app/models/hive-body';
import { IHiveDataService } from '../interfaces/hive-data.service';

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

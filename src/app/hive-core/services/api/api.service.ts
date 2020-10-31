import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, Subject } from 'rxjs';
import { Logger } from 'src/app/logger/logger';
import { LoggerService } from 'src/app/logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private logger: Logger;

  constructor(
    private http: HTTP,
    private auth: AuthenticationService,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger('ApiService');
  }

  get headers(): any {
    return {
      Authorization: `Bearer ${this.auth.getCredentials()?.accessToken}`
    };
  }

  get(url: string): Observable<any> {
    return this._wrapCall('get', url);
  }

  put(url: string, body: any): Observable<any> {
    return this._wrapCall('put', url, body);
  }

  post(url: string, body: any): Observable<any> {
    return this._wrapCall('post', url, body);
  }

  delete(url: string): Observable<any> {
    return this._wrapCall('delete', url);
  }

  private _wrapCall(
    method: 'get' | 'put' | 'post' | 'delete' | 'patch',
    url: string,
    data?: any,
    retry: boolean = true
  ): Observable<any> {
    const ret = new Subject<any>();
    this.http.sendRequest(url, {method, data}).then((resp: HTTPResponse) => {
      ret.next(resp);
    })
      .catch((error: HTTPResponse) => {
        if (error.status === 401) {
          this.logger.debug(method, url);
          if (retry) {
            this.auth.refresh().subscribe(refreshed => {
              if (refreshed) {
                this.http.sendRequest(url, {method}).then((resp: HTTPResponse) => {
                  ret.next(resp);
                }).catch(((nextError: HTTPResponse) => {
                  this.logger.debug(method, `failed status: ${nextError.status}`, nextError);
                  ret.error(error);
                }));
              } else {
                this.logger.debug(method, `failed status: ${error.status}`, error);
                ret.error(error);
              }
            });
          } else {
            this.logger.debug(method, `failed status: ${error.status}`, error);
            ret.error(error);
          }
        } else {
          this.logger.debug(method, `failed status: ${error.status}`, error);
          ret.error(error);
        }
      });
    return ret;
  }

}

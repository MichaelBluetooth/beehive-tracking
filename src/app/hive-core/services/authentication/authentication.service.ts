import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Logger } from 'src/app/logger/logger';
import { LoggerService } from 'src/app/logger/logger.service';
import { Credentials } from '../../models/credentials';
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  static CREDENTIALS_KEY = 'credentials';

  private logger: Logger;
  private authenticated = new BehaviorSubject<boolean>(false);
  private credentials: Credentials = null;

  get authenticated$() {
    return this.authenticated.asObservable();
  }

  constructor(
    private http: HTTP,
    private storage: Storage,
    loggerSvc: LoggerService) {
    this.logger = loggerSvc.getLogger('AuthenticationService');
  }

  authenticate(username: string, password: string, retry?: boolean): Observable<boolean> {
    const ret = new Subject<boolean>();
    this.http.post('', {}, {}).then((resp: HTTPResponse) => {
      this.logger.info('authenticate', 'successfully authenticated');
      this.saveCredentials(resp.data.accessToken, resp.data.refreshToken);
      this.authenticated.next(true);
      this.logger.info('authenticate', 'succesfully logged in');
      ret.next(true);
    }).catch((error: HTTPResponse) => {
      this.logger.warn('authenticate', `error authenticating: ${error.status}`, error.data);
      ret.next(false);
    });
    return ret;
  }

  refresh(): Observable<boolean> {
    const creds = this.getCredentials();
    const response = new Subject<boolean>();
    if (creds) {
      this.http.post('', { refreshToken: creds.refreshToken }, { Authorization: `Bearer ${creds.accessToken}` }).then((resp: HTTPResponse) => {
        this.logger.info('refresh', 'token refreshed');
        this.saveCredentials(resp.data.accessToken, resp.data.refreshToken);
        response.next(true);
      }).catch((resp: HTTPResponse) => {
        this.logger.info('refresh', `token refresh failed with status ${resp.status}`, resp.data);
        this.clearCredentials();
        response.next(false);
      });
    }
    return response;
  }

  saveCredentials(accessToken: string, refreshToken: string): void {
    this.credentials = {
      accessToken,
      refreshToken
    };
    this.storage.set(AuthenticationService.CREDENTIALS_KEY, JSON.stringify(this.credentials));
  }

  clearCredentials(): void {
    this.credentials = null;
    this.storage.remove(AuthenticationService.CREDENTIALS_KEY);
  }

  getCredentials(): Credentials {
    return this.credentials;
  }

  initializeAuth(): void {
    this.storage.get(AuthenticationService.CREDENTIALS_KEY).then(creds => {
      this.credentials = JSON.parse(creds);
      this.refresh();
    });
  }
}

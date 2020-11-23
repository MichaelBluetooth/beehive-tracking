import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { Credentials } from "../../models/credentials";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static CREDENTIALS_KEY = "credentials";

  private logger: Logger;
  private authenticated = new BehaviorSubject<boolean>(false);
  private credentials: Credentials = null;

  get authenticated$() {
    return this.authenticated.asObservable();
  }

  constructor(
    private http: HttpClient,
    private storage: Storage,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger("AuthenticationService");
  }

  authenticate(username: string, password: string): Observable<boolean> {
    return this.http
      .post("accounts/login", { username, password })
      .pipe(
        map((resp: Credentials) => {
          this.logger.info("authenticate", "successfully authenticated");
          this.saveCredentials(resp.accessToken, resp.refreshToken);
          this.authenticated.next(true);
          this.logger.info("authenticate", "succesfully logged in");
          return true;
        })
      )
      .pipe(
        catchError((error) => {
          this.logger.warn("authenticate", error);
          this.authenticated.next(false);
          return throwError(error);
        })
      );
  }

  refresh(): Observable<boolean> {
    const creds = this.getCredentials();

    if (creds && creds.accessToken) {
      return this.http
        .post("accounts/refresh-token", {
          refreshToken: creds.refreshToken,
        })
        .pipe(
          map((resp: Credentials) => {
            this.logger.info("refresh", "token refreshed");
            this.authenticated.next(true);
            this.saveCredentials(resp.accessToken, resp.refreshToken);
            return true;
          })
        )
        .pipe(
          catchError((error) => {
            this.logger.warn("refresh", "token refresh failed", error);
            this.logout();
            this.authenticated.next(false);
            return throwError(error);
          })
        );
    } else {
      return of(false);
    }
  }

  saveCredentials(accessToken: string, refreshToken: string): void {
    this.credentials = {
      accessToken,
      refreshToken,
    };
    this.storage.set(
      AuthenticationService.CREDENTIALS_KEY,
      JSON.stringify(this.credentials)
    );
  }

  logout(): void {
    this.authenticated.next(false);
    this.credentials = null;
    this.storage.remove(AuthenticationService.CREDENTIALS_KEY);
  }

  getCredentials(): Credentials {
    return this.credentials;
  }

  initializeAuth(): void {
    this.storage.get(AuthenticationService.CREDENTIALS_KEY).then((creds) => {
      this.credentials = JSON.parse(creds);
      this.refresh().subscribe((refreshed) => {
        if (refreshed) {
          this.logger.info(
            "initializeAuth",
            "successfully refreshed token on initialize"
          );
        } else {
          this.logger.info(
            "initializeAuth",
            "could not refresh token on initialize"
          );
        }
      });
    });
  }
}

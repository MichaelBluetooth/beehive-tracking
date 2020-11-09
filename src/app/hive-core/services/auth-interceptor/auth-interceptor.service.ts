import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { AuthenticationService } from "../authentication/authentication.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<
    boolean
  >(false);

  constructor(private auth: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.ignore(request)) {
      return next.handle(request);
    } else {
      return next.handle(this.attachAuthenticationToken(request)).pipe(
        catchError((error) => {
          if (
            request.url.includes("refresh-token") ||
            request.url.includes("login")
          ) {
            if (request.url.includes("refresh-token")) {
              this.auth.logout();
            }
            return throwError(error);
          }

          if (error.status !== 401) {
            return throwError(error);
          }

          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject
              .pipe(filter((result) => result !== false))
              .pipe(take(1))
              .pipe(
                switchMap(() =>
                  next.handle(this.attachAuthenticationToken(request))
                )
              );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(false);

            return this.auth.refresh().pipe(
              switchMap(() => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(true);
                return next.handle(this.attachAuthenticationToken(request));
              })
            );
          }
        })
      );
    }
  }

  attachAuthenticationToken(request: HttpRequest<any>) {
    const creds = this.auth.getCredentials();
    if (!creds || request.url.includes("login")) {
      return request.clone({
        url: `${environment.baseUrl}/${request.url}`,
      });
    } else {
      return request.clone({
        url: `${environment.baseUrl}/${request.url}`,
        setHeaders: {
          Authorization: `Bearer ${creds.accessToken}`,
        },
      });
    }
  }

  ignore(request: HttpRequest<any>): boolean {
    return request.url.indexOf("assets/i18n") > -1;
  }
}

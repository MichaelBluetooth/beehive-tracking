import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Log } from "./log";
import { Logger } from "./logger";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  // tslint:disable-next-line: variable-name
  private _log = new ReplaySubject<Log>();
  private _enabled = false;

  get log$() {
    return this._log.asObservable();
  }

  getLogger(className: string): Logger {
    if (this._enabled) {
      return new Logger(className, this._log);
    }
  }
}

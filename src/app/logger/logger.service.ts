import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Log } from "./log";
import { LogLevel } from "./log-level";
import { Logger } from "./logger";

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private log = new ReplaySubject<Log>();
  private logLevel: LogLevel = LogLevel.OFF;

  get log$() {
    return this.log.asObservable();
  }

  getLogger(className: string): Logger {
    return new Logger(className, this.log, () => this.logLevel);
  }

  setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }
}

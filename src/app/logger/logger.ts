import { ReplaySubject } from "rxjs";
import { Log } from "./log";
import { LogLevel } from "./log-level";

type LogType = "Debug" | "Info" | "Warn" | "Error" | "Fatal";

export class Logger {
  constructor(
    private className: string,
    private log: ReplaySubject<Log>,
    private logLevel: () => LogLevel
  ) {}

  private _log(type: LogType, fnName: string, ...data: any[]): void {
    this.log.next({
      classPath: `${this.className}.${fnName}`,
      data: data.map((d) => JSON.stringify(d)),
      level: this.logLevel(),
      logType: type,
      date: new Date(),
    });
  }

  // Designates fine-grained informational events that are most useful to debug an application.
  debug(fnName: string, ...data: any[]): void {
    if (LogLevel.DEBUG >= this.logLevel()) {
      this._log("Debug", fnName, data);
    }
  }

  // Designates informational messages that highlight the progress of the application at coarse-grained level.
  info(fnName: string, ...data: any[]): void {
    if (LogLevel.INFO >= this.logLevel()) {
      this._log("Info", fnName, data);
    }
  }

  // Designates potentially harmful situations.
  warn(fnName: string, ...data: any[]): void {
    if (LogLevel.WARN >= this.logLevel()) {
      this._log("Warn", fnName, data);
    }
  }

  // Designates error events that might still allow the application to continue running.
  error(fnName: string, ...data: any[]): void {
    if (LogLevel.ERROR >= this.logLevel()) {
      this._log("Error", fnName, data);
    }
  }

  // Designates very severe error events that will presumably lead the application to abort.
  fatal(fnName: string, ...data: any[]): void {
    if (LogLevel.FATAL >= this.logLevel()) {
      this._log("Fatal", fnName, data);
    }
  }
}

import { ReplaySubject } from 'rxjs';
import { Log } from "./log";
import { LogLevel } from "./log-level";

export class Logger {
  logLevel: LogLevel = LogLevel.DEBUG;

  constructor(private className: string, private log: ReplaySubject<Log>) {}

  error(fnName: string, ...data: any[]): void {
    this.log.next({
      classPath: `${this.className}.${fnName}`,
      data: data.map((d) => JSON.stringify(d)),
      level: "error",
      date: new Date(),
    });
  }

  debug(fnName: string, ...data: any[]): void {
    this.log.next({
      classPath: `${this.className}.${fnName}`,
      data: data.map((d) => JSON.stringify(d)),
      level: "error",
      date: new Date(),
    });
  }

  info(fnName: string, ...data: any[]): void {
    this.log.next({
      classPath: `${this.className}.${fnName}`,
      data: data.map((d) => JSON.stringify(d)),
      level: "info",
      date: new Date(),
    });
  }
}

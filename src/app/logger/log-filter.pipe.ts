import { Pipe, PipeTransform } from "@angular/core";
import { Log } from "./log";
import { LogLevel } from "./log-level";

@Pipe({
  name: "logFilter",
})
export class LogFilterPipe implements PipeTransform {
  transform(logs: Log[], logLevel: LogLevel): Log[] {
    if (logLevel === LogLevel.ALL) {
      return logs;
    } else {
      return logs.filter((l) => l.level === logLevel);
    }
  }
}

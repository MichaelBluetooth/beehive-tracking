import { Component, OnInit } from "@angular/core";
import { map, scan } from "rxjs/operators";
import { LoggerService } from "../logger.service";

@Component({
  selector: "app-log-viewer",
  templateUrl: "./log-viewer.component.html",
  styleUrls: ["./log-viewer.component.scss"],
})
export class LogViewerComponent implements OnInit {
  logs$ = this.logService.log$
    .pipe(scan((acc, curr) => [...acc, curr], []))
    .pipe(
      map((logs) => {
        const sorted = logs.sort((a, b) => {
          return b.date - a.date;
        });
        return JSON.parse(JSON.stringify(sorted));
      })
    );
  logLevelFilter = "all";

  constructor(private logService: LoggerService) {}

  ngOnInit() {}

  logLevelChanged(): void {}
}

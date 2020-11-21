import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { Frame } from "../../models/frame";
import { Hive } from "../../models/hive";
import { HiveBody } from "../../models/hive-body";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AppStateService {
  currentHiveCollection$ = new BehaviorSubject<Hive[]>([]);
  currentHive$ = new BehaviorSubject<Hive>(null);
  currentBody$ = new BehaviorSubject<HiveBody>(null);
  currentFrame$ = new BehaviorSubject<Frame>(null);

  constructor(private router: Router, private local: LocalHiveDataService) {}

  refresh(): void {}

  loadHives(navigate: boolean): void {
    this.local.getHives().subscribe((hives) => {
      this.currentFrame$.next(null);
      this.currentBody$.next(null);
      this.currentHive$.next(null);
      this.currentHiveCollection$.next(hives);

      if (navigate) {
        this.router.navigate(["hives"]);
      }
    });
  }

  loadHive(id: string, navigate: boolean): void {
    this.local.getHive(id).subscribe((hive) => {
      this.currentFrame$.next(null);
      this.currentBody$.next(null);
      this.currentHive$.next(hive);

      if (navigate) {
        this.router.navigate(["hives", hive.id || hive.clientId]);
      }
    });
  }

  loadBody(id: string, navigate: boolean): void {
    this.local.getHives().subscribe((hives) => {
      hives.forEach((hive: Hive) => {
        if (hive.parts) {
          hive.parts.forEach((part: HiveBody) => {
            if (part.id === id || part.clientId === id) {
              this.currentFrame$.next(null);
              this.currentBody$.next(part);
              this.currentHive$.next(hive);

              if (navigate) {
                this.router.navigate([
                  "hives",
                  this.currentHive$.value.id ||
                    this.currentHive$.value.clientId,
                  "boxes",
                  part.id || part.clientId,
                ]);
              }
            }
          });
        }
      });
    });
  }

  loadFrame(id: string, navigate: boolean): void {
    this.local.getHives().subscribe((hives) => {
      hives.forEach((hive: Hive) => {
        if (hive.parts) {
          hive.parts.forEach((part: HiveBody) => {
            if (part.frames) {
              part.frames.forEach((frame: Frame) => {
                if (frame.id === id || frame.clientId === id) {
                  this.currentFrame$.next(frame);
                  this.currentBody$.next(part);
                  this.currentHive$.next(hive);

                  if (navigate) {
                    this.router.navigate([
                      "hives",
                      this.currentHive$.value.id ||
                        this.currentHive$.value.clientId,
                      "boxes",
                      this.currentBody$.value.id ||
                        this.currentBody$.value.clientId,
                      "frames",
                      frame.id || frame.clientId,
                    ]);
                  }
                }
              });
            }
          });
        }
      });
    });
  }
}

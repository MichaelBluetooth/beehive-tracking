import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Frame } from "src/app/models/frame";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { RemoteHiveDataService } from "../remote-hive-data/remote-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AppStateService {
  currentHiveCollection$ = new Subject<Hive[]>();
  currentHive$ = new Subject<Hive>();
  currentBody$ = new Subject<HiveBody>();
  currentFrame$ = new Subject<Frame>();

  constructor(
    private local: LocalHiveDataService,
    private remote: RemoteHiveDataService
  ) {}

  loadHives(): void {
    let remoteFinished = false;
    this.remote.getHives().subscribe((hives) => {
      remoteFinished = true;
      this.currentHiveCollection$.next(hives);
      // TODO: update the local store
    });

    this.local.getHives().subscribe((hives) => {
      if (!remoteFinished) {
        // do not emit the local hive if the remote one happened to finish first
        this.currentHiveCollection$.next(hives);
      }
    });
  }

  loadHive(id: string): void {
    let remoteFinished = false;
    this.remote.getHive(id).subscribe((hive) => {
      remoteFinished = true;
      this.currentHive$.next(hive);
      // TODO: update the local store
    });

    this.local.getHive(id).subscribe((hive) => {
      if (!remoteFinished) {
        // do not emit the local hive if the remote one happened to finish first
        this.currentHive$.next(hive);
      }
    });
  }

  loadBody(id: string): void {
    let remoteFinished = false;
    this.remote.getBody(id).subscribe((body) => {
      remoteFinished = true;
      this.currentBody$.next(body);
      // TODO: update the local store
    });

    this.local.getBody(id).subscribe((body) => {
      if (!remoteFinished) {
        this.currentBody$.next(body);
      }
    });
  }

  loadFrame(id: string): void {
    let remoteFinished = false;
    this.remote.getFrame(id).subscribe((frame) => {
      remoteFinished = true;
      this.currentFrame$.next(frame);
      // TODO: update the local store
    });

    this.local.getFrame(id).subscribe((frame) => {
      if (!remoteFinished) {
        this.currentFrame$.next(frame);
      }
    });
  }
}

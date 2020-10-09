import { ThrowStmt } from "@angular/compiler";
import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Frame } from "src/app/hive-core/models/frame";
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class LoadFrameIntentService extends BasicIntent implements OnDestroy {
  currentHive: Hive;
  currentBox: HiveBody;
  subs: Subscription[] = [];

  constructor(private appState: AppStateService, private router: Router) {
    super();

    this.subs.push(
      this.appState.currentBody$.subscribe((b) => {
        this.currentBox = b;
      }),
      this.appState.currentHive$.subscribe((h) => {
        this.currentHive = h;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getPhrases(): string[] {
    return ["open frame", "load frame", "view frame", "go to frame"];
  }

  isMatch(matches: string[]): boolean {
    return (
      super.isMatch(matches) &&
      this.currentBox !== null &&
      this.currentBox !== undefined &&
      this.currentHive !== null &&
      this.currentHive !== undefined
    );
  }

  execute(matches: string[]): void {
    const frameIdx = this.getFrameNumber(matches);
    if (
      frameIdx !== null &&
      this.currentBox &&
      this.currentBox.frames.length >= frameIdx
    ) {
      const targetFrame: Frame = this.currentBox.frames[frameIdx];
      this.router.navigate([
        "hives",
        this.currentHive.id || this.currentHive.clientId,
        "boxes",
        this.currentBox.id || this.currentBox.clientId,
        "frames",
        targetFrame.id || targetFrame.clientId,
      ]);
    }
  }

  getFrameNumber(matches: string[]): number {
    let ret: number = null;

    matches.forEach((match) => {
      if (ret === null) {
        const result = match.match(/\d+/);
        if (result && result.length > 0) {
          ret = +result[0] - 1;
        }
      }
    });

    return ret;
  }
}

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
export class NextFrameIntentService extends BasicIntent implements OnDestroy {
  currentHive: Hive;
  currentBox: HiveBody;
  currentFrame: Frame;
  subs: Subscription[] = [];

  constructor(private appState: AppStateService, private router: Router) {
    super();

    this.subs.push(
      this.appState.currentFrame$.subscribe((f) => {
        this.currentFrame = f;
      }),
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
    return ["next frame"];
  }

  isMatch(matches: string[]): boolean {
    return (
      super.isMatch(matches) &&
      this.currentFrame !== null &&
      this.currentFrame !== undefined &&
      this.currentBox !== null &&
      this.currentBox !== undefined &&
      this.currentHive !== null &&
      this.currentHive !== undefined
    );
  }

  execute(matches: string[]): void {
    const targetFrame: Frame = this.getTargetFrame();
    this.router.navigate([
      "hives",
      this.currentHive.id || this.currentHive.clientId,
      "boxes",
      this.currentBox.id || this.currentBox.clientId,
      "frames",
      targetFrame.id || targetFrame.clientId,
    ]);
  }

  getTargetFrame(): Frame {
    let target: Frame = null;
    this.currentBox.frames.forEach((f, idx) => {
      if (
        f.clientId === this.currentFrame.clientId &&
        this.currentBox.frames.length > idx + 1
      ) {
        target = this.currentBox.frames[idx + 1];
      }
    });
    return target;
  }
}

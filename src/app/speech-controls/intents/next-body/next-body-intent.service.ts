import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class NextBodyIntentService extends BasicIntent implements OnDestroy {
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
    return ["next body"];
  }

  isMatch(matches: string[]): boolean {
    return (
      super.isMatch(matches) &&
      this.currentHive !== null &&
      this.currentHive !== undefined &&
      null !== this.currentHive.parts
    );
  }

  execute(matches: string[]): void {
    const targetBody: HiveBody = this.getTargetBody();
    this.router.navigate([
      "hives",
      this.currentHive.id || this.currentHive.clientId,
      "boxes",
      targetBody.id || targetBody.clientId,
    ]);
  }

  getTargetBody(): HiveBody {
    let target: HiveBody = null;
    this.currentHive.parts.forEach((p, idx) => {
      if (this.currentBox === null) {
        target = this.currentHive.parts[0];
      } else if (
        p.clientId === this.currentBox.clientId &&
        this.currentHive.parts.length > idx + 1
      ) {
        target = this.currentHive.parts[idx + 1];
      }
    });
    return target;
  }
}

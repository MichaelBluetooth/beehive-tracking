import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Hive } from "src/app/hive-core/models/hive";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class LoadBoxIntentService extends BasicIntent implements OnDestroy {
  currentHive: Hive;
  sub: Subscription;

  constructor(private router: Router, private appState: AppStateService) {
    super();

    this.sub = this.appState.currentHive$.subscribe((hive) => {
      this.currentHive = hive;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPhrases(): string[] {
    return ["open box", "load box", "view box", "go to box"];
  }

  execute(matches: string[]) {
    if (this.currentHive) {
      const idx = this.getBoxNumber(matches);

      if (idx && this.currentHive && this.currentHive.parts.length >= idx - 1) {
        this.router.navigate([
          "hives",
          this.currentHive.clientId || this.currentHive.id,
          "boxes",
          this.currentHive.parts[idx - 1].clientId ||
            this.currentHive.parts[idx - 1].id,
        ]);
      }
    }
  }

  getBoxNumber(matches: string[]): number {
    let ret = null;

    matches.forEach((match) => {
      if (ret === null) {
        const result = match.match(/\d+/);
        if (result && result.length > 0) {
          ret = result[0];
        }
      }
    });

    return +ret;
  }
}

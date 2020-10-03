import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HiveTabsService } from "src/app/hive-old/services/hive-tabs.service";
import { Hive } from "src/app/models/hive";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class LoadBoxIntentService extends BasicIntent {
  constructor(private router: Router, private hiveTabs: HiveTabsService) {
    super();
  }

  getPhrases(): string[] {
    return ["open box", "load box", "view box", "go to box"];
  }

  execute(matches: string[]) {
    const idx = this.getBoxNumber(matches);
    const hive: Hive = this.hiveTabs.getCurrentHive();
    if (idx && hive && hive.parts.length >= idx - 1) {
      this.router.navigate(["hives", hive.id, "boxes", hive.parts[idx - 1].id]);
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

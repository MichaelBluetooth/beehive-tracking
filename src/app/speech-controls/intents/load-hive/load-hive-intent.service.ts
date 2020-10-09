import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class LoadHiveIntentService extends BasicIntent {
  constructor(
    private router: Router,
    private hiveService: LocalHiveDataService
  ) {
    super();
  }

  getPhrases(): string[] {
    return ["open hive", "load hive", "view hive", "go to hive"];
  }

  execute(matches: string[]) {
    const idx = this.getHiveNumber(matches);
    if (idx) {
      this.hiveService.getHives().subscribe((hives) => {
        if (hives[idx - 1]) {
          this.router.navigate(["hives", hives[idx - 1].id]);
        }
      });
    }
  }

  getHiveNumber(matches: string[]): number {
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

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HiveService } from 'src/app/hive-old/services/hive.service';
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class LoadHiveIntentService extends BasicIntent {
  constructor(private router: Router, private hiveService: HiveService) {
    super();
  }

  getPhrases(): string[] {
    return ["open hive", "load hive", "view hive", "go to hive"];
  }

  execute(matches: string[]) {
    const idx = this.getHiveNumber(matches);
    if (idx) {
      this.hiveService.getHiveByIdx(idx - 1).subscribe((hive) => {
        if (hive) {
          this.router.navigate(["hives", hive.id]);
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

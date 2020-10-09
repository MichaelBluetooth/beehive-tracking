import { ISpeechService } from "./speech-service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HiveService } from "../services/hive.service";

export const LOAD_HIVE_INTENTS = [
  "open hive",
  "open hyve",
  "load hive",
  "load hyve",
  "view hive",
  "view hyve",
  "vue hive",
  "vue hyve",
  "go to hyve",
  "go to hive"
];

@Injectable({
  providedIn: "root",
})
export class LoadHiveSpeechService implements ISpeechService {
  constructor(private router: Router, private hiveService: HiveService) {}

  isMatch(matches: string[]) {
    return matches.some((m) =>
      LOAD_HIVE_INTENTS.some((i) => m.indexOf(m) > -1)
    );
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

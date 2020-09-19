import { ISpeechService } from "./speech-service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HiveTabsService } from "../services/hive-tabs.service";
import { Hive } from "src/app/models/hive";

export const LOAD_FRAME_INTENTS = [
  "open frame",
  "load frame",
  "view frame",
  "go to frame",
];

@Injectable({
  providedIn: "root",
})
export class LoadBoxSpeechService implements ISpeechService {
  constructor(private router: Router, private hiveTabs: HiveTabsService) {}

  isMatch(matches: string[]) {
    return matches.some((m) =>
      LOAD_FRAME_INTENTS.some((i) => m.indexOf(m) > -1)
    );
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

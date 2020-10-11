import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class CappedHoneyIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "capped honey seen",
      "capped honey spotted",
      "capped honey observed",
      "spotted capped honey ",
      "saw capped honey ",
      "observed capped honey ",
      "has capped honey",
      "capped honey",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      cappedHoney: true,
    };
  }
}

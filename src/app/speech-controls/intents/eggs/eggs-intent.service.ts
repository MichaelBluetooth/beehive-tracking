import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class EggsIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "eggs seen",
      "eggs spotted",
      "eggs observed",
      "spotted eggs",
      "saw eggs",
      "observed eggs",
      "has eggs",
      "eggs",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      eggs: true,
    };
  }
}

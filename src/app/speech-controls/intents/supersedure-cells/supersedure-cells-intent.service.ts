import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class SupersedureCellsIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "supersedure cells seen",
      "supersedure cells spotted",
      "supersedure cells observed",
      "spotted supersedure cells",
      "saw supersedure cells",
      "observed supersedure cells",
      "has supersedure cells",
      "supersedure cells",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      supersedureCells: true,
    };
  }
}

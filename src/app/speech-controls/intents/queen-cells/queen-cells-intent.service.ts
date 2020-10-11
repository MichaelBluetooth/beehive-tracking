import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class QueenCellsIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "queen cells seen",
      "queen cells spotted",
      "queen cells observed",
      "spotted queen cells",
      "saw queen cells",
      "observed queen cells",
      "has queen cells",
      "queen cells",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      queenCells: true,
    };
  }
}

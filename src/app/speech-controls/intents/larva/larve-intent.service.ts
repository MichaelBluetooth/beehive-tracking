import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class LarvaIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "larva seen",
      "larva spotted",
      "larva observed",
      "spotted larva",
      "saw larva",
      "observed larva",
      "has larva",
      "larva",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      larva: true,
    };
  }
}

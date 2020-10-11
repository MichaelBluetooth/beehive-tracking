import { Injectable } from "@angular/core";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicObservationIntent } from "../basic-observation-intent";

@Injectable({
  providedIn: "root",
})
export class SwarmCellsIntentService extends BasicObservationIntent {
  constructor(
    localHiveData: LocalHiveDataService,
    appState: AppStateService
  ) {
    super(localHiveData, appState);
  }

  getPhrases(): string[] {
    return [
      "swarm cells seen",
      "swarm cells spotted",
      "swarm cells observed",
      "spotted swarm cells",
      "saw swarm cells",
      "observed swarm cells",
      "has swarm cells",
      "swarm cells",
    ];
  }

  getNote(): Note {
    return {
      date: new Date().toISOString(),
      swarmCells: true,
    };
  }
}

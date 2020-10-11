import { Injectable } from "@angular/core";

import { BroodIntentService } from "../intents/brood/brood-intent.service";
import { CappedHoneyIntentService } from "../intents/capped-honey/capped-honey-intent.service";
import { EggsIntentService } from "../intents/eggs/eggs-intent.service";
import { Intent } from "../intents/intent";
import { LarvaIntentService } from "../intents/larva/larve-intent.service";
import { LoadBoxIntentService } from "../intents/load-box/load-box-intent.service";
import { LoadFrameIntentService } from "../intents/load-frame/load-frame-intent.service";
import { LoadHiveIntentService } from "../intents/load-hive/load-hive-intent.service";
import { QueenCellsIntentService } from "../intents/queen-cells/queen-cells-intent.service";
import { SupersedureCellsIntentService } from "../intents/supersedure-cells/supersedure-cells-intent.service";
import { SwarmCellsIntentService } from "../intents/swarm-cells/swarm-cells-intent.service";

@Injectable({
  providedIn: "root",
})
export class SpeechInterpreterService {
  intents: Intent[] = [];

  constructor(
    broodIntent: BroodIntentService,
    cappedHoneyIntent: CappedHoneyIntentService,
    eggsIntent: EggsIntentService,
    larvaIntent: LarvaIntentService,
    loadBoxIntent: LoadBoxIntentService,
    loadFrameIntent: LoadFrameIntentService,
    loadHiveIntent: LoadHiveIntentService,
    nextFrameIntent: LoadFrameIntentService,
    queenCellsIntent: QueenCellsIntentService,
    supercedureCellsIntent: SupersedureCellsIntentService,
    swarmCellsIntent: SwarmCellsIntentService
  ) {
    this.intents.push(
      broodIntent,
      cappedHoneyIntent,
      eggsIntent,
      larvaIntent,
      loadBoxIntent,
      loadFrameIntent,
      loadHiveIntent,
      nextFrameIntent,
      queenCellsIntent,
      supercedureCellsIntent,
      swarmCellsIntent
    );
  }

  checkAndExecuteMatch(matches: string[]): void {
    const firstMatchingIntent: Intent = this.intents.find((i) =>
      i.isMatch(matches)
    );
    if (firstMatchingIntent) {
      firstMatchingIntent.execute(matches);
    }
  }
}

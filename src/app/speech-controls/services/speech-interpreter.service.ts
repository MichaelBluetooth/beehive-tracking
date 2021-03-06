import { Injectable } from "@angular/core";
import { Logger } from 'src/app/logger/logger';
import { LoggerService } from 'src/app/logger/logger.service';

import { BroodIntentService } from "../intents/brood/brood-intent.service";
import { CappedHoneyIntentService } from "../intents/capped-honey/capped-honey-intent.service";
import { EggsIntentService } from "../intents/eggs/eggs-intent.service";
import { Intent } from "../intents/intent";
import { LarvaIntentService } from "../intents/larva/larve-intent.service";
import { LoadBoxIntentService } from "../intents/load-box/load-box-intent.service";
import { LoadFrameIntentService } from "../intents/load-frame/load-frame-intent.service";
import { LoadHiveIntentService } from "../intents/load-hive/load-hive-intent.service";
import { NextFrameIntentService } from "../intents/next-frame/next-frame-intent.service";
import { PreviousFrameIntentService } from '../intents/previous-frame/previous-frame-intent.service';
import { QueenCellsIntentService } from "../intents/queen-cells/queen-cells-intent.service";
import { StopListeningIntentService } from '../intents/stop-listening/stop-listening-intent.service';
import { SupersedureCellsIntentService } from "../intents/supersedure-cells/supersedure-cells-intent.service";
import { SwarmCellsIntentService } from "../intents/swarm-cells/swarm-cells-intent.service";

@Injectable({
  providedIn: "root",
})
export class SpeechInterpreterService {
  intents: Intent[] = [];
  logger: Logger;

  constructor(
    loggerSvc: LoggerService,
    broodIntent: BroodIntentService,
    cappedHoneyIntent: CappedHoneyIntentService,
    eggsIntent: EggsIntentService,
    larvaIntent: LarvaIntentService,
    loadBoxIntent: LoadBoxIntentService,
    loadFrameIntent: LoadFrameIntentService,
    loadHiveIntent: LoadHiveIntentService,
    nextFrameIntent: NextFrameIntentService,
    queenCellsIntent: QueenCellsIntentService,
    supercedureCellsIntent: SupersedureCellsIntentService,
    swarmCellsIntent: SwarmCellsIntentService,
    previousFrameIntent: PreviousFrameIntentService,
    stopListeningIntent: StopListeningIntentService
  ) {
    this.logger = loggerSvc.getLogger('SpeechInterpreterService');
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
      swarmCellsIntent,
      previousFrameIntent,
      stopListeningIntent
    );
  }

  checkAndExecuteMatch(matches: string[]): void {
    this.logger.debug('checkAndExecuteMatch', 'checking matches', matches);
    const firstMatchingIntent: Intent = this.intents.find((i) =>
      i.isMatch(matches)
    );
    if (firstMatchingIntent) {
      this.logger.info('checkAndExecuteMatch', 'match found', firstMatchingIntent.constructor.name);
      firstMatchingIntent.execute(matches);
    }
  }
}

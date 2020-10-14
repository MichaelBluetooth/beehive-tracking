import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Frame } from "src/app/hive-core/models/frame";
import { Hive } from "src/app/hive-core/models/hive";
import { HiveBody } from "src/app/hive-core/models/hive-body";
import { Note } from "src/app/hive-core/models/note";
import { AppStateService } from "src/app/hive-core/services/app-state/app-state.service";
import { LocalHiveDataService } from "src/app/hive-core/services/local-hive-data/local-hive-data.service";
import { BasicIntent } from "./basic-intent";

export abstract class BasicObservationIntent
  extends BasicIntent
  implements OnDestroy {
  subs: Subscription[] = [];
  currentHive: Hive;
  currentBody: HiveBody;
  currentFrame: Frame;

  constructor(
    private localHiveData: LocalHiveDataService,
    private appState: AppStateService
  ) {
    super(true);

    this.subs.push(
      this.appState.currentHive$.subscribe((h) => {
        this.currentHive = h;
      }),
      this.appState.currentBody$.subscribe((b) => {
        this.currentBody = b;
      }),
      this.appState.currentFrame$.subscribe((f) => {
        this.currentFrame = f;
      })
    );
  }

  abstract getPhrases(): string[];
  abstract getNote(): Note;

  ngOnDestroy() {
    this.subs.forEach((s) => {
      s.unsubscribe();
    });
  }

  execute(matches: string[]): void {
    const note: Note = this.getNote();

    if (this.currentFrame) {
      this.localHiveData
        .addFrameNote(this.currentFrame.id || this.currentFrame.clientId, note)
        .subscribe(() => {
          this.appState.loadFrame(this.currentFrame.clientId || this.currentFrame.id, true);
        });
    } else if (this.currentBody) {
      this.localHiveData
        .addBodyNote(this.currentBody.id || this.currentBody.clientId, note)
        .subscribe(() => {
          this.appState.loadBody(this.currentBody.clientId || this.currentBody.id, true);
        });
    } else {
      this.localHiveData
        .addHiveNote(this.currentHive.id || this.currentHive.clientId, note)
        .subscribe(() => {
          this.appState.loadHive(this.currentHive.clientId || this.currentHive.id, true);
        });
    }
  }

  isMatch(matches: string[]) {
    return (
      ((null !== this.currentHive &&
      undefined !== this.currentHive) ||
      (null !== this.currentBody &&
      undefined !== this.currentBody) ||
      (null !== this.currentFrame &&
      undefined !== this.currentFrame)) &&
      matches.some((m) =>
        this.getPhrases().some(
          (p) => m.toLowerCase().indexOf(p.toLowerCase()) > -1
        )
      )
    );
  }
}

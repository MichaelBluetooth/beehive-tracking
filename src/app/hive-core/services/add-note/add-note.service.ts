import { Injectable, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { Frame } from '../../models/frame';
import { Hive } from '../../models/hive';
import { HiveBody } from '../../models/hive-body';
import { AppStateService } from "../app-state/app-state.service";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AddNoteService implements OnDestroy {
  private currentHive: Hive;
  private currentBox: HiveBody;
  private currentFrame: Frame;
  private subs: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private localHiveData: LocalHiveDataService,
    private modal: ModalController
  ) {
    this.subs = [
      this.appState.currentHive$.subscribe((hive) => {
        this.currentHive = hive;
      }),
      this.appState.currentBody$.subscribe((body) => {
        this.currentBox = body;
      }),
      this.appState.currentFrame$.subscribe((frame) => {
        this.currentFrame = frame;
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  async addNote() {
    const modal = await this.modal.create({
      component: AddNoteComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        if (this.currentFrame) {
          this.localHiveData
            .addFrameNote(this.currentFrame.clientId || this.currentFrame.id, modalResponse.data)
            .subscribe((updatedFrame) => {
              this.appState.loadFrame(this.currentFrame.clientId || this.currentFrame.id, true);
            });
        } else if (this.currentBox) {
          this.localHiveData
            .addBodyNote(this.currentBox.clientId || this.currentBox.id, modalResponse.data)
            .subscribe((updatedBox) => {
              this.appState.loadBody(this.currentBox.clientId || this.currentBox.id, true);
            });
        } else {
          this.localHiveData
            .addHiveNote(this.currentHive.clientId || this.currentHive.id, modalResponse.data)
            .subscribe((updatedHive) => {
              this.appState.loadHive(this.currentHive.clientId || this.currentHive.id, true);
            });
        }
      }
    });

    return await modal.present();
  }
}

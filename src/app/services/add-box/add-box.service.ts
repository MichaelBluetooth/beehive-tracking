import { Injectable, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { AddBoxComponent } from "src/app/components/add-box/add-box.component";
import { Hive } from "src/app/models/hive";
import { AppStateService } from "../app-state/app-state.service";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AddBoxService implements OnDestroy {
  currentHive: Hive;
  hiveSub: Subscription;

  constructor(
    private localHiveData: LocalHiveDataService,
    private appState: AppStateService,
    private modal: ModalController
  ) {
    this.hiveSub = this.appState.currentHive$.subscribe((hive) => {
      this.currentHive = hive;
    });
  }

  ngOnDestroy() {
    this.hiveSub.unsubscribe();
  }

  async addBox() {
    const modal = await this.modal.create({
      component: AddBoxComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.localHiveData
          .addBody(
            this.currentHive.clientId || this.currentHive.id,
            modalResponse.data
          )
          .subscribe(() => {
            this.appState.loadHive(
              this.currentHive.clientId || this.currentHive.id,
              true
            );
          });
      }
    });

    return await modal.present();
  }
}

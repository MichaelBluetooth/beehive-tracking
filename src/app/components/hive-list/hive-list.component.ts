import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Hive } from "src/app/models/hive";
import { AppStateService } from "src/app/services/app-state/app-state.service";
import { AddHiveComponent } from '../add-hive/add-hive.component';

@Component({
  selector: "app-hive-list",
  templateUrl: "./hive-list.component.html",
  styleUrls: ["./hive-list.component.scss"],
})
export class HiveListComponent implements OnInit {
  hives$ = this.appState.currentHiveCollection$;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private appState: AppStateService
  ) {}

  ngOnInit() {}

  async addHive() {
    const modal = await this.modalController.create({
      component: AddHiveComponent,
    });
    return await modal.present();
  }

  navigateToHive(hive: Hive) {
    this.appState.loadHive(hive.clientId || hive.id, true);
  }
}

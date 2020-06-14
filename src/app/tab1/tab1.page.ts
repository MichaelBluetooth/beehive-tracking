import { Component } from "@angular/core";
import { HIVES } from "../models/MOCK_HIVES";
import { ModalController } from "@ionic/angular";
import { AddHiveComponent } from "./add-hive/add-hive.component";
import { Router } from "@angular/router";
import { Hive } from '../models/hive';

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  hives = HIVES;

  constructor(
    public modalController: ModalController,
    private router: Router
  ) {}

  async addHive() {
    const modal = await this.modalController.create({
      component: AddHiveComponent,
    });
    return await modal.present();
  }

  navigateToHive(hive: Hive) {
    // this.router.navigate
  }
}

import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Hive } from "src/app/models/hive";
import { AddHiveComponent } from "../add-hive/add-hive.component";
import { HiveService } from '../../services/hive.service';

@Component({
  selector: "app-hive-list",
  templateUrl: "./hive-list.component.html",
  styleUrls: ["./hive-list.component.scss"],
})
export class HiveListComponent implements OnInit {
  hives: Hive[] = [];

  constructor(
    public modalController: ModalController,
    private router: Router,
    private hiveService: HiveService
  ) {}

  ngOnInit() {
    this.hiveService.hives$.subscribe(hives => {
      this.hives = hives;
    });
  }

  async addHive() {
    const modal = await this.modalController.create({
      component: AddHiveComponent,
    });
    return await modal.present();
  }

  navigateToHive(hive: Hive) {
    this.router.navigate(['hives', hive.id]);
  }
}

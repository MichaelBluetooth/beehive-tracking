import { Component, OnInit } from "@angular/core";
import { Hive } from "src/app/models/hive";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MenuController,
  ModalController,
  AlertController,
  ActionSheetController,
} from "@ionic/angular";
import { AddBoxComponent } from "../add-box/add-box.component";
import { PhotoService } from "../../services/photo.service";
import { AddNoteComponent } from "../add-note/add-note.component";
import { HiveTabsService } from "../../services/hive-tabs.service";
import { HiveService } from '../../services/hive.service';

@Component({
  selector: "app-hive",
  templateUrl: "./hive.component.html",
  styleUrls: ["./hive.component.scss"],
})
export class HiveComponent implements OnInit {
  hive: Hive;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveService: HiveService,
    private modal: ModalController,
    private photoService: PhotoService,
    private alert: AlertController,
    private actionSheetController: ActionSheetController,
    private hiveTabs: HiveTabsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((routeData) => {
      this.hiveService.getHive(routeData.id).subscribe((hive) => {
        this.hive = hive;
        this.hiveTabs.setHiveState(this.hive);
      });
    });
  }

  async addBody() {
    const modal = await this.modal.create({
      component: AddBoxComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.hiveService
          .addBox(this.hive.id, modalResponse.data)
          .subscribe((updatedHive) => {
            this.hive = updatedHive;
          });
      }
    });

    return await modal.present();
  }

  async addNote() {
    const modal = await this.modal.create({
      component: AddNoteComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.hiveService
          .addHiveNote(this.hive.id, modalResponse.data)
          .subscribe((updatedHive) => {
            this.hive = updatedHive;
          });
      }
    });

    return await modal.present();
  }

  navigateToBox(part) {
    this.router.navigate(["hives", this.hive.id, "boxes", part.id]);
  }
}

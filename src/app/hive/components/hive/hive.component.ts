import { Component, OnInit } from "@angular/core";
import { Hive } from "src/app/models/hive";
import { HiveService } from "src/app/hive/services/hive.service";
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
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((routeData) => {
      this.hiveService.getHive(+routeData.id).subscribe((hive) => {
        this.hive = hive;
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

  async confirmDelete() {
    const alert = await this.alert.create({
      header: "Confirm Delete",
      message:
        "Are you sure you want to delete this Hive? This action cannot be undone.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            this.hiveService.deleteHive(this.hive.id).subscribe(() => {
              this.router.navigate(["hives"]);
            });
          },
        },
      ],
    });

    await alert.present();
  }

  navigateToBox(part) {
    this.router.navigate(["hives", this.hive.id, "boxes", part.id]);
  }

  async presentMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: "Hive Options",
      buttons: [
        {
          text: "Delete",
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.confirmDelete();
          },
        },
        {
          text: "Record Note",
          icon: 'newspaper-outline',
          handler: () => {
            this.addNote();
          },
        },
        {
          text: "Add Box",
          icon: 'cube-outline',
          handler: () => {
            this.addBody();
          },
        },
        {
          text: "Take Photo",
          icon: 'camera-outline',
          handler: () => {
            this.hiveService.setHivePhoto(this.hive.id);
          },
        },
        {
          text: "Cancel",
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }
}

import { Component, OnInit } from "@angular/core";
import { HiveBody } from "src/app/models/hive-body";
import { ActivatedRoute, Router } from "@angular/router";
import { HiveService } from "../../services/hive.service";
import { Hive } from "src/app/models/hive";
import {
  AlertController,
  MenuController,
  ModalController,
  ActionSheetController,
} from "@ionic/angular";
import { AddNoteComponent } from "../add-note/add-note.component";

@Component({
  selector: "app-box",
  templateUrl: "./box.component.html",
  styleUrls: ["./box.component.scss"],
})
export class BoxComponent implements OnInit {
  box: HiveBody;
  hive: Hive;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveService: HiveService,
    private alert: AlertController,
    private menu: MenuController,
    private modal: ModalController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((routeParams) => {
      this.hiveService.getHive(+routeParams.id).subscribe((hive) => {
        this.hive = hive;
        this.box = hive.parts.find((p) => p.id === +routeParams.boxId);
      });
    });
  }

  async confirmDelete() {
    this.menu.close();
    const alert = await this.alert.create({
      header: "Confirm Delete",
      message:
        "Are you sure you want to delete this Box? This action cannot be undone.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            this.hiveService
              .deleteBox(this.hive.id, this.box.id)
              .subscribe(() => {
                this.router.navigate(["hives", this.hive.id]);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async addNote() {
    this.menu.close();
    const modal = await this.modal.create({
      component: AddNoteComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.hiveService
          .addBoxNote(this.hive.id, this.box.id, modalResponse.data)
          .subscribe((updatedBox) => {
            this.box = updatedBox;
          });
      }
    });

    return await modal.present();
  }

  navigateToFrame(frame) {
    this.router.navigate([
      "hives",
      this.hive.id,
      "boxes",
      this.box.id,
      "frames",
      frame.id,
    ]);
  }

  async presentMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: "Box Options",
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

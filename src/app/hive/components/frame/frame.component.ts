import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  AlertController,
  ModalController,
  ActionSheetController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { HiveService } from "../../services/hive.service";
import { Hive } from "src/app/models/hive";
import { BoxComponent } from "../box/box.component";
import { HiveBody } from "src/app/models/hive-body";
import { Frame } from "src/app/models/frame";
import { AddNoteComponent } from "../add-note/add-note.component";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.scss"],
})
export class FrameComponent implements OnInit {
  hive: Hive;
  box: HiveBody;
  frame: Frame;

  constructor(
    private hiveService: HiveService,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertController,
    private modal: ModalController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((routeParams) => {
      this.hiveService.getHive(+routeParams.id).subscribe((hive) => {
        this.hive = hive;
        this.box = hive.parts.find((p) => p.id === +routeParams.boxId);
        this.frame = this.box.frames.find((f) => f.id === +routeParams.frameId);
      });
    });
  }

  async confirmDelete() {
    const alert = await this.alert.create({
      header: "Confirm Delete",
      message:
        "Are you sure you want to delete this Frame? This action cannot be undone.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            this.hiveService
              .deleteFrame(this.hive.id, this.box.id, this.frame.id)
              .subscribe(() => {
                this.router.navigate([
                  "hives",
                  this.hive.id,
                  "boxes",
                  this.box.id,
                ]);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async addNote() {
    const modal = await this.modal.create({
      component: AddNoteComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.hiveService.addFrameNote(this.hive.id, this.box.id, this.frame.id, modalResponse.data)
          .subscribe(updatedFrame => {
            this.frame = updatedFrame;
          });
      }
    });

    return await modal.present();
  }

  async presentMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: "Frame Options",
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
          text: "Take Photo",
          icon: 'camera-outline',
          handler: () => {},
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

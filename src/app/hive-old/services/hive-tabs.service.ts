import { Injectable } from "@angular/core";
import { HiveService } from "./hive.service";
import { Observable, Subject } from "rxjs";
import { AddNoteComponent } from "../components/add-note/add-note.component";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { Frame } from "src/app/models/frame";
import { isNullOrUndefined } from "util";
import { Router } from "@angular/router";
import { AddBoxComponent } from "../components/add-box/add-box.component";
import { PlantsListComponent } from '../components/plants-list/plants-list.component';

@Injectable({
  providedIn: "root",
})
export class HiveTabsService {
  private currentHive: Hive;
  private currentBox: HiveBody;
  private currentFrame: Frame;

  constructor(
    private modal: ModalController,
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private hiveService: HiveService,
    private router: Router
  ) {}

  delete(): void {
    if (this.currentFrame) {
      this.confirmDelete("Frame").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.hiveService
            .deleteFrame(
              this.currentHive.id,
              this.currentBox.id,
              this.currentFrame.id
            )
            .subscribe(() => {
              this.router.navigate([
                "hives",
                this.currentHive.id,
                "boxes",
                this.currentBox.id,
              ]);
            });
        });
      });
    } else if (this.currentBox) {
      this.confirmDelete("Box").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.hiveService
            .deleteBox(this.currentHive.id, this.currentBox.id)
            .subscribe(() => {
              this.router.navigate(["hives", this.currentHive.id]);
            });
        });
      });
    } else {
      this.confirmDelete("Hive").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.hiveService.deleteHive(this.currentHive.id).subscribe(() => {
            this.router.navigate(["hives"]);
          });
        });
      });
    }
  }

  async confirmDelete(itemName: string) {
    const afterConfirm: Subject<any> = new Subject();

    const alert = await this.alert.create({
      header: "Confirm Delete",
      message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            afterConfirm.next();
          },
        },
      ],
    });

    await alert.present();

    return afterConfirm.asObservable();
  }

  takePhoto(): void {
    if (this.currentFrame) {
      this.hiveService.addFramePhoto(
        this.currentHive.id,
        this.currentBox.id,
        this.currentFrame.id
      );
    } else if (this.currentBox) {
      this.hiveService.addBoxPhoto(
        this.currentHive.id,
        this.currentBox.id
      );
    } else {
      this.hiveService.setHivePhoto(this.currentHive.id);
    }
  }

  async addNote() {
    const modal = await this.modal.create({
      component: AddNoteComponent,
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        if (this.currentFrame) {
          this.hiveService
            .addFrameNote(
              this.currentHive.id,
              this.currentBox.id,
              this.currentFrame.id,
              modalResponse.data
            )
            .subscribe((updatedFrame) => {
              this.currentFrame = updatedFrame;
            });
        } else if (this.currentBox) {
          this.hiveService
            .addBoxNote(
              this.currentHive.id,
              this.currentBox.id,
              modalResponse.data
            )
            .subscribe((updatedBox) => {
              this.currentBox = updatedBox;
            });
        } else {
          this.hiveService
            .addHiveNote(this.currentHive.id, modalResponse.data)
            .subscribe((updatedHive) => {
              this.currentHive = updatedHive;
            });
        }
      }
    });

    return await modal.present();
  }

  async loadOptions(): Promise<any> {
    const options: any[] = [
      {
        text: "Delete",
        role: "destructive",
        icon: "trash",
        handler: () => {
          this.delete();
        },
      },
      {
        text: "New Inspection",
        icon: "eye-outline",
        handler: () => {
          this.addNote();
        },
      },
      {
        text: "Take Photo",
        icon: "camera-outline",
        handler: () => {
          this.takePhoto();
        },
      },
      {
        text: "Cancel",
        icon: "close",
        role: "cancel",
        handler: () => {},
      },
    ];

    if (this.currentHive && !this.currentBox && !this.currentFrame) {
      options.push(
        {
          text: "Add Box",
          icon: "cube-outline",
          handler: async () => {
            const modal = await this.modal.create({
              component: AddBoxComponent,
            });

            modal.onDidDismiss().then((modalResponse) => {
              if (modalResponse.data) {
                this.hiveService
                  .addBox(this.currentHive.id, modalResponse.data)
                  .subscribe((updatedHive) => {
                    this.currentHive = updatedHive;
                  });
              }
            });

            return await modal.present();
          },
        },
        {
          text: "Nearby Plants",
          icon: "leaf-outline",
          handler: async () => {
            const modal = await this.modal.create({
              component: PlantsListComponent,
              componentProps: {
                selectedPlants: this.currentHive.plants
              }
            });

            modal.onDidDismiss().then((modalResponse) => {
              if (modalResponse.data) {
                this.hiveService.setHivePlants(this.currentHive.id, modalResponse.data).subscribe(updatedHive => {
                  this.currentHive = updatedHive;
                });
              }
            });

            return await modal.present();
          },
        }
      );
    }

    const actionSheet = await this.actionSheet.create({
      header: "Options",
      buttons: options,
    });

    await actionSheet.present();
  }

  private isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined;
  }

  stateSet(): boolean {
    return (
      !this.isNullOrUndefined(this.currentHive) ||
      !this.isNullOrUndefined(this.currentBox) ||
      !this.isNullOrUndefined(this.currentFrame)
    );
  }

  setHiveState(hive: Hive): void {
    this.clearState();
    this.currentHive = hive;
  }

  setBoxState(box: HiveBody, hive: Hive): void {
    this.clearState();
    this.currentHive = hive;
    this.currentBox = box;
  }

  setFrameState(frame: Frame, box: HiveBody, hive: Hive): void {
    this.clearState();
    this.currentHive = hive;
    this.currentBox = box;
    this.currentFrame = frame;
  }

  clearState(): void {
    this.currentHive = null;
    this.currentBox = null;
    this.currentFrame = null;
  }
}

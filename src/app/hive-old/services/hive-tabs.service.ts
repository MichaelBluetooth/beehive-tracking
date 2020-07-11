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
import { Router } from "@angular/router";
import { AddBoxComponent } from "../components/add-box/add-box.component";
import { PlantsListComponent } from '../components/plants-list/plants-list.component';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    private translator: TranslateService
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

    const itemNameTranslated = this.translator.instant(`MAIN-TABS.delete-item-name.${itemName.toLowerCase()}`);
    const alert = await this.alert.create({
      header: this.translator.instant('MAIN-TABS.delete-header'),
      message: this.translator.instant('MAIN-TABS.delete-message', {itemName: itemNameTranslated}),
      buttons: [
        this.translator.instant('MAIN.cancel'),
        {
          text: this.translator.instant('MAIN.delete'),
          handler: () => {
            afterConfirm.next();
          },
        },
      ],
    });

    await alert.present();

    return afterConfirm.asObservable();
  }

  takePhoto(prompt?: boolean): void {
    if (this.currentFrame) {
      this.hiveService.addFramePhoto(
        this.currentHive.id,
        this.currentBox.id,
        this.currentFrame.id,
        prompt
      );
    } else if (this.currentBox) {
      this.hiveService.addBoxPhoto(
        this.currentHive.id,
        this.currentBox.id,
        prompt
      );
    } else {
      this.hiveService.addHivePhoto(this.currentHive.id, prompt);
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
        text: this.translator.instant('MAIN.delete'),
        role: "destructive",
        icon: "trash",
        handler: () => {
          this.delete();
        },
      },
      {
        text: this.translator.instant('MAIN-TABS.new-inspection'),
        icon: "eye-outline",
        handler: () => {
          this.addNote();
        },
      },
      {
        text: this.translator.instant('MAIN-TABS.take-photo'),
        icon: 'camera-outline',
        handler: () => {
          this.takePhoto(true);
        },
      },
      {
        text: this.translator.instant('MAIN.cancel'),
        icon: "close",
        role: "cancel",
        handler: () => {},
      },
    ];

    if (this.currentHive && !this.currentBox && !this.currentFrame) {
      options.push(
        {
          text: this.translator.instant('MAIN-TABS.set-hive-photo'),
          icon: "image-outline",
          handler: async () => {
            this.hiveService.setHivePhoto(this.currentHive.id);
          },
        },
        {
          text: this.translator.instant('MAIN-TABS.add-box'),
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
          text: this.translator.instant('MAIN-TABS.nearby-plants'),
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
      header: this.translator.instant('MAIN-TABS.options'),
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

import { Injectable, OnDestroy } from "@angular/core";
import {
  ActionSheetController,
  ModalController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AddBoxComponent } from "src/app/components/add-box/add-box.component";
import { Frame } from "src/app/models/frame";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { AddBoxService } from '../add-box/add-box.service';
import { AddNoteService } from '../add-note/add-note.service';
import { AddPhotoService } from '../add-photo/add-photo.service';
import { AppStateService } from "../app-state/app-state.service";
import { DeleteHiveDataService } from "../delete-hive-data/delete-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class TabsService implements OnDestroy {
  private currentHive: Hive;
  private currentBox: HiveBody;
  private currentFrame: Frame;
  private subs: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private modal: ModalController,
    private actionSheet: ActionSheetController,
    private translator: TranslateService,
    private deleteService: DeleteHiveDataService,
    private addNoteService: AddNoteService,
    private addPhotoService: AddPhotoService,
    private addBoxService: AddBoxService
  ) {
    this.subs = [
      this.appState.currentHive$.subscribe((hive) => {
        this.currentHive = hive;
      }),
      this.appState.currentBody$.subscribe((body) => {
        this.currentBox = body;
      }),
      this.appState.currentFrame$.subscribe((frame) => {
        this.currentFrame = frame;
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  delete(): void {
    this.deleteService.delete();
  }

  takePhoto(): void {
    this.addPhotoService.addPhoto();
  }

  async addNote() {
    this.addNoteService.addNote();
  }

  async loadOptions(): Promise<any> {
    const options: any[] = [
      {
        text: this.translator.instant("MAIN.delete"),
        role: "destructive",
        icon: "trash",
        handler: () => {
          this.delete();
        },
      },
      {
        text: this.translator.instant("MAIN-TABS.new-inspection"),
        icon: "eye-outline",
        handler: () => {
          this.addNote();
        },
      },
      {
        text: this.translator.instant("MAIN-TABS.take-photo"),
        icon: "camera-outline",
        handler: () => {
          this.takePhoto();
        },
      },
      {
        text: this.translator.instant("MAIN.cancel"),
        icon: "close",
        role: "cancel",
        handler: () => {},
      },
    ];

    if (this.currentHive && !this.currentBox && !this.currentFrame) {
      options.push(
        {
          text: this.translator.instant("MAIN-TABS.set-hive-photo"),
          icon: "image-outline",
          handler: async () => {
            // this.hiveService.setHivePhoto(this.currentHive.id);
          },
        },
        {
          text: this.translator.instant("MAIN-TABS.add-box"),
          icon: "cube-outline",
          handler: async () => {
            return this.addBoxService.addBox();
          },
        }
      );
    }

    const actionSheet = await this.actionSheet.create({
      header: this.translator.instant("MAIN-TABS.options"),
      buttons: options,
    });

    await actionSheet.present();
  }
}

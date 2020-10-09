import { Injectable, OnDestroy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { Frame } from "src/app/models/frame";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { Note } from "src/app/models/note";
import { AppStateService } from "../app-state/app-state.service";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { PhotoService } from '../photo/photo.service';

@Injectable({
  providedIn: "root",
})
export class AddPhotoService implements OnDestroy {
  private currentHive: Hive;
  private currentBox: HiveBody;
  private currentFrame: Frame;
  private subs: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private localHiveData: LocalHiveDataService,
    private photoService: PhotoService
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

  async setHivePhoto(): Promise<void> {
    if (this.currentHive) {
      const photo = await this.photoService.takePhoto();
      this.localHiveData.setHivePhoto(
        this.currentHive.id || this.currentHive.clientId,
        photo.filepath,
        photo.webviewPath
      );
    }
  }

  async addPhoto() {
    const cameraPhoto = await this.photoService.takePhoto(false);
    const note: Note = {
      date: new Date(),
      details: "Hive photograph taken",
      photo: {
        filepath: cameraPhoto.filepath,
        webviewPath: cameraPhoto.webviewPath,
      },
    };

    if (this.currentFrame) {
      this.localHiveData.addFrameNote(
        this.currentFrame.id || this.currentFrame.clientId,
        note
      );
    } else if (this.currentBox) {
      this.localHiveData.addFrameNote(
        this.currentBox.id || this.currentBox.clientId,
        note
      );
    } else {
      this.localHiveData.addFrameNote(
        this.currentHive.id || this.currentHive.clientId,
        note
      );
    }
  }
}

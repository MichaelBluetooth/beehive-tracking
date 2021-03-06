import { Injectable, OnDestroy } from "@angular/core";
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, Subscription } from "rxjs";
import { Frame } from '../../models/frame';
import { Hive } from '../../models/hive';
import { HiveBody } from '../../models/hive-body';
import { AppStateService } from "../app-state/app-state.service";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class DeleteHiveDataService implements OnDestroy {

  private currentHive: Hive;
  private currentBox: HiveBody;
  private currentFrame: Frame;
  private subs: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private localHiveData: LocalHiveDataService,
    private translator: TranslateService,
    private alert: AlertController
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

  deleteHive(id: string): Observable<any> {
    return this.localHiveData.deleteHive(id);
  }

  deleteBox(id: string): Observable<any> {
    return this.localHiveData.deleteBox(id);
  }

  deleteFrame(id: string): Observable<any> {
    return this.localHiveData.deleteFrame(id);
  }

  deleteNote(id: string): Observable<any> {
    const ret = new Subject<any>();
    this.confirmDelete("Note").then(afterConfirm => {
      afterConfirm.subscribe(() => {
        this.localHiveData.deleteNote(id).subscribe(deleted => {
          ret.next(deleted);
          if (this.currentFrame) {
            this.appState.loadFrame(
              this.currentFrame.id || this.currentFrame.clientId,
              false
            );
          } else if (this.currentBox) {
            this.appState.loadBody(
              this.currentBox.id || this.currentBox.clientId,
              false
            );
          } else if (this.currentHive) {
            this.appState.loadHive(
              this.currentHive.id || this.currentHive.clientId,
              false
            );
          }
        });
      });
    });
    return ret;
  }

  delete(): void {
    if (this.currentFrame) {
      this.confirmDelete("Frame").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.deleteFrame(this.currentFrame.id || this.currentFrame.clientId)
            .subscribe(() => {
              this.appState.loadBody(
                this.currentBox.id || this.currentBox.clientId,
                true
              );
            });
        });
      });
    } else if (this.currentBox) {
      this.confirmDelete("Box").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.deleteBox(this.currentBox.id || this.currentBox.clientId)
            .subscribe(() => {
              this.appState.loadHive(
                this.currentHive.id || this.currentHive.clientId,
                true
              );
            });
        });
      });
    } else {
      this.confirmDelete("Hive").then((afterConfirm) => {
        afterConfirm.subscribe(() => {
          this.deleteHive(this.currentHive.id || this.currentHive.clientId)
            .subscribe(() => {
              this.appState.loadHives(true);
            });
        });
      });
    }
  }

  async confirmDelete(itemName: string) {
    const afterConfirm: Subject<any> = new Subject();

    const itemNameTranslated = this.translator.instant(
      `MAIN-TABS.delete-item-name.${itemName.toLowerCase()}`
    );
    const alert = await this.alert.create({
      header: this.translator.instant("MAIN-TABS.delete-header"),
      message: this.translator.instant("MAIN-TABS.delete-message", {
        itemName: itemNameTranslated,
      }),
      buttons: [
        this.translator.instant("MAIN.cancel"),
        {
          text: this.translator.instant("MAIN.delete"),
          handler: () => {
            afterConfirm.next();
          },
        },
      ],
    });

    await alert.present();

    return afterConfirm.asObservable();
  }
}

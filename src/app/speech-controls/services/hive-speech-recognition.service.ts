import { Injectable, NgZone } from "@angular/core";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AlertController } from "@ionic/angular";
import { BehaviorSubject, Observable } from "rxjs";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { SpeechInterpreterService } from "./speech-interpreter.service";

@Injectable({
  providedIn: "root",
})
export class HiveSpeechRecognitionService {
  private _listening$ = new BehaviorSubject<boolean>(false);

  get listening$(): Observable<boolean> {
    return this._listening$.asObservable();
  }

  constructor(
    private speechRecognition: SpeechRecognition,
    private speechInterpreter: SpeechInterpreterService,
    private alert: AlertController,
    private ngZone: NgZone
  ) {}

  async stopListening() {
    // Run the following inside a zone to make sure change detection triggers
    this.ngZone.run(() => {
      this.speechRecognition.stopListening().then(() => {
        this._listening$.next(false);
      });
    });
  }

  async listen() {
    // Run the following inside a zone to make sure change detection triggers
    this.ngZone.run(() => {
      this.checkSpeechAvailability().then((avail) => {
        if (avail) {
          this.checkPermission().then((granted) => {
            if (granted) {
              this._listening$.next(true);
              try {
                this.speechRecognition
                  .startListening({ showPopup: false, matches: 15 })
                  .subscribe(
                    (matches: string[]) => {
                      this.speechInterpreter.checkAndExecuteMatch(matches);
                      this.listen();
                    },
                    (error) => {
                      if (error === "No match") {
                        this.listen();
                      } else {
                        // I think a "0" means the Ionic Speech recognition plugin didn't hear anything and sort of "times out"
                        this._listening$.next(false);
                      }
                    }
                  );
              } catch {
                // some kind of fatal exception?
                this._listening$.next(false);
              }
            }
          });
        }
      });
    });
  }

  checkSpeechAvailability(): Promise<boolean> {
    return this.speechRecognition.isRecognitionAvailable().then((available) => {
      if (!available) {
        this.showNotAvailableMessage();
        return false;
      } else {
        return true;
      }
    });
  }

  checkPermission(): Promise<boolean> {
    let granted;
    const permissionPromise = new Promise<boolean>((resolve) => {
      granted = resolve;
    });
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (hasPermission) {
        granted(true);
      } else {
        this.speechRecognition.requestPermission().then(
          () => {
            granted(true);
          },
          () => {
            this.showPermissionNotGranted();
            granted(false);
          }
        );
      }
    });

    return permissionPromise;
  }

  async showNotAvailableMessage() {
    // TODO: translate this!!
    const alert = await this.alert.create({
      header: "Speech Recognition Not Available",
      message: "Speech recognition is not available at this time.",
    });

    await alert.present();
  }

  async showPermissionNotGranted() {
    // TODO: translate this!!
    const alert = await this.alert.create({
      header: "Microphone Permission Denied",
      message:
        "The app must have permission to use your microphone to process speech.",
    });

    await alert.present();
  }
}

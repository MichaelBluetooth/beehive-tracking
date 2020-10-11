import { Injectable } from "@angular/core";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AlertController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { SpeechInterpreterService } from "./speech-interpreter.service";

@Injectable({
  providedIn: "root",
})
export class HiveSpeechRecognitionService {
  listening$ = new BehaviorSubject<boolean>(false);

  constructor(
    private speechRecognition: SpeechRecognition,
    private speechInterpreter: SpeechInterpreterService,
    private alert: AlertController
  ) {}

  async stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.listening$.next(false);
    });
  }

  async listen() {
    this.checkSpeechAvailability().then((avail) => {
      if (avail) {
        this.checkPermission().then((granted) => {
          if (granted) {
            this.listening$.next(true);
            this.speechRecognition
              .startListening({ showPopup: false })
              .subscribe(
                (matches: string[]) => {
                  this.speechInterpreter.checkAndExecuteMatch(matches);
                  this.listen();
                },
                (error) => {
                  if (error !== 0) {
                    // some error?
                    this.listening$.next(false);
                  } else {
                    // I think a "0" means the Ionic Speech recognition plugin didn't hear anything and sort of "times out"
                    this.listening$.next(false);
                  }
                }
              );
          }
        });
      }
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

  async checkPermission(): Promise<boolean> {
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

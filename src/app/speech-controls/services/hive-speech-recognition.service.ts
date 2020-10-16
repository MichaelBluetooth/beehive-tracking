import { Injectable, NgZone } from "@angular/core";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AlertController } from "@ionic/angular";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";
import { SpeechInterpreterService } from "./speech-interpreter.service";
import { SpeechListeningService } from "./speech-listening.service";

@Injectable({
  providedIn: "root",
})
export class HiveSpeechRecognitionService {
  logger: Logger;

  constructor(
    private speechRecognition: SpeechRecognition,
    private speechInterpreter: SpeechInterpreterService,
    private alert: AlertController,
    private listeningSvc: SpeechListeningService,
    private ngZone: NgZone,
    loggerSvc: LoggerService
  ) {
    this.logger = loggerSvc.getLogger("HiveSpeechRecognitionService");
  }

  async stopListening() {
    // Run the following inside a zone to make sure change detection triggers
    this.ngZone.run(() => {
      this.speechRecognition.stopListening().then(() => {
        this.listeningSvc.stopListening();
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
              this.listeningSvc.setListening();
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
                        this.logger.debug('listen', 'no speech detected, restarting speech recognition');
                        this.listen();
                      } else {
                        this.logger.error(
                          "listen",
                          "unknown speech recognition error",
                          error
                        );
                        this.listeningSvc.stopListening();
                      }
                    }
                  );
              } catch (error) {
                // some kind of fatal exception?
                this.logger.error(
                  "listen",
                  "exception thrown when starting speech recognition",
                  error
                );
                this.listeningSvc.stopListening();
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

import { Injectable } from "@angular/core";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AlertController } from "@ionic/angular";
import { LoadHiveSpeechService } from "../speech-intents/load-hive-speech.service";
import { LoadBoxSpeechService } from "../speech-intents/load-box-speech.service";

@Injectable({
  providedIn: "root",
})
export class HiveSpeechService {
  matches = [];
  timer = null;

  constructor(
    private speechRecognition: SpeechRecognition,
    private alert: AlertController,
    private loadHiveSpeechService: LoadHiveSpeechService,
    private loadBoxSpeechService: LoadBoxSpeechService
  ) {}

  async startListening() {
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) => {
        if (!available) {
          this.showNotAvailableMessage();
        } else {
          this.speechRecognition
            .hasPermission()
            .then((hasPermission: boolean) => {
              if (!hasPermission) {
                // Request permissions
                this.speechRecognition.requestPermission().then(
                  () => {
                    this.processSpeechLoop();
                  },
                  () => {
                    this.showError(
                      "The app must have permission to use your microphone to process speech."
                    );
                  }
                );
              } else {
                this.processSpeechLoop();
              }
            });
        }
      });
  }

  processSpeechLoop() {
    this.processSpeech();
  }

  processSpeech() {
    this.speechRecognition
      .startListening({ prompt: "Speak a command!", showPopup: false })
      .subscribe(
        (matches: string[]) => {
          this.matches = this.matches.concat(matches);
          if (
            matches.find((s) => s.toLowerCase().indexOf("stop listening") > -1)
          ) {
            this.speechRecognition.stopListening();
            this.showMatches(this.matches);
            this.processSpeech();
          } else {
            if (this.loadHiveSpeechService.isMatch(matches)) {
              this.loadHiveSpeechService.execute(matches);
            } else if (this.loadBoxSpeechService.isMatch(matches)) {
              this.loadBoxSpeechService.execute(matches);
            }

            this.processSpeech();
          }
        },
        (error) => {
          if (error === "No match") {
            this.processSpeech();
          } else if (error !== 0) {
            this.showError(error);
          }
        }
      );
  }

  async showNotAvailableMessage() {
    const alert = await this.alert.create({
      header: "Speech Recognition Not Available",
      message: "Speech recognition is not available at this time",
    });

    await alert.present();
  }

  async showError(error: any) {
    const alert = await this.alert.create({
      header: "Error Occured",
      message: JSON.stringify(error),
    });

    await alert.present();
  }

  async showMatches(matches: string[]) {
    const alert = await this.alert.create({
      header: "Matches",
      message: JSON.stringify(matches),
    });

    await alert.present();
  }
}

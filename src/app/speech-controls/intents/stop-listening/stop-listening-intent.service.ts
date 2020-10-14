import { Injectable } from "@angular/core";
import { HiveSpeechRecognitionService } from '../../services/hive-speech-recognition.service';
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class StopListeningIntentService extends BasicIntent {
  constructor(private speechRecognitionService: HiveSpeechRecognitionService) {
    super(true);
  }

  getPhrases(): string[] {
    return ["stop listening", "halt listening"];
  }
  execute(matches: string[]): void {
    this.speechRecognitionService.stopListening();
  }
}

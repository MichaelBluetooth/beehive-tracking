import { Injectable } from "@angular/core";
import { SpeechListeningService } from "../../services/speech-listening.service";
import { BasicIntent } from "../basic-intent";

@Injectable({
  providedIn: "root",
})
export class StopListeningIntentService extends BasicIntent {
  constructor(private listeningSvc: SpeechListeningService) {
    super(true);
  }

  getPhrases(): string[] {
    return ["stop listening", "halt listening"];
  }

  execute(matches: string[]): void {
    this.listeningSvc.stopListening();
  }
}

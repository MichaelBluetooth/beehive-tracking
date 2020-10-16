import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechListeningService {
  private listening = new BehaviorSubject<boolean>(false);

  get listening$(): Observable<boolean> {
    return this.listening.asObservable();
  }

  setListening(): void {
    this.listening.next(true);
  }

  stopListening(): void {
    this.listening.next(false);
  }
}

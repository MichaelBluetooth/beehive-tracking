import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Frame } from '../../models/frame';
import { Hive } from '../../models/hive';
import { HiveBody } from '../../models/hive-body';
import { AppStateService } from '../../services/app-state/app-state.service';

@Component({
  selector: "app-box",
  templateUrl: "./box.component.html",
  styleUrls: ["./box.component.scss"],
})
export class BoxComponent {
  box$: Observable<HiveBody> = this.appState.currentBody$;
  hive$: Observable<Hive> = this.appState.currentHive$;

  constructor(private appState: AppStateService) {}

  navigateToFrame(frame: Frame): void {
    this.appState.loadFrame(frame.id || frame.clientId, true);
  }
}

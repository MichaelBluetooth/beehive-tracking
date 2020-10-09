import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Frame } from "src/app/models/frame";
import { Hive } from 'src/app/models/hive';
import { HiveBody } from 'src/app/models/hive-body';
import { AppStateService } from "src/app/services/app-state/app-state.service";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.scss"],
})
export class FrameComponent {
  frame$: Observable<Frame> = this.appState.currentFrame$;
  box$: Observable<HiveBody> = this.appState.currentBody$;
  hive$: Observable<Hive> = this.appState.currentHive$;

  constructor(private appState: AppStateService) {}
}

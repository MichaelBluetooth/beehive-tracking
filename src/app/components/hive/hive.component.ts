import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Hive } from "src/app/models/hive";
import { HiveBody } from "src/app/models/hive-body";
import { AppStateService } from "src/app/services/app-state/app-state.service";

@Component({
  selector: "app-hive",
  templateUrl: "./hive.component.html",
  styleUrls: ["./hive.component.scss"],
})
export class HiveComponent {
  hive$: Observable<Hive> = this.appState.currentHive$;

  constructor(private appState: AppStateService) {}

  navigateToBox(box: HiveBody) {
    this.appState.loadBody(box.id || box.clientId, true);
  }
}

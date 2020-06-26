import { Component, OnInit } from "@angular/core";
import { HiveService } from "./services/hive.service";
import { HiveTabsService } from './services/hive-tabs.service';

@Component({
  selector: "app-hive-page",
  template: `
    TEST
    <ion-router-outlet></ion-router-outlet>
    <ion-tabs *ngIf="showTabs">
      <ion-tab-bar slot="bottom">
        <ion-tab-button (click)="openOptions()">
          <ion-icon name="settings-outline"></ion-icon>
          <ion-label>Options</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="takePhoto()">
          <ion-icon name="camera"></ion-icon>
          <ion-label>Take Picture</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="addNode()">
          <ion-icon name="eye-outline"></ion-icon>
          <ion-label>Inspection</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class HivePageComponent implements OnInit {
  loading = false;

  get showTabs(): boolean {
    return true; // this.hiveTabs.stateSet();
  }

  constructor(
    private hive: HiveService,
    private hiveTabs: HiveTabsService
    ) {}

  ngOnInit() {
  }

  takePhoto(): void {
    this.hiveTabs.takePhoto();
  }

  addNode(): void {
    this.hiveTabs.addNote();
  }

  openOptions(): void {
    this.hiveTabs.loadOptions();
  }
}

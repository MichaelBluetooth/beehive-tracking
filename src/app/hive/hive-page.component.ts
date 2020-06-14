import { Component, OnInit } from "@angular/core";
import { HiveService } from './services/hive.service';

@Component({
  selector: "app-hive-page",
  template: `
  <!-- <ng-container *ngIf="!loading"> -->
    <ion-router-outlet></ion-router-outlet>
  <!-- </ng-container>  -->
  `,
})
export class HivePageComponent implements OnInit {
  loading = true;

  constructor(private hive: HiveService){}

  ngOnInit(){
    this.hive.init().then(() => {
      this.loading = false;
    });
  }
}

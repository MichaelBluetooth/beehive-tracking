import { Component, OnInit } from "@angular/core";
import { TabsService } from "src/app/services/tabs/tabs.service";

@Component({
  selector: "app-hive-page",
  templateUrl: "./hive-page.component.html",
  styleUrls: ["./hive-page.component.scss"],
})
export class HivePageComponent implements OnInit {
  constructor(private tabsService: TabsService) {}

  ngOnInit() {}

  takePhoto(): void {
    this.tabsService.takePhoto();
  }

  addNote(): void {
    this.tabsService.addNote();
  }

  openOptions(): void {
    this.tabsService.loadOptions();
  }
}

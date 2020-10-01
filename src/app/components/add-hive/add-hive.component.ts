import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IonInput, ModalController } from "@ionic/angular";
import { AddHiveService } from "src/app/services/add-hive/add-hive.service";
import { AppStateService } from "src/app/services/app-state/app-state.service";

@Component({
  selector: "app-add-hive",
  templateUrl: "./add-hive.component.html",
  styleUrls: ["./add-hive.component.scss"],
})
export class AddHiveComponent implements OnInit {
  @ViewChild("labelField") myInput: IonInput;

  hive = new FormGroup({
    label: new FormControl("", Validators.required),
  });

  constructor(
    private modalCtrl: ModalController,
    private appState: AppStateService,
    private addHiveService: AddHiveService
  ) {}

  ngOnInit() {}

  ionViewLoaded() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  addHive(): void {
    this.addHiveService.addHive(this.hive.value).subscribe((added) => {
      this.appState.loadHive(added.clientId);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { HiveService } from "src/app/hive/services/hive.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ModalController, IonInput } from "@ionic/angular";

@Component({
  selector: "app-add-hive",
  templateUrl: "./add-hive.component.html",
  styleUrls: ["./add-hive.component.scss"],
})
export class AddHiveComponent implements OnInit {
  @ViewChild('labelField') myInput: IonInput;

  hive = new FormGroup({
    label: new FormControl("", Validators.required),
  });

  constructor(
    private hiveService: HiveService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewLoaded(){
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  addHive(): void {
    this.hiveService.addHive(this.hive.value).subscribe((added) => {
      this.modalCtrl.dismiss();
    });
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }
}

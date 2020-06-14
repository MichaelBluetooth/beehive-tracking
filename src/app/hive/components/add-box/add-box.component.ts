import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { HiveBody } from "src/app/models/hive-body";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-add-box",
  templateUrl: "./add-box.component.html",
  styleUrls: ["./add-box.component.scss"],
})
export class AddBoxComponent implements OnInit {
  box: HiveBody = {
    label: null,
    type: null,
    frames: []
  };

  numFrames = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  formValue() {
    return JSON.stringify(this.box);
  }

  labelChange(label) {
    this.box.label = label;
  }

  typeChange(type) {
    this.box.type = type;
  }

  numChange(num){
    this.numFrames = num;
  }

  isInvalid() {
    return !this.box.label || !this.box.type || !this.numFrames;
  }

  addBox() {
    for (let i = 0; i < this.numFrames; i++) {
      this.box.frames.push({
        label: "Frame " + (i + 1),
      });
    }

    this.modalCtrl.dismiss(this.box);
  }
}

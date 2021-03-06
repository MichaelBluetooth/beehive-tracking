import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { HiveBody } from '../../models/hive-body';

@Component({
  selector: "app-add-box",
  templateUrl: "./add-box.component.html",
  styleUrls: ["./add-box.component.scss"],
})
export class AddBoxComponent implements OnInit {
  box: HiveBody = {
    label: null,
    type: null,
    frames: [],
    dateAdded: new Date().toISOString()
  };

  numFrames = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  labelChange(label) {
    this.box.label = label;
  }

  typeChange(type) {
    this.box.type = type;
  }

  numChange(num) {
    this.numFrames = num;
  }

  dateChange(date) {
    this.box.dateAdded = date;
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

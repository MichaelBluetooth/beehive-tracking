import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Note } from "../../../models/note";

@Component({
  selector: "app-add-note",
  templateUrl: "./add-note.component.html",
  styleUrls: ["./add-note.component.scss"],
})
export class AddNoteComponent implements OnInit {
  note: Note = {
    date: new Date().toISOString(),
    details: "",
    queenSpotted: false,
    brood: false,
    eggs: false,
    queenCells: false,
    swarmCells: false,
    supersedureCells: false,
    pests: [],
  };

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    if (this.navParams && this.navParams.data && this.navParams.data.note) {
      this.note = JSON.parse(JSON.stringify(this.navParams.data.note));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  addNote() {
    this.modalCtrl.dismiss(this.note);
  }
}

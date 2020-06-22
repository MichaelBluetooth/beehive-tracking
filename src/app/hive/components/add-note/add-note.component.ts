import { Component, OnInit } from "@angular/core";
import { ModalController } from '@ionic/angular';
import { Note } from '../../../models/note';

@Component({
  selector: "app-add-note",
  templateUrl: "./add-note.component.html",
  styleUrls: ["./add-note.component.scss"],
})
export class AddNoteComponent implements OnInit {

  note: Note = {
    date: new Date().toISOString(),
    details: '',
    queenSpotted: false,
    pests: []
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  addNote(){
    this.modalCtrl.dismiss(this.note);
  }
}

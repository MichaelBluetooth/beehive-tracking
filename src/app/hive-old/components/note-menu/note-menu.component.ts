import { Component, OnInit, Input } from "@angular/core";
import {
  NavParams,
  PopoverController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { HiveService } from "../../services/hive.service";
import { Note } from "src/app/models/note";
import { AddNoteComponent } from "../add-note/add-note.component";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-note-menu",
  templateUrl: "./note-menu.component.html",
  styleUrls: ["./note-menu.component.scss"],
})
export class NoteMenuComponent implements OnInit {
  @Input() note: Note;

  constructor(
    private hiveService: HiveService,
    private navParams: NavParams,
    private popOver: PopoverController,
    private alert: AlertController,
    private share: SocialSharing,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.note = this.navParams.data.note;
  }

  dismiss() {
    this.popOver.dismiss();
  }

  shareImage(note: Note) {
    this.share.share("", "", note.photo.filepath).then(() => {
      // share was success
    });
  }

  async confirmDelete() {
    const alert = await this.alert.create({
      header: "Confirm Delete",
      message:
        "Are you sure you want to delete this Note? This action cannot be undone.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          handler: () => {
            this.hiveService.deleteNote(this.note.id).subscribe(() => {
              this.popOver.dismiss({ deleted: true });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async editNote() {
    const modal = await this.modal.create({
      component: AddNoteComponent,
      componentProps: {
        note: this.note,
      },
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
        this.note = modalResponse.data;
        this.hiveService.updateNote(this.note);
        this.popOver.dismiss({ updated: modalResponse.data });
      }
    });

    return await modal.present();
  }
}
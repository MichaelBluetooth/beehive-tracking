import { Component, OnInit, Input } from "@angular/core";
import {
  NavParams,
  PopoverController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Hive } from '../../models/hive';
import { Note } from '../../models/note';
import { AddNoteComponent } from '../add-note/add-note.component';
import { TranslateService } from '@ngx-translate/core';
import { DeleteHiveDataService } from '../../services/delete-hive-data/delete-hive-data.service';

@Component({
  selector: "app-note-menu",
  templateUrl: "./note-menu.component.html",
  styleUrls: ["./note-menu.component.scss"],
})
export class NoteMenuComponent implements OnInit {
  /* The note this menu belongs to */
  @Input() note: Note;
  /* The hive this note belongs to */
  @Input() hive: Hive;

  constructor(
    private navParams: NavParams,
    private popOver: PopoverController,
    private alert: AlertController,
    private share: SocialSharing,
    private modal: ModalController,
    private translate: TranslateService,
    private deleteSvc: DeleteHiveDataService
  ) {}

  ngOnInit() {
    this.note = this.navParams.data.note;
  }

  dismiss() {
    this.popOver.dismiss();
  }

  shareImage() {
    if (this.note.photo) {
      this.share.share("", "", this.note.photo.filepath).then(() => {
        // share was success
      });
    }
  }

  setHivePhoto() {
    if (this.note.photo) {
      // this.hiveService.setHivePhotoFromExisting(this.hive.id, this.note.photo);
      this.dismiss();
    }
  }

  async delete() {
    this.deleteSvc.deleteNote(this.note.clientId).subscribe((didDelete) => {
      this.popOver.dismiss({ deleted: didDelete });
    });
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
        // this.note = modalResponse.data;
        // this.hiveService.updateNote(this.note);
        // this.popOver.dismiss({ updated: modalResponse.data });
      }
    });

    return await modal.present();
  }
}

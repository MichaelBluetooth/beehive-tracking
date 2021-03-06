import { Component, OnInit, Input } from "@angular/core";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { PopoverController } from "@ionic/angular";
import { Hive } from '../../models/hive';
import { Note } from '../../models/note';
import { NoteMenuComponent } from "../note-menu/note-menu.component";

@Component({
  selector: "app-notes-list",
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
})
export class NotesListComponent implements OnInit {
  @Input() hive: Hive;
  @Input() notes: Note[] = [];
  selected = null;

  constructor(
    private share: SocialSharing,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  shareImage(note: Note) {
    this.share.share("", "", note.photo.filepath).then(() => {
      // share was success
    });
  }

  setSelected(idx: number) {
    if (idx === this.selected) {
      this.selected = null;
    } else {
      this.selected = idx;
    }
  }

  async showNoteMenu(currentNote: Note) {
    const popover = await this.popoverController.create({
      component: NoteMenuComponent,
      componentProps: { note: currentNote, hive: this.hive },
      translucent: true,
    });
    popover.onDidDismiss().then((dismissEvt: any) => {
      if (dismissEvt && dismissEvt.data) {
        if (dismissEvt.data.deleted) {
          this.selected = null;
        } else if (dismissEvt.data.updated) {
          // note was updated
        }
      }
    });
    return await popover.present();
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { Note } from "src/app/models/note";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Component({
  selector: "app-notes-list",
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
})
export class NotesListComponent implements OnInit {
  @Input() notes: Note[] = [];
  selected = null;

  constructor(private share: SocialSharing) {}

  ngOnInit() {}

  shareImage(note: Note) {
    this.share
      .share(
        "",
        "",
        note.photo.filepath
      )
      .then(() => {
        // share was success
      });
  }

  setSelected(idx) {
    this.selected = idx;
  }
}

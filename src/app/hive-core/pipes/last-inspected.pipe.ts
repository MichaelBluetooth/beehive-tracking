import { Pipe, PipeTransform } from "@angular/core";
import { Hive } from '../models/hive';

@Pipe({
  name: "lastInspected",
})
export class LastInspectedPipe implements PipeTransform {
  transform(hive: Hive): Date {
    if (!hive) {
      return null;
    }

    let lastInspected = null;
    let allNotes = [];
    if (hive.notes) {
      allNotes = allNotes.concat(hive.notes);
    }
    if (hive.parts) {
      hive.parts.forEach((p) => {
        if (p.notes) {
          allNotes = allNotes.concat(p.notes);
        }

        if (p.frames) {
          p.frames.forEach((f) => {
            if (f.notes) {
              allNotes = allNotes.concat(f.notes);
            }
          });
        }
      });
    }

    allNotes.forEach((note) => {
      if (!lastInspected || lastInspected < note.date) {
        lastInspected = note.date;
      }
    });

    return lastInspected;
  }
}

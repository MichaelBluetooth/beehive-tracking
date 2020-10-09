import { Pipe, PipeTransform } from "@angular/core";
import { Frame } from "src/app/models/frame";

@Pipe({
  name: "frameLastInspected",
})
export class FrameLastInspectedPipe implements PipeTransform {
  transform(frame: Frame): Date {
    if (!frame) {
      return null;
    }

    let lastInspected = null;

    if (frame.notes) {
      frame.notes.forEach((note) => {
        if (!lastInspected || lastInspected < note.date) {
          lastInspected = note.date;
        }
      });
    }

    return lastInspected;
  }
}

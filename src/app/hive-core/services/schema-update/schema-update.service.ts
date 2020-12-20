import { Injectable } from "@angular/core";
import { ModelBase } from "../../models/model-base";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class SchemaUpdateService {
  constructor(private localHiveData: LocalHiveDataService) {}

  update() {
    this.localHiveData.getHives().subscribe((hives) => {
      hives.forEach((hive) => {
        this.ensureIds(hive);
        if (hive.notes) {
          hive.notes.forEach((note) => {
            this.ensureIds(note);
          });
        }

        if (hive.parts) {
          hive.parts.forEach((part) => {
            this.ensureIds(part);

            if (part.notes) {
              part.notes.forEach((note) => {
                this.ensureIds(note);
              });
            }

            if (part.frames) {
              part.frames.forEach((frame) => {
                this.ensureIds(frame);

                if (frame.notes) {
                  frame.notes.forEach((note) => {
                    this.ensureIds(note);
                  });
                }
              });
            }
          });
        }
      });

      this.localHiveData.save();
    });
  }

  ensureIds(model: ModelBase): void {
    if (!model.clientId) {
      model.clientId = uuidv4();
    }

    if (model.id) {
      model.id = null;
    }
  }
}

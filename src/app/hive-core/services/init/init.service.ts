import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Note } from '../../models/note';
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { PhotoService } from "../photo/photo.service";
import { SchemaUpdateService } from '../schema-update/schema-update.service';

@Injectable({
  providedIn: "root",
})
export class InitService {
  constructor(
    private storage: Storage,
    private photoService: PhotoService,
    private localHiveData: LocalHiveDataService,
    private schemaUpdater: SchemaUpdateService
  ) {}

  async init() {
    return this.storage.get("hives").then(async (hiveJSON) => {
      if (hiveJSON) {
        const hives = JSON.parse(hiveJSON);
        hives.forEach(async (hive) => {
          if (hive.photo) {
            hive.photo.base64 = await this.photoService.loadSaved(
              hive.photo
            );
          }

          if (hive.notes) {
            hive.notes.forEach(async (note) => {
              if (note.photo) {
                note.photo.base64 = await this.photoService.loadSaved(
                  note.photo
                );
              }
            });
          }

          if (hive.parts) {
            hive.parts.forEach(async (part) => {
              if (part.notes) {
                part.notes.forEach(async (note: Note) => {
                  if (note.photo) {
                    note.photo.base64 = await this.photoService.loadSaved(
                      note.photo
                    );
                  }
                });
              }

              if (part.frames) {
                part.frames.forEach(async (frame) => {
                  if (frame.notes) {
                    frame.notes.forEach(async (note) => {
                      if (note.photo) {
                        note.photo.base64 = await this.photoService.loadSaved(
                          note.photo
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });

        this.localHiveData.setLocalData(hives);
        this.schemaUpdater.update();
      }
    });
  }
}

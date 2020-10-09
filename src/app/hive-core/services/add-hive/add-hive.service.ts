import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Hive } from '../../models/hive';
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AddHiveService {
  constructor(private localHiveService: LocalHiveDataService) {}

  addHive(hive: Hive): Observable<Hive> {
    return this.localHiveService.createHive(hive);
  }
}

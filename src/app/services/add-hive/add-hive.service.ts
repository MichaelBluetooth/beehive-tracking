import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Hive } from "src/app/models/hive";
import { v4 as uuidv4 } from "uuid";
import { LocalHiveDataService } from "../local-hive-data/local-hive-data.service";
import { RemoteHiveDataService } from "../remote-hive-data/remote-hive-data.service";

@Injectable({
  providedIn: "root",
})
export class AddHiveService {
  constructor(private localHiveService: LocalHiveDataService) {}

  addHive(hive: Hive): Observable<Hive> {
    hive.clientId = uuidv4();
    return this.localHiveService.createHive(hive);
  }
}

import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AppStateService } from '../services/app-state/app-state.service';

@Injectable({
  providedIn: "root",
})
export class HiveResolver implements Resolve<any> {
  constructor(private appState: AppStateService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.appState.loadHive(route.paramMap.get("id"), false);
    return null;
  }
}

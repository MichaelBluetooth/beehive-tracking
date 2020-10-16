import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LogViewerComponent } from './logger/log-viewer/log-viewer.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./hive-core/hive-core.module").then((m) => m.HiveCoreModule),
  },
  {
    path: "log",
    component: LogViewerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

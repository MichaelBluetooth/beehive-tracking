import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HiveComponent } from "./components/hive/hive.component";
import { HiveListComponent } from "./components/hive-list/hive-list.component";
import { HivePageComponent } from "./hive-page.component";
import { BoxComponent } from "./components/box/box.component";
import { FrameComponent } from "./components/frame/frame.component";

const routes: Routes = [
  {
    path: "hives",
    component: HiveListComponent,
  },
  {
    path: "hives/:id",
    component: HivePageComponent,
    children: [
      {
        path: "",
        component: HiveComponent,
      },
      {
        path: "boxes/:boxId",
        component: BoxComponent,
      },
      {
        path: "boxes/:boxId/frames/:frameId",
        component: FrameComponent,
      },
    ],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "hives",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiveRoutingModule {}

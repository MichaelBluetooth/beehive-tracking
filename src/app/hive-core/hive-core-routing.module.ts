import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BoxComponent } from "./components/box/box.component";
import { FrameComponent } from "./components/frame/frame.component";
import { HiveListComponent } from "./components/hive-list/hive-list.component";
import { HivePageComponent } from "./components/hive-page/hive-page.component";
import { HiveComponent } from "./components/hive/hive.component";
import { BodyResolver } from "./resolvers/body.resolver";
import { FrameResolver } from "./resolvers/frame.resolver";
import { HiveListResolver } from "./resolvers/hive-list.resolver";
import { HiveResolver } from "./resolvers/hive.resolver";

export const routes: Routes = [
  {
    path: "hives",
    component: HiveListComponent,
    resolve: {
      hives: HiveListResolver,
    },
  },
  {
    path: "hives/:id",
    component: HivePageComponent,
    children: [
      {
        path: "",
        component: HiveComponent,
        resolve: {
          hive: HiveResolver,
        },
      },
      {
        path: "boxes/:boxId",
        component: BoxComponent,
        resolve: {
          box: BodyResolver,
        },
      },
      {
        path: "boxes/:boxId/frames/:frameId",
        component: FrameComponent,
        resolve: {
          frame: FrameResolver,
        },
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
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class HiveCoreRoutingModule {}

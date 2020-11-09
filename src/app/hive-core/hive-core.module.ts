import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { TranslateModule } from "@ngx-translate/core";

import { AddBoxComponent } from "./components/add-box/add-box.component";
import { AddHiveComponent } from "./components/add-hive/add-hive.component";
import { AddNoteComponent } from "./components/add-note/add-note.component";
import { BoxComponent } from "./components/box/box.component";
import { FrameComponent } from "./components/frame/frame.component";
import { HiveComponent } from "./components/hive/hive.component";
import { HiveListComponent } from "./components/hive-list/hive-list.component";
import { HivePageComponent } from "./components/hive-page/hive-page.component";
import { NoteComponent } from "./components/note/note.component";
import { NoteMenuComponent } from "./components/note-menu/note-menu.component";
import { NotesListComponent } from "./components/notes-list/notes-list.component";
import { OptionsComponent } from "./components/options/options.component";
import { FrameLastInspectedPipe } from "./pipes/frame-last-inspected.pipe";
import { LastInspectedPipe } from "./pipes/last-inspected.pipe";
import { JoinPipe } from "./pipes/join.pipe";
import { HiveCoreRoutingModule } from "./hive-core-routing.module";
import { IonicModule } from "@ionic/angular";
import { LoginComponent } from "./components/login/login.component";
import { AuthInterceptorService } from "./services/auth-interceptor/auth-interceptor.service";

const declarationsAndExports = [
  OptionsComponent,
  AddBoxComponent,
  AddHiveComponent,
  AddNoteComponent,
  BoxComponent,
  FrameComponent,
  HiveComponent,
  HiveListComponent,
  HivePageComponent,
  NoteComponent,
  NoteMenuComponent,
  NotesListComponent,
  FrameLastInspectedPipe,
  LastInspectedPipe,
  JoinPipe,
  LoginComponent,
];

@NgModule({
  declarations: declarationsAndExports,
  exports: declarationsAndExports,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HiveCoreRoutingModule,
    TranslateModule,
  ],
  providers: [],
})
export class HiveCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HiveCoreModule,
    };
  }
}

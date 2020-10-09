import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
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
import { InitService } from "./services/init/init.service";
import { PhotoService } from "./services/photo/photo.service";
import { LocalHiveDataService } from "./services/local-hive-data/local-hive-data.service";
import { appInitialize } from "@ionic/angular/app-initialize";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

export function initializeApp(appInitService: InitService) {
  return (): Promise<any> => {
    return appInitService.init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
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
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    SocialSharing,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [InitService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

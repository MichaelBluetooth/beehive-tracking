import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiveListComponent } from './components/hive-list/hive-list.component';
import { HiveComponent } from './components/hive/hive.component';
import { AddHiveComponent } from './components/add-hive/add-hive.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HiveRoutingModule } from './hive-routing.module';
import { HivePageComponent } from './hive-page.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { AddBoxComponent } from './components/add-box/add-box.component';
import { JoinPipe } from './pipes/join.pipe';
import { BoxComponent } from './components/box/box.component';
import { FrameComponent } from './components/frame/frame.component';
import { NoteComponent } from './components/note/note.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { PlantsListComponent } from './components/plants-list/plants-list.component';
import { LastInspectedPipe } from './pipes/last-inspected.pipe';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FrameLastInspectedPipe } from './pipes/frame-last-inspected.pipe';
import { NoteMenuComponent } from './components/note-menu/note-menu.component';
// import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";

@NgModule({
  declarations: [
    HivePageComponent,
    HiveListComponent,
    HiveComponent,
    AddHiveComponent,
    AddNoteComponent,
    AddBoxComponent,
    JoinPipe,
    BoxComponent,
    FrameComponent,
    NoteComponent,
    NotesListComponent,
    PlantsListComponent,
    LastInspectedPipe,
    FrameLastInspectedPipe,
    NoteMenuComponent,
    // OptionsComponent
  ],
  imports: [
    TranslateModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HiveRoutingModule
  ],
  providers: [
    SocialSharing,
    // SpeechRecognition
  ]
})
export class HiveModule { }

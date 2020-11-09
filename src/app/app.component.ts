import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Platform, ModalController, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";

import { OptionsComponent } from "./hive-core/components/options/options.component";
import { HiveSpeechRecognitionService } from "./speech-controls/services/hive-speech-recognition.service";
import { SpeechListeningService } from "./speech-controls/services/speech-listening.service";
import { SyncService } from "./hive-core/services/sync/sync.service";
import { AuthenticationService } from "./hive-core/services/authentication/authentication.service";
import { LoginComponent } from "./hive-core/components/login/login.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  listening$ = this.speechListening.listening$;
  syncing$ = this.syncService.syncing$;
  authenticated$ = this.auth.authenticated$;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modal: ModalController,
    private translate: TranslateService,
    private storage: Storage,
    private hiveSpeech: HiveSpeechRecognitionService,
    private speechListening: SpeechListeningService,
    private menu: MenuController,
    private router: Router,
    private syncService: SyncService,
    private auth: AuthenticationService
  ) {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get("preferredLanguage").then((lang) => {
      if (lang) {
        this.translate.use(lang);
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async showSettings() {
    this.menu.close();
    const modal = await this.modal.create({
      component: OptionsComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
      }
    });

    return await modal.present();
  }

  startListening() {
    this.menu.close();
    this.hiveSpeech.listen();
  }

  goToLog() {
    this.menu.close();
    this.router.navigate(["/log"]);
  }

  doSync(event) {
    this.syncService.syncAll();
    event.target.complete(); // immediately complete the event because we're doing sync in the background
  }

  logout() {
    this.auth.logout();
    this.menu.close();
  }

  async showLogin() {
    this.menu.close();
    const modal = await this.modal.create({
      component: LoginComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((modalResponse) => {
      if (modalResponse.data) {
      }
    });

    return await modal.present();
  }
}

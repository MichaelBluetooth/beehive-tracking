import { Component } from "@angular/core";

import { Platform, ModalController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { TranslateService } from "@ngx-translate/core";
import { Storage } from "@ionic/storage";
import { OptionsComponent } from './hive-core/components/options/options.component';
import { HiveSpeechRecognitionService } from './speech-controls/services/hive-speech-recognition.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {

  listening$ = this.hiveSpeech.listening$;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modal: ModalController,
    private translate: TranslateService,
    private storage: Storage,
    private hiveSpeech: HiveSpeechRecognitionService
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

  startListening(){
    this.hiveSpeech.listen();
  }
}

import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { LogLevel } from 'src/app/logger/log-level';
import { LoggerService } from 'src/app/logger/logger.service';

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  language: string;
  logLevel: LogLevel = LogLevel.OFF;

  logLevelAll = LogLevel.ALL;
  logLevelDebug = LogLevel.DEBUG;
  logLevelInfo = LogLevel.INFO;
  logLevelWarn = LogLevel.WARN;
  logLevelError = LogLevel.ERROR;
  logLevelFatal = LogLevel.FATAL;
  logLevelOff = LogLevel.OFF;

  constructor(
    private modal: ModalController,
    private translate: TranslateService,
    private logSvc: LoggerService,
    private storage: Storage) {}

  ngOnInit() {
    if (this.translate.currentLang) {
      this.language = this.translate.currentLang;
    } else {
      this.language = this.translate.getBrowserLang();
    }
  }

  setLanguage(): void {
    this.storage.set("preferredLanguage", this.language);
    this.translate.use(this.language);
  }

  setLogLevel(): void {
    this.logSvc.setLogLevel(this.logLevel);
  }

  dismiss(): void {
    this.modal.dismiss();
  }
}

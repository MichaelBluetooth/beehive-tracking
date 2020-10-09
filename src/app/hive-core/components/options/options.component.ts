import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ModalController } from '@ionic/angular';
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  language: string;

  constructor(
    private modal: ModalController,
    private translate: TranslateService,
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

  dismiss(): void {
    this.modal.dismiss();
  }
}

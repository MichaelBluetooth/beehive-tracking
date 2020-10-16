import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogViewerComponent } from "./log-viewer/log-viewer.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from '@angular/forms';
import { LogFilterPipe } from './log-filter.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LogViewerComponent, LogFilterPipe],
  exports: [LogViewerComponent],
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
})
export class LoggerModule {}

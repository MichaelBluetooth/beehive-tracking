import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogViewerComponent } from "./log-viewer/log-viewer.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LogViewerComponent],
  exports: [LogViewerComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoggerModule {}

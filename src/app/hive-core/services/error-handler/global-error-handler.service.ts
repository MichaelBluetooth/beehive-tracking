import { ErrorHandler, Injectable } from "@angular/core";
import { Logger } from "src/app/logger/logger";
import { LoggerService } from "src/app/logger/logger.service";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private logger: Logger;

  constructor(loggerSvc: LoggerService) {
    this.logger = loggerSvc.getLogger("GlobalErrorHandler");
  }

  handleError(error: any): void {
    console.error(error);
    this.logger.error("GlobalErrorHandler", error);
  }
}

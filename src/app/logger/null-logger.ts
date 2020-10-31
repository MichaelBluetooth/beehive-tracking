import { Logger } from './logger';

export class NullLogger extends Logger {
    constructor() {
        super(null, null, null);
    }

    debug(fnName: string, ...data: any[]): void {
    }

    info(fnName: string, ...data: any[]): void {
    }

    warn(fnName: string, ...data: any[]): void {
    }

    error(fnName: string, ...data: any[]): void {
    }

    fatal(fnName: string, ...data: any[]): void {
    }
}

import { LogLevel } from './log-level';

export interface Log {
  level: LogLevel;
  logType: string;
  classPath: string;
  data: string[];
  date: Date;
}

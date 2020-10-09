import { Intent } from './intent';

export abstract class BasicIntent implements Intent {
  constructor(private allowPartial?: boolean) {}
  abstract getPhrases(): string[];
  abstract execute(matches: string[]): void;

  isMatch(matches: string[]) {
    return matches.some((m) =>
      this.getPhrases().some(
        p => m.toLowerCase().indexOf(p.toLowerCase()) > -1
      )
    );
  }
}

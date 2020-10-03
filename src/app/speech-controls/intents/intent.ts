export interface Intent {
  execute(matches: string[]): void;
  isMatch(matches: string[]): boolean;
}

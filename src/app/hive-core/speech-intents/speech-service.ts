export interface ISpeechService {
  isMatch(matches: string[]);
  execute(matches: string[]);
}

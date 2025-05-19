export interface Word {
  original: string;
  scrambled: string;
  hint?: string;
}

export interface GameState {
  currentWordIndex: number;
  words: Word[];
  score: number;
  timeLeft: number;
  gameStatus: 'idle' | 'playing' | 'finished';
  hintsUsed: number;
  wordsSolved: number;
  revealedLetters: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  skippedWords: number;
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: string;
  wordsSolved: number;
  date: string;
}
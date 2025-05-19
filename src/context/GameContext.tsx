import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Word, LeaderboardEntry } from '../types';
import wordList from '../data/wordList';
import { prepareWordList, getHint } from '../utils/wordUtils';

const initialState: GameState = {
  currentWordIndex: 0,
  words: [],
  score: 0,
  timeLeft: 30,
  gameStatus: 'idle',
  hintsUsed: 0,
  wordsSolved: 0,
  revealedLetters: [],
  difficulty: 'medium',
  skippedWords: 0,
};

type GameAction = 
  | { type: 'START_GAME'; difficulty: 'easy' | 'medium' | 'hard' }
  | { type: 'NEXT_WORD' }
  | { type: 'SKIP_WORD' }
  | { type: 'CORRECT_ANSWER' }
  | { type: 'INCORRECT_ANSWER' }
  | { type: 'USE_HINT' }
  | { type: 'TIMER_TICK' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };

const getDifficultySettings = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy':
      return { wordCount: 8, timeLimit: 45 };
    case 'hard':
      return { wordCount: 12, timeLimit: 20 };
    default:
      return { wordCount: 10, timeLimit: 30 };
  }
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const shuffledWords = prepareWordList(wordList);
      const { wordCount, timeLimit } = getDifficultySettings(action.difficulty);
      const gameWords = [...shuffledWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, wordCount);
      
      return {
        ...initialState,
        words: gameWords as Word[],
        gameStatus: 'playing',
        timeLeft: timeLimit,
        difficulty: action.difficulty,
      };
    }
    
    case 'SKIP_WORD': {
      const nextWordIndex = state.currentWordIndex + 1;
      const { timeLimit } = getDifficultySettings(state.difficulty);
      
      if (nextWordIndex >= state.words.length) {
        return {
          ...state,
          skippedWords: state.skippedWords + 1,
          gameStatus: 'finished',
        };
      }
      
      return {
        ...state,
        currentWordIndex: nextWordIndex,
        timeLeft: timeLimit,
        revealedLetters: [],
        skippedWords: state.skippedWords + 1,
      };
    }
    
    case 'NEXT_WORD': {
      const nextWordIndex = state.currentWordIndex + 1;
      const { timeLimit } = getDifficultySettings(state.difficulty);
      
      if (nextWordIndex >= state.words.length) {
        return {
          ...state,
          gameStatus: 'finished',
        };
      }
      
      return {
        ...state,
        currentWordIndex: nextWordIndex,
        timeLeft: timeLimit,
        revealedLetters: [],
      };
    }
    
    case 'CORRECT_ANSWER':
      return {
        ...state,
        score: state.score + 10,
        wordsSolved: state.wordsSolved + 1,
      };
    
    case 'INCORRECT_ANSWER':
      return {
        ...state,
      };
    
    case 'USE_HINT':
      const currentWord = state.words[state.currentWordIndex];
      const hintIndex = getHint(currentWord.original, state.revealedLetters);
      
      if (!hintIndex) {
        return state;
      }
      
      return {
        ...state,
        score: Math.max(0, state.score - 5),
        hintsUsed: state.hintsUsed + 1,
        revealedLetters: [...state.revealedLetters, hintIndex],
      };
    
    case 'TIMER_TICK':
      if (state.timeLeft <= 1) {
        const nextIndex = state.currentWordIndex + 1;
        const { timeLimit } = getDifficultySettings(state.difficulty);
        
        if (nextIndex >= state.words.length) {
          return {
            ...state,
            timeLeft: 0,
            gameStatus: 'finished',
          };
        }
        
        return {
          ...state,
          currentWordIndex: nextIndex,
          timeLeft: timeLimit,
          revealedLetters: [],
        };
      }
      
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    
    case 'END_GAME':
      return {
        ...state,
        gameStatus: 'finished',
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  leaderboard: LeaderboardEntry[];
  addToLeaderboard: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('wordGameLeaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  const addToLeaderboard = (name: string) => {
    const newEntry: LeaderboardEntry = {
      name,
      score: state.score,
      difficulty: state.difficulty,
      wordsSolved: state.wordsSolved,
      date: new Date().toISOString(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('wordGameLeaderboard', JSON.stringify(updatedLeaderboard));
  };

  return (
    <GameContext.Provider value={{ state, dispatch, leaderboard, addToLeaderboard }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};
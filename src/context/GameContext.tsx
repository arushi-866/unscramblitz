import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Word, LeaderboardEntry } from '../types';
import wordList from '../data/wordList';
import { prepareWordList, getHint } from '../utils/wordUtils';

// Generate random leaderboard data
const generateRandomLeaderboard = (): LeaderboardEntry[] => {
  const names = ['Aarav', 'Ananya', 'Ishaan', 'Meera', 'Rohan', 'Saanvi', 'Karan', 'Priya', 'Vivaan', 'Sneha'];

  const difficulties = ['easy', 'medium', 'hard'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    name: names[Math.floor(Math.random() * names.length)],
    score: Math.floor(Math.random() * 500) + 100,
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    wordsSolved: Math.floor(Math.random() * 20) + 5,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  })).sort((a, b) => b.score - a.score);
};

// Initialize leaderboard from localStorage or generate random data
const initializeLeaderboard = (): LeaderboardEntry[] => {
  const savedLeaderboard = localStorage.getItem('wordGameLeaderboard');
  if (savedLeaderboard) {
    try {
      return JSON.parse(savedLeaderboard);
    } catch (e) {
      console.error('Error parsing saved leaderboard:', e);
      return generateRandomLeaderboard();
    }
  }
  return generateRandomLeaderboard();
};

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
  leaderboard: initializeLeaderboard(),
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
  | { type: 'RESET_GAME' }
  | { type: 'SET_LEADERBOARD'; leaderboard: LeaderboardEntry[] };

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
      const { wordCount, timeLimit } = getDifficultySettings(action.difficulty);
      const filteredWords = wordList.filter(word => word.difficulty === action.difficulty);
      const gameWords = [...filteredWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, wordCount);
      
      const preparedWords = prepareWordList(gameWords);
      
      return {
        ...initialState,
        words: preparedWords,
        gameStatus: 'playing',
        timeLeft: timeLimit,
        difficulty: action.difficulty,
        currentWordIndex: 0,
        score: 0,
        hintsUsed: 0,
        wordsSolved: 0,
        revealedLetters: [],
        skippedWords: 0,
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
    
    case 'SET_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.leaderboard,
      };
    
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
  
  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordGameLeaderboard', JSON.stringify(state.leaderboard));
  }, [state.leaderboard]);

  const addToLeaderboard = (name: string) => {
    const newEntry: LeaderboardEntry = {
      name,
      score: state.score,
      difficulty: state.difficulty,
      wordsSolved: state.wordsSolved,
      date: new Date().toISOString(),
    };

    const updatedLeaderboard = [...state.leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    dispatch({ type: 'SET_LEADERBOARD', leaderboard: updatedLeaderboard });
  };

  return (
    <GameContext.Provider value={{ state, dispatch, leaderboard: state.leaderboard, addToLeaderboard }}>
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
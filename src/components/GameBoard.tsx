import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import WordDisplay from './WordDisplay';
import InputArea from './InputArea';
import Timer from './Timer';
import GameSummary from './GameSummary';
import { SkipForward } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { gameStatus, score, difficulty } = state;
  
  // Set up timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        dispatch({ type: 'TIMER_TICK' });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus, dispatch]);
  
  const handleSkipWord = () => {
    dispatch({ type: 'SKIP_WORD' });
  };

  // If game is finished, show summary
  if (gameStatus === 'finished') {
    return <GameSummary />;
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Word Unscramble</h2>
          <div className="text-sm text-gray-500 capitalize">
            {difficulty} mode
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-2xl font-bold text-blue-600">{score}</div>
        </div>
      </div>
      
      <Timer />
      <WordDisplay />
      <InputArea />
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSkipWord}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 
            transition-colors duration-300"
        >
          <SkipForward size={18} className="mr-2" />
          Skip Word
        </button>
        <button
          onClick={() => dispatch({ type: 'END_GAME' })}
          className="flex items-center px-4 py-2 ml-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard
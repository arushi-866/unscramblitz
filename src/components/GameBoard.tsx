import React from 'react';
import { useGame } from '../context/GameContext';
import WordDisplay from './WordDisplay';
import InputArea from './InputArea';
import Timer from './Timer';
import GameSummary from './GameSummary';
import { SkipForward } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { gameStatus, score, difficulty } = state;
  
  const handleSkipWord = () => {
    dispatch({ type: 'SKIP_WORD' });
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      {gameStatus === 'playing' ? (
        <>
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
          </div>
        </>
      ) : (
        <GameSummary />
      )}
    </div>
  );
};

export default GameBoard
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, RotateCw } from 'lucide-react';

const GameSummary: React.FC = () => {
  const { state, dispatch, addToLeaderboard } = useGame();
  const { score, hintsUsed, wordsSolved, words, difficulty, skippedWords } = state;
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME', difficulty });
  };
  
  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setSubmitted(true);
    }
  };

  // Calculate accuracy
  const totalWords = words.length;
  const accuracy = totalWords > 0 ? Math.round((wordsSolved / totalWords) * 100) : 0;
  
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
        <Trophy size={40} className="text-yellow-500" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Over!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Final Score</div>
          <div className="text-3xl font-bold text-blue-700">{score}</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">Words Solved</div>
          <div className="text-3xl font-bold text-purple-700">{wordsSolved}/{totalWords}</div>
        </div>
        
        <div className="bg-pink-50 rounded-lg p-4">
          <div className="text-sm text-pink-600 font-medium">Accuracy</div>
          <div className="text-3xl font-bold text-pink-700">{accuracy}%</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-medium">Hints Used</div>
          <div className="text-3xl font-bold text-orange-700">{hintsUsed}</div>
        </div>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleSubmitScore} className="mb-8">
          <div className="max-w-xs mx-auto">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name for the leaderboard
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
              maxLength={20}
              required
            />
            <button
              type="submit"
              className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Submit Score
            </button>
          </div>
        </form>
      ) : (
        <div className="text-green-600 mb-8">Score submitted to leaderboard!</div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Word List</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {words.map((word, index) => (
            <div 
              key={index}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-800"
            >
              {word.original}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={handlePlayAgain}
        className="flex items-center justify-center mx-auto px-6 py-3 bg-blue-600 text-white 
          rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm"
      >
        <RotateCw size={18} className="mr-2" />
        Play Again
      </button>
    </div>
  );
};

export default GameSummary;
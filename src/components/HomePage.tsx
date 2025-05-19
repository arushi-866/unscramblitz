import React from 'react';
import { useGame } from '../context/GameContext';
import { Play, Shuffle, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types';

const HomePage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  
  const handleStartGame = () => {
    // Reset any existing game state and start new game
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME', difficulty: selectedDifficulty });
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Shuffle size={36} className="text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Word Unscramble</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Test your vocabulary by unscrambling words against the clock!
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">How to Play</h2>
            <ul className="text-left space-y-3 text-blue-700">
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-blue-800 flex-shrink-0 mr-2 text-center">1</span>
                <span>Unscramble the jumbled letters to form the correct word</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-blue-800 flex-shrink-0 mr-2 text-center">2</span>
                <span>Type your answer and click "Check" to verify</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-blue-800 flex-shrink-0 mr-2 text-center">3</span>
                <span>Need help? Use a hint, but it will cost you 5 points</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-blue-800 flex-shrink-0 mr-2 text-center">4</span>
                <span>Each correct answer earns you 10 points</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-blue-200 rounded-full text-blue-800 flex-shrink-0 mr-2 text-center">5</span>
                <span>Skip difficult words, but choose wisely!</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Difficulty</h3>
            <div className="flex gap-4">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-colors duration-200
                    ${selectedDifficulty === difficulty
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleStartGame}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium 
              rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md w-full justify-center"
          >
            <Play size={20} className="mr-2" />
            Start Game
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          </div>
          
          {state.leaderboard && state.leaderboard.length > 0 ? (
            <div className="space-y-4">
              {state.leaderboard.slice(0, 10).map((entry: LeaderboardEntry, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{entry.name}</div>
                    <div className="text-sm text-gray-500">
                      {entry.wordsSolved} words • {entry.difficulty} • {formatDate(entry.date)}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No scores yet. Be the first to play!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage
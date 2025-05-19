import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { checkAnswer } from '../utils/wordUtils';
import { Lightbulb, Check } from 'lucide-react';

const InputArea: React.FC = () => {
  const { state, dispatch } = useGame();
  const { words, currentWordIndex, gameStatus } = state;
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<null | { type: 'correct' | 'incorrect'; message: string }>(null);
  
  // Reset input and feedback when word changes
  useEffect(() => {
    setGuess('');
    setFeedback(null);
  }, [currentWordIndex]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guess.trim() || gameStatus !== 'playing') return;
    
    const currentWord = words[currentWordIndex].original;
    const isCorrect = checkAnswer(guess, currentWord);
    
    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Correct! Great job!' });
      dispatch({ type: 'CORRECT_ANSWER' });
      
      // Move to next word after a short delay
      setTimeout(() => {
        dispatch({ type: 'NEXT_WORD' });
      }, 1500);
    } else {
      setFeedback({ type: 'incorrect', message: 'Try again!' });
      dispatch({ type: 'INCORRECT_ANSWER' });
      
      // Clear feedback after a short delay
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };
  
  const useHint = () => {
    dispatch({ type: 'USE_HINT' });
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition-all
              ${feedback?.type === 'correct' ? 'border-green-500 bg-green-50' : 
              feedback?.type === 'incorrect' ? 'border-red-500 bg-red-50' : 
              'border-blue-300 focus:border-blue-500 focus:ring-blue-200'}`}
            placeholder="Enter your answer..."
            disabled={gameStatus !== 'playing'}
            autoComplete="off"
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={useHint}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
              transition-colors duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={gameStatus !== 'playing'}
          >
            <Lightbulb size={18} className="mr-2" />
            Hint (-5 pts)
          </button>
          
          <button
            type="submit"
            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!guess.trim() || gameStatus !== 'playing'}
          >
            <Check size={18} className="mr-2" />
            Check
          </button>
        </div>
      </form>
      
      {feedback && (
        <div className={`p-3 rounded-lg text-center mb-4 transform transition-all duration-300 
          ${feedback.type === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default InputArea;
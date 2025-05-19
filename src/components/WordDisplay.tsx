import React from 'react';
import { useGame } from '../context/GameContext';

const WordDisplay: React.FC = () => {
  const { state } = useGame();
  const { words, currentWordIndex, revealedLetters } = state;
  
  if (!words.length) return null;
  
  const currentWord = words[currentWordIndex];
  const { scrambled, original } = currentWord;
  
  // Create an array of objects with letter and reveal status
  const letters = scrambled.split('').map((letter, index) => {
    // Find the original letter position
    const originalIndex = original.split('').findIndex((char, i) => {
      const matchesLetter = char === letter;
      const notAlreadyUsed = !scrambled.split('')
        .slice(0, index)
        .some((l, j) => original[i] === l && scrambled[j] === l);
      return matchesLetter && notAlreadyUsed;
    });
    
    // Check if this letter should be revealed based on hint
    const isRevealed = revealedLetters.includes(originalIndex.toString());
    
    return {
      letter,
      originalIndex,
      isRevealed,
    };
  });
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Unscramble this word:
      </h2>
      <div className="flex justify-center items-center space-x-3 text-3xl font-bold">
        {letters.map((item, index) => (
          <div
            key={index}
            className={`w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 flex items-center justify-center 
              border-2 ${item.isRevealed ? 'border-purple-500 bg-purple-100' : 'border-gray-300'} 
              rounded-lg shadow-sm transition-all duration-300`}
          >
            {item.letter.toUpperCase()}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-500">
        <span className="font-medium">Word {currentWordIndex + 1}</span> of {words.length}
      </div>
    </div>
  );
};

export default WordDisplay;
/**
 * Shuffles the letters of a word to create a scrambled version
 */
export const scrambleWord = (word: string): string => {
  // Convert word to array, shuffle, and join back to string
  const letters = word.split('');
  
  // Fisher-Yates shuffle algorithm
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  
  // Check if the scrambled word is the same as the original
  const scrambled = letters.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
};

/**
 * Prepares a list of words with their scrambled versions
 */
export const prepareWordList = (words: string[]): { original: string; scrambled: string }[] => {
  return words.map(word => ({
    original: word,
    scrambled: scrambleWord(word)
  }));
};

/**
 * Checks if the guess is correct for the given word
 */
export const checkAnswer = (guess: string, original: string): boolean => {
  return guess.toLowerCase().trim() === original.toLowerCase();
};

/**
 * Gets a hint for the current word (reveals a letter)
 */
export const getHint = (original: string, revealedLetters: string[]): string => {
  // Find indices of letters that haven't been revealed yet
  const unrevealedIndices = [];
  
  for (let i = 0; i < original.length; i++) {
    if (!revealedLetters.includes(i.toString())) {
      unrevealedIndices.push(i);
    }
  }
  
  // If all letters have been revealed, return null
  if (unrevealedIndices.length === 0) {
    return '';
  }
  
  // Randomly select an unrevealed letter index
  const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
  
  return randomIndex.toString();
};
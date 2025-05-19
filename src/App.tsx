import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import HomePage from './components/HomePage';
import GameBoard from './components/GameBoard';

// Main App component wrapped with GameProvider
function AppContent() {
  const { state } = useGame();
  const { gameStatus } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {gameStatus === 'idle' ? <HomePage /> : <GameBoard />}
      </div>
    </div>
  );
}

// Wrapper component with provider
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
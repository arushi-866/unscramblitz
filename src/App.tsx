import React, { useState } from 'react';
import HomePage from './components/HomePage';
import WelcomePage from './components/WelcomePage';
import GameBoard from './components/GameBoard';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/GameContext';

const AppContent: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { state } = useGame();
  const { gameStatus } = state;

  const handleWelcomeComplete = (username: string) => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomePage onComplete={handleWelcomeComplete} />;
  }

  // Show GameBoard for both playing and finished states
  if (gameStatus === 'playing' || gameStatus === 'finished') {
    return <GameBoard />;
  }

  return <HomePage />;
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <AppContent />
      </div>
    </GameProvider>
  );
};

export default App;
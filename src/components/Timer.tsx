import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const Timer: React.FC = () => {
  const { state, dispatch } = useGame();
  const { timeLeft, gameStatus } = state;
  
  // Calculate the percentage of time left
  const timePercentage = (timeLeft / 30) * 100;
  
  // Determine the color of the timer based on time left
  const getTimerColor = () => {
    if (timePercentage > 50) return 'bg-green-500';
    if (timePercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (gameStatus === 'playing') {
      timer = setInterval(() => {
        dispatch({ type: 'TIMER_TICK' });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [dispatch, gameStatus]);
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Time left</span>
        <span className="text-sm font-medium">{timeLeft} seconds</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`${getTimerColor()} h-2.5 rounded-full transition-all duration-1000 ease-linear`} 
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
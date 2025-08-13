import { useState, useEffect } from 'react';

export const useTimer = (initialTime = 25 * 60) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusTime, setFocusTime] = useState(initialTime);
  const [currentSession, setCurrentSession] = useState(initialTime);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && currentSession > 0) {
      timer = setInterval(() => {
        setCurrentSession(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, currentSession]);
  
  useEffect(() => {
    setCurrentSession(focusTime);
  }, [focusTime]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentSession(focusTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isTimerRunning,
    currentSession,
    focusTime,
    toggleTimer,
    resetTimer,
    formatTime,
    setFocusTime,
    setIsTimerRunning,
    setCurrentSession
  };
};

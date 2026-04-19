// This custom hook manages a simple timer with start, stop, and reset functionality

import { useState, useEffect, useRef } from 'react';

export function useTimer() {
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Ref to store interval ID
  const intervalRef = useRef(null);

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);

      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop the timer
  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeElapsed(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    timeElapsed,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
}
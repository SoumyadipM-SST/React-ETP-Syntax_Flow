// This custom hook manages typing logic, including input handling, WPM, accuracy, and timer control

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTimer } from './useTimer';

export function useTyping(targetText, onSubmit) {
  // Typing state
  const [typed, setTyped] = useState('');
  const [cursorIndex, setCursorIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  // Internal ref to avoid stale state issues
  const stateRef = useRef({ typed: '', cursorIndex: 0, mistakes: 0 });

  // Timer hook
  const { timeElapsed, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  // Calculate WPM and Accuracy in real-time
  useEffect(() => {
    if (timeElapsed > 0 && typed.length > 0) {
      const minutes = timeElapsed / 60;
      const wordsTyped = typed.length / 5;

      const currentWpm = Math.round(wordsTyped / minutes);

      const correctChars = typed
        .split('')
        .filter((char, i) => char === targetText[i]).length;

      const currentAcc = Math.round((correctChars / targetText.length) * 100);

      setWpm(currentWpm);
      setAccuracy(currentAcc);
    }
  }, [timeElapsed, typed, targetText]);

  // Handle key input
  const handleKeyDown = useCallback((e) => {
    if (isFinished) return;

    // Start timer on first valid key
    if (!isRunning && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Tab')) {
      startTimer();
    }

    // Manual submit (ALT + Enter)
    if (e.altKey && e.key === 'Enter') {
      e.preventDefault();
      stopTimer();
      setIsFinished(true);

      if (onSubmit) onSubmit({ wpm, accuracy, timeElapsed });
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      stateRef.current.typed = stateRef.current.typed.slice(0, -1);
      stateRef.current.cursorIndex = Math.max(0, stateRef.current.cursorIndex - 1);

      setTyped(stateRef.current.typed);
      setCursorIndex(stateRef.current.cursorIndex);
      return;
    }

    // Determine characters to insert
    let charsToAdd = [];

    if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      charsToAdd = [' ', ' ', ' ', ' ']; // Insert spaces for tab
    } else if (e.key === 'Enter' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      charsToAdd = ['\n'];
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      charsToAdd = [e.key];
    }

    if (charsToAdd.length > 0) {
      let newTyped = stateRef.current.typed;
      let newCursor = stateRef.current.cursorIndex;
      let newMistakes = stateRef.current.mistakes;

      // Process each character
      for (const char of charsToAdd) {
        if (newCursor < targetText.length) {
          newTyped += char;

          if (char !== targetText[newCursor]) {
            newMistakes += 1;
          }

          newCursor += 1;
        }
      }

      // Update ref state
      stateRef.current.typed = newTyped;
      stateRef.current.cursorIndex = newCursor;
      stateRef.current.mistakes = newMistakes;

      // Update React state
      setTyped(newTyped);
      setCursorIndex(newCursor);
      setMistakes(newMistakes);

      // Auto-submit when finished
      if (newCursor === targetText.length) {
        stopTimer();
        setIsFinished(true);

        if (onSubmit) {
          const finalTime = timeElapsed || 1;

          const finalWpm = Math.round(
            (newTyped.length / 5) / (finalTime / 60)
          );

          const correctCount = newTyped
            .split('')
            .filter((char, i) => char === targetText[i]).length;

          const finalAcc = Math.round(
            (correctCount / targetText.length) * 100
          );

          onSubmit({
            wpm: finalWpm,
            accuracy: finalAcc,
            timeElapsed: finalTime
          });
        }
      }
    }
  }, [
    isFinished,
    isRunning,
    targetText,
    timeElapsed,
    wpm,
    accuracy,
    startTimer,
    stopTimer,
    onSubmit
  ]);

  // Reset typing state
  const resetTyping = () => {
    stateRef.current = { typed: '', cursorIndex: 0, mistakes: 0 };

    setTyped('');
    setCursorIndex(0);
    setMistakes(0);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);

    resetTimer();
  };

  return {
    typed,
    cursorIndex,
    mistakes,
    wpm,
    accuracy,
    timeElapsed,
    isFinished,
    handleKeyDown,
    resetTyping,
    stopTimer
  };
}
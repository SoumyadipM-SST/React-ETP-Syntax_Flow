// This page handles the typing test flow, snippet loading, and result saving

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TypingBox from '../components/TypingBox';
import Result from '../components/Result';
import { useTyping } from '../hooks/useTyping';
import { useStats } from '../context/StatsContext';

// Local snippet data
import cppData from '../data/cpp.json';
import jsData from '../data/javascript.json';
import pyData from '../data/python.json';
import javaData from '../data/java.json';
import englishData from '../data/english.json';

// Language → data mapping
const dataMap = {
  cpp: cppData,
  javascript: jsData,
  python: pyData,
  java: javaData,
  english: englishData
};

export default function Test() {
  // Core test settings
  const [selectedLang, setSelectedLang] = useState('english');
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState('test');

  // Test state
  const [targetText, setTargetText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { saveTestResult } = useStats();

  // Load a random snippet based on language + difficulty
  const loadSnippet = useCallback(() => {
    const languageData = dataMap[selectedLang];

    if (!languageData) {
      setTargetText("Error: Language data not found.");
      return;
    }

    const pool = languageData.filter(d => d.difficulty === difficulty);

    if (pool.length > 0) {
      const randomSnippet = pool[Math.floor(Math.random() * pool.length)];

      // Safe fallback to avoid crashes
      setTargetText(
        randomSnippet.code ||
        randomSnippet.text ||
        "No text available."
      );
    } else {
      setTargetText(`No ${difficulty} snippets found for ${selectedLang}.`);
    }

    setIsSaved(false);
  }, [selectedLang, difficulty]);

  // Reload snippet when settings change
  useEffect(() => {
    loadSnippet();
  }, [loadSnippet]);

  // Handle test completion
  const handleTestComplete = useCallback(async (finalStats) => {
    if (mode === 'practice') {
      setIsSaved(true);
      return;
    }

    try {
      await saveTestResult({
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        time: finalStats.timeElapsed,
        language: selectedLang,
        difficulty,
        mode
      });

      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  }, [saveTestResult, selectedLang, difficulty, mode]);

  // Typing hook
  const {
    typed,
    cursorIndex,
    wpm,
    accuracy,
    timeElapsed,
    isFinished,
    handleKeyDown,
    resetTyping
  } = useTyping(targetText, handleTestComplete);

  // Next snippet
  const handleNext = () => {
    resetTyping();
    loadSnippet();
  };

  // Retry same snippet
  const handleRetry = () => {
    resetTyping();
    setIsSaved(false);
  };

  // Handle sidebar navigation safely
  const interceptNav = (setter, newValue, currentValue) => {
    if (newValue === currentValue) return;

    // Save partial progress if user leaves mid-test
    if (typed.length > 0 && !isFinished && timeElapsed > 0 && mode === 'test') {
      saveTestResult({
        wpm,
        accuracy,
        time: timeElapsed,
        language: selectedLang,
        difficulty,
        mode
      }).catch(console.error);
    }

    resetTyping();
    setter(newValue);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      
      {/* Sidebar controls */}
      <Sidebar
        selectedLang={selectedLang}
        setSelectedLang={(val) => interceptNav(setSelectedLang, val, selectedLang)}
        difficulty={difficulty}
        setDifficulty={(val) => interceptNav(setDifficulty, val, difficulty)}
        mode={mode}
        setMode={(val) => interceptNav(setMode, val, mode)}
      />

      {/* Main test area */}
      <div className="flex-1 p-6 md:p-12 flex flex-col items-center bg-[#0f172a] overflow-y-auto">
        
        {!isFinished ? (
          <div className="w-full max-w-4xl animate-in fade-in duration-500">

            {/* Live stats */}
            <div className="flex justify-between items-end mb-8 px-2">
              <div className="flex gap-8 md:gap-12">
                
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">WPM</span>
                  <span className="text-3xl md:text-4xl font-mono text-cyan-400">{wpm}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Accuracy</span>
                  <span className="text-3xl md:text-4xl font-mono text-orange-400">{accuracy}%</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Timer</span>
                <span className="text-3xl md:text-4xl font-mono text-white">{timeElapsed}s</span>
              </div>
            </div>

            {/* Typing area */}
            <TypingBox
              targetText={targetText}
              typed={typed}
              cursorIndex={cursorIndex}
              handleKeyDown={handleKeyDown}
              isFinished={isFinished}
            />

            {/* Instructions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start text-slate-500 text-sm">
              <p className="flex items-center gap-2">
                <kbd className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">ALT</kbd> +
                <kbd className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">ENTER</kbd>
                to restart
              </p>

              <p className="hidden md:block">•</p>

              <p>Start typing to begin the test</p>
            </div>

            {/* Mode info */}
            <div className="mt-6 flex justify-center md:justify-start text-sm">
              {mode === 'practice'
                ? (
                  <p className="text-cyan-500/80 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20 font-medium">
                    Practice mode data is not saved
                  </p>
                )
                : (
                  <p className="text-orange-500/80 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20 font-medium">
                    Test mode data is being saved
                  </p>
                )
              }
            </div>
          </div>
        ) : (
          // Result screen
          <Result
            wpm={wpm}
            accuracy={accuracy}
            time={timeElapsed}
            mode={mode}
            onRetry={handleRetry}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
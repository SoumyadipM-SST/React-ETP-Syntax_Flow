// This component renders the typing area and handles visual feedback for user input

import { useEffect, useRef } from 'react';

export default function TypingBox({
  targetText,
  typed,
  cursorIndex,
  handleKeyDown,
  isFinished
}) {
  // Ref to keep focus on typing box
  const boxRef = useRef(null);

  // Auto-focus when component mounts or new text loads
  useEffect(() => {
    if (boxRef.current && !isFinished) {
      boxRef.current.focus();
    }
  }, [isFinished, targetText]);

  // Render text with coloring and cursor logic
  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let colorClass = "text-slate-500"; // Default (not typed)

      // Compare typed characters
      if (index < typed.length) {
        if (typed[index] === char) {
          colorClass = "text-cyan-400"; // Correct
        } else {
          colorClass = "text-red-500 bg-red-500/20 rounded-sm"; // Incorrect
        }
      }

      const isCursor = index === cursorIndex;

      // Handle newline display
      const displayChar = char === '\n' ? '↵\n' : char;

      return (
        <span
          key={index}
          className={`relative ${colorClass} ${
            isCursor && !isFinished
              ? 'border-l-2 border-cyan-400 animate-pulse'
              : ''
          }`}
        >
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-[#1e293b]/50 border border-slate-700 rounded-lg p-6 font-mono text-xl leading-loose outline-none focus:border-cyan-500/50 transition-colors shadow-xl"
      tabIndex={0}             // Make div focusable
      onKeyDown={handleKeyDown} // Capture typing input
      ref={boxRef}
    >
      <div className="whitespace-pre-wrap select-none break-words">
        {renderText()}

        {/* Cursor at end when fully typed */}
        {cursorIndex === targetText.length && !isFinished && (
          <span className="border-l-2 border-cyan-400 animate-pulse">&nbsp;</span>
        )}
      </div>
    </div>
  );
}
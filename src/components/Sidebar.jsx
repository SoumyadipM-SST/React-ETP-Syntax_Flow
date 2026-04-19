// This component is a sidebar used to select mode, language, and difficulty for the test

import Button from './Button';

export default function Sidebar({
  selectedLang,
  setSelectedLang,
  difficulty,
  setDifficulty,
  mode,
  setMode
}) {
  // Available options
  const languages = ['english', 'javascript', 'python', 'cpp', 'java'];
  const difficulties = ['easy', 'medium', 'hard'];
  const modes = ['practice', 'test'];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0f172a] p-6 flex flex-col gap-8 h-[calc(100vh-4rem)] overflow-y-auto">
      
      {/* Mode Selection */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
          Mode
        </h3>

        <div className="flex flex-col gap-2">
          {modes.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)} // Change mode
              className={`text-left px-3 py-2 rounded-md transition-all capitalize ${
                mode === m
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
          Language
        </h3>

        <div className="flex flex-col gap-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)} // Change language
              className={`text-left px-3 py-2 rounded-md transition-all capitalize ${
                selectedLang === lang
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {lang === 'cpp' ? 'C++' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
          Difficulty
        </h3>

        <div className="flex flex-col gap-2">
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)} // Change difficulty
              className={`text-left px-3 py-2 rounded-md transition-all capitalize ${
                difficulty === diff
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
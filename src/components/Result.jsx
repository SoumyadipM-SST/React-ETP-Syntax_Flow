// This component displays the final result screen after completing a test or practice session

import Button from './Button';
import { RefreshCcw, ArrowRight, Trophy, Zap, Target, Clock, Star } from 'lucide-react';

export default function Result({ wpm, accuracy, time, mode, onRetry, onNext }) {
  // Check if user achieved perfect accuracy
  const isPerfect = accuracy === 100;

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-2xl min-w-[500px] animate-in zoom-in-95 duration-300">
      
      {/* Trophy / Performance Header */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>

        {isPerfect ? (
          // Perfect score UI
          <div className="bg-yellow-500/20 p-5 rounded-full border border-yellow-500/30 relative">
            <Trophy size={48} className="text-yellow-400" />
            <Star size={16} className="text-yellow-400 absolute top-2 right-2 animate-pulse" />
          </div>
        ) : (
          // Normal score UI
          <div className="bg-cyan-500/20 p-5 rounded-full border border-cyan-500/30 relative">
            <Zap size={48} className="text-cyan-400" />
          </div>
        )}
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-4xl font-black mb-2 text-white tracking-tight">
        {mode === 'practice' ? 'Practice Completed!' : 'Test Completed!'}
      </h2>

      <p className="text-slate-400 mb-10 text-sm font-medium">
        {mode === 'practice'
          ? 'Great warmup session! (Practice run data isolated safely)'
          : 'Your coding speed analysis has been successfully recorded.'}
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-12 w-full">
        
        {/* WPM Block */}
        <div className="flex flex-col items-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="bg-cyan-500/10 p-2 rounded-lg mb-3">
            <Zap size={20} className="text-cyan-400" />
          </div>
          <p className="text-5xl font-black text-cyan-400 mb-1">{wpm}</p>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">WPM</p>
        </div>

        {/* Accuracy Block */}
        <div className="flex flex-col items-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="bg-orange-500/10 p-2 rounded-lg mb-3">
            <Target size={20} className="text-orange-400" />
          </div>
          <p className="text-5xl font-black text-orange-400 mb-1">{accuracy}%</p>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accuracy</p>
        </div>

        {/* Time Block */}
        <div className="flex flex-col items-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="bg-purple-500/10 p-2 rounded-lg mb-3">
            <Clock size={20} className="text-purple-400" />
          </div>
          <p className="text-5xl font-black text-purple-400 mb-1">{time}s</p>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Time</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full px-4">
        
        {/* Retry Button */}
        <Button
          onClick={onRetry}
          variant="secondary"
          className="flex-1 flex justify-center items-center gap-2 py-4 text-base bg-slate-950 hover:bg-slate-800 border-slate-700"
        >
          <RefreshCcw size={18} /> Retry Snippet
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="flex-1 flex justify-center items-center gap-2 py-4 text-base shadow-lg shadow-cyan-500/20"
        >
          Next Snippet <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
// This page handles user authentication (login, signup, and Google sign-in)

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from "../components/Button";
import { LogIn, UserPlus, Globe, Terminal } from 'lucide-react';

export default function Auth() {
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auth functions
  const { login, signup, loginWithGoogle } = useAuth();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) await login(email, password);
      else await signup(email, password);
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden font-mono">
      
      {/* Background effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 glow-icon">
              <Terminal size={40} className="text-cyan-400" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-2">
            SYNTAX <span className="text-cyan-400 glow-cyan">FLOW</span>
          </h1>

          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {isLogin ? 'Welcome back, Developer' : 'Start your coding journey'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="dev@syntaxflow.com"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-4 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20"
          >
            {isLogin
              ? <><LogIn size={18} />Sign In</>
              : <><UserPlus size={18} />Register Account</>}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800/50"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-[#0f172a] px-3 text-slate-600">
              Authentication Gateways
            </span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          onClick={loginWithGoogle}
          variant="secondary"
          className="w-full bg-slate-900/50 border border-slate-800 flex justify-center items-center gap-3 py-4 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
        >
          <Globe size={18} className="text-slate-400" />
          Continue with Google
        </Button>

        {/* Toggle Login / Signup */}
        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          {isLogin ? "New to the platform?" : "Already registered?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-500/30 underline-offset-4 transition-all"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
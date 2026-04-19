// This component is the top navigation bar shown after login with links and user info

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

export default function TopNav() {
  // Get user data and current route
  const { user, dbUser } = useAuth();
  const location = useLocation();

  // Hide navbar if user is not logged in
  if (!user) return null;

  // Helper to highlight active route
  const isActive = (path) =>
    location.pathname === path
      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
      : "text-slate-400 hover:text-white transition-colors pb-1";

  return (
    <nav className="w-full border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Terminal className="text-cyan-400" size={28} />
          <span className="text-xl font-bold tracking-tight">Syntax Flow</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 font-medium">
          <Link to="/" className={isActive('/')}>Analytics</Link>
          <Link to="/test" className={isActive('/test')}>Typing Test</Link>
          <Link to="/profile" className={isActive('/profile')}>Settings</Link>
        </div>

        {/* User Info */}
        <Link
          to="/profile"
          className="text-sm text-slate-300 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          Hello,
          <span className="text-cyan-400 font-bold">
            {dbUser?.displayName ||
              user?.displayName ||
              (user?.email ? user.email.split('@')[0] : 'Guest')}
          </span>
        </Link>
      </div>
    </nav>
  );
}
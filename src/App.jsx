// This file sets up routing and controls access based on authentication

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Test from './pages/Test';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

function App() {
  // Get auth state
  const { user, loading } = useAuth();

  // Show blank screen while auth is loading
  if (loading) {
    return <div className="h-screen bg-[#0f172a]" />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
      
      {/* Top navigation */}
      <TopNav />

      {/* Main content area */}
      <main className="flex-grow flex flex-col animate-in fade-in duration-300">
        <Routes>
          
          {/* Protected routes */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/test" element={user ? <Test /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />

          {/* Public route */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        
        </Routes>
      </main>
    </div>
  );
}

export default App;
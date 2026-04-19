// This page displays user analytics including stats summary, filters, charts, and recent activity

import { useState } from 'react';
import { useStats } from '../context/StatsContext';
import { useAuth } from '../context/AuthContext';
import StatsChart from '../components/StatsChart';
import { Activity, Target, Zap, Clock } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Home() {
  // Get stats and user data
  const { history, loadingStats } = useStats();
  const { user, dbUser } = useAuth();

  // Filters
  const [filterLang, setFilterLang] = useState('overall');
  const [filterDiff, setFilterDiff] = useState('overall');

  // Filter history based on selected options
  const filteredHistory = history.filter(item => {
    if (filterLang !== 'overall' && item.language !== filterLang) return false;
    if (filterDiff !== 'overall' && item.difficulty !== filterDiff) return false;
    return true;
  });

  // Calculate averages
  const calculateAvg = (key) => {
    if (filteredHistory.length === 0) return 0;

    const sum = filteredHistory.reduce(
      (acc, curr) => acc + (curr[key] || 0),
      0
    );

    return Math.round(sum / filteredHistory.length);
  };

  // Stats summary data
  const stats = [
    { label: 'Average WPM', value: calculateAvg('wpm'), icon: Zap, color: 'text-cyan-400' },
    { label: 'Average Accuracy', value: `${calculateAvg('accuracy')}%`, icon: Target, color: 'text-orange-400' },
    { label: 'Tests Taken', value: filteredHistory.length, icon: Activity, color: 'text-green-400' },
    { label: 'Total Practice', value: `${calculateAvg('time') * filteredHistory.length}s`, icon: Clock, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Welcome back,
            <span className="text-cyan-400">
              {dbUser?.displayName ||
                user?.displayName ||
                (user?.email ? user.email.split('@')[0] : 'Guest')}
            </span>
          </h1>

          <div className="flex items-center gap-2 text-slate-500 tracking-wide">
            <p>Here is your performance breakdown.</p>

            {/* Sync status */}
            {loadingStats && (
              <span className="text-cyan-500 text-xs bg-cyan-500/10 px-2 py-0.5 rounded-full animate-pulse border border-cyan-500/20">
                Syncing Cloud...
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <CustomSelect
            className="w-48 z-20"
            value={filterLang}
            onChange={setFilterLang}
            options={[
              { value: 'overall', label: 'All Languages' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'python', label: 'Python' },
              { value: 'cpp', label: 'C++' },
              { value: 'java', label: 'Java' },
              { value: 'english', label: 'English' }
            ]}
          />

          <CustomSelect
            className="w-48 z-10"
            value={filterDiff}
            onChange={setFilterDiff}
            options={[
              { value: 'overall', label: 'All Difficulties' },
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
          />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-slate-950 ${s.color}`}>
                <s.icon size={24} />
              </div>

              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">
                  {s.label}
                </p>
                <p className="text-2xl font-black">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-slate-300">
            WPM Progress
          </h3>

          <div className="flex-1 w-full min-h-[300px]">
            {filteredHistory.length > 1 ? (
              <StatsChart history={filteredHistory} />
            ) : (
              <p className="text-slate-500 h-full flex items-center justify-center text-center">
                Complete more tests to see trends.
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl overflow-hidden">
          <h3 className="text-xl font-bold mb-6 text-slate-300">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {filteredHistory.slice(0, 5).map((test, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800/50"
              >
                <div>
                  <p className="text-sm font-bold uppercase text-cyan-500">
                    {test.language}
                    <span className="text-slate-600 text-[10px] ml-1">
                      {test.difficulty}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500">
                    {new Date(test.timestamp).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black">
                    {test.wpm}
                    <span className="text-[10px] text-slate-600"> WPM</span>
                  </p>
                  <p className="text-xs text-orange-500">
                    {test.accuracy}% Acc
                  </p>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredHistory.length === 0 && (
              <p className="text-slate-500 text-center py-10">
                {loadingStats ? 'Syncing...' : 'No history yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
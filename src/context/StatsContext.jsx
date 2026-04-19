// This context manages test statistics, including local cache and Firestore sync

import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

// Create context
const StatsContext = createContext();

export function StatsProvider({ children }) {
  // State for stats history and loading
  const [history, setHistory] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const { user } = useAuth();

  // Fetch stats from local storage + Firestore
  const fetchStats = async () => {
    // Load from local cache first (instant UI)
    const localStats = JSON.parse(localStorage.getItem('localStats') || '[]');
    setHistory(localStats);

    if (!user) {
      setLoadingStats(false);
      return;
    }

    setLoadingStats(true);

    // Timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3000)
    );

    try {
      const q = query(
        collection(db, "tests"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(20)
      );

      const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!querySnapshot.empty) {
        const statsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),

          // Normalize timestamp
          timestamp:
            doc.data().timestamp?.toDate().toISOString() ||
            new Date().toISOString()
        }));

        setHistory(statsData);

        // Update local cache
        localStorage.setItem('localStats', JSON.stringify(statsData));
      }
    } catch (error) {
      // Fallback to local cache
      console.error(
        "Stats fetch failed/timed out, relying on local storage cache:",
        error
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // Save new test result (local + Firestore)
  const saveTestResult = async (resultData) => {
    const newStat = {
      ...resultData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    // Save to local storage (fast update)
    const localStats = JSON.parse(localStorage.getItem('localStats') || '[]');
    localStats.unshift(newStat);

    const updatedStats = localStats.slice(0, 50); // Limit cache size
    localStorage.setItem('localStats', JSON.stringify(updatedStats));
    setHistory(updatedStats);

    if (!user) return;

    try {
      await addDoc(collection(db, "tests"), {
        uid: user.uid,
        wpm: resultData.wpm,
        accuracy: resultData.accuracy,
        time: resultData.time,
        language: resultData.language,
        difficulty: resultData.difficulty,
        mode: resultData.mode,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  // Clear stats from local and Firestore
  const clearHistory = async () => {
    // Clear local cache
    localStorage.removeItem('localStats');
    setHistory([]);

    if (!user) return;

    try {
      const q = query(collection(db, "tests"), where("uid", "==", user.uid));
      const snap = await getDocs(q);

      const { writeBatch } = await import('firebase/firestore');

      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
    } catch (error) {
      console.error("Failed to clear cloud history:", error);
    }
  };

  // Fetch stats when user changes
  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <StatsContext.Provider
      value={{
        history,
        loadingStats,
        saveTestResult,
        refreshStats: fetchStats,
        clearHistory
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

// Hook to use stats context
export const useStats = () => useContext(StatsContext);
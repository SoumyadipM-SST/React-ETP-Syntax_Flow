// This page allows users to manage profile info, update password, clear stats, and delete account

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { db, auth } from '../services/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import Button from "../components/Button";
import { User, ShieldAlert, LogOut, Trash2 } from 'lucide-react';

export default function Profile() {
  // Auth and stats context
  const { user, dbUser, setDbUser, logout } = useAuth();
  const { clearHistory } = useStats();

  // Resolve initial display name
  const getInitialName = () => {
    if (dbUser?.displayName && dbUser.displayName.trim() !== '') return dbUser.displayName;
    if (user?.displayName && user.displayName.trim() !== '') return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return '';
  };

  // Profile state
  const [newName, setNewName] = useState(getInitialName());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Password state
  const hasPasswordAuth = user.providerData.some(p => p.providerId === 'password');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Handle password update
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return setPassMsg({ type: 'error', text: 'New passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    }

    setPassLoading(true);
    setPassMsg({ type: '', text: '' });

    try {
      // Re-authenticate if needed
      if (hasPasswordAuth) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      await updatePassword(auth.currentUser, newPassword);

      setPassMsg({ type: 'success', text: 'Password updated successfully!' });

      // Reset fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error(e);

      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setPassMsg({ type: 'error', text: 'Incorrect old password.' });
      } else if (e.code === 'auth/requires-recent-login') {
        setPassMsg({
          type: 'error',
          text: 'Session expired. Please log out and log back in to verify identity.'
        });
      } else {
        setPassMsg({ type: 'error', text: 'Failed to update password.' });
      }
    }

    setPassLoading(false);
  };

  // Handle name update
  const handleUpdateName = async () => {
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, { displayName: newName }, { merge: true });
      await updateProfile(auth.currentUser, { displayName: newName });

      setDbUser({ ...dbUser, displayName: newName });

      setMsg({ type: 'success', text: 'Name updated successfully!' });
    } catch (e) {
      setMsg({ type: 'error', text: 'Failed to update.' });
    }

    setLoading(false);
  };

  // Clear all stats
  const handleResetStats = async () => {
    if (!window.confirm("Are you sure? This will delete all your typing history.")) return;

    setLoading(true);
    await clearHistory();

    setMsg({ type: 'success', text: 'Typing history successfully cleared!' });
    setLoading(false);
  };

  // Delete account and all associated data
  const handleDeleteAccount = async () => {
    if (!window.confirm("CRITICAL: This will permanently delete your account and all data. Proceed?")) return;

    try {
      // Delete all test history
      const q = query(collection(db, "tests"), where("uid", "==", user.uid));
      const snap = await getDocs(q);

      const { writeBatch } = await import('firebase/firestore');

      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }

      // Clear local history
      await clearHistory();

      // Delete profile document
      await deleteDoc(doc(db, "users", user.uid));

      // Delete auth user
      await deleteUser(auth.currentUser);

      // Final feedback
      window.alert("Your account and all associated data have been completely deleted.");
      logout();
    } catch (e) {
      console.error(e);

      if (e.code === 'auth/requires-recent-login') {
        window.alert("Firebase Security: Session expired. Please log in again and retry deletion.");
        logout();
      } else {
        window.alert("An error occurred during deletion: " + e.message);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-8 space-y-8">
      
      {/* Profile Section */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-cyan-500/20 p-4 rounded-full text-cyan-400">
            <User size={40} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {getInitialName() || 'User Profile'}
            </h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* Personal Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-4">
              Personal Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Display Name
              </label>

              <div className="flex gap-4">
                <input
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:border-cyan-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />

                <Button onClick={handleUpdateName} disabled={loading}>
                  Update
                </Button>
              </div>
            </div>

            {msg.text && (
              <p className={`mt-2 text-sm ${msg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {msg.text}
              </p>
            )}
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-4">
              Security
            </h3>

            <div className="space-y-4">
              
              {/* Old password (if applicable) */}
              {hasPasswordAuth && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Old Password
                  </label>

                  <input
                    type="password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:border-cyan-500 outline-none"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              )}

              {/* New password inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    {hasPasswordAuth ? 'New Password' : 'Create Password'}
                  </label>

                  <input
                    type="password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:border-cyan-500 outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Confirm {hasPasswordAuth ? 'New ' : ''}Password
                  </label>

                  <input
                    type="password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 focus:border-cyan-500 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Update password button */}
              <div className="flex justify-end pt-2">
                <Button onClick={handleUpdatePassword} disabled={passLoading}>
                  {hasPasswordAuth ? 'Update Password' : 'Add Password'}
                </Button>
              </div>

              {passMsg.text && (
                <p className={`text-sm ${passMsg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {passMsg.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl">
        <div className="flex items-center gap-2 text-red-500 mb-6 font-bold uppercase tracking-widest text-xs">
          <ShieldAlert size={16} /> Danger Zone
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Clear history */}
          <Button
            onClick={handleResetStats}
            variant="secondary"
            className="border-red-500/20 hover:bg-red-500/10 text-red-500"
          >
            Clear History
          </Button>

          {/* Delete account */}
          <Button
            onClick={handleDeleteAccount}
            variant="danger"
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete Account
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={logout}
          variant="ghost-danger"
          className="flex items-center gap-2"
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </div>
  );
}
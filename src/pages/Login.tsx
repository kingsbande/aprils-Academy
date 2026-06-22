import React, { useState } from 'react';
import { supabase, getUserRole } from '../lib/supabaseClient';

interface LoginProps {
  onLoginSuccess: (role: 'admin' | 'teacher' | 'parent') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const role = await getUserRole();
      if (role) {
        onLoginSuccess(role);
      } else {
        setError('Account authenticated, but no system role assigned. Contact Admin.');
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl bg-white p-8 shadow-md border border-slate-100">
        <h2 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight">PrimarySchool OS</h2>
        <p className="mt-2 text-center text-sm text-slate-500 mb-6">Sign in to access your administrative dashboard</p>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition" placeholder="you@school.com" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 p-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
        </button>
      </form>
    </div>
  );
};
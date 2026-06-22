import { useState, useEffect } from 'react';
import { supabase, getUserRole } from './lib/supabaseClient';
import { Login } from './pages/Login';

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [role, setRole] = useState<'admin' | 'teacher' | 'parent' | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userRole = await getUserRole();
        setRole(userRole);
      }
      setSessionChecked(true);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const userRole = await getUserRole();
        setRole(userRole);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!sessionChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 font-sans text-slate-500 text-sm font-medium tracking-wide">
        Loading School Engine...
      </div>
    );
  }

  if (!role) {
    return <Login onLoginSuccess={(assignedRole) => setRole(assignedRole)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">
          School OS <span className="capitalize text-blue-600">({role})</span>
        </h1>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
          Sign Out
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {role === 'admin' && (
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">🛠️ Administrative Control Console</h3>
            <p className="text-sm text-slate-500">Welcome back. Ready to manage teachers, student directories, and system-wide attributes.</p>
          </div>
        )}

        {role === 'teacher' && (
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">📝 Teacher Classroom Console</h3>
            <p className="text-sm text-slate-500">Welcome, Instructor. Track daily rosters, attendance marks, and standard metrics.</p>
          </div>
        )}

        {role === 'parent' && (
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">🏡 Parent Guardian Portal</h3>
            <p className="text-sm text-slate-500">Monitor academic milestones, attendance summaries, and manage digital authorization permissions.</p>
          </div>
        )}
      </main>
    </div>
  );
}
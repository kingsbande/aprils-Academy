import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient'; // Adjusted path if necessary
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users, GraduationCap } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Local navigation state for rapid prototyping with stakeholder
  const [userSession, setUserSession] = useState<{ id: string; role: string; name: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Authenticate user credentials against Supabase Auth engine
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Query the custom profiles table to retrieve role permissions
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // 3. Update active session routing configuration
        setUserSession({
          id: authData.user.id,
          role: profile.role,
          name: profile.full_name,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Temporary routing container layout for presentation
  if (userSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {userSession.name}!</h2>
          <p className="text-slate-500 mt-2">
            Successfully authenticated as <span className="text-emerald-700 font-semibold uppercase">{userSession.role}</span>.
          </p>
          <div className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm font-medium border border-amber-200">
            🚧 Next Up: Loading Step {userSession.role === 'admin' ? '4' : userSession.role === 'teacher' ? '5' : '6'} Dashboard view...
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              setUserSession(null);
            }}
            className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-zinc-900 overflow-x-hidden select-none font-sans">
      
      {/* Visual Background Structure - Mimicking the blurred school atmosphere from 3a171f14-3cfa-4506-889d-d1bbc2a9591b.png */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 filter blur-[2px]" 
        style={{ backgroundImage: `url('/assets/images/aprils-backgoround.png')` }} 
      />

      {/* Main Container Core ee */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 pt-10 pb-16">
        <div className="bg-white/95 backdrop-blur-md w-full max-w-[460px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 sm:p-10 border border-white/20 text-center">
          
          {/* Branded Official Logo  */}
<div className="flex justify-center mb-5">
  <div className="relative flex items-center justify-center w-32 h-32 rounded-full overflow-hidden">
    <img 
      src="/assets/images/aprils.png"
      alt="April's Academy Official Logo"
      className="w-full h-full object-contain"
      onError={(e) => {
        // Fallback styling if path is mistyped or asset is missing
        e.currentTarget.src = "/assets/images/aprils.png";
      }}
    />
  </div>
</div>
          {/* Heading Module */}
          <h1 className="text-3xl font-black tracking-tight text-[#2A4D22] uppercase">WELCOME BACK</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 mb-8">Sign in to your account to continue</p>

          {/* Error Alert Message Panel */}
          {errorMessage && (
            <div className="mb-4 p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl text-left">
              {errorMessage}
            </div>
          )}

          {/* Credentials Authorization Form */}
          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1.5 ml-1">
                Username or Emailll
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm placeholder-zinc-400 font-medium text-zinc-800 outline-none focus:border-[#2A4D22] focus:ring-2 focus:ring-[#2A4D22]/10 transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-zinc-200 rounded-xl text-sm placeholder-zinc-400 font-medium text-zinc-800 outline-none focus:border-[#2A4D22] focus:ring-2 focus:ring-[#2A4D22]/10 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me and Recover Parameters */}
            <div className="flex items-center justify-between text-xs font-semibold pt-0.5">
              <label className="flex items-center space-x-2 text-zinc-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-[#2A4D22] focus:ring-[#2A4D22]" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-[#2A4D22] hover:underline">Forgot Password?</a>
            </div>

            {/* Authentication Submission Button Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#2A4D22] hover:bg-[#1E3818] disabled:bg-zinc-400 text-white font-bold tracking-wider rounded-xl uppercase transition duration-200 shadow-md shadow-emerald-900/10"
            >
              {loading ? 'Authenticating...' : 'LOGIN'}
            </button>
          </form>

          {/* Alternate Navigation Routing Action Matrix */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
            <div className="relative flex justify-center text-xs font-bold uppercase"><span className="bg-white px-3 text-zinc-400">OR</span></div>
          </div>

          <button className="w-full py-3 border border-[#2A4D22] text-[#2A4D22] hover:bg-[#2A4D22]/5 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition">
            <Users size={16} />
            <span>Login with another account</span>
          </button>

          {/* Helpdesk Forwarding Disclaimer */}
          <p className="text-xs font-medium text-zinc-500 mt-6">
            Don’t have an account? <span className="text-[#2A4D22] font-bold cursor-pointer hover:underline">Contact Administrator</span>
          </p>

        </div>
      </div>

      {/* Styled Institutional Curved Footer Module from 3a171f14-3cfa-4506-889d-d1bbc2a9591b.png */}
      <div className="relative z-10 w-full bg-[#1A3315] border-t-4 border-[#2A4D22] px-6 py-6 text-white text-center">
        
        {/* Core Institutional Value Highlights Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-4 mb-4 text-xs font-medium tracking-wide">
          <div className="flex items-center justify-center space-x-2 text-emerald-200">
            <ShieldCheck size={16} />
            <span>Secure Access</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-emerald-200 border-y md:border-y-0 md:border-x border-white/10 py-2 md:py-0">
            <Users size={16} />
            <span>Trusted by Educators</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-emerald-200">
            <GraduationCap size={16} />
            <span>Empowering Education</span>
          </div>
        </div>

        {/* Copyright Matrix */}
        <p className="text-[10px] tracking-widest opacity-60 uppercase font-medium">
          © {new Date().getFullYear()} April's Academy. All rights reserved.
        </p>
      </div>

    </div>
  );
}
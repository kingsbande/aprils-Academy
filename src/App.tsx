import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { AuthFooter } from './features/auth/AuthFooter';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;
      alert('Login successful! Redirecting to dashboard...');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-x-hidden p-4 sm:p-6 md:p-8 bg-slate-900">
      
      {/* Visual Background Structure */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 filter blur-[2px]" 
        style={{ backgroundImage: `url('/assets/images/aprils-backgoround.png')` }} 
      />

      <div className="hidden md:block h-4" />

      {/* Transparent Login Card Container */}
      <div className="w-full max-w-md my-auto bg-white/100 backdrop-blur-md rounded-[29px] shadow-2xl border border-slate-100 p-6 sm:p-10 z-10 transition-all duration-300">
        
        {/* Branding Header with Circular Photo Holder */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative flex items-center justify-center">
            <img 
              src="/assets/images/aprils.png" 
              alt="April's Academy Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2A4D22] text-center uppercase">
            Welcome
          </h1>
          <p className="text-sm text-slate-600 mt-1 text-center font-medium">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start space-x-2.5 text-sm text-red-800 animate-fadeIn">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Elements */}
        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Email Address"
            type="email"
            icon={User}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@aprilsacademy.com"
            required
            disabled={loading}
          />

          <Input 
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Remember Me & Password Recovery */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center space-x-2 text-slate-700 font-medium cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#2A4D22] focus:ring-[#2A4D22]/20 accent-[#2A4D22]"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="font-bold text-[#2A4D22] hover:text-[#1f3a19] transition-colors duration-150">
              Forgot Password?
            </a>
          </div>

          {/* Interactive Form Actions */}
          <div className="space-y-3 pt-2">
            <Button type="submit" loading={loading}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </Button>

          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600 font-medium">
          Don't have an account?{' '}
          <a href="#contact" className="font-bold text-[#2A4D22] hover:text-[#1f3a19] transition-colors duration-150">
            Contact Administrator
          </a>
        </div>

      </div>
         <AuthFooter />
    </div>
  );
}
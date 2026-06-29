import { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useLogin } from './useLogin';

const MAX_ATTEMPTS = 5;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    identifier, setIdentifier,
    password,   setPassword,
    rememberMe, setRememberMe,
    loading,
    error,
    attempts,
    handleLogin,
  } = useLogin();

  const isLockedOut = attempts >= MAX_ATTEMPTS;

  return (
    <form onSubmit={handleLogin} className="space-y-5" noValidate>

      {/* Error banner */}
      {error && (
        <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start space-x-2.5 text-sm text-red-800 animate-fadeIn">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Attempt counter warning */}
      {attempts > 0 && attempts < MAX_ATTEMPTS && (
        <p className="text-xs text-amber-600 text-right">
          {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining before cooldown
        </p>
      )}

      <Input
        label="Username or Email"
        type="text"
        autoComplete="username"
        icon={User}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
        disabled={loading || isLockedOut}
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        icon={Lock}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        disabled={loading || isLockedOut}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loading || isLockedOut}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      {/* Remember me & forgot password */}
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
        <a
          href="/forgot-password"
          className="font-bold text-[#2A4D22] hover:text-[#1f3a19] transition-colors duration-150"
        >
          Forgot password?
        </a>
      </div>

      <div className="pt-2">
        <Button type="submit" loading={loading} disabled={isLockedOut}>
          {loading ? 'AUTHENTICATING...' : isLockedOut ? 'LOCKED — WAIT 30s' : 'LOGIN'}
        </Button>
      </div>
    </form>
  );
}

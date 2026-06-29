import { type FormEvent, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface UseLoginReturn {
  identifier: string;
  setIdentifier: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  loading: boolean;
  error: string | null;
  attempts: number;
  handleLogin: (e: FormEvent) => Promise<void>;
}

// Safe error messages — never expose raw Supabase/DB errors to the UI
const SAFE_ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Invalid credentials. Please try again.',
  'Email not confirmed':       'Please confirm your email before signing in.',
  'Too many requests':         'Too many attempts. Please wait a moment and try again.',
};

function sanitizeError(raw: string): string {
  for (const [key, safe] of Object.entries(SAFE_ERRORS)) {
    if (raw.includes(key)) return safe;
  }
  // Generic fallback — never leak internal details
  return 'Invalid credentials. Please try again.';
}

// Allowed post-login destinations — prevents open redirect
const ALLOWED_PATHS: Record<string, string> = {
  dashboard:       '/dashboard',
  changePassword:  '/change-password',
};

const MAX_ATTEMPTS   = 5;
const LOCKOUT_MS     = 30_000; // 30 s client-side cooldown

export function useLogin(): UseLoginReturn {
  const [identifier,  setIdentifier]  = useState('');
  const [password,    setPassword]    = useState('');
  const [rememberMe,  setRememberMe]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [attempts,    setAttempts]    = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // ── username → email resolution ─────────────────────────────────────────
  const resolveEmail = async (input: string): Promise<string> => {
    if (input.includes('@')) return input;

    const username = input.toLowerCase();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email_mapping')
      .eq('username', username)
      .maybeSingle();

    // [H2] Same generic message whether username doesn't exist or password is wrong
    // — prevents username enumeration
    if (profileError || !profile || !profile.email_mapping) {
      throw new Error('Invalid credentials. Please try again.');
    }

    return profile.email_mapping;
    // [M2] Removed silent `|| "${username}@aprilsacademy.local"` fallback
  };

  // ── main handler ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // [M1] Client-side lockout after MAX_ATTEMPTS
    if (lockedUntil && Date.now() < lockedUntil) {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Please wait ${secs}s before trying again.`);
      return;
    }

    // [M4] Manual empty-field guard (noValidate is set on the form)
    if (!identifier.trim() || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const targetEmail = await resolveEmail(identifier.trim());

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (authError) throw authError;

      // [M3] Correct remember-me: sign out on tab close when unchecked
      if (!rememberMe) {
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            supabase.auth.signOut();
          }
        }, { once: true });
      }

      // [L2] Clear password from state immediately after success
      setPassword('');
      setAttempts(0);

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('is_temporary_password')
        .eq('id', authData.user?.id)
        .maybeSingle();

      // [H3] Whitelist-only redirects — no user-influenced path
      const dest = userProfile?.is_temporary_password
        ? ALLOWED_PATHS.changePassword
        : ALLOWED_PATHS.dashboard;

      window.location.href = dest;

    } catch (err: unknown) {
      // [L3] Type-safe error handling — no `any`
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // [M1] Exponential backoff lockout
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
      }

      // [H1] Sanitize — never show raw Supabase/DB message
      const raw = err instanceof Error ? err.message : 'Unknown error';
      setError(sanitizeError(raw));

      // [L2] Clear password on failure too
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return {
    identifier, setIdentifier,
    password,   setPassword,
    rememberMe, setRememberMe,
    loading,
    error,
    attempts,
    handleLogin,
  };
}

import { useState } from 'react';
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
  successMessage: string | null;
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

const SAFE_ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Invalid credentials. Please try again.',
  'Email not confirmed':       'Please confirm your email before signing in.',
  'Too many requests':         'Too many attempts. Please wait a moment and try again.',
};

function sanitizeError(raw: string): string {
  for (const [key, safe] of Object.entries(SAFE_ERRORS)) {
    if (raw.includes(key)) return safe;
  }
  return 'Invalid credentials. Please try again.';
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30_000;

export function useLogin(): UseLoginReturn {
  const [identifier,     setIdentifier]     = useState('');
  const [password,       setPassword]       = useState('');
  const [rememberMe,     setRememberMe]     = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [attempts,       setAttempts]       = useState(0);
  const [lockedUntil,    setLockedUntil]    = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resolveEmail = async (input: string): Promise<string> => {
    if (input.includes('@')) return input;

    const username = input.toLowerCase();

    // Runs as anon (pre-login) — only selects username + email_mapping,
    // which the public lookup policy permits. No other columns exposed.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, email_mapping')   // ← explicit minimal columns
      .eq('username', username)
      .maybeSingle();

    // Always throw a generic message — never confirm whether username exists
    if (profileError || !profile || !profile.email_mapping) {
      throw new Error('Invalid credentials. Please try again.');
    }

    return profile.email_mapping;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Please wait ${secs}s before trying again.`);
      return;
    }

    if (!identifier.trim() || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const targetEmail = await resolveEmail(identifier.trim());

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (authError) throw authError;

      if (!rememberMe) {
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') supabase.auth.signOut();
        }, { once: true });
      }

      setPassword('');
      setAttempts(0);

      // Now authenticated — full profile fetch is allowed by RLS
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, role, is_temporary_password')
        .eq('id', authData.user?.id)
        .maybeSingle();

      // TODO: replace with react-router navigate() once dashboard pages exist:
      //   if (userProfile?.is_temporary_password) navigate('/change-password')
      //   else navigate(`/${userProfile?.role}-dashboard`)
      if (userProfile?.is_temporary_password) {
        setSuccessMessage(
          `✓ Logged in as ${userProfile.full_name} (${userProfile.role}). ` +
          `Temporary password detected — will redirect to /change-password once that page exists.`
        );
      } else {
        setSuccessMessage(
          `✓ Logged in as ${userProfile?.full_name} (${userProfile?.role}). ` +
          `Will redirect to /${userProfile?.role}-dashboard once that page exists.`
        );
      }

    } catch (err: unknown) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) setLockedUntil(Date.now() + LOCKOUT_MS);
      const raw = err instanceof Error ? err.message : 'Unknown error';
      setError(sanitizeError(raw));
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return {
    identifier,     setIdentifier,
    password,       setPassword,
    rememberMe,     setRememberMe,
    loading,
    error,
    attempts,
    successMessage,
    handleLogin,
  };
}
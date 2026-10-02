import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, ShieldCheck, AlertCircle, Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, signInWithGoogle } = useAuth();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magiclink'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-close modal when user signs in successfully
  React.useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await signInWithGoogle();
      if (result.error) {
        if (result.error.message.includes('Unsupported provider') || result.error.message.includes('not enabled')) {
          setErrorMessage('Google OAuth is not enabled in your Supabase project dashboard (swlcjcgrxbqjflgalszb). Please enable Google under Authentication > Providers, or sign in below with your email.');
        } else {
          setErrorMessage(result.error.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const redirectUrl = `${window.location.origin}/auth/callback`;

    try {
      if (authMode === 'magiclink') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        setSuccessMessage(`A secure magic login link has been dispatched to ${email}. Check your inbox to sign in.`);
      } else if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        if (data.session) {
          setSuccessMessage('Account created successfully. Welcome to NovaTrend!');
          setTimeout(() => onClose(), 1200);
        } else {
          setSuccessMessage(`Confirmation email sent to ${email}. Please confirm your address to complete registration.`);
        }
      } else {
        // Sign In with email & password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMessage('Authentication successful. Welcome back!');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <a href="/" className="inline-block text-2xl font-extrabold font-heading text-gray-950 tracking-tight">
            <span>Nova</span>
            <span className="text-[#EA580C]">Trend</span>
          </a>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            {authMode === 'signup' ? 'Create an Account' : authMode === 'magiclink' ? 'Passwordless Sign-In' : 'Sign in to Your Account'}
          </h2>
          <p className="text-xs text-gray-500">
            Access order history, real-time tracking, and saved preferences.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold">Authentication Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-semibold">Verification Notice</p>
              <p className="mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Primary OAuth: Google */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 px-4 bg-white border border-gray-300 hover:border-gray-900 rounded-xl text-xs font-semibold text-gray-800 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#EA580C]" />
            ) : (
              <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.13C3.25 21.31 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.59l4.01 3.13c.95-2.84 3.6-4.97 6.72-4.97z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Adebayo Alabi"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-3 text-gray-900 focus:outline-none focus:border-[#EA580C] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-3 text-gray-900 focus:outline-none focus:border-[#EA580C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {authMode !== 'magiclink' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('magiclink');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-[#EA580C] hover:underline"
                  >
                    Forgot or passwordless?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-900 focus:outline-none focus:border-[#EA580C] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-gray-400 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {authMode === 'signup'
                    ? 'Create Account'
                    : authMode === 'magiclink'
                    ? 'Send Magic Link'
                    : 'Sign In with Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="pt-2 text-center text-xs text-gray-600">
          {authMode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-gray-950 hover:text-[#EA580C] underline"
              >
                Sign up
              </button>
            </p>
          )}

          {authMode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-gray-950 hover:text-[#EA580C] underline"
              >
                Sign in
              </button>
            </p>
          )}

          {authMode === 'magiclink' && (
            <p>
              Prefer password?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-gray-950 hover:text-[#EA580C] underline"
              >
                Sign in with password
              </button>
            </p>
          )}
        </div>

        {/* Production Trust Badge */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <span>256-Bit SSL Encrypted & Protected by Supabase Auth</span>
        </div>

      </div>
    </div>
  );
};

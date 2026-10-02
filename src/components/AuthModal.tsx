import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, AlertCircle, Loader2, ExternalLink, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithDemoUser, isConfigured } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [providerDisabledNotice, setProviderDisabledNotice] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setProviderDisabledNotice(false);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        if (
          error.message.includes('Unsupported provider') || 
          error.message.includes('provider is not enabled') ||
          error.message.includes('not enabled')
        ) {
          setProviderDisabledNotice(true);
          setErrorMsg('Google OAuth is not toggled ON in your Supabase project (swlcjcgrxbqjflgalszb).');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        // If popup opened without error, close modal or wait for message
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectGoogleLogin = () => {
    signInWithDemoUser('currentUser');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6F65] hover:text-[#1E1B18] transition-colors"
          aria-label="Close sign in"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#786B60]">
            Sanctuary Patron Portal
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#1E1B18]">
            Sign in to ÈDÁ
          </h2>
          <p className="text-xs text-[#695E54]">
            Access your saved bag, past orders, and custom botanical blends across devices.
          </p>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] space-y-2 text-xs text-[#991B1B]">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            
            {providerDisabledNotice && (
              <div className="pt-2 border-t border-[#FECACA] text-[11px] text-[#7F1D1D] leading-relaxed">
                <p className="font-semibold mb-1">To enable live Google Sign-in in Supabase:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Open your Supabase project dashboard</li>
                  <li>Navigate to <strong>Authentication</strong> → <strong>Providers</strong></li>
                  <li>Click <strong>Google</strong> and toggle it <strong>Enabled</strong></li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Primary Action: Google Sign-in */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#2C241E] text-xs font-mono font-medium text-[#2C241E] shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#2C241E]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Sign in with Google (Live OAuth Popup)</span>
          </button>

          {/* Quick Google Account Sign-In with elevatepages980@gmail.com */}
          <button
            type="button"
            onClick={handleDirectGoogleLogin}
            className="w-full py-3 px-4 bg-[#2C241E] text-[#FAF8F5] text-xs font-mono font-medium hover:bg-[#15120F] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
            <span>Continue as elevatepages980@gmail.com</span>
          </button>
        </div>

        {/* Demo Fast-Switch Section */}
        <div className="pt-4 border-t border-[#E8E2D8] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#7A6F65] font-bold">
              Test Personas (Nigerian Patrons)
            </span>
            <span className="text-[10px] font-mono text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 border border-[#BFDBFE]">
              1-Click
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                signInWithDemoUser('lagos');
                onClose();
              }}
              className="p-3 bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#2C241E] text-left transition-colors"
            >
              <p className="text-xs font-medium text-[#2C241E]">Adebayo Alabi</p>
              <p className="text-[10px] text-[#7A6F65] font-mono">Lagos Patron</p>
            </button>

            <button
              type="button"
              onClick={() => {
                signInWithDemoUser('abuja');
                onClose();
              }}
              className="p-3 bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#2C241E] text-left transition-colors"
            >
              <p className="text-xs font-medium text-[#2C241E]">Dr. Amina Bello</p>
              <p className="text-[10px] text-[#7A6F65] font-mono">Abuja Patron</p>
            </button>
          </div>
        </div>

        {/* RLS & Supabase Privacy Notice */}
        <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] flex items-start gap-2 text-[11px] text-[#7A6F65]">
          <ShieldCheck className="w-4 h-4 text-[#2C241E] flex-shrink-0 mt-0.5" />
          <span>
            Protected with Supabase Row Level Security (RLS). Users can only access their own order records.
          </span>
        </div>

      </div>
    </div>
  );
};

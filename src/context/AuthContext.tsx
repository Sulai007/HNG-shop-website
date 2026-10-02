import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null; unsupportedProvider?: boolean }>;
  signOut: () => Promise<void>;
  signInWithDemoUser: (persona?: 'currentUser' | 'lagos' | 'abuja') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<'currentUser' | 'lagos' | 'abuja', Profile> = {
  currentUser: {
    id: 'usr_google_elevatepages_01',
    full_name: 'Elevate Pages',
    email: 'elevatepages980@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+234 812 345 6789',
  },
  lagos: {
    id: 'usr_adebayo_lagos_01',
    full_name: 'Adebayo Alabi',
    email: 'adebayo.alabi@example.ng',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+234 803 123 4567',
  },
  abuja: {
    id: 'usr_amina_abuja_02',
    full_name: 'Dr. Amina Bello',
    email: 'amina.bello@example.ng',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+234 809 987 6543',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Helper to construct exact deployment callback URL
  const getCallbackUrl = (): string => {
    if (typeof window !== 'undefined') {
      // In AI Studio, the development container (ais-dev-*.run.app) is protected by an internal auth bridge.
      // Top-level popups redirected to ais-dev get intercepted and display "Forbidden".
      // Directing the OAuth callback to the public shared app URL (ais-pre-*.run.app) ensures
      // the popup loads the callback HTML cleanly and dispatches postMessage back to window.opener.
      const origin = window.location.origin.replace('ais-dev-', 'ais-pre-');
      return `${origin}/auth/callback`;
    }
    return 'http://localhost:3000/auth/callback';
  };

  // Helper to map Supabase user to Profile
  const mapSessionUser = (supabaseUser: any): Profile => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'Valued Patron',
      avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    };
  };

  // Listen for popup callback postMessage
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        console.log('[Auth] Received OAuth popup success notification');
        
        try {
          if (event.data.search) {
            const searchParams = new URLSearchParams(event.data.search);
            const code = searchParams.get('code');
            if (code && isConfigured) {
              await supabase.auth.exchangeCodeForSession(code);
            }
          } else if (event.data.hash) {
            const hashParams = new URLSearchParams(event.data.hash.replace(/^#/, ''));
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            if (access_token && refresh_token && isConfigured) {
              await supabase.auth.setSession({ access_token, refresh_token });
            }
          }
        } catch (err) {
          console.warn('[Auth] Error setting session from popup payload:', err);
        }

        if (isConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const u = mapSessionUser(session.user);
            setUser(u);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('novatrend_patron_user', JSON.stringify(u));
            }
          }
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [isConfigured]);

  // Initialize and persist session across reloads
  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Check if returning from OAuth redirect with access_token or code in URL
        if (typeof window !== 'undefined') {
          const hasAuthHash = window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'));
          const hasAuthCode = window.location.search && window.location.search.includes('code=');

          if (hasAuthHash || hasAuthCode) {
            console.log('[Auth] Detected OAuth callback in URL, extracting session...');
            if (isConfigured) {
              try {
                if (hasAuthCode) {
                  const urlParams = new URLSearchParams(window.location.search);
                  const code = urlParams.get('code');
                  if (code) {
                    await supabase.auth.exchangeCodeForSession(code);
                  }
                }
              } catch (e) {
                console.warn('[Auth] Code exchange error:', e);
              }

              const { data } = await supabase.auth.getSession();
              if (data?.session?.user) {
                const u = mapSessionUser(data.session.user);
                setUser(u);
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('novatrend_patron_user', JSON.stringify(u));
                }
                // Clean URL parameters without refreshing
                window.history.replaceState(null, '', window.location.pathname);
                setLoading(false);
                return;
              }
            }
          }
        }

        // 2. Check Supabase active session
        if (isConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const u = mapSessionUser(session.user);
            setUser(u);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('novatrend_patron_user', JSON.stringify(u));
            }
            setLoading(false);
            return;
          }

          // Listen for real-time auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              const u = mapSessionUser(session.user);
              setUser(u);
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('novatrend_patron_user', JSON.stringify(u));
              }
            } else if (!session) {
              setUser(null);
              if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('novatrend_patron_user');
              }
            }
          });

          // 3. Fallback to persisted patron session in localStorage
          if (typeof localStorage !== 'undefined') {
            const savedUser = localStorage.getItem('novatrend_patron_user');
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch (e) {
                localStorage.removeItem('novatrend_patron_user');
              }
            }
          }

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // If Supabase not yet configured, check localStorage
          if (typeof localStorage !== 'undefined') {
            const savedUser = localStorage.getItem('novatrend_patron_user');
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch (e) {
                localStorage.removeItem('novatrend_patron_user');
              }
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [isConfigured]);

  // Google OAuth sign-in using Popup Flow (compliant with AI Studio iframe constraints)
  const signInWithGoogle = async (): Promise<{ error: Error | null; unsupportedProvider?: boolean }> => {
    const callbackUrl = getCallbackUrl();

    if (!isConfigured) {
      return { error: new Error('Supabase client is not configured.') };
    }

    try {
      // Initiate OAuth request with skipBrowserRedirect: true so the iframe is not navigated
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        if (error.message.includes('not enabled') || error.message.includes('Unsupported provider')) {
          return { error, unsupportedProvider: true };
        }
        return { error };
      }

      if (!data?.url) {
        return { error: new Error('Supabase did not return an authorization URL.') };
      }

      // Open provider URL directly in a dedicated popup window
      const width = 520;
      const height = 650;
      const left = typeof window !== 'undefined' ? window.screenX + Math.max(0, (window.outerWidth - width) / 2) : 100;
      const top = typeof window !== 'undefined' ? window.screenY + Math.max(0, (window.outerHeight - height) / 2) : 100;

      const popup = window.open(
        data.url,
        'google_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked by browser
        console.warn('[Auth] Popup blocked by browser, attempting window redirect fallback');
        window.open(data.url, '_blank');
      } else {
        popup.focus();

        // Polling fallback while popup is active
        const pollTimer = setInterval(async () => {
          if (popup.closed) {
            clearInterval(pollTimer);
          }

          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            clearInterval(pollTimer);
            if (!popup.closed) {
              popup.close();
            }
            const u = mapSessionUser(sessionData.session.user);
            setUser(u);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('novatrend_patron_user', JSON.stringify(u));
            }
          }
        }, 1500);
      }

      return { error: null };
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      return { error: err };
    }
  };

  const signInWithDemoUser = (persona: 'currentUser' | 'lagos' | 'abuja' = 'currentUser') => {
    const selectedUser = DEMO_USERS[persona];
    setUser(selectedUser);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('novatrend_patron_user', JSON.stringify(selectedUser));
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('novatrend_patron_user');
      localStorage.removeItem('eda_demo_user');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signInWithGoogle,
        signOut,
        signInWithDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

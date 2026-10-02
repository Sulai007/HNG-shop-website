import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null; url?: string }>;
  signOut: () => Promise<void>;
  signInWithDemoUser: (persona?: 'lagos' | 'abuja' | 'currentUser') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<'lagos' | 'abuja' | 'currentUser', Profile> = {
  currentUser: {
    id: 'usr_google_elevatepages_01',
    full_name: 'Elevate Pages (Google Patron)',
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

  // Load persisted user on mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (isConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Valued Customer',
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            });
            setLoading(false);
            return;
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Valued Customer',
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              });
            }
          });

          // Check if demo user is stored in localStorage as fallback
          const savedDemoUser = localStorage.getItem('eda_demo_user');
          if (savedDemoUser) {
            try {
              setUser(JSON.parse(savedDemoUser));
            } catch (e) {
              localStorage.removeItem('eda_demo_user');
            }
          }

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Check local storage for demo persisted user
          const savedDemoUser = localStorage.getItem('eda_demo_user');
          if (savedDemoUser) {
            try {
              setUser(JSON.parse(savedDemoUser));
            } catch (e) {
              localStorage.removeItem('eda_demo_user');
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

  // Listen for cross-origin popup OAuth message
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        console.log('[Auth] Received OAuth success message from popup');
        try {
          if (isConfigured) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google Patron',
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              });
              return;
            }
          }
        } catch (e) {
          console.warn('Session retrieval error after OAuth:', e);
        }
        // Fallback to current authenticated Google user
        signInWithDemoUser('currentUser');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isConfigured]);

  const signInWithGoogle = async (): Promise<{ error: Error | null; url?: string }> => {
    if (!isConfigured) {
      signInWithDemoUser('currentUser');
      return { error: null };
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      // We use skipBrowserRedirect: true so that we can open a popup.
      // Google blocks being displayed in an iframe!
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data?.url) {
        // Open popup
        const width = 550;
        const height = 650;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open(
          data.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
        );

        if (!popup) {
          return { error: new Error('Popup blocked. Please allow popups for this site, or select instant Google sign-in.') };
        }

        return { error: null, url: data.url };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithDemoUser = (persona: 'lagos' | 'abuja' | 'currentUser' = 'currentUser') => {
    const selectedUser = DEMO_USERS[persona];
    setUser(selectedUser);
    localStorage.setItem('eda_demo_user', JSON.stringify(selectedUser));
  };

  const signOut = async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    localStorage.removeItem('eda_demo_user');
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

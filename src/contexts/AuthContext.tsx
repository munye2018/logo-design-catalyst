import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { logger } from '@/lib/logger';

interface TrialStatus {
  status: 'trial' | 'active' | 'expired';
  daysRemaining: number;
  trialStartDate: Date | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  trialStatus: TrialStatus;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function calculateTrialStatus(trialStartDate: string | null): TrialStatus {
  if (!trialStartDate) {
    return { status: 'trial', daysRemaining: 30, trialStartDate: null };
  }

  const startDate = new Date(trialStartDate);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 30 - diffDays);

  return {
    status: daysRemaining > 0 ? 'trial' : 'expired',
    daysRemaining,
    trialStartDate: startDate,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    status: 'trial',
    daysRemaining: 30,
    trialStartDate: null,
  });

  // Fetch trial status from profile
  const fetchTrialStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('trial_start_date, subscription_status, subscription_expires_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        logger.error('Failed to fetch trial status:', error);
        return;
      }

      if (data) {
        // Check if user has active subscription
        if (data.subscription_status === 'active') {
          const expiresAt = data.subscription_expires_at ? new Date(data.subscription_expires_at) : null;
          if (!expiresAt || expiresAt > new Date()) {
            setTrialStatus({ status: 'active', daysRemaining: 0, trialStartDate: null });
            return;
          }
        }

        // Calculate trial status
        setTrialStatus(calculateTrialStatus(data.trial_start_date));
      }
    } catch (err) {
      logger.error('Error fetching trial status:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.debug('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Fetch trial status when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchTrialStatus(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchTrialStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      return { error: result.error };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setTrialStatus({ status: 'trial', daysRemaining: 30, trialStartDate: null });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      trialStatus,
      signUp, 
      signIn, 
      signInWithGoogle,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

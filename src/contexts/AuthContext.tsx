import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { logger } from '@/lib/logger';

const TRIAL_DURATION_HOURS = 24;

interface TrialStatus {
  status: 'trial' | 'active' | 'expired';
  daysRemaining: number;
  hoursRemaining: number;
  trialStartDate: Date | null;
  subscriptionEnd: Date | null;
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
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function calculateTrialStatus(trialStartDate: string | null): TrialStatus {
  if (!trialStartDate) {
    return { 
      status: 'trial', 
      daysRemaining: 1, 
      hoursRemaining: TRIAL_DURATION_HOURS,
      trialStartDate: null, 
      subscriptionEnd: null 
    };
  }

  const startDate = new Date(trialStartDate);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const hoursRemaining = Math.max(0, TRIAL_DURATION_HOURS - diffHours);
  const daysRemaining = Math.ceil(hoursRemaining / 24);

  return {
    status: hoursRemaining > 0 ? 'trial' : 'expired',
    daysRemaining,
    hoursRemaining,
    trialStartDate: startDate,
    subscriptionEnd: null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    status: 'trial',
    daysRemaining: 1,
    hoursRemaining: TRIAL_DURATION_HOURS,
    trialStartDate: null,
    subscriptionEnd: null,
  });

  // Check Stripe subscription status
  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      logger.debug('No session for subscription check');
      return;
    }

    try {
      logger.debug('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        logger.error('Subscription check error:', error);
        return;
      }

if (data?.subscribed) {
        logger.debug('User has active subscription', data);
        setTrialStatus({
          status: 'active',
          daysRemaining: 0,
          hoursRemaining: 0,
          trialStartDate: null,
          subscriptionEnd: data.subscription_end ? new Date(data.subscription_end) : null,
        });
      } else {
        logger.debug('No active subscription found');
        // Fall back to trial status if no subscription
        if (user?.id) {
          await fetchTrialStatus(user.id);
        }
      }
    } catch (err) {
      logger.error('Error checking subscription:', err);
    }
  }, [session?.access_token, user?.id]);

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
        // Check if user has active subscription in DB
if (data.subscription_status === 'active') {
          const expiresAt = data.subscription_expires_at ? new Date(data.subscription_expires_at) : null;
          if (!expiresAt || expiresAt > new Date()) {
            setTrialStatus({ status: 'active', daysRemaining: 0, hoursRemaining: 0, trialStartDate: null, subscriptionEnd: expiresAt });
            return;
          }
        }

        // Calculate trial status
        const calculatedStatus = calculateTrialStatus(data.trial_start_date);
        setTrialStatus(calculatedStatus);
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

  // Check subscription when session is available and periodically
  useEffect(() => {
    if (session?.access_token) {
      // Check on mount
      checkSubscription();

      // Check every 60 seconds
      const interval = setInterval(checkSubscription, 60000);
      return () => clearInterval(interval);
    }
  }, [session?.access_token, checkSubscription]);

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
    setTrialStatus({ status: 'trial', daysRemaining: 1, hoursRemaining: TRIAL_DURATION_HOURS, trialStartDate: null, subscriptionEnd: null });
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
      signOut,
      checkSubscription,
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

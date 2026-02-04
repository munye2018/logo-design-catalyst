import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, Crown, X } from 'lucide-react';
import { useState } from 'react';

interface TrialBannerProps {
  onUpgrade?: () => void;
}

export function TrialBanner({ onUpgrade }: TrialBannerProps) {
  const { trialStatus, user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if not logged in, dismissed, or has active subscription
  if (!user || dismissed || trialStatus.status === 'active') {
    return null;
  }

  // Trial expired
  if (trialStatus.status === 'expired') {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Your free trial has ended</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to Premium to continue your fitness journey
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="bg-destructive hover:bg-destructive/90"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  // Trial active - show days remaining
  const isLowDays = trialStatus.daysRemaining <= 7;

  return (
    <div className={`${
      isLowDays 
        ? 'bg-amber-500/10 border-amber-500/20' 
        : 'bg-primary/10 border-primary/20'
    } border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${isLowDays ? 'text-amber-500' : 'text-primary'}`} />
          <div>
            <p className={`font-medium ${isLowDays ? 'text-amber-500' : 'text-primary'}`}>
              Free Trial: {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'day' : 'days'} remaining
            </p>
            <p className="text-sm text-muted-foreground">
              {isLowDays 
                ? 'Upgrade now to keep your progress' 
                : 'Enjoy full access to all features'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isLowDays ? 'default' : 'outline'}
            onClick={onUpgrade}
          >
            Upgrade
          </Button>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

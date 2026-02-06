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

  // Trial active - show hours remaining
  const { hoursRemaining } = trialStatus;
  const isLowTime = hoursRemaining <= 6;
  const isVeryLowTime = hoursRemaining <= 1;

  // Format the time display
  const getTimeDisplay = () => {
    if (isVeryLowTime) {
      return 'Less than 1 hour remaining';
    }
    return `${hoursRemaining} ${hoursRemaining === 1 ? 'hour' : 'hours'} remaining`;
  };

  return (
    <div className={`${
      isLowTime 
        ? 'bg-amber-500/10 border-amber-500/20' 
        : 'bg-primary/10 border-primary/20'
    } border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${isLowTime ? 'text-amber-500' : 'text-primary'}`} />
          <div>
            <p className={`font-medium ${isLowTime ? 'text-amber-500' : 'text-primary'}`}>
              Free Trial: {getTimeDisplay()}
            </p>
            <p className="text-sm text-muted-foreground">
              {isLowTime 
                ? 'Upgrade now to keep your progress' 
                : 'Enjoy full access to all features'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isLowTime ? 'default' : 'outline'}
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

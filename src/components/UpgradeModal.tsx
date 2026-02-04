import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, X, Dumbbell, Camera, Calendar, TrendingUp } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTrialExpired?: boolean;
}

const premiumFeatures = [
  { icon: Dumbbell, text: 'Unlimited workout sessions' },
  { icon: Camera, text: 'AI-powered form analysis' },
  { icon: Calendar, text: 'Personalized 8-week programs' },
  { icon: TrendingUp, text: 'Progress tracking & analytics' },
];

export function UpgradeModal({ isOpen, onClose, isTrialExpired = false }: UpgradeModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    // Placeholder for Stripe integration
    alert('Stripe payment integration coming soon!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={isTrialExpired ? undefined : onClose}
      />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-200">
        {!isTrialExpired && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isTrialExpired ? 'Your Trial Has Ended' : 'Upgrade to Premium'}
          </CardTitle>
          <CardDescription>
            {isTrialExpired 
              ? 'Subscribe to continue your fitness journey' 
              : 'Unlock all features and reach your fitness goals faster'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features List */}
          <ul className="space-y-3">
            {premiumFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="text-center py-4 border-y border-border">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Cancel anytime
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12" 
              size="lg"
              onClick={handleUpgrade}
            >
              <Crown className="w-4 h-4 mr-2" />
              Subscribe Now
            </Button>
            
            {!isTrialExpired && (
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={onClose}
              >
                Maybe Later
              </Button>
            )}
          </div>

          {/* Trust Badge */}
          <p className="text-xs text-center text-muted-foreground">
            <Check className="w-3 h-3 inline mr-1" />
            Secure payment powered by Stripe
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

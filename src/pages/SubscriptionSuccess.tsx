import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscription } = useAuth();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Refresh subscription status
    checkSubscription();

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, checkSubscription]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Check className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Aurora Premium!</CardTitle>
          <CardDescription>
            Your subscription is now active. Enjoy unlimited access to all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting in {countdown}...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrialBanner } from '@/components/TrialBanner';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Camera, Calendar, Dumbbell, Activity, LogIn, LogOut, User } from 'lucide-react';

// Phase descriptions
const PHASE_LABELS: Record<string, string> = {
  foundation: 'Foundation Phase',
  building: 'Building Phase',
  peak: 'Peak Phase',
  deload: 'Deload Week',
};

export default function Index() {
  const navigate = useNavigate();
  const { program, onboardingComplete, currentWeek } = useGlobalContext();
  const { user, signOut, loading, trialStatus } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // If not onboarded, show welcome screen
  if (!onboardingComplete || !program) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <Activity className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Aurora</h1>
            <p className="text-lg text-muted-foreground">
              AI-powered form coaching for your workouts. Get real-time feedback to improve technique and prevent injury.
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <Button 
              onClick={() => navigate('/onboarding')}
              className="w-full h-12 text-lg"
            >
              Get Started
            </Button>
            
            {!user && (
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full h-12"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Sync Data
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground">
              Create your personalized training program
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">Form Analysis</p>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">8-Week Program</p>
            </div>
            <div className="text-center">
              <Dumbbell className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">50+ Exercises</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for onboarded users
  const currentWeekData = program[currentWeek];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todaySession = currentWeekData?.sessions[todayIndex];
  const phaseLabel = PHASE_LABELS[currentWeekData?.phase] || currentWeekData?.phase;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleStartSession = (sessionIndex: number) => {
    // Check if trial has expired
    if (trialStatus.status === 'expired') {
      setShowUpgradeModal(true);
      return;
    }
    navigate(`/session/${sessionIndex}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Aurora</h1>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={loading}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate('/program')}>
              View Program
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Trial Banner */}
        <TrialBanner onUpgrade={() => setShowUpgradeModal(true)} />

        {/* Sync Banner for non-authenticated users */}
        {!user && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Sync your workouts</p>
                  <p className="text-sm text-muted-foreground">Sign in to save data across devices</p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Today's Session */}
        <Card>
          <CardHeader>
            <CardDescription>Week {currentWeek + 1} • {phaseLabel}</CardDescription>
            <CardTitle>Today's Session</CardTitle>
          </CardHeader>
          <CardContent>
            {todaySession ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{todaySession.name}</h3>
                    <p className="text-muted-foreground">{todaySession.details}</p>
                  </div>
                  <Button onClick={() => handleStartSession(todayIndex)}>
                    Start Session
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {todaySession.exercises.length} exercises
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No session data available</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => navigate('/analysis')}
          >
            <CardContent className="p-6 text-center">
              <Camera className="w-10 h-10 mx-auto mb-2 text-accent" />
              <h3 className="font-semibold">Form Analysis</h3>
              <p className="text-sm text-muted-foreground">Get real-time form feedback</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => navigate('/program')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-accent" />
              <h3 className="font-semibold">Full Program</h3>
              <p className="text-sm text-muted-foreground">View your training plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Week Preview */}
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {currentWeekData?.sessions.map((session, idx) => (
                <button
                  key={session.id}
                  onClick={() => handleStartSession(idx)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    idx === todayIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  } ${session.completed ? 'opacity-50' : ''}`}
                >
                  <div className="text-xs font-medium">{session.day.slice(0, 3)}</div>
                  <div className="text-[10px] truncate mt-1">{session.name}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        isTrialExpired={trialStatus.status === 'expired'}
      />
    </div>
  );
}

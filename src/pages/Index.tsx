import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Calendar, Dumbbell, Activity } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { program, onboardingComplete, currentWeek } = useGlobalContext();

  // If not onboarded, show welcome screen
  if (!onboardingComplete || !program) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <Activity className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Aurora</h1>
            <p className="text-lg text-muted-foreground">
              AI-powered movement analysis for athletes. Get real-time feedback on your form to improve performance and prevent injury.
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <Button 
              onClick={() => navigate('/onboarding')}
              className="w-full h-12 text-lg"
            >
              Get Started
            </Button>
            <p className="text-sm text-muted-foreground">
              Create your personalized training program
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">Real-time Analysis</p>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">20-Week Program</p>
            </div>
            <div className="text-center">
              <Dumbbell className="w-8 h-8 mx-auto text-accent mb-2" />
              <p className="text-xs text-muted-foreground">Smart Exercises</p>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Aurora</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/program')}>
            View Program
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Today's Session */}
        <Card>
          <CardHeader>
            <CardDescription>Week {currentWeek + 1} • {currentWeekData?.stage}</CardDescription>
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
                  <Button onClick={() => navigate(`/session/${todayIndex}`)}>
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
              <h3 className="font-semibold">Movement Analysis</h3>
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
              <p className="text-sm text-muted-foreground">View your 20-week plan</p>
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
                  onClick={() => navigate(`/session/${idx}`)}
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
    </div>
  );
}

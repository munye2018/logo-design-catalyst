import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, History } from 'lucide-react';

// Phase labels
const PHASE_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  building: 'Building',
  peak: 'Peak',
  deload: 'Deload',
};

export default function Program() {
  const navigate = useNavigate();
  const { program, currentWeek, setCurrentWeek, setCurrentSession } = useGlobalContext();

  if (!program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No program generated yet</p>
          <Button onClick={() => navigate('/onboarding')}>Create Program</Button>
        </div>
      </div>
    );
  }

  const currentWeekData = program[currentWeek];
  const phaseLabel = PHASE_LABELS[currentWeekData?.phase] || currentWeekData?.phase;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Training Program</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
            <History className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Week Selector */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Week {currentWeek + 1}</h2>
              <p className="text-sm text-muted-foreground capitalize">{phaseLabel}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeek(Math.min(program.length - 1, currentWeek + 1))}
              disabled={currentWeek === program.length - 1}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week pills */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {program.map((week, idx) => (
              <button
                key={week.id}
                onClick={() => setCurrentWeek(idx)}
                className={`min-w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  idx === currentWeek
                    ? 'bg-primary text-primary-foreground'
                    : week.completed
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {currentWeekData?.sessions.map((session, idx) => (
          <Card 
            key={session.id}
            className={`cursor-pointer transition-colors hover:bg-accent/5 ${
              session.completed ? 'opacity-60' : ''
            }`}
            onClick={() => {
              setCurrentSession(idx);
              navigate(`/session/${idx}`);
            }}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  session.completed ? 'bg-success' : 'bg-muted'
                }`}>
                  {session.completed ? (
                    <Check className="w-5 h-5 text-success-foreground" />
                  ) : (
                    <span className="text-sm font-medium">{session.day.slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{session.name}</h3>
                  <p className="text-sm text-muted-foreground">{session.details}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

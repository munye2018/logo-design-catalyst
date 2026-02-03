import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Check, Clock, Target } from 'lucide-react';
import { getExerciseType } from '@/lib/exerciseRules';

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { program, currentWeek } = useGlobalContext();

  const sessionIndex = parseInt(sessionId || '0');
  const currentWeekData = program?.[currentWeek];
  const session = currentWeekData?.sessions[sessionIndex];

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Session not found</p>
          <Button onClick={() => navigate('/program')}>View Program</Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/program')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">{session.name}</h1>
            <p className="text-sm text-muted-foreground">{session.day}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/analysis')}
          >
            <Camera className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Session Info */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-center">{session.details}</p>
        </div>
      </div>

      {/* Exercises */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {session.exercises.map((exercise, idx) => {
          const exerciseType = getExerciseType(exercise.name);
          const canAnalyze = !['rest', 'activeRecovery'].includes(exerciseType);
          
          return (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exercise.details}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{exercise.duration}</span>
                      </div>
                      
                      {exercise.targetTime && (
                        <div className="flex items-center gap-1 text-sm">
                          <Target className="w-4 h-4 text-accent" />
                          <span>Target: {formatTime(exercise.targetTime)}</span>
                        </div>
                      )}
                      
                      {exercise.recovery && (
                        <div className="text-sm text-muted-foreground">
                          {exercise.recovery}min recovery
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {canAnalyze && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/analysis/${idx}`)}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Complete Session Button */}
        <Button className="w-full h-12" size="lg">
          <Check className="w-5 h-5 mr-2" />
          Complete Session
        </Button>
      </main>
    </div>
  );
}

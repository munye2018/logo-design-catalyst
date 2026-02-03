import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Check, Clock, Dumbbell } from 'lucide-react';
import { getExerciseType } from '@/lib/exerciseRules';
import { getExerciseById } from '@/lib/exerciseLibrary';

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { program, currentWeek, markSessionComplete, logExercise, exerciseLogs } = useGlobalContext();

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

  const handleExerciseComplete = (exerciseIndex: number) => {
    const exercise = session.exercises[exerciseIndex];
    const key = `${currentWeek}-${sessionIndex}-${exerciseIndex}`;
    
    if (!exerciseLogs[key]) {
      logExercise(key, {
        sets: exercise.sets,
        reps: parseInt(exercise.reps) || 10,
        difficulty: 'moderate',
        completedAt: Date.now(),
      });
    }
  };

  const handleCompleteSession = () => {
    markSessionComplete(currentWeek, sessionIndex);
    navigate('/program');
  };

  const isExerciseComplete = (exerciseIndex: number) => {
    const key = `${currentWeek}-${sessionIndex}-${exerciseIndex}`;
    return !!exerciseLogs[key];
  };

  const completedCount = session.exercises.filter((_, idx) => isExerciseComplete(idx)).length;
  const isRest = session.type === 'rest';

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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-muted-foreground">{session.details}</p>
          {!isRest && (
            <span className="text-sm text-muted-foreground">
              {completedCount}/{session.exercises.length} complete
            </span>
          )}
        </div>
      </div>

      {/* Exercises */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {session.exercises.map((exercise, idx) => {
          const exerciseDef = getExerciseById(exercise.exerciseId);
          const exerciseType = getExerciseType(exercise.name);
          const canAnalyze = exerciseDef?.canAnalyze ?? exerciseType !== 'general';
          const isComplete = isExerciseComplete(idx);
          
          return (
            <Card key={idx} className={isComplete ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exercise.details}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      {exercise.sets > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Dumbbell className="w-4 h-4 text-muted-foreground" />
                          <span>{exercise.sets} × {exercise.reps}</span>
                        </div>
                      )}
                      
                      {exercise.rest && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.rest} rest</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {canAnalyze && !isRest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/analysis/${idx}`)}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    {!isRest && (
                      <Button 
                        variant={isComplete ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleExerciseComplete(idx)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Complete Session Button */}
        {!isRest && (
          <Button 
            className="w-full h-12" 
            size="lg"
            onClick={handleCompleteSession}
            disabled={session.completed}
          >
            <Check className="w-5 h-5 mr-2" />
            {session.completed ? 'Session Completed' : 'Complete Session'}
          </Button>
        )}

        {isRest && (
          <Card className="bg-accent/10">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Rest Day</h3>
              <p className="text-muted-foreground">
                Take today to recover. Focus on sleep, nutrition, and light stretching.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

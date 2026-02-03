import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Dumbbell, Clock, TrendingUp } from 'lucide-react';
import type { WorkoutHistoryEntry } from '@/context/GlobalContext';

interface WorkoutHistoryCardProps {
  workout: WorkoutHistoryEntry;
}

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: days > 365 ? 'numeric' : undefined,
  });
}

function getDifficultyColor(difficulty: 'easy' | 'moderate' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-success/20 text-success';
    case 'moderate':
      return 'bg-warning/20 text-warning';
    case 'hard':
      return 'bg-destructive/20 text-destructive';
  }
}

export function WorkoutHistoryCard({ workout }: WorkoutHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalReps = workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header - always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">{workout.sessionName}</div>
              <div className="text-sm text-muted-foreground">
                {formatRelativeDate(workout.date)} • Week {workout.weekNumber + 1}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{workout.exercises.length} exercises</div>
              <div className="text-xs text-muted-foreground">{totalSets} sets • {totalReps} reps</div>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-border">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 py-3">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">{workout.exercises.length}</div>
                <div className="text-xs text-muted-foreground">Exercises</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">{totalSets}</div>
                <div className="text-xs text-muted-foreground">Total Sets</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {workout.totalVolume > 0 ? `${Math.round(workout.totalVolume / 1000)}k` : '-'}
                </div>
                <div className="text-xs text-muted-foreground">Volume (lbs)</div>
              </div>
            </div>

            {/* Exercise list */}
            <div className="space-y-2 mt-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">Exercises</div>
              {workout.exercises.map((exercise, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{exercise.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {exercise.sets} × {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight} lbs`}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
              ))}
            </div>

            {/* Duration if available */}
            {workout.duration && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.round(workout.duration / 60)} minutes</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

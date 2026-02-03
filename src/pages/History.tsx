import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/context/GlobalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkoutHistoryCard } from '@/components/WorkoutHistoryCard';
import { ArrowLeft, Dumbbell, Flame, TrendingUp, Calendar } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const { workoutHistory, getWorkoutStats } = useGlobalContext();

  const stats = useMemo(() => getWorkoutStats(), [workoutHistory]);

  // Sort workouts by date, most recent first
  const sortedWorkouts = useMemo(() => {
    return [...workoutHistory].sort((a, b) => b.date - a.date);
  }, [workoutHistory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Workout History</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Total Workouts</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {stats.weeklyVolume > 0 ? `${Math.round(stats.weeklyVolume / 1000)}k` : '0'}
              </div>
              <div className="text-xs text-muted-foreground">Weekly Vol.</div>
            </CardContent>
          </Card>
        </div>

        {/* Workout List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Workouts
          </h2>

          {sortedWorkouts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No workouts yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Complete your first session to start tracking your progress
                </p>
                <Button onClick={() => navigate('/program')}>
                  View Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedWorkouts.map((workout) => (
              <WorkoutHistoryCard key={workout.id} workout={workout} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

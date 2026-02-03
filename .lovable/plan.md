

# Add Angle Progress Indicator and Workout History Tracker

## Overview

This plan adds two features to enhance the fitness tracking experience:

1. **Angle Progress Indicator**: A visual gauge showing how close the current joint angle is to the optimal range for the exercise
2. **Workout History Tracker**: A dedicated page to view past workouts with detailed exercise logs

---

## Part 1: Angle Progress Indicator

### What It Does

During a workout, you'll see a visual gauge that shows:
- Your current joint angle
- The target "bottom" and "top" ranges for the exercise
- Real-time progress as you move through the range of motion
- Color-coded feedback (green when in optimal range, yellow/red when outside)

### Technical Implementation

#### New Component: `src/components/AngleProgressIndicator.tsx`

A reusable component that displays:
- A circular or linear progress gauge
- Current angle value
- Target range labels
- Visual color changes based on position in range

```text
Design:
  +--------------------------------------------+
  |  BOTTOM ◄========[●]============► TOP      |
  |   70°              115°              180°  |
  |          ░░░░░░███████████░░░░░░           |
  |                                            |
  |   Status: In Range ✓  |  Target: 70-100°  |
  +--------------------------------------------+
```

The indicator calculates:
- `progress = (currentAngle - minAngle) / (maxAngle - minAngle) * 100`
- Highlight zones: Bottom range (contracted), Top range (extended)
- Color: Green when in target zone, yellow approaching, red outside

#### Modify: `src/pages/Analysis.tsx`

Replace the simple angle text display with the new progress indicator:
- Show above or below the rep counter
- Update in real-time with the pose detection
- Animate smoothly between angle readings

#### Modify: `src/lib/repCounter.ts`

Export additional helper info:
- `getAngleProgress(currentAngle, config)`: Returns percentage and zone info
- `isInOptimalRange(currentAngle, phase)`: Boolean for form feedback

---

## Part 2: Workout History Tracker

### What It Does

A new page that shows:
- Calendar view of past workout days
- List of completed sessions with dates
- Detailed logs for each exercise (sets, reps, weight, difficulty)
- Summary statistics (total workouts, volume trends)

### Data Structure

The existing `GlobalContext` already tracks:
- `completedSessions`: Record of which sessions are done
- `exerciseLogs`: Details of each exercise completion

We need to add:
- `workoutHistory`: Array of completed workout entries with timestamps

#### New Type: `WorkoutHistoryEntry`

```typescript
interface WorkoutHistoryEntry {
  id: string;
  date: number; // timestamp
  weekNumber: number;
  sessionName: string;
  sessionType: SessionType;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    difficulty: 'easy' | 'moderate' | 'hard';
  }>;
  totalVolume: number; // sets × reps × weight
  duration?: number; // if tracked
}
```

### Files to Create/Modify

#### New File: `src/pages/History.tsx`

Main history page with:
- Header with "Workout History" title
- Summary cards (total workouts, current streak, volume this week)
- List of workout entries sorted by date (most recent first)
- Each entry expandable to show exercise details
- Empty state when no history

#### New File: `src/components/WorkoutHistoryCard.tsx`

Card component for each workout entry:
- Date and session name
- Quick stats (exercises completed, estimated volume)
- Expandable details section
- Difficulty rating visualization

#### Modify: `src/context/GlobalContext.tsx`

Add workout history state and functions:
- `workoutHistory: WorkoutHistoryEntry[]`
- `addWorkoutToHistory(entry: WorkoutHistoryEntry): void`
- `getWorkoutStats(): { totalWorkouts, currentStreak, weeklyVolume }`
- LocalStorage persistence with key `aurora_workout_history`

Update `markSessionComplete` to also create a history entry.

#### Modify: `src/App.tsx`

Add new route: `/history`

#### Modify: `src/pages/Program.tsx` (or Index.tsx)

Add navigation to History page (button or nav link).

---

## Implementation Details

### Angle Progress Indicator Logic

```typescript
function calculateAngleProgress(
  currentAngle: number,
  bottomRange: [number, number],
  topRange: [number, number]
): {
  progress: number; // 0-100
  zone: 'bottom' | 'middle' | 'top' | 'outside';
  inOptimalZone: boolean;
} {
  const minAngle = bottomRange[0];
  const maxAngle = topRange[1];
  const range = maxAngle - minAngle;
  
  const progress = ((currentAngle - minAngle) / range) * 100;
  
  const inBottom = currentAngle >= bottomRange[0] && currentAngle <= bottomRange[1];
  const inTop = currentAngle >= topRange[0] && currentAngle <= topRange[1];
  
  return {
    progress: Math.max(0, Math.min(100, progress)),
    zone: inBottom ? 'bottom' : inTop ? 'top' : progress < 50 ? 'middle' : 'outside',
    inOptimalZone: inBottom || inTop,
  };
}
```

### History Page Layout

```text
+----------------------------------+
|  ◄ Workout History               |
+----------------------------------+
|                                  |
|  [Total: 12] [Streak: 5] [Vol]  |
|                                  |
|  +----------------------------+  |
|  | Today - Push Day           |  |
|  | 6 exercises • 42 sets      |  |
|  | ▼ Expand                   |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Yesterday - Pull Day       |  |
|  | 5 exercises • 35 sets      |  |
|  | ▼ Expand                   |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | 2 days ago - Leg Day       |  |
|  | 7 exercises • 48 sets      |  |
|  | ▼ Expand                   |  |
|  +----------------------------+  |
+----------------------------------+
```

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/AngleProgressIndicator.tsx` | Create | Visual angle gauge component |
| `src/pages/History.tsx` | Create | Workout history page |
| `src/components/WorkoutHistoryCard.tsx` | Create | Individual workout card component |
| `src/pages/Analysis.tsx` | Modify | Add angle progress indicator |
| `src/context/GlobalContext.tsx` | Modify | Add history state and functions |
| `src/App.tsx` | Modify | Add /history route |
| `src/pages/Program.tsx` | Modify | Add History navigation button |

---

## Testing Checklist

After implementation:
- [ ] Angle indicator updates smoothly during exercise
- [ ] Color changes when entering/exiting optimal ranges
- [ ] Completing a session adds entry to history
- [ ] History page shows all past workouts
- [ ] Workout cards expand to show exercise details
- [ ] History persists after page refresh
- [ ] Empty state shows when no history exists


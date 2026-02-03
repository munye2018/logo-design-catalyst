

# Aurora Transformation Plan: Sprint Training to General Gym Fitness

## Overview

Transform Aurora from a sprint/athletics training app into a comprehensive gym fitness app with broader exercise support, enhanced coaching, and session progress tracking.

## Current State Summary

After testing the app end-to-end:
- Onboarding collects sprint-specific data (100m/200m/400m/800m events, race times)
- Program generates 20-week periodized sprint training (offseason, general, specific, preComp phases)
- Sessions include sprint drills: Hills, Extensive Tempo, Speed Endurance, etc.
- Movement Analysis supports only 7 exercises: Squat, Lunge, Box Jump, A-Skip, B-Skip, Calf Raise, Running Form
- Camera analysis with skeletal overlay is functional

---

## Phase 1: Redesign Onboarding Flow

### New Onboarding Steps

Replace the 4-step sprint-focused flow with a gym-focused flow:

**Step 1: Fitness Goal**
- Build Muscle (Hypertrophy)
- Lose Weight / Get Lean
- Build Strength
- General Fitness

**Step 2: Experience Level**
- Beginner (0-1 year)
- Intermediate (1-3 years)
- Advanced (3+ years)

**Step 3: Training Frequency**
- 2-3 days per week
- 4-5 days per week
- 6 days per week

**Step 4: Available Equipment**
- Full Gym
- Home Gym (Dumbbells + Bench)
- Minimal (Bodyweight + Resistance Bands)

### Files to Modify
- `src/pages/Onboarding.tsx` - Replace steps with new questions
- `src/context/GlobalContext.tsx` - Update user profile state (remove event/bestTime, add goal/experience/frequency/equipment)

---

## Phase 2: Expand Program Generator for Gym Workouts

### New Program Structure

Replace sprint periodization with gym training splits:

**Beginner Programs**
- Full Body 3x/week

**Intermediate Programs**
- Upper/Lower 4x/week
- Push/Pull/Legs 6x/week

**Session Types**
- Push Day (Chest, Shoulders, Triceps)
- Pull Day (Back, Biceps)
- Leg Day (Quads, Hamstrings, Glutes)
- Upper Body
- Lower Body
- Full Body

### New Exercise Library

Expand from 7 exercises to 50+ gym exercises organized by muscle group:

**Chest**: Bench Press, Incline Press, Dumbbell Fly, Push-ups, Cable Crossover
**Back**: Lat Pulldown, Barbell Row, Dumbbell Row, Pull-ups, Deadlift
**Shoulders**: Overhead Press, Lateral Raise, Face Pulls, Front Raise
**Arms**: Bicep Curls, Tricep Dips, Hammer Curls, Skull Crushers
**Legs**: Squat, Leg Press, Romanian Deadlift, Lunges, Leg Curl, Leg Extension, Calf Raise
**Core**: Plank, Russian Twist, Cable Crunch, Hanging Leg Raise

### Files to Modify
- `src/lib/programGenerator.ts` - Complete rewrite with gym-focused logic
- Create `src/lib/exerciseLibrary.ts` - Centralized exercise database with muscle groups, equipment, difficulty

---

## Phase 3: Enhanced Exercise Coaching & Form Analysis

### Expand Supported Exercises for Analysis

Add form rules for common gym exercises:

**Push Exercises**
- Bench Press: Bar path, elbow angle, shoulder blade retraction
- Overhead Press: Core bracing, bar path, full lockout

**Pull Exercises**
- Barbell Row: Back angle, rowing to hips, no momentum
- Lat Pulldown: Full stretch, squeeze at bottom, no swinging

**Leg Exercises**
- Squat (enhanced): Depth, knee tracking, hip hinge, bar position
- Deadlift: Neutral spine, hip hinge, bar path close to body
- Lunges (enhanced): Knee over ankle, torso upright, step length

**Core Exercises**
- Plank: Neutral spine, no hip sag, shoulder alignment

### Files to Modify
- `src/lib/exerciseRules.ts` - Add rules for 15-20 key compound movements
- Update `ExerciseType` type with new exercises

---

## Phase 4: Session Progress Tracking

### Add Exercise Completion State

Allow marking individual exercises as complete with logged data:
- Sets completed
- Reps performed
- Weight used (optional)
- Perceived difficulty (Easy/Moderate/Hard)

### Session Completion Flow

- Mark exercises complete individually via checkmark button
- "Complete Session" button marks entire session done
- Show session summary with total volume

### Track Progress Over Time

- Store completed sessions in context/localStorage
- Show completed sessions with visual indicator (green checkmark)
- Calculate weekly completion percentage

### Files to Modify
- `src/context/GlobalContext.tsx` - Add `completedExercises` state and `markExerciseComplete` action
- `src/pages/Session.tsx` - Add completion UI for exercises
- `src/lib/programGenerator.ts` - Add `loggedSets`, `loggedReps`, `loggedWeight` to Exercise type

---

## Phase 5: Update UI Copy & Branding

### Dashboard Updates
- Change "20-Week Plan" to "Your Training Plan"
- Update tagline from "AI-powered movement analysis for athletes" to "AI-powered form coaching for your workouts"
- Replace sprint-specific icons

### Remove Sprint References
- Remove "offseason", "preComp", etc. stage labels
- Remove pace/tempo terminology
- Remove distance-based targets

### Files to Modify
- `src/pages/Index.tsx` - Update copy and feature descriptions
- `src/pages/Program.tsx` - Update week labels
- `src/pages/Analysis.tsx` - Expand exercise selector

---

## Implementation Order

1. **GlobalContext.tsx** - Update user profile state first
2. **Onboarding.tsx** - New onboarding flow
3. **programGenerator.ts + exerciseLibrary.ts** - New program logic
4. **exerciseRules.ts** - Enhanced form analysis rules
5. **Session.tsx** - Progress tracking UI
6. **Index.tsx + Program.tsx + Analysis.tsx** - UI updates

---

## Technical Notes

### State Changes in GlobalContext

Remove:
- `event: number`
- `bestTime: number`

Add:
```typescript
fitnessGoal: 'muscle' | 'weight-loss' | 'strength' | 'general';
experienceLevel: 'beginner' | 'intermediate' | 'advanced';
trainingDays: 2 | 3 | 4 | 5 | 6;
equipment: 'full-gym' | 'home-gym' | 'minimal';
completedSessions: Record<string, boolean>;
exerciseLogs: Record<string, ExerciseLog>;
```

### Program Generator Changes

The new generator will:
1. Select appropriate split based on training days
2. Generate 8-12 week program (more realistic for gym users)
3. Include progressive overload hints
4. Match exercises to available equipment

### LocalStorage Persistence

Add persistence for:
- User profile
- Program state
- Completed sessions
- Exercise logs


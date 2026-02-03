

# Aurora Web App Conversion with AI Movement Analysis

## Overview

Converting the existing React Native sprint training app into a modern React web application, enhanced with computer vision capabilities to analyze body movements during exercises and provide real-time feedback for improved performance and safety.

## Current App Analysis

The existing app is a **sprint training program generator** with:
- **Onboarding flow**: Collects user sex, primary event (100m-800m), season's best time, and program type
- **Program generation**: Creates 20-week periodized training plans (offseason, general, specific, pre-competition phases)
- **Session tracking**: Displays exercises with pace targets, recovery times, and allows time logging
- **Exercise types**: Acceleration, max velocity, speed endurance, tempo runs, circuits, weight training

## New Feature: AI Movement Analysis

Using **TensorFlow.js with PoseNet/MoveNet** for browser-based pose estimation to:
1. Track 17 key body points (shoulders, elbows, hips, knees, ankles, etc.)
2. Analyze movement patterns during exercises
3. Provide real-time visual feedback with skeleton overlay
4. Generate form corrections and safety recommendations

---

## Project Architecture

```text
src/
+-- components/
|   +-- analysis/
|   |   +-- CameraView.tsx          # Webcam feed with pose overlay
|   |   +-- PoseAnalyzer.tsx        # Movement analysis logic
|   |   +-- FeedbackPanel.tsx       # Real-time form corrections
|   |   +-- ExerciseSelector.tsx    # Choose exercise to analyze
|   +-- layout/
|   |   +-- Navbar.tsx
|   |   +-- Sidebar.tsx
|   +-- onboarding/
|   |   +-- SexStep.tsx
|   |   +-- EventStep.tsx
|   |   +-- TimeStep.tsx
|   |   +-- ProgramStep.tsx
|   +-- program/
|   |   +-- WeekIndicator.tsx
|   |   +-- SessionCard.tsx
|   |   +-- ExerciseCard.tsx
|   +-- session/
|   |   +-- SessionView.tsx
|   |   +-- TimeLogger.tsx
+-- context/
|   +-- GlobalContext.tsx           # Shared state (adapted from existing)
+-- hooks/
|   +-- usePoseDetection.ts         # TensorFlow.js pose detection hook
|   +-- useMovementAnalysis.ts      # Exercise-specific analysis
+-- lib/
|   +-- poseAnalysis.ts             # Pose analysis algorithms
|   +-- exerciseRules.ts            # Form rules per exercise type
|   +-- programGenerator.ts         # Adapted from existing models
+-- pages/
|   +-- Index.tsx                   # Landing/Dashboard
|   +-- Onboarding.tsx              # Multi-step onboarding
|   +-- Program.tsx                 # Weekly program view
|   +-- Session.tsx                 # Session exercises
|   +-- Analysis.tsx                # Movement analysis camera view
```

---

## Implementation Phases

### Phase 1: Web App Foundation

**Files to create:**

1. **index.html** - Entry point with viewport meta tags
2. **vite.config.ts** - Vite configuration for React/TypeScript
3. **src/main.tsx** - React app entry
4. **src/App.tsx** - Root component with routing
5. **tailwind.config.ts** - Tailwind configuration
6. **src/index.css** - Global styles with Tailwind imports

**Key changes:**
- Replace React Native components with standard HTML/React components
- Convert StyleSheet to Tailwind CSS classes
- Replace expo-router with react-router-dom
- Remove expo-navigation-bar and other native-only packages

### Phase 2: Context & State Migration

**Adapt GlobalContext.tsx:**
- Keep the same state structure (sex, event, bestTime, program, week, session)
- Add new state for analysis mode and pose data
- Properly type all state with TypeScript interfaces

**New types:**
```typescript
interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

interface AnalysisFeedback {
  message: string;
  severity: 'info' | 'warning' | 'error';
  bodyPart: string;
}
```

### Phase 3: Onboarding Flow

Convert each onboarding screen to web components:

| React Native Screen | Web Component |
|---------------------|---------------|
| `sex.tsx` | `SexStep.tsx` |
| `event.tsx` | `EventStep.tsx` |
| `time.tsx` | `TimeStep.tsx` |
| `program.tsx` | `ProgramStep.tsx` |

**Approach:**
- Single-page multi-step form with progress indicator
- Use shadcn/ui Button, Card, Input components
- Maintain the same user flow

### Phase 4: Program & Session Views

Convert the training program display:

1. **WeekIndicator** - Horizontal week selector (keep existing logic)
2. **SessionCard** - Display daily sessions with progress bar
3. **ExerciseCard** - Individual exercise with pace targets and time logging

**Key features preserved:**
- 20-week periodized program
- Stage-based training (offseason, general, specific, pre-comp)
- Exercise details (distance, reps, pace %, recovery time)
- Time logging with hand/electronic toggle

### Phase 5: Computer Vision - Movement Analysis

**TensorFlow.js MoveNet Integration:**

The MoveNet model (Lightning variant) runs entirely in the browser and detects 17 keypoints:
- nose, left/right eye, left/right ear
- left/right shoulder, left/right elbow, left/right wrist
- left/right hip, left/right knee, left/right ankle

**Hook: usePoseDetection.ts**
```typescript
// Initializes TensorFlow.js and MoveNet
// Handles webcam stream
// Returns real-time pose keypoints
// Runs at ~30fps on modern hardware
```

**Hook: useMovementAnalysis.ts**
```typescript
// Takes pose data and current exercise type
// Applies exercise-specific rules
// Returns feedback messages
```

**Exercise-Specific Analysis Rules:**

| Exercise | Key Angles/Positions | Feedback Examples |
|----------|---------------------|-------------------|
| **Squats** | Knee angle, hip depth, spine alignment | "Keep your knees behind your toes", "Lower your hips further" |
| **Lunges** | Front knee angle, back knee height, torso upright | "Step further forward", "Keep your torso upright" |
| **Box Jumps** | Hip/knee flex on landing, arm position | "Soft landing - bend your knees more" |
| **Russian Twists** | Shoulder rotation, hip stability | "Rotate from your core, not shoulders" |
| **Calf Raises** | Ankle extension, balance | "Rise higher on your toes", "Keep weight centered" |
| **A-Skips/B-Skips** | Knee drive height, arm swing, posture | "Drive your knee higher", "Pump arms opposite to legs" |

**Analysis Page Flow:**
1. User selects exercise from current session
2. Camera activates with permission prompt
3. Real-time skeleton overlay appears on video
4. Feedback panel shows corrections
5. Option to record and review movement

---

## Dependencies to Add

```json
{
  "@tensorflow/tfjs": "^4.22.0",
  "@tensorflow-models/pose-detection": "^2.1.3",
  "react-router-dom": "^6.28.0",
  "react-webcam": "^7.2.0",
  "@tanstack/react-query": "^5.62.0",
  "lucide-react": "^0.469.0"
}
```

Plus existing Lovable stack: shadcn/ui, Tailwind CSS, TypeScript, Vite

---

## UI/UX Design

**Color Palette (from existing theme):**
- Primary: #181818 (dark charcoal)
- Secondary: #f0f0f0 (light gray background)
- Accent: #007AFF (blue for CTAs)
- Success: #77DD77 (green for good form)
- Warning: #EDC966 (yellow for minor corrections)
- Error: #FF6961 (red for safety concerns)

**Key Screens:**

1. **Dashboard** - Today's session, quick start analysis, weekly progress
2. **Program View** - Week selector, 7-day session cards
3. **Session View** - Exercise list with start/log buttons
4. **Analysis View** - Full-screen camera with skeleton overlay and feedback panel

---

## Technical Considerations

### Performance
- MoveNet Lightning runs at 30+ FPS on most devices
- Use Web Workers for heavy analysis to prevent UI blocking
- Throttle feedback updates to prevent overwhelming the user

### Privacy
- All processing happens client-side (no video sent to servers)
- Camera permission is explicitly requested
- No recordings stored unless user opts in

### Browser Compatibility
- Modern Chrome, Firefox, Safari, Edge
- WebGL required for TensorFlow.js
- Fallback message for unsupported browsers

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `index.html` | HTML entry point |
| Create | `vite.config.ts` | Vite configuration |
| Create | `src/main.tsx` | React app bootstrap |
| Create | `src/App.tsx` | Root component with routing |
| Create | `src/pages/Index.tsx` | Dashboard/landing |
| Create | `src/pages/Onboarding.tsx` | Multi-step onboarding |
| Create | `src/pages/Program.tsx` | Weekly program view |
| Create | `src/pages/Session.tsx` | Session exercises |
| Create | `src/pages/Analysis.tsx` | Movement analysis view |
| Create | `src/context/GlobalContext.tsx` | Adapted state management |
| Create | `src/hooks/usePoseDetection.ts` | TensorFlow pose detection |
| Create | `src/hooks/useMovementAnalysis.ts` | Exercise analysis rules |
| Create | `src/lib/programGenerator.ts` | Adapted program logic |
| Create | `src/lib/exerciseRules.ts` | Form correction rules |
| Create | `src/components/analysis/*` | Camera and feedback components |
| Create | `src/components/program/*` | Program display components |
| Delete/Archive | `app/` folder | React Native specific |
| Delete/Archive | Expo config files | Not needed for web |

---

## Success Criteria

After implementation, users will be able to:

1. Complete onboarding and generate a personalized training program
2. View their weekly training schedule with session details
3. Start any session and log their times for speed work
4. Activate the camera for any exercise to get real-time form feedback
5. See a skeleton overlay tracking their body position
6. Receive actionable feedback like "Drive your knee higher" or "Keep your back straight"
7. Improve their exercise form and reduce injury risk


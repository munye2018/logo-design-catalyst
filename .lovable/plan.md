

# Fix Pose Detection & Enhance Form Analysis

## Problem Analysis

The AI model fails to initialize with `"module is not defined"` error. This occurs because:
1. TensorFlow.js has dependencies (like `long`) that use CommonJS format
2. Vite's ESM bundling doesn't handle these CommonJS modules correctly by default
3. The WebGPU backend is being imported but may not be supported in all browsers

## Solution

### Part 1: Fix TensorFlow.js Initialization

**File: `vite.config.ts`**

Update Vite configuration to properly handle TensorFlow.js CommonJS dependencies:
- Add CommonJS compatibility for TensorFlow dependencies
- Configure `optimizeDeps.include` to pre-bundle TensorFlow packages
- Add `esbuildOptions` to handle CommonJS modules

**File: `src/hooks/usePoseDetection.ts`**

Make the initialization more robust:
- Add fallback backend selection (WebGL -> CPU)
- Add better error handling with specific error messages
- Ensure proper async/await handling for dynamic imports
- Add a retry mechanism if initial load fails

### Part 2: Fix Canvas Overlay Positioning

**File: `src/pages/Analysis.tsx`**

Ensure the skeleton overlay displays correctly on the webcam:
- The canvas dimensions need to match the video element dynamically
- Add a `ResizeObserver` to update canvas size when video loads
- Fix the `pose-canvas` CSS to properly scale with the video

**File: `src/index.css`**

Verify the `.pose-canvas` styles properly overlay the webcam feed with correct scaling.

### Part 3: Add Rep Counting with Optimal Angles

**New File: `src/lib/repCounter.ts`**

Create a rep counting system that tracks:
- Exercise-specific joint angles for "top" and "bottom" of movement
- State machine: `idle` -> `descending` -> `bottom` -> `ascending` -> `top` -> rep complete
- Optimal angle ranges per exercise

**Angle definitions for key exercises:**

| Exercise | Joint | Bottom Angle | Top Angle |
|----------|-------|--------------|-----------|
| Squat | Knee | 70-90 degrees | 160-180 degrees |
| Deadlift | Hip | 80-100 degrees | 170-180 degrees |
| Bench Press | Elbow | 80-100 degrees | 160-180 degrees |
| Overhead Press | Elbow | 80-100 degrees | 170-180 degrees |
| Bicep Curl | Elbow | 40-60 degrees | 150-170 degrees |
| Lunge | Front Knee | 80-100 degrees | 160-180 degrees |
| Push-up | Elbow | 80-100 degrees | 160-180 degrees |
| Lat Pulldown | Elbow | 40-60 degrees | 140-160 degrees |

**File: `src/hooks/usePoseDetection.ts`**

Integrate rep counting:
- Add `repCount` to the return value
- Track movement phase based on angle thresholds
- Fire rep completion when full range of motion detected

**File: `src/pages/Analysis.tsx`**

Display rep counter:
- Show current rep count prominently on screen
- Visual feedback when rep is completed (flash effect)
- Display current joint angle for the selected exercise

---

## Implementation Details

### Vite Config Changes

```typescript
optimizeDeps: {
  include: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-core',
    '@tensorflow/tfjs-backend-webgl',
    '@tensorflow-models/pose-detection',
  ],
  esbuildOptions: {
    define: {
      global: 'globalThis',
    },
  },
},
```

### Rep Counter State Machine

```text
           +-------+
           | IDLE  |
           +---+---+
               |
               v (angle decreasing past threshold)
        +------+------+
        | DESCENDING  |
        +------+------+
               |
               v (angle reaches bottom range)
        +------+------+
        |   BOTTOM    |
        +------+------+
               |
               v (angle increasing)
        +------+------+
        |  ASCENDING  |
        +------+------+
               |
               v (angle reaches top range)
        +------+------+
        |    TOP      +-----> Rep Counted!
        +------+------+
               |
               v
           +---+---+
           | IDLE  | (ready for next rep)
           +-------+
```

### Exercise Angle Configurations

Each exercise will have a configuration object:

```typescript
interface ExerciseConfig {
  primaryJoints: {
    point1: string; // shoulder
    point2: string; // elbow (vertex)
    point3: string; // wrist
  };
  bottomAngleRange: [number, number]; // [min, max]
  topAngleRange: [number, number];
  repDirection: 'down-up' | 'up-down'; // squat vs overhead press
}
```

---

## Files to Modify

1. **`vite.config.ts`** - Fix CommonJS compatibility for TensorFlow
2. **`src/hooks/usePoseDetection.ts`** - Robust initialization + rep counting
3. **`src/lib/repCounter.ts`** (new) - Rep counting logic with angle tracking
4. **`src/pages/Analysis.tsx`** - Display rep count and current angles
5. **`src/lib/exerciseRules.ts`** - Add optimal angle constants per exercise

---

## Testing Checklist

After implementation:
- Camera starts without "Failed to initialize" error
- Skeleton overlay appears on webcam feed
- Selecting different exercises changes the form rules
- Rep counter increments when completing full range of motion
- Form feedback appears based on exercise-specific rules


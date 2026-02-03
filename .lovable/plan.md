
# Implementation Plan: Audio Feedback + Security Fixes

## Overview

This plan adds audio feedback for completed reps and removes unused Expo/React Native dependencies to fix the security vulnerability.

---

## Part 1: Add Audio Rep Feedback

### Approach

Use the Web Audio API to generate simple audio tones when:
1. A rep is completed (success sound)
2. Optionally: Form correction warnings (warning sound)

This approach avoids external dependencies or audio file loading.

### New File: `src/lib/audioFeedback.ts`

Create an audio feedback utility using Web Audio API:

```typescript
class AudioFeedback {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  
  // Initialize AudioContext (lazy, on first user interaction)
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }
  
  // Play rep completion sound (short success beep)
  playRepComplete(): void
  
  // Play warning sound for form issues
  playWarning(): void
  
  // Toggle audio on/off
  setEnabled(enabled: boolean): void
}
```

**Sound Design:**
- **Rep Complete**: Short ascending two-tone beep (440Hz → 880Hz, 100ms total)
- **Warning**: Single lower tone (330Hz, 150ms) for form corrections

### Modify: `src/hooks/usePoseDetection.ts`

Add callback for rep completion events:

```typescript
// Add to hook parameters
onRepComplete?: () => void;

// Call when rep is counted
if (newRepState.repCount > previousRepCount) {
  onRepComplete?.();
}
```

### Modify: `src/pages/Analysis.tsx`

1. Import and initialize audio feedback
2. Pass `onRepComplete` callback to `usePoseDetection`
3. Add audio toggle button to UI

```typescript
import { audioFeedback } from '@/lib/audioFeedback';

// In component:
const [audioEnabled, setAudioEnabled] = useState(true);

const handleRepComplete = useCallback(() => {
  if (audioEnabled) {
    audioFeedback.playRepComplete();
  }
}, [audioEnabled]);

// Pass to hook:
const { ... } = usePoseDetection({
  webcamRef,
  canvasRef,
  enabled: cameraEnabled,
  exerciseType: selectedExercise,
  onRepComplete: handleRepComplete,
});
```

### UI Changes

Add a speaker/mute toggle button near the rep counter:
- Volume2 icon when enabled
- VolumeX icon when muted
- Tooltip: "Toggle audio feedback"

---

## Part 2: Fix Security Vulnerability

### Problem

The project contains unused Expo and React Native packages which introduce a supply chain vulnerability in `expo@~52.0.17`.

### Solution

Remove all Expo and React Native dependencies since this is a Vite web-only application.

### Modify: `package.json`

Remove these dependencies:

**Dependencies to remove:**
- `@expo/vector-icons`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native`
- `expo`
- `expo-blur`
- `expo-constants`
- `expo-font`
- `expo-haptics`
- `expo-linking`
- `expo-navigation-bar`
- `expo-router`
- `expo-splash-screen`
- `expo-status-bar`
- `expo-symbols`
- `expo-system-ui`
- `expo-web-browser`
- `react-native`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `react-native-screens`
- `react-native-web`
- `react-native-webview`

**DevDependencies to remove:**
- `jest-expo`
- `react-test-renderer`
- `@types/react-test-renderer`

**Also update:**
- Remove `"main": "expo-router/entry"` field
- Remove `"jest"` configuration block

### Files to Delete

- `app.json` (Expo configuration - no longer needed)

---

## Implementation Order

1. **`src/lib/audioFeedback.ts`** (new) - Audio utility class
2. **`src/hooks/usePoseDetection.ts`** - Add onRepComplete callback
3. **`src/pages/Analysis.tsx`** - Integrate audio + add toggle button
4. **`package.json`** - Remove unused dependencies
5. **Delete `app.json`** - Remove Expo config

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/audioFeedback.ts` | Create | Web Audio API feedback |
| `src/hooks/usePoseDetection.ts` | Modify | Add rep completion callback |
| `src/pages/Analysis.tsx` | Modify | Audio toggle UI + integration |
| `package.json` | Modify | Remove 24 unused dependencies |
| `app.json` | Delete | Expo config no longer needed |

---

## Testing Checklist

After implementation:
- [ ] Audio plays when completing a rep (squat, curl, etc.)
- [ ] Audio can be muted via toggle button
- [ ] Build succeeds without Expo dependencies
- [ ] No new security vulnerabilities reported
- [ ] Pose detection still works as expected

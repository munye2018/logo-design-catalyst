/**
 * Audio Feedback Utility
 * Uses Web Audio API to generate audio tones for workout feedback
 */

class AudioFeedback {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  /**
   * Get or create AudioContext (lazy initialization)
   * Must be called after user interaction due to browser autoplay policies
   */
  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('[AudioFeedback] Failed to create AudioContext:', error);
        return null;
      }
    }
    
    // Resume if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  /**
   * Play a tone at specified frequency and duration
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope for smooth attack/release
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  /**
   * Play rep completion sound
   * Short ascending two-tone beep (success sound)
   */
  playRepComplete(): void {
    if (!this.enabled) return;
    
    const ctx = this.getContext();
    if (!ctx) return;

    // First tone: 440Hz
    this.playTone(440, 0.08);
    
    // Second tone: 880Hz (one octave higher) after short delay
    setTimeout(() => {
      this.playTone(880, 0.12);
    }, 60);
  }

  /**
   * Play warning sound for form issues
   * Lower single tone
   */
  playWarning(): void {
    if (!this.enabled) return;
    this.playTone(330, 0.15, 'triangle');
  }

  /**
   * Play error sound for serious form problems
   * Two descending tones
   */
  playError(): void {
    if (!this.enabled) return;
    
    this.playTone(440, 0.1, 'sawtooth');
    setTimeout(() => {
      this.playTone(220, 0.15, 'sawtooth');
    }, 80);
  }

  /**
   * Enable or disable audio feedback
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if audio is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Clean up AudioContext
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const audioFeedback = new AudioFeedback();

/**
 * Web Audio API Sound Synthesizer for Cat Cafe LianLianKan
 * Pure synthesis with zero external audio assets.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public bgmEnabled: boolean = false;
  private bgmIntervalId: number | null = null;
  private pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public ensureContext(): void {
    this.getContext();
  }

  /**
   * Tile click / tap
   */
  public playSelect(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Tile deselect
   */
  public playDeselect(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Invalid connection thud
   */
  public playInvalid(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.setValueAtTime(130, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Successful Match! Bright chime with combo pitch scaling.
   */
  public playMatch(combo: number = 0): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitchMultiplier = Math.min(2.0, 1 + combo * 0.12);

    // Warm marimba/bell arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50].map(f => f * pitchMultiplier);

    freqs.forEach((freq, index) => {
      const startTime = now + index * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, startTime + 0.15);

      gain.gain.setValueAtTime(0.16, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.21);
    });

    if (combo >= 2) {
      setTimeout(() => this.playPurr(), 60);
    }
  }

  /**
   * Ice block cracking / shattering effect
   */
  public playIceCrack(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [1200, 1800, 2400, 3200].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.015);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + idx * 0.015 + 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.015 + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.015);
      osc.stop(now + idx * 0.015 + 0.1);
    });
  }

  /**
   * Cute synthesized Cat "Meow" / "Purr"
   */
  public playMeow(pitchOffset: number = 0): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const base = 480 + pitchOffset;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Meow frequency contour: rise then gentle fall
    osc.frequency.setValueAtTime(base * 0.85, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.35, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(base, now + 0.22);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Soft Cat Purr / Rumble
   */
  public playPurr(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);

    // Amplitude modulation for purring rumble
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  /**
   * Coin Earned / Tip Jar Collect
   */
  public playCoin(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [987.77, 1318.51].forEach((freq, idx) => {
      const t = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  /**
   * Freeze / Time Pause power-up sound
   */
  public playFreeze(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [1046.5, 1318.51, 1567.98, 2093.0];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  /**
   * Renovation Unlock / Upgrade Fanfare
   */
  public playRenovate(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.42);
    });
  }

  /**
   * Hint used
   */
  public playHint(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [659.25, 783.99, 987.77, 1174.66, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    });
  }

  /**
   * Shuffle used
   */
  public playShuffle(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 + Math.random() * 300, t);
      osc.frequency.exponentialRampToValueAtTime(750, t + 0.05);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    }
  }

  /**
   * Level Victory Fanfare
   */
  public playVictory(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [
      { notes: [523.25, 659.25], delay: 0.0, dur: 0.16 },
      { notes: [587.33, 739.99], delay: 0.16, dur: 0.16 },
      { notes: [659.25, 830.61], delay: 0.32, dur: 0.2 },
      { notes: [783.99, 987.77, 1318.51], delay: 0.52, dur: 0.75 },
    ];

    const now = ctx.currentTime;
    chords.forEach(item => {
      item.notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + item.delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + item.dur + 0.05);
      });
    });
  }

  /**
   * Level Game Over
   */
  public playGameOver(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 392, 349.23, 293.66];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.2;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  /**
   * Ambient Lo-Fi Chill Synthesizer BGM
   */
  public toggleBgm(enabled?: boolean): boolean {
    if (enabled !== undefined) {
      this.bgmEnabled = enabled;
    } else {
      this.bgmEnabled = !this.bgmEnabled;
    }

    if (this.bgmEnabled) {
      this.startBgmLoop();
    } else {
      this.stopBgmLoop();
    }
    return this.bgmEnabled;
  }

  private startBgmLoop(): void {
    this.stopBgmLoop();
    this.playAmbientChime();
    this.bgmIntervalId = window.setInterval(() => {
      if (this.bgmEnabled) {
        this.playAmbientChime();
      }
    }, 3200);
  }

  private stopBgmLoop(): void {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  private playAmbientChime(): void {
    if (!this.bgmEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const note1 = this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];
    const note2 = this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];

    const now = ctx.currentTime;
    [note1, note2].forEach((freq, idx) => {
      const t = now + idx * 0.32;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.9);
    });
  }
}

export const sound = new SoundController();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let isUnlocked = false;

export function unlockAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        isUnlocked = true;
      }).catch(() => {});
    } else {
      isUnlocked = true;
    }

    // Play a tiny 1-sample silent buffer synchronously inside the gesture event loop
    // to unlock iOS Safari & WebAudio engine
    try {
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    } catch (e) {
      // Ignore
    }
  }

  return audioCtx;
}

// Global user-gesture listeners attached to window on load to unlock AudioContext
// on the very first tap/click anywhere on iPhone Safari, Chrome, or iPad.
if (typeof window !== 'undefined') {
  const handleUserGesture = () => {
    unlockAudio();
    if (audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('touchstart', handleUserGesture, true);
      window.removeEventListener('touchend', handleUserGesture, true);
      window.removeEventListener('pointerdown', handleUserGesture, true);
      window.removeEventListener('click', handleUserGesture, true);
    }
  };

  window.addEventListener('touchstart', handleUserGesture, true);
  window.addEventListener('touchend', handleUserGesture, true);
  window.addEventListener('pointerdown', handleUserGesture, true);
  window.addEventListener('click', handleUserGesture, true);
}

let pageTurnBuffer: AudioBuffer | null = null;

function getPageTurnBuffer(ctx: AudioContext): AudioBuffer {
  if (pageTurnBuffer && pageTurnBuffer.sampleRate === ctx.sampleRate) {
    return pageTurnBuffer;
  }
  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
  }
  pageTurnBuffer = buffer;
  return buffer;
}

export const playSound = (
  type: 'pageTurn' | 'chime' | 'click',
  soundEnabled: boolean = true,
  isRecordingOrSpeaking: boolean = false
) => {
  if (!soundEnabled || isRecordingOrSpeaking) return;

  try {
    const ctx = unlockAudio();
    if (!ctx) return;

    const renderSound = () => {
      const now = ctx.currentTime + 0.005; // 5ms buffer for precision iOS scheduling

      if (type === 'click') {
        // Crisp, gentle click/tap (40ms sine decay)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        gain.gain.value = 0.0001; // Set property explicitly before scheduling ramps
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.04);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'pageTurn') {
        // Crisp paper sweep / rustle for narrative advance
        try {
          const buffer = getPageTurnBuffer(ctx);
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1100, now);
          filter.frequency.linearRampToValueAtTime(360, now + 0.12);
          filter.Q.value = 1.1;

          const gain = ctx.createGain();
          gain.gain.value = 0.0001;
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
          noise.stop(now + 0.125);
        } catch (e) {
          // Robust fallback oscillator sweep if buffer creation fails on Safari
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.0001;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.125);
        }
      } else if (type === 'chime') {
        // Positive celebration chime (warm C5-E5-G5-C6 arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          gain.gain.value = 0.0001;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          const duration = 0.25;

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(0.18, startTime + 0.025);
          gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration + 0.01);
        });
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        renderSound();
      }).catch(() => {});
    } else {
      renderSound();
    }
  } catch (err) {
    // Fail silently
  }
};

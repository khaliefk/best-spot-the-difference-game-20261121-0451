// Small synthesised sounds, made with the Web Audio API at run time.
// No audio files, no network: every note is an oscillator started here.
let context = null;
let muted = false;

function audioContext() {
  if (context === null) {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(frequency, startAt, length, type, volume) {
  const ctx = audioContext();
  if (ctx === null || muted) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + length);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + length + 0.05);
}

export function playFound() {
  tone(659.25, 0, 0.16, 'sine', 0.22);
  tone(880.0, 0.09, 0.24, 'sine', 0.22);
}

export function playWrong() {
  tone(110.0, 0, 0.22, 'square', 0.1);
  tone(98.0, 0.12, 0.26, 'square', 0.08);
}

export function playHint() {
  tone(1046.5, 0, 0.12, 'sine', 0.14);
}

export function playLevelClear() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((frequency, index) => tone(frequency, index * 0.11, 0.3, 'triangle', 0.2));
}

export function playGameOver() {
  const notes = [392.0, 329.63, 261.63];
  notes.forEach((frequency, index) => tone(frequency, index * 0.16, 0.34, 'triangle', 0.16));
}

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  return muted;
}

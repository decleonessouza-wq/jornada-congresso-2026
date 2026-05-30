let _ctx = null;
function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

function tone(freq, start, duration, type = 'sine', vol = 0.25) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    gain.gain.setValueAtTime(vol, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration + 0.01);
  } catch(e) {}
}

export function playCorrect() {
  tone(523, 0, 0.08);
  tone(659, 0.09, 0.08);
  tone(784, 0.18, 0.18);
}

export function playWrong() {
  tone(220, 0, 0.12, 'sawtooth', 0.15);
  tone(180, 0.13, 0.18, 'sawtooth', 0.1);
}

export function playCelebrate() {
  [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.15));
}

export function playClick() {
  tone(660, 0, 0.04, 'sine', 0.08);
}

export function playUnlock() {
  tone(440, 0, 0.1);
  tone(554, 0.1, 0.1);
  tone(659, 0.2, 0.2);
}

export function playSplash() {
  // Fanfare - ascending triumphant chord
  tone(523, 0,    0.15, 'sine', 0.25); // C
  tone(659, 0.15, 0.15, 'sine', 0.25); // E
  tone(784, 0.3,  0.15, 'sine', 0.25); // G
  tone(1047,0.45, 0.3,  'sine', 0.3);  // C high
  tone(523, 0,    0.45, 'sine', 0.1);  // chord low C
  tone(659, 0,    0.45, 'sine', 0.1);  // chord E
  tone(784, 0,    0.45, 'sine', 0.1);  // chord G
}

export function playPageTransition() {
  tone(440, 0, 0.06, 'sine', 0.06);
  tone(554, 0.07, 0.06, 'sine', 0.06);
}

export function playWordSolved() {
  tone(880, 0, 0.07, 'sine', 0.2);
  tone(1109,0.08, 0.07, 'sine', 0.2);
  tone(1319,0.16, 0.15, 'sine', 0.25);
}

export function playWordWrong() {
  tone(300, 0, 0.1, 'triangle', 0.15);
}

export function playNavClick() {
  tone(600, 0, 0.04, 'sine', 0.07);
}
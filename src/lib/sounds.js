let audioContext = null;

function canUseAudio() {
  return typeof window !== "undefined" && Boolean(window.AudioContext || window.webkitAudioContext);
}

function getCtx() {
  if (!canUseAudio()) return null;

  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextConstructor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function tone(freq, start, duration, type = "sine", vol = 0.18) {
  try {
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(vol, now + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.03);
  } catch {
    // Sons são melhoria de experiência. Nunca devem quebrar o app.
  }
}

export function unlockAudio() {
  try {
    const ctx = getCtx();
    if (ctx?.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  } catch {
    // Ignora bloqueios do navegador.
  }
}

export function playCorrect() {
  unlockAudio();
  tone(523, 0, 0.08, "sine", 0.16);
  tone(659, 0.08, 0.08, "sine", 0.16);
  tone(784, 0.16, 0.16, "sine", 0.18);
}

export function playWrong() {
  unlockAudio();
  tone(220, 0, 0.1, "triangle", 0.1);
  tone(180, 0.1, 0.16, "triangle", 0.08);
}

export function playCelebrate() {
  unlockAudio();
  [523, 659, 784, 1047, 1319].forEach((freq, index) => {
    tone(freq, index * 0.08, 0.14, "sine", 0.16);
  });
}

export function playComplete() {
  unlockAudio();
  [392, 523, 659, 784, 1047, 1319, 1568].forEach((freq, index) => {
    tone(freq, index * 0.07, 0.16, "sine", 0.18);
  });
}

export function playClick() {
  unlockAudio();
  tone(660, 0, 0.04, "sine", 0.06);
}

export function playUnlock() {
  unlockAudio();
  tone(440, 0, 0.08, "sine", 0.12);
  tone(554, 0.08, 0.08, "sine", 0.12);
  tone(659, 0.16, 0.16, "sine", 0.14);
}

export function playSplash() {
  unlockAudio();
  tone(523, 0, 0.12, "sine", 0.14);
  tone(659, 0.12, 0.12, "sine", 0.14);
  tone(784, 0.24, 0.12, "sine", 0.14);
  tone(1047, 0.36, 0.22, "sine", 0.16);
}

export function playPageTransition() {
  unlockAudio();
  tone(440, 0, 0.05, "sine", 0.05);
  tone(554, 0.06, 0.05, "sine", 0.05);
}

export function playWordSolved() {
  unlockAudio();
  tone(880, 0, 0.07, "sine", 0.16);
  tone(1109, 0.08, 0.07, "sine", 0.16);
  tone(1319, 0.16, 0.15, "sine", 0.18);
}

export function playWordWrong() {
  unlockAudio();
  tone(300, 0, 0.1, "triangle", 0.09);
}

export function playNavClick() {
  playClick();
}
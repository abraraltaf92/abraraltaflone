// Writes reel/music.wav: an original 18-second backing track for the showreel, made from
// plain sine waves and noise so there is nothing to license.
//
//   node reel/music.cjs
//
// 120 beats a minute, so one beat is half a second and the piece is nine bars long.
// Chords change every two bars: C major 7, A minor 7, F major 7, G, then C to finish.
const fs = require("node:fs");
const path = require("node:path");

const RATE = 48000;
const SECONDS = 18;
const BEAT = 0.5;
const N = RATE * SECONDS;
const left = new Float32Array(N);
const right = new Float32Array(N);

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

/** Adds one note. `shape(t, d)` gives its loudness at t seconds into a note d seconds long. */
function note({ at, dur, midi, gain, pan = 0, shape, partials = [1] }) {
  const start = Math.round(at * RATE);
  const count = Math.round(dur * RATE);
  const f = hz(midi);
  const l = Math.cos(((pan + 1) * Math.PI) / 4);
  const r = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < count && start + i < N; i++) {
    const t = i / RATE;
    let s = 0;
    for (let k = 0; k < partials.length; k++) s += partials[k] * Math.sin(2 * Math.PI * f * (k + 1) * t);
    s *= gain * shape(t, dur);
    left[start + i] += s * l;
    right[start + i] += s * r;
  }
}

const swell = (t, d) => Math.min(1, t / 0.6) * Math.min(1, (d - t) / 0.8);
const pluck = (t) => Math.min(1, t / 0.004) * Math.exp(-t * 7);
const thump = (t) => Math.min(1, t / 0.01) * Math.exp(-t * 3.5);

// Two bars each, except the last chord, which holds for one bar and rings out.
const chords = [
  { root: 36, tones: [60, 64, 67, 71] }, // C major 7
  { root: 33, tones: [57, 60, 64, 67] }, // A minor 7
  { root: 29, tones: [53, 57, 60, 64] }, // F major 7
  { root: 31, tones: [55, 59, 62, 67] }, // G
  { root: 36, tones: [60, 64, 67, 72] }, // C
];

chords.forEach((chord, c) => {
  const at = c * 8 * BEAT;
  const last = c === chords.length - 1;
  const dur = last ? SECONDS - at : 8 * BEAT + 0.6;

  // Pad: the chord held softly, spread a little left and right.
  chord.tones.forEach((midi, i) => {
    note({ at, dur, midi, gain: 0.05, pan: (i - 1.5) * 0.4, shape: swell, partials: [1, 0.3, 0.1] });
  });

  // Bass: the root on the first beat of each bar and a push before the third.
  const bars = last ? 1 : 2;
  for (let bar = 0; bar < bars; bar++) {
    for (const beat of [0, 2.5]) {
      note({ at: at + (bar * 4 + beat) * BEAT, dur: 1.2, midi: chord.root, gain: 0.22, shape: thump, partials: [1, 0.25] });
    }
  }

  // Plucked notes: eighth notes walking up and down the chord an octave higher,
  // each followed by two quieter echoes on the other side.
  if (!last) {
    const order = [0, 1, 2, 3, 2, 1, 2, 3];
    for (let step = 0; step < 16; step++) {
      const midi = chord.tones[order[step % 8]] + 12;
      const when = at + step * BEAT * 0.5;
      const pan = step % 2 ? 0.5 : -0.5;
      note({ at: when, dur: 0.9, midi, gain: 0.085, pan, shape: pluck, partials: [1, 0.4, 0.12] });
      note({ at: when + BEAT * 0.75, dur: 0.9, midi, gain: 0.03, pan: -pan, shape: pluck, partials: [1, 0.3] });
      note({ at: when + BEAT * 1.5, dur: 0.9, midi, gain: 0.012, pan, shape: pluck });
    }
  } else {
    [0, 1, 2, 3].forEach((i) => {
      note({ at: at + i * 0.09, dur: 2, midi: chord.tones[i] + 12, gain: 0.09, pan: (i - 1.5) * 0.4, shape: (t) => Math.exp(-t * 2.2), partials: [1, 0.4, 0.12] });
    });
  }
});

// Drums come in at the second bar and stop before the last chord rings out.
let seed = 1;
const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 31) - 1;
for (let beat = 4; beat < 32; beat++) {
  // Kick: a sine that drops quickly in pitch.
  const k0 = Math.round(beat * BEAT * RATE);
  let phase = 0;
  for (let i = 0; i < RATE * 0.3 && k0 + i < N; i++) {
    const t = i / RATE;
    phase += (2 * Math.PI * (45 + 90 * Math.exp(-t * 30))) / RATE;
    const s = 0.3 * Math.sin(phase) * Math.exp(-t * 14);
    left[k0 + i] += s;
    right[k0 + i] += s;
  }
  // Hat: a short tick of thinned-out noise between the beats.
  const h0 = Math.round((beat + 0.5) * BEAT * RATE);
  let prev = 0;
  for (let i = 0; i < RATE * 0.05 && h0 + i < N; i++) {
    const n = noise();
    const s = 0.035 * (n - prev) * Math.exp((-i / RATE) * 90);
    prev = n;
    left[h0 + i] += s * 0.8;
    right[h0 + i] += s;
  }
}

// Fade in and out, then scale so the loudest point sits just under full volume.
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / RATE;
  const fade = Math.min(1, t / 0.25) * Math.min(1, (SECONDS - t) / 1.6);
  left[i] *= fade;
  right[i] *= fade;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const scale = 0.8 / peak;

const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(left[i] * scale * 32767), i * 4);
  data.writeInt16LE(Math.round(right[i] * scale * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

const file = path.join(__dirname, "music.wav");
fs.writeFileSync(file, Buffer.concat([header, data]));
console.log(file);

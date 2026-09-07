const AudioContextClass = window.AudioContext || window.webkitAudioContext || null;
const TITLE_SCREEN_BGM_PATH = 'assets/title-screen-bgm.mp3';
const CHAR_SELECT_BGM_PATH = 'assets/char-select-bgm.mp3';
const FIGHT_BGM_PATH = 'assets/fight-bgm.mp3';
const MASTER_AUDIO_GAIN = 1;
const SYNTH_MUSIC_GAIN = 0.06;
const SFX_GAIN = 2.2;
const TITLE_TRACK_GAIN = 0.14;
const CHAR_SELECT_TRACK_GAIN = 0.16;
const FIGHT_TRACK_GAIN = 0.18;

const audio = {
  supported: Boolean(AudioContextClass),
  context: null,
  masterGain: null,
  musicGain: null,
  sfxGain: null,
  musicTimer: null,
  musicStep: 0,
  titleTrack: null,
  charSelectTrack: null,
  fightTrack: null,
  readyCues: { p1: false, p2: false },
  pausedTracks: { title: false, charSelect: false, fight: false },
  pauseSuspendedContext: false
};

const cpuState = {
  attackCooldown: 0,
  blockFrames: 0,
  retreatFrames: 0,
  jumpCooldown: 0,
  strafeBias: 1
};

let gameLoopStarted = false;
let selectionConfirmTimer = null;
let p1Randomizing = false;
let p2Randomizing = false;
let p1RandomizeTimer = null;
let p2RandomizeTimer = null;
let charSelectCountdown = 0;
let charSelectCountdownInterval = null;
const GAMEPAD_DEADZONE = 0.3;
const GAMEPAD_REPEAT_DELAY_MS = 400;
const GAMEPAD_REPEAT_INTERVAL_MS = 250;
const CHAR_SELECT_REPEAT_DELAY_MS = 320;
const CHAR_SELECT_REPEAT_INTERVAL_MS = 220;
const GAMEPAD_BUTTONS = {
  confirm: 0,
  back: 1,
  block: 2,
  special: 3,
  start: 9,
  dpadUp: 12,
  dpadDown: 13,
  dpadLeft: 14,
  dpadRight: 15
};
const combinedKeys1 = { left: false, right: false, up: false, down: false, block: false };
const combinedKeys2 = { left: false, right: false, up: false, down: false, block: false };
const gamepadInput = {
  titleSelection: 0,
  pauseSelection: 0,
  loopStarted: false,
  slots: {
    p1: {
      index: -1,
      held: { left: false, right: false, up: false, down: false, block: false },
      prev: {},
      repeatAt: { left: 0, right: 0, up: 0, down: 0 },
      charSelectRepeatAt: { left: 0, right: 0, up: 0, down: 0 }
    },
    p2: {
      index: -1,
      held: { left: false, right: false, up: false, down: false, block: false },
      prev: {},
      repeatAt: { left: 0, right: 0, up: 0, down: 0 },
      charSelectRepeatAt: { left: 0, right: 0, up: 0, down: 0 }
    }
  }
};

function updateAudioUI() {
  return audio.supported;
}

function ensureTitleTrack() {
  if (audio.titleTrack) return audio.titleTrack;

  const track = new Audio(TITLE_SCREEN_BGM_PATH);
  track.loop = true;
  track.preload = 'auto';
  track.volume = 0;
  audio.titleTrack = track;
  return track;
}

function ensureFightTrack() {
  if (audio.fightTrack) return audio.fightTrack;

  const track = new Audio(FIGHT_BGM_PATH);
  track.loop = true;
  track.preload = 'auto';
  track.volume = 0;
  audio.fightTrack = track;
  return track;
}

function ensureCharSelectTrack() {
  if (audio.charSelectTrack) return audio.charSelectTrack;

  const track = new Audio(CHAR_SELECT_BGM_PATH);
  track.loop = true;
  track.preload = 'auto';
  track.volume = 0;
  audio.charSelectTrack = track;
  return track;
}

function syncTitleTrackVolume() {
  const track = ensureTitleTrack();
  track.volume = TITLE_TRACK_GAIN;
}

function syncFightTrackVolume() {
  const track = ensureFightTrack();
  track.volume = FIGHT_TRACK_GAIN;
}

function syncCharSelectTrackVolume() {
  const track = ensureCharSelectTrack();
  track.volume = CHAR_SELECT_TRACK_GAIN;
}

function stopTrack(track, reset = true) {
  if (!track) return;
  if (!track.paused) track.pause();
  if (reset) track.currentTime = 0;
}

function playTrack(track) {
  if (!track) return;
  const playPromise = track.play();
  if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
}

function restartFightTrack() {
  const track = ensureFightTrack();
  syncFightTrackVolume();
  stopTrack(track, true);
  playTrack(track);
}

function syncMusicMode() {
  const titleTrack = ensureTitleTrack();
  const charSelectTrack = ensureCharSelectTrack();
  const fightTrack = ensureFightTrack();

  if (game.state === GAME_STATES.MENU) {
    syncTitleTrackVolume();
    stopTrack(charSelectTrack, true);
    stopTrack(fightTrack, true);
    playTrack(titleTrack);
    return;
  }

  stopTrack(titleTrack, true);

  if (game.state === GAME_STATES.CHAR_SELECT || game.state === GAME_STATES.BATTLE_PLAN_STEPPER) {
    syncCharSelectTrackVolume();
    stopTrack(fightTrack, true);
    if (charSelectTrack.paused) playTrack(charSelectTrack);
    if (audio.musicTimer) {
      clearInterval(audio.musicTimer);
      audio.musicTimer = null;
    }
    return;
  }

  stopTrack(charSelectTrack, true);

  if (game.state === GAME_STATES.COUNTDOWN || game.state === GAME_STATES.FIGHT) {
    syncFightTrackVolume();
    if (fightTrack.paused) playTrack(fightTrack);
    if (audio.musicTimer) {
      clearInterval(audio.musicTimer);
      audio.musicTimer = null;
    }
    return;
  }

  stopTrack(fightTrack, false);

  if (audio.context && !audio.musicTimer) startMusicLoop();
}

function applyAudioSettings() {
  if (audio.masterGain && audio.context) {
    const now = audio.context.currentTime;
    const target = MASTER_AUDIO_GAIN;
    audio.masterGain.gain.cancelScheduledValues(now);
    audio.masterGain.gain.setTargetAtTime(target, now, 0.02);
  }

  syncTitleTrackVolume();
  syncCharSelectTrackVolume();
  syncFightTrackVolume();

  updateAudioUI();
}

function ensureAudioReady() {
  if (!audio.supported) return false;

  if (!audio.context) {
    audio.context = new AudioContextClass();
    audio.masterGain = audio.context.createGain();
    audio.musicGain = audio.context.createGain();
    audio.sfxGain = audio.context.createGain();

    audio.musicGain.gain.value = SYNTH_MUSIC_GAIN;
    audio.sfxGain.gain.value = SFX_GAIN;

    audio.musicGain.connect(audio.masterGain);
    audio.sfxGain.connect(audio.masterGain);
    audio.masterGain.connect(audio.context.destination);
    applyAudioSettings();
  }

  if (audio.context.state === 'suspended') audio.context.resume();
  syncMusicMode();
  return true;
}

function playTone(freq, duration, options = {}) {
  if (!audio.context || !options.destination && !audio.sfxGain) return;

  const {
    type = 'square',
    volume = 0.12,
    attack = 0.004,
    release = 0.08,
    freqEnd = freq,
    detune = 0,
    destination = audio.sfxGain,
    delay = 0
  } = options;

  if (!destination) return;

  const now = audio.context.currentTime + delay;
  const osc = audio.context.createOscillator();
  const gain = audio.context.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.linearRampToValueAtTime(freqEnd, now + duration);
  osc.detune.setValueAtTime(detune, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + duration + release + 0.02);
}

function playChord(freqs, duration, options = {}) {
  freqs.forEach((freq, index) => {
    playTone(freq, duration, { ...options, delay: (options.delay || 0) + index * 0.01 });
  });
}

function playUiSound(type) {
  if (!audio.context) return;

  if (type === 'navigate') {
    playTone(660, 0.04, { type: 'square', volume: 0.07, freqEnd: 820 });
  } else if (type === 'confirm') {
    playTone(440, 0.06, { type: 'triangle', volume: 0.08, freqEnd: 520 });
    playTone(660, 0.1, { type: 'square', volume: 0.07, delay: 0.04, freqEnd: 740 });
  } else if (type === 'start') {
    playChord([262, 330, 392], 0.18, { type: 'square', volume: 0.06, destination: audio.musicGain });
  }
}

function playAttackSound(type) {
  if (!audio.context) return;

  if (type === 'punch') {
    playTone(180, 0.06, { type: 'square', volume: 0.08, freqEnd: 110 });
  } else if (type === 'kick') {
    playTone(130, 0.09, { type: 'triangle', volume: 0.095, freqEnd: 80 });
  } else if (type === 'special') {
    playTone(250, 0.18, { type: 'sawtooth', volume: 0.08, freqEnd: 520 });
    playTone(520, 0.14, { type: 'square', volume: 0.04, delay: 0.03, freqEnd: 660 });
  }
}

function playImpactSound(type) {
  if (!audio.context) return;

  if (type === 'block') {
    playTone(980, 0.04, { type: 'square', volume: 0.05, freqEnd: 760 });
    playTone(1320, 0.03, { type: 'triangle', volume: 0.03, delay: 0.01, freqEnd: 1040 });
  } else if (type === 'hit') {
    playTone(95, 0.08, { type: 'square', volume: 0.09, freqEnd: 60 });
  } else if (type === 'freeze') {
    playTone(720, 0.12, { type: 'sine', volume: 0.05, freqEnd: 520 });
    playTone(1040, 0.14, { type: 'triangle', volume: 0.03, delay: 0.02, freqEnd: 780 });
  } else if (type === 'ko') {
    playTone(180, 0.15, { type: 'square', volume: 0.1, freqEnd: 90 });
    playTone(110, 0.18, { type: 'triangle', volume: 0.08, delay: 0.02, freqEnd: 55 });
  }
}

function playRoundCue(type) {
  if (!audio.context) return;

  if (type === 'round') {
    playTone(392, 0.08, { type: 'triangle', volume: 0.06, freqEnd: 330 });
    playTone(440, 0.08, { type: 'triangle', volume: 0.05, delay: 0.08, freqEnd: 392 });
  } else if (type === 'fight') {
    playChord([392, 523, 659], 0.16, { type: 'square', volume: 0.05 });
  } else if (type === 'win') {
    playTone(330, 0.08, { type: 'triangle', volume: 0.06, freqEnd: 392 });
    playTone(440, 0.1, { type: 'triangle', volume: 0.06, delay: 0.09, freqEnd: 523 });
    playTone(659, 0.14, { type: 'square', volume: 0.05, delay: 0.18, freqEnd: 784 });
  } else if (type === 'draw') {
    playTone(294, 0.1, { type: 'triangle', volume: 0.06, freqEnd: 262 });
    playTone(220, 0.14, { type: 'sine', volume: 0.05, delay: 0.08, freqEnd: 196 });
  } else if (type === 'meter') {
    playTone(880, 0.05, { type: 'triangle', volume: 0.04, freqEnd: 980 });
  }
}

function musicPatternForState() {
  if (game.state === GAME_STATES.FIGHT || game.state === GAME_STATES.COUNTDOWN) {
    return {
      bass: [110, null, 123.47, 146.83, 164.81, null, 146.83, 123.47],
      lead: [null, 392, null, 440, null, 523.25, null, 440]
    };
  }

  return {
    bass: [98, null, 110, null, 82.41, null, 73.42, null],
    lead: [392, null, 440, null, 349.23, null, 329.63, null]
  };
}

function tickMusic() {
  if (!audio.context || !audio.musicGain) return;

  const pattern = musicPatternForState();
  const bass = pattern.bass[audio.musicStep % pattern.bass.length];
  const lead = pattern.lead[audio.musicStep % pattern.lead.length];

  if (bass) playTone(bass, 0.18, { type: 'square', volume: 0.045, destination: audio.musicGain, freqEnd: bass * 0.98 });
  if (lead) playTone(lead, 0.1, { type: 'triangle', volume: 0.03, destination: audio.musicGain, delay: 0.03, freqEnd: lead * 1.02 });

  audio.musicStep++;
}

function startMusicLoop() {
  if (!audio.context || audio.musicTimer) return;
  audio.musicStep = 0;
  tickMusic();
  audio.musicTimer = setInterval(tickMusic, 250);
}

updateAudioUI();


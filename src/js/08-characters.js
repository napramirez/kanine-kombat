// Game state and roster
let game = {
  state: GAME_STATES.MENU,
  mode: MATCH_MODES.VERSUS,
  stage: BACKGROUND_STAGES.TEMPLE,
  battlePlan: {
    route: [],
    currentIndex: 0,
    playerCharacterId: '',
    pendingAdvance: false,
    cleared: false,
    stepperFromIndex: -1,
    stepperReady: false
  },
  credits: 3,
  continueCountdown: 0,
  continueTimerInterval: null,
  winStreak: { p1: 0, p2: 0 },
  pause: {
    active: false,
    returnState: '',
    snapshotCanvas: null
  },
  timer: ROUND_RULES.timerSeconds,
  timerInterval: null,
  round: 1,
  roundMessage: '',
  roundMessageTimer: 0,
  countdownPhase: COUNTDOWN_PHASES.ROUND,
  countdownTimer: 0,
  countdownFightTimer: 0,
  hitStop: 0,
  screenShake: 0
};

// Character definitions
const CHARACTERS = [
  {
    id: 'doggo',
    name: 'DOGGO CAGE',
    color1: '#d4a574',
    color2: '#f5deb3',
    eyeColor: '#2ecc71',
    speed: 5,
    health: 100,
    specialGain: 0.08,
    desc: 'BALANCED'
  },
  {
    id: 'borko',
    name: 'BORKO',
    hidden: true,
    color1: '#808080',
    color2: '#d3d3d3',
    eyeColor: '#e74c3c',
    scale: 1.3,
    speed: 4,
    health: 125,
    specialGain: 0.08,
    desc: 'POWER'
  },
  {
    id: 'catnip',
    name: 'SHAO CATNIP',
    hidden: true,
    color1: '#9b59b6',
    color2: '#d2b4de',
    eyeColor: '#f1c40f',
    scale: 1.3,
    speed: 8,
    health: 150,
    specialGain: 0.08,
    desc: 'SPEED'
  },
  {
    id: 'scorp',
    name: 'SKORPDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#e74c3c',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'STRIKER'
  },
  {
    id: 'sekdog',
    name: 'SEKDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#ff7675',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'AMBUSH'
  },
  {
    id: 'cydog',
    name: 'CYDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#f1c40f',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'TRAPPER'
  },
  {
    id: 'tremdog',
    name: 'TREMODOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#e74c3c',
    scale: 1.1,
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'QUAKE'
  },
  {
    id: 'rayndog',
    name: 'RAYNDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#e74c3c',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'STORM'
  },
  {
    id: 'raydog',
    name: 'RAYDOG',
    color1: '#ffffff',
    color2: '#f5f5f5',
    eyeColor: '#c0c0c0',
    speed: 5,
    health: 100,
    specialGain: 0.75,
    passiveSpecialGain: SPECIAL_METER_MAX / COMBAT.special.raydog.passiveIntervalFrames,
    desc: 'ARC'
  },
  {
    id: 'doggomeleon',
    name: 'DOGGOMELEON',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#e74c3c',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    passiveSpecialGain: SPECIAL_METER_MAX / DOGGOMELEON_MORPH_FRAMES,
    desc: 'SHIFT'
  },
  {
    id: 'noob-saidog',
    name: 'NOOB SAIDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#ff1744',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'SHADOW'
  },
  {
    id: 'repdog',
    name: 'REPDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#ffeb3b',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'ACID'
  },
  {
    id: 'snek',
    name: 'SNEK',
    hidden: true,
    color1: '#030303',
    color2: '#171717',
    eyeColor: '#ff1744',
    scale: 1.5,
    speed: 7,
    health: 100,
    specialGain: 0.25,
    desc: 'CONSTRICTOR'
  },
  {
    id: 'doggbal',
    name: 'DOGGABAL',
    color1: '#111111',
    color2: '#222222',
    eyeColor: '#e74c3c',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    desc: 'TACTICAL'
  },
  {
    id: 'subdog',
    name: 'SUBDOG',
    color1: '#ffffff',
    color2: '#111111',
    eyeColor: '#87ceeb',
    speed: 5,
    health: 100,
    specialGain: 0.25,
    passiveSpecialGain: SPECIAL_METER_MAX / COMBAT.special.subdog.passiveIntervalFrames,
    desc: 'TRAPPER'
  }
];

const HIDDEN_CHARACTER_UNLOCKS_KEY = 'kanine-kombat-hidden-character-unlocks-v1';
const unlockedHiddenCharacterIds = (() => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(HIDDEN_CHARACTER_UNLOCKS_KEY) || '[]');
    return new Set(stored.filter(id => CHARACTERS.some(char => char.id === id && char.hidden)));
  } catch {
    return new Set();
  }
})();

function isHiddenCharacter(char) {
  return Boolean(char && char.hidden);
}

function isCharacterUnlocked(char) {
  return !isHiddenCharacter(char) || unlockedHiddenCharacterIds.has(char.id);
}

function getSelectableCharacterIndices() {
  return CHARACTERS
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => isCharacterUnlocked(char))
    .map(({ index }) => index);
}

function getSelectableCharacterIndex(preferredIndex, excludedIndex = -1) {
  const indices = getSelectableCharacterIndices();
  if (indices.includes(preferredIndex) && preferredIndex !== excludedIndex) return preferredIndex;
  return indices.find(index => index !== excludedIndex) ?? indices[0] ?? 0;
}

function unlockHiddenCharacter(id) {
  const char = CHARACTERS.find(candidate => candidate.id === id);
  if (!isHiddenCharacter(char) || unlockedHiddenCharacterIds.has(id)) return false;

  unlockedHiddenCharacterIds.add(id);
  try {
    window.localStorage.setItem(HIDDEN_CHARACTER_UNLOCKS_KEY, JSON.stringify([...unlockedHiddenCharacterIds]));
  } catch {
    // Keep unlocks available for this session if persistent storage is blocked.
  }
  return true;
}

let p1Selection = getSelectableCharacterIndex(0);
let p2Selection = getSelectableCharacterIndex(1, p1Selection);
let p1Confirmed = false;
let p2Confirmed = false;

const keys1 = { left: false, right: false, up: false, down: false, block: false };
const keys2 = { left: false, right: false, up: false, down: false, block: false };

let p1 = new Fighter(PLAYER_SPAWNS.p1, CHARACTERS[p1Selection], 1);
let p2 = new Fighter(PLAYER_SPAWNS.p2, CHARACTERS[p2Selection], -1);

function isCpuMode() {
  return game.mode === MATCH_MODES.CPU;
}

function isBattlePlanMode() {
  return game.mode === MATCH_MODES.BATTLE_PLAN;
}

function isCpuControlledMode() {
  return isCpuMode() || isBattlePlanMode();
}

function getCharacterById(id) {
  return CHARACTERS.find(char => char.id === id) || CHARACTERS[0];
}

function shuffleCharacterIds(ids) {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


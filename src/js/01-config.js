// Canvas, rules, and cached DOM references
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const GAME_STATES = {
  MENU: 'menu',
  CHAR_SELECT: 'charSelect',
  BATTLE_PLAN_STEPPER: 'battlePlanStepper',
  PAUSED: 'paused',
  COUNTDOWN: 'countdown',
  FIGHT: 'fight',
  ROUND_END: 'roundEnd',
  GAME_OVER: 'gameOver',
  CONTINUE: 'continue'
};

const MATCH_MODES = {
  VERSUS: 'versus',
  CPU: 'cpu',
  BATTLE_PLAN: 'battlePlan'
};

const COUNTDOWN_PHASES = {
  ROUND: 'round',
  FIGHT: 'fight'
};

const PHYSICS = {
  gravity: 0.65,
  jumpVelocity: -14,
  airborneHitLift: -3,
  groundOffset: 80,
  freezeTickMs: 16.67
};

const FIGHTER_LAYOUT = {
  width: 60,
  height: 90,
  boundaryPadding: 40,
  spriteSize: 120
};

const PLAYER_SPAWNS = {
  p1: 250,
  p2: 774
};

const SPECIAL_METER_MAX = 100;

const COMBAT = {
  comboResetMs: 800,
  punch: {
    damage: 4,
    duration: 6,
    knockback: 4,
    comboDamageStep: 1,
    comboKnockbackStep: 0.5,
    hitbox: { xOffset: 20, yOffset: 60, width: 55, height: 25, crouchOffset: 15 }
  },
  kick: {
    damage: 6,
    duration: 4,
    knockback: 7,
    comboDamageStep: 2,
    hitbox: { xOffset: 15, yOffset: 40, width: 60, height: 30, crouchOffset: 15 }
  },
  special: {
    duration: 30,
    borko: {
      airFrames: 32,
      jumpHeight: 240,
      shockRadius: 240,
      shockDamage: 10,
      shockKnockback: 8,
      shockStunMs: 1000
    },
    rayndog: {
      durationFrames: 180,
      pulseIntervalFrames: 45,
      zapDamage: 10,
      zapKnockback: 3
    },
    raydog: {
      damage: 10,
      knockback: 4,
      stunMs: 1000,
      dashSpeed: 18,
      dashFrames: 30,
      pushFrames: 20,
      hurlBackSpeed: 14,
      hurlBackFrames: 20,
      displayFrames: 12,
      passiveIntervalFrames: 180,
      passiveRadius: 340
    },
    skorpdog: {
      ownerLockFrames: 2,
      pointBlankGap: 6
    },
    cydog: {
      netSpeed: 11,
      netRadius: 16,
      captureGap: 26,
      capturePullSpeed: 10,
      captureHoldMs: 4200,
      bombFuseFrames: 240,
      bombRadius: 28,
      bombDamage: 15,
      bombKnockback: 11
    },
    tremdog: {
      durationFrames: 600,
      pulseIntervalFrames: 120,
      shockDamage: 5,
      shockKnockback: 6,
      shockStunMs: 900
    },
    sekdog: {
      descendFrames: 12,
      riseFrames: 12,
      punchFrames: 10,
      behindOffset: 70,
      punchDamage: 8,
      punchKnockback: 15,
      missileDamage: 15,
      missileKnockback: 0,
      missileSpeed: 14,
      missileRadius: 10
    },
    noobSaidog: {
      snakeRiseFrames: 30,
      captureHoldMs: 3000,
      barrageCount: 5,
      sequenceFrames: 32,
      fireballDamage: 2,
      fireballKnockback: 0,
      fireballSpeed: 12,
      fireballRadius: 14,
      fireballSpread: 1,
      fireballLaunchFrames: 14
    },
    snek: {
      slitherSpeed: 18,
      coilRange: 42,
      maxFrames: 90,
      coilStunMs: 3000,
      coilDisplayFrames: 180
    },
    doggbal: {
      dashSpeed: 20,
      dashFrames: 15,
      stunMs: 3000,
      damage: 5,
      knockback: 3
    },
    subdog: {
      passiveIntervalFrames: 300,
      cloneDurationFrames: 120,
      cloneFreezeMs: 2000
    }
  },
  block: {
    damageMultiplier: 0.15,
    knockbackMultiplier: 0.2,
    stunFrames: 10
  },
  hit: {
    stunFrames: 20,
    cooldownFrames: 12
  },
  status: {
    skorpdogStunMs: 1000
  },
  meter: {
    onHitMultiplier: 0.8,
    onHurtMultiplier: 0.5,
    onBlockMultiplier: 0.3,
    onBlockBorkoMultiplier: 0.75,
    onBlockBonusMultiplier: 0.5
  },
  attackBox: {
    forwardOffset: 15,
    backwardOffset: 75
  },
  effects: {
    meleeHitStop: 6,
    projectileHitStop: 6,
    harpoonHitStop: 8,
    freezeHitStop: 10,
    hitShake: 5,
    projectileShake: 8,
    harpoonShake: 10,
    freezeShake: 5,
    koShake: 15
  }
};

const ROUND_RULES = {
  timerSeconds: 99,
  introRoundFrames: 90,
  introFightFrames: 60,
  roundMessageFrames: 120,
  gameOverMessageFrames: 300,
  restartPromptFrames: 200,
  winsToFinish: 2,
  flawlessHealth: 100
};

const GROUND = H - PHYSICS.groundOffset;

const ui = {
  startScreen: document.getElementById('start-screen'),
  titleLogo: document.getElementById('title-logo'),
  charSelect: document.getElementById('char-select'),
  battlePlanStepper: document.getElementById('battle-plan-stepper'),
  battlePlanSummary: document.getElementById('battle-plan-summary'),
  battlePlanRouteViewport: document.getElementById('battle-plan-route-viewport'),
  battlePlanRoute: document.getElementById('battle-plan-route'),
  battlePlanRouteSteps: document.getElementById('battle-plan-route-steps'),
  battlePlanPlayerToken: document.getElementById('battle-plan-player-token'),
  battlePlanPrompt: document.getElementById('battle-plan-prompt'),
  pauseOverlay: document.getElementById('pause-overlay'),
  pauseTitle: document.getElementById('pause-title'),
  pauseCopy: document.getElementById('pause-copy'),
  pauseModeButtons: document.getElementById('pause-mode-buttons'),
  startButton: document.getElementById('start-btn'),
  cpuButton: document.getElementById('cpu-btn'),
  battlePlanButton: document.getElementById('battle-plan-btn'),
  fightButton: document.getElementById('fight-btn'),
  p1SelectLabel: document.getElementById('p1-select-label'),
  p2SelectLabel: document.getElementById('p2-select-label'),
  p1SelectControls: document.getElementById('p1-select-controls'),
  p2SelectControls: document.getElementById('p2-select-controls'),
  timer: document.getElementById('timer'),
  p1Name: document.getElementById('p1-name'),
  p2Name: document.getElementById('p2-name'),
  p1Health: document.getElementById('p1-health'),
  p2Health: document.getElementById('p2-health'),
  p1Special: document.getElementById('p1-special'),
  p2Special: document.getElementById('p2-special'),
  p1PassiveContainer: document.getElementById('p1-passive-container'),
  p2PassiveContainer: document.getElementById('p2-passive-container'),
  p1Passive: document.getElementById('p1-passive'),
  p2Passive: document.getElementById('p2-passive'),
  p1SpecialLabel: document.getElementById('p1-special-label'),
  p2SpecialLabel: document.getElementById('p2-special-label'),
  p1PassiveLabel: document.getElementById('p1-passive-label'),
  p2PassiveLabel: document.getElementById('p2-passive-label'),
  p1Combo: document.getElementById('p1-combo'),
  p2Combo: document.getElementById('p2-combo'),
  p1WinStreak: document.getElementById('p1-win-streak'),
  p2WinStreak: document.getElementById('p2-win-streak'),
  p1Portrait: document.getElementById('p1-portrait'),
  p2Portrait: document.getElementById('p2-portrait'),
  charPool: document.getElementById('char-pool'),
  continueScreen: document.getElementById('continue-screen'),
  continueCountdown: document.getElementById('continue-countdown'),
  creditsCount: document.getElementById('credits-count'),
  roundDots: {
    p1r1: document.getElementById('p1-r1'),
    p1r2: document.getElementById('p1-r2'),
    p2r1: document.getElementById('p2-r1'),
    p2r2: document.getElementById('p2-r2')
  }
};

const titleModeButtons = [ui.startButton, ui.cpuButton, ui.battlePlanButton];
const pauseModeButtons = Array.from(ui.pauseModeButtons.querySelectorAll('[data-mode]'));


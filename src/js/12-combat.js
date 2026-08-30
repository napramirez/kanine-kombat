// Character select screen
function cloneCanvas(src) {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  c.getContext('2d').drawImage(src, 0, 0);
  return c;
}

function tintSprite(src, fillStyle) {
  const c = cloneCanvas(src);
  const x = c.getContext('2d');
  x.globalCompositeOperation = 'source-atop';
  x.fillStyle = fillStyle;
  x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'source-over';
  return c;
}

function renderCharPreview(char) {
  return createDogSprite(char.color1, char.color2, char.eyeColor, char.name, 1, 0, 'idle');
}

const CHAR_SELECT_COLUMNS = 4;
const CHAR_SELECT_RANDOM_STEPS = 8;
const CHAR_SELECT_RANDOM_DELAY_MS = 80;
const CHAR_SELECT_RANDOM_DELAY_STEP_MS = 15;
const CHAR_SELECT_RANDOM_DELAY_JITTER_MS = 20;

function moveCharSelection(index, dx, dy) {
  const selectableIndices = getSelectableCharacterIndices();
  const total = selectableIndices.length;
  if (total === 0) return index;

  const columns = CHAR_SELECT_COLUMNS;
  const rows = Math.ceil(total / columns);
  let visibleIndex = selectableIndices.indexOf(index);
  if (visibleIndex < 0) visibleIndex = 0;
  let row = Math.floor(visibleIndex / columns);
  let col = visibleIndex % columns;

  if (dx !== 0) {
    const rowStart = row * columns;
    const rowLength = Math.min(columns, total - rowStart);
    col = (col + dx + rowLength) % rowLength;
    return selectableIndices[rowStart + col];
  }

  if (dy !== 0) {
    let nextRow = row;
    do {
      nextRow = (nextRow + dy + rows) % rows;
      const rowStart = nextRow * columns;
      const rowLength = Math.min(columns, total - rowStart);
      if (rowLength > 0) return selectableIndices[rowStart + Math.min(col, rowLength - 1)];
    } while (nextRow !== row);
  }

  return selectableIndices[visibleIndex];
}

function getRandomCharStep(index) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];
  const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
  return moveCharSelection(index, dx, dy);
}

function clearCharSelectRandomizers() {
  if (p1RandomizeTimer) clearTimeout(p1RandomizeTimer);
  if (p2RandomizeTimer) clearTimeout(p2RandomizeTimer);
  p1RandomizeTimer = null;
  p2RandomizeTimer = null;
  p1Randomizing = false;
  p2Randomizing = false;
}

function queueSelectionConfirmIfReady() {
  if (p1Randomizing || p2Randomizing) return;
  if (p1Confirmed && p2Confirmed && !selectionConfirmTimer) {
    selectionConfirmTimer = setTimeout(confirmSelection, 400);
  }
}

function startRandomCharacterSelect(player) {
  const isP1 = player === 'p1';
  let stepsRemaining = CHAR_SELECT_RANDOM_STEPS;

  if (isP1) {
    if (p1RandomizeTimer) clearTimeout(p1RandomizeTimer);
    p1RandomizeTimer = null;
    p1Randomizing = true;
    p1Confirmed = false;
  } else {
    if (p2RandomizeTimer) clearTimeout(p2RandomizeTimer);
    p2RandomizeTimer = null;
    p2Randomizing = true;
    p2Confirmed = false;
  }

  const runStep = () => {
    if (isP1) p1Selection = getRandomCharStep(p1Selection);
    else p2Selection = getRandomCharStep(p2Selection);

    updateCharSelect();
    playUiSound(stepsRemaining > 1 ? 'navigate' : 'confirm');
    stepsRemaining--;

    if (stepsRemaining <= 0) {
      if (isP1) {
        p1Randomizing = false;
        p1RandomizeTimer = null;
        p1Confirmed = true;
      } else {
        p2Randomizing = false;
        p2RandomizeTimer = null;
        p2Confirmed = true;
      }
      updateCharSelect();
      queueSelectionConfirmIfReady();
      return;
    }

    const completedSteps = CHAR_SELECT_RANDOM_STEPS - stepsRemaining;
    const delay = CHAR_SELECT_RANDOM_DELAY_MS
      + completedSteps * CHAR_SELECT_RANDOM_DELAY_STEP_MS
      + Math.floor(Math.random() * CHAR_SELECT_RANDOM_DELAY_JITTER_MS);
    if (isP1) p1RandomizeTimer = setTimeout(runStep, delay);
    else p2RandomizeTimer = setTimeout(runStep, delay);
  };

  runStep();
}

function buildTitleLogo() {
  if (!ui.titleLogo) return;

  ui.titleLogo.innerHTML = '';
  const c = document.createElement('canvas');
  c.width = 140;
  c.height = 140;
  const x = c.getContext('2d');

  x.imageSmoothingEnabled = false;
  drawKanineLogo(x, 70, 70, 1);

  ui.titleLogo.appendChild(c);
}

buildTitleLogo();

function updatePortrait(char, container) {
  container.innerHTML = '';
  
  const sprite = createDogSprite(char.color1, char.color2, char.eyeColor, char.name, 1, 0, 'idle');
  container.appendChild(cloneCanvas(sprite));
  
  const info = document.createElement('div');
  info.className = 'char-portrait-info';
  info.innerHTML = `
    <div class="char-portrait-name">${char.name}</div>
    <div class="char-portrait-stats">
      <span>HP:</span> ${char.health} &bull; <span>SPD:</span> ${char.speed}<br>
      <span>${char.desc}</span>
    </div>
  `;
  container.appendChild(info);
}

function buildCharSelect() {
  updateCharSelectModeUI();

  ui.charPool.innerHTML = '';

  getSelectableCharacterIndices().forEach(i => {
    const char = CHARACTERS[i];
    const opt = document.createElement('div');
    opt.className = 'char-option';
    opt.id = 'char-opt-' + i;
    opt.appendChild(cloneCanvas(renderCharPreview(char)));
    const name = document.createElement('span');
    name.className = 'char-name';
    name.textContent = char.name;
    opt.appendChild(name);
    opt.addEventListener('click', () => {
      ensureAudioReady();
      if (!p1Confirmed && !p1Randomizing) {
        p1Selection = i;
        updateCharSelect();
        playUiSound('navigate');
      } else if (!p2Confirmed && !p2Randomizing && !isCpuControlledMode()) {
        p2Selection = i;
        updateCharSelect();
        playUiSound('navigate');
      }
    });
    ui.charPool.appendChild(opt);
  });

  updateCharSelect();
}

function updateCharSelect() {
  ui.p1Portrait.className = 'char-portrait p1 selected';
  ui.p2Portrait.className = 'char-portrait p2 selected';

  getSelectableCharacterIndices().forEach(i => {
    const char = CHARACTERS[i];
    const opt = document.getElementById('char-opt-' + i);
    if (!opt) return;
    let cls = 'char-option';
    if (i === p1Selection) cls += ' highlight-p1';
    if (i === p2Selection) cls += ' highlight-p2';
    if (i === p1Selection && p1Randomizing) cls += ' randomizing-p1';
    if (i === p2Selection && p2Randomizing) cls += ' randomizing-p2';
    if (i === p1Selection && p1Confirmed) cls += ' confirmed-p1';
    if (i === p2Selection && p2Confirmed) cls += ' confirmed-p2';
    opt.className = cls;
  });

  updatePortrait(CHARACTERS[p1Selection], ui.p1Portrait);
  updatePortrait(CHARACTERS[p2Selection], ui.p2Portrait);
}

function confirmSelection() {
  if (selectionConfirmTimer) {
    clearTimeout(selectionConfirmTimer);
    selectionConfirmTimer = null;
  }
  clearCharSelectRandomizers();

  if (isBattlePlanMode()) {
    if (!game.battlePlan.route.length || game.battlePlan.playerCharacterId !== CHARACTERS[p1Selection].id) {
      prepareBattlePlanRoute(CHARACTERS[p1Selection].id);
    }
    loadBattlePlanMatch();
  } else {
    game.stage = pickRandomBackgroundStage();
    p1 = new Fighter(PLAYER_SPAWNS.p1, CHARACTERS[p1Selection], 1);
    p2 = new Fighter(PLAYER_SPAWNS.p2, CHARACTERS[p2Selection], -1);
    ui.p1Name.textContent = p1.name;
    ui.p2Name.textContent = isCpuControlledMode() ? `${p2.name} CPU` : p2.name;
  }

  ui.charSelect.style.display = 'none';
  playUiSound('confirm');
  if (isBattlePlanMode()) {
    showBattlePlanStepper(-1, game.battlePlan.currentIndex);
    startGameLoop();
    return;
  }

  startRound();
  startGameLoop();
}

// Character select keyboard input
document.addEventListener('keydown', e => {
  if (game.state === GAME_STATES.PAUSED) return;
  if (game.state !== GAME_STATES.CHAR_SELECT) return;
  const k = e.key.toLowerCase();

  // P1 navigation
  if (!p1Confirmed && !p1Randomizing) {
    if (k === 'a') { ensureAudioReady(); p1Selection = moveCharSelection(p1Selection, -1, 0); updateCharSelect(); playUiSound('navigate'); }
    if (k === 'd') { ensureAudioReady(); p1Selection = moveCharSelection(p1Selection, 1, 0); updateCharSelect(); playUiSound('navigate'); }
    if (k === 'w') { ensureAudioReady(); p1Selection = moveCharSelection(p1Selection, 0, -1); updateCharSelect(); playUiSound('navigate'); }
    if (k === 's') { ensureAudioReady(); p1Selection = moveCharSelection(p1Selection, 0, 1); updateCharSelect(); playUiSound('navigate'); }
    if (k === 'j') { ensureAudioReady(); p1Confirmed = true; updateCharSelect(); playUiSound('confirm'); }
    if (k === 'l') {
      ensureAudioReady();
      startRandomCharacterSelect('p1');
      e.preventDefault();
    }
  }

  // P2 navigation
  if (!p2Confirmed && !p2Randomizing && !isCpuControlledMode()) {
    if (e.key === 'ArrowLeft') { ensureAudioReady(); p2Selection = moveCharSelection(p2Selection, -1, 0); updateCharSelect(); playUiSound('navigate'); e.preventDefault(); }
    if (e.key === 'ArrowRight') { ensureAudioReady(); p2Selection = moveCharSelection(p2Selection, 1, 0); updateCharSelect(); playUiSound('navigate'); e.preventDefault(); }
    if (e.key === 'ArrowUp') { ensureAudioReady(); p2Selection = moveCharSelection(p2Selection, 0, -1); updateCharSelect(); playUiSound('navigate'); e.preventDefault(); }
    if (e.key === 'ArrowDown') { ensureAudioReady(); p2Selection = moveCharSelection(p2Selection, 0, 1); updateCharSelect(); playUiSound('navigate'); e.preventDefault(); }
    if (k === '1' || e.key === 'Numpad1') { ensureAudioReady(); p2Confirmed = true; updateCharSelect(); playUiSound('confirm'); }
    if (k === '3' || e.key === 'Numpad3') {
      ensureAudioReady();
      startRandomCharacterSelect('p2');
      e.preventDefault();
    }
  }

  queueSelectionConfirmIfReady();
});

// Fight button
ui.fightButton.addEventListener('click', () => {
  ensureAudioReady();
  if (p1Randomizing || p2Randomizing) return;
  p1Confirmed = true;
  p2Confirmed = true;
  confirmSelection();
});

function checkHit(attacker, defender) {
  const atkBox = attacker.getAttackBox();
  if (!atkBox) return;

  const defBox = defender.getHurtbox();

  const actualAtkBox = {
    x: attacker.facing === 1 ? attacker.x + COMBAT.attackBox.forwardOffset : attacker.x - COMBAT.attackBox.backwardOffset,
    y: atkBox.y,
    w: atkBox.w,
    h: atkBox.h
  };

  if (actualAtkBox.x < defBox.x + defBox.w &&
      actualAtkBox.x + actualAtkBox.w > defBox.x &&
      actualAtkBox.y < defBox.y + defBox.h &&
      actualAtkBox.y + actualAtkBox.h > defBox.y) {
    defender.takeHit(atkBox.dmg, atkBox.kb, attacker.facing);
    const attackerSpecialName = getActiveSpecialName(attacker);
    if (!(attackerSpecialName === 'SKORPDOG' || attackerSpecialName === 'SUBDOG' || attackerSpecialName === 'SEKDOG' || attackerSpecialName === 'CYDOG' || attackerSpecialName === 'TREMODOG' || attackerSpecialName === 'RAYNDOG' || attackerSpecialName === 'RAYDOG' || attackerSpecialName === 'NOOB SAIDOG' || attackerSpecialName === 'REPDOG' || attackerSpecialName === 'SNEK' || attackerSpecialName === 'DOGGABAL') || attacker.lastAttackType === 'special') {
      attacker.special = Math.min(SPECIAL_METER_MAX, attacker.special + atkBox.dmg * COMBAT.meter.onHitMultiplier);
    }
    attacker.comboCount++;
    attacker.lastHitTime = Date.now();

    if (attacker.comboCount >= 30) {
      defender.vx = attacker.facing * 160;
      defender.maxComboPushback = true;
      addParticle(defender.x, defender.y - 50, 'ko');
      game.screenShake = COMBAT.effects.koShake;
      attacker.comboCount = 0;
      attacker.lastHitTime = 0;
      attacker.maxComboTimer = 60;
    }

    if (defender.health <= 0) {
      game.screenShake = COMBAT.effects.koShake;
      addParticle(defender.x, defender.y - 50, 'ko');
      playImpactSound('ko');
    } else {
      game.screenShake = COMBAT.effects.hitShake;
    }

    game.hitStop = COMBAT.effects.meleeHitStop;
  }
}

function startRound() {
  p1.reset(PLAYER_SPAWNS.p1);
  p2.reset(PLAYER_SPAWNS.p2);
  resetInputState(keys1);
  resetInputState(keys2);
  resetCpuState();
  game.timer = ROUND_RULES.timerSeconds;
  game.state = GAME_STATES.COUNTDOWN;
  game.countdownPhase = COUNTDOWN_PHASES.ROUND;
  game.countdownTimer = ROUND_RULES.introRoundFrames;
  game.countdownFightTimer = ROUND_RULES.introFightFrames;
  audio.readyCues.p1 = false;
  audio.readyCues.p2 = false;
  projectiles.length = 0;
  particles.length = 0;

  if (game.timerInterval) clearInterval(game.timerInterval);

  syncMusicMode();
  if (audio.supported) restartFightTrack();
  playRoundCue('round');
}

function startTimer() {
  if (game.timerInterval) clearInterval(game.timerInterval);
  game.timerInterval = setInterval(() => {
    if (game.state === GAME_STATES.FIGHT) {
      game.timer--;
      if (game.timer <= 0) {
        game.timer = 0;
        endRound();
      }
    }
  }, 1000);
}

function endRound() {
  game.state = GAME_STATES.ROUND_END;
  game.roundMessageTimer = ROUND_RULES.roundMessageFrames;

  if (game.timerInterval) clearInterval(game.timerInterval);

  syncMusicMode();

  let winner = null;
  let loser = null;
  if (p1.health <= 0 && p2.health > 0) { winner = p2; loser = p1; }
  else if (p2.health <= 0 && p1.health > 0) { winner = p1; loser = p2; }
  else if (p1.health > p2.health) { winner = p1; loser = p2; }
  else if (p2.health > p1.health) { winner = p2; loser = p1; }

  if (winner) {
    winner.roundsWon++;
    updateRoundDots();
    const flawless = winner.health >= ROUND_RULES.flawlessHealth;
    const battlePlanMatchComplete = isBattlePlanMode() && winner.roundsWon >= ROUND_RULES.winsToFinish;
    const isNoobCatnipFinal = isBattlePlanMode()
      && game.battlePlan.currentIndex === game.battlePlan.route.length - 1
      && p1.name === 'NOOB SAIDOG';
    const unlockedBoss = battlePlanMatchComplete && winner === p1
      && unlockHiddenCharacter(game.battlePlan.route[game.battlePlan.currentIndex]);
    const unlockedSnek = battlePlanMatchComplete && winner === p1 && isNoobCatnipFinal
      && unlockHiddenCharacter('snek');
    const unlockMessage = [unlockedBoss ? `${p2.name} UNLOCKED!` : '', unlockedSnek ? 'SNEK UNLOCKED!' : '']
      .filter(Boolean)
      .join('\n');
    if (battlePlanMatchComplete && winner === p1 && game.battlePlan.currentIndex === game.battlePlan.route.length - 1) {
      game.roundMessage = 'BATTLE PLAN\nCLEARED!';
      if (unlockMessage) game.roundMessage += `\n${unlockMessage}`;
    } else if (battlePlanMatchComplete && winner === p2) {
      game.roundMessage = 'BATTLE PLAN\nFAILED';
    } else if (unlockMessage) {
      game.roundMessage = unlockMessage;
    } else {
      game.roundMessage = flawless ? `${winner.name}\nFLAWLESS VICTORY!` : `${winner.name} WINS!`;
    }
    playRoundCue('win');

    // Set victory pose for winner
    winner.victoryTimer = ROUND_RULES.roundMessageFrames;
    winner.state = 'victory';

    // Set defeat pose for loser
    if (loser) {
      loser.defeatTimer = ROUND_RULES.roundMessageFrames;
      loser.state = 'defeat';
    }

    if (winner.roundsWon >= ROUND_RULES.winsToFinish) {
      if (isBattlePlanMode() && winner === p1 && game.battlePlan.currentIndex < game.battlePlan.route.length - 1) {
        queueNextBattlePlanMatch();
        return;
      }

      if (isBattlePlanMode() && winner === p2 && game.credits > 0) {
        showContinueScreen();
        return;
      }

      game.state = GAME_STATES.GAME_OVER;
      game.roundMessageTimer = ROUND_RULES.gameOverMessageFrames;
      if (isBattlePlanMode() && winner === p1) game.battlePlan.cleared = true;
      if (isBattlePlanMode() && winner === p2) game.credits = 3;
      return;
    }
  } else {
    game.roundMessage = 'DRAW!';
    playRoundCue('draw');
  }

  game.round++;
}

const CONTINUE_COUNTDOWN_SECONDS = 10;

function showContinueScreen() {
  game.state = GAME_STATES.CONTINUE;
  game.continueCountdown = CONTINUE_COUNTDOWN_SECONDS;
  if (game.timerInterval) clearInterval(game.timerInterval);
  syncMusicMode();

  ui.continueScreen.style.display = 'flex';
  ui.continueCountdown.textContent = game.continueCountdown;
  ui.creditsCount.textContent = game.credits;

  if (game.continueTimerInterval) clearInterval(game.continueTimerInterval);
  game.continueTimerInterval = setInterval(() => {
    game.continueCountdown--;
    ui.continueCountdown.textContent = game.continueCountdown;
    if (game.continueCountdown <= 0) {
      declineContinue();
    }
  }, 1000);
}

function hideContinueScreen() {
  ui.continueScreen.style.display = 'none';
  if (game.continueTimerInterval) {
    clearInterval(game.continueTimerInterval);
    game.continueTimerInterval = null;
  }
}

function acceptContinue() {
  game.credits--;
  hideContinueScreen();
  game.round = 1;
  p1.roundsWon = 0;
  p2.roundsWon = 0;
  updateRoundDots();
  loadBattlePlanMatch();
  startRound();
  startGameLoop();
}

function declineContinue() {
  hideContinueScreen();
  game.credits = 3;
  resetBattlePlanState();
  openTitleScreen();
}

function updateRoundDots() {
  ui.roundDots.p1r1.className = 'round-dot' + (p1.roundsWon >= 1 ? ' won-p1' : '');
  ui.roundDots.p1r2.className = 'round-dot' + (p1.roundsWon >= 2 ? ' won-p1' : '');
  ui.roundDots.p2r1.className = 'round-dot' + (p2.roundsWon >= 1 ? ' won-p2' : '');
  ui.roundDots.p2r2.className = 'round-dot' + (p2.roundsWon >= 2 ? ' won-p2' : '');
}

function updateUI() {
  ui.p1Health.style.width = p1.health + '%';
  ui.p2Health.style.width = p2.health + '%';
  ui.p1Special.style.width = p1.special + '%';
  ui.p2Special.style.width = p2.special + '%';
  ui.p1Passive.style.width = p1.passiveSpecial + '%';
  ui.p2Passive.style.width = p2.passiveSpecial + '%';
  ui.timer.textContent = game.timer;

  const p1HasPassive = hasPassiveSpecialAbility(p1);
  const p2HasPassive = hasPassiveSpecialAbility(p2);
  ui.p1PassiveContainer.style.visibility = p1HasPassive ? 'visible' : 'hidden';
  ui.p2PassiveContainer.style.visibility = p2HasPassive ? 'visible' : 'hidden';
  ui.p1PassiveLabel.style.visibility = p1HasPassive ? 'visible' : 'hidden';
  ui.p2PassiveLabel.style.visibility = p2HasPassive ? 'visible' : 'hidden';

  // Blinking effect when special is ready
  ui.p1Special.classList.toggle('ready', p1.special >= SPECIAL_METER_MAX);
  ui.p2Special.classList.toggle('ready', p2.special >= SPECIAL_METER_MAX);

  if (p1.special >= SPECIAL_METER_MAX && !audio.readyCues.p1) {
    audio.readyCues.p1 = true;
    playRoundCue('meter');
  } else if (p1.special < SPECIAL_METER_MAX) {
    audio.readyCues.p1 = false;
  }

  if (p2.special >= SPECIAL_METER_MAX && !audio.readyCues.p2) {
    audio.readyCues.p2 = true;
    playRoundCue('meter');
  } else if (p2.special < SPECIAL_METER_MAX) {
    audio.readyCues.p2 = false;
  }

  // Combo counter display
  const now = Date.now();

  if (p1.comboCount >= 2 && now - p1.lastHitTime < COMBAT.comboResetMs) {
    ui.p1Combo.textContent = p1.comboCount + '-HIT COMBO';
    ui.p1Combo.classList.add('active');
  } else if (p1.maxComboTimer > 0) {
    p1.maxComboTimer--;
    ui.p1Combo.textContent = 'MAX COMBO';
    ui.p1Combo.classList.add('active');
  } else {
    ui.p1Combo.classList.remove('active');
  }

  if (p2.comboCount >= 2 && now - p2.lastHitTime < COMBAT.comboResetMs) {
    ui.p2Combo.textContent = p2.comboCount + '-HIT COMBO';
    ui.p2Combo.classList.add('active');
  } else if (p2.maxComboTimer > 0) {
    p2.maxComboTimer--;
    ui.p2Combo.textContent = 'MAX COMBO';
    ui.p2Combo.classList.add('active');
  } else {
    ui.p2Combo.classList.remove('active');
  }
}


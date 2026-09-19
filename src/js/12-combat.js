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

function updatePortrait(char, container, playerKey) {
  container.innerHTML = '';
  
  const sprite = createDogSprite(char.color1, char.color2, char.eyeColor, char.name, 1, 0, 'idle');
  container.appendChild(cloneCanvas(sprite));
  
  const info = document.createElement('div');
  info.className = 'char-portrait-info';
  const streak = playerKey ? game.winStreak[playerKey] : 0;
  const showStreak = (playerKey === 'p1' && (game.mode === MATCH_MODES.VERSUS || game.mode === MATCH_MODES.CPU)) || (playerKey === 'p2' && game.mode === MATCH_MODES.VERSUS);
  const streakHtml = (showStreak && streak > 1) ? `<div class="char-win-streak" style="color: ${playerKey === 'p1' ? '#ff6b6b' : '#74b9ff'}">${streak}-WIN STREAK</div>` : '';
  info.innerHTML = `
    <div class="char-portrait-name">${char.name}</div>
    <div class="char-portrait-stats">
      <span>HP:</span> ${char.health} &bull; <span>SPD:</span> ${char.speed}<br>
      <span>${char.desc}</span>
    </div>
    ${streakHtml}
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
      } else if (!p2Confirmed && !p2Randomizing && !isBattlePlanMode()) {
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

  updatePortrait(CHARACTERS[p1Selection], ui.p1Portrait, 'p1');
  updatePortrait(CHARACTERS[p2Selection], ui.p2Portrait, 'p2');
}

function confirmSelection() {
  if (selectionConfirmTimer) {
    clearTimeout(selectionConfirmTimer);
    selectionConfirmTimer = null;
  }
  if (charSelectCountdownInterval) {
    clearInterval(charSelectCountdownInterval);
    charSelectCountdownInterval = null;
  }
  clearCharSelectRandomizers();

  if (isBattlePlanMode()) {
    if (!game.battlePlan.route.length || game.battlePlan.playerCharacterId !== CHARACTERS[p1Selection].id) {
      prepareBattlePlanRoute(CHARACTERS[p1Selection].id);
    }
    loadBattlePlanMatch();
  } else if (isTeamVsTeamMode()) {
    game.stage = pickRandomBackgroundStage();
    p1 = new Fighter(PLAYER_SPAWNS.teamA1, CHARACTERS[p1Selection], 1);
    p1.team = 'A';
    p2 = new Fighter(PLAYER_SPAWNS.teamA2, CHARACTERS[p2Selection], 1);
    p2.team = 'A';
    cpu1 = new Fighter(PLAYER_SPAWNS.teamB1, CHARACTERS[cpu1Selection], -1);
    cpu1.team = 'B';
    cpu2 = new Fighter(PLAYER_SPAWNS.teamB2, CHARACTERS[cpu2Selection], -1);
    cpu2.team = 'B';
    createTeamHUD();
    ui.p1Name.textContent = p1.name;
    ui.p2Name.textContent = p2.name;
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
  if (!p2Confirmed && !p2Randomizing && !isBattlePlanMode()) {
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
  if (attacker.team && defender.team && attacker.team === defender.team) return;
  if (attacker.health <= 0 || defender.health <= 0) return;
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
    if (!(attackerSpecialName === 'SKORPDOG' || attackerSpecialName === 'SUBDOG' || attackerSpecialName === 'SEKDOG' || attackerSpecialName === 'CYDOG' || attackerSpecialName === 'TREMODOG' || attackerSpecialName === 'RAYNDOG' || attackerSpecialName === 'RAYDOG' || attackerSpecialName === 'NOOB SAIDOG' || attackerSpecialName === 'REPDOG' || attackerSpecialName === 'SNEK' || attackerSpecialName === 'DOGGABAL' || attackerSpecialName === 'KANOINE' || attackerSpecialName === 'MAKDOG' || attackerSpecialName === 'SMOWKDAWG') || attacker.lastAttackType === 'special') {
      attacker.special = Math.min(SPECIAL_METER_MAX, attacker.special + atkBox.dmg * COMBAT.meter.onHitMultiplier);
    }
    attacker.comboCount++;
    attacker.lastHitTime = Date.now();

    if (attacker.comboCount >= 10) {
      attacker.vx = -attacker.facing * 20;
      defender.vx = attacker.facing * 20;
      addParticle(attacker.x, attacker.y - 50, 'ko');
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
  if (isTeamVsTeamMode()) {
    p1.reset(PLAYER_SPAWNS.teamA1);
    p2.reset(PLAYER_SPAWNS.teamA2);
    cpu1.reset(PLAYER_SPAWNS.teamB1);
    cpu2.reset(PLAYER_SPAWNS.teamB2);
  } else {
    p1.reset(PLAYER_SPAWNS.p1);
    p2.reset(PLAYER_SPAWNS.p2);
  }
  resetInputState(keys1);
  resetInputState(keys2);
  resetInputState(cpuKeys);
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

  if (isTeamVsTeamMode()) {
    endRoundTeam();
    return;
  }

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
    const unlockedPixzel = battlePlanMatchComplete && winner === p1 && game.battlePlan.currentIndex === game.battlePlan.route.length - 1
      && game.battlePlan.playerCharacterId === 'doggomeleon'
      && unlockHiddenCharacter('pixzel');
    const unlockMessage = [unlockedBoss ? `${p2.name} UNLOCKED!` : '', unlockedSnek ? 'SNEK UNLOCKED!' : '', unlockedPixzel ? 'PIXZEL ZLASZH UNLOCKED!' : '']
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

      if (game.mode === MATCH_MODES.VERSUS || game.mode === MATCH_MODES.CPU) {
        if (winner === p1) {
          game.winStreak.p1++;
          game.winStreak.p2 = 0;
        } else {
          if (game.mode === MATCH_MODES.VERSUS) game.winStreak.p2++;
          game.winStreak.p1 = 0;
        }
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

function endRoundTeam() {
  const teamAAlive = getTeamFighters('A');
  const teamBAlive = getTeamFighters('B');
  const teamATotal = getTeamTotalHealth('A');
  const teamBTotal = getTeamTotalHealth('B');

  let winningTeam = null;
  if (teamAAlive.length > 0 && teamBAlive.length === 0) winningTeam = 'A';
  else if (teamBAlive.length > 0 && teamAAlive.length === 0) winningTeam = 'B';
  else if (teamAAlive.length > 0 && teamBAlive.length > 0) {
    if (teamATotal > teamBTotal) winningTeam = 'A';
    else if (teamBTotal > teamATotal) winningTeam = 'B';
  }

  if (winningTeam) {
    if (winningTeam === 'A') {
      game.teamRoundsWon.A++;
      game.roundMessage = 'TEAM A\nWINS!';
    } else {
      game.teamRoundsWon.B++;
      game.roundMessage = 'TEAM B\nWINS!';
    }
    updateTeamRoundDots();
    playRoundCue('win');

    const allFighters = getAllFighters();
    allFighters.forEach(f => {
      if (!f) return;
      if (f.health > 0 && f.team === winningTeam) {
        f.victoryTimer = ROUND_RULES.roundMessageFrames;
        f.state = 'victory';
      } else {
        f.defeatTimer = ROUND_RULES.roundMessageFrames;
        f.state = 'defeat';
      }
    });

    if (game.teamRoundsWon.A >= ROUND_RULES.winsToFinish || game.teamRoundsWon.B >= ROUND_RULES.winsToFinish) {
      if (game.teamRoundsWon.A >= ROUND_RULES.winsToFinish) {
        game.winStreak.p1++;
        game.winStreak.p2 = 0;
      } else {
        game.winStreak.p1 = 0;
      }
      game.state = GAME_STATES.GAME_OVER;
      game.roundMessageTimer = ROUND_RULES.gameOverMessageFrames;
      game.roundMessage = winningTeam === 'A' ? 'TEAM A\nWINS THE MATCH!' : 'TEAM B\nWINS THE MATCH!';
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

  // Win streak display (2 Player and VS CPU modes)
  const showP1Streak = game.mode === MATCH_MODES.VERSUS || game.mode === MATCH_MODES.CPU;
  const showP2Streak = game.mode === MATCH_MODES.VERSUS;
  const p1Streak = showP1Streak ? game.winStreak.p1 : 0;
  const p2Streak = showP2Streak ? game.winStreak.p2 : 0;
  ui.p1WinStreak.style.display = p1Streak > 1 ? 'block' : 'none';
  ui.p2WinStreak.style.display = p2Streak > 1 ? 'block' : 'none';
  if (p1Streak > 1) ui.p1WinStreak.textContent = p1Streak + '-WIN STREAK';
  if (p2Streak > 1) ui.p2WinStreak.textContent = p2Streak + '-WIN STREAK';

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

  if (isTeamVsTeamMode()) updateTeamUI();
}

function createTeamHUD() {
  removeTeamHUD();
  const overlay = document.getElementById('ui-overlay');
  const el = {};

  document.getElementById('health-bars').style.display = 'none';
  document.getElementById('special-bars').style.display = 'none';
  document.getElementById('passive-bars').style.display = 'none';
  ui.p1Name.style.display = 'none';
  ui.p2Name.style.display = 'none';
  ui.p1SpecialLabel.style.display = 'none';
  ui.p2SpecialLabel.style.display = 'none';
  ui.p1PassiveLabel.style.display = 'none';
  ui.p2PassiveLabel.style.display = 'none';
  ui.p1Combo.style.display = 'none';
  ui.p2Combo.style.display = 'none';
  ui.p1WinStreak.style.display = 'none';
  ui.p2WinStreak.style.display = 'none';
  document.getElementById('p1-rounds').style.display = 'none';
  document.getElementById('p2-rounds').style.display = 'none';

  el.container = document.createElement('div');
  el.container.id = 'team-hud';
  el.container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';

  function makeBar(id, color, floatRight) {
    const wrap = document.createElement('div');
    wrap.className = 'team-bar-wrap';
    wrap.id = id + '-wrap';
    const bar = document.createElement('div');
    bar.className = 'team-bar';
    bar.id = id;
    bar.style.background = color;
    if (floatRight) bar.style.float = 'right';
    bar.style.width = '100%';
    wrap.appendChild(bar);
    return { wrap, bar };
  }

  function makeLabel(id, text, color) {
    const lbl = document.createElement('span');
    lbl.className = 'team-label';
    lbl.id = id;
    lbl.textContent = text;
    lbl.style.color = color;
    return lbl;
  }

  const sides = [
    { prefix: 'a', x: 'left', color1: '#ff6b6b', color2: '#c0392b', pColor: '#81ecec' },
    { prefix: 'b', x: 'right', color1: '#74b9ff', color2: '#2980b9', pColor: '#a29bfe' }
  ];

  el.sideBars = {};

  sides.forEach(s => {
    const sideEl = {};
    const xStyle = s.x + ':12px;';

    const h1 = makeBar('team-' + s.prefix + '-h1', `linear-gradient(180deg, ${s.color1}, ${s.color2})`, s.x === 'right');
    h1.wrap.style.cssText = `position:absolute;top:10px;${xStyle}width:38%;height:16px;background:#222;border:2px solid #888;overflow:hidden;`;
    el.container.appendChild(h1.wrap);
    sideEl.h1 = h1.bar;

    const n1 = makeLabel('team-' + s.prefix + '-n1', '', s.color1);
    n1.style.cssText = `position:absolute;top:30px;${xStyle}font-size:9px;font-family:'Press Start 2P',monospace;text-shadow:1px 1px #000;`;
    el.container.appendChild(n1);
    sideEl.n1 = n1;

    const s1 = makeBar('team-' + s.prefix + '-s1', `linear-gradient(90deg, ${s.color2}, ${s.color1})`, s.x === 'right');
    s1.wrap.style.cssText = `position:absolute;top:42px;${xStyle}width:26%;height:10px;background:#111;border:1px solid #555;overflow:hidden;`;
    el.container.appendChild(s1.wrap);
    sideEl.s1 = s1.bar;

    const p1 = makeBar('team-' + s.prefix + '-p1', `linear-gradient(90deg, ${s.pColor}, ${s.pColor})`, s.x === 'right');
    p1.wrap.style.cssText = `position:absolute;top:54px;${xStyle}width:26%;height:10px;background:#111;border:1px solid #555;overflow:hidden;display:none;`;
    el.container.appendChild(p1.wrap);
    sideEl.p1 = p1.bar;
    sideEl.p1Wrap = p1.wrap;

    const h2 = makeBar('team-' + s.prefix + '-h2', `linear-gradient(180deg, ${s.color1}, ${s.color2})`, s.x === 'right');
    h2.wrap.style.cssText = `position:absolute;top:70px;${xStyle}width:38%;height:16px;background:#222;border:2px solid #888;overflow:hidden;`;
    el.container.appendChild(h2.wrap);
    sideEl.h2 = h2.bar;

    const n2 = makeLabel('team-' + s.prefix + '-n2', '', s.color1);
    n2.style.cssText = `position:absolute;top:90px;${xStyle}font-size:9px;font-family:'Press Start 2P',monospace;text-shadow:1px 1px #000;`;
    el.container.appendChild(n2);
    sideEl.n2 = n2;

    const s2 = makeBar('team-' + s.prefix + '-s2', `linear-gradient(90deg, ${s.color2}, ${s.color1})`, s.x === 'right');
    s2.wrap.style.cssText = `position:absolute;top:102px;${xStyle}width:26%;height:10px;background:#111;border:1px solid #555;overflow:hidden;`;
    el.container.appendChild(s2.wrap);
    sideEl.s2 = s2.bar;

    const p2 = makeBar('team-' + s.prefix + '-p2', `linear-gradient(90deg, ${s.pColor}, ${s.pColor})`, s.x === 'right');
    p2.wrap.style.cssText = `position:absolute;top:114px;${xStyle}width:26%;height:10px;background:#111;border:1px solid #555;overflow:hidden;display:none;`;
    el.container.appendChild(p2.wrap);
    sideEl.p2 = p2.bar;
    sideEl.p2Wrap = p2.wrap;

    const c1 = document.createElement('div');
    c1.className = 'team-combo';
    c1.id = 'team-' + s.prefix + '-c1';
    c1.style.cssText = `position:absolute;bottom:140px;${xStyle}font-size:14px;font-family:'Press Start 2P',monospace;color:${s.color1};text-shadow:2px 2px #000;opacity:0;transition:opacity 0.15s;`;
    el.container.appendChild(c1);
    sideEl.c1 = c1;

    const c2 = document.createElement('div');
    c2.className = 'team-combo';
    c2.id = 'team-' + s.prefix + '-c2';
    c2.style.cssText = `position:absolute;bottom:100px;${xStyle}font-size:14px;font-family:'Press Start 2P',monospace;color:${s.color1};text-shadow:2px 2px #000;opacity:0;transition:opacity 0.15s;`;
    el.container.appendChild(c2);
    sideEl.c2 = c2;

    const rd = document.createElement('div');
    rd.className = 'team-round-dots';
    rd.id = 'team-' + s.prefix + '-rounds';
    rd.style.cssText = `position:absolute;top:8px;${s.x === 'left' ? 'left:300px' : 'right:300px'};`;
    rd.innerHTML = '<span class="round-dot" id="team-' + s.prefix + '-r1"></span><span class="round-dot" id="team-' + s.prefix + '-r2"></span>';
    el.container.appendChild(rd);
    sideEl.r1 = rd.querySelector('#team-' + s.prefix + '-r1');
    sideEl.r2 = rd.querySelector('#team-' + s.prefix + '-r2');

    el.sideBars[s.prefix] = sideEl;
  });

  overlay.appendChild(el.container);
  teamUI.elements = el;
}

function removeTeamHUD() {
  const existing = document.getElementById('team-hud');
  if (existing) existing.remove();
  teamUI.elements = null;

  document.getElementById('health-bars').style.display = '';
  document.getElementById('special-bars').style.display = '';
  document.getElementById('passive-bars').style.display = '';
  ui.p1Name.style.display = '';
  ui.p2Name.style.display = '';
  ui.p1SpecialLabel.style.display = '';
  ui.p2SpecialLabel.style.display = '';
  ui.p1PassiveLabel.style.display = '';
  ui.p2PassiveLabel.style.display = '';
  ui.p1Combo.style.display = '';
  ui.p2Combo.style.display = '';
  document.getElementById('p1-rounds').style.display = '';
  document.getElementById('p2-rounds').style.display = '';
}

function updateTeamRoundDots() {
  if (!teamUI.elements) return;
  const el = teamUI.elements;
  el.sideBars.a.r1.className = 'round-dot' + (game.teamRoundsWon.A >= 1 ? ' won-p1' : '');
  el.sideBars.a.r2.className = 'round-dot' + (game.teamRoundsWon.A >= 2 ? ' won-p1' : '');
  el.sideBars.b.r1.className = 'round-dot' + (game.teamRoundsWon.B >= 1 ? ' won-p2' : '');
  el.sideBars.b.r2.className = 'round-dot' + (game.teamRoundsWon.B >= 2 ? ' won-p2' : '');
}

function updateTeamUI() {
  if (!teamUI.elements) return;
  const el = teamUI.elements;
  const now = Date.now();

  function updateFighterBars(sideEl, fighter, suffix) {
    if (!fighter) return;
    sideEl['h' + suffix].style.width = Math.max(0, fighter.health) + '%';
    sideEl['s' + suffix].style.width = fighter.special + '%';
    const hasP = hasPassiveSpecialAbility(fighter);
    sideEl['p' + suffix + 'Wrap'].style.display = hasP ? 'block' : 'none';
    if (hasP) sideEl['p' + suffix].style.width = fighter.passiveSpecial + '%';

    const comboEl = sideEl['c' + suffix];
    if (fighter.comboCount >= 2 && now - fighter.lastHitTime < COMBAT.comboResetMs) {
      comboEl.textContent = fighter.comboCount + '-HIT COMBO';
      comboEl.style.opacity = '1';
    } else if (fighter.maxComboTimer > 0) {
      fighter.maxComboTimer--;
      comboEl.textContent = 'MAX COMBO';
      comboEl.style.opacity = '1';
    } else {
      comboEl.style.opacity = '0';
    }
  }

  el.sideBars.a.n1.textContent = p1.name;
  el.sideBars.a.n2.textContent = p2.name;
  el.sideBars.b.n1.textContent = cpu1.name + ' CPU';
  el.sideBars.b.n2.textContent = cpu2.name + ' CPU';

  updateFighterBars(el.sideBars.a, p1, '1');
  updateFighterBars(el.sideBars.a, p2, '2');
  updateFighterBars(el.sideBars.b, cpu1, '1');
  updateFighterBars(el.sideBars.b, cpu2, '2');
}


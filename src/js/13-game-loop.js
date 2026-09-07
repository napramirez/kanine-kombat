function startGameLoop() {
  if (gameLoopStarted) return;
  gameLoopStarted = true;
  requestAnimationFrame(gameLoop);
}

function openCharacterSelect(resetRounds = false) {
  if (selectionConfirmTimer) {
    clearTimeout(selectionConfirmTimer);
    selectionConfirmTimer = null;
  }

  if (game.timerInterval) clearInterval(game.timerInterval);

  if (resetRounds) {
    p1.roundsWon = 0;
    p2.roundsWon = 0;
    game.round = 1;
    updateRoundDots();
  }

  ui.startScreen.style.display = 'none';
  ui.charSelect.style.display = 'flex';
  hideBattlePlanStepper();
  hidePauseOverlay();
  game.state = GAME_STATES.CHAR_SELECT;
  clearCharSelectRandomizers();
  clearAllGamepadHeld();
  syncMusicMode();
  p1Confirmed = false;
  p2Confirmed = isBattlePlanMode();
  resetInputState(keys2);
  p1Selection = getSelectableCharacterIndex(p1Selection);
  p2Selection = getSelectableCharacterIndex(p2Selection, p1Selection);
  if (isBattlePlanMode()) {
    resetBattlePlanState();
    p2Selection = randomCpuSelection();
  } else if (isCpuMode()) {
    p2Selection = randomCpuSelection();
  }
  buildCharSelect();

  charSelectCountdown = CHAR_SELECT_TIMER_SECONDS;
  if (charSelectCountdownInterval) clearInterval(charSelectCountdownInterval);
  charSelectCountdownInterval = setInterval(() => {
    if (game.state !== GAME_STATES.CHAR_SELECT) return;
    charSelectCountdown--;
    ui.charSelectTimer.textContent = charSelectCountdown;
    if (charSelectCountdown <= 0) {
      clearInterval(charSelectCountdownInterval);
      charSelectCountdownInterval = null;
      if (!p1Confirmed) p1Confirmed = true;
      if (!p2Confirmed) p2Confirmed = true;
      updateCharSelect();
      queueSelectionConfirmIfReady();
    }
  }, 1000);
  ui.charSelectTimer.textContent = charSelectCountdown;
}

// Fullscreen
function isFullscreen() {
  return !!document.fullscreenElement;
}

function updateFullscreenScale() {
  const el = document.getElementById('gameContainer');
  if (!isFullscreen()) {
    canvas.width = 1024;
    canvas.height = 600;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.style.border = '';
    el.style.transform = '';
    el.classList.remove('fs-active');
    return;
  }
  const sw = window.screen.width;
  const sh = window.screen.height;
  canvas.width = sw;
  canvas.height = sh;
  ctx.setTransform(sw / 1024, 0, 0, sh / 600, 0, 0);
  canvas.style.border = 'none';
  el.classList.add('fs-active');
}

function updateFullscreenButtons() {
  const label = isFullscreen() ? 'WINDOWED' : 'FULLSCREEN';
  ui.fullscreenBtn.textContent = label;
  ui.fullscreenBtnPause.textContent = label;
}

function toggleFullscreen() {
  if (isFullscreen()) {
    document.exitFullscreen();
  } else {
    document.getElementById('gameContainer').requestFullscreen().then(updateFullscreenScale);
  }
}

document.addEventListener('fullscreenchange', () => {
  updateFullscreenScale();
  updateFullscreenButtons();
});

ui.fullscreenBtn.addEventListener('click', toggleFullscreen);
ui.fullscreenBtnPause.addEventListener('click', toggleFullscreen);

ui.startScreen.addEventListener('pointerdown', () => {
  if (game.state === GAME_STATES.MENU) ensureAudioReady();
});

// Input handling
document.addEventListener('keydown', e => {
  if (game.state === GAME_STATES.BATTLE_PLAN_STEPPER) return;

  if (e.key === 'p' || e.key === 'NumpadAdd') {
    e.preventDefault();
    if (game.state === GAME_STATES.FIGHT) showPauseOverlay(GAME_STATES.FIGHT);
    else if (game.state === GAME_STATES.BATTLE_PLAN_STEPPER) showPauseOverlay(GAME_STATES.BATTLE_PLAN_STEPPER);
    else if (game.state === GAME_STATES.PAUSED) resumePausedSession();
    else if (game.state === GAME_STATES.CHAR_SELECT) openTitleScreen();
    return;
  }

  if (game.state === GAME_STATES.PAUSED) return;

  if (game.state === GAME_STATES.CONTINUE) {
    const k = e.key.toLowerCase();
    if (k === 'j' || k === '1' || e.key === 'Numpad1') {
      ensureAudioReady();
      acceptContinue();
      e.preventDefault();
    }
    return;
  }

  const k = e.key.toLowerCase();
  if (k === 'a') keys1.left = true;
  if (k === 'd') keys1.right = true;
  if (k === 'w') keys1.up = true;
  if (k === 's') keys1.down = true;
  if (k === 'h') keys1.block = true;
  if (k === 'j') { ensureAudioReady(); p1.attack('punch'); e.preventDefault(); }
  if (k === 'k') { ensureAudioReady(); p1.attack('kick'); e.preventDefault(); }
  if (k === 'l') { ensureAudioReady(); p1.attack('special'); e.preventDefault(); }

  if (!isCpuControlledMode()) {
    if (e.key === 'ArrowLeft') { keys2.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys2.right = true; e.preventDefault(); }
    if (e.key === 'ArrowUp') { keys2.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown') { keys2.down = true; e.preventDefault(); }
    if (e.key === 'Numpad4') keys2.block = true;
    if (k === '1' || e.key === 'Numpad1') { ensureAudioReady(); p2.attack('punch'); e.preventDefault(); }
    if (k === '2' || e.key === 'Numpad2') { ensureAudioReady(); p2.attack('kick'); e.preventDefault(); }
    if (k === '3' || e.key === 'Numpad3') { ensureAudioReady(); p2.attack('special'); e.preventDefault(); }
  }
});

document.addEventListener('keyup', e => {
  if (game.state === GAME_STATES.PAUSED) return;
  if (game.state === GAME_STATES.BATTLE_PLAN_STEPPER) return;

  const k = e.key.toLowerCase();
  if (k === 'a') keys1.left = false;
  if (k === 'd') keys1.right = false;
  if (k === 'w') keys1.up = false;
  if (k === 's') keys1.down = false;
  if (k === 'h') keys1.block = false;

  if (!isCpuControlledMode()) {
    if (e.key === 'ArrowLeft') keys2.left = false;
    if (e.key === 'ArrowRight') keys2.right = false;
    if (e.key === 'ArrowUp') keys2.up = false;
    if (e.key === 'ArrowDown') keys2.down = false;
    if (e.key === 'Numpad4') keys2.block = false;
  }
});

// Main game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (game.state === GAME_STATES.PAUSED) {
    ctx.save();
    if (game.pause.snapshotCanvas) ctx.drawImage(game.pause.snapshotCanvas, 0, 0);
    ctx.restore();
    return;
  }

  if (game.hitStop > 0) {
    game.hitStop--;
    return;
  }

  // Screen shake
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  if (game.screenShake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * game.screenShake,
      (Math.random() - 0.5) * game.screenShake
    );
    game.screenShake *= 0.85;
    if (game.screenShake < 0.5) game.screenShake = 0;
  }

  drawBackground();

  if (game.state === GAME_STATES.FIGHT) {
    p1.update(mergeInputStates(keys1, gamepadInput.slots.p1.held, combinedKeys1), p2);
    if (isCpuControlledMode()) updateCpuInput(p2, p1);
    p2.update(isCpuControlledMode() ? keys2 : mergeInputStates(keys2, gamepadInput.slots.p2.held, combinedKeys2), p1);
    checkHit(p1, p2);
    checkHit(p2, p1);
    updateProjectiles(p2);
    updateProjectiles(p1);

    if (p1.health <= 0 || p2.health <= 0) {
      endRound();
    }
  } else if (game.state === GAME_STATES.COUNTDOWN) {
    if (game.countdownPhase === COUNTDOWN_PHASES.ROUND) {
      game.countdownTimer--;
      if (game.countdownTimer <= 0) {
        game.countdownPhase = COUNTDOWN_PHASES.FIGHT;
        playRoundCue('fight');
      }
    } else if (game.countdownPhase === COUNTDOWN_PHASES.FIGHT) {
      game.countdownFightTimer--;
      if (game.countdownFightTimer <= 0) {
        game.state = GAME_STATES.FIGHT;
        startTimer();
      }
    }
  } else if (game.state === GAME_STATES.ROUND_END || game.state === GAME_STATES.GAME_OVER) {
    game.roundMessageTimer--;

    // Update victory/defeat animations
    if (p1.victoryTimer > 0) {
      p1.victoryTimer--;
      p1.frame++;
    }
    if (p2.victoryTimer > 0) {
      p2.victoryTimer--;
      p2.frame++;
    }
    if (p1.defeatTimer > 0) {
      p1.defeatTimer--;
      p1.frame++;
    }
    if (p2.defeatTimer > 0) {
      p2.defeatTimer--;
      p2.frame++;
    }

    if (game.roundMessageTimer <= 0 && game.state === GAME_STATES.ROUND_END) {
      if (isBattlePlanMode() && game.battlePlan.pendingAdvance) {
        showBattlePlanStepper(game.battlePlan.stepperFromIndex, game.battlePlan.currentIndex);
      } else {
        startRound();
      }
    }
  }

  updateParticles();

  p1.draw();
  p2.draw();
  drawProjectiles();
  drawParticles();

  // Draw countdown
  if (game.state === GAME_STATES.COUNTDOWN) {
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 72px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let text;
    let timer;
    if (game.countdownPhase === COUNTDOWN_PHASES.ROUND) {
      text = `Round ${game.round}`;
      timer = game.countdownTimer;
    } else {
      text = 'FIGHT!';
      timer = game.countdownFightTimer;
    }

    const introDuration = game.countdownPhase === COUNTDOWN_PHASES.ROUND
      ? ROUND_RULES.introRoundFrames
      : ROUND_RULES.introFightFrames;
    const scale = 1 + (timer / introDuration) * 0.3;
    ctx.save();
    ctx.translate(W / 2, H / 2 - 50);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  // Draw round message
  if ((game.state === GAME_STATES.ROUND_END || game.state === GAME_STATES.GAME_OVER) && game.roundMessageTimer > 0) {
    const msgAlpha = Math.min(1, game.roundMessageTimer / 30);
    ctx.globalAlpha = msgAlpha;
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = game.roundMessage.split('\n');
    lines.forEach((line, i) => {
      const y = H / 2 - 30 + i * 50;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.strokeText(line, W / 2, y);
      ctx.fillText(line, W / 2, y);
    });

    if (game.state === GAME_STATES.GAME_OVER && game.roundMessageTimer < ROUND_RULES.restartPromptFrames) {
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press SPACE or A to play again', W / 2, H / 2 + 80);
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  updateUI();
  ctx.restore();
}

// Start button
ui.startButton.addEventListener('click', () => {
  ensureAudioReady();
  game.mode = MATCH_MODES.VERSUS;
  playUiSound('start');
  openCharacterSelect();
});

ui.cpuButton.addEventListener('click', () => {
  ensureAudioReady();
  game.mode = MATCH_MODES.CPU;
  playUiSound('start');
  openCharacterSelect();
});

ui.battlePlanButton.addEventListener('click', () => {
  ensureAudioReady();
  game.mode = MATCH_MODES.BATTLE_PLAN;
  game.credits = 3;
  playUiSound('start');
  openCharacterSelect();
});

ui.pauseModeButtons.addEventListener('click', e => {
  const button = e.target.closest('[data-mode]');
  if (!button) return;

  const mode = button.dataset.mode;
  if (mode === MATCH_MODES.VERSUS || mode === MATCH_MODES.CPU || mode === MATCH_MODES.BATTLE_PLAN) {
    leavePausedSessionForMode(mode);
  }
});

titleModeButtons.forEach((button, index) => {
  const syncFocus = () => {
    gamepadInput.titleSelection = index;
    updateTitleModeFocus();
  };
  button.addEventListener('mouseenter', syncFocus);
  button.addEventListener('focus', syncFocus);
  button.addEventListener('click', syncFocus);
});

pauseModeButtons.forEach((button, index) => {
  const syncFocus = () => {
    gamepadInput.pauseSelection = index;
    updatePauseModeFocus();
  };
  button.addEventListener('mouseenter', syncFocus);
  button.addEventListener('focus', syncFocus);
  button.addEventListener('click', syncFocus);
});

window.addEventListener('gamepadconnected', startGamepadLoop);

window.addEventListener('gamepaddisconnected', e => {
  if (gamepadInput.slots.p1.index === e.gamepad.index) clearGamepadSlot(gamepadInput.slots.p1, true);
  if (gamepadInput.slots.p2.index === e.gamepad.index) clearGamepadSlot(gamepadInput.slots.p2, true);
});

window.addEventListener('blur', () => {
  resetAllGamepadState();
  resetInputState(keys1);
  resetInputState(keys2);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resetAllGamepadState();
    resetInputState(keys1);
    resetInputState(keys2);
  }
});

// Menu and state navigation
document.addEventListener('keydown', e => {
  if (game.state === GAME_STATES.MENU) {
    if (e.key === 'a' || e.key === 'A') { navigateTitleSelection(-1); e.preventDefault(); }
    else if (e.key === 'd' || e.key === 'D') { navigateTitleSelection(1); e.preventDefault(); }
    else if (e.key === 'w' || e.key === 'W') { navigateTitleSelection(-1); e.preventDefault(); }
    else if (e.key === 's' || e.key === 'S') { navigateTitleSelection(1); e.preventDefault(); }
    else if (e.key === 'l' || e.key === 'L') { ensureAudioReady(); titleModeButtons[gamepadInput.titleSelection].click(); e.preventDefault(); }
    else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') { navigateTitleSelection(-1); e.preventDefault(); }
    else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') { navigateTitleSelection(1); e.preventDefault(); }
    else if (e.key === '3' || e.key === 'Numpad3') { ensureAudioReady(); titleModeButtons[gamepadInput.titleSelection].click(); e.preventDefault(); }
    return;
  }

  if (game.state === GAME_STATES.PAUSED) {
    if (e.key === 'a' || e.key === 'A') { navigatePauseSelection(-1); e.preventDefault(); }
    else if (e.key === 'd' || e.key === 'D') { navigatePauseSelection(1); e.preventDefault(); }
    else if (e.key === 'w' || e.key === 'W') { navigatePauseSelection(-1); e.preventDefault(); }
    else if (e.key === 's' || e.key === 'S') { navigatePauseSelection(1); e.preventDefault(); }
    else if (e.key === 'l' || e.key === 'L') { ensureAudioReady(); pauseModeButtons[gamepadInput.pauseSelection].click(); e.preventDefault(); }
    else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') { navigatePauseSelection(-1); e.preventDefault(); }
    else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') { navigatePauseSelection(1); e.preventDefault(); }
    else if (e.key === '3' || e.key === 'Numpad3') { ensureAudioReady(); pauseModeButtons[gamepadInput.pauseSelection].click(); e.preventDefault(); }
    return;
  }

  if ((e.key === 'l' || e.key === 'L') && game.state === GAME_STATES.BATTLE_PLAN_STEPPER) {
    ensureAudioReady();
    proceedBattlePlanStepper();
  }

  if (e.code === 'Space' && game.state === GAME_STATES.GAME_OVER && game.roundMessageTimer < ROUND_RULES.restartPromptFrames) {
    ensureAudioReady();
    openCharacterSelect(true);
  }
});

// Prevent scroll
window.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});

updateTitleModeFocus();
startGamepadLoop();

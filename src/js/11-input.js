function resetInputState(keys) {
  keys.left = false;
  keys.right = false;
  keys.up = false;
  keys.down = false;
  keys.block = false;
}

function updateModeButtonFocus(buttons, selectionIndex) {
  buttons.forEach((button, index) => {
    button.classList.toggle('focused', index === selectionIndex);
  });
}

function updateTitleModeFocus() {
  updateModeButtonFocus(titleModeButtons, gamepadInput.titleSelection);
}

function updatePauseModeFocus() {
  updateModeButtonFocus(pauseModeButtons, gamepadInput.pauseSelection);
}

function clearGamepadSlotHeld(slot) {
  resetInputState(slot.held);
  slot.lastNavAt = 0;
}

function clearGamepadSlot(slot, releaseAssignment = false) {
  clearGamepadSlotHeld(slot);
  slot.prev = {};
  if (releaseAssignment) slot.index = -1;
}

function clearAllGamepadHeld() {
  clearGamepadSlotHeld(gamepadInput.slots.p1);
  clearGamepadSlotHeld(gamepadInput.slots.p2);
}

function resetAllGamepadState(releaseAssignments = false) {
  clearGamepadSlot(gamepadInput.slots.p1, releaseAssignments);
  clearGamepadSlot(gamepadInput.slots.p2, releaseAssignments);
}

function getGamepadBySlot(slotName, pads) {
  const slot = gamepadInput.slots[slotName];
  return slot.index >= 0 ? pads[slot.index] : null;
}

function isGamepadButtonPressed(gamepad, index) {
  return Boolean(gamepad && gamepad.buttons[index] && gamepad.buttons[index].pressed);
}

function readGamepadState(gamepad, prev) {
  const axisX = gamepad.axes[0] || 0;
  const axisY = gamepad.axes[1] || 0;
  const left = axisX <= -GAMEPAD_DEADZONE || (prev && prev.left && axisX <= -GAMEPAD_DEADZONE_RELEASE) || isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.dpadLeft);
  const right = axisX >= GAMEPAD_DEADZONE || (prev && prev.right && axisX >= GAMEPAD_DEADZONE_RELEASE) || isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.dpadRight);
  const up = axisY <= -GAMEPAD_DEADZONE || (prev && prev.up && axisY <= -GAMEPAD_DEADZONE_RELEASE) || isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.dpadUp);
  const down = axisY >= GAMEPAD_DEADZONE || (prev && prev.down && axisY >= GAMEPAD_DEADZONE_RELEASE) || isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.dpadDown);

  return {
    left,
    right,
    up,
    down,
    confirm: isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.confirm),
    back: isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.back),
    block: isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.block),
    special: isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.special),
    start: isGamepadButtonPressed(gamepad, GAMEPAD_BUTTONS.start)
  };
}

function isGamepadStateActive(state) {
  return state.left || state.right || state.up || state.down || state.confirm || state.back || state.block || state.special || state.start;
}

function isGamepadEdgePressed(slot, state, key) {
  return state[key] && !slot.prev[key];
}

function shouldRepeatMenuDirection(slot, dir, active, now) {
  if (!active) return false;
  if (now - (slot.lastNavAt || 0) < GAMEPAD_NAV_COOLDOWN_MS) return false;
  slot.lastNavAt = now;
  return true;
}

function shouldRepeatCharSelectDirection(slot, dir, active, now) {
  if (!active) return false;
  if (now - (slot.lastNavAt || 0) < GAMEPAD_NAV_COOLDOWN_MS) return false;
  slot.lastNavAt = now;
  return true;
}

function assignGamepadSlot(index) {
  if (gamepadInput.slots.p1.index === index || gamepadInput.slots.p2.index === index) return;
  if (gamepadInput.slots.p1.index === -1) gamepadInput.slots.p1.index = index;
  else if (gamepadInput.slots.p2.index === -1) gamepadInput.slots.p2.index = index;
}

function syncGamepadAssignments(pads) {
  ['p1', 'p2'].forEach(slotName => {
    const slot = gamepadInput.slots[slotName];
    if (slot.index >= 0 && !pads[slot.index]) clearGamepadSlot(slot, true);
  });

  pads.forEach(gamepad => {
    if (!gamepad) return;
    const state = readGamepadState(gamepad);
    if (!isGamepadStateActive(state)) return;
    assignGamepadSlot(gamepad.index);
  });
}

function mergeInputStates(keyboardState, gamepadState, output) {
  output.left = keyboardState.left || gamepadState.left;
  output.right = keyboardState.right || gamepadState.right;
  output.up = keyboardState.up || gamepadState.up;
  output.down = keyboardState.down || gamepadState.down;
  output.block = keyboardState.block || gamepadState.block;
  return output;
}

function navigateTitleSelection(delta) {
  gamepadInput.titleSelection = (gamepadInput.titleSelection + delta + titleModeButtons.length) % titleModeButtons.length;
  updateTitleModeFocus();
  ensureAudioReady();
  playUiSound('navigate');
}

function navigatePauseSelection(delta) {
  gamepadInput.pauseSelection = (gamepadInput.pauseSelection + delta + pauseModeButtons.length) % pauseModeButtons.length;
  updatePauseModeFocus();
  ensureAudioReady();
  playUiSound('navigate');
}

function handleGamepadTitleInput(slot, state, now) {
  const left = state.left && !state.right;
  const right = state.right && !state.left;

  if (shouldRepeatMenuDirection(slot, 'left', left, now)) navigateTitleSelection(-1);
  else if (shouldRepeatMenuDirection(slot, 'right', right, now)) navigateTitleSelection(1);

  if (isGamepadEdgePressed(slot, state, 'special') || isGamepadEdgePressed(slot, state, 'start')) {
    ensureAudioReady();
    titleModeButtons[gamepadInput.titleSelection].click();
  }
}

function handleGamepadPauseInput(slot, state, now) {
  const left = state.left && !state.right;
  const right = state.right && !state.left;
  const up = state.up && !state.down;
  const down = state.down && !state.up;

  if (shouldRepeatMenuDirection(slot, 'left', left || up, now)) navigatePauseSelection(-1);
  else if (shouldRepeatMenuDirection(slot, 'right', right || down, now)) navigatePauseSelection(1);

  if (isGamepadEdgePressed(slot, state, 'special')) {
    ensureAudioReady();
    pauseModeButtons[gamepadInput.pauseSelection].click();
  }

  if (isGamepadEdgePressed(slot, state, 'start') || isGamepadEdgePressed(slot, state, 'back')) {
    resumePausedSession();
  }
}

function handleGamepadCharacterSelectInput(slotName, slot, state, now) {
  if (isGamepadEdgePressed(slot, state, 'back')) {
    openTitleScreen();
    return;
  }

  if (slotName === 'p1') {
    if (!p1Confirmed && !p1Randomizing) {
      const left = state.left && !state.right;
      const right = state.right && !state.left;
      const up = state.up && !state.down;
      const down = state.down && !state.up;

      if (shouldRepeatCharSelectDirection(slot, 'left', left, now)) {
        ensureAudioReady();
        p1Selection = moveCharSelection(p1Selection, -1, 0);
        updateCharSelect();
        playUiSound('navigate');
      } else if (shouldRepeatCharSelectDirection(slot, 'right', right, now)) {
        ensureAudioReady();
        p1Selection = moveCharSelection(p1Selection, 1, 0);
        updateCharSelect();
        playUiSound('navigate');
      } else if (shouldRepeatCharSelectDirection(slot, 'up', up, now)) {
        ensureAudioReady();
        p1Selection = moveCharSelection(p1Selection, 0, -1);
        updateCharSelect();
        playUiSound('navigate');
      } else if (shouldRepeatCharSelectDirection(slot, 'down', down, now)) {
        ensureAudioReady();
        p1Selection = moveCharSelection(p1Selection, 0, 1);
        updateCharSelect();
        playUiSound('navigate');
      }

if (isGamepadEdgePressed(slot, state, 'special')) {
        ensureAudioReady();
        p1Confirmed = true;
        updateCharSelect();
        playUiSound('confirm');
      }

      if (isGamepadEdgePressed(slot, state, 'special')) {
        ensureAudioReady();
        startRandomCharacterSelect('p1');
      }
    }
  } else if (!isBattlePlanMode() && !p2Confirmed && !p2Randomizing) {
    const left = state.left && !state.right;
    const right = state.right && !state.left;
    const up = state.up && !state.down;
    const down = state.down && !state.up;

    if (shouldRepeatCharSelectDirection(slot, 'left', left, now)) {
      ensureAudioReady();
      p2Selection = moveCharSelection(p2Selection, -1, 0);
      updateCharSelect();
      playUiSound('navigate');
    } else if (shouldRepeatCharSelectDirection(slot, 'right', right, now)) {
      ensureAudioReady();
      p2Selection = moveCharSelection(p2Selection, 1, 0);
      updateCharSelect();
      playUiSound('navigate');
    } else if (shouldRepeatCharSelectDirection(slot, 'up', up, now)) {
      ensureAudioReady();
      p2Selection = moveCharSelection(p2Selection, 0, -1);
      updateCharSelect();
      playUiSound('navigate');
    } else if (shouldRepeatCharSelectDirection(slot, 'down', down, now)) {
      ensureAudioReady();
      p2Selection = moveCharSelection(p2Selection, 0, 1);
      updateCharSelect();
      playUiSound('navigate');
    }

    if (isGamepadEdgePressed(slot, state, 'confirm')) {
      ensureAudioReady();
      p2Confirmed = true;
      updateCharSelect();
      playUiSound('confirm');
    }

    if (isGamepadEdgePressed(slot, state, 'special')) {
      ensureAudioReady();
      startRandomCharacterSelect('p2');
    }
  }

  queueSelectionConfirmIfReady();
}

function handleGamepadBattlePlanInput(slot, state) {
  if (isGamepadEdgePressed(slot, state, 'confirm')) {
    ensureAudioReady();
    proceedBattlePlanStepper();
  }

  if (isGamepadEdgePressed(slot, state, 'start')) {
    showPauseOverlay(GAME_STATES.BATTLE_PLAN_STEPPER);
  }
}

function handleGamepadGameOverInput(slotName, slot, state) {
  if (game.roundMessageTimer >= ROUND_RULES.restartPromptFrames) return;
  if (isGamepadEdgePressed(slot, state, 'start')) {
    ensureAudioReady();
    if (slotName === 'p2' && game.mode === MATCH_MODES.CPU) {
      game.mode = MATCH_MODES.VERSUS;
    }
    openCharacterSelect(true);
  }
}

function handleGamepadContinueInput(slot, state) {
  if (isGamepadEdgePressed(slot, state, 'confirm')) {
    ensureAudioReady();
    acceptContinue();
  }
}

function handleGamepadFightInput(slotName, slot, state) {
  const targetHeld = slot.held;
  targetHeld.left = state.left && !state.right;
  targetHeld.right = state.right && !state.left;
  targetHeld.up = state.up && !state.down;
  targetHeld.down = state.down;
  targetHeld.block = state.block;

  if (game.state !== GAME_STATES.FIGHT) return;
  if (slotName === 'p2' && isCpuControlledMode()) return;

  const fighter = slotName === 'p1' ? p1 : p2;
  if (isGamepadEdgePressed(slot, state, 'confirm')) {
    ensureAudioReady();
    fighter.attack('punch');
  }
  if (isGamepadEdgePressed(slot, state, 'back')) {
    ensureAudioReady();
    fighter.attack('kick');
  }
  if (isGamepadEdgePressed(slot, state, 'special')) {
    ensureAudioReady();
    fighter.attack('special');
  }
  if (isGamepadEdgePressed(slot, state, 'start')) {
    showPauseOverlay(GAME_STATES.FIGHT);
  }
}

function processGamepadSlot(slotName, slot, state, now) {
  if (game.state === GAME_STATES.MENU) handleGamepadTitleInput(slot, state, now);
  else if (game.state === GAME_STATES.CHAR_SELECT) handleGamepadCharacterSelectInput(slotName, slot, state, now);
  else if (game.state === GAME_STATES.BATTLE_PLAN_STEPPER) handleGamepadBattlePlanInput(slot, state);
  else if (game.state === GAME_STATES.PAUSED) handleGamepadPauseInput(slot, state, now);
  else if (game.state === GAME_STATES.GAME_OVER) handleGamepadGameOverInput(slotName, slot, state);
  else if (game.state === GAME_STATES.CONTINUE) handleGamepadContinueInput(slot, state);

  if (game.state === GAME_STATES.FIGHT || game.state === GAME_STATES.COUNTDOWN) handleGamepadFightInput(slotName, slot, state);
  else clearGamepadSlotHeld(slot);
}

function pollGamepads() {
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
  const now = Date.now();
  syncGamepadAssignments(pads);

  ['p1', 'p2'].forEach(slotName => {
    const slot = gamepadInput.slots[slotName];
    const gamepad = getGamepadBySlot(slotName, pads);
    if (!gamepad) {
      clearGamepadSlotHeld(slot);
      slot.prev = {};
      return;
    }

    const state = readGamepadState(gamepad, slot.prev);
    processGamepadSlot(slotName, slot, state, now);
    slot.prev = { ...state };
  });
}

function startGamepadLoop() {
  if (gamepadInput.loopStarted) return;
  gamepadInput.loopStarted = true;

  const tick = () => {
    pollGamepads();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function resetCpuState() {
  cpuState.attackCooldown = 0;
  cpuState.blockFrames = 0;
  cpuState.retreatFrames = 0;
  cpuState.jumpCooldown = 0;
  cpuState.strafeBias = Math.random() > 0.5 ? 1 : -1;
}

function randomCpuSelection() {
  const selectableIndices = getSelectableCharacterIndices();
  return selectableIndices[Math.floor(Math.random() * selectableIndices.length)] ?? 0;
}

function updateCharSelectModeUI() {
  ui.p1SelectLabel.textContent = 'PLAYER 1';
  ui.p1SelectControls.innerHTML = 'P1: <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or Pad Move &bull; <kbd>J</kbd> or <kbd>A</kbd> Confirm &bull; <kbd>L</kbd> or <kbd>Y</kbd> Random 8';
  if (isBattlePlanMode()) {
    ui.p2SelectLabel.textContent = 'PLAN CPU';
    ui.p2SelectControls.textContent = 'CPU route locks after P1 confirm';
    ui.fightButton.textContent = 'BEGIN PLAN';
  } else if (isTeamVsTeamMode()) {
    ui.p2SelectLabel.textContent = 'PLAYER 2';
    ui.p2SelectControls.innerHTML = 'P2: <kbd>&uarr;</kbd><kbd>&larr;</kbd><kbd>&darr;</kbd><kbd>&rarr;</kbd> or Pad Move &bull; <kbd>1</kbd> or <kbd>A</kbd> Confirm &bull; <kbd>3</kbd> or <kbd>Y</kbd> Random 8';
    ui.fightButton.textContent = 'TEAM FIGHT!';
  } else if (isCpuMode()) {
    ui.p2SelectLabel.textContent = 'CHOOSE FOR CPU';
    ui.p2SelectControls.innerHTML = 'P2: <kbd>&uarr;</kbd><kbd>&larr;</kbd><kbd>&darr;</kbd><kbd>&rarr;</kbd> or Pad Move &bull; <kbd>1</kbd> or <kbd>A</kbd> Confirm &bull; <kbd>3</kbd> or <kbd>Y</kbd> Random 8';
    ui.fightButton.textContent = 'FIGHT CPU';
  } else {
    ui.p2SelectLabel.textContent = 'PLAYER 2';
    ui.p2SelectControls.innerHTML = 'P2: <kbd>&uarr;</kbd><kbd>&larr;</kbd><kbd>&darr;</kbd><kbd>&rarr;</kbd> or Pad Move &bull; <kbd>1</kbd> or <kbd>A</kbd> Confirm &bull; <kbd>3</kbd> or <kbd>Y</kbd> Random 8';
    ui.fightButton.textContent = 'FIGHT!';
  }
}

function updateCpuInput(cpuFighter, opponent) {
  resetInputState(keys2);

  if (!opponent || cpuFighter.health <= 0 || opponent.health <= 0 || cpuFighter.hitTimer > 0 || cpuFighter.freezeTimer > 0 || cpuFighter.teleportPhase) return;

  cpuState.attackCooldown = Math.max(0, cpuState.attackCooldown - 1);
  cpuState.blockFrames = Math.max(0, cpuState.blockFrames - 1);
  cpuState.retreatFrames = Math.max(0, cpuState.retreatFrames - 1);
  cpuState.jumpCooldown = Math.max(0, cpuState.jumpCooldown - 1);

  const dx = opponent.x - cpuFighter.x;
  const absDistance = Math.abs(dx);
  const towardLeft = dx < 0;
  const closeRange = absDistance < 82;
  const midRange = absDistance >= 82 && absDistance < 180;

  if (opponent.attackTimer > 0 && closeRange && Math.random() > 0.45) {
    cpuState.blockFrames = 10 + Math.floor(Math.random() * 8);
  }

  if (cpuState.blockFrames > 0) {
    keys2.block = true;
    if (closeRange && Math.random() > 0.5) keys2.down = true;
    return;
  }

  if (cpuState.retreatFrames > 0) {
    keys2.left = !towardLeft;
    keys2.right = towardLeft;
    if (cpuState.jumpCooldown === 0 && Math.random() > 0.9) {
      keys2.up = true;
      cpuState.jumpCooldown = 45;
    }
    return;
  }

  if (cpuState.attackCooldown === 0) {
    if (cpuFighter.special >= SPECIAL_METER_MAX && midRange && Math.random() > 0.7) {
      cpuFighter.attack('special');
      cpuState.attackCooldown = 55;
      cpuState.retreatFrames = 12;
      return;
    }

    if (closeRange) {
      if (Math.random() > 0.55) cpuFighter.attack('kick');
      else cpuFighter.attack('punch');
      cpuState.attackCooldown = 18 + Math.floor(Math.random() * 18);
      if (Math.random() > 0.7) cpuState.retreatFrames = 14;
      return;
    }
  }

  if (absDistance > 58) {
    keys2.left = towardLeft;
    keys2.right = !towardLeft;
  } else {
    keys2.left = towardLeft ? cpuState.strafeBias < 0 : cpuState.strafeBias > 0;
    keys2.right = !keys2.left;
    if (Math.random() > 0.96) cpuState.strafeBias *= -1;
  }

  if (cpuState.jumpCooldown === 0 && midRange && Math.random() > 0.985) {
    keys2.up = true;
    cpuState.jumpCooldown = 70;
  }

  if (closeRange && Math.random() > 0.985) {
    keys2.down = true;
  }
}


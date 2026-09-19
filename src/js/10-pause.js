function pauseTrackForOverlay(track, key) {
  audio.pausedTracks[key] = Boolean(track && !track.paused);
  if (audio.pausedTracks[key]) track.pause();
}

function pauseAudioForOverlay() {
  pauseTrackForOverlay(audio.titleTrack, 'title');
  pauseTrackForOverlay(audio.charSelectTrack, 'charSelect');
  pauseTrackForOverlay(audio.fightTrack, 'fight');

  audio.pauseSuspendedContext = Boolean(audio.context && audio.context.state === 'running');
  if (audio.pauseSuspendedContext) audio.context.suspend();
}

function resumeAudioFromOverlay() {
  if (audio.pauseSuspendedContext && audio.context && audio.context.state === 'suspended') {
    audio.context.resume();
  }

  if (audio.pausedTracks.title && audio.titleTrack) playTrack(audio.titleTrack);
  if (audio.pausedTracks.charSelect && audio.charSelectTrack) playTrack(audio.charSelectTrack);
  if (audio.pausedTracks.fight && audio.fightTrack) playTrack(audio.fightTrack);

  audio.pausedTracks.title = false;
  audio.pausedTracks.charSelect = false;
  audio.pausedTracks.fight = false;
  audio.pauseSuspendedContext = false;
}

function hidePauseOverlay() {
  ui.pauseOverlay.style.display = 'none';
  ui.battlePlanStepper.classList.remove('paused-underlay');
  game.pause.active = false;
  game.pause.returnState = '';
  game.pause.snapshotCanvas = null;
}

function showPauseOverlay(returnState) {
  game.pause.active = true;
  game.pause.returnState = returnState;
  game.pause.snapshotCanvas = cloneCanvas(canvas);
  game.state = GAME_STATES.PAUSED;
  resetInputState(keys1);
  resetInputState(keys2);
  clearAllGamepadHeld();
  gamepadInput.pauseSelection = 0;

  if (returnState === GAME_STATES.FIGHT) {
    ui.pauseTitle.textContent = 'FIGHT PAUSED';
    ui.pauseCopy.textContent = 'Press ESC, START, or B to resume, or choose a new mode.';
  } else {
    ui.pauseTitle.textContent = 'BATTLE PLAN PAUSED';
    ui.pauseCopy.textContent = 'Press ESC, START, or B to resume the route, or choose a new mode.';
    ui.battlePlanStepper.classList.add('paused-underlay');
  }

  pauseAudioForOverlay();
  ui.pauseOverlay.style.display = 'flex';
  updatePauseModeFocus();
}

function resumePausedSession() {
  if (!game.pause.active) return;

  const returnState = game.pause.returnState;
  hidePauseOverlay();
  game.state = returnState;
  resumeAudioFromOverlay();
}

function leavePausedSessionForMode(mode) {
  hidePauseOverlay();
  resumeAudioFromOverlay();
  game.mode = mode;
  if (mode === MATCH_MODES.BATTLE_PLAN) game.credits = 3;
  removeTeamHUD();
  ensureAudioReady();
  playUiSound('start');
  openCharacterSelect(true);
}

function openTitleScreen() {
  if (selectionConfirmTimer) {
    clearTimeout(selectionConfirmTimer);
    selectionConfirmTimer = null;
  }

  if (charSelectCountdownInterval) {
    clearInterval(charSelectCountdownInterval);
    charSelectCountdownInterval = null;
  }

  clearCharSelectRandomizers();
  if (game.timerInterval) clearInterval(game.timerInterval);

  hidePauseOverlay();
  hideBattlePlanStepper();
  hideContinueScreen();
  resetInputState(keys1);
  resetInputState(keys2);
  clearAllGamepadHeld();
  resetCpuState();
  resetBattlePlanState();
  removeTeamHUD();
  ui.charSelect.style.display = 'none';
  ui.startScreen.style.display = 'flex';
  game.state = GAME_STATES.MENU;
  gamepadInput.titleSelection = 0;
  updateTitleModeFocus();
  syncMusicMode();
}


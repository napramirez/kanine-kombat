function resetBattlePlanState() {
  game.battlePlan.route = [];
  game.battlePlan.currentIndex = 0;
  game.battlePlan.playerCharacterId = '';
  game.battlePlan.pendingAdvance = false;
  game.battlePlan.cleared = false;
  game.battlePlan.stepperFromIndex = -1;
  game.battlePlan.stepperReady = false;
  hideBattlePlanStepper();
}

function buildBattlePlanRoute(playerCharacterId) {
  const route = shuffleCharacterIds(
    CHARACTERS
      .filter(char => char.id !== playerCharacterId && !isHiddenCharacter(char))
      .map(char => char.id)
  );

  if (playerCharacterId !== 'borko') route.push(playerCharacterId);
  route.push('borko');
  route.push('catnip');
  return route;
}

function prepareBattlePlanRoute(playerCharacterId) {
  game.battlePlan.playerCharacterId = playerCharacterId;
  game.battlePlan.route = buildBattlePlanRoute(playerCharacterId);
  game.battlePlan.currentIndex = 0;
  game.battlePlan.pendingAdvance = false;
  game.battlePlan.cleared = false;
  p2Selection = CHARACTERS.findIndex(char => char.id === game.battlePlan.route[0]);
}

function getBattlePlanCurrentOpponent() {
  const id = game.battlePlan.route[game.battlePlan.currentIndex];
  return getCharacterById(id);
}

function loadBattlePlanMatch() {
  const playerChar = getCharacterById(game.battlePlan.playerCharacterId);
  const opponentChar = getBattlePlanCurrentOpponent();
  const isBorkoSubBossMatch = game.battlePlan.currentIndex === game.battlePlan.route.length - 2 && opponentChar.id === 'borko';
  const isCatnipBossMatch = game.battlePlan.currentIndex === game.battlePlan.route.length - 1 && opponentChar.id === 'catnip';
  if (isBorkoSubBossMatch) {
    game.stage = BACKGROUND_STAGES.BORKO_LAIR;
  } else if (isCatnipBossMatch) {
    game.stage = BACKGROUND_STAGES.CATNIP_DOMAIN;
  } else {
    game.stage = pickRandomBackgroundStage();
  }

  p1 = new Fighter(PLAYER_SPAWNS.p1, playerChar, 1);
  p2 = new Fighter(PLAYER_SPAWNS.p2, opponentChar, -1);
  p1Selection = CHARACTERS.findIndex(char => char.id === playerChar.id);
  p2Selection = CHARACTERS.findIndex(char => char.id === opponentChar.id);
  ui.p1Name.textContent = p1.name;
  ui.p2Name.textContent = `${p2.name} CPU`;
  updateRoundDots();
}

function buildBattlePlanStepPortrait(char, container) {
  container.innerHTML = '';
  container.appendChild(cloneCanvas(renderCharPreview(char)));
}

function getBattlePlanStepMeta(char, index) {
  if (index === game.battlePlan.route.length - 1) {
    return { badge: 'FINAL', note: 'SHAO CATNIP showdown' };
  }

  if (index === game.battlePlan.route.length - 2 && char.id === 'borko') {
    return { badge: 'SUB-BOSS', note: 'BORKO blockade' };
  }

  if (char.id === game.battlePlan.playerCharacterId) {
    return { badge: 'MIRROR', note: 'Face yourself' };
  }

  return { badge: `MATCH ${index + 1}`, note: 'CPU opponent' };
}

function buildBattlePlanStepper() {
  const playerChar = getCharacterById(game.battlePlan.playerCharacterId);
  const nextOpponent = getBattlePlanCurrentOpponent();
  const clearedCount = game.battlePlan.currentIndex;
  const routeStepCount = game.battlePlan.route.length;
  const stepWidth = 132;
  const stepGap = 34;
  const routePadding = 160;
  const routeWidth = Math.max(920, routePadding + routeStepCount * stepWidth + Math.max(0, routeStepCount - 1) * stepGap);

  ui.battlePlanRouteSteps.innerHTML = '';
  ui.battlePlanPlayerToken.innerHTML = '';
  ui.battlePlanRoute.style.width = `${routeWidth}px`;

  game.battlePlan.route.forEach((id, index) => {
    const char = getCharacterById(id);
    const meta = getBattlePlanStepMeta(char, index);
    const step = document.createElement('div');
    let cls = 'battle-plan-step';
    if (index < game.battlePlan.currentIndex) cls += ' completed';
    else if (index === game.battlePlan.currentIndex) cls += ' next';
    else cls += ' locked';
    step.className = cls;
    step.dataset.stepIndex = index;

    const badge = document.createElement('div');
    badge.className = 'battle-plan-badge';
    badge.textContent = meta.badge;

    const portrait = document.createElement('div');
    portrait.className = 'battle-plan-step-portrait';
    buildBattlePlanStepPortrait(char, portrait);

    const name = document.createElement('div');
    name.className = 'battle-plan-step-name';
    name.textContent = char.name;

    const note = document.createElement('div');
    note.className = 'battle-plan-step-note';
    note.textContent = index < game.battlePlan.currentIndex ? 'CLEARED' : meta.note;

    step.appendChild(badge);
    step.appendChild(portrait);
    step.appendChild(name);
    step.appendChild(note);
    ui.battlePlanRouteSteps.appendChild(step);
  });

  const playerCard = document.createElement('div');
  playerCard.className = 'battle-plan-player-card';
  buildBattlePlanStepPortrait(playerChar, playerCard);
  ui.battlePlanPlayerToken.appendChild(playerCard);

  ui.battlePlanSummary.innerHTML = clearedCount === 0
    ? `Plan locked in.<br>First opponent: ${nextOpponent.name}`
    : `Match ${clearedCount} cleared.<br>Next opponent: ${nextOpponent.name}`;

  ui.battlePlanPrompt.textContent = 'Scanning route...';
  ui.battlePlanPrompt.classList.remove('ready');
}

function getBattlePlanTokenPosition(index) {
  const steps = ui.battlePlanRouteSteps.querySelectorAll('.battle-plan-step');
  if (!steps.length) return { left: 0, top: 0 };

  const routeRect = ui.battlePlanRoute.getBoundingClientRect();
  const firstRect = steps[0].getBoundingClientRect();
  const sampleRect = steps[Math.min(1, steps.length - 1)].getBoundingClientRect();
  const gap = steps.length > 1 ? sampleRect.left - firstRect.left : 140;

  let rect = firstRect;
  let left = rect.left - routeRect.left + rect.width / 2;
  if (index < 0) {
    left -= gap * 0.7;
  } else {
    rect = steps[index].getBoundingClientRect();
    left = rect.left - routeRect.left + rect.width / 2;
  }

  return {
    left,
    top: firstRect.top - routeRect.top - 96
  };
}

function getBattlePlanRouteScrollLeft(index) {
  if (index < 0) return 0;

  const steps = ui.battlePlanRouteSteps.querySelectorAll('.battle-plan-step');
  const step = steps[index];
  if (!step) return 0;

  const viewport = ui.battlePlanRouteViewport;
  const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const target = step.offsetLeft + step.offsetWidth / 2 - viewport.clientWidth / 2;
  return Math.max(0, Math.min(maxScroll, target));
}

function setBattlePlanRouteScroll(index, animate) {
  const viewport = ui.battlePlanRouteViewport;
  const left = getBattlePlanRouteScrollLeft(index);

  if (animate) {
    viewport.scrollTo({ left, behavior: 'smooth' });
    return;
  }

  viewport.scrollLeft = left;
}

function setBattlePlanTokenPosition(index, animate) {
  const pos = getBattlePlanTokenPosition(index);
  ui.battlePlanPlayerToken.style.transition = animate
    ? 'left 0.85s cubic-bezier(0.22, 1, 0.36, 1), top 0.85s cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none';
  ui.battlePlanPlayerToken.style.left = `${pos.left}px`;
  ui.battlePlanPlayerToken.style.top = `${pos.top}px`;
}

function hideBattlePlanStepper() {
  ui.battlePlanStepper.style.display = 'none';
  ui.battlePlanStepper.classList.remove('paused-underlay');
  ui.battlePlanPrompt.classList.remove('ready');
  ui.battlePlanRouteViewport.scrollLeft = 0;
}

function showBattlePlanStepper(fromIndex, toIndex) {
  game.state = GAME_STATES.BATTLE_PLAN_STEPPER;
  game.battlePlan.stepperFromIndex = fromIndex;
  game.battlePlan.stepperReady = false;
  buildBattlePlanStepper();
  ui.battlePlanStepper.style.display = 'flex';
  syncMusicMode();

  requestAnimationFrame(() => {
    setBattlePlanRouteScroll(fromIndex, false);
    setBattlePlanTokenPosition(fromIndex, false);
    ui.battlePlanPlayerToken.offsetWidth;

    requestAnimationFrame(() => {
      setBattlePlanRouteScroll(toIndex, fromIndex !== toIndex);
      setBattlePlanTokenPosition(toIndex, true);
      window.setTimeout(() => {
        game.battlePlan.stepperReady = true;
        ui.battlePlanPrompt.textContent = 'Press SPACE or Y to start the next match';
        ui.battlePlanPrompt.classList.add('ready');
      }, 900);
    });
  });
}

function queueNextBattlePlanMatch() {
  game.battlePlan.currentIndex++;
  game.battlePlan.pendingAdvance = true;
  game.battlePlan.stepperFromIndex = game.battlePlan.currentIndex - 1;
  game.round = 1;
  p1.roundsWon = 0;
  p2.roundsWon = 0;
  updateRoundDots();
}

function advanceBattlePlanMatch() {
  game.battlePlan.pendingAdvance = false;
  hideBattlePlanStepper();
  loadBattlePlanMatch();
  startRound();
}

function proceedBattlePlanStepper() {
  if (game.state !== GAME_STATES.BATTLE_PLAN_STEPPER || !game.battlePlan.stepperReady) return;

  playUiSound('confirm');
  if (game.battlePlan.pendingAdvance) {
    advanceBattlePlanMatch();
  } else {
    hideBattlePlanStepper();
    startRound();
  }
}


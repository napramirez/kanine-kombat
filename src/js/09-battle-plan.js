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

  const sx = game.fullscreenScaleX || 1;
  const sy = game.fullscreenScaleY || 1;
  const routeRect = ui.battlePlanRoute.getBoundingClientRect();
  const firstRect = steps[0].getBoundingClientRect();
  const sampleRect = steps[Math.min(1, steps.length - 1)].getBoundingClientRect();
  const gap = steps.length > 1 ? (sampleRect.left - firstRect.left) / sx : 140;

  let rect = firstRect;
  let left = (rect.left - routeRect.left) / sx + rect.width / sx / 2;
  if (index < 0) {
    left -= gap * 0.7;
  } else {
    rect = steps[index].getBoundingClientRect();
    left = (rect.left - routeRect.left) / sx + rect.width / sx / 2;
  }

  return {
    left,
    top: (firstRect.top - routeRect.top) / sy - 96
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
        ui.battlePlanPrompt.textContent = 'Press Y to start the next match';
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

function resetTeamBattlePlanState() {
  game.teamBattlePlan.route = [];
  game.teamBattlePlan.currentIndex = 0;
  game.teamBattlePlan.playerCharacterId = '';
  game.teamBattlePlan.playerCharacterId2 = '';
  game.teamBattlePlan.pendingAdvance = false;
  game.teamBattlePlan.cleared = false;
  game.teamBattlePlan.stepperFromIndex = -1;
  game.teamBattlePlan.stepperReady = false;
  hideBattlePlanStepper();
}

function buildTeamBattlePlanRoute(p1CharId, p2CharId) {
  const excludeIds = new Set([p1CharId, p2CharId, 'borko', 'catnip']);
  const pool = shuffleCharacterIds(
    CHARACTERS
      .filter(char => !excludeIds.has(char.id) && !isHiddenCharacter(char))
      .map(char => char.id)
  );

  const route = [];
  for (let i = 0; i < pool.length; i += 2) {
    if (i + 1 < pool.length) {
      route.push([pool[i], pool[i + 1]]);
    } else {
      route.push([pool[i]]);
    }
  }

  route.push([p1CharId, p2CharId]);
  route.push(['borko']);
  route.push(['catnip']);
  return route;
}

function prepareTeamBattlePlanRoute(p1CharId, p2CharId) {
  game.teamBattlePlan.playerCharacterId = p1CharId;
  game.teamBattlePlan.playerCharacterId2 = p2CharId;
  game.teamBattlePlan.route = buildTeamBattlePlanRoute(p1CharId, p2CharId);
  game.teamBattlePlan.currentIndex = 0;
  game.teamBattlePlan.pendingAdvance = false;
  game.teamBattlePlan.cleared = false;
}

function getTeamBattlePlanCurrentOpponents() {
  const pair = game.teamBattlePlan.route[game.teamBattlePlan.currentIndex];
  return pair.map(id => getCharacterById(id));
}

function loadTeamBattlePlanMatch() {
  const playerChar1 = getCharacterById(game.teamBattlePlan.playerCharacterId);
  const playerChar2 = getCharacterById(game.teamBattlePlan.playerCharacterId2);
  const opponents = getTeamBattlePlanCurrentOpponents();
  const opponentChar1 = opponents[0];
  const opponentChar2 = opponents[1] || null;

  const isBorkoMatch = opponentChar1.id === 'borko' && !opponentChar2;
  const isCatnipMatch = opponentChar1.id === 'catnip' && !opponentChar2;
  if (isBorkoMatch) {
    game.stage = BACKGROUND_STAGES.BORKO_LAIR;
  } else if (isCatnipMatch) {
    game.stage = BACKGROUND_STAGES.CATNIP_DOMAIN;
  } else {
    game.stage = pickRandomBackgroundStage();
  }

  p1 = new Fighter(PLAYER_SPAWNS.teamA1, playerChar1, 1);
  p1.team = 'A';
  p2 = new Fighter(PLAYER_SPAWNS.teamA2, playerChar2, 1);
  p2.team = 'A';
  cpu1 = new Fighter(PLAYER_SPAWNS.teamB1, opponentChar1, -1);
  cpu1.team = 'B';
  if (opponentChar2) {
    cpu2 = new Fighter(PLAYER_SPAWNS.teamB2, opponentChar2, -1);
    cpu2.team = 'B';
  } else {
    cpu2 = new Fighter(PLAYER_SPAWNS.teamB2, opponentChar1, -1);
    cpu2.team = 'B';
    cpu2.health = 0;
    cpu2.state = 'defeat';
  }

  createTeamHUD();
  ui.p1Name.textContent = p1.name;
  ui.p2Name.textContent = p2.name;
  updateTeamRoundDots();
}

function getTeamBattlePlanStepMeta(pair, index) {
  const route = game.teamBattlePlan.route;
  const p1Id = game.teamBattlePlan.playerCharacterId;
  const p2Id = game.teamBattlePlan.playerCharacterId2;

  if (index === route.length - 1) {
    return { badge: 'FINAL', note: 'SHAO CATNIP showdown' };
  }
  if (index === route.length - 2 && pair[0] === 'borko') {
    return { badge: 'SUB-BOSS', note: 'BORKO blockade' };
  }
  if (pair.length === 2 && pair[0] === p1Id && pair[1] === p2Id) {
    return { badge: 'MIRROR', note: 'Face yourselves' };
  }
  return { badge: `MATCH ${index + 1}`, note: 'CPU opponents' };
}

function buildTeamBattlePlanStepper() {
  const playerChar1 = getCharacterById(game.teamBattlePlan.playerCharacterId);
  const playerChar2 = getCharacterById(game.teamBattlePlan.playerCharacterId2);
  const nextOpponents = getTeamBattlePlanCurrentOpponents();
  const clearedCount = game.teamBattlePlan.currentIndex;
  const routeStepCount = game.teamBattlePlan.route.length;
  const stepWidth = 132;
  const stepGap = 34;
  const routePadding = 160;
  const routeWidth = Math.max(920, routePadding + routeStepCount * stepWidth + Math.max(0, routeStepCount - 1) * stepGap);

  ui.battlePlanRouteSteps.innerHTML = '';
  ui.battlePlanPlayerToken.innerHTML = '';
  ui.battlePlanRoute.style.width = `${routeWidth}px`;

  game.teamBattlePlan.route.forEach((pair, index) => {
    const meta = getTeamBattlePlanStepMeta(pair, index);
    const step = document.createElement('div');
    let cls = 'battle-plan-step';
    if (index < game.teamBattlePlan.currentIndex) cls += ' completed';
    else if (index === game.teamBattlePlan.currentIndex) cls += ' next';
    else cls += ' locked';
    step.className = cls;
    step.dataset.stepIndex = index;

    const badge = document.createElement('div');
    badge.className = 'battle-plan-badge';
    badge.textContent = meta.badge;

    const portrait = document.createElement('div');
    portrait.className = 'battle-plan-step-portrait';
    if (pair.length === 2) {
      portrait.style.display = 'flex';
      portrait.style.gap = '2px';
      pair.forEach(id => {
        const ch = getCharacterById(id);
        const sub = document.createElement('div');
        sub.style.flex = '1';
        sub.style.display = 'flex';
        sub.style.alignItems = 'flex-end';
        sub.style.justifyContent = 'center';
        sub.appendChild(cloneCanvas(renderCharPreview(ch)));
        portrait.appendChild(sub);
      });
    } else {
      buildBattlePlanStepPortrait(getCharacterById(pair[0]), portrait);
    }

    const name = document.createElement('div');
    name.className = 'battle-plan-step-name';
    name.textContent = pair.map(id => getCharacterById(id).name).join(' & ');

    const note = document.createElement('div');
    note.className = 'battle-plan-step-note';
    note.textContent = index < game.teamBattlePlan.currentIndex ? 'CLEARED' : meta.note;

    step.appendChild(badge);
    step.appendChild(portrait);
    step.appendChild(name);
    step.appendChild(note);
    ui.battlePlanRouteSteps.appendChild(step);
  });

  const playerCard = document.createElement('div');
  playerCard.className = 'battle-plan-player-card';
  playerCard.style.display = 'flex';
  playerCard.style.gap = '2px';
  [playerChar1, playerChar2].forEach(ch => {
    const sub = document.createElement('div');
    sub.style.flex = '1';
    sub.style.display = 'flex';
    sub.style.alignItems = 'center';
    sub.style.justifyContent = 'center';
    sub.style.overflow = 'hidden';
    sub.appendChild(cloneCanvas(renderCharPreview(ch)));
    playerCard.appendChild(sub);
  });
  ui.battlePlanPlayerToken.appendChild(playerCard);

  const opponentNames = nextOpponents.map(c => c.name).join(' & ');
  ui.battlePlanSummary.innerHTML = clearedCount === 0
    ? `Plan locked in.<br>First opponents: ${opponentNames}`
    : `Match ${clearedCount} cleared.<br>Next opponents: ${opponentNames}`;

  ui.battlePlanPrompt.textContent = 'Scanning route...';
  ui.battlePlanPrompt.classList.remove('ready');
}

function showTeamBattlePlanStepper(fromIndex, toIndex) {
  game.state = GAME_STATES.BATTLE_PLAN_STEPPER;
  game.teamBattlePlan.stepperFromIndex = fromIndex;
  game.teamBattlePlan.stepperReady = false;
  buildTeamBattlePlanStepper();
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
        game.teamBattlePlan.stepperReady = true;
        ui.battlePlanPrompt.textContent = 'Press Y to start the next match';
        ui.battlePlanPrompt.classList.add('ready');
      }, 900);
    });
  });
}

function queueNextTeamBattlePlanMatch() {
  game.teamBattlePlan.currentIndex++;
  game.teamBattlePlan.pendingAdvance = true;
  game.teamBattlePlan.stepperFromIndex = game.teamBattlePlan.currentIndex - 1;
  game.round = 1;
  p1.roundsWon = 0;
  p2.roundsWon = 0;
  game.teamRoundsWon = { A: 0, B: 0 };
  updateTeamRoundDots();
}

function advanceTeamBattlePlanMatch() {
  game.teamBattlePlan.pendingAdvance = false;
  hideBattlePlanStepper();
  loadTeamBattlePlanMatch();
  startRound();
}

function proceedTeamBattlePlanStepper() {
  if (game.state !== GAME_STATES.BATTLE_PLAN_STEPPER || !game.teamBattlePlan.stepperReady) return;

  playUiSound('confirm');
  if (game.teamBattlePlan.pendingAdvance) {
    advanceTeamBattlePlanMatch();
  } else {
    hideBattlePlanStepper();
    startRound();
  }
}


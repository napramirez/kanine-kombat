// Projectiles
const projectiles = [];

function spawnProjectile(owner) {
  const specialName = owner.specialFormSource || getActiveSpecialName(owner);
  let color1, color2, type, speed, radius, dmg, kb;

  if (specialName === 'SKORPDOG') {
    color1 = '#f1c40f';
    color2 = '#c8a800';
    type = 'harpoon';
    speed = 14;
    radius = 8;
    dmg = 15;
    kb = 5;
  } else if (specialName === 'SMOWKDAWG') {
    color1 = '#808080';
    color2 = '#606060';
    type = 'harpoon';
    speed = 14;
    radius = 8;
    dmg = 15;
    kb = 5;
  } else if (specialName === 'SEKDOG') {
    color1 = '#ff6b6b';
    color2 = '#c0392b';
    type = 'missile';
    speed = COMBAT.special.sekdog.missileSpeed;
    radius = COMBAT.special.sekdog.missileRadius;
    dmg = COMBAT.special.sekdog.missileDamage;
    kb = COMBAT.special.sekdog.missileKnockback;
  } else if (specialName === 'BORKO') {
    return;
  } else if (specialName === 'RAYNDOG') {
    spawnRayndogLightningCloud(owner, owner === p1 ? p2 : p1);
    return;
  } else if (specialName === 'RAYDOG') {
    return;
  } else if (specialName === 'NOOB SAIDOG' || specialName === 'REPDOG') {
    spawnNoobSaidogSequence(owner, owner === p1 ? p2 : p1, specialName);
    return;
  } else if (specialName === 'SNEK') {
    return;
  } else if (specialName === 'DOGGABAL') {
    return;
  } else if (specialName === 'MAKDOG') {
    return;
  } else if (specialName === 'CYDOG') {
    color1 = '#2ecc71';
    color2 = '#27ae60';
    type = 'net';
    speed = COMBAT.special.cydog.netSpeed;
    radius = COMBAT.special.cydog.netRadius;
    dmg = 0;
    kb = 0;
    const bomb = spawnCydogBomb(owner);
    owner.pendingCydogBomb = bomb;
  } else if (specialName === 'TREMODOG') {
    spawnTremdogShockwaveField(owner);
    return;
  } else if (specialName === 'SUBDOG') {
    color1 = '#87ceeb';
    color2 = '#b0e0e6';
    type = 'snowflake';
    speed = 8;
    radius = 15;
    dmg = 0;
    kb = 0;
  } else if (isDoggoCage(owner.name)) {
    color1 = '#f1c40f';
    color2 = '#e74c3c';
    type = 'energy';
    speed = 10;
    radius = 18;
    dmg = 25;
    kb = 15;
  } else {
    color1 = '#3498db';
    color2 = '#9b59b6';
    type = 'energy';
    speed = 10;
    radius = 18;
    dmg = 25;
    kb = 15;
  }

  projectiles.push({
    x: owner.x + owner.facing * 40,
    y: owner.y - 50,
    vx: owner.facing * speed,
    vy: 0,
    owner: owner,
    dmg: dmg,
    kb: kb,
    life: 120,
    radius: radius,
    color1: color1,
    color2: color2,
    type: type,
    trail: [],
    hit: false,
    pullTimer: 0,
    rotation: 0,
    ownerAnchorX: owner.x,
    ownerAnchorY: owner.y,
    ownerAnchorFacing: owner.facing,
    bombAnchorX: owner.pendingCydogBomb ? owner.pendingCydogBomb.x : 0,
    bombAnchorY: owner.pendingCydogBomb ? owner.pendingCydogBomb.y : 0,
    fuseFrames: 0,
    exploded: false
  });

  owner.pendingCydogBomb = null;
}

function spawnNoobSaidogSequence(owner, target, variant) {
  const special = COMBAT.special.noobSaidog;
  const holdFrames = Math.ceil(special.captureHoldMs / PHYSICS.freezeTickMs);

  projectiles.push({
    x: target.x,
    y: GROUND,
    owner,
    target,
    type: 'noobSnake',
    variant: variant || 'NOOB SAIDOG',
    life: special.snakeRiseFrames + holdFrames,
    maxLife: special.snakeRiseFrames + holdFrames,
    riseFrames: special.snakeRiseFrames,
    elapsedFrames: 0,
    captured: false,
    retreating: false,
    lastOwnerFrame: owner.frame,
    trail: []
  });
}

function spawnNoobSaidogFireball(owner, target, shotIndex, shotCount, variant) {
  const special = COMBAT.special.noobSaidog;
  const x = owner.x + owner.facing * 42;
  const y = owner.y - 58;
  const targetY = target.y - target.height / 2;
  const isRepdog = variant === 'REPDOG';
  const angle = isRepdog
    ? Math.atan2(targetY - y, target.x - x)
    : Math.atan2(targetY - y, target.x - x) + (shotIndex - (shotCount - 1) / 2) * special.fireballSpread;
  projectiles.push({
    x,
    y,
    owner,
    target,
    type: isRepdog ? 'repdogAcid' : 'noobFireball',
    life: 120,
    radius: isRepdog ? special.fireballRadius * 2 : special.fireballRadius,
    speed: special.fireballSpeed,
    dmg: special.fireballDamage,
    kb: special.fireballKnockback,
    vx: Math.cos(angle) * special.fireballSpeed,
    vy: Math.sin(angle) * special.fireballSpeed,
    launchFrames: special.fireballLaunchFrames,
    trail: [],
    lastOwnerFrame: owner.frame
  });
}

function spawnSnekCoil(owner, target) {
  const special = COMBAT.special.snek;
  projectiles.push({
    x: target.x,
    y: target.y,
    owner,
    target,
    type: 'snekCoil',
    life: special.coilDisplayFrames,
    maxLife: special.coilDisplayFrames,
    lastOwnerFrame: owner.frame,
    trail: []
  });
}


function spawnRayndogLightningCloud(owner, target) {
  const special = COMBAT.special.rayndog;

  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].type === 'lightningCloud' && projectiles[i].owner === owner) {
      projectiles.splice(i, 1);
    }
  }

  projectiles.push({
    x: target.x,
    y: target.y - 130,
    vx: 0,
    vy: 0,
    owner,
    dmg: special.zapDamage,
    kb: special.zapKnockback,
    life: special.durationFrames,
    radius: 44,
    color1: '#8e44ad',
    color2: '#c77dff',
    type: 'lightningCloud',
    trail: [],
    hit: true,
    pullTimer: 0,
    rotation: 0,
    ownerAnchorX: owner.x,
    ownerAnchorY: owner.y,
    ownerAnchorFacing: owner.facing,
    fuseFrames: 0,
    exploded: false,
    pulseTimer: 1,
    pulseInterval: special.pulseIntervalFrames,
    strikeFrames: 0,
    targetX: target.x,
    targetY: target.y - target.height / 2
  });
}

function spawnRaydogArcLightning(owner, target) {
  const special = COMBAT.special.raydog;
  const startX = owner.x + owner.facing * 36;
  const startY = owner.y - 70;
  const targetX = target.x;
  const targetY = target.y - target.height / 2;

  target.takeHit(special.damage, special.knockback, owner.facing);
  game.screenShake = COMBAT.effects.projectileShake;
  game.hitStop = COMBAT.effects.projectileHitStop;
  if (target.health <= 0) addParticle(target.x, target.y - 50, 'ko');

  spawnRaydogArcLightningEffect(owner, startX, startY, targetX, targetY);
}

function spawnRaydogArcLightningEffect(owner, startX, startY, targetX, targetY) {
  const special = COMBAT.special.raydog;

  projectiles.push({
    x: (startX + targetX) / 2,
    y: (startY + targetY) / 2,
    vx: 0,
    vy: 0,
    owner,
    dmg: special.damage,
    kb: special.knockback,
    life: special.displayFrames,
    radius: 0,
    color1: '#f5f3ff',
    color2: '#74b9ff',
    type: 'arcLightning',
    trail: [],
    hit: true,
    pullTimer: 0,
    rotation: 0,
    ownerAnchorX: owner.x,
    ownerAnchorY: owner.y,
    ownerAnchorFacing: owner.facing,
    fuseFrames: 0,
    exploded: false,
    startX,
    startY,
    targetX,
    targetY
  });
}

function spawnRaydogPassiveArcLightning(owner, target) {
  const special = COMBAT.special.raydog;
  const startX = owner.x;
  const startY = owner.y - 70;
  const ownerCenterY = owner.y - owner.height / 2;
  const targetCenterY = target.y - target.height / 2;
  const inRadius = Math.hypot(target.x - owner.x, targetCenterY - ownerCenterY) <= special.passiveRadius;

  if (target.health > 0 && inRadius) {
    spawnRaydogArcLightning(owner, target);
    return;
  }

  const targetX1 = FIGHTER_LAYOUT.boundaryPadding + Math.random() * (W - FIGHTER_LAYOUT.boundaryPadding * 2);
  const targetY1 = 30 + Math.random() * Math.max(40, owner.y * 0.35);
  const targetX2 = FIGHTER_LAYOUT.boundaryPadding + Math.random() * (W - FIGHTER_LAYOUT.boundaryPadding * 2);
  const targetY2 = 30 + Math.random() * Math.max(40, owner.y * 0.35);
  spawnRaydogArcLightningEffect(owner, startX, startY, targetX1, targetY1);
  spawnRaydogArcLightningEffect(owner, startX, startY, targetX2, targetY2);
}

function spawnCydogBomb(owner) {
  const special = COMBAT.special.cydog;
  const bomb = {
    x: owner.x + owner.facing * 84,
    y: owner.y - 34,
    vx: 0,
    vy: 0,
    owner,
    dmg: special.bombDamage,
    kb: special.bombKnockback,
    life: special.bombFuseFrames,
    radius: special.bombRadius,
    color1: '#f1c40f',
    color2: '#f39c12',
    type: 'bomb',
    trail: [],
    hit: true,
    pullTimer: 0,
    rotation: 0,
    ownerAnchorX: owner.x,
    ownerAnchorY: owner.y,
    ownerAnchorFacing: owner.facing,
    fuseFrames: special.bombFuseFrames,
    exploded: false
  };

  projectiles.push(bomb);
  return bomb;
}

function spawnTremdogShockwaveField(owner) {
  const special = COMBAT.special.tremdog;

  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].type === 'floorShockwave' && projectiles[i].owner === owner) {
      projectiles.splice(i, 1);
    }
  }

  projectiles.push({
    x: W / 2,
    y: GROUND - 6,
    vx: 0,
    vy: 0,
    owner,
    dmg: special.shockDamage,
    kb: special.shockKnockback,
    life: special.durationFrames,
    radius: 0,
    color1: '#ff7de9',
    color2: '#ff4fd8',
    type: 'floorShockwave',
    trail: [],
    hit: true,
    pullTimer: 0,
    rotation: 0,
    ownerAnchorX: owner.x,
    ownerAnchorY: owner.y,
    ownerAnchorFacing: owner.facing,
    fuseFrames: 0,
    exploded: false,
    pulseTimer: 1,
    pulseInterval: special.pulseIntervalFrames
  });
}

function spawnSubdogIceClone(owner) {
  const special = COMBAT.special.subdog;
  projectiles.push({
    x: owner.x,
    y: owner.y,
    owner,
    type: 'iceClone',
    life: special.cloneDurationFrames,
    radius: owner.width / 2 + 10,
    hit: false,
    lastOwnerFrame: owner.frame
  });
}

function spawnSmowkdawgSmokeCloud(owner) {
  const special = COMBAT.special.smowkdawg;
  projectiles.push({
    x: W / 2,
    y: GROUND,
    owner,
    type: 'smokeCloud',
    life: special.cloudDurationFrames,
    radius: W / 2,
    lastOwnerFrame: owner.frame
  });
}

function updateNoobSnakeSequence(p, index) {
  if (p.lastOwnerFrame === p.owner.frame) return;
  p.lastOwnerFrame = p.owner.frame;

  if (p.owner.health <= 0 || p.target.health <= 0) {
    projectiles.splice(index, 1);
    return;
  }

  const special = COMBAT.special.noobSaidog;
  p.elapsedFrames++;
  p.life--;

  if (p.retreating) {
    p.elapsedFrames -= 2;
    if (p.elapsedFrames <= 0) {
      projectiles.splice(index, 1);
    }
    return;
  }

  if (!p.captured) {
    p.x = p.target.x;
    if (p.elapsedFrames >= p.riseFrames) {
      if (p.target.isBlocking) {
        p.retreating = true;
        addParticle(p.target.x, p.target.y - 50, 'block');
        playImpactSound('block');
        p.target.blockTimer = COMBAT.block.stunFrames;
        p.owner.attackTimer = 0;
        p.owner.lastAttackType = '';
        p.owner.specialFormSource = '';
        p.owner.state = 'idle';
        game.screenShake = COMBAT.effects.harpoonShake;
        game.hitStop = COMBAT.effects.harpoonHitStop;
        return;
      }
      p.captured = true;
      p.target.applyNoobSnakeCapture(special.captureHoldMs);
      p.target.vx = 0;
      p.target.vy = 0;
      p.owner.attackTimer = 0;
      p.owner.lastAttackType = '';
      p.owner.specialFormSource = '';
      p.owner.state = 'idle';
      addParticle(p.target.x, p.target.y - 50, 'stunned');
      game.screenShake = COMBAT.effects.harpoonShake;
      game.hitStop = COMBAT.effects.harpoonHitStop;
      playImpactSound('hit');
      if (p.variant === 'REPDOG') {
        spawnNoobSaidogFireball(p.owner, p.target, 0, 1, p.variant);
      }
      p.barrageIndex = 0;
      p.barrageTimer = 0;
      playAttackSound('special');
    }
  }

  if (p.captured && p.variant !== 'REPDOG' && p.barrageIndex < special.barrageCount) {
    p.barrageTimer++;
    if (p.barrageTimer % 4 === 0) {
      spawnNoobSaidogFireball(p.owner, p.target, p.barrageIndex, special.barrageCount, p.variant);
      p.barrageIndex++;
    }
  }

  if (p.life <= 0) projectiles.splice(index, 1);
}

function updateNoobFireball(p, index) {
  if (p.lastOwnerFrame === p.owner.frame) return;
  p.lastOwnerFrame = p.owner.frame;
  p.life--;

  if (p.owner.health <= 0 || p.target.health <= 0 || p.life <= 0) {
    projectiles.splice(index, 1);
    return;
  }

  if (p.launchFrames > 0) {
    p.launchFrames--;
    p.trail.push({ x: p.x, y: p.y, life: 12 });
    if (p.trail.length > 10) p.trail.shift();
    p.trail.forEach(point => point.life--);
    p.trail = p.trail.filter(point => point.life > 0);
    p.x += p.vx;
    p.y += p.vy;
    return;
  }

  const targetX = p.target.x;
  const targetY = p.target.y - p.target.height / 2;
  const dx = targetX - p.x;
  const dy = targetY - p.y;
  const distance = Math.hypot(dx, dy);
  const hitDistance = p.radius + Math.min(p.target.width, p.target.height) * 0.3;

  if (distance <= p.speed + hitDistance) {
    if (p.target.hitCooldown > 0) {
      p.x = targetX;
      p.y = targetY;
      return;
    }

    p.target.takeHit(p.dmg, p.kb, p.owner.facing);
    addParticle(targetX, targetY, 'hit');
    game.screenShake = COMBAT.effects.projectileShake;
    game.hitStop = COMBAT.effects.projectileHitStop;
    if (p.target.health <= 0) playImpactSound('ko');
    else playImpactSound('hit');
    projectiles.splice(index, 1);
    return;
  }

  p.trail.push({ x: p.x, y: p.y, life: 12 });
  if (p.trail.length > 10) p.trail.shift();
  p.trail.forEach(point => point.life--);
  p.trail = p.trail.filter(point => point.life > 0);
  p.x += dx / distance * p.speed;
  p.y += dy / distance * p.speed;
}

function updateRepdogAcid(p, index) {
  if (p.lastOwnerFrame === p.owner.frame) return;
  p.lastOwnerFrame = p.owner.frame;
  p.life--;

  if (p.owner.health <= 0 || p.life <= 0) {
    projectiles.splice(index, 1);
    return;
  }

  if (p.launchFrames > 0) {
    p.launchFrames--;
    p.trail.push({ x: p.x, y: p.y, life: 12 });
    if (p.trail.length > 10) p.trail.shift();
    p.trail.forEach(point => point.life--);
    p.trail = p.trail.filter(point => point.life > 0);
    p.x += p.vx;
    p.y += p.vy;
    return;
  }

  const target = p.owner === p1 ? p2 : p1;
  const targetX = target.x;
  const targetY = target.y - target.height / 2;
  const dx = targetX - p.x;
  const dy = targetY - p.y;
  const distance = Math.hypot(dx, dy);
  const hitDistance = p.radius + Math.min(target.width, target.height) * 0.3;

  if (distance <= p.speed + hitDistance) {
    if (target.hitCooldown > 0) {
      p.x = targetX;
      p.y = targetY;
      return;
    }

    target.takeHit(p.dmg, p.kb, p.owner.facing);
    addParticle(targetX, targetY, 'hit');
    game.screenShake = COMBAT.effects.projectileShake;
    game.hitStop = COMBAT.effects.projectileHitStop;
    if (target.health <= 0) playImpactSound('ko');
    else playImpactSound('hit');
    projectiles.splice(index, 1);
    return;
  }

  p.trail.push({ x: p.x, y: p.y, life: 12 });
  if (p.trail.length > 10) p.trail.shift();
  p.trail.forEach(point => point.life--);
  p.trail = p.trail.filter(point => point.life > 0);
  p.x += p.vx;
  p.y += p.vy;
}

function updateSnekCoil(p, index) {
  if (p.lastOwnerFrame === p.owner.frame) return;
  p.lastOwnerFrame = p.owner.frame;
  p.life--;
  if (p.owner.health <= 0 || p.target.health <= 0 || p.life <= 0) projectiles.splice(index, 1);
}

function updateProjectiles(opponent) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    const target = p.owner === p1 ? p2 : p1;

    if (p.type === 'noobSnake') {
      updateNoobSnakeSequence(p, i);
      continue;
    }

    if (p.type === 'noobFireball') {
      updateNoobFireball(p, i);
      continue;
    }

    if (p.type === 'repdogAcid') {
      updateRepdogAcid(p, i);
      continue;
    }

    if (p.type === 'snekCoil') {
      updateSnekCoil(p, i);
      continue;
    }

    if (p.type === 'iceClone') {
      if (p.lastOwnerFrame === p.owner.frame) continue;
      p.lastOwnerFrame = p.owner.frame;
      p.life--;
      if (p.owner.health <= 0 || p.life <= 0) {
        projectiles.splice(i, 1);
        continue;
      }
      if (!p.hit && target.health > 0) {
        const dx = target.x - p.x;
        const dy = (target.y - target.height / 2) - (p.y - p.owner.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < p.radius + target.width / 2) {
          if (target.isBlocking) {
            addParticle(target.x, target.y - 50, 'block');
            playImpactSound('block');
            target.blockTimer = COMBAT.block.stunFrames;
          } else {
            const special = COMBAT.special.subdog;
            target.freezeTimer = special.cloneFreezeMs;
            target.attackTimer = 0;
            target.lastAttackType = '';
            target.blockTimer = 0;
            target.isBlocking = false;
            target.state = 'frozen';
            target.vx = 0;
            target.vy = 0;
            addParticle(p.x, p.y - p.owner.height / 2, 'freeze');
            playImpactSound('freeze');
            game.screenShake = COMBAT.effects.freezeShake;
            game.hitStop = COMBAT.effects.freezeHitStop;
          }
          p.hit = true;
          projectiles.splice(i, 1);
          continue;
        }
      }
      continue;
    }

    if (p.type === 'smokeCloud') {
      if (p.lastOwnerFrame === p.owner.frame) continue;
      p.lastOwnerFrame = p.owner.frame;
      p.life--;
      if (p.life <= 0) {
        projectiles.splice(i, 1);
        continue;
      }
      continue;
    }

    p.life--;

    // Harpoon pull logic
    if (p.type === 'harpoon' && p.hit) {
      p.pullTimer++;
      const pullDir = p.owner.facing;
      p.owner.harpoonLockTimer = COMBAT.special.skorpdog.ownerLockFrames;
      p.owner.x = p.ownerAnchorX;
      p.owner.y = p.ownerAnchorY;
      p.owner.vx = 0;
      p.owner.vy = 0;

      // Pull opponent all the way into point-blank follow-up range.
      const targetX = getPointBlankTargetX(p.owner, target);
      const dx = targetX - target.x;
      const pullSpeed = 12;

      if (Math.abs(dx) > 5) {
        target.x += Math.sign(dx) * Math.min(pullSpeed, Math.abs(dx));
        target.vx = Math.sign(dx) * pullSpeed;
      } else {
        // Opponent is close enough, finish pull
        target.x = targetX;
        projectiles.splice(i, 1);
      }

      // Keep the harpoon visually lodged in the opponent so the chain retracts as they are reeled in.
      p.x = target.x - pullDir * (target.width / 2 - 6);
      p.y = target.y - 50;

      // Timeout safety for pathological cases only; allow long pulls to finish.
      if (p.pullTimer > 120) {
        projectiles.splice(i, 1);
      }
      continue;
    }

    if (p.type === 'net' && p.hit) {
      p.pullTimer++;
      const targetX = p.bombAnchorX - p.ownerAnchorFacing * (target.width / 2 + Math.max(12, COMBAT.special.cydog.bombRadius * 0.35));
      const dx = targetX - target.x;
      const pullSpeed = COMBAT.special.cydog.capturePullSpeed;

      if (Math.abs(dx) > 5) {
        target.x += Math.sign(dx) * Math.min(pullSpeed, Math.abs(dx));
        target.vx = 0;
        target.vy = 0;
      } else {
        target.x = targetX;
        target.vx = 0;
        target.vy = 0;
        projectiles.splice(i, 1);
      }

      p.x = target.x - p.ownerAnchorFacing * 12;
      p.y = target.y - 52;

      if (p.pullTimer > 150) {
        projectiles.splice(i, 1);
      }
      continue;
    }

    if (p.type === 'lightningCloud') {
      p.x = target.x;
      p.y = target.y - 130;
      p.targetX = target.x;
      p.targetY = target.y - target.height / 2;
      p.rotation += 0.03;
      p.pulseTimer--;
      if (p.strikeFrames > 0) p.strikeFrames--;

      if (p.pulseTimer <= 0 && target.health > 0) {
        p.pulseTimer = p.pulseInterval;
        p.strikeFrames = 8;
        target.takeHit(p.dmg, p.kb, p.owner.facing);
        addParticle(target.x, target.y - 50, 'hit');
        game.screenShake = COMBAT.effects.projectileShake;
        game.hitStop = COMBAT.effects.projectileHitStop;
        if (target.health <= 0) playImpactSound('ko');
        else playImpactSound('hit');
      }

      if (p.life <= 0) {
        projectiles.splice(i, 1);
      }
      continue;
    }

    if (p.type === 'arcLightning') {
      if (p.life <= 0) {
        projectiles.splice(i, 1);
      }
      continue;
    }

    if (p.type === 'floorShockwave') {
      p.pulseTimer--;
      p.rotation += 0.08;

      if (p.pulseTimer <= 0) {
        p.pulseTimer = p.pulseInterval;

        if (target.health > 0 && target.onGround) {
          const blocked = target.takeHit(p.dmg, p.kb, p.owner.facing);
          if (!blocked) {
            target.applyStunnedStatus(COMBAT.special.tremdog.shockStunMs);
            addParticle(target.x, target.y - 26, 'stunned');
          }
          addParticle(target.x, target.y - 26, 'hit');
          game.screenShake = COMBAT.effects.projectileShake;
          game.hitStop = COMBAT.effects.projectileHitStop;
          if (target.health <= 0) playImpactSound('ko');
          else playImpactSound('hit');
        }
      }

      if (p.life <= 0) {
        projectiles.splice(i, 1);
      }
      continue;
    }

    if (p.type === 'bomb') {
      if (p.life <= 0 && !p.exploded) {
        p.exploded = true;
        const targetDistance = Math.hypot(target.x - p.x, target.y - 50 - p.y);
        if (targetDistance <= p.radius + target.width / 2) {
          target.takeHit(p.dmg, p.kb, p.owner.facing);
        }
        releaseCapturedOpponent(target);
        addParticle(p.x, p.y, 'ko');
        addParticle(p.x, p.y, 'hit');
        game.screenShake = COMBAT.effects.projectileShake;
        game.hitStop = COMBAT.effects.projectileHitStop;
        if (target.health <= 0) playImpactSound('ko');
        else playImpactSound('hit');
        projectiles.splice(i, 1);
      }
      continue;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Trail
    p.trail.push({ x: p.x, y: p.y, life: p.type === 'harpoon' ? 8 : 15 });
    if (p.trail.length > (p.type === 'harpoon' ? 6 : 12)) p.trail.shift();
    p.trail.forEach(t => t.life--);
    p.trail = p.trail.filter(t => t.life > 0);

    // Out of bounds
    if (p.x < -50 || p.x > W + 50 || p.life <= 0) {
      projectiles.splice(i, 1);
      continue;
    }

    // Collision with opponent
    if (opponent !== p.owner && !p.hit) {
      const hb = opponent.getHurtbox();
      if (p.x > hb.x && p.x < hb.x + hb.w &&
          p.y > hb.y && p.y < hb.y + hb.h) {
        if (p.type === 'harpoon') {
          const blocked = opponent.takeHit(p.dmg, p.kb, p.owner.facing);
          if (blocked) {
            addParticle(p.x, p.y, 'block');
            playImpactSound('block');
            projectiles.splice(i, 1);
            continue;
          }
          // Harpoon: hit and pull
          p.hit = true;
          p.vx = 0;
          p.vy = 0;
          p.pullTimer = 0;
          p.ownerAnchorX = p.owner.x;
          p.ownerAnchorY = p.owner.y;
          p.owner.vx = 0;
          p.owner.vy = 0;
          opponent.applyStunnedStatus(COMBAT.status.skorpdogStunMs);
          addParticle(p.x, p.y, 'hit');
          addParticle(opponent.x, opponent.y - 65, 'stunned');
          game.screenShake = COMBAT.effects.harpoonShake;
          game.hitStop = COMBAT.effects.harpoonHitStop;
          if (opponent.health <= 0) playImpactSound('ko');
        } else if (p.type === 'net') {
          if (opponent.isBlocking) {
            addParticle(p.x, p.y, 'block');
            playImpactSound('block');
            opponent.blockTimer = COMBAT.block.stunFrames;
            projectiles.splice(i, 1);
            continue;
          }
          p.hit = true;
          p.vx = 0;
          p.vy = 0;
          p.pullTimer = 0;
          p.ownerAnchorX = p.owner.x;
          p.ownerAnchorY = p.owner.y;
          p.ownerAnchorFacing = p.owner.facing;
          p.owner.attackTimer = 0;
          p.owner.state = 'idle';
          opponent.applyStunnedStatus(COMBAT.special.cydog.captureHoldMs);
          addParticle(p.x, p.y, 'stunned');
          game.screenShake = COMBAT.effects.freezeShake;
          game.hitStop = COMBAT.effects.freezeHitStop;
        } else if (p.type === 'snowflake') {
          // Snowflake: freeze opponent (blocked if opponent is blocking)
          if (opponent.isBlocking) {
            addParticle(p.x, p.y, 'block');
            playImpactSound('block');
            opponent.blockTimer = COMBAT.block.stunFrames;
            projectiles.splice(i, 1);
            continue;
          }
          opponent.freezeTimer = 2000;
          opponent.attackTimer = 0;
          opponent.lastAttackType = '';
          opponent.blockTimer = 0;
          opponent.isBlocking = false;
          opponent.state = 'frozen';
          opponent.vx = 0;
          opponent.vy = 0;
          addParticle(p.x, p.y, 'freeze');
          playImpactSound('freeze');
          game.screenShake = COMBAT.effects.freezeShake;
          game.hitStop = COMBAT.effects.freezeHitStop;
          projectiles.splice(i, 1);
        } else {
          // Regular projectile / missile hit
          opponent.takeHit(p.dmg, p.kb, p.owner.facing);
          addParticle(p.x, p.y, 'hit');
          game.screenShake = COMBAT.effects.projectileShake;
          game.hitStop = COMBAT.effects.projectileHitStop;
          if (opponent.health <= 0) playImpactSound('ko');
          projectiles.splice(i, 1);
        }
      }
    }
  }
}

function drawProjectiles() {
  projectiles.forEach(p => {
    if (p.owner && p.owner.makdogSpecialActive) return;
    const alpha = Math.min(1, p.life / 20);

    if (p.type === 'noobSnake') {
      const isRepdog = p.variant === 'REPDOG';
      const rise = Math.min(1, p.elapsedFrames / p.riseFrames);
      const easedRise = 1 - Math.pow(1 - rise, 3);
      const bottomY = H + 36;
      const headY = bottomY + (p.target.y - p.target.height * 0.72 - bottomY) * easedRise;
      const neckHeight = Math.max(0, bottomY - headY - 16);
      const facing = p.target.facing;
      const headX = p.target.x - facing * (p.target.width * 0.6 + 32);
      const eyeFlash = 0.65 + (Math.sin(Date.now() * 0.025) + 1) * 0.17;
      const tongueWag = Math.sin(Date.now() * 0.024) * 6;
      const snakeBody = isRepdog ? '#1b5e20' : '#030303';
      const snakeScale = isRepdog ? '#2e7d32' : '#121212';
      const snakeBodyLight = isRepdog ? '#2e7d32' : '#030303';
      const snakeScaleLight = isRepdog ? '#388E3C' : '#171717';
      const snakeHead = isRepdog ? '#1b5e20' : '#050505';
      const snakeHeadLight = isRepdog ? '#2e7d32' : '#101010';
      const snakePupil = isRepdog ? '#1b5e20' : '#000';
      const eyeColor = isRepdog ? '#ffeb3b' : '#ff1744';
      const eyeGlow = isRepdog ? 'rgba(255, 235, 59,' : 'rgba(255, 20, 45,';
      const tongueColor = isRepdog ? '#ffeb3b' : '#ff1744';

      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = isRepdog ? '#0a3d0a' : '#000';
      ctx.beginPath();
      ctx.ellipse(p.x, GROUND + 6, 54 + rise * 20, 14 + rise * 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = snakeBody;
      ctx.beginPath();
      ctx.moveTo(p.x - 28, bottomY);
      ctx.bezierCurveTo(p.x - 37, bottomY - neckHeight * 0.36, headX - 31, headY + 42, headX - 25, headY + 16);
      ctx.bezierCurveTo(headX - 18, headY + 4, headX + 17, headY + 4, headX + 25, headY + 16);
      ctx.bezierCurveTo(headX + 31, headY + 42, p.x + 37, bottomY - neckHeight * 0.36, p.x + 28, bottomY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = snakeScale;
      ctx.lineWidth = 2;
      for (let y = headY + 38; y < bottomY - 16; y += 18) {
        const taper = Math.min(1, (y - headY) / Math.max(1, neckHeight));
        const centerX = headX + (p.x - headX) * taper;
        const halfWidth = 20 + taper * 8;
        ctx.beginPath();
        ctx.moveTo(centerX - halfWidth, y);
        ctx.lineTo(centerX + halfWidth, y);
        ctx.stroke();
      }

      if (p.captured) {
        const coilWave = Math.sin(Date.now() * 0.006);
        const coilBaseY = p.target.y - p.target.height * 0.28;
        const lowestCoilWidth = p.target.width * 0.72 + 13;
        const tailEndX = p.target.x - facing * lowestCoilWidth;

        ctx.strokeStyle = snakeBody;
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, bottomY);
        ctx.bezierCurveTo(p.x - facing * 18, bottomY - neckHeight * 0.34, tailEndX - facing * 30, coilBaseY + 44, tailEndX, coilBaseY);
        ctx.stroke();

        ctx.strokeStyle = snakeScaleLight;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x - facing * 3, bottomY - 8);
        ctx.bezierCurveTo(p.x - facing * 18, bottomY - neckHeight * 0.34, tailEndX - facing * 30, coilBaseY + 44, tailEndX, coilBaseY);
        ctx.stroke();
        ctx.lineCap = 'butt';

        for (let i = 0; i < 3; i++) {
          const coilY = coilBaseY - i * 22 + Math.sin(Date.now() * 0.007 + i) * 3;
          const coilWidth = p.target.width * 0.72 + 13 + Math.sin(Date.now() * 0.008 + i) * 4;
          const coilHeight = 11 + i * 2;
          const coilX = p.target.x + coilWave * (i % 2 === 0 ? 4 : -4);

          ctx.strokeStyle = snakeBody;
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.ellipse(coilX, coilY, coilWidth, coilHeight, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = snakeScaleLight;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(coilX, coilY - 1, coilWidth - 5, Math.max(3, coilHeight - 5), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.save();
      ctx.translate(headX, headY);
      ctx.scale(facing, 1);
      ctx.fillStyle = snakeHead;
      ctx.beginPath();
      ctx.moveTo(-31, 5);
      ctx.lineTo(-22, -19);
      ctx.lineTo(13, -24);
      ctx.lineTo(38, -10);
      ctx.lineTo(52, 2);
      ctx.lineTo(38, 17);
      ctx.lineTo(8, 23);
      ctx.lineTo(-24, 17);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = snakeHeadLight;
      ctx.beginPath();
      ctx.moveTo(15, -8);
      ctx.lineTo(48, -2);
      ctx.lineTo(52, 2);
      ctx.lineTo(43, 9);
      ctx.lineTo(13, 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = snakePupil;
      ctx.beginPath();
      ctx.ellipse(39, -1, 3, 2, 0, 0, Math.PI * 2);
      ctx.ellipse(39, 7, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `${eyeGlow} ${eyeFlash})`;
      ctx.beginPath();
      ctx.ellipse(9, -9, 5, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(-9, -8, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = tongueColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 5);
      ctx.lineTo(64, 7 + tongueWag * 0.35);
      ctx.lineTo(73, 2 + tongueWag);
      ctx.moveTo(64, 7 + tongueWag * 0.35);
      ctx.lineTo(73, 13 + tongueWag);
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'noobFireball') {
      const flash = 0.55 + (Math.sin(Date.now() * 0.04) + 1) * 0.2;
      p.trail.forEach(point => {
        ctx.globalAlpha = alpha * (point.life / 12) * 0.45;
        ctx.fillStyle = '#9b001c';
        ctx.beginPath();
        ctx.arc(point.x, point.y, p.radius * point.life / 14, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = alpha * 0.55;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.4);
      glow.addColorStop(0, `rgba(255, 255, 255, ${flash})`);
      glow.addColorStop(0.25, '#ff1744');
      glow.addColorStop(1, 'rgba(120, 0, 18, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = Math.sin(Date.now() * 0.05) > 0 ? '#ff1744' : '#8b0018';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x - 3, p.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'repdogAcid') {
      const wobble = Date.now() * 0.008;
      p.trail.forEach(point => {
        ctx.globalAlpha = alpha * (point.life / 12) * 0.3;
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath();
        ctx.arc(point.x, point.y, p.radius * point.life / 16, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = alpha * 0.4;
      const acidGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      acidGlow.addColorStop(0, 'rgba(102, 187, 106, 0.6)');
      acidGlow.addColorStop(1, 'rgba(27, 94, 32, 0)');
      ctx.fillStyle = acidGlow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(p.x + Math.sin(wobble) * 2, p.y + Math.cos(wobble) * 2, p.radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath();
      ctx.arc(p.x + Math.cos(wobble * 1.3) * 3, p.y + Math.sin(wobble * 0.9) * 3, p.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#81C784';
      ctx.beginPath();
      ctx.arc(p.x + Math.sin(wobble * 0.7) * 2, p.y - 2, p.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'snekCoil') {
      const coilWave = Math.sin(Date.now() * 0.007);
      const coilBaseY = p.target.y - p.target.height * 0.28;
      ctx.globalAlpha = alpha;
      for (let i = 0; i < 3; i++) {
        const coilY = coilBaseY - i * 22 + Math.sin(Date.now() * 0.008 + i) * 3;
        const coilWidth = p.target.width * 0.72 + 13 + Math.sin(Date.now() * 0.009 + i) * 4;
        const coilHeight = 11 + i * 2;
        const coilX = p.target.x + coilWave * (i % 2 === 0 ? 4 : -4);
        ctx.strokeStyle = '#030303';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.ellipse(coilX, coilY, coilWidth, coilHeight, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(coilX, coilY - 1, coilWidth - 5, Math.max(3, coilHeight - 5), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (p.type === 'iceClone') {
      const cloneAlpha = Math.min(1, p.life / 30) * 0.7;
      const shimmer = Math.sin(Date.now() * 0.01) * 0.1;
      ctx.globalAlpha = cloneAlpha + shimmer;

      // Ice dog body
      ctx.fillStyle = '#87ceeb';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y - 30, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ice dog head
      ctx.fillStyle = '#add8e6';
      ctx.beginPath();
      ctx.ellipse(p.x + 8, p.y - 50, 14, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ice dog ears
      ctx.fillStyle = '#87ceeb';
      ctx.beginPath();
      ctx.ellipse(p.x - 2, p.y - 62, 5, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x + 16, p.y - 60, 4, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Frozen eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(p.x + 4, p.y - 52, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x + 12, p.y - 52, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ice crystals
      ctx.strokeStyle = '#b0e0e6';
      ctx.lineWidth = 1;
      for (let j = 0; j < 4; j++) {
        const angle = (j / 4) * Math.PI * 2 + Date.now() * 0.002;
        const r = 28 + Math.sin(Date.now() * 0.005 + j) * 4;
        const cx = p.x + Math.cos(angle) * r;
        const cy = p.y - 35 + Math.sin(angle) * r * 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 5);
        ctx.lineTo(cx + 3, cy);
        ctx.lineTo(cx, cy + 5);
        ctx.lineTo(cx - 3, cy);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    } else if (p.type === 'smokeCloud') {
      const smokeAlpha = Math.min(1, p.life / 30) * 0.5;
      const t = Date.now() * 0.002;

      for (let j = 0; j < 14; j++) {
        const baseX = (j / 14) * W + W / 28;
        const cx = baseX + Math.sin(t + j * 1.7) * 12;
        const cy = GROUND - 12 + Math.sin(t * 0.8 + j * 2.3) * 8;
        const r = 12 + Math.sin(t * 0.5 + j) * 4;
        ctx.globalAlpha = smokeAlpha * (0.4 + Math.sin(t + j * 0.9) * 0.2);
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let j = 0; j < 10; j++) {
        const baseX = (j / 10) * W + W / 20;
        const cx = baseX + Math.cos(t * 1.3 + j * 2.1) * 15;
        const cy = GROUND - 35 + Math.sin(t * 0.6 + j * 1.8) * 10;
        const r = 7 + Math.sin(t * 0.8 + j * 1.2) * 3;
        ctx.globalAlpha = smokeAlpha * (0.25 + Math.sin(t * 1.1 + j) * 0.15);
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let j = 0; j < 8; j++) {
        const baseX = (j / 8) * W + W / 16;
        const cx = baseX + Math.sin(t * 0.9 + j * 2.5) * 18;
        const cy = GROUND - 70 + Math.sin(t * 0.5 + j * 1.4) * 12;
        const r = 5 + Math.sin(t * 0.7 + j * 1.1) * 2;
        ctx.globalAlpha = smokeAlpha * (0.18 + Math.sin(t * 0.8 + j) * 0.1);
        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let j = 0; j < 6; j++) {
        const baseX = (j / 6) * W + W / 12;
        const cx = baseX + Math.cos(t * 1.1 + j * 1.9) * 20;
        const cy = GROUND - 105 + Math.sin(t * 0.4 + j * 2.0) * 14;
        const r = 3 + Math.sin(t * 0.6 + j * 0.9) * 1.5;
        ctx.globalAlpha = smokeAlpha * (0.12 + Math.sin(t * 0.7 + j) * 0.08);
        ctx.fillStyle = '#bbb';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    } else if (p.type === 'harpoon') {
      const ownerX = p.owner.x;
      const ownerY = p.owner.y - 50;

      // Chain/rope from owner to harpoon
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ownerX, ownerY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Chain links
      const dx = p.x - ownerX;
      const dy = p.y - ownerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const linkCount = Math.floor(dist / 12);
      ctx.fillStyle = '#aaa';
      for (let i = 1; i < linkCount; i++) {
        const t = i / linkCount;
        const lx = ownerX + dx * t;
        const ly = ownerY + dy * t;
        ctx.beginPath();
        ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Diamond tip
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#c0c0c0';
      ctx.beginPath();
      ctx.moveTo(p.x + 10, p.y);
      ctx.lineTo(p.x, p.y - 7);
      ctx.lineTo(p.x - 6, p.y);
      ctx.lineTo(p.x, p.y + 7);
      ctx.closePath();
      ctx.fill();

      // Diamond outline
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Diamond center highlight
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x + 1, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (p.type === 'snowflake') {
      // Snowflake projectile
      p.rotation += 0.05;
      
      // Trail
      p.trail.forEach(t => {
        const ta = (t.life / 15) * 0.3 * alpha;
        ctx.globalAlpha = ta;
        ctx.fillStyle = '#b0e0e6';
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.radius * 0.4 * (t.life / 15), 0, Math.PI * 2);
        ctx.fill();
      });

      // Glow
      ctx.globalAlpha = alpha * 0.4;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
      glow.addColorStop(0, '#87ceeb');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Snowflake arms
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i / 6) * Math.PI * 2);
        
        // Main arm
        ctx.fillStyle = '#fff';
        ctx.fillRect(-1, -p.radius, 2, p.radius);
        
        // Branches
        ctx.fillStyle = '#e0ffff';
        ctx.beginPath();
        ctx.moveTo(0, -p.radius * 0.7);
        ctx.lineTo(-4, -p.radius * 0.5);
        ctx.lineTo(0, -p.radius * 0.6);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -p.radius * 0.7);
        ctx.lineTo(4, -p.radius * 0.5);
        ctx.lineTo(0, -p.radius * 0.6);
        ctx.fill();
        
        ctx.restore();
      }
      
      // Center crystal
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    } else if (p.type === 'lightningCloud') {
      const pulse = p.strikeFrames > 0 ? p.strikeFrames / 8 : 0;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 1.7);
      glow.addColorStop(0, 'rgba(199, 125, 255, 0.65)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = alpha;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8e44ad';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.55, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x - 24, p.y + 2, p.radius * 0.52, p.radius * 0.34, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x + 24, p.y + 1, p.radius * 0.48, p.radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c77dff';
      ctx.beginPath();
      ctx.ellipse(p.x - 10, p.y - 4, p.radius * 0.36, p.radius * 0.2, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x + 14, p.y - 5, p.radius * 0.3, p.radius * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      if (pulse > 0) {
        ctx.strokeStyle = '#f5f3ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 12);
        ctx.lineTo(p.x - 8, p.y + 34);
        ctx.lineTo(p.x + 6, p.y + 34);
        ctx.lineTo(p.x - 10, p.targetY - 12);
        ctx.lineTo(p.x + 2, p.targetY - 12);
        ctx.lineTo(p.targetX - 4, p.targetY + 10);
        ctx.stroke();

        ctx.globalAlpha = pulse * alpha * 0.35;
        ctx.fillStyle = '#d6b3ff';
        ctx.beginPath();
        ctx.ellipse(p.targetX, p.targetY + 8, 34, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.type === 'arcLightning') {
      const alphaPulse = alpha * Math.max(0, p.life / COMBAT.special.raydog.displayFrames);
      ctx.globalAlpha = alphaPulse;
      ctx.strokeStyle = '#f5f3ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.startX, p.startY);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.25, p.startY - 18);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.45, p.startY + 8);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.68, p.targetY - 24);
      ctx.lineTo(p.targetX, p.targetY + 8);
      ctx.stroke();

      ctx.strokeStyle = '#74b9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.startX, p.startY);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.18, p.startY - 6);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.42, p.startY + 18);
      ctx.lineTo(p.startX + (p.targetX - p.startX) * 0.7, p.targetY - 10);
      ctx.lineTo(p.targetX, p.targetY + 12);
      ctx.stroke();
    } else if (p.type === 'missile') {
      p.rotation = Math.atan2(p.vy, p.vx || p.owner.facing);

      p.trail.forEach(t => {
        const ta = (t.life / 15) * 0.35 * alpha;
        ctx.globalAlpha = ta;
        ctx.fillStyle = '#ff9f43';
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.radius * 0.75 * (t.life / 15), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;

      ctx.fillStyle = '#dfe6e9';
      ctx.fillRect(-16, -4, 20, 8);
      ctx.beginPath();
      ctx.moveTo(4, -4);
      ctx.lineTo(12, 0);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(-16, -5, 7, 10);
      ctx.fillStyle = '#111';
      ctx.fillRect(-4, -2, 5, 4);

      ctx.fillStyle = '#ffdd59';
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-28 - Math.random() * 5, -5);
      ctx.lineTo(-23, 0);
      ctx.lineTo(-28 - Math.random() * 5, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else if (p.type === 'net') {
      p.rotation += 0.12;
      const target = p.owner === p1 ? p2 : p1;
      const capturedHurtbox = p.hit ? target.getHurtbox() : null;
      const netRadiusX = capturedHurtbox ? Math.max(p.radius, capturedHurtbox.w * 0.65) : p.radius;
      const netRadiusY = capturedHurtbox ? Math.max(p.radius, capturedHurtbox.h * 0.58) : p.radius;

      p.trail.forEach(t => {
        const ta = (t.life / 15) * 0.25 * alpha;
        ctx.globalAlpha = ta;
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.radius * 0.45 * (t.life / 15), 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 3;

      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(-netRadiusX, 0);
        ctx.lineTo(netRadiusX, 0);
        ctx.stroke();
      }

      ctx.strokeStyle = '#7bed9f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, netRadiusX * 0.95, netRadiusY * 0.95, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'bomb') {
      const fuseProgress = 1 - p.life / p.fuseFrames;

      ctx.globalAlpha = 0.25 + fuseProgress * 0.2;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 1.7);
      glow.addColorStop(0, '#ffe66d');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(p.x - 6, p.y - 8, 2, p.x, p.y, p.radius);
      grad.addColorStop(0, '#fff7b2');
      grad.addColorStop(0.35, '#f1c40f');
      grad.addColorStop(1, '#d68910');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#7b241c';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = fuseProgress > 0.7 ? '#2ecc71' : '#f39c12';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.radius * 0.6);
      ctx.quadraticCurveTo(p.x + 6, p.y - p.radius - 8, p.x + 14, p.y - p.radius - 2);
      ctx.stroke();

      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(p.x + 14, p.y - p.radius - 2, 3 + Math.sin(Date.now() * 0.02) * 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'floorShockwave') {
      const pulseAlpha = 0.2 + (0.5 + Math.sin(Date.now() * 0.04) * 0.5) * 0.35;
      const band = ctx.createLinearGradient(0, GROUND - 24, 0, GROUND + 18);
      band.addColorStop(0, 'rgba(255, 125, 233, 0)');
      band.addColorStop(0.35, 'rgba(255, 125, 233, 0.35)');
      band.addColorStop(1, 'rgba(255, 79, 216, 0)');

      ctx.globalAlpha = pulseAlpha;
      ctx.fillStyle = band;
      ctx.fillRect(0, GROUND - 24, W, 32);

      ctx.globalAlpha = 0.65 + Math.sin(Date.now() * 0.06) * 0.2;
      ctx.strokeStyle = '#ff7de9';
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const cx = (i + 0.5) * (W / 6);
        const radiusX = 58 + Math.sin(p.rotation + i * 0.8) * 12;
        const radiusY = 12 + Math.cos(p.rotation + i * 0.5) * 4;
        ctx.beginPath();
        ctx.ellipse(cx, GROUND + 2, radiusX, radiusY, 0, Math.PI, 0, true);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = '#ff4fd8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND - 2);
      for (let x = 0; x <= W; x += 24) {
        const waveY = GROUND - 2 - Math.sin((x / 40) + p.rotation * 4) * 6;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    } else {
      // Regular energy ball projectile
      // Trail
      p.trail.forEach(t => {
        const ta = (t.life / 15) * 0.4 * alpha;
        ctx.globalAlpha = ta;
        ctx.fillStyle = p.color2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.radius * 0.6 * (t.life / 15), 0, Math.PI * 2);
        ctx.fill();
      });

      // Glow
      const flashGreen = p.owner && p.owner.name === 'SHAO CATNIP' && Math.sin(Date.now() * 0.03) > 0;
      const flashColor1 = flashGreen ? '#7bed9f' : '#2ecc71';
      const flashColor2 = flashGreen ? '#2ecc71' : '#27ae60';
      ctx.globalAlpha = alpha * 0.3;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      glow.addColorStop(0, p.owner && p.owner.name === 'CATNIP' ? flashColor1 : p.color1);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.3, p.owner && p.owner.name === 'CATNIP' ? flashColor1 : p.color1);
      grad.addColorStop(0.7, p.owner && p.owner.name === 'CATNIP' ? flashColor2 : p.color2);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Sparks
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Date.now() * 0.01;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(a) * 6, p.y + Math.sin(a) * 6);
        ctx.lineTo(p.x + Math.cos(a) * (p.radius + 4), p.y + Math.sin(a) * (p.radius + 4));
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  });
}


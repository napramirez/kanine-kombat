class Fighter {
  constructor(x, char, facing) {
    this.x = x;
    this.y = GROUND;
    this.vx = 0;
    this.vy = 0;
    this.name = char.name;
    this.color1 = char.color1;
    this.color2 = char.color2;
    this.eyeColor = char.eyeColor;
    this.speed = char.speed;
    this.scale = char.scale || 1;
    this.specialGain = char.specialGain;
    this.passiveSpecialGain = char.passiveSpecialGain || 0;
    this.maxHealth = char.health;
    this.facing = facing;
    this.health = char.health;
    this.special = 0;
    this.passiveSpecial = 0;
    this.state = 'idle';
    this.frame = 0;
    this.attackTimer = 0;
    this.hitTimer = 0;
    this.blockTimer = 0;
    this.comboCount = 0;
    this.lastHitTime = 0;
    this.isBlocking = false;
    this.isCrouching = false;
    this.onGround = true;
    this.width = FIGHTER_LAYOUT.width * this.scale;
    this.height = FIGHTER_LAYOUT.height * this.scale;
    this.roundsWon = 0;
    this.hitCooldown = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.lastAttackType = '';
    this.freezeTimer = 0;
    this.stunnedTimer = 0;
    this.noobCaptureTimer = 0;
    this.noobCaptureX = x;
    this.noobCaptureY = GROUND;
    this.victoryTimer = 0;
    this.defeatTimer = 0;
    this.victoryPose = 0;
    this.teleportPhase = '';
    this.teleportPhaseTimer = 0;
    this.teleportOffset = 0;
    this.teleportPunchDone = false;
    this.harpoonLockTimer = 0;
    this.borkoImpactX = x;
    this.borkoImpactY = GROUND - 24;
    this.borkoLeapActive = false;
    this.borkoLeapStartX = x;
    this.snekSlitherActive = false;
    this.doggbalDashActive = false;
    this.doggbalDashStartX = x;
    this.doggbalDashTargetX = x;
    this.doggbalDashHit = false;
    this.doggbalSpinTimer = 0;
    this.doggbalSpinDuration = 0;
    this.doggomeleonFormIndex = -1;
    this.specialFormSource = '';
  }

  reset(x) {
    this.x = x;
    this.y = GROUND;
    this.vx = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.special = 0;
    this.passiveSpecial = 0;
    this.state = 'idle';
    this.frame = 0;
    this.attackTimer = 0;
    this.hitTimer = 0;
    this.blockTimer = 0;
    this.comboCount = 0;
    this.isBlocking = false;
    this.isCrouching = false;
    this.onGround = true;
    this.hitCooldown = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.freezeTimer = 0;
    this.stunnedTimer = 0;
    this.noobCaptureTimer = 0;
    this.noobCaptureX = x;
    this.noobCaptureY = GROUND;
    this.victoryTimer = 0;
    this.defeatTimer = 0;
    this.victoryPose = 0;
    this.teleportPhase = '';
    this.teleportPhaseTimer = 0;
    this.teleportOffset = 0;
    this.teleportPunchDone = false;
    this.harpoonLockTimer = 0;
    this.borkoImpactX = x;
    this.borkoImpactY = GROUND - 24;
    this.borkoLeapActive = false;
    this.borkoLeapStartX = x;
    this.snekSlitherActive = false;
    this.doggbalDashActive = false;
    this.doggbalDashStartX = x;
    this.doggbalDashTargetX = x;
    this.doggbalDashHit = false;
    this.doggbalSpinTimer = 0;
    this.doggbalSpinDuration = 0;
    this.doggomeleonFormIndex = -1;
    this.specialFormSource = '';
  }

  getHurtbox() {
    if (this.teleportPhase && this.teleportPhase !== 'strike') {
      return { x: -9999, y: -9999, w: 0, h: 0 };
    }

    const crouch = this.isCrouching ? 20 : 0;
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height + crouch,
      w: this.width,
      h: this.height - crouch
    };
  }

  getAttackBox() {
    if (this.freezeTimer > 0) return null;
    if (this.stunnedTimer > 0) return null;
    if (this.attackTimer <= 0) return null;
    const comboStage = Math.floor(this.comboCount / 12);
    if (this.lastAttackType === 'punch') {
      return {
        x: this.x + this.facing * COMBAT.punch.hitbox.xOffset,
        y: this.y - COMBAT.punch.hitbox.yOffset + (this.isCrouching ? COMBAT.punch.hitbox.crouchOffset : 0),
        w: COMBAT.punch.hitbox.width,
        h: COMBAT.punch.hitbox.height,
        dmg: COMBAT.punch.damage + comboStage * COMBAT.punch.comboDamageStep,
        kb: COMBAT.punch.knockback + this.comboCount * COMBAT.punch.comboKnockbackStep
      };
    } else if (this.lastAttackType === 'kick') {
      return {
        x: this.x + this.facing * COMBAT.kick.hitbox.xOffset,
        y: this.y - COMBAT.kick.hitbox.yOffset + (this.isCrouching ? COMBAT.kick.hitbox.crouchOffset : 0),
        w: COMBAT.kick.hitbox.width,
        h: COMBAT.kick.hitbox.height,
        dmg: COMBAT.kick.damage + comboStage * COMBAT.kick.comboDamageStep,
        kb: COMBAT.kick.knockback
      };
    }
    return null;
  }

  attack(type) {
    if (this.freezeTimer > 0) return;
    if (this.stunnedTimer > 0) return;
    if (this.harpoonLockTimer > 0) return;
    if (this.attackTimer > 0 || this.hitTimer > 0) return;
    if (type === 'special' && this.special < SPECIAL_METER_MAX) return;

    this.lastAttackType = type;
    this.specialFormSource = type === 'special' ? getActiveSpecialName(this) : '';
    if (type === 'punch') {
      this.state = 'attack_punch';
      this.attackTimer = COMBAT.punch.duration;
    } else if (type === 'kick') {
      this.state = 'attack_kick';
      this.attackTimer = COMBAT.kick.duration;
    } else if (type === 'special') {
      this.state = 'special';
      if (this.name === 'SEKDOG') {
        this.attackTimer = COMBAT.special.sekdog.descendFrames + COMBAT.special.sekdog.riseFrames + COMBAT.special.sekdog.punchFrames;
        this.teleportPhase = 'descend';
        this.teleportPhaseTimer = COMBAT.special.sekdog.descendFrames;
        this.teleportOffset = 0;
        this.teleportPunchDone = false;
      } else if (this.name === 'BORKO') {
        const opponent = this === p1 ? p2 : p1;
        const special = COMBAT.special.borko;
        this.attackTimer = special.airFrames;
        this.borkoImpactX = Math.max(
          FIGHTER_LAYOUT.boundaryPadding,
          Math.min(W - FIGHTER_LAYOUT.boundaryPadding, opponent.x)
        );
        this.borkoImpactY = GROUND - 24;
        this.borkoLeapActive = true;
        this.borkoLeapStartX = this.x;
        this.facing = this.borkoImpactX >= this.x ? 1 : -1;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'NOOB SAIDOG' || this.specialFormSource === 'REPDOG') {
        this.attackTimer = COMBAT.special.noobSaidog.sequenceFrames;
        if (this.onGround) this.vx = 0;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'SNEK') {
        this.attackTimer = COMBAT.special.snek.maxFrames;
        this.snekSlitherActive = true;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'KA-9') {
        this.attackTimer = COMBAT.special.duration;
        if (this.onGround) this.vx = 0;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'DOGGABAL') {
        const opponent = this === p1 ? p2 : p1;
        const special = COMBAT.special.doggbal;
        this.attackTimer = special.dashFrames;
        this.doggbalDashActive = true;
        this.doggbalDashStartX = this.x;
        this.doggbalDashTargetX = opponent.x + this.facing * 120;
        this.doggbalDashTargetX = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.doggbalDashTargetX));
        this.doggbalDashHit = false;
        this.vx = 0;
        this.vy = 0;
        this.onGround = true;
        this.isBlocking = false;
        this.isCrouching = false;
      } else {
        this.attackTimer = COMBAT.special.duration;
      }
      this.special = 0;
      spawnProjectile(this);
      if (this.name === 'CYDOG') {
        this.attackTimer = 0;
        this.state = 'idle';
      }
    }

    playAttackSound(type);
    this.frame = 0;
  }

  takeHit(dmg, kb, attackerFacing) {
    if (this.hitCooldown > 0) return null;
    const incomingDamage = dmg;
    const blocked = this.isBlocking;
    if (blocked) {
      dmg = Math.floor(dmg * COMBAT.block.damageMultiplier);
      kb *= COMBAT.block.knockbackMultiplier;
      this.blockTimer = COMBAT.block.stunFrames;
      addParticle(this.x + attackerFacing * 30, this.y - 50, 'block');
      playImpactSound('block');
    } else {
      this.hitTimer = COMBAT.hit.stunFrames;
      this.state = 'hit';
      this.frame = 0;
      this.shakeX = attackerFacing * 8;
      addParticle(this.x + attackerFacing * 30, this.y - 50, 'hit');
      playImpactSound('hit');
    }

    this.health = Math.max(0, this.health - dmg);
    this.vx = attackerFacing * kb;
    if (!this.onGround) this.vy = PHYSICS.airborneHitLift;
    this.hitCooldown = COMBAT.hit.cooldownFrames;
    const blockedMeterGain = this.name === 'BORKO'
      ? incomingDamage * COMBAT.meter.onBlockBorkoMultiplier
      : (this.name === 'SHAO CATNIP'
        ? incomingDamage * COMBAT.meter.onBlockBonusMultiplier
        : incomingDamage * COMBAT.meter.onBlockMultiplier);
    this.special = Math.min(SPECIAL_METER_MAX, this.special + (blocked ? blockedMeterGain : dmg * COMBAT.meter.onHurtMultiplier));
    return blocked;
  }

  applyStunnedStatus(durationMs) {
    this.stunnedTimer = durationMs;
    this.attackTimer = 0;
    this.lastAttackType = '';
    this.blockTimer = 0;
    this.isBlocking = false;
    this.hitTimer = 0;
    this.state = 'stunned';
    this.vx = 0;
    this.vy = 0;
  }

  applyNoobSnakeCapture(durationMs) {
    this.noobCaptureTimer = durationMs;
    this.noobCaptureX = this.x;
    this.noobCaptureY = this.y;
    this.freezeTimer = 0;
    this.stunnedTimer = 0;
    this.attackTimer = 0;
    this.lastAttackType = '';
    this.specialFormSource = '';
    this.blockTimer = 0;
    this.isBlocking = false;
    this.isCrouching = false;
    this.state = 'idle';
    this.vx = 0;
    this.vy = 0;
  }

  landBorkoShockwave(opponent) {
    const special = COMBAT.special.borko;
    const shockX = this.borkoImpactX;
    const shockY = this.borkoImpactY;
    const opponentCenterY = opponent.y - opponent.height / 2;
    const caught = Math.hypot(opponent.x - shockX, opponentCenterY - shockY) <= special.shockRadius;

    particles.push({
      x: shockX,
      y: shockY,
      vx: 0,
      vy: 0,
      life: 24,
      maxLife: 24,
      radius: special.shockRadius,
      type: 'borkoShockwave'
    });
    addParticle(shockX, shockY, 'hit');
    addParticle(shockX - 28, shockY + 8, 'hit');
    addParticle(shockX + 28, shockY + 8, 'hit');
    game.screenShake = COMBAT.effects.projectileShake;
    game.hitStop = COMBAT.effects.projectileHitStop;

    if (caught) {
      const blocked = opponent.takeHit(special.shockDamage, special.shockKnockback, this.facing);
      if (opponent.health > 0 && !blocked) opponent.applyStunnedStatus(special.shockStunMs);
      addParticle(opponent.x, opponent.y - 50, 'stunned');
      if (opponent.health <= 0) playImpactSound('ko');
    } else {
      playImpactSound('hit');
    }

    this.borkoLeapActive = false;
    this.attackTimer = 0;
    this.state = 'idle';
    this.vx = 0;
    this.vy = 0;
  }

  updateBorkoSpecial(opponent) {
    const special = COMBAT.special.borko;
    this.state = 'special';
    this.isBlocking = false;
    this.isCrouching = false;
    this.onGround = false;
    this.vx = 0;
    this.vy = 0;

    const elapsedFrames = special.airFrames - this.attackTimer + 1;
    const progress = Math.min(1, elapsedFrames / special.airFrames);
    this.x = this.borkoLeapStartX + (this.borkoImpactX - this.borkoLeapStartX) * progress;
    this.y = GROUND - Math.sin(progress * Math.PI) * special.jumpHeight;
    this.attackTimer = Math.max(0, this.attackTimer - 1);

    if (progress >= 1 || this.attackTimer <= 0) {
      this.x = this.borkoImpactX;
      this.y = GROUND;
      this.onGround = true;
      this.landBorkoShockwave(opponent);
    }
  }

  updateSnekSlither(opponent) {
    const special = COMBAT.special.snek;
    const dx = opponent.x - this.x;
    const direction = dx === 0 ? this.facing : Math.sign(dx);

    this.state = 'special';
    this.facing = direction;
    this.vx = 0;
    this.vy = 0;
    this.y = GROUND;
    this.onGround = true;
    this.isBlocking = false;
    this.isCrouching = false;
    this.attackTimer = Math.max(0, this.attackTimer - 1);

    if (Math.abs(dx) > special.coilRange && this.attackTimer > 0) {
      this.x += direction * Math.min(special.slitherSpeed, Math.abs(dx) - special.coilRange);
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x));
      return;
    }

    if (opponent.health > 0) {
      if (opponent.isBlocking) {
        addParticle(opponent.x, opponent.y - 50, 'block');
        playImpactSound('block');
        opponent.blockTimer = COMBAT.block.stunFrames;
      } else {
        opponent.applyStunnedStatus(special.coilStunMs);
        spawnSnekCoil(this, opponent);
        addParticle(opponent.x, opponent.y - 50, 'stunned');
      }
      game.screenShake = COMBAT.effects.harpoonShake;
      game.hitStop = COMBAT.effects.harpoonHitStop;
      if (opponent.health <= 0) playImpactSound('ko');
      else if (!opponent.isBlocking) playImpactSound('hit');
    }

    this.snekSlitherActive = false;
    this.attackTimer = 0;
    this.specialFormSource = '';
    this.state = 'idle';
  }

  updateDoggbalDash(opponent) {
    const special = COMBAT.special.doggbal;
    this.state = 'special';
    this.isBlocking = false;
    this.isCrouching = false;
    this.onGround = true;
    this.vy = 0;

    const elapsedFrames = special.dashFrames - this.attackTimer + 1;
    const progress = Math.min(1, elapsedFrames / special.dashFrames);
    this.x = this.doggbalDashStartX + (this.doggbalDashTargetX - this.doggbalDashStartX) * progress;
    this.attackTimer = Math.max(0, this.attackTimer - 1);

    if (!this.doggbalDashHit && progress > 0.2 && progress < 0.8) {
      const hb = opponent.getHurtbox();
      const myCenter = this.x;
      if (myCenter > hb.x && myCenter < hb.x + hb.w) {
        this.doggbalDashHit = true;
        const blocked = opponent.takeHit(special.damage, special.knockback, this.facing);
        if (opponent.health > 0 && !blocked) {
          opponent.applyStunnedStatus(special.stunMs);
          opponent.doggbalSpinTimer = special.stunMs;
          opponent.doggbalSpinDuration = special.stunMs;
        }
        addParticle(opponent.x, opponent.y - 50, 'stunned');
        game.screenShake = COMBAT.effects.harpoonShake;
        game.hitStop = COMBAT.effects.harpoonHitStop;
        if (opponent.health <= 0) playImpactSound('ko');
        else playImpactSound('hit');
      }
    }

    if (progress >= 1 || this.attackTimer <= 0) {
      this.x = this.doggbalDashTargetX;
      this.doggbalDashActive = false;
      this.attackTimer = 0;
      this.specialFormSource = '';
      this.state = 'idle';
      this.vx = 0;
    }
  }

  landSekdogTeleportPunch(opponent) {
    if (opponent.health <= 0) return;

    const punch = COMBAT.special.sekdog;
    opponent.takeHit(punch.punchDamage, punch.punchKnockback, this.facing);
    addParticle(opponent.x - this.facing * 18, opponent.y - 50, 'hit');

    if (opponent.health <= 0) {
      game.screenShake = COMBAT.effects.koShake;
      addParticle(opponent.x, opponent.y - 50, 'ko');
      playImpactSound('ko');
    } else {
      game.screenShake = COMBAT.effects.hitShake;
    }

    game.hitStop = COMBAT.effects.meleeHitStop;
  }

  updateSekdogTeleport(opponent) {
    const special = COMBAT.special.sekdog;

    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.isBlocking = false;
    this.isCrouching = false;
    this.attackTimer = Math.max(0, this.attackTimer - 1);

    if (this.teleportPhase === 'descend') {
      this.state = 'special';
      this.teleportOffset += (H + FIGHTER_LAYOUT.spriteSize) / special.descendFrames;
      this.teleportPhaseTimer--;

      if (this.teleportPhaseTimer <= 0) {
        this.teleportPhase = 'reappear';
        this.teleportPhaseTimer = special.riseFrames;
        this.teleportOffset = H;
        this.facing = opponent.facing;
        this.x = Math.max(
          FIGHTER_LAYOUT.boundaryPadding,
          Math.min(W - FIGHTER_LAYOUT.boundaryPadding, opponent.x - opponent.facing * special.behindOffset)
        );
        this.frame = 0;
      }
      return;
    }

    if (this.teleportPhase === 'reappear') {
      this.state = 'special';
      this.teleportOffset = Math.max(0, this.teleportOffset - H / special.riseFrames);
      this.teleportPhaseTimer--;

      if (this.teleportPhaseTimer <= 0) {
        this.teleportPhase = 'strike';
        this.teleportPhaseTimer = special.punchFrames;
        this.teleportOffset = 0;
        this.teleportPunchDone = false;
        this.state = 'attack_punch';
        this.frame = 0;
      }
      return;
    }

    if (this.teleportPhase === 'strike') {
      this.state = 'attack_punch';
      if (!this.teleportPunchDone && this.teleportPhaseTimer <= special.punchFrames - 2) {
        this.teleportPunchDone = true;
        this.landSekdogTeleportPunch(opponent);
      }

      this.teleportPhaseTimer--;
      if (this.teleportPhaseTimer <= 0) {
        this.teleportPhase = '';
        this.teleportOffset = 0;
        this.teleportPunchDone = false;
        this.attackTimer = 0;
        this.state = 'idle';
      }
    }
  }

  updateRaydogPassive(opponent) {
    if (this.name !== 'RAYDOG' || this.health <= 0) return;

    this.passiveSpecial = Math.min(SPECIAL_METER_MAX, this.passiveSpecial + this.passiveSpecialGain);
    if (this.passiveSpecial < SPECIAL_METER_MAX || opponent.health <= 0) return;

    this.passiveSpecial = 0;
    spawnRaydogPassiveArcLightning(this, opponent);
  }

  updateDoggomeleonMorph() {
    if (this.name !== 'DOGGOMELEON' || this.health <= 0) return;

    this.passiveSpecial = Math.min(SPECIAL_METER_MAX, this.passiveSpecial + this.passiveSpecialGain);
    if (this.passiveSpecial < SPECIAL_METER_MAX) return;

    this.passiveSpecial = 0;
    this.doggomeleonFormIndex = (this.doggomeleonFormIndex + 1 + DOGGOMELEON_FORMS.length) % DOGGOMELEON_FORMS.length;
  }

  update(keys, opponent) {
    this.frame++;
    this.updateDoggomeleonMorph();
    this.updateRaydogPassive(opponent);
    if (this.hitCooldown > 0) this.hitCooldown--;
    this.shakeX *= 0.8;
    this.shakeY *= 0.8;

    // Frozen state
    if (this.freezeTimer > 0) {
      this.freezeTimer -= PHYSICS.freezeTickMs; // ~60fps
      this.state = 'frozen';
      this.vx = 0;
      this.vy = 0;
      if (this.freezeTimer <= 0) {
        this.freezeTimer = 0;
        this.attackTimer = 0;
        this.lastAttackType = '';
        this.blockTimer = 0;
        this.isBlocking = false;
        this.state = 'idle';
      }
      return;
    }

    if (this.stunnedTimer > 0) {
      this.stunnedTimer -= PHYSICS.freezeTickMs;
      if (this.doggbalSpinTimer > 0) this.doggbalSpinTimer -= PHYSICS.freezeTickMs;
      this.state = 'stunned';
      this.vx = 0;
      this.vy = 0;
      this.isBlocking = false;
      this.isCrouching = false;
      if (this.stunnedTimer <= 0) {
        this.stunnedTimer = 0;
        this.doggbalSpinTimer = 0;
        this.doggbalSpinDuration = 0;
        this.state = 'idle';
      }
      return;
    }

    if (this.doggbalSpinTimer > 0) this.doggbalSpinTimer = 0;
    if (this.doggbalSpinDuration > 0) this.doggbalSpinDuration = 0;

    const noobSnakeCaptured = this.noobCaptureTimer > 0;
    if (noobSnakeCaptured) {
      this.noobCaptureTimer -= PHYSICS.freezeTickMs;
      if (this.noobCaptureTimer <= 0) this.noobCaptureTimer = 0;
      this.x = this.noobCaptureX;
      this.y = this.noobCaptureY;
      this.vx = 0;
      this.vy = 0;
      this.isCrouching = false;
    }

    if (this.harpoonLockTimer > 0) {
      this.harpoonLockTimer--;
      this.state = 'special';
      this.vx = 0;
      this.vy = 0;
      this.isBlocking = false;
      this.isCrouching = false;
      return;
    }

    if (this.teleportPhase) {
      this.updateSekdogTeleport(opponent);
      return;
    }

    if (this.borkoLeapActive) {
      this.updateBorkoSpecial(opponent);
      return;
    }

    if (this.snekSlitherActive) {
      this.updateSnekSlither(opponent);
      return;
    }

    if (this.doggbalDashActive) {
      this.updateDoggbalDash(opponent);
      return;
    }

    // Face opponent
    if (this.attackTimer <= 0 && this.hitTimer <= 0) {
      this.facing = opponent.x > this.x ? 1 : -1;
    }

    // Timers
    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.state = 'idle';
        this.specialFormSource = '';
      }
    }
    if (this.hitTimer > 0) {
      this.hitTimer--;
      if (this.hitTimer <= 0) this.state = 'idle';
    }
    if (this.blockTimer > 0) this.blockTimer--;

// Combo decay
if (Date.now() - this.lastHitTime > COMBAT.comboResetMs) this.comboCount = 0;

if (this.specialFormSource === 'TREMODOG' && this.attackTimer > 0 && this.lastAttackType === 'special') {
  this.vx = 0;
  this.vy = 0;
  this.isCrouching = true;
  this.isBlocking = false;
  this.state = 'special';
  return;
}

    const speed = this.speed;
    if (this.attackTimer <= 0 && this.hitTimer <= 0) {
      if (noobSnakeCaptured) {
        this.isBlocking = keys.block;
        this.state = this.isBlocking ? 'block' : 'idle';
      } else {
        if (keys.left && !keys.right) {
          this.vx = -speed;
          this.state = this.isCrouching ? 'crouch' : 'walk';
        } else if (keys.right && !keys.left) {
          this.vx = speed;
          this.state = this.isCrouching ? 'crouch' : 'walk';
        } else {
          this.vx *= 0.7;
          if (Math.abs(this.vx) < 0.5) this.vx = 0;
          this.state = this.isCrouching ? 'crouch' : 'idle';
        }

        // Jump
        if (keys.up && this.onGround) {
          this.vy = PHYSICS.jumpVelocity;
          this.onGround = false;
        }

        // Crouch
        this.isCrouching = keys.down;
        if (this.isCrouching) this.state = 'crouch';

        // Block
        this.isBlocking = keys.block;
        if (this.isBlocking) this.state = 'block';
      }
    }

    // Physics
    if (noobSnakeCaptured) {
      this.x = this.noobCaptureX;
      this.y = this.noobCaptureY;
      this.vx = 0;
      this.vy = 0;
    } else {
      this.vy += PHYSICS.gravity;
      this.x += this.vx;
      this.y += this.vy;

      if (this.y >= GROUND) {
        this.y = GROUND;
        this.vy = 0;
        this.onGround = true;
      }

      // Boundaries
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x));
    }

    // Passive special gain
    this.special = Math.min(SPECIAL_METER_MAX, this.special + this.specialGain);
  }

  draw() {
    // Determine state to render
    let state;
    if (this.victoryTimer > 0) {
      state = 'victory';
    } else if (this.defeatTimer > 0) {
      state = 'defeat';
    } else if (this.hitTimer > 0) {
      state = 'hit';
    } else if (this.harpoonLockTimer > 0) {
      state = 'special';
    } else if (this.stunnedTimer > 0) {
      state = 'stunned';
    } else if (this.attackTimer > 0) {
      state = this.state;
    } else {
      state = this.state;
    }

    const isFrozen = this.freezeTimer > 0;
    const displayChar = getDisplayedCharacterData(this);
    let sprite = createDogSprite(
      displayChar.color1, displayChar.color2, displayChar.eyeColor,
      displayChar.name, this.facing, this.frame, state, 1, isFrozen
    );

    if (this.health <= 0 && this.defeatTimer > 0) {
      sprite = tintSprite(sprite, 'rgba(0,0,0,0.3)');
    }

    const spriteSize = FIGHTER_LAYOUT.spriteSize * this.scale;
    const sx = this.x - spriteSize / 2 + this.shakeX;
    let sy = this.y - spriteSize + this.shakeY;

    if (this.teleportPhase) {
      sy += this.teleportOffset;
      ctx.globalAlpha = this.teleportPhase === 'descend'
        ? Math.max(0, 1 - this.teleportOffset / (H + spriteSize))
        : (this.teleportPhase === 'reappear'
          ? Math.min(1, 1 - this.teleportOffset / H)
          : 1);
    }

    if (this.doggbalSpinTimer > 0 && this.doggbalSpinDuration > 0) {
      const spinProgress = 1 - (this.doggbalSpinTimer / this.doggbalSpinDuration);
      const easedSpin = 1 - Math.pow(1 - spinProgress, 3);
      const spinAngle = easedSpin * Math.PI * 8;
      ctx.save();
      ctx.translate(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY);
      ctx.rotate(spinAngle);
      ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, sx, sy, spriteSize, spriteSize);
    }
    ctx.globalAlpha = 1;
  }
}


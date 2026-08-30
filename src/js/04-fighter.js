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
    this.maxComboTimer = 0;
    this.maxComboPushback = false;
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
    this.raydogDashActive = false;
    this.raydogDashPhase = '';
    this.raydogDashTimer = 0;
    this.raydogDashHit = false;
    this.makdogSpecialActive = false;
    this.makdogSpecialPhase = '';
    this.makdogSpecialTimer = 0;
    this.makdogLiftY = 0;
    this.makdogImmobilized = false;
    this.makdogImmobilizedTimer = 0;
    this.makdogGlowTimer = 0;
    this.makdogSpinDir = 0;
    this.makdogPendingStun = 0;
    this.sekdogChestOpen = false;
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
    this.maxComboTimer = 0;
    this.maxComboPushback = false;
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
    this.raydogDashActive = false;
    this.raydogDashPhase = '';
    this.raydogDashTimer = 0;
    this.raydogDashHit = false;
    this.makdogSpecialActive = false;
    this.makdogSpecialPhase = '';
    this.makdogSpecialTimer = 0;
    this.makdogLiftY = 0;
    this.makdogImmobilized = false;
    this.makdogImmobilizedTimer = 0;
    this.makdogGlowTimer = 0;
    this.makdogSpinDir = 0;
    this.makdogPendingStun = 0;
    this.sekdogChestOpen = false;
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
    if (this.makdogImmobilized) return;
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
        this.sekdogChestOpen = true;
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
      } else if (this.specialFormSource === 'KANOINE') {
        const special = COMBAT.special.kanoine;
        this.attackTimer = special.dashFrames;
        this.raydogDashActive = true;
        this.raydogDashPhase = 'fly';
        this.raydogDashTimer = special.dashFrames;
        this.raydogDashHit = false;
        this.vx = 0;
        this.vy = 0;
        this.onGround = true;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'RAYDOG') {
        const special = COMBAT.special.raydog;
        this.attackTimer = special.dashFrames;
        this.raydogDashActive = true;
        this.raydogDashPhase = 'fly';
        this.raydogDashTimer = special.dashFrames;
        this.raydogDashHit = false;
        this.vx = 0;
        this.vy = 0;
        this.onGround = true;
        this.isBlocking = false;
        this.isCrouching = false;
      } else if (this.specialFormSource === 'MAKDOG') {
        const special = COMBAT.special.makdog;
        const opponent = this === p1 ? p2 : p1;
        this.attackTimer = special.eyeGlowFrames + special.liftFrames + special.holdFrames + special.slamFrames;
        this.makdogSpecialActive = true;
        this.makdogSpecialPhase = 'eyeGlow';
        this.makdogSpecialTimer = special.eyeGlowFrames;
        this.makdogLiftY = 0;
        projectiles.length = 0;
        opponent.makdogImmobilized = true;
        opponent.makdogImmobilizedTimer = (special.eyeGlowFrames + special.liftFrames + special.holdFrames + special.slamFrames) * 16.67;
        opponent.makdogGlowTimer = special.eyeGlowFrames + special.liftFrames + special.holdFrames;
        opponent.vx = 0;
        opponent.vy = 0;
        opponent.attackTimer = 0;
        opponent.lastAttackType = '';
        opponent.blockTimer = 0;
        opponent.isBlocking = false;
        opponent.isCrouching = false;
        this.vx = 0;
        this.vy = 0;
        this.onGround = true;
        this.isBlocking = false;
        this.isCrouching = false;
      } else {
        this.attackTimer = COMBAT.special.duration;
      }
      this.special = 0;
      if (this.specialFormSource !== 'KANOINE') spawnProjectile(this);
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
    if (!this.maxComboPushback) this.vx = attackerFacing * kb;
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
      if (opponent.health > 0 && !blocked) {
        opponent.applyStunnedStatus(special.shockStunMs);
        addParticle(opponent.x, opponent.y - 50, 'stunned');
      }
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
    const special = this.specialFormSource === 'KANOINE' ? COMBAT.special.kanoine : COMBAT.special.doggbal;
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
          addParticle(opponent.x, opponent.y - 50, 'stunned');
        }
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

  updateRaydogSupermanDash(opponent) {
    const special = this.specialFormSource === 'KANOINE' ? COMBAT.special.kanoine : COMBAT.special.raydog;
    this.state = 'special';
    this.isBlocking = false;
    this.isCrouching = false;

    if (this.raydogDashPhase === 'fly' || this.raydogDashPhase === 'push') {
      this.onGround = true;
      this.vy = 0;
    }

    if (this.raydogDashPhase === 'fly') {
      this.vx = this.facing * special.dashSpeed;
      this.x += this.vx;
      this.raydogDashTimer--;

      if (!this.raydogDashHit) {
        const hb = opponent.getHurtbox();
        const myFront = this.x + this.facing * (FIGHTER_LAYOUT.width / 2 + 10);
        if (myFront > hb.x && myFront < hb.x + hb.w) {
          this.raydogDashHit = true;
          const blocked = opponent.isBlocking;

          if (blocked) {
            if (this.specialFormSource === 'KANOINE') {
              // KANOINE: no damage, no knockback, no stun when blocked
              addParticle(opponent.x + this.facing * 30, opponent.y - 50, 'block');
              playImpactSound('block');
            } else {
              opponent.takeHit(special.damage, special.knockback, this.facing);
              game.screenShake = COMBAT.effects.hitShake;
              game.hitStop = COMBAT.effects.meleeHitStop;
              playImpactSound('block');
            }
            this.raydogDashPhase = 'hurl';
            this.raydogDashTimer = special.hurlBackFrames;
            this.facing = -this.facing;
            this.vx = this.facing * special.hurlBackSpeed;
            this.vy = -18;
            this.onGround = false;
          } else {
            opponent.takeHit(special.damage, special.knockback, this.facing);
            if (this.specialFormSource !== 'KANOINE') {
              opponent.applyStunnedStatus(special.stunMs);
              opponent.vx = 0;
              addParticle(opponent.x, opponent.y - 50, 'stunned');
            }
            this.raydogDashPhase = 'push';
            this.raydogDashTimer = special.pushFrames;
            game.hitStop = COMBAT.effects.freezeHitStop;
            playImpactSound('hit');
          }
        }
      }

      if (this.raydogDashTimer <= 0 && this.raydogDashPhase === 'fly') {
        this.raydogDashActive = false;
        this.attackTimer = 0;
        this.specialFormSource = '';
        this.state = 'idle';
        this.vx = 0;
      }
    } else if (this.raydogDashPhase === 'push') {
      this.vx = this.facing * special.dashSpeed;
      opponent.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, opponent.x + this.vx));
      opponent.vx = 0;
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x + this.vx));

      const atEdge = (this.facing === 1 && this.x >= W - FIGHTER_LAYOUT.boundaryPadding - 10) ||
                     (this.facing === -1 && this.x <= FIGHTER_LAYOUT.boundaryPadding + 10);
      this.raydogDashTimer--;

      if (atEdge || this.raydogDashTimer <= 0) {
        game.screenShake = COMBAT.effects.koShake;
        addParticle(opponent.x, opponent.y - 50, 'hit');
        this.raydogDashPhase = 'hurl';
        this.raydogDashTimer = special.hurlBackFrames;
        this.facing = -this.facing;
        this.vx = this.facing * special.hurlBackSpeed;
        this.vy = -18;
        this.onGround = false;
      }
    } else if (this.raydogDashPhase === 'hurl') {
      this.x += this.vx;
      this.vy += PHYSICS.gravity;
      this.y += this.vy;
      this.raydogDashTimer--;
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x));

      if (this.y >= GROUND) {
        this.y = GROUND;
        this.vy = 0;
        this.onGround = true;
        this.raydogDashActive = false;
        this.attackTimer = 0;
        this.specialFormSource = '';
        this.state = 'idle';
        this.vx = 0;
      } else if (this.raydogDashTimer <= 0) {
        this.raydogDashActive = false;
        this.attackTimer = 0;
        this.specialFormSource = '';
        this.state = 'idle';
        this.vx = 0;
        this.vy = 0;
      }

      if (this.raydogDashTimer <= 0) {
        this.raydogDashActive = false;
        this.attackTimer = 0;
        this.specialFormSource = '';
        this.state = 'idle';
        this.vx = 0;
      }
    }
  }

  updateMakdogSpecial(opponent) {
    const special = COMBAT.special.makdog;
    this.state = 'special';
    this.isBlocking = false;
    this.isCrouching = false;
    this.vx = 0;

    this.vy += PHYSICS.gravity;
    this.y += this.vy;
    if (this.y >= GROUND) {
      this.y = GROUND;
      this.vy = 0;
      this.onGround = true;
    }

    this.makdogSpecialTimer--;
    this.attackTimer--;

    if (this.makdogSpecialPhase === 'eyeGlow') {
      if (this.makdogSpecialTimer <= 0) {
        this.makdogSpecialPhase = 'lift';
        this.makdogSpecialTimer = special.liftFrames;
      }
    } else if (this.makdogSpecialPhase === 'lift') {
      const liftProgress = 1 - (this.makdogSpecialTimer / special.liftFrames);
      opponent.y = GROUND - liftProgress * special.liftHeight;
      opponent.vx = 0;
      opponent.vy = 0;
      if (this.makdogSpecialTimer <= 0) {
        this.makdogSpecialPhase = 'hold';
        this.makdogSpecialTimer = special.holdFrames;
      }
    } else if (this.makdogSpecialPhase === 'hold') {
      opponent.y = GROUND - special.liftHeight;
      opponent.vx = 0;
      opponent.vy = 0;
      if (this.makdogSpecialTimer <= 0) {
        this.makdogSpecialPhase = 'slam';
        this.makdogSpecialTimer = special.slamFrames;
      }
    } else if (this.makdogSpecialPhase === 'slam') {
      const slamProgress = 1 - (this.makdogSpecialTimer / special.slamFrames);
      opponent.y = (GROUND - special.liftHeight) + slamProgress * special.liftHeight;
      opponent.vx = 0;
      opponent.vy = 0;
      if (this.makdogSpecialTimer <= 0) {
        opponent.y = GROUND;
        const blocked = opponent.takeHit(special.damage, special.knockback, this.facing);
        opponent.makdogImmobilized = false;
        opponent.makdogImmobilizedTimer = 0;
        opponent.makdogGlowTimer = 0;

        const makdogOnLeft = this.x < opponent.x;
        const rollDir = makdogOnLeft ? -1 : 1;
        const spinDir = makdogOnLeft ? 1 : -1;

        opponent.vx = rollDir * special.rollBackSpeed;
        opponent.doggbalSpinTimer = special.rollBackFrames * 16;
        opponent.doggbalSpinDuration = special.rollBackFrames * 16;
        opponent.makdogSpinDir = spinDir;

        if (!blocked) {
          opponent.makdogPendingStun = special.stunMs;
        }

        game.screenShake = COMBAT.effects.koShake;
        game.hitStop = COMBAT.effects.freezeHitStop;
        addParticle(opponent.x, opponent.y - 50, blocked ? 'block' : 'ko');
        playImpactSound(blocked ? 'block' : 'ko');
        this.makdogSpecialActive = false;
        this.attackTimer = 0;
        this.specialFormSource = '';
        this.state = 'idle';
      }
    }

    if (this.attackTimer <= 0 && this.makdogSpecialActive) {
      this.makdogSpecialActive = false;
      opponent.makdogImmobilized = false;
      opponent.makdogImmobilizedTimer = 0;
      opponent.makdogGlowTimer = 0;
      this.specialFormSource = '';
      this.state = 'idle';
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
        this.sekdogChestOpen = false;
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

  updateSubdogPassive(opponent) {
    if (this.name !== 'SUBDOG' || this.health <= 0) return;

    this.passiveSpecial = Math.min(SPECIAL_METER_MAX, this.passiveSpecial + this.passiveSpecialGain);
    if (this.passiveSpecial < SPECIAL_METER_MAX || opponent.health <= 0) return;

    this.passiveSpecial = 0;
    spawnSubdogIceClone(this);
  }

  update(keys, opponent) {
    this.frame++;
    this.updateDoggomeleonMorph();
    this.updateRaydogPassive(opponent);
    this.updateSubdogPassive(opponent);
    if (this.hitCooldown > 0) this.hitCooldown--;
    this.shakeX *= 0.8;
    this.shakeY *= 0.8;

    // Frozen state
    if (this.freezeTimer > 0) {
      this.freezeTimer -= PHYSICS.freezeTickMs;
      this.state = 'frozen';
      if (!this.maxComboPushback) this.vx *= 0.9;
      if (this.maxComboPushback && Math.abs(this.vx) < 2) this.maxComboPushback = false;
      this.vy += PHYSICS.gravity;
      this.y += this.vy;
      if (this.y >= GROUND) {
        this.y = GROUND;
        this.vy = 0;
        this.onGround = true;
      }
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x));
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
      const wasSpinning = this.doggbalSpinTimer > 0;
      if (this.doggbalSpinTimer > 0) this.doggbalSpinTimer -= PHYSICS.freezeTickMs;
      this.state = 'stunned';
      if (this.makdogSpinDir && this.doggbalSpinTimer > 0) {
        const dir = -this.makdogSpinDir;
        this.vx = dir * COMBAT.special.makdog.rollBackSpeed;
      } else if (!this.maxComboPushback) {
        this.vx *= 0.9;
      }
      if (this.maxComboPushback && Math.abs(this.vx) < 2 && !(wasSpinning && this.doggbalSpinTimer > 0)) this.maxComboPushback = false;
      this.isBlocking = false;
      this.isCrouching = false;
      this.vy += PHYSICS.gravity;
      this.y += this.vy;
      if (this.y >= GROUND) {
        this.y = GROUND;
        this.vy = 0;
        this.onGround = true;
      }
      this.x = Math.max(FIGHTER_LAYOUT.boundaryPadding, Math.min(W - FIGHTER_LAYOUT.boundaryPadding, this.x));
      if (this.stunnedTimer <= 0) {
        this.stunnedTimer = 0;
        this.doggbalSpinTimer = 0;
        this.doggbalSpinDuration = 0;
        this.makdogSpinDir = 0;
        this.maxComboPushback = false;
        this.state = 'idle';
      }
      return;
    }

    if (this.doggbalSpinTimer > 0 && !this.makdogSpinDir) this.doggbalSpinTimer = 0;
    if (this.doggbalSpinDuration > 0 && !this.makdogSpinDir) this.doggbalSpinDuration = 0;

    if (this.makdogSpinDir && this.doggbalSpinTimer > 0) {
      this.doggbalSpinTimer -= PHYSICS.freezeTickMs;
      const dir = -this.makdogSpinDir;
      this.vx = dir * COMBAT.special.makdog.rollBackSpeed;
      this.isBlocking = false;
      this.isCrouching = false;
      if (this.doggbalSpinTimer <= 0) {
        this.doggbalSpinTimer = 0;
        this.doggbalSpinDuration = 0;
        this.makdogSpinDir = 0;
        this.vx = 0;
        if (this.makdogPendingStun > 0) {
          this.applyStunnedStatus(this.makdogPendingStun);
          this.makdogPendingStun = 0;
        }
      }
    }

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

    if (this.makdogImmobilized) {
      this.makdogImmobilizedTimer -= PHYSICS.freezeTickMs;
      if (this.makdogGlowTimer > 0) this.makdogGlowTimer--;
      this.vx = 0;
      this.vy = 0;
      this.isCrouching = false;
      if (this.makdogImmobilizedTimer <= 0) {
        this.makdogImmobilized = false;
        this.makdogImmobilizedTimer = 0;
        this.makdogGlowTimer = 0;
      }
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

    if (this.makdogSpecialActive) {
      this.updateMakdogSpecial(opponent);
      return;
    }

    if (this.raydogDashActive) {
      this.updateRaydogSupermanDash(opponent);
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
    if (this.makdogSpinDir && this.doggbalSpinTimer > 0) {
      this.state = 'hit';
      this.isBlocking = false;
      this.isCrouching = false;
    } else if (this.attackTimer <= 0 && this.hitTimer <= 0) {
      if (noobSnakeCaptured) {
        this.isBlocking = keys.block;
        this.state = this.isBlocking ? 'block' : 'idle';
      } else if (this.makdogImmobilized) {
        this.isBlocking = keys.block;
        this.state = this.isBlocking ? 'block' : 'idle';
        this.vx = 0;
        this.vy = 0;
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
    } else if (this.makdogImmobilized) {
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
    let eyeColor = displayChar.eyeColor;
    if (this.makdogSpecialActive && this.makdogSpecialPhase === 'eyeGlow') {
      eyeColor = Math.floor(this.frame / 4) % 2 === 0 ? '#00ff00' : '#88ff88';
    }
    let sprite = createDogSprite(
      displayChar.color1, displayChar.color2, eyeColor,
      displayChar.name, this.facing, this.frame, state, 1, isFrozen, this
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
      const spinAngle = easedSpin * Math.PI * 8 * (this.makdogSpinDir || 1);
      ctx.save();
      ctx.translate(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY);
      ctx.rotate(spinAngle);
      ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
      ctx.restore();
    } else if (this.raydogDashActive && this.raydogDashPhase === 'fly') {
      if (this.specialFormSource === 'KANOINE') {
        // KANOINE spins while flying (counter-clockwise when facing left)
        const spinDir = this.facing === -1 ? -1 : 1;
        const spinAngle = (this.frame * 0.3 * spinDir) % (Math.PI * 2);
        ctx.save();
        ctx.translate(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY);
        ctx.rotate(spinAngle);
        ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
        ctx.restore();
      } else {
        const tiltAngle = this.facing * -Math.PI / 4;
        ctx.save();
        ctx.translate(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY);
        ctx.rotate(tiltAngle);
        ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
        ctx.restore();
      }
    } else if (this.raydogDashActive && this.raydogDashPhase === 'hurl') {
      const hurlFrames = this.specialFormSource === 'KANOINE' ? COMBAT.special.kanoine.hurlBackFrames : COMBAT.special.raydog.hurlBackFrames;
      const hurlProgress = 1 - (this.raydogDashTimer / hurlFrames);
      // KANOINE: facing is reversed during hurl, so use -facing for spin direction
      const spinDir = this.specialFormSource === 'KANOINE' ? -this.facing : 1;
      const spinAngle = hurlProgress * Math.PI * 6 * spinDir;
      ctx.save();
      ctx.translate(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY);
      ctx.rotate(spinAngle);
      ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, sx, sy, spriteSize, spriteSize);
    }

    if (this.makdogGlowTimer > 0 && Math.floor(this.frame / 4) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(this.x + this.shakeX, this.y - spriteSize / 2 + this.shakeY, spriteSize / 2.5, spriteSize / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }
}


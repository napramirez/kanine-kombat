// Sprite cache
const spriteCache = {};

const DOGGOMELEON_FORMS = ['SKORPDOG', 'SUBDOG', 'TREMODOG', 'RAYNDOG'];
const DOGGOMELEON_MORPH_FRAMES = 480;

function isMaskedFighter(name) {
return name === 'SKORPDOG' || name === 'SUBDOG' || name === 'SEKDOG' || name === 'CYDOG' || name === 'TREMODOG' || name === 'RAYNDOG' || name === 'DOGGOMELEON' || name === 'NOOB SAIDOG' || name === 'REPDOG' || name === 'MAKDOG';
}

function getRainbowColor(frame, phase = 0, alpha = 1) {
  const r = Math.floor(128 + 127 * Math.sin(frame * 0.14 + phase));
  const g = Math.floor(128 + 127 * Math.sin(frame * 0.14 + phase + 2.09));
  const b = Math.floor(128 + 127 * Math.sin(frame * 0.14 + phase + 4.18));
  return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getMaskedTrimColors(name, frozen) {
  if (frozen) {
    return {
      limbColor: '#5f9ea0',
      pawColor: '#4682b4',
      hoodieColor: '#2f4f4f',
      hoodieEdge: '#1a3a3a',
      centerStripe: '#2f4f4f',
      innerEar: '#333'
    };
  }

  if (name === 'SEKDOG') {
    return {
      limbColor: '#5c6670',
      pawColor: '#8c98a4',
      hoodieColor: '#4f5963',
      hoodieEdge: '#aab4bf',
      centerStripe: '#737f8b',
      innerEar: '#919ca8'
    };
  }

  if (name === 'CYDOG') {
    return {
      limbColor: '#5c6670',
      pawColor: '#8c98a4',
      hoodieColor: '#4f5963',
      hoodieEdge: '#aab4bf',
      centerStripe: '#737f8b',
      innerEar: '#919ca8'
    };
  }

  if (name === 'RAYNDOG') {
    return {
      limbColor: '#111',
      pawColor: '#222',
      hoodieColor: '#111',
      hoodieEdge: '#222',
      centerStripe: '#111',
      innerEar: '#333'
    };
  }

  if (name === 'REPDOG') {
    return {
      limbColor: '#111',
      pawColor: '#222',
      hoodieColor: '#111',
      hoodieEdge: '#222',
      centerStripe: '#111',
      innerEar: '#5a3a3a'
    };
  }

  if (name === 'MAKDOG') {
    return {
      limbColor: '#111',
      pawColor: '#222',
      hoodieColor: '#111',
      hoodieEdge: '#222',
      centerStripe: '#111',
      innerEar: '#333'
    };
  }

  return {
    limbColor: isMaskedFighter(name) ? '#111' : null,
    pawColor: isMaskedFighter(name) ? '#222' : null,
    hoodieColor: '#111',
    hoodieEdge: '#222',
    centerStripe: '#111',
    innerEar: '#333'
  };
}

function getMaskedGearColors(name, frozen, frame = 0) {
  if (frozen) {
    return {
      vestColor: '#5f9ea0',
      vestHighlight: '#4682b4',
      maskColor: '#5f9ea0',
      maskEdge: '#4169e1'
    };
  }

  if (name === 'SKORPDOG') {
    return {
      vestColor: '#f1c40f',
      vestHighlight: '#ffd700',
      maskColor: '#f1c40f',
      maskEdge: '#c8a800'
    };
  }

  if (name === 'SEKDOG') {
    return {
      vestColor: '#e74c3c',
      vestHighlight: '#ff8a80',
      maskColor: '#e74c3c',
      maskEdge: '#b33939'
    };
  }

  if (name === 'CYDOG') {
    return {
      vestColor: '#d8b43f',
      vestHighlight: '#f0d46e',
      maskColor: '#d8b43f',
      maskEdge: '#a2832d'
    };
  }

  if (name === 'DOGGOMELEON') {
    return {
      vestColor: getRainbowColor(frame, 0),
      vestHighlight: getRainbowColor(frame, 1.2),
      maskColor: getRainbowColor(frame, 2.4),
      maskEdge: getRainbowColor(frame, 3.6)
    };
  }

  if (name === 'NOOB SAIDOG') {
    return {
      vestColor: '#000',
      vestHighlight: '#111',
      maskColor: '#000',
      maskEdge: '#222'
    };
  }

  if (name === 'REPDOG') {
    return {
      vestColor: '#4CAF50',
      vestHighlight: '#66BB6A',
      maskColor: '#4CAF50',
      maskEdge: '#388E3C'
    };
  }

  if (name === 'RAYNDOG') {
    return {
      vestColor: '#8e44ad',
      vestHighlight: '#c77dff',
      maskColor: '#8e44ad',
      maskEdge: '#6c3483'
    };
  }

  if (name === 'TREMODOG') {
    return {
      vestColor: '#8b5a2b',
      vestHighlight: '#b07d45',
      maskColor: '#8b5a2b',
      maskEdge: '#5c3b1e'
    };
  }

  if (name === 'MAKDOG') {
    return {
      vestColor: '#e74c3c',
      vestHighlight: '#ff6b6b',
      maskColor: '#e74c3c',
      maskEdge: '#c0392b'
    };
  }

  return {
    vestColor: '#87ceeb',
    vestHighlight: '#b0e0e6',
    maskColor: '#87ceeb',
    maskEdge: '#5f9ea0'
  };
}

function isDoggoCage(name) {
  return name === 'DOGGO CAGE';
}

function isRaydog(name) {
  return name === 'RAYDOG';
}

function drawNoobSaidogEyes(x, headY, frame) {
  const flash = (Math.sin(frame * 0.32) + 1) * 0.5;
  const secondary = Math.floor(6 + flash * 28);
  x.save();
  x.shadowColor = '#ff1744';
  x.shadowBlur = 7 + flash * 7;
  x.fillStyle = `rgb(255, ${secondary}, ${secondary})`;
  x.beginPath();
  x.ellipse(68, headY - 6, 7, 8, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(80, headY - 6, 6, 7, 0, 0, Math.PI * 2);
  x.fill();
  x.restore();
}

function drawRepdogEyes(x, headY, frame) {
  const flash = (Math.sin(frame * 0.32) + 1) * 0.5;
  const green = Math.floor(180 + flash * 75);
  x.save();
  x.shadowColor = '#ffeb3b';
  x.shadowBlur = 7 + flash * 7;
  x.fillStyle = `rgb(255, ${green}, 20)`;
  x.beginPath();
  x.ellipse(68, headY - 6, 7, 8, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(80, headY - 6, 6, 7, 0, 0, Math.PI * 2);
  x.fill();
  x.restore();
}

function drawDogbalBodyStripes(x, bodyY) {
  x.save();
  x.beginPath();
  x.ellipse(58, bodyY + 14, 30, 22, 0, 0, Math.PI * 2);
  x.clip();

  // Thick vertical olive green stripe down center of body
  x.fillStyle = '#556B2F';
  x.fillRect(46, bodyY - 8, 24, 50);

  // Thick horizontal brown stripe across body
  x.fillStyle = '#8B4513';
  x.fillRect(28, bodyY + 4, 60, 18);

  x.restore();
}

function drawDogbalOxygenMask(x, headY) {
  // Strap lines going around the head
  x.strokeStyle = '#555';
  x.lineWidth = 2.5;
  x.beginPath();
  x.moveTo(72, headY + 2);
  x.quadraticCurveTo(56, headY - 10, 50, headY);
  x.stroke();
  x.beginPath();
  x.moveTo(72, headY + 10);
  x.quadraticCurveTo(56, headY + 18, 50, headY + 10);
  x.stroke();

  // Mask body - gray rounded shape over snout
  x.fillStyle = '#666';
  x.beginPath();
  x.ellipse(84, headY + 6, 16, 12, 0, 0, Math.PI * 2);
  x.fill();

  // Mask edge highlight
  x.strokeStyle = '#777';
  x.lineWidth = 1.5;
  x.beginPath();
  x.ellipse(84, headY + 6, 16, 12, 0, -0.5, 1.5);
  x.stroke();

  // Small circular filter element on the side
  x.fillStyle = '#888';
  x.beginPath();
  x.arc(96, headY + 8, 5, 0, Math.PI * 2);
  x.fill();
  x.strokeStyle = '#777';
  x.lineWidth = 1;
  x.stroke();

  // Filter center detail
  x.fillStyle = '#999';
  x.beginPath();
  x.arc(96, headY + 8, 2, 0, Math.PI * 2);
  x.fill();
}


function getDoggomeleonMorphName(fighter) {
  if (!fighter || fighter.name !== 'DOGGOMELEON' || fighter.doggomeleonFormIndex < 0) return '';
  return DOGGOMELEON_FORMS[fighter.doggomeleonFormIndex % DOGGOMELEON_FORMS.length];
}

function getActiveSpecialName(fighter) {
  if (!fighter) return '';
  if (fighter.name !== 'DOGGOMELEON') return fighter.name;
  if (fighter.attackTimer > 0 && fighter.lastAttackType === 'special' && fighter.specialFormSource) return fighter.specialFormSource;
  return DOGGOMELEON_FORMS[Math.max(0, fighter.doggomeleonFormIndex || 0)];
}

function getCharacterByName(name) {
  return CHARACTERS.find(char => char.name === name) || null;
}

function hasPassiveSpecialAbility(entity) {
  return !!(entity && entity.passiveSpecialGain > 0);
}

function getDisplayedCharacterData(fighter) {
  if (!fighter) {
    return { name: '', color1: '#fff', color2: '#111', eyeColor: '#fff' };
  }

  if (fighter.name !== 'DOGGOMELEON') {
    return {
      name: fighter.name,
      color1: fighter.color1,
      color2: fighter.color2,
      eyeColor: fighter.eyeColor
    };
  }

  const morphName = getDoggomeleonMorphName(fighter);
  const specialDisplayName = fighter.attackTimer > 0 && fighter.lastAttackType === 'special' ? fighter.specialFormSource : '';
  if (!morphName && !specialDisplayName) {
    return {
      name: fighter.name,
      color1: fighter.color1,
      color2: fighter.color2,
      eyeColor: fighter.eyeColor
    };
  }

  const char = getCharacterByName(specialDisplayName || morphName);
  return char ? {
    name: char.name,
    color1: char.color1,
    color2: char.color2,
    eyeColor: char.eyeColor
  } : {
    name: fighter.name,
    color1: fighter.color1,
    color2: fighter.color2,
    eyeColor: fighter.eyeColor
  };
}

function getPointBlankTargetX(attacker, defender) {
  const spacing = attacker.width / 2 + defender.width / 2 - COMBAT.special.skorpdog.pointBlankGap;
  return attacker.x + attacker.facing * spacing;
}

function releaseCapturedOpponent(opponent) {
  if (opponent.health <= 0) return;
  opponent.stunnedTimer = 0;
  opponent.vx = 0;
  opponent.vy = 0;
  opponent.state = 'idle';
}

function drawDoggoCageSunglasses(x, headY, frozen) {
  const frameColor = frozen ? '#5f9ea0' : '#111';
  const lensColor = frozen ? 'rgba(200, 240, 255, 0.55)' : 'rgba(20, 20, 24, 0.92)';
  const shineColor = frozen ? 'rgba(255,255,255,0.25)' : 'rgba(120, 200, 255, 0.22)';

  x.fillStyle = lensColor;
  x.fillRect(60, headY - 11, 13, 9);
  x.fillRect(74, headY - 11, 12, 9);

  x.fillStyle = frameColor;
  x.fillRect(58, headY - 12, 30, 2);
  x.fillRect(72, headY - 9, 4, 2);
  x.fillRect(58, headY - 10, 2, 8);
  x.fillRect(86, headY - 10, 2, 8);
  x.fillRect(56, headY - 8, 3, 2);
  x.fillRect(87, headY - 8, 3, 2);

  x.fillStyle = shineColor;
  x.fillRect(61, headY - 10, 4, 2);
  x.fillRect(75, headY - 10, 4, 2);
}

function drawRaydogGear(x, bodyY, headY, frozen) {
  const apronColor = frozen ? '#87ceeb' : '#3498db';
  const hatColor = frozen ? '#5f9ea0' : '#8b5a2b';
  const hatShadow = frozen ? '#4682b4' : '#5c3b1e';
  const outlineColor = frozen ? '#4169e1' : '#111';

  x.fillStyle = apronColor;
  x.beginPath();
  x.moveTo(49, bodyY + 2);
  x.lineTo(71, bodyY + 2);
  x.lineTo(76, bodyY + 35);
  x.lineTo(44, bodyY + 35);
  x.closePath();
  x.fill();
  x.strokeStyle = outlineColor;
  x.lineWidth = 2;
  x.stroke();
  x.beginPath();
  x.moveTo(49, bodyY + 6);
  x.quadraticCurveTo(58, bodyY - 6, 67, bodyY + 6);
  x.stroke();

  x.fillStyle = hatColor;
  x.beginPath();
  x.moveTo(40, headY - 13);
  x.lineTo(70, headY - 42);
  x.lineTo(100, headY - 13);
  x.closePath();
  x.fill();
  x.stroke();

  x.fillStyle = hatShadow;
  x.fillRect(44, headY - 13, 52, 5);
  x.strokeRect(44, headY - 13, 52, 5);
}

function drawRaydogSparks(x, bodyY, headY, frame, frozen) {
  const pulse = frozen ? 0 : Math.sin(frame * 0.28) * 4;
  const sparkColor = frozen ? '#e0ffff' : '#f5f3ff';
  const glowColor = frozen ? '#87ceeb' : '#74b9ff';
  const sparkleColor = frozen ? 'rgba(224,255,255,0.8)' : 'rgba(255,255,255,0.9)';
  const sparks = [
    { x: 38, y: bodyY + 2, dx: -10, dy: -8 },
    { x: 92, y: bodyY + 8, dx: 12, dy: -10 },
    { x: 72, y: headY - 28, dx: 8, dy: -12 }
  ];

  x.strokeStyle = sparkColor;
  x.lineWidth = 2;
  x.lineCap = 'round';

  sparks.forEach((spark, i) => {
    const flicker = frozen ? 0 : Math.sin(frame * 0.35 + i * 1.7) * 3;
    const sx = spark.x + (i === 1 ? pulse : -pulse * 0.5);
    const sy = spark.y + flicker;

    x.beginPath();
    x.moveTo(sx, sy);
    x.lineTo(sx + spark.dx * 0.45, sy + spark.dy * 0.35);
    x.lineTo(sx + spark.dx * 0.2, sy + spark.dy * 0.65);
    x.lineTo(sx + spark.dx, sy + spark.dy);
    x.stroke();

    x.strokeStyle = glowColor;
    x.beginPath();
    x.moveTo(sx + 1, sy + 1);
    x.lineTo(sx + spark.dx * 0.3, sy + spark.dy * 0.15);
    x.lineTo(sx + spark.dx * 0.55, sy + spark.dy * 0.45);
    x.lineTo(sx + spark.dx * 0.75, sy + spark.dy * 0.7);
    x.stroke();

    const twinkleX = sx + spark.dx * 0.9;
    const twinkleY = sy + spark.dy * 0.85;
    const twinkle = frozen ? 1.5 : 1.5 + Math.sin(frame * 0.45 + i) * 0.8;

    x.strokeStyle = sparkleColor;
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(twinkleX - twinkle, twinkleY);
    x.lineTo(twinkleX + twinkle, twinkleY);
    x.moveTo(twinkleX, twinkleY - twinkle);
    x.lineTo(twinkleX, twinkleY + twinkle);
    x.stroke();

    x.fillStyle = sparkleColor;
    x.beginPath();
    x.arc(sx + spark.dx * 0.45, sy + spark.dy * 0.35, frozen ? 1.2 : 1.2 + Math.sin(frame * 0.35 + i) * 0.35, 0, Math.PI * 2);
    x.fill();

    x.strokeStyle = sparkColor;
    x.lineWidth = 2;
  });
}

function drawSnekSprite(x, frame, state, frozen) {
  const bodyColor = frozen ? '#5f9ea0' : '#030303';
  const scaleColor = frozen ? '#b0e0e6' : '#171717';
  const eyeColor = frozen ? '#fff' : '#ff1744';
  const isBite = state === 'attack_punch';
  const isTailWhip = state === 'attack_kick';
  const isCoil = state === 'block';
  const biteLunge = isBite ? Math.min(frame * 4, 18) : 0;
  const coilTuck = isCoil ? 18 : 0;
  const slitherLength = state === 'special' ? 76 : isCoil ? 40 : 62;
  const wave = frozen ? 0 : Math.sin(frame * 0.32) * (isCoil ? 12 : 7);
  const headX = 20 + slitherLength + biteLunge;
  const bodySpan = headX - 28;
  const newBodySpan = Math.round(bodySpan * 2);
  const bodyStartX = (headX - 14) - newBodySpan;
  const bodyOffset = bodyStartX - 14;
  const tailEdge = bodyStartX - 14;
  const headEdge = headX + 44;
  const totalWidth = headEdge - tailEdge;
  const maxWidth = 118;
  const fitScale = Math.min(1, maxWidth / totalWidth);
  const offsetX = (120 - totalWidth * fitScale) / 2 - tailEdge * fitScale;

  x.save();
  x.translate(offsetX, 108 * (1 - fitScale));
  x.scale(fitScale, fitScale);

  x.fillStyle = 'rgba(0,0,0,0.3)';
  x.beginPath();
  x.ellipse(60, 108, 42, 7, 0, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = bodyColor;
  x.beginPath();
  x.moveTo(bodyStartX, 96);
  x.lineTo(bodyStartX + 12, 96);
  x.lineTo(bodyStartX + 6, 78);
  x.closePath();
  x.fill();

  x.strokeStyle = bodyColor;
  x.lineWidth = 20;
  x.lineCap = 'round';
  x.beginPath();
  if (isCoil) {
    x.moveTo(bodyStartX + 20, 92);
    x.bezierCurveTo(bodyStartX + 50, 60 - wave, headX - 30, 100 + wave, headX - 14, 76 + coilTuck);
    x.stroke();
    x.beginPath();
    x.moveTo(bodyStartX + 10, 86);
    x.bezierCurveTo(bodyStartX + 35, 105, bodyStartX + 55, 68, bodyStartX + 70, 90);
    x.stroke();
  } else {
    x.moveTo(bodyStartX, 88);
    x.bezierCurveTo(35 + bodyOffset, 76 + wave, 48 + bodyOffset, 102 - wave, headX - 14, 76);
    x.stroke();
  }

  x.strokeStyle = scaleColor;
  x.lineWidth = 4;
  x.beginPath();
  if (isCoil) {
    x.moveTo(bodyStartX + 22, 90);
    x.bezierCurveTo(bodyStartX + 50, 62 - wave, headX - 32, 98 + wave, headX - 16, 74 + coilTuck);
    x.stroke();
  } else {
    x.moveTo(bodyStartX + 2, 86);
    x.bezierCurveTo(35 + bodyOffset, 78 + wave, 50 + bodyOffset, 98 - wave, headX - 16, 76);
    x.stroke();
  }

  if (isTailWhip) {
    const whipAngle = Math.min(frame * 0.25, 1.2);
    const whipTipX = bodyStartX + 40 + Math.sin(whipAngle) * 50;
    const whipTipY = 68 - Math.sin(whipAngle) * 30;
    x.strokeStyle = bodyColor;
    x.lineWidth = 10;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(bodyStartX + 6, 84);
    x.quadraticCurveTo(bodyStartX + 20, 70, whipTipX, whipTipY);
    x.stroke();
    x.fillStyle = bodyColor;
    x.beginPath();
    x.moveTo(whipTipX, whipTipY);
    x.lineTo(whipTipX + 8, whipTipY - 6);
    x.lineTo(whipTipX + 6, whipTipY + 6);
    x.closePath();
    x.fill();
    if (frame > 2 && frame < 10) {
      x.strokeStyle = '#f1c40f';
      x.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const a = -0.5 + i * 0.5;
        x.beginPath();
        x.moveTo(whipTipX + 10, whipTipY + Math.sin(a) * 8);
        x.lineTo(whipTipX + 18, whipTipY + Math.sin(a) * 14);
        x.stroke();
      }
    }
  }

  x.fillStyle = bodyColor;
  x.beginPath();
  const hd = isCoil ? 12 : 0;
  x.moveTo(headX - 22, 76 + hd);
  x.lineTo(headX - 10, 56 + hd);
  x.lineTo(headX + 16, 54 + hd);
  x.lineTo(headX + 28, 68 + hd);
  x.lineTo(headX + 15, 84 + hd);
  x.lineTo(headX - 12, 86 + hd);
  x.closePath();
  x.fill();

  x.fillStyle = scaleColor;
  x.beginPath();
  x.moveTo(headX + 4, 62 + hd);
  x.lineTo(headX + 23, 67 + hd);
  x.lineTo(headX + 15, 76 + hd);
  x.lineTo(headX - 1, 74 + hd);
  x.closePath();
  x.fill();

  if (isBite) {
    const jawOpen = Math.min(frame * 2, 12);
    x.fillStyle = '#c0392b';
    x.beginPath();
    x.moveTo(headX + 22, 74 + hd);
    x.lineTo(headX + 30, 74 + hd + jawOpen);
    x.lineTo(headX + 18, 80 + hd + jawOpen);
    x.lineTo(headX + 10, 78 + hd);
    x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.beginPath();
    x.moveTo(headX + 26, 74 + hd);
    x.lineTo(headX + 28, 70 + hd);
    x.lineTo(headX + 24, 72 + hd);
    x.closePath();
    x.fill();
    x.beginPath();
    x.moveTo(headX + 22, 74 + hd + jawOpen);
    x.lineTo(headX + 24, 78 + hd + jawOpen);
    x.lineTo(headX + 20, 76 + hd + jawOpen);
    x.closePath();
    x.fill();
  }

  x.shadowColor = eyeColor;
  x.shadowBlur = frozen ? 0 : 9;
  x.fillStyle = eyeColor;
  x.beginPath();
  x.ellipse(headX + 2, 62 + hd, 4, 3, 0, 0, Math.PI * 2);
  x.ellipse(headX + 12, 62 + hd, 4, 3, 0, 0, Math.PI * 2);
  x.fill();
  x.shadowBlur = 0;

  const tongueWave = Math.sin(frame * 0.45) * 3;
  x.strokeStyle = eyeColor;
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(headX + 25, 71 + hd);
  x.lineTo(headX + 35, 72 + hd + tongueWave);
  x.lineTo(headX + 41, 68 + hd + tongueWave);
  x.moveTo(headX + 35, 72 + hd + tongueWave);
  x.lineTo(headX + 41, 76 + hd + tongueWave);
  x.stroke();

  x.restore();
}

function createDogSprite(color1, color2, eyeColor, name, facing, frame, state, scale = 1, frozen = false) {
  const frozenSuffix = frozen ? '-frozen' : '';
  const key = `${name}-${facing}-${frame}-${state}${frozenSuffix}`;
  if (spriteCache[key]) return spriteCache[key];

  const c = document.createElement('canvas');
  c.width = FIGHTER_LAYOUT.spriteSize; c.height = FIGHTER_LAYOUT.spriteSize;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;

  const flip = facing === -1;

  x.save();
  if (flip) { x.translate(FIGHTER_LAYOUT.spriteSize, 0); x.scale(-1, 1); }

  if (name === 'SNEK') {
    drawSnekSprite(x, frame, state, frozen);
    x.restore();
    spriteCache[key] = c;
    return c;
  }

  // Frozen state: override colors and stop animations
  const frozenColor1 = frozen ? '#87ceeb' : color1;
  const frozenColor2 = frozen ? '#b0e0e6' : color2;
  const frozenEyeColor = frozen ? '#fff' : eyeColor;

  const bobY = (state === 'idle' && !frozen) ? Math.sin(frame * 0.15) * 2 : 0;

  // Shadow - skip for victory/defeat states (drawn in their blocks)
  if (state !== 'victory' && state !== 'defeat') {
    x.fillStyle = 'rgba(0,0,0,0.3)';
    x.beginPath();
    x.ellipse(60, 112, 28, 6, 0, 0, Math.PI * 2);
    x.fill();
  }

  // Legs (no walk animation when frozen) - skip for victory/defeat
  const legSpread = (state === 'walk' && !frozen) ? Math.sin(frame * 0.3) * 8 : 0;
const isSpecialCrouch = state === 'special' && name === 'TREMODOG';
  const crouchOffset = (state === 'crouch' || isSpecialCrouch) ? 12 : 0;

  const trimColors = getMaskedTrimColors(name, frozen);
  const limbColor = isMaskedFighter(name) ? trimColors.limbColor : color1;
  const pawColor = isMaskedFighter(name) ? trimColors.pawColor : color2;

  // Only draw normal legs if not in victory/defeat state
  if (state !== 'victory' && state !== 'defeat') {
    x.fillStyle = limbColor;
    // Back leg
    x.fillRect(42 - legSpread, 78 + crouchOffset, 10, 28 - crouchOffset);
    // Front leg
    x.fillRect(62 + legSpread, 78 + crouchOffset, 10, 28 - crouchOffset);

    // Paws
    x.fillStyle = pawColor;
    x.fillRect(40 - legSpread, 104 + crouchOffset, 14, 6);
    x.fillRect(60 + legSpread, 104 + crouchOffset, 14, 6);
  }

  // Skip normal body drawing for victory/defeat states
  const isSpecialState = (state === 'victory' || state === 'defeat');

  // Body and head positions (needed for all states)
  const bodyY = 52 + bobY + crouchOffset;
  const headY = bodyY - 8 + ((state === 'crouch' || isSpecialCrouch) ? 8 : 0);

  if (!isSpecialState) {
    // Body
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(58, bodyY + 14, 30, 22, 0, 0, Math.PI * 2);
    x.fill();

    // Belly
    x.fillStyle = frozenColor2;
    x.beginPath();
    x.ellipse(58, bodyY + 20, 20, 14, 0, 0, Math.PI * 2);
    x.fill();

    // DOGGABAL body stripes
    if (name === 'DOGGABAL') drawDogbalBodyStripes(x, bodyY);

    // Tail (no wag when frozen)
    const tailWag = frozen ? 0 : Math.sin(frame * 0.4) * 15;
    x.strokeStyle = frozenColor1;
    x.lineWidth = 6;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(30, bodyY + 5);
    x.quadraticCurveTo(15, bodyY - 10 + tailWag, 8, bodyY - 20 + tailWag);
    x.stroke();
  x.fillStyle = frozenColor1;
  x.beginPath();
  x.ellipse(70, headY, 22, 20, 0, 0, Math.PI * 2);
  x.fill();

  // Ears
  x.fillStyle = frozenColor1;
  // Left ear (floppy)
  x.beginPath();
  x.ellipse(56, headY - 18, 8, 14, -0.3, 0, Math.PI * 2);
  x.fill();
  // Right ear
  x.beginPath();
  x.ellipse(82, headY - 16, 7, 12, 0.3, 0, Math.PI * 2);
  x.fill();

  // Inner ear
  x.fillStyle = frozen ? '#add8e6' : '#ffb3b3';
  x.beginPath();
  x.ellipse(57, headY - 16, 4, 8, -0.3, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(81, headY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
  x.fill();

  // Snout
  x.fillStyle = frozenColor2;
  x.beginPath();
  x.ellipse(82, headY + 6, 14, 10, 0, 0, Math.PI * 2);
  x.fill();

  // Masked fighter gear: hoodie, mask, vest
  if (isMaskedFighter(name)) {
    const { vestColor, vestHighlight, maskColor, maskEdge } = getMaskedGearColors(name, frozen, frame);

    // Vest on body
    x.fillStyle = vestColor;
    x.beginPath();
    x.ellipse(58, bodyY + 14, 31, 23, 0, 0, Math.PI * 2);
    x.fill();
    // Thick black vertical line in middle of vest
    x.fillStyle = trimColors.centerStripe;
    x.fillRect(51, bodyY - 8, 14, 45);
    // Vest highlights
    x.fillStyle = vestHighlight;
    x.fillRect(48, bodyY + 5, 4, 4);
    x.fillRect(64, bodyY + 5, 4, 4);

    // Black hoodie on head
    x.fillStyle = trimColors.hoodieColor;
    x.beginPath();
    x.ellipse(70, headY, 23, 21, 0, 0, Math.PI * 2);
    x.fill();
    // Hoodie rim
    x.strokeStyle = trimColors.hoodieEdge;
    x.lineWidth = 2;
    x.beginPath();
    x.arc(70, headY, 23, -2.5, -0.6);
    x.stroke();

    // Snout mask
    x.fillStyle = maskColor;
    x.beginPath();
    x.ellipse(82, headY + 6, 15, 11, 0, 0, Math.PI * 2);
    x.fill();
    // Mask edge detail
    x.strokeStyle = maskEdge;
    x.lineWidth = 1;
    x.beginPath();
    x.ellipse(82, headY + 6, 15, 11, 0, -0.5, 1.5);
    x.stroke();

    // Ears on top of hoodie
    x.fillStyle = trimColors.hoodieColor;
    x.beginPath();
    x.ellipse(56, headY - 18, 8, 14, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(82, headY - 16, 7, 12, 0.3, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = trimColors.innerEar;
    x.beginPath();
    x.ellipse(57, headY - 16, 4, 8, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(81, headY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
    x.fill();
  }

  // Nose (skip for masked fighters, already drawn with mask)
  if (!isMaskedFighter(name)) {
    x.fillStyle = '#222';
    x.beginPath();
    x.ellipse(90, headY + 2, 5, 4, 0, 0, Math.PI * 2);
    x.fill();
    // Nose shine
    x.fillStyle = 'rgba(255,255,255,0.4)';
    x.beginPath();
    x.ellipse(91, headY, 2, 1.5, 0, 0, Math.PI * 2);
    x.fill();
  }

  // Mouth (skip for masked fighters)
  if (!isMaskedFighter(name)) {
    if (state === 'attack_kick' || state === 'attack_punch' || state === 'special') {
      x.fillStyle = '#333';
      x.beginPath();
      x.ellipse(86, headY + 12, 8, 6, 0, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#c0392b';
      x.beginPath();
      x.ellipse(86, headY + 11, 5, 3, 0, 0, Math.PI * 2);
      x.fill();
    } else {
      x.strokeStyle = '#333';
      x.lineWidth = 2;
      x.beginPath();
      x.arc(84, headY + 8, 6, 0, Math.PI);
      x.stroke();
    }

    // Tongue (when idle or happy)
    if (state === 'idle' && frame % 40 < 20) {
      x.fillStyle = '#ff6b8a';
      x.beginPath();
      x.ellipse(88, headY + 15 + Math.sin(frame * 0.2) * 2, 4, 6, 0.2, 0, Math.PI * 2);
      x.fill();
    }
  }

  // DOGGABAL oxygen mask
  if (name === 'DOGGABAL') drawDogbalOxygenMask(x, headY);

  // Eyes
  x.fillStyle = frozen ? '#e0ffff' : '#fff';
  x.beginPath();
  x.ellipse(68, headY - 6, 7, 8, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(80, headY - 6, 6, 7, 0, 0, Math.PI * 2);
  x.fill();

  // Pupils
  const pupilOffset = (state === 'hit' || frozen) ? -2 : 2;
  x.fillStyle = frozenEyeColor;
  x.beginPath();
  x.ellipse(70 + pupilOffset, headY - 5, 4, 5, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(82 + pupilOffset, headY - 5, 3.5, 4.5, 0, 0, Math.PI * 2);
  x.fill();

  // Pupil highlights
  x.fillStyle = '#fff';
  x.beginPath();
  x.arc(71 + pupilOffset, headY - 7, 1.5, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(83 + pupilOffset, headY - 7, 1.2, 0, Math.PI * 2);
  x.fill();

  if (name === 'NOOB SAIDOG') drawNoobSaidogEyes(x, headY, frame);
  if (name === 'REPDOG') drawRepdogEyes(x, headY, frame);

  if (isDoggoCage(name)) drawDoggoCageSunglasses(x, headY, frozen);
  if (isRaydog(name)) drawRaydogGear(x, bodyY, headY, frozen);
  if (isRaydog(name)) drawRaydogSparks(x, bodyY, headY, frame, frozen);

  // Red snake tongue on REPDOG's mask
  if (name === 'REPDOG') {
    const tongueWag = Math.sin(frame * 0.35) * 4;
    x.strokeStyle = '#ff1744';
    x.lineWidth = 2;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(92, headY + 10);
    x.lineTo(100, headY + 12 + tongueWag * 0.3);
    x.lineTo(107, headY + 8 + tongueWag);
    x.moveTo(100, headY + 12 + tongueWag * 0.3);
    x.lineTo(107, headY + 16 + tongueWag);
    x.stroke();
    x.lineCap = 'butt';
  }

  // Eyebrows
  if (state === 'hit' || state === 'attack_punch' || state === 'attack_kick' || state === 'special' || frozen) {
    x.strokeStyle = frozenColor1;
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(62, headY - 16);
    x.lineTo(74, headY - 14);
    x.stroke();
    x.beginPath();
    x.moveTo(75, headY - 14);
    x.lineTo(86, headY - 15);
    x.stroke();
  }

  // Frozen ice crystal effect
  if (frozen) {
    x.strokeStyle = '#87ceeb';
    x.lineWidth = 2;
    x.globalAlpha = 0.6 + Math.sin(frame * 0.2) * 0.2;
    
    // Ice crystals around body
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + frame * 0.02;
      const r = 50 + Math.sin(a * 3) * 5;
      const ix = 60 + Math.cos(a) * r;
      const iy = bodyY + 14 + Math.sin(a) * r * 0.6;
      
      // Crystal shape
      x.beginPath();
      x.moveTo(ix, iy - 8);
      x.lineTo(ix + 4, iy);
      x.lineTo(ix, iy + 8);
      x.lineTo(ix - 4, iy);
      x.closePath();
      x.stroke();
      
      // Crystal fill
      x.fillStyle = 'rgba(135, 206, 235, 0.3)';
      x.fill();
    }
    
    // Frost particles
    x.fillStyle = '#fff';
    for (let i = 0; i < 8; i++) {
      const px = 30 + (i * 15) % 60;
      const py = bodyY + Math.sin(frame * 0.1 + i) * 20;
      x.globalAlpha = 0.4 + Math.sin(frame * 0.15 + i * 0.5) * 0.3;
      x.beginPath();
      x.arc(px, py, 2, 0, Math.PI * 2);
      x.fill();
    }
    
    x.globalAlpha = 1;
  }

  // Attack effects
  if (state === 'attack_punch') {
    const punchFrame = frame % 6;
    // Front paw extended
    x.fillStyle = color1;
    x.save();
    x.translate(95, bodyY + 5);
    x.rotate(-0.3);
    x.fillRect(-5, -5, 22 + punchFrame * 3, 10);
    x.fillStyle = color2;
    x.fillRect(14 + punchFrame * 3, -7, 12, 14);
    // Paw pads
    x.fillStyle = '#ffb3b3';
    x.beginPath();
    x.arc(22 + punchFrame * 3, 0, 3, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // Impact lines
    x.strokeStyle = '#f1c40f';
    x.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const a = -0.5 + i * 0.5;
      x.beginPath();
      x.moveTo(108 + punchFrame * 3, bodyY + 5 + Math.sin(a) * 10);
      x.lineTo(115 + punchFrame * 3, bodyY + 5 + Math.sin(a) * 18);
      x.stroke();
    }
  }

  if (state === 'attack_kick') {
    const kickFrame = frame % 8;
    x.fillStyle = color1;
    x.save();
    x.translate(85, bodyY + 25);
    x.rotate(-0.8 + kickFrame * 0.15);
    x.fillRect(-5, -5, 30, 10);
    x.fillStyle = color2;
    x.fillRect(22, -7, 14, 14);
    x.fillStyle = '#ffb3b3';
    x.beginPath();
    x.arc(30, 0, 3, 0, Math.PI * 2);
    x.fill();
    x.restore();

    x.strokeStyle = '#e74c3c';
    x.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = -0.6 + i * 0.4;
      const kx = 105 + kickFrame * 2;
      x.beginPath();
      x.moveTo(kx, bodyY + 30 + Math.sin(a) * 8);
      x.lineTo(kx + 8, bodyY + 30 + Math.sin(a) * 16);
      x.stroke();
    }
  }

  if (state === 'special') {
    if (name === 'NOOB SAIDOG') {
      const flash = 0.55 + (Math.sin(frame * 0.45) + 1) * 0.2;
      x.strokeStyle = `rgba(255, 20, 45, ${flash})`;
      x.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        x.beginPath();
        x.moveTo(76 + i * 5, bodyY - 2 + i * 4);
        x.lineTo(90 + i * 7, bodyY - 12 + i * 3);
        x.stroke();
      }
      x.fillStyle = '#050505';
      x.beginPath();
      x.ellipse(92, bodyY, 14, 10, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = '#ff1744';
      x.stroke();
    } else if (name === 'REPDOG') {
      const flash = 0.55 + (Math.sin(frame * 0.45) + 1) * 0.2;
      x.strokeStyle = `rgba(76, 175, 80, ${flash})`;
      x.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        x.beginPath();
        x.moveTo(76 + i * 5, bodyY - 2 + i * 4);
        x.lineTo(90 + i * 7, bodyY - 12 + i * 3);
        x.stroke();
      }
      x.fillStyle = '#1b5e20';
      x.beginPath();
      x.ellipse(92, bodyY, 14, 10, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = '#4CAF50';
      x.stroke();
      x.shadowColor = '#ffeb3b';
      x.shadowBlur = 6;
      x.fillStyle = '#ffeb3b';
      x.beginPath();
      x.ellipse(88, bodyY - 3, 2, 1.5, 0, 0, Math.PI * 2);
      x.ellipse(96, bodyY - 3, 2, 1.5, 0, 0, Math.PI * 2);
      x.fill();
      x.shadowBlur = 0;
    } else if (name === 'SKORPDOG') {
      const harpoonX = 102;
      const harpoonY = bodyY + 1;
      x.strokeStyle = '#888';
      x.lineWidth = 3;
      x.setLineDash([4, 3]);
      x.beginPath();
      x.moveTo(82, bodyY + 3);
      x.lineTo(harpoonX, harpoonY);
      x.stroke();
      x.setLineDash([]);

      x.fillStyle = '#c0c0c0';
      x.beginPath();
      x.moveTo(harpoonX + 10, harpoonY);
      x.lineTo(harpoonX, harpoonY - 6);
      x.lineTo(harpoonX - 6, harpoonY);
      x.lineTo(harpoonX, harpoonY + 6);
      x.closePath();
      x.fill();

      x.strokeStyle = '#888';
      x.lineWidth = 2;
      x.stroke();

      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(harpoonX + 1, harpoonY, 2, 0, Math.PI * 2);
      x.fill();
    } else if (name === 'CYDOG') {
      const netFrame = frame % 10;
      const netX = 96 + netFrame * 2;
      const netY = bodyY + 2;
      x.strokeStyle = '#2ecc71';
      x.lineWidth = 2;
      x.beginPath();
      x.arc(netX, netY, 10, 0, Math.PI * 2);
      x.stroke();

      for (let i = 0; i < 4; i++) {
        x.save();
        x.translate(netX, netY);
        x.rotate((i / 4) * Math.PI / 2 + frame * 0.05);
        x.beginPath();
        x.moveTo(-8, 0);
        x.lineTo(8, 0);
        x.stroke();
        x.restore();
      }

      x.fillStyle = '#f1c40f';
      x.beginPath();
      x.arc(78, bodyY + 16, 7, 0, Math.PI * 2);
      x.fill();
    } else if (name === 'BORKO') {
      const leftArm = { x: 44, y: bodyY + 14, angle: -2.85, length: 26, rise: -4 };
      const rightArm = { x: 72, y: bodyY + 14, angle: -0.25, length: 26, rise: 4 };
      const leftPawX = leftArm.x + leftArm.length * Math.cos(leftArm.angle) - leftArm.rise * Math.sin(leftArm.angle);
      const leftPawY = leftArm.y + leftArm.length * Math.sin(leftArm.angle) + leftArm.rise * Math.cos(leftArm.angle);
      const rightPawX = rightArm.x + rightArm.length * Math.cos(rightArm.angle) - rightArm.rise * Math.sin(rightArm.angle);
      const rightPawY = rightArm.y + rightArm.length * Math.sin(rightArm.angle) + rightArm.rise * Math.cos(rightArm.angle);

      x.strokeStyle = frozenColor1;
      x.lineWidth = 8;
      x.lineCap = 'round';

      x.save();
      x.translate(leftArm.x, leftArm.y);
      x.rotate(leftArm.angle);
      x.beginPath();
      x.moveTo(0, 0);
      x.lineTo(leftArm.length, leftArm.rise);
      x.stroke();
      x.restore();

      x.save();
      x.translate(rightArm.x, rightArm.y);
      x.rotate(rightArm.angle);
      x.beginPath();
      x.moveTo(0, 0);
      x.lineTo(rightArm.length, rightArm.rise);
      x.stroke();
      x.restore();

      x.fillStyle = frozenColor2;
      x.beginPath();
      x.arc(leftPawX, leftPawY, 5, 0, Math.PI * 2);
      x.arc(rightPawX, rightPawY, 5, 0, Math.PI * 2);
      x.fill();

      x.strokeStyle = '#74b9ff';
      x.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const trailX = 44 + i * 16;
        x.beginPath();
        x.moveTo(trailX - 4, bodyY + 54);
        x.lineTo(trailX - 18, bodyY + 88);
        x.stroke();
      }
    } else if (name === 'RAYNDOG') {
      x.fillStyle = '#6c5ce7';
      x.beginPath();
      x.ellipse(86, bodyY - 10, 18, 10, 0, 0, Math.PI * 2);
      x.ellipse(76, bodyY - 12, 10, 8, 0, 0, Math.PI * 2);
      x.ellipse(98, bodyY - 12, 9, 7, 0, 0, Math.PI * 2);
      x.fill();

      x.strokeStyle = '#d6b3ff';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(84, bodyY - 2);
      x.lineTo(78, bodyY + 8);
      x.lineTo(86, bodyY + 8);
      x.lineTo(80, bodyY + 20);
      x.stroke();
    } else if (name === 'RAYDOG') {
      x.strokeStyle = '#f5f3ff';
      x.lineWidth = 3;
      x.beginPath();
      x.moveTo(84, bodyY - 8);
      x.lineTo(95, bodyY - 18);
      x.lineTo(90, bodyY - 4);
      x.lineTo(102, bodyY - 8);
      x.lineTo(92, bodyY + 12);
      x.stroke();

      x.strokeStyle = '#74b9ff';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(80, bodyY - 2);
      x.lineTo(92, bodyY + 4);
      x.lineTo(86, bodyY + 16);
      x.stroke();
    } else if (name === 'TREMODOG') {
      x.strokeStyle = '#ff7de9';
      x.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        const waveY = bodyY + 30 + i * 6;
        x.beginPath();
        x.moveTo(28, waveY);
        x.quadraticCurveTo(46, waveY - 4, 62, waveY);
        x.quadraticCurveTo(78, waveY + 4, 94, waveY);
        x.stroke();
      }
    } else {
      const sf = frame % 12;
      const ballX = 95 + sf * 4;
      const ballY = bodyY;
      const grad = x.createRadialGradient(ballX, ballY, 0, ballX, ballY, 20);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.3, isDoggoCage(name) ? '#f1c40f' : (name === 'SEKDOG' ? '#ff7675' : '#3498db'));
      grad.addColorStop(0.7, isDoggoCage(name) ? '#e74c3c' : (name === 'SEKDOG' ? '#c0392b' : '#9b59b6'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = grad;
      x.beginPath();
      x.arc(ballX, ballY, 18 - sf, 0, Math.PI * 2);
      x.fill();

      x.strokeStyle = '#f1c40f';
      x.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + frame * 0.2;
        x.beginPath();
        x.moveTo(ballX + Math.cos(a) * 10, ballY + Math.sin(a) * 10);
        x.lineTo(ballX + Math.cos(a) * (18 + sf), ballY + Math.sin(a) * (18 + sf));
        x.stroke();
      }
    }
  }

  // Hit effect
  if (state === 'hit') {
    x.strokeStyle = '#f1c40f';
    x.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + frame * 0.3;
      const r = 35 + (frame % 4) * 5;
      x.beginPath();
      x.moveTo(60 + Math.cos(a) * (r - 8), bodyY + Math.sin(a) * (r - 8));
      x.lineTo(60 + Math.cos(a) * r, bodyY + Math.sin(a) * r);
      x.stroke();
    }
  }

  if (state === 'stunned') {
    x.strokeStyle = '#f39c12';
    x.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + frame * 0.12;
      const sx = 60 + Math.cos(a) * 24;
      const sy = headY - 24 + Math.sin(a) * 8;
      drawStar(x, sx, sy, 4, '#f1c40f');
    }
  }

  // KO effect
  if (state === 'ko') {
    x.strokeStyle = '#888';
    x.lineWidth = 2;
    // Stars circling
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + frame * 0.1;
      const sx = 60 + Math.cos(a) * 30;
      const sy = headY - 30 + Math.sin(a) * 10;
      drawStar(x, sx, sy, 5, '#f1c40f');
    }
  }

  // Block stance
  if (state === 'block') {
    x.fillStyle = 'rgba(100,200,255,0.3)';
    x.beginPath();
    x.ellipse(65, bodyY, 35, 30, 0, 0, Math.PI * 2);
    x.fill();
    x.strokeStyle = 'rgba(100,200,255,0.6)';
    x.lineWidth = 2;
    x.stroke();
  }
  } // End of isSpecialState check

  // Victory pose effect
  if (state === 'victory') {
    // Jumping animation - entire character bounces
    const jumpOffset = Math.abs(Math.sin(frame * 0.15)) * 20;

    // Local body/head positions with jump offset
    const vicBodyY = bodyY - jumpOffset;
    const vicHeadY = headY - jumpOffset;

    // Shadow (stays on ground)
    x.fillStyle = 'rgba(0,0,0,0.3)';
    x.beginPath();
    x.ellipse(60, 112, 28, 6, 0, 0, Math.PI * 2);
    x.fill();

    // Legs spread during jump
    x.fillStyle = limbColor;
    x.fillRect(42 - jumpOffset * 0.3, 78, 10, 28);
    x.fillRect(62 + jumpOffset * 0.3, 78, 10, 28);
    // Paws
    x.fillStyle = pawColor;
    x.fillRect(40 - jumpOffset * 0.3, 104, 14, 6);
    x.fillRect(60 + jumpOffset * 0.3, 104, 14, 6);

    // Body
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(58, vicBodyY + 14, 30, 22, 0, 0, Math.PI * 2);
    x.fill();

    // Belly
    x.fillStyle = frozenColor2;
    x.beginPath();
    x.ellipse(58, vicBodyY + 20, 20, 14, 0, 0, Math.PI * 2);
    x.fill();

    // DOGGABAL body stripes (victory)
    if (name === 'DOGGABAL') drawDogbalBodyStripes(x, vicBodyY);

    // Tail
    const tailWag2 = Math.sin(frame * 0.4) * 15;
    x.strokeStyle = frozenColor1;
    x.lineWidth = 6;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(30, vicBodyY + 5);
    x.quadraticCurveTo(15, vicBodyY - 10 + tailWag2, 8, vicBodyY - 20 + tailWag2);
    x.stroke();

    // Head at new position
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(70, vicHeadY, 22, 20, 0, 0, Math.PI * 2);
    x.fill();

    // Ears
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(56, vicHeadY - 18, 8, 14, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(82, vicHeadY - 16, 7, 12, 0.3, 0, Math.PI * 2);
    x.fill();

    // Inner ear
    x.fillStyle = '#ffb3b3';
    x.beginPath();
    x.ellipse(57, vicHeadY - 16, 4, 8, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(81, vicHeadY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
    x.fill();

    // Snout
    x.fillStyle = frozenColor2;
    x.beginPath();
    x.ellipse(82, vicHeadY + 6, 14, 10, 0, 0, Math.PI * 2);
    x.fill();

    // Nose
    if (!isMaskedFighter(name)) {
      x.fillStyle = '#222';
      x.beginPath();
      x.ellipse(90, vicHeadY + 2, 5, 4, 0, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = 'rgba(255,255,255,0.4)';
      x.beginPath();
      x.ellipse(91, vicHeadY, 2, 1.5, 0, 0, Math.PI * 2);
      x.fill();
    }

    // Masked fighter gear
    if (isMaskedFighter(name)) {
      const { vestColor, vestHighlight, maskColor, maskEdge } = getMaskedGearColors(name, frozen, frame);

      // Vest on body
      x.fillStyle = vestColor;
      x.beginPath();
      x.ellipse(58, vicBodyY + 14, 31, 23, 0, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = trimColors.centerStripe;
      x.fillRect(51, vicBodyY - 8, 14, 45);
      x.fillStyle = vestHighlight;
      x.fillRect(48, vicBodyY + 5, 4, 4);
      x.fillRect(64, vicBodyY + 5, 4, 4);

      // Black hoodie on head
      x.fillStyle = trimColors.hoodieColor;
      x.beginPath();
      x.ellipse(70, vicHeadY, 23, 21, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = trimColors.hoodieEdge;
      x.lineWidth = 2;
      x.beginPath();
      x.arc(70, vicHeadY, 23, -2.5, -0.6);
      x.stroke();

      // Snout mask
      x.fillStyle = maskColor;
      x.beginPath();
      x.ellipse(82, vicHeadY + 6, 15, 11, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = maskEdge;
      x.lineWidth = 1;
      x.beginPath();
      x.ellipse(82, vicHeadY + 6, 15, 11, 0, -0.5, 1.5);
      x.stroke();

      // Ears on top of hoodie
      x.fillStyle = trimColors.hoodieColor;
      x.beginPath();
      x.ellipse(56, vicHeadY - 18, 8, 14, -0.3, 0, Math.PI * 2);
      x.fill();
      x.beginPath();
      x.ellipse(82, vicHeadY - 16, 7, 12, 0.3, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = trimColors.innerEar;
      x.beginPath();
      x.ellipse(57, vicHeadY - 16, 4, 8, -0.3, 0, Math.PI * 2);
      x.fill();
      x.beginPath();
      x.ellipse(81, vicHeadY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
      x.fill();
    }

    // Both arms waving
    // Left arm
    x.fillStyle = limbColor;
    x.save();
    x.translate(35, vicBodyY - 5);
    x.rotate(0.5 + Math.sin(frame * 0.2) * 0.4);
    x.fillRect(-5, -25, 10, 25);
    x.fillStyle = pawColor;
    x.fillRect(-7, -33, 14, 12);
    x.restore();

    // Right arm
    x.fillStyle = limbColor;
    x.save();
    x.translate(85, vicBodyY - 5);
    x.rotate(-0.5 + Math.sin(frame * 0.2 + Math.PI) * 0.4);
    x.fillRect(-5, -25, 10, 25);
    x.fillStyle = pawColor;
    x.fillRect(-7, -33, 14, 12);
    // Paw pads
    x.fillStyle = '#ffb3b3';
    x.beginPath();
    x.arc(0, -33, 3, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // Legs spread during jump
    x.fillStyle = limbColor;
    x.fillRect(42 - jumpOffset * 0.3, 78, 10, 28);
    x.fillRect(62 + jumpOffset * 0.3, 78, 10, 28);
    // Paws
    x.fillStyle = pawColor;
    x.fillRect(40 - jumpOffset * 0.3, 104, 14, 6);
    x.fillRect(60 + jumpOffset * 0.3, 104, 14, 6);

    // Eyes
    x.fillStyle = '#fff';
    x.beginPath();
    x.ellipse(68, vicHeadY - 6, 7, 8, 0, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(80, vicHeadY - 6, 6, 7, 0, 0, Math.PI * 2);
    x.fill();

    // Pupils
    x.fillStyle = eyeColor;
    x.beginPath();
    x.ellipse(70, vicHeadY - 5, 4, 5, 0, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(82, vicHeadY - 5, 3.5, 4.5, 0, 0, Math.PI * 2);
    x.fill();

    // Pupil highlights
    x.fillStyle = '#fff';
    x.beginPath();
    x.arc(71, vicHeadY - 7, 1.5, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.arc(83, vicHeadY - 7, 1.2, 0, Math.PI * 2);
    x.fill();

    if (name === 'NOOB SAIDOG') drawNoobSaidogEyes(x, vicHeadY, frame);

    if (isDoggoCage(name)) drawDoggoCageSunglasses(x, vicHeadY, frozen);
    if (isRaydog(name)) drawRaydogGear(x, vicBodyY, vicHeadY, frozen);
    if (isRaydog(name)) drawRaydogSparks(x, vicBodyY, vicHeadY, frame, frozen);

    // Victory stars/sparkles
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + frame * 0.08;
      const r = 45 + Math.sin(a * 2 + frame * 0.1) * 10;
      const sx = 60 + Math.cos(a) * r;
      const sy = vicBodyY + 14 + Math.sin(a) * r * 0.7;
      const starSize = 3 + Math.sin(frame * 0.2 + i) * 2;
      drawStar(x, sx, sy, starSize, '#f1c40f');
    }

    // Happy mouth (open smile)
    if (!isMaskedFighter(name)) {
      x.strokeStyle = '#333';
      x.lineWidth = 2;
      x.beginPath();
      x.arc(84, vicHeadY + 8, 8, 0, Math.PI);
      x.stroke();
      x.fillStyle = '#c0392b';
      x.beginPath();
      x.ellipse(84, vicHeadY + 12, 5, 3, 0, 0, Math.PI * 2);
      x.fill();
    }

    // DOGGABAL oxygen mask (victory)
    if (name === 'DOGGABAL') drawDogbalOxygenMask(x, vicHeadY);

    // Raised eyebrows for happy expression
    x.strokeStyle = frozenColor1;
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(62, vicHeadY - 20);
    x.lineTo(74, vicHeadY - 18);
    x.stroke();
    x.beginPath();
    x.moveTo(75, vicHeadY - 18);
    x.lineTo(86, vicHeadY - 19);
    x.stroke();
  }

  // Defeat/death pose effect - crouching with X eyes
  if (state === 'defeat') {
    // Crouch offset - body squats down
    const crouchAmt = 15;

    // Shadow (stays on ground)
    x.fillStyle = 'rgba(0,0,0,0.3)';
    x.beginPath();
    x.ellipse(60, 112, 28, 6, 0, 0, Math.PI * 2);
    x.fill();

    // Legs (crouched)
    x.fillStyle = limbColor;
    x.fillRect(42, 78 + crouchAmt, 10, 28 - crouchOffset);
    x.fillRect(62, 78 + crouchAmt, 10, 28 - crouchOffset);
    // Paws
    x.fillStyle = pawColor;
    x.fillRect(40, 104 + crouchAmt, 14, 6);
    x.fillRect(60, 104 + crouchAmt, 14, 6);

    // Body (crouched)
    const defBodyY = bodyY + crouchAmt;
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(58, defBodyY + 14, 30, 22, 0, 0, Math.PI * 2);
    x.fill();

    // Belly
    x.fillStyle = frozenColor2;
    x.beginPath();
    x.ellipse(58, defBodyY + 20, 20, 14, 0, 0, Math.PI * 2);
    x.fill();

    // DOGGABAL body stripes (defeat)
    if (name === 'DOGGABAL') drawDogbalBodyStripes(x, defBodyY);

    // Tail (drooping)
    x.strokeStyle = frozenColor1;
    x.lineWidth = 6;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(30, defBodyY + 5);
    x.quadraticCurveTo(15, defBodyY + 10, 8, defBodyY + 15);
    x.stroke();

    // Head (crouched)
    const defHeadY = headY + crouchAmt;
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(70, defHeadY, 22, 20, 0, 0, Math.PI * 2);
    x.fill();

    // Ears
    x.fillStyle = frozenColor1;
    x.beginPath();
    x.ellipse(56, defHeadY - 18, 8, 14, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(82, defHeadY - 16, 7, 12, 0.3, 0, Math.PI * 2);
    x.fill();

    // Inner ear
    x.fillStyle = '#ffb3b3';
    x.beginPath();
    x.ellipse(57, defHeadY - 16, 4, 8, -0.3, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.ellipse(81, defHeadY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
    x.fill();

    if (isDoggoCage(name)) drawDoggoCageSunglasses(x, defHeadY, frozen);
    if (isRaydog(name)) drawRaydogGear(x, defBodyY, defHeadY, frozen);
    if (isRaydog(name)) drawRaydogSparks(x, defBodyY, defHeadY, frame, frozen);

    // Snout
    x.fillStyle = frozenColor2;
    x.beginPath();
    x.ellipse(82, defHeadY + 6, 14, 10, 0, 0, Math.PI * 2);
    x.fill();

    // Nose
    if (!isMaskedFighter(name)) {
      x.fillStyle = '#222';
      x.beginPath();
      x.ellipse(90, defHeadY + 2, 5, 4, 0, 0, Math.PI * 2);
      x.fill();
    }

    // Masked fighter gear
    if (isMaskedFighter(name)) {
      const { vestColor, vestHighlight, maskColor, maskEdge } = getMaskedGearColors(name, frozen, frame);

      // Vest on body
      x.fillStyle = vestColor;
      x.beginPath();
      x.ellipse(58, defBodyY + 14, 31, 23, 0, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = trimColors.centerStripe;
      x.fillRect(51, defBodyY - 8, 14, 45);
      x.fillStyle = vestHighlight;
      x.fillRect(48, defBodyY + 5, 4, 4);
      x.fillRect(64, defBodyY + 5, 4, 4);

      // Black hoodie on head
      x.fillStyle = trimColors.hoodieColor;
      x.beginPath();
      x.ellipse(70, defHeadY, 23, 21, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = trimColors.hoodieEdge;
      x.lineWidth = 2;
      x.beginPath();
      x.arc(70, defHeadY, 23, -2.5, -0.6);
      x.stroke();

      // Snout mask
      x.fillStyle = maskColor;
      x.beginPath();
      x.ellipse(82, defHeadY + 6, 15, 11, 0, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = maskEdge;
      x.lineWidth = 1;
      x.beginPath();
      x.ellipse(82, defHeadY + 6, 15, 11, 0, -0.5, 1.5);
      x.stroke();

      // Ears on top of hoodie
      x.fillStyle = trimColors.hoodieColor;
      x.beginPath();
      x.ellipse(56, defHeadY - 18, 8, 14, -0.3, 0, Math.PI * 2);
      x.fill();
      x.beginPath();
      x.ellipse(82, defHeadY - 16, 7, 12, 0.3, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = trimColors.innerEar;
      x.beginPath();
      x.ellipse(57, defHeadY - 16, 4, 8, -0.3, 0, Math.PI * 2);
      x.fill();
      x.beginPath();
      x.ellipse(81, defHeadY - 14, 3.5, 7, 0.3, 0, Math.PI * 2);
      x.fill();
    }

    // Arms (drooping)
    x.fillStyle = limbColor;
    x.fillRect(25, defBodyY, 10, 25);
    x.fillRect(85, defBodyY, 10, 25);
    // Paws
    x.fillStyle = pawColor;
    x.fillRect(23, defBodyY + 23, 14, 6);
    x.fillRect(83, defBodyY + 23, 14, 6);

    // X eyes (dead)
    x.strokeStyle = '#333';
    x.lineWidth = 3;
    // Left X
    x.beginPath();
    x.moveTo(63, defHeadY - 9);
    x.lineTo(73, defHeadY - 1);
    x.stroke();
    x.beginPath();
    x.moveTo(73, defHeadY - 9);
    x.lineTo(63, defHeadY - 1);
    x.stroke();
    // Right X
    x.beginPath();
    x.moveTo(75, defHeadY - 9);
    x.lineTo(85, defHeadY - 1);
    x.stroke();
    x.beginPath();
    x.moveTo(85, defHeadY - 9);
    x.lineTo(75, defHeadY - 1);
    x.stroke();

    // Tongue sticking out
    if (!isMaskedFighter(name)) {
      x.fillStyle = '#ff6b8a';
      x.beginPath();
      x.ellipse(86, defHeadY + 18, 4, 8, 0.3, 0, Math.PI * 2);
      x.fill();
    }

    // DOGGABAL oxygen mask (defeat)
    if (name === 'DOGGABAL') drawDogbalOxygenMask(x, defHeadY);

    // Stars circling head
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + frame * 0.1;
      const sx = 60 + Math.cos(a) * 30;
      const sy = defHeadY - 25 + Math.sin(a) * 10;
      drawStar(x, sx, sy, 5, '#888');
    }
  }

  x.restore();

  spriteCache[key] = c;
  return c;
}

function drawStar(x, cx, cy, r, color) {
  x.fillStyle = color;
  x.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const method = i === 0 ? 'moveTo' : 'lineTo';
    x[method](cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  x.closePath();
  x.fill();
}


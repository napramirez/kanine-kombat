// Background
function drawCloud(cx, cy, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff6df';
  ctx.beginPath();
  ctx.ellipse(cx - 34 * scale, cy + 5 * scale, 34 * scale, 20 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx, cy - 4 * scale, 46 * scale, 26 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 40 * scale, cy + 7 * scale, 32 * scale, 18 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawForestBand(baseY, color, highlight, seed, heightScale) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  ctx.lineTo(0, baseY);
  for (let x = 0; x <= W + 32; x += 16) {
    const wave = Math.sin((x + seed) * 0.025) * 10 + Math.cos((x + seed) * 0.06) * 7;
    const crown = Math.sin((x + seed) * 0.11) * 6;
    ctx.lineTo(x, baseY + wave - crown - heightScale);
  }
  ctx.lineTo(W, GROUND);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = highlight;
  ctx.lineWidth = 2;
  for (let x = 14; x <= W; x += 48) {
    const trunkTop = baseY - 16 - ((x + seed) % 18);
    ctx.beginPath();
    ctx.moveTo(x, baseY + 8);
    ctx.lineTo(x, trunkTop);
    ctx.stroke();
  }
}

function drawTempleRoof(cx, topY, width, height, roofColor, trimColor) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const ridgeY = topY;
  const eaveY = topY + height;

  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(left - 28, eaveY + 10);
  ctx.quadraticCurveTo(left - 8, eaveY + 22, left + 16, eaveY);
  ctx.lineTo(cx - width * 0.18, ridgeY + 14);
  ctx.lineTo(cx, ridgeY - 10);
  ctx.lineTo(cx + width * 0.18, ridgeY + 14);
  ctx.lineTo(right - 16, eaveY);
  ctx.quadraticCurveTo(right + 8, eaveY + 22, right + 28, eaveY + 10);
  ctx.lineTo(right + 8, eaveY + 30);
  ctx.lineTo(left - 8, eaveY + 30);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = '#5a1d1a';
  ctx.lineWidth = 2;
  for (let x = left + 20; x <= right - 20; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, eaveY + 4);
    ctx.lineTo(x + 10, ridgeY + 16);
    ctx.stroke();
  }

  ctx.fillStyle = trimColor;
  ctx.fillRect(cx - 6, ridgeY - 18, 12, 22);
}

function drawKanineLogo(x, cx, cy, scale = 1, palette = {}) {
  const {
    ring = '#e74c3c',
    main = '#e74c3c',
    lower = '#c0392b',
    innerEar = '#f1948a',
    snout = '#f5b7b1',
    eyeWhite = '#fff',
    pupil = '#f1c40f',
    nose = '#2b2b2b',
    mouth = '#7b241c'
  } = palette;

  x.save();

  x.strokeStyle = ring;
  x.lineWidth = 8 * scale;
  x.beginPath();
  x.arc(cx, cy, 56 * scale, 0, Math.PI * 2);
  x.stroke();

  x.fillStyle = lower;
  x.beginPath();
  x.ellipse(cx - 9 * scale, cy + 31 * scale, 26 * scale, 25 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = main;
  x.beginPath();
  x.ellipse(cx + 7 * scale, cy - 6 * scale, 23 * scale, 21 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.beginPath();
  x.ellipse(cx - 8 * scale, cy - 28 * scale, 9 * scale, 15 * scale, -0.35, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(cx + 20 * scale, cy - 26 * scale, 8 * scale, 13 * scale, 0.35, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = innerEar;
  x.beginPath();
  x.ellipse(cx - 5 * scale, cy - 27 * scale, 4 * scale, 8 * scale, -0.35, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(cx + 19 * scale, cy - 25 * scale, 3.5 * scale, 7 * scale, 0.35, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = snout;
  x.beginPath();
  x.ellipse(cx + 18 * scale, cy, 15 * scale, 11 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = eyeWhite;
  x.beginPath();
  x.ellipse(cx + 3 * scale, cy - 16 * scale, 7 * scale, 8 * scale, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(cx + 15 * scale, cy - 16 * scale, 6 * scale, 7 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = pupil;
  x.beginPath();
  x.ellipse(cx + 5 * scale, cy - 15 * scale, 3.8 * scale, 4.8 * scale, 0, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.ellipse(cx + 17 * scale, cy - 15 * scale, 3.2 * scale, 4.2 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.fillStyle = nose;
  x.beginPath();
  x.ellipse(cx + 25 * scale, cy - 7 * scale, 4.5 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
  x.fill();

  x.strokeStyle = mouth;
  x.lineWidth = 2 * scale;
  x.beginPath();
  x.arc(cx + 18 * scale, cy + 1 * scale, 6 * scale, 0.2, Math.PI - 0.1);
  x.stroke();

  x.restore();
}

const BACKGROUND_STAGES = {
  BORKO_LAIR: 'borkoLair',
  CATNIP_DOMAIN: 'catnipDomain',
  NIGHT_CITY: 'nightCity',
  TEMPLE: 'temple'
};

function pickRandomBackgroundStage(excludedStages = []) {
  const stages = [BACKGROUND_STAGES.BORKO_LAIR, BACKGROUND_STAGES.CATNIP_DOMAIN, BACKGROUND_STAGES.NIGHT_CITY, BACKGROUND_STAGES.TEMPLE]
    .filter(stage => !excludedStages.includes(stage));
  return stages[Math.floor(Math.random() * stages.length)];
}

function drawTempleDoorLogo(x, y, w, h) {
  drawKanineLogo(ctx, x + w / 2, y + h / 2, 0.72, {
    ring: '#111111',
    main: '#1f1f1f',
    lower: '#161616',
    innerEar: '#404040',
    snout: '#565656',
    eyeWhite: '#d8d8d8',
    pupil: '#0a0a0a',
    nose: '#000000',
    mouth: '#000000'
  });
}

function drawBuilding(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#251535';
  ctx.fillRect(x + 5, y + 5, w - 10, h - 5);

  // Window flicker is derived from the building rect so lights stay attached to that facade.
  ctx.fillStyle = '#f1c40f';
  for (let wx = x + 12; wx <= x + w - 18; wx += 14) {
    for (let wy = y + 14; wy <= y + h - 22; wy += 24) {
      const flicker = 0.55 + Math.sin(Date.now() * 0.001 + wx * 0.2 + wy * 0.08) * 0.18;
      const lit = Math.sin(wx * 12.9898 + wy * 78.233) > -0.2;
      if (!lit) continue;
      ctx.globalAlpha = flicker;
      ctx.fillRect(wx, wy, 8, 12);
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1a1025';
}

function drawNightCityBackground() {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND);
  skyGrad.addColorStop(0, '#1a0a2e');
  skyGrad.addColorStop(0.5, '#2d1b4e');
  skyGrad.addColorStop(1, '#4a2c6e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, GROUND);

  ctx.fillStyle = '#f5f5dc';
  ctx.beginPath();
  ctx.arc(850, 80, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0a2e';
  ctx.beginPath();
  ctx.arc(865, 72, 35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  for (let i = 0; i < 50; i++) {
    const sx = (i * 137 + 50) % W;
    const sy = (i * 89 + 20) % (GROUND - 100);
    const ss = (Math.sin(Date.now() * 0.001 + i) + 1) * 1.2;
    ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.002 + i * 0.5) * 0.3;
    ctx.fillRect(sx, sy, ss, ss);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1a1025';
  drawBuilding(50, GROUND - 200, 60, 200);
  drawBuilding(140, GROUND - 260, 80, 260);
  drawBuilding(260, GROUND - 180, 50, 180);
  drawBuilding(700, GROUND - 220, 70, 220);
  drawBuilding(810, GROUND - 280, 90, 280);
  drawBuilding(930, GROUND - 160, 55, 160);

  const groundGrad = ctx.createLinearGradient(0, GROUND, 0, H);
  groundGrad.addColorStop(0, '#2c2c2c');
  groundGrad.addColorStop(0.3, '#1a1a1a');
  groundGrad.addColorStop(1, '#111');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, GROUND, W, H - GROUND);

  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  ctx.lineTo(W, GROUND);
  ctx.stroke();

  ctx.fillStyle = '#333';
  for (let i = 0; i < W; i += 40) {
    ctx.fillRect(i, GROUND + 5, 20, 2);
  }
}

function drawCatnipsDomainBackground() {
  const caveGrad = ctx.createLinearGradient(0, 0, 0, H);
  caveGrad.addColorStop(0, '#2a1d34');
  caveGrad.addColorStop(0.45, '#1f1728');
  caveGrad.addColorStop(1, '#100d15');
  ctx.fillStyle = caveGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#34253f';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let x = 0; x <= W; x += 28) {
    const depth = 16 + Math.sin(x * 0.045) * 10 + Math.cos(x * 0.11) * 6;
    ctx.lineTo(x, depth);
  }
  ctx.lineTo(W, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4a3356';
  for (let x = 24; x <= W; x += 86) {
    const tipY = 40 + Math.sin(x * 0.04) * 16;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 18, tipY);
    ctx.lineTo(x + 16, tipY - 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(120, 90, 130, 0.35)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 10; i++) {
    const sx = 120 + i * 82;
    const sy = 120 + (i % 3) * 58;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 26, sy - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx + 8, sy + 10);
    ctx.lineTo(sx + 34, sy + 2);
    ctx.stroke();
  }

  const torchXs = [170, 854];
  torchXs.forEach(tx => {
    const ty = 190;
    const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 78);
    glow.addColorStop(0, 'rgba(255, 218, 138, 0.55)');
    glow.addColorStop(1, 'rgba(255, 218, 138, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(tx, ty, 78, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#7a5a44';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(tx - 10, ty + 18);
    ctx.lineTo(tx + 12, ty - 28);
    ctx.stroke();

    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(tx + 10, ty - 34);
    ctx.lineTo(tx - 2, ty - 6);
    ctx.lineTo(tx + 18, ty - 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(tx + 8, ty - 26);
    ctx.lineTo(tx + 2, ty - 10);
    ctx.lineTo(tx + 14, ty - 12);
    ctx.closePath();
    ctx.fill();
  });

  const trenchTop = GROUND + 16;
  const trenchGrad = ctx.createLinearGradient(0, trenchTop, 0, H);
  trenchGrad.addColorStop(0, '#120f17');
  trenchGrad.addColorStop(1, '#040405');
  ctx.fillStyle = trenchGrad;
  ctx.fillRect(0, trenchTop, W, H - trenchTop);

  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(46, GROUND - 6);
  ctx.bezierCurveTo(270, GROUND - 18, 742, GROUND - 18, 978, GROUND - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(46, GROUND + 28);
  ctx.bezierCurveTo(270, GROUND + 12, 742, GROUND + 12, 978, GROUND + 28);
  ctx.stroke();

  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    const x = 46 + t * 932;
    const topY = GROUND - 6 - Math.sin(t * Math.PI) * 12;
    const bottomY = GROUND + 28 - Math.sin(t * Math.PI) * 10;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.stroke();
  }

  for (let i = 0; i < 21; i++) {
    const t = i / 20;
    const x = 58 + t * 908;
    const plankY = GROUND + 6 + Math.sin(t * Math.PI) * 4;
    ctx.fillStyle = i % 2 === 0 ? '#7b5a3e' : '#6a4d36';
    ctx.fillRect(x - 18, plankY, 36, 12);
    ctx.strokeStyle = '#4a3425';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 18, plankY, 36, 12);
  }
}

function drawBorkosLairBackground() {
  const wallGrad = ctx.createLinearGradient(0, 0, 0, GROUND);
  wallGrad.addColorStop(0, '#2e342f');
  wallGrad.addColorStop(0.45, '#3f453f');
  wallGrad.addColorStop(1, '#1e231f');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, W, GROUND);

  ctx.fillStyle = '#1f241f';
  for (let x = -20; x <= W + 20; x += 44) {
    for (let y = 28; y <= GROUND - 80; y += 24) {
      const offset = (Math.floor(y / 24) % 2) * 18;
      ctx.fillRect(x + offset, y, 40, 20);
    }
  }

  ctx.strokeStyle = 'rgba(18, 24, 18, 0.45)';
  ctx.lineWidth = 2;
  for (let y = 52; y <= GROUND - 76; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#121612';
  ctx.beginPath();
  ctx.ellipse(816, 224, 112, 88, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
  eyeGlow.addColorStop(0, '#ffe66d');
  eyeGlow.addColorStop(0.45, '#f1c40f');
  eyeGlow.addColorStop(1, 'rgba(241, 196, 15, 0)');
  ctx.fillStyle = eyeGlow;
  ctx.save();
  ctx.translate(786, 220 + Math.sin(Date.now() * 0.002) * 2);
  ctx.scale(1.2, 0.8);
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(846, 220 + Math.cos(Date.now() * 0.0022) * 2);
  ctx.scale(1.2, 0.8);
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#676f62';
  ctx.fillRect(74, 126, 146, 34);
  ctx.fillRect(820, 104, 112, 28);
  ctx.fillStyle = '#50584d';
  ctx.beginPath();
  ctx.arc(220, 143, 18, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(820, 118, 16, Math.PI / 2, Math.PI * 1.5);
  ctx.fill();

  ctx.strokeStyle = '#7aa35c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(170, 160);
  ctx.lineTo(182, 212);
  ctx.lineTo(164, 256);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(888, 132);
  ctx.lineTo(874, 184);
  ctx.lineTo(892, 232);
  ctx.stroke();

  ctx.fillStyle = '#4c5550';
  ctx.fillRect(0, GROUND - 118, W, 24);
  ctx.fillStyle = '#69736d';
  for (let x = 0; x <= W; x += 64) {
    ctx.fillRect(x + 8, GROUND - 114, 40, 8);
  }

  const canalTop = GROUND - 94;
  const canalBottom = H;
  const waterGrad = ctx.createLinearGradient(0, canalTop, 0, canalBottom);
  waterGrad.addColorStop(0, '#50766a');
  waterGrad.addColorStop(0.4, '#2f584f');
  waterGrad.addColorStop(1, '#173530');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, canalTop, W, canalBottom - canalTop);

  ctx.fillStyle = 'rgba(156, 209, 171, 0.16)';
  for (let x = -40; x <= W + 40; x += 52) {
    const y = canalTop + 12 + Math.sin((x * 0.04) + Date.now() * 0.003) * 4;
    ctx.beginPath();
    ctx.ellipse(x, y, 34, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#9dd1ab';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 18) {
    const y = canalTop + Math.sin((x / 28) + Date.now() * 0.004) * 4;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(220, 255, 226, 0.18)';
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) {
    const y = canalTop + 20 + Math.cos((x / 24) + Date.now() * 0.0035) * 5;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#272d29';
  ctx.fillRect(0, GROUND, W, H - GROUND);
}

function drawTempleBackground() {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND);
  skyGrad.addColorStop(0, '#7fc2f3');
  skyGrad.addColorStop(0.45, '#a9daf7');
  skyGrad.addColorStop(0.78, '#f0cf8c');
  skyGrad.addColorStop(1, '#d59d63');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, GROUND);

  const sunGlow = ctx.createRadialGradient(186, 112, 0, 186, 112, 84);
  sunGlow.addColorStop(0, 'rgba(255, 244, 196, 0.95)');
  sunGlow.addColorStop(0.45, 'rgba(255, 220, 140, 0.55)');
  sunGlow.addColorStop(1, 'rgba(255, 220, 140, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(186, 112, 84, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffe29a';
  ctx.beginPath();
  ctx.arc(186, 112, 36, 0, Math.PI * 2);
  ctx.fill();

  drawCloud(270, 102, 1.1, 0.45);
  drawCloud(610, 88, 0.9, 0.35);
  drawCloud(824, 134, 1.15, 0.3);

  ctx.fillStyle = '#8ea06c';
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  for (let x = 0; x <= W; x += 40) {
    const ridgeY = 236 + Math.sin(x * 0.012) * 18 + Math.cos(x * 0.026) * 12;
    ctx.lineTo(x, ridgeY);
  }
  ctx.lineTo(W, GROUND);
  ctx.closePath();
  ctx.fill();

  drawForestBand(304, '#547b45', '#415f34', 12, 12);
  drawForestBand(338, '#3f6337', '#2f4c29', 90, 20);

  const templeCenterX = W / 2;
  const templeBaseY = 228;

  ctx.fillStyle = '#75624a';
  ctx.fillRect(templeCenterX - 300, templeBaseY + 156, 600, 42);

  ctx.fillStyle = '#d9c6a1';
  ctx.fillRect(templeCenterX - 248, templeBaseY + 18, 496, 154);
  ctx.fillStyle = '#cdb48c';
  ctx.fillRect(templeCenterX - 228, templeBaseY + 34, 456, 126);

  drawTempleRoof(templeCenterX, templeBaseY - 38, 430, 88, '#6f2722', '#d8b36a');
  drawTempleRoof(templeCenterX, templeBaseY + 12, 580, 98, '#7e2d28', '#e2bd72');

  ctx.fillStyle = '#8d1f1d';
  for (let i = -2; i <= 2; i++) {
    const columnX = templeCenterX + i * 92 - 14;
    ctx.fillRect(columnX, templeBaseY + 52, 28, 120);
    ctx.fillStyle = '#d8b36a';
    ctx.fillRect(columnX - 2, templeBaseY + 48, 32, 8);
    ctx.fillRect(columnX - 2, templeBaseY + 168, 32, 8);
    ctx.fillStyle = '#8d1f1d';
  }

  ctx.fillStyle = '#b89466';
  ctx.fillRect(templeCenterX - 146, templeBaseY + 74, 292, 98);
  ctx.fillStyle = '#724829';
  ctx.fillRect(templeCenterX - 132, templeBaseY + 74, 264, 98);
  ctx.fillStyle = '#57331d';
  ctx.fillRect(templeCenterX - 4, templeBaseY + 74, 8, 98);

  ctx.strokeStyle = '#916038';
  ctx.lineWidth = 3;
  for (let y = templeBaseY + 84; y <= templeBaseY + 162; y += 18) {
    ctx.beginPath();
    ctx.moveTo(templeCenterX - 126, y);
    ctx.lineTo(templeCenterX + 126, y);
    ctx.stroke();
  }
  for (let x = templeCenterX - 114; x <= templeCenterX + 114; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, templeBaseY + 76);
    ctx.lineTo(x, templeBaseY + 170);
    ctx.stroke();
  }

  ctx.fillStyle = '#d8b36a';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const studX = templeCenterX - 96 + col * 38;
      const studY = templeBaseY + 92 + row * 20;
      ctx.beginPath();
      ctx.arc(studX, studY, 3, 0, Math.PI * 2);
      ctx.arc(studX + 152, studY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawTempleDoorLogo(templeCenterX - 132, templeBaseY + 74, 264, 98);

  ctx.fillStyle = '#4d3726';
  ctx.fillRect(templeCenterX - 204, templeBaseY + 174, 408, 18);
  ctx.fillStyle = '#7c5d40';
  ctx.fillRect(templeCenterX - 232, templeBaseY + 192, 464, 22);

  const groundGrad = ctx.createLinearGradient(0, GROUND, 0, H);
  groundGrad.addColorStop(0, '#8f7b5a');
  groundGrad.addColorStop(0.42, '#65513e');
  groundGrad.addColorStop(1, '#413328');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, GROUND, W, H - GROUND);

  ctx.strokeStyle = '#ad916e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GROUND);
  ctx.lineTo(W, GROUND);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(66, 46, 32, 0.55)';
  ctx.lineWidth = 2;
  for (let y = GROUND + 8; y <= H; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y - 6);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(219, 196, 151, 0.18)';
  for (let x = 18; x <= W; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND + 2);
    ctx.lineTo(x + 20, H);
    ctx.stroke();
  }
}

function drawBackground() {
  if (game.stage === BACKGROUND_STAGES.BORKO_LAIR) {
    drawBorkosLairBackground();
    return;
  }

  if (game.stage === BACKGROUND_STAGES.CATNIP_DOMAIN) {
    drawCatnipsDomainBackground();
    return;
  }

  if (game.stage === BACKGROUND_STAGES.NIGHT_CITY) {
    drawNightCityBackground();
    return;
  }

  drawTempleBackground();
}


// Particles
const particles = [];

function addParticle(x, y, type) {
  if (type === 'hit') {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 20,
        maxLife: 20,
        color: ['#f1c40f', '#e74c3c', '#fff'][Math.floor(Math.random() * 3)],
        size: 3 + Math.random() * 5,
        type: 'spark'
      });
    }
    particles.push({
      x, y, vx: 0, vy: 0, life: 15, maxLife: 15,
      text: 'BAM!', color: '#f1c40f', type: 'text'
    });
  } else if (type === 'block') {
    for (let i = 0; i < 4; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 12,
        maxLife: 12,
        color: '#74b9ff',
        size: 4,
        type: 'spark'
      });
    }
    particles.push({
      x, y, vx: 0, vy: 0, life: 12, maxLife: 12,
      text: 'BLOCK!', color: '#74b9ff', type: 'text'
    });
  } else if (type === 'ko') {
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      particles.push({
        x, y,
        vx: Math.cos(a) * (3 + Math.random() * 5),
        vy: Math.sin(a) * (3 + Math.random() * 5),
        life: 40,
        maxLife: 40,
        color: ['#f1c40f', '#e74c3c', '#fff', '#e67e22'][Math.floor(Math.random() * 4)],
        size: 4 + Math.random() * 6,
        type: 'spark'
      });
    }
  } else if (type === 'freeze') {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      particles.push({
        x, y,
        vx: Math.cos(a) * (2 + Math.random() * 3),
        vy: Math.sin(a) * (2 + Math.random() * 3),
        life: 30,
        maxLife: 30,
        color: ['#87ceeb', '#fff', '#b0e0e6', '#e0ffff'][Math.floor(Math.random() * 4)],
        size: 3 + Math.random() * 4,
        type: 'spark'
      });
    }
    particles.push({
      x, y, vx: 0, vy: 0, life: 25, maxLife: 25,
      text: 'FROZEN!', color: '#87ceeb', type: 'text'
    });
  } else if (type === 'stunned') {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 2,
        life: 24,
        maxLife: 24,
        color: ['#f1c40f', '#f39c12', '#fff'][Math.floor(Math.random() * 3)],
        size: 3 + Math.random() * 3,
        type: 'spark'
      });
    }
    particles.push({
      x, y, vx: 0, vy: 0, life: 24, maxLife: 24,
      text: 'STUNNED!', color: '#f39c12', type: 'text'
    });
  }
}

function spawnSmokePuff(x, y) {
  particles.push({
    x: x + (Math.random() - 0.5) * 20,
    y: y - Math.random() * 10,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -0.5 - Math.random() * 1,
    life: 30 + Math.floor(Math.random() * 10),
    maxLife: 40,
    color: ['#888', '#777', '#999', '#aaa'][Math.floor(Math.random() * 4)],
    size: 5 + Math.random() * 5,
    type: 'smokePuff'
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life--;
    if (p.type === 'borkoShockwave') {
      if (p.life <= 0) particles.splice(i, 1);
      continue;
    }
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'smokePuff') {
      p.vx *= 0.98;
    } else {
      p.vy += 0.2;
    }
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  particles.forEach(p => {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    if (p.type === 'borkoShockwave') {
      const progress = 1 - alpha;
      const radiusX = p.radius * (0.3 + progress * 0.7);
      const radiusY = 12 + progress * 16;
      const bandHeight = 14 + progress * 10;

      ctx.strokeStyle = '#74b9ff';
      ctx.lineWidth = 5 - progress * 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 4, radiusX, radiusY, 0, Math.PI, 0, true);
      ctx.stroke();

      ctx.strokeStyle = '#dfe6e9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 4, radiusX * 0.82, radiusY * 0.65, 0, Math.PI, 0, true);
      ctx.stroke();

      ctx.fillStyle = `rgba(116, 185, 255, ${0.18 * alpha})`;
      ctx.fillRect(p.x - radiusX, p.y - bandHeight / 2, radiusX * 2, bandHeight);
    } else if (p.type === 'text') {
      ctx.fillStyle = p.color;
      ctx.font = `bold ${16 + (1 - alpha) * 10}px 'Press Start 2P', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y - (1 - alpha) * 20);
    } else if (p.type === 'smokePuff') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size * alpha, p.size * alpha);
    }
    ctx.globalAlpha = 1;
  });
  ctx.textAlign = 'left';
}


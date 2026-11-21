// Scene 2: The Garden at Noon. Bright sky, a big tree, a fence and a flowerbed.
// Seven things change between the two pictures; the butterfly and the missing
// fence plank are the sneaky ones.
export const gardenScene = {
  id: 'garden',
  name: 'The Garden at Noon',
  differences: [
    { id: 'sun', x: 0.14, y: 0.16, r: 30, label: 'the sun face' },
    { id: 'cloud', x: 0.8, y: 0.14, r: 30, label: 'the second cloud' },
    { id: 'birdhouse', x: 0.68, y: 0.3, r: 30, label: 'the birdhouse roof' },
    { id: 'apples', x: 0.86, y: 0.32, r: 30, label: 'the apples on the tree' },
    { id: 'butterfly', x: 0.45, y: 0.45, r: 28, label: 'the butterfly' },
    { id: 'fence', x: 0.55, y: 0.58, r: 28, label: 'the fence plank' },
    { id: 'tulip', x: 0.3, y: 0.82, r: 28, label: 'the tulip colour' },
  ],

  draw(ctx, W, H, changed) {
    const fx = (f) => f * W;
    const fy = (f) => f * H;
    const has = (id) => changed.has(id);

    // Sky and grass.
    const sky = ctx.createLinearGradient(0, 0, 0, fy(0.62));
    sky.addColorStop(0, '#7ec3e8');
    sky.addColorStop(1, '#bfe6f5');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, fy(0.62));
    ctx.fillStyle = '#6aa84f';
    ctx.fillRect(0, fy(0.62), W, H - fy(0.62));
    ctx.fillStyle = '#5d9a45';
    ctx.fillRect(0, fy(0.62), W, 10);

    // Sun, top left.
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(fx(0.14), fy(0.16), 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f2b705';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(fx(0.14) + Math.cos(angle) * 42, fy(0.16) + Math.sin(angle) * 42);
      ctx.lineTo(fx(0.14) + Math.cos(angle) * 54, fy(0.16) + Math.sin(angle) * 54);
      ctx.stroke();
    }
    if (!has('sun')) {
      // A sleepy face on the sun.
      ctx.fillStyle = '#8a6d1a';
      ctx.beginPath();
      ctx.arc(fx(0.14) - 10, fy(0.16) - 6, 3, 0, Math.PI * 2);
      ctx.arc(fx(0.14) + 10, fy(0.16) - 6, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8a6d1a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(fx(0.14), fy(0.16) + 6, 10, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }

    // Clouds.
    function cloud(cx, cy, scale) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx(cx), fy(cy), 22 * scale, 0, Math.PI * 2);
      ctx.arc(fx(cx) + 22 * scale, fy(cy) + 4, 18 * scale, 0, Math.PI * 2);
      ctx.arc(fx(cx) - 22 * scale, fy(cy) + 6, 16 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    cloud(0.42, 0.1, 1);
    if (!has('cloud')) cloud(0.8, 0.14, 0.9);

    // Big tree on the right.
    ctx.fillStyle = '#6d4c33';
    ctx.fillRect(fx(0.84), fy(0.3), 22, fy(0.34));
    ctx.fillStyle = '#4f7a3a';
    ctx.beginPath();
    ctx.arc(fx(0.85), fy(0.24), 70, 0, Math.PI * 2);
    ctx.arc(fx(0.78), fy(0.32), 48, 0, Math.PI * 2);
    ctx.arc(fx(0.93), fy(0.32), 48, 0, Math.PI * 2);
    ctx.fill();
    // Apples: three, or five when changed.
    const appleSpots = [[0.8, 0.22], [0.88, 0.28], [0.92, 0.2], [0.76, 0.3], [0.9, 0.34]];
    const appleCount = has('apples') ? 5 : 3;
    ctx.fillStyle = '#d94f4f';
    appleSpots.slice(0, appleCount).forEach(([ax, ay]) => {
      ctx.beginPath();
      ctx.arc(fx(ax), fy(ay), 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Birdhouse on a pole.
    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(fx(0.67), fy(0.34), 8, fy(0.3));
    ctx.fillStyle = '#e8c98a';
    ctx.fillRect(fx(0.62), fy(0.26), 66, 48);
    ctx.fillStyle = has('birdhouse') ? '#4f7a9e' : '#b85450';
    ctx.beginPath();
    ctx.moveTo(fx(0.6), fy(0.26));
    ctx.lineTo(fx(0.655), fy(0.2));
    ctx.lineTo(fx(0.71), fy(0.26));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.arc(fx(0.655), fy(0.3), 9, 0, Math.PI * 2);
    ctx.fill();

    // Fence across the middle.
    ctx.fillStyle = '#e8e0c8';
    ctx.fillRect(0, fy(0.52), W, 8);
    ctx.fillRect(0, fy(0.6), W, 8);
    for (let i = 0; i < 9; i += 1) {
      if (i === 5 && has('fence')) continue; // one plank is missing
      const px = fx(0.05) + i * 62;
      ctx.fillStyle = '#efe8d0';
      ctx.fillRect(px, fy(0.48), 34, fy(0.2));
      ctx.fillStyle = '#d8cfb0';
      ctx.fillRect(px, fy(0.48), 34, 6);
    }

    // Butterfly, floating over the flowers.
    if (!has('butterfly')) {
      const bx = fx(0.45);
      const by = fy(0.45);
      ctx.fillStyle = '#e87ea1';
      ctx.beginPath();
      ctx.ellipse(bx - 10, by - 6, 12, 8, -0.5, 0, Math.PI * 2);
      ctx.ellipse(bx + 10, by - 6, 12, 8, 0.5, 0, Math.PI * 2);
      ctx.ellipse(bx - 9, by + 8, 10, 7, 0.5, 0, Math.PI * 2);
      ctx.ellipse(bx + 9, by + 8, 10, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3a2a1a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx, by - 10);
      ctx.lineTo(bx, by + 12);
      ctx.stroke();
    }

    // Flowerbed along the bottom.
    ctx.fillStyle = '#5d4a33';
    ctx.fillRect(0, fy(0.78), W, H - fy(0.78));
    const flowers = [
      [0.1, '#e87ea1'], [0.2, '#ffd94d'], [0.3, '#e87ea1'], [0.4, '#b678c4'],
      [0.5, '#e87ea1'], [0.6, '#ffd94d'], [0.7, '#b678c4'], [0.8, '#e87ea1'], [0.9, '#ffd94d'],
    ];
    flowers.forEach(([fxf, color], i) => {
      const x = fx(fxf);
      const y = fy(0.86);
      ctx.strokeStyle = '#3f7a2e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, fy(0.78));
      ctx.lineTo(x, y);
      ctx.stroke();
      const petal = i === 2 && has('tulip') ? '#ffd94d' : color;
      ctx.fillStyle = petal;
      for (let p = 0; p < 5; p += 1) {
        const angle = (p / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f2b705';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Watering can by the fence.
    ctx.fillStyle = '#7a9e7e';
    ctx.fillRect(fx(0.12), fy(0.66), 44, 30);
    ctx.fillStyle = '#5d8261';
    ctx.beginPath();
    ctx.moveTo(fx(0.12), fy(0.68));
    ctx.lineTo(fx(0.08), fy(0.6));
    ctx.lineTo(fx(0.08), fy(0.64));
    ctx.lineTo(fx(0.12), fy(0.72));
    ctx.closePath();
    ctx.fill();

    // Path stones.
    ctx.fillStyle = '#d8d2c0';
    [[0.52, 0.72], [0.58, 0.76], [0.64, 0.72]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.ellipse(fx(sx), fy(sy), 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  },
};

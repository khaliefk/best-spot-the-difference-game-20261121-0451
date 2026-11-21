// Scene 3: The Old Harbour. A lighthouse, two boats, gulls and a fisherman on
// the pier. Seven things change between the two pictures; the missing anchor
// and the second gull reward a slow look at the waterline.
export const harbourScene = {
  id: 'harbour',
  name: 'The Old Harbour',
  differences: [
    { id: 'flag', x: 0.22, y: 0.06, r: 26, label: 'the lighthouse flag' },
    { id: 'light', x: 0.18, y: 0.2, r: 30, label: 'the lighthouse beam' },
    { id: 'gulls', x: 0.7, y: 0.16, r: 30, label: 'the gulls' },
    { id: 'sail', x: 0.55, y: 0.35, r: 30, label: 'the sail stripe' },
    { id: 'hat', x: 0.48, y: 0.75, r: 28, label: 'the fisherman hat' },
    { id: 'crate', x: 0.85, y: 0.72, r: 28, label: 'the crate on the pier' },
    { id: 'anchor', x: 0.35, y: 0.78, r: 28, label: 'the anchor' },
  ],

  draw(ctx, W, H, changed) {
    const fx = (f) => f * W;
    const fy = (f) => f * H;
    const has = (id) => changed.has(id);

    // Sky, sea and pier.
    const sky = ctx.createLinearGradient(0, 0, 0, fy(0.55));
    sky.addColorStop(0, '#a8d4e8');
    sky.addColorStop(1, '#e8f2f5');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, fy(0.55));
    ctx.fillStyle = '#3f7fa6';
    ctx.fillRect(0, fy(0.55), W, fy(0.18));
    ctx.fillStyle = '#8a6a44';
    ctx.fillRect(0, fy(0.73), W, H - fy(0.73));
    ctx.fillStyle = '#6d5233';
    for (let i = 0; i < 8; i += 1) ctx.fillRect(0, fy(0.75) + i * 22, W, 3);

    // Lighthouse on the left.
    ctx.fillStyle = '#f2ede2';
    ctx.beginPath();
    ctx.moveTo(fx(0.14), fy(0.55));
    ctx.lineTo(fx(0.16), fy(0.14));
    ctx.lineTo(fx(0.2), fy(0.14));
    ctx.lineTo(fx(0.22), fy(0.55));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b85450';
    ctx.fillRect(fx(0.155), fy(0.3), 62, 26);
    ctx.fillRect(fx(0.15), fy(0.44), 68, 26);
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(fx(0.15), fy(0.1), 62, 22);
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(fx(0.165), fy(0.13), 14, 16);
    ctx.fillRect(fx(0.185), fy(0.13), 14, 16);
    // Flag on top.
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx(0.18), fy(0.1));
    ctx.lineTo(fx(0.18), fy(0.04));
    ctx.stroke();
    ctx.fillStyle = has('flag') ? '#ffd94d' : '#b85450';
    ctx.beginPath();
    ctx.moveTo(fx(0.18), fy(0.04));
    ctx.lineTo(fx(0.26), fy(0.055));
    ctx.lineTo(fx(0.18), fy(0.07));
    ctx.closePath();
    ctx.fill();
    // Beam: shining, or dark.
    if (!has('light')) {
      const beam = ctx.createLinearGradient(fx(0.2), fy(0.14), fx(0.55), fy(0.2));
      beam.addColorStop(0, 'rgba(255, 217, 77, 0.5)');
      beam.addColorStop(1, 'rgba(255, 217, 77, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(fx(0.2), fy(0.13));
      ctx.lineTo(fx(0.55), fy(0.08));
      ctx.lineTo(fx(0.55), fy(0.24));
      ctx.lineTo(fx(0.2), fy(0.17));
      ctx.closePath();
      ctx.fill();
    }

    // Gulls in the sky: two, or three when changed.
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    function gull(gx, gy) {
      ctx.beginPath();
      ctx.arc(fx(gx) - 8, fy(gy), 8, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(fx(gx) + 8, fy(gy), 8, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
    gull(0.62, 0.14);
    gull(0.78, 0.2);
    if (has('gulls')) gull(0.7, 0.08);

    // Sailboat in the middle distance.
    ctx.fillStyle = '#6d4c33';
    ctx.beginPath();
    ctx.moveTo(fx(0.5), fy(0.5));
    ctx.lineTo(fx(0.62), fy(0.5));
    ctx.lineTo(fx(0.59), fy(0.54));
    ctx.lineTo(fx(0.53), fy(0.54));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx(0.56), fy(0.5));
    ctx.lineTo(fx(0.56), fy(0.28));
    ctx.stroke();
    ctx.fillStyle = '#f2ede2';
    ctx.beginPath();
    ctx.moveTo(fx(0.56), fy(0.3));
    ctx.lineTo(fx(0.56), fy(0.48));
    ctx.lineTo(fx(0.66), fy(0.48));
    ctx.closePath();
    ctx.fill();
    if (!has('sail')) {
      ctx.fillStyle = '#b85450';
      ctx.beginPath();
      ctx.moveTo(fx(0.56), fy(0.38));
      ctx.lineTo(fx(0.61), fy(0.38));
      ctx.lineTo(fx(0.615), fy(0.43));
      ctx.lineTo(fx(0.56), fy(0.43));
      ctx.closePath();
      ctx.fill();
    }
    // Small rowboat.
    ctx.fillStyle = '#4f7a9e';
    ctx.beginPath();
    ctx.moveTo(fx(0.72), fy(0.58));
    ctx.lineTo(fx(0.8), fy(0.58));
    ctx.lineTo(fx(0.78), fy(0.62));
    ctx.lineTo(fx(0.74), fy(0.62));
    ctx.closePath();
    ctx.fill();

    // Waves.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 3;
    [[0.4, 0.6], [0.6, 0.64], [0.3, 0.68], [0.75, 0.68]].forEach(([wx, wy]) => {
      ctx.beginPath();
      ctx.arc(fx(wx), fy(wy), 12, Math.PI, Math.PI * 2);
      ctx.stroke();
    });

    // Fisherman standing on the pier, rod over the water.
    ctx.fillStyle = '#3a5a7a';
    ctx.fillRect(fx(0.46), fy(0.77), 26, 40);
    ctx.fillStyle = '#e8c98a';
    ctx.beginPath();
    ctx.arc(fx(0.475), fy(0.755), 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = has('hat') ? '#8a5a3a' : '#3f6db5';
    ctx.beginPath();
    ctx.arc(fx(0.475), fy(0.745), 13, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(fx(0.46), fy(0.74), 28, 4);
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx(0.49), fy(0.79));
    ctx.lineTo(fx(0.57), fy(0.69));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx(0.57), fy(0.69));
    ctx.lineTo(fx(0.57), fy(0.8));
    ctx.stroke();

    // Anchor leaning on the pier.
    if (!has('anchor')) {
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(fx(0.35), fy(0.76), 8, 0, Math.PI * 2);
      ctx.moveTo(fx(0.35), fy(0.76));
      ctx.lineTo(fx(0.35), fy(0.86));
      ctx.moveTo(fx(0.35), fy(0.86));
      ctx.quadraticCurveTo(fx(0.3), fy(0.9), fx(0.31), fy(0.84));
      ctx.moveTo(fx(0.35), fy(0.86));
      ctx.quadraticCurveTo(fx(0.4), fy(0.9), fx(0.39), fy(0.84));
      ctx.moveTo(fx(0.31), fy(0.8));
      ctx.lineTo(fx(0.39), fy(0.8));
      ctx.stroke();
    }

    // Crates on the right of the pier.
    ctx.fillStyle = '#c9a86a';
    ctx.fillRect(fx(0.8), fy(0.68), 40, 40);
    ctx.strokeStyle = '#8a6a3a';
    ctx.lineWidth = 3;
    ctx.strokeRect(fx(0.8), fy(0.68), 40, 40);
    ctx.beginPath();
    ctx.moveTo(fx(0.8), fy(0.68));
    ctx.lineTo(fx(0.8) + 40, fy(0.68) + 40);
    ctx.moveTo(fx(0.8) + 40, fy(0.68));
    ctx.lineTo(fx(0.8), fy(0.68) + 40);
    ctx.stroke();
    if (!has('crate')) {
      ctx.fillStyle = '#b8945a';
      ctx.fillRect(fx(0.86), fy(0.62), 34, 34);
      ctx.strokeStyle = '#8a6a3a';
      ctx.strokeRect(fx(0.86), fy(0.62), 34, 34);
    }

    // Rope coil.
    ctx.strokeStyle = '#d8c49a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(fx(0.62), fy(0.82), 16, 0, Math.PI * 2);
    ctx.arc(fx(0.62), fy(0.82), 9, 0, Math.PI * 2);
    ctx.stroke();
  },
};

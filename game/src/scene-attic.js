// Scene 1: The Attic at Dusk. A quiet room under the roof, drawn flat with
// warm lamp light against blue evening. Seven things change between the two
// pictures; each one is a small, fair detail a careful eye catches.
export const atticScene = {
  id: 'attic',
  name: 'The Attic at Dusk',
  differences: [
    { id: 'moon', x: 0.3, y: 0.22, r: 30, label: 'the moon in the window' },
    { id: 'lamp', x: 0.45, y: 0.1, r: 30, label: 'the lamp glow' },
    { id: 'picture', x: 0.62, y: 0.25, r: 30, label: 'the framed picture' },
    { id: 'book', x: 0.83, y: 0.35, r: 26, label: 'the red book' },
    { id: 'teapot', x: 0.18, y: 0.72, r: 30, label: 'the teapot handle' },
    { id: 'cat', x: 0.55, y: 0.78, r: 34, label: 'the cat tail' },
    { id: 'plant', x: 0.9, y: 0.72, r: 28, label: 'the plant flower' },
  ],

  draw(ctx, W, H, changed) {
    const fx = (f) => f * W;
    const fy = (f) => f * H;
    const has = (id) => changed.has(id);

    // Wall and floor.
    const wall = ctx.createLinearGradient(0, 0, 0, H);
    wall.addColorStop(0, '#3b3560');
    wall.addColorStop(0.62, '#5d4460');
    wall.addColorStop(0.63, '#7a5a44');
    wall.addColorStop(1, '#8a6a4a');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#6d4c33';
    ctx.fillRect(0, fy(0.78), W, H - fy(0.78));
    ctx.fillStyle = '#5d3f2a';
    for (let i = 0; i < 7; i += 1) ctx.fillRect(0, fy(0.78) + 14 + i * 26, W, 3);

    // Slanted roof beams.
    ctx.fillStyle = '#4a3220';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(fx(0.22), 0);
    ctx.lineTo(0, fy(0.3));
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W, 0);
    ctx.lineTo(fx(0.78), 0);
    ctx.lineTo(W, fy(0.3));
    ctx.closePath();
    ctx.fill();

    // Round window with the moon.
    ctx.fillStyle = '#2c2748';
    ctx.beginPath();
    ctx.arc(fx(0.3), fy(0.22), 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx(0.3) - 62, fy(0.22));
    ctx.lineTo(fx(0.3) + 62, fy(0.22));
    ctx.moveTo(fx(0.3), fy(0.22) - 62);
    ctx.lineTo(fx(0.3), fy(0.22) + 62);
    ctx.stroke();
    ctx.fillStyle = '#f4e8c1';
    ctx.beginPath();
    ctx.arc(fx(0.3) + 14, fy(0.22) - 12, 20, 0, Math.PI * 2);
    ctx.fill();
    if (has('moon')) {
      // Crescent: the evening sky takes a bite out of the moon.
      ctx.fillStyle = '#2c2748';
      ctx.beginPath();
      ctx.arc(fx(0.3) + 26, fy(0.22) - 16, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    // Stars outside the window.
    ctx.fillStyle = '#f4e8c1';
    [[0.24, 0.12], [0.36, 0.1], [0.27, 0.3], [0.35, 0.31]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(fx(sx), fy(sy), 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Hanging lamp.
    ctx.strokeStyle = '#2a2118';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx(0.45), 0);
    ctx.lineTo(fx(0.45), fy(0.08));
    ctx.stroke();
    if (has('lamp')) {
      ctx.fillStyle = '#4a4038';
      ctx.fillRect(fx(0.45) - 22, fy(0.08), 44, 14);
    } else {
      const glow = ctx.createRadialGradient(fx(0.45), fy(0.14), 4, fx(0.45), fy(0.14), 110);
      glow.addColorStop(0, 'rgba(255, 214, 130, 0.55)');
      glow.addColorStop(1, 'rgba(255, 214, 130, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(fx(0.45) - 110, fy(0.14) - 110, 220, 220);
      ctx.fillStyle = '#f7c948';
      ctx.beginPath();
      ctx.arc(fx(0.45), fy(0.13), 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c9a86a';
      ctx.beginPath();
      ctx.moveTo(fx(0.45) - 24, fy(0.08));
      ctx.lineTo(fx(0.45) + 24, fy(0.08));
      ctx.lineTo(fx(0.45) + 14, fy(0.1));
      ctx.lineTo(fx(0.45) - 14, fy(0.1));
      ctx.closePath();
      ctx.fill();
    }

    // Framed picture on the wall.
    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(fx(0.62) - 42, fy(0.25) - 34, 84, 68);
    ctx.fillStyle = '#dfe9f2';
    ctx.fillRect(fx(0.62) - 36, fy(0.25) - 28, 72, 56);
    if (has('picture')) {
      // A sun over a field instead of mountains.
      ctx.fillStyle = '#f7c948';
      ctx.beginPath();
      ctx.arc(fx(0.62), fy(0.25) - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7ba05b';
      ctx.fillRect(fx(0.62) - 36, fy(0.25) + 8, 72, 20);
    } else {
      ctx.fillStyle = '#7b9cc4';
      ctx.beginPath();
      ctx.moveTo(fx(0.62) - 36, fy(0.25) + 28);
      ctx.lineTo(fx(0.62) - 12, fy(0.25) - 18);
      ctx.lineTo(fx(0.62) + 8, fy(0.25) + 6);
      ctx.lineTo(fx(0.62) + 20, fy(0.25) - 10);
      ctx.lineTo(fx(0.62) + 36, fy(0.25) + 28);
      ctx.closePath();
      ctx.fill();
    }

    // Bookshelf with books.
    ctx.fillStyle = '#4a3220';
    ctx.fillRect(fx(0.76), fy(0.28), 120, 130);
    ctx.fillStyle = '#6d4c33';
    ctx.fillRect(fx(0.78), fy(0.3), 108, 118);
    const bookColors = ['#b85450', '#4f7a5a', '#d9a441', '#5b7fa6', '#8a5a8a'];
    bookColors.forEach((color, i) => {
      if (i === 0 && has('book')) return; // the red book is gone
      ctx.fillStyle = color;
      ctx.fillRect(fx(0.79) + i * 20, fy(0.32), 16, 52);
    });
    ctx.fillStyle = '#4a3220';
    ctx.fillRect(fx(0.78), fy(0.42), 108, 6);
    ctx.fillStyle = '#c9a86a';
    ctx.beginPath();
    ctx.arc(fx(0.86), fy(0.45), 8, 0, Math.PI * 2);
    ctx.fill();

    // Table with the teapot.
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(fx(0.08), fy(0.68), 180, 12);
    ctx.fillRect(fx(0.12), fy(0.7), 10, 60);
    ctx.fillRect(fx(0.22), fy(0.7), 10, 60);
    ctx.fillStyle = '#b85450';
    ctx.beginPath();
    ctx.arc(fx(0.17), fy(0.62), 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(fx(0.17) - 8, fy(0.55), 16, 12);
    ctx.fillStyle = '#8a3d3a';
    ctx.beginPath();
    ctx.moveTo(fx(0.17) - 24, fy(0.6));
    ctx.lineTo(fx(0.17) - 40, fy(0.55));
    ctx.lineTo(fx(0.17) - 40, fy(0.62));
    ctx.lineTo(fx(0.17) - 24, fy(0.65));
    ctx.closePath();
    ctx.fill();
    if (!has('teapot')) {
      ctx.strokeStyle = '#8a3d3a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(fx(0.17) + 30, fy(0.62), 12, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }

    // Rug and the sleeping cat.
    ctx.fillStyle = '#a34d4d';
    ctx.beginPath();
    ctx.ellipse(fx(0.55), fy(0.85), 130, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e8c98a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(fx(0.55), fy(0.85), 112, 24, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Cat body: a curled grey loaf.
    ctx.fillStyle = '#8a8f98';
    ctx.beginPath();
    ctx.ellipse(fx(0.55), fy(0.8), 52, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx(0.55) - 38, fy(0.78), 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8a8f98';
    ctx.beginPath();
    ctx.moveTo(fx(0.55) - 52, fy(0.76));
    ctx.lineTo(fx(0.55) - 48, fy(0.68));
    ctx.lineTo(fx(0.55) - 42, fy(0.75));
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fx(0.55) - 30, fy(0.76));
    ctx.lineTo(fx(0.55) - 26, fy(0.68));
    ctx.lineTo(fx(0.55) - 20, fy(0.75));
    ctx.closePath();
    ctx.fill();
    // Tail: curled up over the back, or lying flat on the rug.
    ctx.strokeStyle = '#8a8f98';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (has('cat')) {
      ctx.moveTo(fx(0.55) + 48, fy(0.82));
      ctx.lineTo(fx(0.55) + 78, fy(0.84));
    } else {
      ctx.moveTo(fx(0.55) + 48, fy(0.82));
      ctx.quadraticCurveTo(fx(0.55) + 62, fy(0.66), fx(0.55) + 44, fy(0.62));
    }
    ctx.stroke();

    // Plant in the corner.
    ctx.fillStyle = '#b85450';
    ctx.beginPath();
    ctx.moveTo(fx(0.88), fy(0.78));
    ctx.lineTo(fx(0.94), fy(0.78));
    ctx.lineTo(fx(0.92), fy(0.86));
    ctx.lineTo(fx(0.9), fy(0.86));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4f7a5a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(fx(0.91), fy(0.78));
    ctx.quadraticCurveTo(fx(0.88), fy(0.68), fx(0.86), fy(0.62));
    ctx.moveTo(fx(0.91), fy(0.78));
    ctx.quadraticCurveTo(fx(0.94), fy(0.68), fx(0.96), fy(0.62));
    ctx.moveTo(fx(0.91), fy(0.78));
    ctx.lineTo(fx(0.91), fy(0.6));
    ctx.stroke();
    if (!has('plant')) {
      ctx.fillStyle = '#e87ea1';
      ctx.beginPath();
      ctx.arc(fx(0.91), fy(0.57), 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f7c948';
      ctx.beginPath();
      ctx.arc(fx(0.91), fy(0.57), 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wall clock, same in both pictures.
    ctx.fillStyle = '#f2e8d5';
    ctx.beginPath();
    ctx.arc(fx(0.08), fy(0.42), 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx(0.08), fy(0.42));
    ctx.lineTo(fx(0.08), fy(0.42) - 14);
    ctx.moveTo(fx(0.08), fy(0.42));
    ctx.lineTo(fx(0.08) + 10, fy(0.42));
    ctx.stroke();
  },
};

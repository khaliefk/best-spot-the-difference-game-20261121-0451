// Everything the player sees, drawn on one canvas: the two pictures, the
// markers on found differences, the counter, the timer, the lives, and the
// menu and end screens. Nothing here changes state; it only reads it.
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DIFFERENCES_PER_LEVEL,
  LEVEL_NAMES,
  LEVEL_INTROS,
  PANEL,
} from './config.js';
import { differencePoint, sceneAt } from './scenes.js';
import {
  SCREEN_GAME_OVER,
  SCREEN_LEVEL_DONE,
  SCREEN_MENU,
  SCREEN_PLAY,
  SCREEN_WIN,
} from './state.js';

const INK = '#f5efe0';
const MUTED = '#cfc4ae';
const ACCENT = '#f7c948';
const GREEN = '#7ed957';
const RED = '#e85d5d';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHeart(ctx, x, y, size, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 16, size / 16);
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-9, -3, -6, -11, 0, -5);
  ctx.bezierCurveTo(6, -11, 9, -3, 0, 5);
  ctx.closePath();
  ctx.fillStyle = filled ? '#e85d5d' : 'rgba(245, 239, 224, 0.25)';
  ctx.fill();
  ctx.restore();
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

/** Draw one picture panel, with markers for every found difference. */
function drawPanel(ctx, scene, changed, state, originX, mouse) {
  const { width, height, y } = PANEL;
  ctx.save();
  ctx.beginPath();
  ctx.rect(originX, y, width, height);
  ctx.clip();
  ctx.translate(originX, y);
  scene.draw(ctx, width, height, changed);
  ctx.restore();

  // Frame.
  ctx.strokeStyle = '#2a2118';
  ctx.lineWidth = 4;
  ctx.strokeRect(originX, y, width, height);

  // Markers on the differences already found.
  state.found.forEach((id, order) => {
    const difference = scene.differences.find((d) => d.id === id);
    if (!difference) return;
    const point = differencePoint(difference, width, height);
    const cx = originX + point.x;
    const cy = y + point.y;
    const pulse = 1 + 0.08 * Math.sin(state.levelTime * 4 + order);
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, difference.r * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy);
    ctx.lineTo(cx - 2, cy + 8);
    ctx.lineTo(cx + 11, cy - 8);
    ctx.stroke();
  });

  // The hint pulses a ring around one difference not found yet.
  if (state.hintId !== null) {
    const difference = scene.differences.find((d) => d.id === state.hintId);
    if (difference) {
      const point = differencePoint(difference, width, height);
      const cx = originX + point.x;
      const cy = y + point.y;
      const glow = 0.5 + 0.5 * Math.sin(state.levelTime * 8);
      ctx.strokeStyle = `rgba(247, 201, 72, ${0.55 + 0.45 * glow})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, difference.r + 6 + 4 * glow, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Hover ring, so the player always knows where the cursor is looking.
  if (mouse && mouse.panelX === originX) {
    ctx.strokeStyle = 'rgba(245, 239, 224, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTopBar(ctx, state, scene) {
  ctx.fillStyle = '#241f2e';
  ctx.fillRect(0, 0, CANVAS_WIDTH, 64);
  ctx.fillStyle = ACCENT;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPOT THE DIFFERENCE', 24, 32);

  if (state.screen === SCREEN_PLAY || state.screen === SCREEN_LEVEL_DONE || state.screen === SCREEN_WIN) {
    // The counter of how many remain: the one number the player watches.
    ctx.textAlign = 'center';
    ctx.fillStyle = INK;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText(`FOUND ${state.found.length} / ${DIFFERENCES_PER_LEVEL}`, CANVAS_WIDTH / 2, 30);
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = state.found.length === DIFFERENCES_PER_LEVEL ? GREEN : MUTED;
    ctx.fillText(
      state.found.length === DIFFERENCES_PER_LEVEL
        ? 'all found'
        : `${DIFFERENCES_PER_LEVEL - state.found.length} still hiding`,
      CANVAS_WIDTH / 2,
      52,
    );

    // Timer.
    ctx.textAlign = 'right';
    ctx.fillStyle = state.timeLeft <= 30 ? RED : INK;
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(formatTime(state.timeLeft), CANVAS_WIDTH - 24, 26);
    const barWidth = 150;
    const fraction = Math.max(0, state.timeLeft / 180);
    ctx.fillStyle = 'rgba(245, 239, 224, 0.2)';
    ctx.fillRect(CANVAS_WIDTH - 24 - barWidth, 44, barWidth, 8);
    ctx.fillStyle = state.timeLeft <= 30 ? RED : ACCENT;
    ctx.fillRect(CANVAS_WIDTH - 24 - barWidth, 44, barWidth * fraction, 8);

    // Lives.
    for (let i = 0; i < 3; i += 1) drawHeart(ctx, CANVAS_WIDTH - 220 - i * 30, 30, 22, i < state.lives);
    ctx.fillStyle = MUTED;
    ctx.font = '15px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`hints ${state.hintsLeft}  (H)`, CANVAS_WIDTH - 320, 32);
  } else {
    ctx.textAlign = 'right';
    ctx.fillStyle = MUTED;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('three scenes  •  seven differences each', CANVAS_WIDTH - 24, 32);
  }
}

function drawBottomBar(ctx, state) {
  ctx.fillStyle = '#241f2e';
  ctx.fillRect(0, 570, CANVAS_WIDTH, 150);
  const scene = sceneAt(state.levelIndex);
  ctx.fillStyle = INK;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(scene.name, 24, 600);
  ctx.fillStyle = MUTED;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(LEVEL_INTROS[state.levelIndex], 24, 628);

  // Level dots.
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i === state.levelIndex ? ACCENT : 'rgba(245, 239, 224, 0.3)';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2 - 30 + i * 30, 600, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = ACCENT;
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(`SCORE ${state.score}`, CANVAS_WIDTH - 24, 600);
  ctx.fillStyle = MUTED;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('click a difference  •  H hint  •  R restart  •  M sound  •  Esc menu', CANVAS_WIDTH - 24, 628);
  ctx.textAlign = 'center';
  ctx.fillText('wrong clicks cost a life and 5 seconds', CANVAS_WIDTH / 2, 660);
}

function drawWrongFlash(ctx, state) {
  const mark = state.wrongMark;
  if (!mark) return;
  const age = state.levelTime - mark.at;
  if (age > 0.7) return;
  const alpha = 1 - age / 0.7;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const x = mark.panel === 'right' ? PANEL.rightX + mark.x : PANEL.leftX + mark.x;
  const y = PANEL.y + mark.y;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}

function dimOverlay(ctx) {
  ctx.fillStyle = 'rgba(20, 16, 28, 0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function overlayCard(ctx, title, lines, accent) {
  const cardW = 640;
  const cardH = 300;
  const x = (CANVAS_WIDTH - cardW) / 2;
  const y = (CANVAS_HEIGHT - cardH) / 2;
  ctx.fillStyle = '#2e2838';
  roundRect(ctx, x, y, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  roundRect(ctx, x, y, cardW, cardH, 16);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent;
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.fillText(title, CANVAS_WIDTH / 2, y + 58);
  ctx.fillStyle = INK;
  ctx.font = '20px system-ui, sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, CANVAS_WIDTH / 2, y + 118 + i * 36));
}

function drawMenu(ctx, state) {
  ctx.fillStyle = '#241f2e';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // A faint pair of sample pictures behind the title: the attic, twice.
  const scene = sceneAt(0);
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.beginPath();
  ctx.rect(0, 120, CANVAS_WIDTH, 470);
  ctx.clip();
  scene.draw(ctx, CANVAS_WIDTH, 470, new Set());
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = ACCENT;
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.fillText('SPOT THE DIFFERENCE', CANVAS_WIDTH / 2, 150);
  ctx.fillStyle = INK;
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillText('Three quiet places. Seven changes in each. Find them all.', CANVAS_WIDTH / 2, 205);

  // Level cards.
  LEVEL_NAMES.forEach((name, i) => {
    const cardW = 340;
    const cardH = 150;
    const cx = CANVAS_WIDTH / 2 + (i - 1) * (cardW + 24);
    const cy = 300;
    ctx.fillStyle = i === state.levelIndex ? '#3a3247' : '#2e2838';
    roundRect(ctx, cx - cardW / 2, cy, cardW, cardH, 14);
    ctx.fill();
    ctx.strokeStyle = i === state.levelIndex ? ACCENT : '#4a4258';
    ctx.lineWidth = 2;
    roundRect(ctx, cx - cardW / 2, cy, cardW, cardH, 14);
    ctx.stroke();
    ctx.fillStyle = ACCENT;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`LEVEL ${i + 1}`, cx, cy + 30);
    ctx.fillStyle = INK;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(name, cx, cy + 66);
    ctx.fillStyle = MUTED;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('7 differences', cx, cy + 100);
  });

  ctx.fillStyle = INK;
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText('Click a difference in either picture. A wrong click costs a life.', CANVAS_WIDTH / 2, 520);
  ctx.fillStyle = MUTED;
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText('Keys: 1 2 3 pick a level  •  H hint  •  R restart  •  M sound  •  Enter play', CANVAS_WIDTH / 2, 552);
  ctx.fillText('Click a level card, or press Enter to start at level 1.', CANVAS_WIDTH / 2, 580);
}

/** Draw one full frame for the current state. */
export function drawFrame(ctx, state, mouse) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (state.screen === SCREEN_MENU) {
    drawMenu(ctx, state);
    return;
  }

  const scene = sceneAt(state.levelIndex);
  drawTopBar(ctx, state, scene);

  // Left picture: the original. Right picture: every difference applied.
  const allChanged = new Set(scene.differences.map((d) => d.id));
  drawPanel(ctx, scene, new Set(), state, PANEL.leftX, mouse);
  drawPanel(ctx, scene, allChanged, state, PANEL.rightX, mouse);
  ctx.fillStyle = MUTED;
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ORIGINAL', PANEL.leftX + PANEL.width / 2, PANEL.y - 12);
  ctx.fillText('CHANGED', PANEL.rightX + PANEL.width / 2, PANEL.y - 12);
  drawWrongFlash(ctx, state);
  drawBottomBar(ctx, state);

  if (state.screen === SCREEN_LEVEL_DONE) {
    dimOverlay(ctx);
    overlayCard(
      ctx,
      'Level clear!',
      [
        `You found all 7 differences in ${scene.name}.`,
        `Time bonus +${state.levelBonus} points.`,
        'Press Enter for the next scene.',
      ],
      GREEN,
    );
  } else if (state.screen === SCREEN_WIN) {
    dimOverlay(ctx);
    overlayCard(
      ctx,
      'You found them all!',
      [
        'All three scenes, all 21 differences.',
        `Final score: ${state.score}.`,
        'Press Enter to play again from the menu.',
      ],
      ACCENT,
    );
  } else if (state.screen === SCREEN_GAME_OVER) {
    dimOverlay(ctx);
    const reason = state.lives <= 0 ? 'Out of lives.' : 'Out of time.';
    overlayCard(
      ctx,
      'Game over',
      [
        reason,
        `You found ${state.found.length} of 7 differences in ${scene.name}.`,
        'Press R to try this scene again, or Esc for the menu.',
      ],
      RED,
    );
  }
}

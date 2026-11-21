// Mouse and keyboard input. A click on either picture is mapped back to
// panel coordinates and tested against the differences; keys drive the hint,
// restart, level pick and mute.
import { CANVAS_HEIGHT, CANVAS_WIDTH, CLICK_RADIUS, PANEL } from './config.js';
import { differencePoint, sceneAt } from './scenes.js';
import {
  SCREEN_GAME_OVER,
  SCREEN_LEVEL_DONE,
  SCREEN_MENU,
  SCREEN_PLAY,
  SCREEN_WIN,
  registerFind,
  registerWrongClick,
  startLevel,
  toMenu,
  useHint,
} from './state.js';
import { isMuted, playFound, playHint, playLevelClear, playWrong, toggleMuted } from './audio.js';

function panelAt(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
    return { panel: 'left', panelX: PANEL.leftX, x: x - PANEL.leftX, y: y - PANEL.y };
  }
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
    return { panel: 'right', panelX: PANEL.rightX, x: x - PANEL.rightX, y: y - PANEL.y };
  }
  return null;
}

function nearestDifference(scene, x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const difference of scene.differences) {
    const point = differencePoint(difference, PANEL.width, PANEL.height);
    const distance = Math.hypot(point.x - x, point.y - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = difference;
    }
  }
  return bestDistance <= CLICK_RADIUS ? best : null;
}

export function attachInput(canvas, state) {
  const mouse = { x: 0, y: 0, panelX: null };

  canvas.addEventListener('pointermove', (event) => {
    const hit = panelAt(canvas, event.clientX, event.clientY);
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    mouse.y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    mouse.panelX = hit ? hit.panelX : null;
  });

  canvas.addEventListener('pointerleave', () => {
    mouse.panelX = null;
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (state.screen === SCREEN_MENU) {
      // A click on a level card starts that level.
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
      if (y >= 300 && y <= 450) {
        const index = Math.floor((x - CANVAS_WIDTH / 2 + 3 * 182) / 364);
        if (index >= 0 && index <= 2) startLevel(state, index);
      }
      return;
    }
    if (state.screen !== SCREEN_PLAY) return;
    const hit = panelAt(canvas, event.clientX, event.clientY);
    if (!hit) return;
    const scene = sceneAt(state.levelIndex);
    const difference = nearestDifference(scene, hit.x, hit.y);
    if (difference && !state.found.includes(difference.id)) {
      registerFind(state, difference, hit.panel, hit.x, hit.y);
      if (state.screen === SCREEN_LEVEL_DONE) playLevelClear();
      else if (state.screen === SCREEN_WIN) playLevelClear();
      else playFound();
    } else if (difference) {
      // Clicking a difference already found: nothing happens.
    } else {
      registerWrongClick(state, hit.panel, hit.x, hit.y);
      playWrong();
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'm') {
      toggleMuted();
      return;
    }
    if (key === 'escape') {
      if (state.screen !== SCREEN_MENU) toMenu(state);
      return;
    }
    if (state.screen === SCREEN_MENU) {
      if (key === 'enter' || key === ' ') startLevel(state, state.levelIndex);
      if (key === '1' || key === '2' || key === '3') startLevel(state, Number(key) - 1);
      if (key === 'arrowleft') state.levelIndex = (state.levelIndex + 2) % 3;
      if (key === 'arrowright') state.levelIndex = (state.levelIndex + 1) % 3;
      return;
    }
    if (key === 'h') {
      const scene = sceneAt(state.levelIndex);
      if (useHint(state, scene) !== null) playHint();
      return;
    }
    if (key === 'r') {
      startLevel(state, state.levelIndex);
      return;
    }
    if (key === 'enter' || key === ' ') {
      if (state.screen === SCREEN_LEVEL_DONE) startLevel(state, state.levelIndex + 1);
      else if (state.screen === SCREEN_WIN || state.screen === SCREEN_GAME_OVER) toMenu(state);
    }
    if ((key === '1' || key === '2' || key === '3') && state.screen !== SCREEN_PLAY) {
      startLevel(state, Number(key) - 1);
    }
  });

  return { mouse, isMuted };
}

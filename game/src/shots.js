// The staged scenes behind ?shot=cover|garden|harbour|win. Each one plays the
// real rules forward from a fresh level and stops mid-game, so the frame is
// what a real player sees: some differences found and circled, several still
// unfound, and the counter showing how many remain. The same seed always
// gives the same frame.
import { SCREEN_LEVEL_DONE, startLevel } from './state.js';
import { sceneAt } from './scenes.js';
import { PANEL } from './config.js';
import { differencePoint } from './scenes.js';

/** Click the centre of a difference, the way a player would. */
function findByIndex(state, index) {
  const scene = sceneAt(state.levelIndex);
  const difference = scene.differences[index];
  if (!difference || state.found.includes(difference.id)) return;
  const point = differencePoint(difference, PANEL.width, PANEL.height);
  state.found.push(difference.id);
  state.score += 100;
  state.foundMark = { x: point.x, y: point.y, panel: 'left', at: state.levelTime };
}

export function stageShot(name, state) {
  const shots = {
    // Cover: the attic, 3 of 7 found, 4 still hiding, timer running.
    cover: { level: 0, found: [0, 2, 4], timeLeft: 132, lives: 3, hintsLeft: 2 },
    // Second scene, 2 found.
    garden: { level: 1, found: [1, 5], timeLeft: 104, lives: 3, hintsLeft: 3 },
    // Third scene, 1 found, one life already lost.
    harbour: { level: 2, found: [3], timeLeft: 87, lives: 2, hintsLeft: 1 },
    // Every difference found: the level-clear card over circled pictures.
    win: { level: 0, found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 61, lives: 3, hintsLeft: 2 },
  };
  const shot = shots[name] ?? shots.cover;
  startLevel(state, shot.level);
  state.timeLeft = shot.timeLeft;
  state.lives = shot.lives;
  state.hintsLeft = shot.hintsLeft;
  state.levelTime = 12;
  shot.found.forEach((index) => findByIndex(state, index));
  if (name === 'win') {
    state.levelBonus = 500 + Math.round(state.timeLeft);
    state.score += state.levelBonus;
    state.screen = SCREEN_LEVEL_DONE;
  }
  return state.screen;
}

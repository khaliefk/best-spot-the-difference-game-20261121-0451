// The game's state: which screen shows, which level is open, what the player
// has found, and the clock. Rendering and input read this object; they never
// keep their own copy of it.
import {
  DIFFERENCES_PER_LEVEL,
  HINTS_PER_LEVEL,
  HINT_PULSE_SECONDS,
  HINT_TIME_COST,
  LEVEL_CLEAR_BONUS,
  LEVEL_TIME_SECONDS,
  POINTS_PER_FIND,
  START_LIVES,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';

export const SCREEN_MENU = 'menu';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'levelDone';
export const SCREEN_WIN = 'win';
export const SCREEN_GAME_OVER = 'gameOver';

export function createState() {
  return {
    screen: SCREEN_MENU,
    levelIndex: 0,
    // ids of the differences already found in this level, in find order
    found: [],
    // id of the difference the hint is pulsing, or null
    hintId: null,
    hintEndsAt: 0,
    hintsLeft: HINTS_PER_LEVEL,
    lives: START_LIVES,
    timeLeft: LEVEL_TIME_SECONDS[0],
    score: 0,
    levelBonus: 0,
    // seconds since the level started, for marker pulse animation
    levelTime: 0,
    // last wrong click, for the red flash: { x, y, panel, at }
    wrongMark: null,
    // last found click, for the ring burst: { x, y, panel, at }
    foundMark: null,
    message: '',
  };
}

export function startLevel(state, levelIndex) {
  state.screen = SCREEN_PLAY;
  state.levelIndex = levelIndex;
  state.found = [];
  state.hintId = null;
  state.hintEndsAt = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.lives = START_LIVES;
  state.timeLeft = LEVEL_TIME_SECONDS[levelIndex];
  state.levelBonus = 0;
  state.levelTime = 0;
  state.wrongMark = null;
  state.foundMark = null;
  state.message = '';
}

export function toMenu(state) {
  state.screen = SCREEN_MENU;
  state.found = [];
  state.hintId = null;
  state.message = '';
}

/** The difference ids in this level the player has not found yet. */
export function unfoundIds(state, scene) {
  return scene.differences.filter((d) => !state.found.includes(d.id)).map((d) => d.id);
}

export function foundCount(state) {
  return state.found.length;
}

export function isLevelComplete(state) {
  return state.found.length >= DIFFERENCES_PER_LEVEL;
}

/**
 * Register a click on a difference. Returns the difference, or null when the
 * click already found it. The caller checks the radius first.
 */
export function registerFind(state, difference, panel, x, y) {
  if (state.found.includes(difference.id)) return null;
  state.found.push(difference.id);
  state.score += POINTS_PER_FIND;
  state.foundMark = { x, y, panel, at: state.levelTime };
  if (isLevelComplete(state)) {
    state.levelBonus = LEVEL_CLEAR_BONUS + Math.round(state.timeLeft);
    state.score += state.levelBonus;
    state.screen = state.levelIndex >= 2 ? SCREEN_WIN : SCREEN_LEVEL_DONE;
  }
  return difference;
}

export function registerWrongClick(state, panel, x, y) {
  state.lives -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_TIME_PENALTY);
  state.wrongMark = { x, y, panel, at: state.levelTime };
  if (state.lives <= 0 || state.timeLeft <= 0) {
    state.screen = SCREEN_GAME_OVER;
  }
}

/** Spend one hint on the first unfound difference. Returns its id, or null. */
export function useHint(state, scene) {
  if (state.hintsLeft <= 0 || state.screen !== SCREEN_PLAY) return null;
  const remaining = unfoundIds(state, scene);
  if (remaining.length === 0) return null;
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_TIME_COST);
  state.hintId = remaining[0];
  state.hintEndsAt = state.levelTime + HINT_PULSE_SECONDS;
  if (state.timeLeft <= 0) state.screen = SCREEN_GAME_OVER;
  return state.hintId;
}

/** Advance the clock by dt seconds; the timer only runs while playing. */
export function tick(state, dt) {
  if (state.screen !== SCREEN_PLAY) return;
  state.levelTime += dt;
  state.timeLeft = Math.max(0, state.timeLeft - dt);
  if (state.hintId !== null && state.levelTime >= state.hintEndsAt) state.hintId = null;
  if (state.timeLeft <= 0) state.screen = SCREEN_GAME_OVER;
}

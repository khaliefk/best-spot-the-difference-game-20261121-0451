// Shared numbers for Spot the Difference: three quiet places.
// One place to change a size, a time or a score and have the whole game follow.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

// The two pictures sit side by side inside these boxes.
export const PANEL = {
  width: 600,
  height: 470,
  leftX: 24,
  rightX: 656,
  y: 84,
};

export const DIFFERENCES_PER_LEVEL = 7;
export const LEVEL_TIME_SECONDS = [180, 150, 120];
export const START_LIVES = 3;
export const HINTS_PER_LEVEL = 3;
export const WRONG_CLICK_TIME_PENALTY = 5;
export const HINT_TIME_COST = 10;
export const POINTS_PER_FIND = 100;
export const LEVEL_CLEAR_BONUS = 500;
export const HINT_PULSE_SECONDS = 2.5;

// A click counts as a find when it lands this close (panel pixels) to a difference.
export const CLICK_RADIUS = 34;

export const LEVEL_NAMES = [
  'The Attic at Dusk',
  'The Garden at Noon',
  'The Old Harbour',
];

export const LEVEL_INTROS = [
  'Seven things changed while the lamp was lit. Find them all.',
  'Seven things changed under the noon sun. Find them all.',
  'Seven things changed while the tide came in. Find them all.',
];

// The three scenes in play order, easiest first. Each scene carries its own
// art module, its differences and its draw function; the rest of the game
// only ever talks to this list.
import { atticScene } from './scene-attic.js';
import { gardenScene } from './scene-garden.js';
import { harbourScene } from './scene-harbour.js';

export const SCENES = [atticScene, gardenScene, harbourScene];

export function sceneAt(index) {
  return SCENES[index] ?? SCENES[0];
}

/** A difference's centre in panel pixels, from its fractional position. */
export function differencePoint(difference, panelWidth, panelHeight) {
  return { x: difference.x * panelWidth, y: difference.y * panelHeight };
}

// Bootstrap: one canvas, one state, one animation loop. With ?shot= in the
// URL the game stages a fixed scene and draws a single frame, which is how
// the screenshots are taken; without it the game plays normally.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { createState, tick } from './state.js';
import { drawFrame } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const state = createState();
const { mouse } = attachInput(canvas, state);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, state);
  drawFrame(ctx, state, null);
} else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    tick(state, dt);
    drawFrame(ctx, state, mouse);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

# Spot the Difference: Three Quiet Places

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/khaliefk/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/khaliefk/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A spot the difference game that plays offline in a desktop browser. Three hand-drawn scenes, an attic at dusk, a garden at noon, and an old harbour, each hiding seven differences between two pictures side by side. Click a difference in either picture to mark it. A wrong click costs a life and five seconds. Hints, a timer, and a score carry across the three scenes.

## Run

Open `game/index.html` in a desktop browser, or serve the folder and open it:

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network, no dependencies. Node 22 or later for the hand-in program.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `game/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## Play

- Click a difference in either picture to circle it on both.
- `H` spends a hint and pulses one difference you have not found yet.
- `R` restarts the scene. `1`, `2`, `3` pick a scene. `M` mutes the sounds. `Esc` returns to the menu.

## License

MIT. See [LICENSE](LICENSE).

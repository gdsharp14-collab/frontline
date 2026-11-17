# Work in progress for v0.5.0 (map-making)

Not part of the live game. This branch holds the development copy of the game engine and the test tools.

- `engine-dev.js` — game rules plus the new map generator (layout styles, sea lanes, long routes) and computer player v2.
- `tests/` — rule tests (`t_rules.js`, `t_sea.js`), v2-vs-v1 head-to-head (`duel.js`), v2 mirror games (`mirror.js`). Run with `node tests/<file>.js`.
- `mapgen/` — sample-map drawing (`draw.js <seed> <style> <outfile> [direct|island]`) and generator statistics.

When v0.5.0 is built, the engine changes go into `index.html` on `main` and this folder is updated or removed.

## Map simulations (step 3)
- `sim/sim.js <worker> <workers> <games> <maps-per-type> [types]` plays computer-v2 games on candidate maps and writes one result line per map.
- `sim/analyze.js` and `sim/shortlist.js` score balance (how far the best and worst seats are from winning a third of the time) and pick the shortlist.
- `sim/results/` holds the Nov 16 run: 179 maps × 200 games. `sim/shortlist/` holds the shortlist and its pictures.
- Each map is fully described by its type, long-route method and seed (see `shortlist.json`); the generator rebuilds it exactly from those.

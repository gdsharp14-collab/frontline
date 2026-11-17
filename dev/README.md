# Work in progress for v0.5.0 (map-making)

Not part of the live game. This branch holds the development copy of the game engine and the test tools.

- `engine-dev.js` — game rules plus the new map generator (layout styles, sea lanes, long routes) and computer player v2.
- `tests/` — rule tests (`t_rules.js`, `t_sea.js`), v2-vs-v1 head-to-head (`duel.js`), v2 mirror games (`mirror.js`). Run with `node tests/<file>.js`.
- `mapgen/` — sample-map drawing (`draw.js <seed> <style> <outfile> [direct|island]`) and generator statistics.

When v0.5.0 is built, the engine changes go into `index.html` on `main` and this folder is updated or removed.

# Warsea Conquest — Changelog

*Last updated: November 18, 2026 (v0.5.0 released)*

## Waiting for next build
Agreed changes go here until I say "build". Each one is cleared once it's built.

### Fog of war (agreed Nov 18, planned as v0.6.0)
- **Display-only fog.** The game doesn't draw what you shouldn't see. The full game is still downloaded to every phone, so someone technical could dig it out; that's accepted for now. True server-side secrecy (Firebase Cloud Functions, needs the Blaze plan) stays a possible later upgrade.
- **What you can see:** every hex you own, every hex next to your land, and every hex within 2 hexes of any of your armies (including armies on sea lanes).
- **Map and ownership stay visible** everywhere. Hexes you can't currently see are shaded darker so you can tell them apart.
- **Hidden in fog:** enemy armies, other players' money, recruits (unless placed on a capital you can see), and battles between other factions out of your sight. Your own battles are always shown. The replay and war log only show what you saw. Other players' army totals show "?".
- **Last-seen markers:** if an enemy army was on a hex and you lose sight of that hex, a faded marker with the size you last saw stays there for one turn, then disappears. No marker is left if you saw the army move away, and an army that moves from a hex you can see into fog leaves no marker anywhere.
- **Moving into fog:** no new rule. Entering a hex with enemy armies still ends your move and starts a battle.
- **Computer player** only sees what a human in its seat would see, using the same last-seen rules.

## Versions
Newest first. "GitHub" is the saved version on GitHub; the live game always shows the newest one there.

| Version | Date | What changed | GitHub |
|---|---|---|---|
| **v0.5.0** | Nov 18, 2026 | **Map-making.** Sea lanes (cross freely, never owned, meeting battles at sea). Three named maps chosen for balance from 179 candidates × 200 computer games: **Symmetric**, **Archipelago** and **Continental**; plus 🎲 Random maps in seven styles. Computer player v2. See details below | `34acfd1` ← **live now** |
| **v0.4.0** ✓ | Nov 12, 2026 | **Milestone: first confirmed playable version** (played Nov 14). **Simplified, Risk-style rules.** One army type with Risk dice battles (3 rounds per turn; defended, meeting, border and three-way battles; retreats). No terrain. Money only ($1 per hex, $2 per capital, $5 own capital; armies $10, recruited at any capital). No supply lines, no ports, no order limit (every army can move; up to 3 hexes through own land, entering new land ends the move). 10 starting armies placed in the home country. New maps: inland lakes, mountain clumps, equal starting land, small countries as a buffer. New order screen (army counters, gold outlines, Next ▶, splitting). See details below | `5a73f91` |
| v0.3.1 | Nov 1, 2026 | Hit points ×4 so battles last longer | Never released; replaced by v0.4.0 |
| v0.3.0 | Nov 1, 2026 | **Stage 3, economy:** four currencies, factories and resource hexes, supply paths over land and between ports, building units, computer players that build | `031a6b9` |
| v0.2.0 | Nov 1, 2026 | **Stage 2, combat:** contact, battles across steps, strength and hit points, terrain bonuses, retreat, head-on collisions, HP bars, battle replays | `d08e2a7` |
| v0.1.2 | Nov 1, 2026 | 6 neutral countries; computer opponents for solo testing | `889588a`, re-uploaded as `4f18d8b` |
| v0.1.1 | Nov 1, 2026 | Stage 1 update (exact changes not recorded) | `e34c7b6` |
| v0.1.0 | Nov 1, 2026 | **Stage 1, map and movement:** random hex map, terrain, simultaneous orders, replay, hex control, encirclement, capital capture, 50 turns. Renamed to Warsea Conquest | `3cda967` |
| v0.0 | Oct 31, 2026 | "Frontline", the original Risk-style prototype with online play | `27b0fa1` |

## v0.5.0 details
**Named maps (my choice, Nov 18):** shortlist maps #4, #5 and #6, named **Symmetric**, **Archipelago** and **Continental**.
- Symmetric: Red 35% · Blue 35% · Green 30% wins over 200 computer games, but only 0.04 eliminations per game, so games are usually decided by land after turn 50.
- Archipelago: 35% · 29% · 36%. **Note:** the shortlist picture of this map wrongly showed long routes round the outside; the tested (and built) map doesn't have them. The pictured version came out less fair in 200 games (41% · 31% · 28%), so the tested version was built. Swapping is a one-line change.
- Continental: 35% · 29% · 37% (it was "Classic" style in the shortlist).

**Agreed design (Nov 16):**
**Sea lanes**
- Maps can be split into separate continents or islands, linked by **sea lanes**: specific chains of ocean hexes. The rest of the ocean stays impassable.
- **Moving:** sea-lane hexes don't stop movement. Armies cross them freely within the usual 3 hexes and stop only if they meet enemy armies. Landing on land you don't own still ends the move.
- **Never owned:** sea-lane hexes stay neutral and never count for income or victory.
- *Claude's suggestions, not objected to:* battles in a sea-lane hex are meeting battles (3 dice each, a tie costs both); armies may stay in a sea-lane hex to block it; sea lanes count as walls for encirclement. On the map, sea lanes are lighter blue with a dotted route.

**Layout styles** (sample maps reviewed Nov 16)
- **Classic** (as now), **Continents** (each faction on its own continent around a central neutral continent), **Archipelago** (every country its own island) and **Inland Sea** (land around a big central sea; kept as one option among the others, not a favourite). Continents and Archipelago use a larger grid.
- **Sea-lane routes prefer open water**, crossing seas rather than hugging coasts.
- **Varied lane lengths:** the shortest crossings join every landmass, plus a few longer lanes; lengths range from 1 to about 15 hexes. Lanes longer than 3 hexes take more than one turn to cross, so armies end their turn at sea.
- **Inland Sea:** a hub in the middle of the sea is joined by sea lanes to 6 landing points spread round the shore, so every landing point connects to every other.
- **Long-range routes round the outside of the map** between factions: **either all three pairs of factions get one, or none do**, for balance. Two methods, both kept for testing in the simulations:
  - **Method A, islands halfway:** a small neutral island (3–6 hexes, with its own $2 capital) out at sea, with a lane to it from each of the two factions.
  - **Method B, direct long lanes:** one long lane (5–15 hexes) straight from one faction's land to the other's. The only exception to "home countries never border an enemy"; the length is the barrier.
- **Mixing styles is fine:** e.g. half the map like Continents and half like Archipelago, or long routes round the outside added to Inland Sea maps.

**Balanced named maps**
- Pick **5 (or 6) named maps** that are fairly balanced between the three positions, chosen with a simulation tool: generate a few hundred candidate maps, play each many times with computer players, keep the ones where each position wins close to a third of the time, and I pick my favourites.
- **2 of the 5 can be three-way symmetrical**, if testing shows they're balanced enough.
- **Random maps stay** as an option alongside the named maps.
- **Order of work:** (1) sea lanes and layout styles, with sample maps to review; (2) a modest computer-player upgrade (using sea lanes, holding chokepoints, gathering bigger attacks), tested by playing the new bot against the old one; (3) the simulation tool and map selection.

**How it was made:**
Work in progress is saved on the GitHub branch **`v0.5-dev`** (folder `dev/`), separate from the live game.
- **Step 1 done (Nov 16):** sea lanes and layout styles in a development copy of the map generator; sample maps reviewed.
- **Step 2 done (Nov 16): computer player v2.** It plans each turn as a whole: it estimates where enemy armies could strike next turn, keeps enough armies on its capitals, pools armies from several stacks for attacks it expects to win, grabs land with single armies, crosses sea lanes, and marches spare armies toward the front over several turns.
  - **Against two copies of the old player:** v2 won **59%** of 150 games across five map styles (33% would mean no better), and lost its capital in only 2 of them.
  - **Three v2 players against each other:** games are decisive, with about one elimination per game and the winner holding 75–93% of the land at the end.
- **Claude's decision while building the sea-lane rules:** armies in a battle may also **retreat into an empty sea-lane hex** next to them, not only into their own land.
- **Step 3 (Nov 16): map simulations.** Added two more map types: **three-way symmetrical** (Symmetric, Symmetric Isles) and **Mixed** (some factions on one continent, others spread over islands). Played **200 computer-v2 games on each of 179 candidate maps** (about 36,000 games).
  - **Fixing the measurement:** a first run showed even symmetrical maps (three identical positions) coming out as unfair as 9% / 86% / 6%. The cause was the computer player always breaking ties the same way, which favours one seat on a given map. Claude made it vary its choices from game to game; after that, symmetrical maps came out at **34% / 33% / 33%** overall, with typical gaps of 4–6% per map (normal luck for 200 games). All results below use the corrected method.
  - **Finding: random maps are usually unfair.** On a typical random map, one position wins about two thirds of the games (median gap from a third: about 33%). Only a few random maps per style came out within 8%. Symmetrical maps were fair almost every time (24 of 28).
  - **Shortlist:** the 11 most balanced maps, with pictures, are saved on the `v0.5-dev` branch in `dev/sim/shortlist/`. Caveat: balance is measured with computer players; people may find advantages they don't.

**Testing:** 17 rule checks and 8 sea-lane checks (all pass); 10 computer-only games on each named map; in the browser, the map picker, a sea-lane crossing, the replay and help screens, a v0.4.0 game still opening, and a 9-turn friends game on three simulated phones. Not yet played on real phones.

**Development files** (simulation tool, results, sample-map tools) stay on the GitHub branch `v0.5-dev` for future map work.

## v0.4.0 details
**Decisions Claude made while building** (tell me if any should change):
- Placement is a separate step before turn 1. Armies not placed go on the ★ capital.
- Everyone starts with $0; the first income arrives at the end of turn 1.
- Movement plays out step by step: every moving army takes its first hex at the same time, then its second, then its third. (The old "orders play out in the order entered" rule is gone.)
- An army also stops when it enters a hex with enemy armies, even one you own.
- A retreat must go to an adjacent hex you owned at the start of the turn, with no enemy armies in it.
- New armies appear on a capital you still hold at the end of the turn, even if enemy armies are in that hex (they join the battle).
- A captured enemy ★ capital is worth $2 to its new owner.
- Old saved games (v0.3.x) can't be opened; start a new game.
- The computer player was rewritten for the new rules.

**Testing:** 17 rule checks with rigged dice (ties, meeting and border battles, three-way battles, movement limits, splitting, retreats, income, recruiting, encirclement, elimination, placement); 40+ computer-only games to the end; a game against the computer and an 8-turn friends game on three simulated phones (all three phones ended with the same game). **Nov 14: played by me on the live site; it plays well and follows all the agreed rules.**

## Docs history
- **Nov 18, 2026:** v0.5.0 released; game rules updated for maps, sea lanes and computer player v2; project outline updated.
- **Nov 14, 2026:** v0.4.0 recorded as the first milestone. Added "Progress so far", "Key decisions so far, and why" and "Open questions for future stages" to the project outline.
- **Nov 12, 2026:** reorganized into 3 docs (project outline, game rules, changelog). They replace `warsea-conquest-context.md` and both copies of `warsea-conquest-design-draft.md` (v1–v6.1). The older copies' differing hit-point numbers were resolved to what the game actually uses.
- **Nov 1, 2026:** design drafts v1–v6.1. v1 collected my ideas; v2–v3 added my answers to Claude's questions; v4–v6.1 recorded each stage as it was built.

# Warsea Conquest — Changelog

*Last updated: November 12, 2026 (v0.4.0 released)*

## Waiting for next build
Agreed changes go here until I say "build". Each one is cleared once it's built.

- *Nothing agreed yet.*

## Versions
Newest first. "GitHub" is the saved version on GitHub; the live game always shows the newest one there.

| Version | Date | What changed | GitHub |
|---|---|---|---|
| **v0.4.0** | Nov 12, 2026 | **Simplified, Risk-style rules.** One army type with Risk dice battles (3 rounds per turn; defended, meeting, border and three-way battles; retreats). No terrain. Money only ($1 per hex, $2 per capital, $5 own capital; armies $10, recruited at any capital). No supply lines, no ports, no order limit (every army can move; up to 3 hexes through own land, entering new land ends the move). 10 starting armies placed in the home country. New maps: inland lakes, mountain clumps, equal starting land, small countries as a buffer. New order screen (army counters, gold outlines, Next ▶, splitting). See details below | `5a73f91` ← **live now** |
| v0.3.1 | Nov 1, 2026 | Hit points ×4 so battles last longer | Never released; replaced by v0.4.0 |
| v0.3.0 | Nov 1, 2026 | **Stage 3, economy:** four currencies, factories and resource hexes, supply paths over land and between ports, building units, computer players that build | `031a6b9` |
| v0.2.0 | Nov 1, 2026 | **Stage 2, combat:** contact, battles across steps, strength and hit points, terrain bonuses, retreat, head-on collisions, HP bars, battle replays | `d08e2a7` |
| v0.1.2 | Nov 1, 2026 | 6 neutral countries; computer opponents for solo testing | `889588a`, re-uploaded as `4f18d8b` |
| v0.1.1 | Nov 1, 2026 | Stage 1 update (exact changes not recorded) | `e34c7b6` |
| v0.1.0 | Nov 1, 2026 | **Stage 1, map and movement:** random hex map, terrain, simultaneous orders, replay, hex control, encirclement, capital capture, 50 turns. Renamed to Warsea Conquest | `3cda967` |
| v0.0 | Oct 31, 2026 | "Frontline", the original Risk-style prototype with online play | `27b0fa1` |

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

**Testing:** 17 rule checks with rigged dice (ties, meeting and border battles, three-way battles, movement limits, splitting, retreats, income, recruiting, encirclement, elimination, placement); 40+ computer-only games to the end; a game against the computer and an 8-turn friends game on three simulated phones (all three phones ended with the same game). Not yet tested on real phones with real Firebase.

## Docs history
- **Nov 12, 2026:** reorganized into 3 docs (project outline, game rules, changelog). They replace `warsea-conquest-context.md` and both copies of `warsea-conquest-design-draft.md` (v1–v6.1). The older copies' differing hit-point numbers were resolved to what the game actually uses.
- **Nov 1, 2026:** design drafts v1–v6.1. v1 collected my ideas; v2–v3 added my answers to Claude's questions; v4–v6.1 recorded each stage as it was built.

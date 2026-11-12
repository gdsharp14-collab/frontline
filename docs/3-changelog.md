# Warsea Conquest — Changelog

*Last updated: November 12, 2026*

## Waiting for next build
Agreed changes go here until I say "build". Each one is cleared once it's built.

### Combat: back to Risk dice (agreed Nov 12, 2026), planned as v0.4.0
- **One army type.** Armour is removed. Units become plain army counts in a hex, like Risk, so hit points, strength and reach go away.
- **No terrain combat bonuses** for now.
- **Move first, then fight.** All movement plays out first. An army that moves into a hex with enemy armies stops there. Then every battle is rolled.
- **Defender:** the faction that held the hex at the start of the turn, if it still has armies there. The defender rolls up to 2 dice and the attacker up to 3, never more dice than armies. Compare the highest dice, then the next highest; the loser of each pair loses 1 army, and the defender wins ties.
- **Meeting battles** (no defender, e.g. two factions entering an empty or neutral hex): both roll up to 3 dice, and ties mean no loss.
- **3 rounds per turn.** If both sides still have armies, the battle carries over to the next turn.
- **Next turn, armies in battle can:** hold (no order, keep fighting), get reinforced (more armies move in), or retreat 1 hex. Retreats happen before that turn's battle rounds.
- **Three-way battles:** every pair of factions rolls against each other each round. The defender rolls up to 2 dice against each attacker; the attackers roll up to 3 dice against the defender and up to 3 against each other (ties between them mean no loss). All losses in a round land at the same time.

## Versions
Newest first. "GitHub" is the saved version on GitHub; the live game always shows the newest one there.

| Version | Date | What changed | GitHub |
|---|---|---|---|
| **v0.3.1** | Nov 1, 2026 | Hit points ×4 (infantry 10→40, armour 12→48) so battles last about 2–4 turns. Saved games are upgraded automatically | **Not uploaded yet** (Project copy only) |
| v0.3.0 | Nov 1, 2026 | **Stage 3, economy:** four currencies, factories and resource hexes, supply paths over land and between ports, building units, computer players that build | `031a6b9` ← **live now** |
| v0.2.0 | Nov 1, 2026 | **Stage 2, combat:** contact, battles across steps, strength and hit points, terrain bonuses, retreat, head-on collisions, HP bars, battle replays | `d08e2a7` |
| v0.1.2 | Nov 1, 2026 | 6 neutral countries; computer opponents for solo testing | `889588a`, re-uploaded as `4f18d8b` |
| v0.1.1 | Nov 1, 2026 | Stage 1 update (exact changes not recorded) | `e34c7b6` |
| v0.1.0 | Nov 1, 2026 | **Stage 1, map and movement:** random hex map, terrain, simultaneous orders, replay, hex control, encirclement, capital capture, 50 turns. Renamed to Warsea Conquest | `3cda967` |
| v0.0 | Oct 31, 2026 | "Frontline", the original Risk-style prototype with online play | `27b0fa1` |

## Docs history
- **Nov 12, 2026:** reorganized into 3 docs (project outline, game rules, changelog). They replace `warsea-conquest-context.md` and both copies of `warsea-conquest-design-draft.md` (v1–v6.1). The older copies' differing hit-point numbers were resolved to what the game actually uses.
- **Nov 1, 2026:** design drafts v1–v6.1. v1 collected my ideas; v2–v3 added my answers to Claude's questions; v4–v6.1 recorded each stage as it was built.

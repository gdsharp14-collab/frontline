# Warsea Conquest — Changelog

*Last updated: November 12, 2026*

## Waiting for next build
Agreed changes go here until I say "build". Each one is cleared once it's built.

### Combat: back to Risk dice (agreed Nov 12, 2026), planned as v0.4.0
**Armies**
- **One army type.** Armour is removed. Units become plain army counts in a hex, like Risk, so hit points, strength and reach go away.
- **Moving:** an army moves up to 3 hexes per turn. You can split a stack and move any number of its armies, as in Risk. Each group you move counts as one of your 3 orders.

**Terrain removed entirely**
- No mountains, swamps or cities: no movement costs, no combat effects and nothing drawn on the map. Every land hex costs 1 to enter.
- Resource and factory hexes are placed without regard to terrain.

**Battles**
- **Move first, then fight.** All movement plays out first. An army that moves into a hex with enemy armies stops there. Then every battle is rolled.
- **Dice:** compare the highest dice, then the next highest. The loser of each pair loses 1 army. Nobody rolls more dice than they have armies.
- **Defended battles:** the faction that held the hex at the start of the turn, if it still has armies there, is the defender. The defender rolls up to 2 dice and the attacker up to 3. **The defender wins ties.**
- **Meeting battles** (no defender, e.g. two factions entering an empty or neutral hex): both roll up to 3 dice. **In a tie, both lose 1 army.**
- **Armies that cross paths** (each moving into the hex the other is leaving, on the same step): they collide, both stop in the hex they started that step from, and fight a meeting battle on the border between them (3 dice each, a tie costs both 1 army).
- **3 rounds per turn.** If both sides still have armies, the battle carries over to the next turn.
- **Next turn, armies in battle can:** hold (no order, keep fighting), get reinforced (more armies move in), or retreat 1 hex. Retreats happen before that turn's battle rounds.
- **Three-way battles:** every pair of factions rolls against each other each round. The defender rolls up to 2 dice against each attacker; the attackers roll up to 3 dice against the defender and up to 3 against each other (between the two attackers, a tie costs both 1 army). All losses in a round land at the same time.

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

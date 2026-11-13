# Warsea Conquest — Changelog

*Last updated: November 12, 2026*

## Waiting for next build
Agreed changes go here until I say "build". Each one is cleared once it's built.

### Combat: back to Risk dice (agreed Nov 12, 2026), planned as v0.4.0
**Armies**
- **One army type.** Armour is removed. Units become plain army counts in a hex, like Risk, so hit points, strength and reach go away.
- **No order limit:** every army can move every turn. An army is everything in one hex and moves together; you can split off any number to move separately, as in Risk. Your groups that end in the same hex merge. Armies with no orders stay put.
- **Moving:** up to 3 hexes through land you own, but **entering a hex you don't own (neutral or enemy) ends the move**. So each army takes at most 1 new hex per turn, while moving behind your own lines is fast.

**Terrain removed entirely**
- No mountains, swamps or cities: no movement costs, no combat effects and nothing drawn on the map. Every land hex costs 1 to enter.
- Resource and factory hexes are placed without regard to terrain.

**Battles**
- **Move first, then fight.** All movement plays out first. An army that moves into a hex with enemy armies stops there. Then every battle is rolled.
- **Dice:** compare the highest dice, then the next highest. The loser of each pair loses 1 army. Nobody rolls more dice than they have armies.
- **Defended battles:** the faction that held the hex at the start of the turn, if it still has armies there, is the defender. The defender rolls up to 2 dice and the attacker up to 3. **The defender wins ties.**
- **Meeting battles** (no defender, e.g. two factions entering an empty or neutral hex): both roll up to 3 dice. **In a tie, both lose 1 army.**
- **Armies that cross paths** (each moving into the hex the other is leaving, on the same step): they collide, both stop in the hex they started that step from, and fight a meeting battle on the border between them (3 dice each, a tie costs both 1 army). Armies that later move into either of those two hexes join that battle.
- **3 rounds per turn.** If both sides still have armies, the battle carries over to the next turn.
- **Next turn, armies in battle can:** hold (no order, keep fighting), get reinforced (more armies move in), or retreat 1 hex. Retreats happen before that turn's battle rounds.
- **Three-way battles:** every pair of factions rolls against each other each round. The defender rolls up to 2 dice against each attacker; the attackers roll up to 3 dice against the defender and up to 3 against each other (between the two attackers, a tie costs both 1 army). All losses in a round land at the same time.

**Economy: money only**
- Steel, Oil and Rubber are removed, along with factories, oil fields, mines and rubber plantations. The only currency is 💰 Money.
- **Income per turn:** $1 for each hex you own that isn't a capital, $2 for each other country capital you own, and $5 for your ★ faction capital.
- **No supply lines for now:** every hex you own pays, whether or not it connects to your capital. *(To revisit later.)*
- **Armies cost $10.** On your turn, recruit as many as you can afford, at any capital hex you own, even if you don't hold the rest of that country. Spread them across as many capitals as you like. New armies appear on their capital at the end of the turn.

**Map variety**
- Every map gets **2–3 inland lakes** (4–7 hexes each, toward the middle of the map; at least one per map). Lakes are placed first and countries grow around them.
- Every map also gets **3–5 clumps of impassable mountains** (black hexes, 1–4 per clump, any shape). They're carved out of the land after the countries have grown, so most sit inland. Any faction country that loses hexes to them is topped back up, so starting land stays equal; neutral countries keep at least 6 hexes.
- Neither can be entered, owned or counted for income or victory.
- Mountains that end up with no land beside them become ocean, lakes that end up touching the ocean become bays (ocean), and small pockets of sea enclosed by land become small lakes.
- **Equal starting land:** every faction starts with exactly the same number of hexes (one total per map, 34–40), though its three countries can be sized differently.
- **Small countries as a buffer:** each faction's home country sits at the back of the map, with its two small countries in front of it, toward the middle and the enemies. A home country never borders an enemy faction's country, and each faction's three countries always form one connected territory at the start (never split up by neutral land). Capitals stay where they are now (roughly central in their country).

**Ports removed; encirclement simplified**
- Ports are removed: they no longer do anything now that supply lines are gone.
- A group of hexes switches to an enemy at the end of the turn if every **land** hex around it belongs to that one enemy. Ocean, lakes and mountains count as walls. It still doesn't switch if there are armies inside, and capitals never switch this way.

**Start of the game**
- Each faction starts with **10 armies**, placed wherever it likes within its home country (the country with its ★ faction capital).

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

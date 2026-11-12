# Warsea Conquest — Game Rules

*Last updated: November 12, 2026 · Matches game version **v0.3.1***

This file describes the game as it's actually built, plus ideas that aren't built yet (section 10). Numbers marked **(starting value)** are Claude's first guesses and still need my approval.

---

## 1. The basics
- **3 factions:** Red, Blue and Green. Any seat can be played by the computer.
- **50 turns.** Everyone plans orders at the same time, then the turn plays out step by step for everyone together.
- **Winning:** most land hexes after turn 50, or the last faction left. Ties stay ties.
- **Elimination:** lose your faction capital (★) and you're out. Your hexes become neutral, your units disband and your stockpile is lost.

## 2. The map
- A new random hex map every game: 21 × 23 hexes with an ocean border, about 165–190 land hexes.
- **Each faction starts with:**
  - a large home country (15–20 hexes) containing its ★ faction capital,
  - two small countries next to it (8–12 hexes).
- **6 neutral countries** (grey, 8–12 hexes, no units), 2 between each pair of factions. Every pair of factions has at least one neutral country touching both.
- Every country has a capital (●). Coastal countries get ports (⚓).
- **Terrain:** about 18% mountains, 12% swamp, capitals and a few other hexes urban, the rest plains.

| Terrain | Infantry move cost | Armour move cost | Combat effect |
|---|---|---|---|
| Plains | 1 | 1 | Armour +50% strength |
| Urban | 1 | 1 | Infantry +50% against armour |
| Mountains | 2 | 2 | Infantry +50% against armour |
| Swamp | 2 | 3 | — |
| Ocean | can't enter | can't enter | — |

## 3. Units
| Unit | Move | Strength | Hit points | Retreat move | Reach (area of control) | Cost |
|---|---|---|---|---|---|---|
| Infantry | 3 | 2 | 40 | 1 | Its own hex | 8💰 |
| Armour | 5 | 4 | 48 | 2 | Its hex + the 6 around it | 14💰 2⚙ 2🛢 1🌿 |

- Each faction starts with **3 infantry and 1 armour** at and around its capital.
- Any number of units can share a hex.
- Hit points were raised 4× in v0.3.1 so battles last about 2–4 turns, long enough to send in reinforcements.
- Unit costs are **(starting values)**.

## 4. Giving orders
- You can give orders to **up to 3 units** per turn. Building units doesn't count toward this.
- Plot a unit's path hex by hex. Moves for different units can be split up and mixed; they play out in the order you entered them.
- Units without orders stay where they are.
- Tap **Submit** when done. You can **Edit my orders** until everyone else has submitted.

## 5. How a turn plays out
1. Each step, every faction moves its next unit one hex, all at the same time. A faction with more steps keeps going after the others finish.
2. **Hex control:** a hex with units of only one faction becomes theirs, including neutral hexes.
3. **Contact stops movement:** a unit that comes into contact with an enemy stops, and so does the enemy it meets (see Combat).
4. **End of turn**, in this order:
   1. **Encirclement:** a group of hexes completely surrounded by one other faction switches to that faction. Exceptions: there are units inside; it touches ocean and has its own port; capitals and resource hexes never switch this way. This also applies to neutral land.
   2. New units appear.
   3. Income is collected.
5. Everyone gets a turn summary and a step-by-step replay.

## 6. Combat
- **A battle starts** when enemies come into contact: one is inside the other's reach, they enter the same hex, or they try to swap hexes. Units that try to swap don't move and stay locked in battle.
- **Each step**, every unit in battle hits the weakest enemy it's touching for its strength × a random factor between 0.5 and 1.5 (rounded, minimum 1). All hits land at the same time; units at 0 HP are destroyed.
- **Terrain bonuses** use the hex the attacker is standing on (see the table in section 2).
- While any battle is going, a turn lasts **at least 6 steps**. Battles carry over to the next turn, and other units can join them.
- **Retreating:** a unit that starts the turn in battle can only retreat, with half its movement. Retreating units aren't stopped by contact and don't hit back, but can still be hit. Units in battle with no orders keep fighting.
- Units don't heal.

## 7. Economy
**Four currencies:** 💰 Money, ⚙ Steel, 🛢 Oil, 🌿 Rubber. Unspent currency carries over. Starting stockpile **16💰 2⚙ 2🛢 1🌿 (starting value)**.

**What produces what, per turn (starting values):**

| Hex | Produces |
|---|---|
| 🏭 Factory | +2💰 |
| 🛢 Oil field | +2🛢 |
| ⛏ Mine | +2⚙ |
| 🌿 Rubber plantation | +2🌿 |
| Every country capital | +1💰 |

- Large countries have 2 factories and 2 resource hexes; small and neutral countries have 1 of each.
- **Each faction's own land lacks one of the three resources.** The neutral countries next to it hold that resource, so you have to expand into them to keep building armour.
- **Supply:** a country produces for you only if you hold its capital **and** that capital connects to your ★ capital, over hexes you own or by sea between any two of your ports. Cut off = no income from that country at all.

## 8. Building units
- Build at the capital of **any country you hold completely**, one unit per capital per turn, as long as no enemy unit is on it.
- Cost is paid when the turn plays out, before that turn's income. If you can't afford it by then, the build is skipped.
- New units appear on the capital at the end of the turn.
- These rules are **(starting values)**.

## 9. Computer players
- Pick **Opponents: 🤖 Computer** when creating a game, or use **☰ Menu → Computer plays open seats** in a friends game. A human can take a seat back with **Pick a seat → Take over**.
- The bot holds its capital, pulls losing units out of battle, grabs land (preferring resource hexes and capitals), only picks fights it expects to win, and spends its stockpile every turn.
- In computer-only test games, each faction ended up with 30–90 units, and some games ended early through elimination.

---

## 10. Ideas not built yet
These are from my original design. They'll be reviewed when we simplify the rules; some may be dropped.

- **Naval units:** battleships (move hex by hex at sea, blockade ports by sitting next to them), submarines (attack sea supply routes), aircraft carriers (unlocked by research).
- **Air power:** aircraft based at airfields, which can be built, captured and bombed. Fighters intercept bombers; strategic bombers hit enemy territory; close air support helps battles. Each air mission uses one of the turn's 3 orders.
- **Guerrillas and secret police:** guerrillas go undercover in enemy land and sabotage units or factories, are hidden from normal recon and don't take hexes. Secret police (or detection tech) uncover them.
- **Fog of war:** you only see enemy units next to your territory or within your units' recon range. *May need code on a server; I don't know yet if free Firebase allows it.*
- **Technology:** WWII-era research paid with the four currencies, giving new units, unit upgrades, one-time benefits and more orders per turn. Research doesn't use orders.
- **"Your turn" notifications.**

## 11. Open decisions
- Approve or change the economy and building numbers (sections 3, 7, 8).
- Armies get very large (30–90 units) while only 3 can move per turn. Upkeep costs or a stacking limit might help.
- Should units heal, and how?
- Should neutral countries have defending units?

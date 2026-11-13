# Warsea Conquest — Game Rules

*Last updated: November 12, 2026 · Matches game version **v0.4.0***

This file describes the game as it's actually built, plus ideas that aren't built yet (section 10).

---

## 1. The basics
- **3 factions:** Red, Blue and Green. Any seat can be played by the computer.
- **50 turns.** Everyone plans orders at the same time, then the turn plays out for everyone together.
- **Winning:** most land hexes after turn 50, or the last faction left. Ties stay ties.
- **Elimination:** lose your ★ faction capital and you're out. Your hexes become neutral, your armies disband and your money is lost.

## 2. The map
A new random hex map every game (21 × 23 hexes with an ocean border, about 160–180 land hexes).

- **Each faction starts with** a home country (with its ★ capital) at the back of the map, and two small countries in front of it, toward the middle, as a buffer.
  - A home country never borders an enemy faction's country.
  - Each faction's three countries form one connected territory.
  - **Every faction starts with exactly the same number of hexes** (34–40, chosen per map).
- **6 neutral countries** (grey, 6–12 hexes each) fill the gaps, 2 between each pair of factions.
- Every country has a capital (●, or ★ for faction capitals).
- **Lakes** (light blue): 2–3 inland lakes per map, plus small enclosed pockets of water. **Mountains** (black): 3–5 clumps of 1–4 hexes, mostly inland. Both are impassable and can't be owned.
- There's no other terrain: every land hex is the same.

## 3. Setting up
- Before turn 1, each faction places **10 armies** anywhere in its home country. Armies not placed go on the ★ capital.
- Everyone places at the same time; turn 1 starts when all have submitted.
- Everyone starts with $0. The first income arrives at the end of turn 1.

## 4. Armies and orders
- There's **one kind of army**. All of a faction's armies in one hex form one army, shown on the map as a token with a number.
- **No order limit:** every army can move every turn. You can split an army and send any number of it somewhere else; the rest stay. Your armies that end up in the same hex merge.
- **Moving:** up to **3 hexes through land you own**. **Entering a hex you don't own (neutral or enemy), or a hex with enemy armies, ends the move.** So each army takes at most one new hex per turn, while moving behind your own lines is fast.
- Armies with no orders stay put.
- Submit whenever you're ready. You can **Edit my orders** until everyone else has submitted.

**On screen:** armies waiting for orders have a gold outline. Tap one (or use **Next ▶**), choose how many to send with − / + / All, then tap a highlighted hex. Planned moves show as arrows, with a dashed token where the armies will end up. Tap ✕ on an order to cancel it.

## 5. How a turn plays out
1. **Retreats** happen first.
2. **Movement:** every moving army takes its first step at the same time, then its second, then its third.
   - **Crossing paths:** if armies of different factions try to move into each other's hexes on the same step, they collide. Both stop where they were and fight a **border battle** between the two hexes. Armies that later move into either of those hexes join it.
   - A hex with armies of only one faction becomes that faction's.
3. **Battles** (section 6).
4. **End of turn:** encirclement, then new armies appear, then income is paid.
5. Everyone gets a turn summary and a step-by-step replay.

## 6. Battles
Battles use Risk dice: each side rolls, the highest dice are compared, then the next highest. The loser of each pair loses 1 army. **Nobody rolls more dice than they have armies.**

- **Defended battles:** the faction that held the hex at the start of the turn, if it still has armies there, defends with **up to 2 dice and wins ties**. The attacker rolls **up to 3 dice**.
- **Meeting battles** (no defender: neutral or empty land, or a border battle): both roll **up to 3 dice**, and **a tie costs both 1 army**.
- **Three-way battles:** every pair of factions rolls against each other each round. The defender rolls up to 2 dice against each attacker; the two attackers roll up to 3 against the defender and against each other (a tie between them costs both). All losses in a round land at the same time.
- **3 rounds per turn.** If both sides still have armies, the battle continues next turn.
- **Armies in a battle at the start of a turn can:** hold (no order needed), be reinforced (other armies move in), or **retreat 1 hex** into a hex you own with no enemy armies.

## 7. Land and encirclement
- A hex with only your armies in it becomes yours.
- **Encirclement:** at the end of the turn, a group of hexes switches to an enemy if every **land** hex around it belongs to that one enemy. Ocean, lakes and mountains count as walls. It doesn't switch if any armies are inside, and capitals never switch this way. This applies to neutral land too.

## 8. Money and recruiting
**Income per turn:**

| You own | You get |
|---|---|
| Each plain hex | $1 |
| Each country capital (including a captured enemy ★ capital) | $2 |
| Your own ★ faction capital | $5 |

- There are no supply lines: every hex you own pays.
- **Armies cost $10.** Recruit as many as you can afford, at **any capital you hold**, even if you don't hold the rest of that country. Spread them across capitals however you like.
- New armies appear on their capital at the end of the turn, if you still hold it. They're paid for before that turn's income arrives.

## 9. Computer players
- Pick **Opponents: 🤖 Computer** when creating a game, or use **☰ Menu → Computer plays open seats** in a friends game. A human can take a seat back with **Pick a seat → Take over**.
- The bot keeps a guard on its capital, sends single armies to grab neutral land, gathers bigger groups to attack enemy armies it expects to beat, retreats from battles it's losing badly, and spends all its money each turn.
- In computer-only test games, sieges of a well-defended capital take many turns, because a big stack still rolls only 3 dice. Eliminations happen in some games, usually after turn 25.

---

## 10. Ideas not built yet
From my original design. To be reviewed; some may be dropped.

- **Supply lines:** income only from land connected to your capital. *(Removed for now; to revisit.)*
- **Naval units:** battleships (blockade ports), submarines (attack sea routes), aircraft carriers.
- **Air power:** airfields; fighters, bombers and close air support.
- **Guerrillas and secret police.**
- **Fog of war:** seeing only enemy armies near your land. *May need code on a server; I don't know yet if free Firebase allows it.*
- **Technology:** research paid with money.
- **"Your turn" notifications.**

## 11. Open decisions
- Whether 3 battle rounds per turn is the right number, once we've played.
- Whether the starting numbers (10 armies, $10 per army, income rates) feel right.

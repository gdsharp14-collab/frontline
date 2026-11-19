# Warsea Conquest — Game Rules

*Last updated: November 18, 2026 · Matches game version **v0.6.0***

This file describes the game as it's actually built, plus ideas that aren't built yet (section 11).

---

## 1. The basics
- **3 factions:** Red, Blue and Green. Any seat can be played by the computer.
- **50 turns.** Everyone plans orders at the same time, then the turn plays out for everyone together.
- **Winning:** most land hexes after turn 50, or the last faction left. Ties stay ties.
- **Elimination:** lose your ★ faction capital and you're out. Your hexes become neutral, your armies disband and your money is lost.

## 2. The map
**Choosing a map:** when creating a game, pick one of three **named maps** or **🎲 Random**.

| Named map | What it's like | Wins in 400 computer games with fog (Red · Blue · Green) |
|---|---|---|
| **Symmetric** | Three identical positions (each faction's corner is the same map turned 120°) | 33% · 32% · 36%; games are usually decided by land after turn 50, not by eliminations |
| **Archipelago** | Every country is an island, linked by short sea lanes | 26% · **51%** · 23%: **with fog, this map favours Blue** (see the v0.6.0 notes in the changelog) |
| **Continental** | One big landmass with lakes and mountains, no sea lanes | 37% · 24% · 39% |

These are computer-player results; people may find different advantages.

**Random maps** come in several styles: Classic, Continents, Archipelago, Mixed, Inland Sea, Symmetric and Symmetric Isles, sometimes with long routes round the outside. **Random maps often favour one colour:** in testing, on a typical random map one position won about two thirds of the games.

**On every map:**
- **Each faction starts with** a home country (with its ★ capital) at the back of the map, and two small countries in front of it as a buffer.
  - A home country never borders an enemy faction's country, by land or by a short sea lane. (The only exception is a *long* sea lane round the outside of the map, on some random maps.)
  - Each faction's three countries form one connected territory (its own sea lanes may join it).
  - **Every faction starts with exactly the same number of hexes** (34–40, chosen per map).
- **6 neutral countries** (grey) fill the gaps between factions. Some random maps add small neutral islands out at sea.
- Every country has a capital (●, or ★ for faction capitals).
- **Lakes** (light blue) and **mountains** (black) are impassable and can't be owned.
- **Sea lanes** (blue hexes with a dotted white route) link separate landmasses, from 1 hex long to about 15 hexes long. On Inland Sea maps, sea lanes from 6 points round the shore meet at a hub in the middle of the sea.
- There's no other terrain: every land hex is the same.

## 3. Setting up
- Before turn 1, each faction places **10 armies** anywhere in its home country. Armies not placed go on the ★ capital.
- Everyone places at the same time; turn 1 starts when all have submitted.
- Everyone starts with $0. The first income arrives at the end of turn 1.

## 4. Armies and orders
- There's **one kind of army**. All of a faction's armies in one hex form one army, shown on the map as a token with a number.
- **No order limit:** every army can move every turn. You can split an army and send any number of it somewhere else; the rest stay. Your armies that end up in the same hex merge.
- **Moving:** up to **3 hexes through land you own**. **Entering a hex you don't own (neutral or enemy), or a hex with enemy armies, ends the move.** So each army takes at most one new hex per turn, while moving behind your own lines is fast.
- **Sea lanes don't stop a move:** armies cross them freely within their 3 hexes, and can also end their move on one and wait there. A lane longer than 3 hexes takes more than one turn to cross. Sea-lane hexes are never owned and pay nothing.
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
- **Meeting battles** (no defender: neutral or empty land, a sea lane, or a border battle): both roll **up to 3 dice**, and **a tie costs both 1 army**.
- **Three-way battles:** every pair of factions rolls against each other each round. The defender rolls up to 2 dice against each attacker; the two attackers roll up to 3 against the defender and against each other (a tie between them costs both). All losses in a round land at the same time.
- **3 rounds per turn.** If both sides still have armies, the battle continues next turn.
- **Armies in a battle at the start of a turn can:** hold (no order needed), be reinforced (other armies move in), or **retreat 1 hex** into a hex you own, or an empty sea-lane hex, with no enemy armies.

## 7. Land and encirclement
- A hex with only your armies in it becomes yours.
- **Encirclement:** at the end of the turn, a group of hexes switches to an enemy if every **land** hex around it belongs to that one enemy. Ocean, lakes, mountains and sea lanes count as walls. It doesn't switch if any armies are inside, and capitals never switch this way. This applies to neutral land too.

## 8. Fog of war
*(Since v0.6.0. Games started before v0.6.0 have no fog.)*
- **What you can see:** every hex you own, every hex next to your land, and every hex within **2 hexes of any of your armies** (including armies on sea lanes).
- **Hexes out of sight are shaded darker.** The map and who owns each hex are always visible.
- **Hidden in fog:** enemy armies, and battles between other factions. Your own battles are always shown.
- **Secret:** other players' money, recruiting and army totals (the menu shows "?"). New enemy armies show only if they appear somewhere you can see.
- **Replay and war log** only show what you saw. In the replay, what you can see changes step by step as armies move.
- **Last-seen markers:** if enemy armies were on a hex and you lose sight of that hex, a faded token like **~6** stays there showing what you last saw, **for one turn**. There's no marker if you watched the armies move away. Tap the hex to see who it was.
- **Moving into fog:** entering a hex with enemy armies still ends your move and starts a battle, whether you could see them or not. Highlighted hexes for a move only take account of armies you can see.
- **Computer players** see only what a human in their seat would see, including last-seen markers.
- **Watchers** (on the game link without a seat) see no armies until the game ends. **When the game is over**, or once all your seats are out, you see everything.
- **How hidden it is:** the game just doesn't draw what you shouldn't see. The whole game is still downloaded to every phone, so someone technical could dig it out.

## 9. Money and recruiting
**Income per turn:**

| You own | You get |
|---|---|
| Each plain hex | $1 |
| Each country capital (including a captured enemy ★ capital) | $2 |
| Your own ★ faction capital | $5 |

- There are no supply lines: every hex you own pays.
- **Armies cost $10.** Recruit as many as you can afford, at **any capital you hold**, even if you don't hold the rest of that country. Spread them across capitals however you like.
- New armies appear on their capital at the end of the turn, if you still hold it. They're paid for before that turn's income arrives.

## 10. Computer players
- Pick **Opponents: 🤖 Computer** when creating a game, or use **☰ Menu → Computer plays open seats** in a friends game. A human can take a seat back with **Pick a seat → Take over**.
- **Computer player v2** (since v0.5.0) plans each turn as a whole: it estimates where enemy armies could strike next turn, keeps enough armies on its capitals, pools armies from several stacks into attacks it expects to win, grabs land with single armies, crosses sea lanes, and marches spare armies toward the front over several turns. It varies its choices a little from game to game.
- In testing it beat two copies of the old computer player 59% of the time. Games between three v2 players usually see one faction eliminated.
- **With fog (since v0.6.0)** it plans only with the armies it can see, plus its last-seen markers.

---

## 11. Ideas not built yet
From my original design. To be reviewed; some may be dropped.

- **Supply lines:** income only from land connected to your capital. *(Removed for now; to revisit.)*
- **Naval units:** battleships (blockade ports), submarines (attack sea routes), aircraft carriers.
- **Air power:** airfields; fighters, bombers and close air support.
- **Guerrillas and secret police.**
- **Fog of war, true secrecy:** fog is built (section 8) but only hides things on screen. Hiding them properly would need code on a server (Firebase Cloud Functions, which need the paid Blaze plan with a payment method on file).
- **Recon:** different sight ranges for different units, or technology that improves sight.
- **Technology:** research paid with money.
- **"Your turn" notifications.**

## 12. Open decisions
See "Open questions for future stages" in the project outline, which also explains why each current rule was chosen.

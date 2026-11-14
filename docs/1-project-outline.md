# Warsea Conquest — Project Outline

*Last updated: November 14, 2026 · Current version: **v0.4.0** (live, confirmed playable)*

## What this is
A WWII-era hex strategy wargame for me and 2 friends to play on our **Android phones**, from different places. Everyone submits orders, then the turn plays out for all three at once. Turns happen whenever we're all ready.

- I have essentially no coding experience. **Claude writes the code and is responsible for version control and keeping everything organized**, in Claude and on GitHub.
- The game is a single `index.html` web page. No app store, no player accounts.
- Old working title: "Frontline". Some behind-the-scenes names still use it (the GitHub repository, the Firebase project, phone storage keys). They're left alone because renaming them would break links and saved games.

## Where everything lives
| Place | What's there | Role |
|---|---|---|
| **GitHub** — `gdsharp14-collab/frontline` | `index.html` plus a copy of these docs | **The master copy.** Every version is saved here with a note, so any version can be restored |
| **Live game** — https://gdsharp14-collab.github.io/frontline/ | Whatever is on GitHub | What we play. Updates a minute or two after GitHub changes |
| **Claude Project** — "Warsea Conquest" | `index.html` and the 3 docs below | Claude's working copies, kept identical to GitHub after every build |
| **Firebase** — project `frontline-game-cf9e5` | Saved games | The database. No code lives here |
| **Documents\Warsea Conquest** (my PC) | Older copies | Backup only. Not kept up to date |

### The docs
1. **Project outline** (this file): where things live, how changes happen, the roadmap and status.
2. **Game rules**: the rules as built, numbers waiting for approval, and ideas not built yet.
3. **Changelog**: every version, plus the list of agreed changes waiting for the next build.

## How a change happens
1. **Discuss.** We talk through an idea. Nothing changes in the game or the docs yet.
2. **Agree.** Claude adds the agreed change to *Waiting for next build* in the changelog. *(The changelog update is the only doc change allowed between builds.)*
3. **Build.** When I say "build", Claude makes all the waiting changes in one go, tests them, and gives the result a new version number.
4. **Release.** Claude saves the new version to GitHub with a note, and updates the Project copies and the docs. The live game updates by itself.
5. **Undo if needed.** If a version breaks something, Claude can put the previous version back.

Each version's GitHub code is recorded in the changelog, and the version number goes in the note saved with it on GitHub.

## Version numbers
- **v0.X.Y**: X is the build stage, Y counts fixes and tweaks within it. Example: v0.3.1 is stage 3 with one tweak.
- **v1.0**: the first version we've actually played start to finish with friends, with the numbers approved.
- After v1.0: v1.1, v1.2 … for each add-on.

## Roadmap
| Phase | Goal | Status |
|---|---|---|
| 0. Clean-up | One set of docs, GitHub as the master copy, version history recorded | **Done** (Nov 12) |
| 1. Simplify the rules | Cut the rules down to what's fun and playable on a phone | **Done** (v0.4.0, Nov 12) |
| 2. Go live | Play the game for real on our phones. Fix what breaks | **Milestone reached** (Nov 14): v0.4.0 plays well and follows all the agreed rules |
| 3. Tune → v1.0 | Adjust the numbers (battle rounds, starting armies, costs, income) after real games | Not started |
| 4. Add-ons, one at a time | Each one played before the next starts. Likely order: "your turn" notifications, ships, aircraft, technology | Not started |

Fog of war and hidden units are parked until we know whether they're possible: they may need code on a server, and I don't know whether the free Firebase plan allows that.

## Status (Nov 14, 2026)
- **Milestone: v0.4.0 is the first confirmed playable version.** I played it on Nov 14 and it plays well and follows all the rules we agreed.
- The live game runs on real Firebase (games are created and saved).
- GitHub is connected to Claude, so Claude saves each release there directly.
- **Next:** future stages. Start from the open questions below and the ideas list in the game rules doc (section 10).

## Progress so far
| Date | What happened |
|---|---|
| Oct 31, 2026 | "Frontline", a Risk-style prototype with online play (v0.0) |
| Nov 1, 2026 | Redesigned as a WWII-era hex game and built in three stages: map and movement (v0.1), combat with hit points (v0.2), economy with four currencies and supply lines (v0.3) |
| Nov 12, 2026 | Stepped back to simplify. Reorganized the project (GitHub as the master copy, three docs, version numbers). Agreed a much simpler, Risk-style rule set and built it as v0.4.0 |
| Nov 14, 2026 | Played v0.4.0 and confirmed it works: first milestone reached |

## Key decisions so far, and why
**How the project is run (Nov 12)**
- **GitHub is the master copy**, and Claude handles version control. I have no coding experience, so Claude saves every build with a version number and a note, keeps the Project copies identical, and can restore any earlier version.
- **Changes are collected, then built in one go.** Between builds, agreed changes only go on the changelog's "Waiting for next build" list. This keeps each build focused and saves usage.
- **Three docs only** (this outline, the game rules, the changelog), because the earlier docs had drifted out of sync with each other and with the game.

**Simplifying the rules (Nov 12, built as v0.4.0)**
The goal: **keep the simplicity of Risk, which my friends and I enjoy, but add a bit more strategic decision-making than just holding chokepoints.**
- **Risk dice for battles**, replacing hit points and strength: familiar and easy to follow.
- **Battles last 3 rounds per turn and carry over**, instead of fighting to the end. Orders are given at the same time, so you can't see what opponents are doing. A battle that carries over lets you react next turn by reinforcing, holding or retreating, instead of losing everything to one bad guess.
- **Defender wins ties; in neutral land and border collisions a tie costs both sides.** That keeps Risk's defender advantage, and a meeting with no defender is even.
- **Three-way battles: everyone rolls against everyone** (my idea). More armies die each round, which suits a three-way fight, and it means two attackers can wear down a defender quickly.
- **One army type, no terrain:** dropped for simplicity, at least for now.
- **Money only:** Steel, Oil and Rubber were only ever spent on armour, so they went with it. Income is $1 per hex, $2 per capital and $5 for your own ★ capital; armies cost $10 and can be recruited at any capital you hold.
- **No supply lines for now:** simpler. *To revisit later.*
- **No order limit; fast through your own land, slow into new land.** The old 3-order limit made no sense with stacks of armies. Every army can move up to 3 hexes through its own land, but entering new land ends its move. That creates a real choice between spreading out to grab land and keeping armies together for safety, and makes holding a connected territory pay off. (Considered and rejected: one move per capital held.)
- **Armies move together and can be split, as in Risk.**
- **10 starting armies**, placed freely in your home country.

**The map (Nov 12)**
- **Inland lakes and impassable mountain clumps**, because every map used to be one solid blob of land. Mountains appear inland as well as on coasts, as single hexes or clumps.
- **Every faction starts with exactly the same amount of land**, for fairness.
- **Small countries act as a buffer:** each home country sits at the back, behind its two small countries, never touching an enemy. Each faction's land always starts in one connected piece.
- **Ports removed**, since supply lines are gone. Ocean, lakes and mountains count as walls for encirclement.

**The order screen (Nov 12)**
- Because every army can now move each turn, the screen shows what's left to do: gold outlines on armies waiting for orders, a **Next ▶** button, − / + / All for splitting, and a Submit button that says how many armies aren't moving.

## Open questions for future stages
- **Battle rounds:** are 3 rounds per turn right? A big army still rolls only 3 dice, so taking a well-defended capital takes several turns, and eliminations are rare before turn 25 in computer-only games.
- **Numbers:** are 10 starting armies, $10 per army and the income rates right?
- **Supply lines:** bring them back in some form?
- **Terrain and more unit types:** bring any back later?
- **The ideas list** in the game rules doc (section 10): naval units, air power, guerrillas, fog of war, technology, "your turn" notifications.
- **Computer player:** it's mainly for testing and is fairly cautious; improve it if we want better solo games.

## Technical details
- **Firebase:** free Spark plan, Firestore database plus anonymous sign-in. The web config (apiKey etc.) is inside `index.html`. These values aren't secret; the database rules control access.
- **Firebase SDK:** loaded from `https://www.gstatic.com/firebasejs/13.1.0/`.
- **Saved games:** one Firestore document per game at `games/{gameId}`, holding `{v:3, rev, state}`, where `state` is the whole game as JSON text. Every change is a transaction. The last human to submit plays out the turn on their own phone.
- **Testing:** adding `?mock` to the game address uses a test-only stand-in for Firebase, shared between tabs in one browser.
- **Firestore rules** that should be published:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow get, create, update: if request.auth != null;
    }
  }
}
```

## Still to confirm
- The Firestore rules in Technical details have been published. (Games save fine; this is about making sure only signed-in players can read or write games.)
- `gdsharp14-collab.github.io` is listed under Firebase → Authentication → Authorized domains. Sign-in works, so this may already be fine.

# Warsea Conquest — Project Outline

*Last updated: November 12, 2026 · Current version: **v0.3.1** (live game is v0.3.0, see Status)*

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
| 1. Simplify the rules | Cut the rules down to what's fun and playable on a phone | **Next** |
| 2. Go live | Put the latest version on GitHub, play a solo game against the computer, then a real game with friends. Fix what breaks | Not started |
| 3. Tune → v1.0 | Approve or change the numbers, settle the open decisions | Not started |
| 4. Add-ons, one at a time | Each one played before the next starts. Likely order: "your turn" notifications, ships, aircraft, technology | Not started |

Fog of war and hidden units are parked until we know whether they're possible: they may need code on a server, and I don't know whether the free Firebase plan allows that.

## Status (Nov 12, 2026)
- **Built:** stages 1–3 (map and movement, combat, economy). See the changelog.
- **Live game is one version behind:** GitHub has v0.3.0. v0.3.1 (4× hit points, for longer battles) is in the Project but hasn't been uploaded yet.
- **Never played on real phones.** All testing so far used simulated phones.
- **GitHub is connected to Claude** (Nov 12), so Claude saves each release there directly. No more manual uploads.

## Technical details
- **Firebase:** free Spark plan, Firestore database plus anonymous sign-in. The web config (apiKey etc.) is inside `index.html`. These values aren't secret; the database rules control access.
- **Firebase SDK:** loaded from `https://www.gstatic.com/firebasejs/13.1.0/`.
- **Saved games:** one Firestore document per game at `games/{gameId}`, holding `{v:2, rev, state}`, where `state` is the whole game as JSON text. Every change is a transaction. The last human to submit plays out the turn on their own phone.
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
- The Firestore rules above have been published.
- `gdsharp14-collab.github.io` has been added under Firebase → Authentication → Authorized domains. I don't know whether anonymous sign-in needs this.
- A first real test on phones.

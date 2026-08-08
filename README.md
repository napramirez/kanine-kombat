# KANINE KOMBAT

A 2-player 2D fighting game featuring a six-fighter animal roster, built as a static web page.

## Quick Start

Open `src/index.html` in a browser. No build step, no dependencies. Click `2 PLAYER`, `VS CPU`, or `BATTLE PLAN`, choose fighters, then begin the match.

To enable title-screen music, place a licensed MP3 at `src/assets/title-screen-bgm.mp3`.

To enable character-select music, place a loopable music file at `src/assets/char-select-bgm.mp3`.

To enable round music, place a loopable music file at `src/assets/fight-bgm.mp3`.

## Tech Stack

- **Single HTML file** - all CSS + JS inline
- **Canvas API** - 2D sprite rendering
- **Google Fonts** - Press Start 2P pixel font
- **Zero dependencies** - pure vanilla JS

## Current Features

- 2-player local multiplayer
- Single player vs CPU mode
- Battle Plan gauntlet mode
- 6 playable fighters: DOGGO CAGE, BORKO, CATNIP, SKORPDOG, SEKDOG, SUBDOG
- Character select screen before each match
- Procedural sprite animation
- Punch, kick, and special attacks
- Combo system with damage scaling
- Blocking mechanics
- Health bars, special meters, round system
- Character-specific specials, including pull-and-stun, freeze, missile, and teleport-punch effects
- Title screen mode select for `2 PLAYER`, `VS CPU`, or `BATTLE PLAN`
- Particle effects (hit sparks, KO explosions)
- Screen shake and hit stop
- Web Audio API soundtrack and synthesized combat/UI sound effects
- Optional licensed title-screen MP3 loop at `src/assets/title-screen-bgm.mp3`
- Optional character-select BGM loop at `src/assets/char-select-bgm.mp3`
- Optional in-fight BGM loop at `src/assets/fight-bgm.mp3`, restarted every round
- Victory/defeat poses and flawless victory messaging
- City night background with animated elements

## File Structure

```
k9-kombat/
├── src/
│   ├── index.html      # Complete game (single file)
│   └── assets/         # Optional music assets
├── README.md           # This file
├── GAME_DESIGN.md      # Game mechanics documentation
├── DEVELOPMENT_PROMPTS.md  # Prompts for iterating
├── ROADMAP.md          # Feature roadmap
├── CONTROLS.md         # Player controls reference
└── BUG_TRACKER.md      # Known issues and fixes
```

## Development Loop

See `DEVELOPMENT_PROMPTS.md` for structured prompts to iterate on features. Each prompt targets a specific improvement area.

## License

MIT

# KANINE KOMBAT

A 2-player 2D fighting game with a nine-fighter animal roster, built as a single static web page.

## Quick Start

Open `index.html` in a browser. There is no build step and no dependency install.

From the title screen, click `2 PLAYER`, `VS CPU`, or `BATTLE PLAN`.

Optional music files:
- `assets/title-screen-bgm.mp3`
- `assets/char-select-bgm.mp3`
- `assets/fight-bgm.mp3`

## Tech Stack

- Single HTML file with inline CSS and JavaScript
- Canvas API rendering
- Google Fonts: `Press Start 2P`
- Zero runtime dependencies

## Current Features

- Local 2-player versus mode
- `VS CPU` single-player mode
- `BATTLE PLAN` gauntlet mode with a route stepper between matches
- 9 playable fighters:
  - `DOGGO CAGE`
  - `BORKO`
  - `SHAO CATNIP`
  - `SKORPDOG`
  - `SEKDOG`
  - `CYDOG`
  - `TREMODOG`
  - `RAYNDOG`
  - `SUBDOG`
- Character select screen with shared roster, side portraits, and a navigable grid
- Randomized background stages each match
- Procedural sprite animation and portrait previews
- Punch, kick, block, jump, crouch, and special attacks
- Combo scaling, hit stop, screen shake, particles, and KO effects
- Character-specific specials including BORKO's leap-and-shockwave slam, RAYNDOG's lightning cloud, harpoon stun, missile teleport punch, bomb-and-net capture, floor shockwave, and freeze projectile
- Pause flow on `Esc` during fights and Battle Plan route screens
- Title screen logo and mode-select layout
- Optional MP3 music hooks for title, character select, and fights

## Background Stages

- `The Temple`: afternoon Chinese-style temple with lush forest behind it and logo doors
- `Night City`: moonlit skyline with stars, lit windows, and dark pavement
- `Borko's Lair`: indoor sewer stage with a flowing canal and glowing yellow eyes in the dark
- `CATNIP's Domain`: cave rope-bridge stage with torchlit walls, scratch marks, stalactites, and darkness below
- Each new match picks one of the available stages at random

## Battle Plan

- Player keeps one selected fighter for the full route
- Early route matches are shuffled from the roster, excluding `BORKO` and `SHAO CATNIP`
- A mirror match is inserted unless the player picked `BORKO`
- Penultimate match is `BORKO` as the sub-boss
- The `BORKO` sub-boss match always uses `Borko's Lair`
- Final match is always `SHAO CATNIP`
- `SHAO CATNIP` boss match always uses `CATNIP's Domain`
- The route stepper appears before the first match and between wins, and scrolls to keep progress visible
- Press `Space` when prompted to start the next match

## Project Structure

```text
kanine-kombat/
├── index.html
├── assets/
├── README.md
├── GAME_DESIGN.md
├── DEVELOPMENT_PROMPTS.md
├── ROADMAP.md
├── CONTROLS.md
└── BUG_TRACKER.md
```

## Development

See `DEVELOPMENT_PROMPTS.md` for feature and polish prompts.

## License

MIT

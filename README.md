# KANINE KOMBAT

A 2-player 2D fighting game with a thirteen-fighter animal roster, built as a single static web page.

## Quick Start

Open `index.html` in a browser. There is no build step and no dependency install.

If your browser limits gamepad support from `file://`, run the folder through a simple local HTTP server instead.

From the title screen, click a mode or use controller confirm on the highlighted mode button.

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
- Keyboard and standard gamepad support with mixed-input play
- 10 initially selectable fighters, plus 3 Battle Plan unlocks:
  - `DOGGO CAGE`
  - `SKORPDOG`
  - `SEKDOG`
  - `CYDOG`
  - `TREMODOG`
  - `RAYNDOG`
  - `RAYDOG`
  - `DOGGOMELEON`
  - `NOOB SAIDOG`
  - `SUBDOG`
  - Unlock `BORKO` by defeating the Battle Plan sub-boss
  - Unlock `SHAO CATNIP` by defeating the Battle Plan final boss
  - Unlock `SNEK` by flawlessly defeating SHAO CATNIP in both Battle Plan final-showdown rounds as `NOOB SAIDOG`
- Character select screen with shared roster, side portraits, and a navigable grid
- Character select random-8 action on the special button (`L` for P1, `3` for P2)
- Title screen, character select, pause overlay, Battle Plan stepper, and post-match flow all support gamepad input
- Randomized background stages each match
- Procedural sprite animation and portrait previews
- Punch, kick, block, jump, crouch, active special attacks, and passive specials
- HUD with health bars, `ACTIVE` special meters, and conditional `PASSIVE` special meters for passive-special fighters
- Combo scaling, hit stop, screen shake, particles, and KO effects
- Character-specific specials including BORKO's leap-and-shockwave slam, RAYNDOG's lightning cloud, RAYDOG's arc lightning, DOGGOMELEON's morph cycle, NOOB SAIDOG's snake capture and fireball barrage, SNEK's slither-and-stun coil, harpoon stun, missile teleport punch, bomb-and-net capture, floor shockwave, and freeze projectile
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
- Press `Space` or controller confirm when prompted to start the next match

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

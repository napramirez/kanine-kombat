# KANINE KOMBAT - Game Design Document

## Overview

Kanine Kombat is a 2-player 2D fighting game with an eight-fighter animal roster, pixel-art presentation, and arcade-style match flow.

## Core Mechanics

### Characters

Players choose from a shared roster before each match.

| Fighter | Style | Speed | Health | Notes |
|---|---|---:|---:|---|
| `DOGGO CAGE` | Balanced | 5 | 100 | Tan/brown palette, sunglasses |
| `BORKO` | Power | 5 | 125 | Gray palette, red eyes, `scale: 1.3` |
| `SHAO CATNIP` | Speed | 8 | 150 | Purple palette, yellow eyes, `scale: 1.3` |
| `SKORPDOG` | Striker | 5 | 100 | White/black gear, yellow mask |
| `SEKDOG` | Ambush | 5 | 100 | White/black gear, red mask |
| `CYDOG` | Trapper | 5 | 100 | White/black gear, yellow eyes |
| `TREMODOG` | Quake | 5 | 100 | White/black gear, red eyes, `scale: 1.1` |
| `SUBDOG` | Trapper | 5 | 100 | White/black gear, light-blue mask |

### Combat System

| Type | Damage | Knockback | Duration | Special Gain |
|---|---:|---:|---:|---:|
| Punch | 8 | 4 | 9 frames | 6.4 |
| Kick | 12 | 7 | 12 frames | 9.6 |
| Special | Varies | Varies | 30 frames base | Consumes full meter |

### Special Attacks

- `DOGGO CAGE`: gold/red energy ball
- `BORKO`: blue/purple energy ball
- `SHAO CATNIP`: blue/purple energy ball
- `SKORPDOG`: harpoon that pulls the opponent in and applies a 1-second stun
- `SEKDOG`: missile followed by a teleport punch from behind
- `CYDOG`: plants a bomb, then fires a green net that captures and reels the opponent toward the bomb
- `TREMODOG`: creates a floor-wide pink shockwave field for 600 frames while TREMODOG stays planted in a crouched special stance; each pulse deals 5 damage
- `SUBDOG`: snowflake projectile that freezes the opponent for 2 seconds

### Combo System

- Combos reset after 1200ms without a hit
- Every 3 hits increases punch damage by 2
- Every 3 hits increases kick damage by 3
- Knockback increases with combo count

### Blocking

- Reduces damage to 15%
- Reduces knockback to 20%
- Shows a `BLOCK!` popup

### Special Meter

- Base passive gain is `0.08` per frame
- `SKORPDOG`, `SEKDOG`, `CYDOG`, `TREMODOG`, and `SUBDOG` passively gain `0.25` per frame
- On hit, attacker gains `damage * 0.8`
- On hurt, defender gains `damage * 0.5`
- Full meter is required to use a special
- Meter blinks when ready
- `SKORPDOG`, `SEKDOG`, `CYDOG`, `TREMODOG`, and `SUBDOG` do not gain special from punch or kick hits

### Physics

- Gravity: `0.65`
- Jump velocity: `-14`
- Default move speed baseline: `5`
- Ground level: `520px` from top
- Canvas: `1024x600`

### Round System

- Best of 3 rounds
- 99-second timer
- Win by KO or timeout
- Draws are possible

## Game Modes

- Local `2 PLAYER`
- `VS CPU`
- `BATTLE PLAN`

### Battle Plan

- Player selects one fighter and keeps that fighter for the full route
- Early opponents are shuffled from the roster excluding `BORKO` and `SHAO CATNIP`
- A mirror match is added unless the player selected `BORKO`
- Penultimate match is always `BORKO`
- Final match is always `SHAO CATNIP`
- A route stepper appears before the first match and after each win
- `Space` advances from the route stepper into the next fight

## Game States

```text
menu -> charSelect -> countdown -> fight -> roundEnd -> ... -> gameOver -> charSelect
menu -> charSelect -> battlePlanStepper -> countdown -> fight -> battlePlanStepper -> ...
fight or battlePlanStepper -> paused
```

- `Esc` on the character select screen returns to the title screen
- `Esc` during a fight opens the fight pause overlay
- `Esc` during the Battle Plan stepper opens the Battle Plan pause overlay
- `Esc` while paused resumes the current fight or route stepper

## Visual Design

### Title Screen

- Dog logo above `KANINE KOMBAT`
- Tagline: `such fight. very punch. wow.`
- Mode buttons for `2 PLAYER`, `VS CPU`, and `BATTLE PLAN`
- Control boxes for both players
- No title-screen move-list panel

### Character Select

- Shared eight-fighter roster
- Both players manually confirm in versus mode
- In `VS CPU`, Player 2 auto-selects and auto-confirms
- In `BATTLE PLAN`, the player keeps the selected character for the whole route

### HUD and Effects

- Health bars, special meters, timer, player names, and round dots
- Hit sparks, block sparks, KO explosions, and text popups
- Screen shake and hit stop on impactful hits
- Victory and defeat poses, including flawless victory messaging

### Background

- Background stage is chosen at random at the start of each match
- Current stages:
  - `The Temple`: afternoon sky, Chinese-style temple facade, lush forest, and `KANINE KOMBAT` doors
  - `Night City`: moonlit skyline, stars, lit windows, and dark pavement
  - `Borko's Lair`: indoor sewer canal, flowing waste water, and glowing yellow eyes in the darkness

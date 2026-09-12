# KANINE KOMBAT - Game Design Document

## Overview

Kanine Kombat is a 2-player 2D fighting game with a sixteen-fighter animal roster, pixel-art presentation, and arcade-style match flow.

## Core Mechanics

### Characters

Players choose from a shared roster before each match.

| Fighter | Style | Speed | Health | Notes |
|---|---|---:|---:|---|
| `DOGGO CAGE` | Balanced | 5 | 100 | Tan/brown palette, sunglasses |
| `BORKO` | Power | 4 | 125 | Hidden gray boss; unlock by defeating the Battle Plan sub-boss |
| `SHAO CATNIP` | Speed | 8 | 150 | Hidden purple boss; unlock by defeating the Battle Plan final boss |
| `SKORPDOG` | Striker | 5 | 100 | White/black gear, yellow mask |
| `SMOWKDAWG` | Striker | 5 | 100 | SKORPDOG variant with gray gear |
| `SEKDOG` | Ambush | 5 | 100 | White/black gear, red mask |
| `CYDOG` | Trapper | 5 | 100 | White/black gear, yellow eyes |
| `TREMODOG` | Quake | 5 | 100 | White/black gear, red eyes, `scale: 1.1` |
| `RAYNDOG` | Storm | 5 | 100 | SKORPDOG-inspired look with purple gear |
| `RAYDOG` | Arc | 5 | 100 | White outfit, silver eyes, brown conical hat, blue apron |
| `DOGGOMELEON` | Shift | 5 | 100 | SKORPDOG-inspired look with flashing rainbow gear |
| `NOOB SAIDOG` | Shadow | 5 | 100 | SKORPDOG-inspired look with black gear and solid flashing red eyes |
| `REPDOG` | Acid | 5 | 100 | Green-masked variant of NOOB SAIDOG with yellow eyes and red tongue |
| `DOGGABAL` | Tactical | 5 | 100 | Black dog, olive green vertical stripe, brown horizontal stripe, oxygen mask |
| `SNEK` | Constrictor | 7 | 100 | Hidden black python with red eyes; unlock by completing the Battle Plan as NOOB SAIDOG |
| `SUBDOG` | Trapper | 5 | 100 | White/black gear, light-blue mask |
| `MAKDOG` | Grappler | 5 | 100 | Red SKORPDOG variant with red vest/mask |
| `KANOINE` | Duality | 5 | 100 | White dog, gray left half face, pure red glowing left eye, white belly, brown stripe, fully gray left ear |

### Combat System

| Type | Damage | Knockback | Duration | Special Gain |
|---|---:|---:|---:|---:|
| Punch | 4 | 4 | 6 frames | 6.4 |
| Kick | 6 | 7 | 4 frames | 9.6 |
| Special | Varies | Varies | 30 frames base | Consumes full meter |

### Special Attacks

- `DOGGO CAGE`: gold/red energy ball
- `BORKO`: remembers the opponent's position, leaps high toward it, and creates a landing shockwave that deals 10 damage and 1 second of stun if the opponent is caught in the radius
- `SHAO CATNIP`: blue/purple energy ball
- `SKORPDOG`: harpoon that pulls the opponent in and applies a 1-second stun
- `SMOWKDAWG`: gray harpoon that pulls the opponent in and applies a 1-second stun (same as SKORPDOG)
- `SEKDOG`: missile followed by a teleport punch from behind
- `CYDOG`: plants a bomb, then fires a green net that captures and reels the opponent toward the bomb
- `TREMODOG`: creates a floor-wide pink shockwave field for 600 frames while TREMODOG stays planted in a crouched special stance; each pulse deals 5 damage
- `RAYNDOG`: summons a purple lightning cloud over the opponent for 3 seconds; each zap deals 10 damage
- `RAYDOG`: active special fires an arc lightning strike that always hits the opponent for 5 damage; passive special fires every 3 seconds when the passive meter fills
- `DOGGOMELEON`: passively cycles every 5 seconds through a random ninja-type character (excluding robot-ninjas `SEKDOG` and `CYDOG`), borrowing their visuals and special abilities
- `NOOB SAIDOG`: can summon a giant black python from the ground or mid-air behind the opponent to coil around them for a 3-second position lock; the opponent can block or attack but cannot move, while five extremely wide flashing red fireballs fan out one after another before homing
- `REPDOG`: summons a green python that captures the opponent, then spits a single large acid glob straight at them
- `DOGGABAL`: dashes rapidly through the opponent, spinning them for 3 seconds and immobilizing them
- `SNEK`: slithers rapidly toward the opponent, coils around them, and applies a 3-second full stun
- `SUBDOG`: snowflake projectile that freezes the opponent for 2 seconds; passive ice clone spawns every 5 seconds at SUBDOG's position, lasts 2 seconds, and freezes the opponent on contact for 2 seconds

### Combo System

- Combos reset after 800ms without a hit
- Every 12 hits increases punch damage by 1
- Every 12 hits increases kick damage by 2
- Knockback increases with combo count
- MAX COMBO triggers at 10 hits: displays "MAX COMBO" for 60 frames and pushes the opponent to the screen edge (vx=160), resetting the combo counter

### Blocking

- Reduces damage to 15%
- Reduces knockback to 20%
- Blocks all special effects: stun, freeze, capture, snake coil, harpoon pull, net capture, and snowflake freeze
- Shows a `BLOCK!` popup

### Special Meter

- `ACTIVE` special meter is the normal player-triggered special meter
- Base active-meter passive gain is `0.08` per frame
- `SKORPDOG`, `SMOWKDAWG`, `SEKDOG`, `CYDOG`, `TREMODOG`, `RAYNDOG`, `SUBDOG`, `DOGGOMELEON`, `NOOB SAIDOG`, `REPDOG`, `DOGGABAL`, and `SNEK` gain active meter at `0.25` per frame; `RAYDOG` gains active meter at `0.75` per frame
- On hit, attacker gains `damage * 0.8`
- On hurt, defender gains `damage * 0.5`
- On blocked hits, defenders gain `damage * 0.3`; `SHAO CATNIP` gains `damage * 0.5`; `BORKO` gains `damage * 0.75`
- Full active meter is required to use an active special
- Active meter blinks when ready
- `PASSIVE` special meter is shown only for fighters with passive abilities
- `RAYDOG`'s passive meter fills over 3 seconds and triggers auto-targeting arc lightning if the opponent is in range, or two skyward lightning arcs if the opponent is out of range
- `DOGGOMELEON`'s passive meter fills over 5 seconds and advances to a random ninja-type form
- `SKORPDOG`, `SMOWKDAWG`, `SEKDOG`, `CYDOG`, `TREMODOG`, `RAYNDOG`, `RAYDOG`, `SUBDOG`, `DOGGOMELEON`, `NOOB SAIDOG`, `REPDOG`, `DOGGABAL`, and `SNEK` do not gain active special meter from punch or kick hits

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
- Standard gamepads can be used as alternative controllers across menu, select, fight, pause, Battle Plan, and game-over flows

### Battle Plan

- Player selects one fighter and keeps that fighter for the full route
- Early opponents are shuffled from the roster excluding `BORKO` and `SHAO CATNIP`
- A mirror match is added unless the player selected `BORKO`
- Penultimate match is always `BORKO`
- The `BORKO` match always uses `Borko's Lair`
- Final match is always `SHAO CATNIP`
- The `SHAO CATNIP` match always uses `CATNIP's Domain`
- A route stepper appears before the first match and after each win, and scrolls to keep current progress visible
- `L` or controller Special advances from the route stepper into the next fight
- Player starts with 3 credits; on loss, a 10-second continue screen appears
- Press punch to continue (uses1 credit and resumes from current match)
- If countdown expires or no credits remain, credits reset to3 and player returns to title screen

### Win Streak

- `2 PLAYER` and `VS CPU` modes track consecutive wins per player
- Streak resets to zero when a player loses
- Streak displays in the fight HUD below the passive meters and in character select below the portrait
- Streak is hidden when zero or one

## Game States

```text
menu -> charSelect -> countdown -> fight -> roundEnd -> ... -> gameOver -> charSelect
menu -> charSelect -> battlePlanStepper -> countdown -> fight -> battlePlanStepper -> ...
fight -> continue (Battle Plan loss with credits remaining)
continue -> countdown (resume) or menu (timeout/no credits)
fight or battlePlanStepper -> paused
```

- `Esc` on the character select screen returns to the title screen
- `Esc` during a fight opens the fight pause overlay
- `Esc` during the Battle Plan stepper opens the Battle Plan pause overlay
- `Esc` while paused resumes the current fight or route stepper
- `P` during the Battle Plan stepper pauses for mode selection; `P` again resumes
- On gamepad, `Start` pauses or resumes and the right face button acts as back on menu-style screens
- In `VS CPU` game over, Player 2 pressing `Start` switches the game mode to `2 PLAYER`

## Visual Design

### Title Screen

- Dog logo above `KANINE KOMBAT`
- Tagline: `such fight. very punch. wow.`
- Mode buttons for `2 PLAYER`, `VS CPU`, and `BATTLE PLAN`
- Control boxes for both players
- No title-screen move-list panel

### Character Select

- Shared sixteen-fighter roster
- Both players manually confirm in versus mode
- In `VS CPU`, Player 2 auto-selects and auto-confirms
- In `BATTLE PLAN`, the player keeps the selected character for the whole route
- Character select also supports a random-8 cursor action on the special button
- First active gamepad claims Player 1; the next active gamepad claims Player 2
- Win streak displayed below player portraits when2+ (2 Player and VS CPU)
- Hidden fighters are absent from character select, Random 8, and unscripted CPU pools until unlocked
- Defeating the Battle Plan `BORKO` sub-boss unlocks `BORKO`; defeating the `SHAO CATNIP` final boss unlocks `SHAO CATNIP`
- Completing the Battle Plan as `NOOB SAIDOG` unlocks `SNEK`
- Unlocks persist in browser local storage; the two bosses remain explicitly scripted Battle Plan encounters rather than random route opponents

### HUD and Effects

- Health bars, active/passive special meters, timer, player names, and round dots
- Win streak counter below passive meters (2 Player and VS CPU, hidden until2+ wins)
- On gamepad, bottom face button confirms/proceeds, right face button acts as back, left face button blocks, top face button triggers special/random, and `Start` pauses or navigates to mode selection
- Hit sparks, block sparks, KO explosions, and text popups
- Screen shake and hit stop on impactful hits
- Victory and defeat poses, including flawless victory messaging

### Background

- Background stage is chosen at random at the start of each match
- Current stages:
  - `The Temple`: afternoon sky, Chinese-style temple facade, lush forest, and `KANINE KOMBAT` doors
  - `Night City`: moonlit skyline, stars, lit windows, and dark pavement
  - `Borko's Lair`: indoor sewer canal, flowing waste water, and glowing yellow eyes in the darkness
  - `CATNIP's Domain`: torchlit cave wall, scratch marks, stalactites, and a rope bridge over a dark trench

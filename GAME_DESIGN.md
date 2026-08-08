# KANINE KOMBAT - Game Design Document

## Overview

Kanine Kombat is a 2-player 2D fighting game with a six-fighter animal roster, pixel art aesthetics, and classic fighting game mechanics.

## Core Mechanics

### Characters

Players choose their fighters from a shared roster before each match.

**DOGGO CAGE**
- Color: Tan/brown (#d4a574, #f5deb3)
- Eye color: Green (#2ecc71)
- Style: Balanced
- Speed: 5, Health: 100
- Gear: Sunglasses

**BORKO**
- Color: Gray (#808080, #d3d3d3)
- Eye color: Red (#e74c3c)
- Style: Power
- Speed: 4, Health: 110

**CATNIP**
- Color: Purple (#9b59b6, #d2b4de)
- Eye color: Yellow (#f1c40f)
- Style: Speed
- Speed: 8, Health: 150

**SKORPDOG**
- Color: White body, black hoodie/vest, yellow mask
- Eye color: Red (#e74c3c)
- Style: Striker
- Speed: 5, Health: 100
- Special: Harpoon (roots SKORPDOG in place, pulls opponent into point-blank follow-up range, and stuns for 1 second)

**SEKDOG**
- Color: White body, black hoodie/vest, red mask
- Eye color: Red-pink (#ff7675)
- Style: Ambush
- Speed: 5, Health: 100
- Special: Rocket missile followed by teleport punch from behind

**SUBDOG**
- Color: White body, black hoodie/vest, light blue mask
- Eye color: Light blue (#87ceeb)
- Style: Trapper
- Speed: 5, Health: 100
- Special: Snowflake (freezes opponent for 2s, no damage)

### Combat System

**Attacks:**
| Type   | Damage | Knockback | Duration | Special Gain |
|--------|--------|-----------|----------|--------------|
| Punch  | 8      | 4         | 9 frames | 6.4          |
| Kick   | 12     | 7         | 12 frames| 9.6          |
| Special| 25     | 15        | 30 frames| 0 (consumes) |

**Special Move (Projectile):**
- DOGGO CAGE: Gold/red energy ball (25 dmg, 15 kb, speed 10)
- BORKO: Blue/purple energy ball (25 dmg, 15 kb, speed 10)
- CATNIP: Blue/purple energy ball (25 dmg, 15 kb, speed 10)
- SKORPDOG: Harpoon with chain (15 dmg, pulls opponent into point-blank range, speed 14, stuns 1s, SKORPDOG stays planted during pull)
- SEKDOG: Rocket missile (15 dmg, 5 kb, speed 14) followed by teleport punch from behind (8 dmg, 10 kb)
- SUBDOG: Snowflake (0 dmg, freezes opponent 2s, speed 8)

**Combo System:**
- Combos reset after 1200ms of no hits
- Every 3 hits increases punch damage by 2
- Every 3 hits increases kick damage by 3
- Knockback increases with combo count

**Blocking:**
- Reduces damage to 15%
- Reduces knockback to 20%
- Shows "BLOCK!" particle effect

**Special Meter:**
- Passive gain: 0.08 per frame (SKORPDOG, SEKDOG, and SUBDOG: 0.25 per frame)
- On hit: attacker gains `damage * 0.8`
- On being hit: defender gains `damage * 0.5`
- Full meter (100) enables special attack
- Meter blinks when ready to use
- SKORPDOG, SEKDOG, and SUBDOG do not gain special meter from Punch or Kick

### Physics

- Gravity: 0.65
- Jump velocity: -14
- Move speed: 5
- Ground level: 520px (from top)
- Canvas: 1024x600

### Round System

- Best of 3 rounds
- 99-second timer per round
- Win by KO or timeout (higher health wins)
- Draws are possible

### Game Modes

- Local 2-player versus
- Single player vs CPU (Player 2 uses basic AI)
- Battle Plan: a CPU gauntlet where the penultimate match is a mirror and the final opponent is CATNIP

### Game States

```
menu → charSelect → countdown → fight → roundEnd → countdown → ... → gameOver → charSelect
```

**Countdown:** `Round X` for 90 frames, then `FIGHT!` for 60 frames

**Round End:** 120-frame message display

**Game Over:** 300-frame message, then `SPACE` returns to character select

## Visual Design

### Sprite System

- Procedural canvas-based sprites
- 120x120 sprite size
- Cached per state/frame combination
- States: idle, walk, crouch, attack_punch, attack_kick, special, hit, block, ko, victory, defeat

### Animation Details

- **Idle:** Bobbing motion, tail wag, occasional tongue
- **Walk:** Leg movement animation
- **Attack:** Extended limbs with impact lines
- **Hit:** Shake effect, surprised expression
- **KO:** Circling stars
- **Victory:** Jumping while waving both arms, sparkles, happy expression
- **Defeat:** Crouching with X eyes, tongue out, circling gray stars

### Particle System

- Hit sparks: 8 particles, random colors
- Block sparks: 4 particles, blue
- KO explosion: 20 particles, radial
- Text popups: "BAM!", "BLOCK!"

### Background

- Night sky gradient (#1a0a2e → #4a2c6e)
- Crescent moon
- Twinkling stars (50 procedural)
- City buildings with lit windows
- Dark ground with texture lines

## UI Elements

### HUD

- Health bars (red/blue gradients)
- Special meters (gold/purple gradients)
- Timer (centered, yellow)
- Player names (colored)
- Round indicators (dots, 2 per player)

### Screens

**Start Screen:**
- Game title with glow effect
- "such fight. very punch. wow." tagline
- Control instructions for both players
- Mode select buttons for `2 PLAYER`, `VS CPU`, and `BATTLE PLAN`

**Character Select Screen:**
- Shared six-fighter roster
- Both players select and confirm before battle starts
- Portrait preview for each side

In `VS CPU` mode, the CPU auto-selects and auto-confirms Player 2.

In `BATTLE PLAN`, the player keeps the chosen fighter for a sequence of CPU matches, with a mirror match second-to-last and CATNIP as the final opponent.

**In-Game Messages:**
- Countdown numbers with scale animation
- Round winner announcement
- Game over with restart prompt

# KANINE KOMBAT - Development Prompts

Use these prompts to iterate on the game. Each prompt targets a specific improvement area.

Current build assumptions:
- 6 playable fighters are already present: DOGGO CAGE, BORKO, CATNIP, SKORPDOG, SEKDOG, SUBDOG
- Character select, combo counters, victory/defeat poses, and projectile-driven or teleport specials already exist
- `VS CPU` mode already exists with a basic AI opponent
- `BATTLE PLAN` mode already exists as a CPU gauntlet

## Quick Fixes

### Performance Optimization
```
The game runs at 60fps but could be smoother. Optimize the render loop:
1. Cache background elements that don't change
2. Reduce particle count if performance drops
3. Use requestAnimationFrame delta time for consistent physics
4. Profile and optimize sprite cache hits
```

### Input Responsiveness
```
Input feels slightly delayed. Improve responsiveness:
1. Buffer attack inputs during hit stun
2. Allow attack cancellation into blocking
3. Add input queue for move sequences
4. Reduce attack startup frames by 2-3
```

## Character Improvements

### Add Seventh Character
```
Add a seventh character to expand the roster beyond the current six fighters:
- Give the character a distinct silhouette, palette, and idle animation
- Add them to the character select screen and roster data
- Create a unique projectile or status-effect special
- Balance the character against DOGGO CAGE, BORKO, CATNIP, SKORPDOG, SEKDOG, and SUBDOG
```

### Deepen Character Differentiation
```
Push the current roster further apart in feel:
- Preserve DOGGO CAGE as balanced, BORKO as power, CATNIP as speed, SKORPDOG as striker, SEKDOG as ambush, SUBDOG as trapper
- Make per-character normal damage values affect actual attacks, not just roster data
- Adjust knockback, frame data, or mobility per character
- Add more distinct special attack behaviors where overlap still exists
```

### Sprite Polish
```
Improve sprite animation quality:
1. Add more frames to walk animation (currently 1-frame cycle)
2. Add anticipation frames to attacks
3. Improve hit stun expression (X eyes)
4. Add landing dust effect
5. Add afterimage on special attacks
```

## Combat System

### Enhanced Combo System
```
Implement a deeper combo system:
1. Display combo counter on screen with damage numbers
2. Add combo decay visualization (meter drains)
3. Implement juggle combos (hits on airborne opponents)
4. Add combo finisher moves for 5+ hits
5. Reset combo on block
```

### New Moves
```
Add new attack options:
1. Down+Punch: sweep attack (low hit)
2. Down+Kick: launcher (launches opponent)
3. Forward+Punch: dash punch (closes distance)
4. Back+Attack: retreating attack
5. Air attacks (punch/kick while jumping)
```

### Defense Improvements
```
Enhance defensive options:
1. Add throw/grab (close range, beats block)
2. Add parry (timing-based, high reward)
3. Add push block (costs special meter, creates space)
4. Chip damage on block for special attacks
5. Perfect block mechanic (tight timing window)
```

## Visual Effects

### Screen Effects
```
Add visual polish:
1. Slow-motion on KO hit (dramatic effect)
2. Background darkens during special attacks
3. Character flash on invincibility frames
4. Victory pose animation
5. Round transition animation
```

### Particle Improvements
```
Enhance particle effects:
1. Add hit spark variations per attack type
2. Add dust particles on landing
3. Add trail particles on fast attacks
4. Improve KO explosion with more variety
5. Add environmental particles (floating dust, fireflies)
```

### Background Enhancements
```
Make the background more dynamic:
1. Add parallax scrolling layers
2. Animated neon signs
3. Moving clouds
4. Occasional shooting star
5. Dynamic lighting on attacks
```

## Game Modes

### Single Player vs CPU
```
Expand the existing CPU opponent:
1. Add difficulty levels: easy, medium, hard
2. Improve reactions to projectiles, jumps, and specials
3. Make CPU character selection smarter or mode-dependent
4. Add CPU-only behaviors like baiting, punishing, and corner pressure
5. Add a rematch flow that can reshuffle the CPU fighter
```

### Training Mode
```
Add a training/practice mode:
1. Infinite health for both players
2. Display hitbox/hurtbox visualization
3. Frame data display
4. Combo counter with damage tracking
5. Reset positions button
```

### Tournament Mode
```
Add bracket-style tournament:
1. 4 or 8 player bracket
2. Character selection screen
3. Win tracking across matches
4. Final winner celebration
```

## Audio

### Sound Design Polish
```
Expand the existing Web Audio soundscape:
1. Add more sound variation per move and character
2. Layer stronger impact sounds for heavy hits and specials
3. Improve freeze, block, and KO cues with richer textures
4. Add round transition stingers and victory fanfares
5. Add stage-specific music variations
```

### Audio System Expansion
```
Build on the current fixed audio mix and music loop:
1. Add separate music and SFX volume sliders if player-facing controls become desirable again
2. Cross-fade between menu, select, and fight tracks
3. Add sound pooling or voice limiting for rapid effects
4. Persist richer audio preferences
```

## UI/UX

### Character Select Polish
```
Improve the existing character select flow:
1. Add clearer lock-in feedback for both players
2. Display richer stat and special-move descriptions
3. Add random select option
4. Prevent mirror matches only if it improves game feel
5. Add a stage preview or stage select follow-up
```

### Pause Menu
```
Add pause functionality:
1. Pause on ESC or P key
2. Show pause overlay with options
3. Resume, Restart, Quit to menu
4. Volume controls in pause menu
```

### Score Tracking
```
Add persistent stats:
1. Track wins per player using localStorage
2. Display win streak
3. Match history (last 10 matches)
4. Reset stats option
```

## Technical

### Code Structure
```
Refactor for maintainability:
1. Separate into modules (game.js, fighter.js, effects.js, ui.js)
2. Use ES6 classes properly
3. Add configuration object for tuning values
4. Implement proper state machine pattern
```

### Mobile Support
```
Add touch controls for mobile:
1. Virtual joystick for movement
2. Attack buttons on screen
3. Responsive canvas scaling
4. Touch-friendly UI elements
```

### Replay System
```
Add match replay:
1. Record input sequences per frame
2. Replay button after match
3. Save replay to localStorage
4. Share replay as encoded string
```

## Balance Tuning

### Quick Balance Changes
```
Tune these values for better gameplay feel:
- GRAVITY: 0.65 → 0.7 (faster falls)
- Jump velocity: -14 → -15 (higher jumps)
- Move speed: 5 → 5.5 (faster movement)
- Special passive gain: 0.08 → 0.1 (faster meter)
- Punch damage: 8 → 7 (less chip damage)
- Kick damage: 12 → 13 (reward spacing)
```

### Frame Data Adjustment
```
Adjust attack frame data:
- Punch: 9 frames (already reduced from 18)
- Kick: 12 frames (already reduced from 24)
- Special: 30 → 25 frames (faster recovery)
- Hit stun: 20 → 22 frames (longer combos)
- Block stun: 10 → 12 frames (safer blocks)
```

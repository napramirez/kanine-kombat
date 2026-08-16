# KANINE KOMBAT - Development Prompts

Use these prompts to iterate on the current game.

## Current Build Assumptions

- 12 fighters are present: 10 are initially selectable, while `BORKO` unlocks after defeating the Battle Plan sub-boss and `SHAO CATNIP` unlocks after defeating the Battle Plan final boss
- Character select, combo counters, victory and defeat poses, and character-specific specials already exist
- The HUD now includes `ACTIVE` special meters and conditional `PASSIVE` special meters for passive-special fighters
- Standard gamepads now work as alternative controllers across the main game states
- `VS CPU` already exists with a basic AI opponent
- `BATTLE PLAN` already exists with a route stepper, a `BORKO` sub-boss, and a `SHAO CATNIP` final fight
- Pause functionality already exists on `Esc` during fights and Battle Plan stepper screens

## Quick Fixes

### Performance Optimization

```text
The game runs at 60fps but could be smoother. Optimize the render loop:
1. Cache background elements that do not change.
2. Reduce particle count if performance drops.
3. Use requestAnimationFrame delta time for more consistent motion.
4. Profile and improve sprite-cache hit rates.
```

### Input Responsiveness

```text
Input feels slightly delayed. Improve responsiveness:
1. Buffer attack inputs during hit stun.
2. Allow attack cancellation into blocking.
3. Add a simple input queue for move sequences.
4. Reduce attack startup frames by 2-3 where it improves feel.
```

## Character Improvements

### Add Another Character

```text
Add another character to expand the roster beyond the current twelve fighters:
- Give the character a distinct silhouette, palette, and idle animation.
- Add them to character select and roster data.
- Create a unique projectile, trap, or status-effect special.
- Balance the character against the full current roster.
```

### Deepen Character Differentiation

```text
Push the current roster further apart in feel:
- Preserve DOGGO CAGE as balanced, BORKO as power, SHAO CATNIP as speed, SKORPDOG as striker, SEKDOG as ambush, CYDOG and SUBDOG as trappers, TREMODOG as quake/control, RAYNDOG as storm/control, RAYDOG as arc/control, DOGGOMELEON as shift, and NOOB SAIDOG as shadow/control.
- Make per-character normal damage values affect actual attacks, not just roster data.
- Adjust knockback, frame data, or mobility per character.
- Add more distinct special attack behaviors where overlap still exists.
```

### Sprite Polish

```text
Improve sprite animation quality:
1. Add more frames to walk animation.
2. Add anticipation frames to attacks.
3. Improve hit-stun expression.
4. Add landing dust.
5. Add afterimages on fast specials.
```

## Combat System

### Enhanced Combo System

```text
Implement a deeper combo system:
1. Display combo damage along with hit count.
2. Add combo decay visualization.
3. Implement juggle combos on airborne opponents.
4. Add combo finisher behavior on long strings.
5. Reset combos on block.
```

### New Moves

```text
Add new attack options:
1. Down+Punch: sweep attack.
2. Down+Kick: launcher.
3. Forward+Punch: dash punch.
4. Back+Attack: retreating strike.
5. Air attacks while jumping.
```

### Defense Improvements

```text
Enhance defensive options:
1. Add throw or grab to beat block.
2. Add a timing-based parry.
3. Add push block that costs meter.
4. Add chip damage on blocked specials.
5. Add a perfect block window.
```

## Visual Effects

### Screen Effects

```text
Add visual polish:
1. Slow motion on KO hits.
2. Background darkening during specials.
3. Character flashes on invincibility frames.
4. Round transition animation.
5. Stronger win-screen presentation.
```

### Particle Improvements

```text
Enhance particle effects:
1. Add hit-spark variations by attack type.
2. Add dust particles on landing.
3. Add trail particles on fast attacks.
4. Improve KO explosion variety.
5. Add subtle environmental particles.
```

### Background Enhancements

```text
Make the background more dynamic:
1. Add parallax layers.
2. Add animated neon signs.
3. Add moving clouds.
4. Add occasional shooting stars.
5. Add dynamic lighting on attacks.
```

## Game Modes

### Single Player vs CPU

```text
Expand the existing CPU opponent:
1. Add difficulty levels.
2. Improve reactions to projectiles, jumps, and specials.
3. Make CPU character selection mode-dependent.
4. Add baiting, punishes, and corner pressure.
5. Add rematch flow that can reshuffle the CPU fighter.
```

### Training Mode

```text
Add training mode:
1. Infinite health for both players.
2. Hitbox and hurtbox visualization.
3. Frame-data display.
4. Combo damage tracking.
5. Position reset.
```

### Tournament Mode

```text
Add bracket-style tournament:
1. 4-player or 8-player bracket.
2. Character selection between matches.
3. Win tracking across the bracket.
4. Final winner celebration.
```

## Audio

### Sound Design Polish

```text
Expand the existing Web Audio soundscape:
1. Add more sound variation per move and character.
2. Layer stronger impact sounds for heavy hits and specials.
3. Improve freeze, block, and KO cues.
4. Add round-transition stingers and victory fanfares.
5. Add stage-specific music variations.
```

### Audio System Expansion

```text
Build on the current fixed audio mix and music-loop hooks:
1. Add separate music and SFX volume sliders if player-facing controls are reintroduced.
2. Cross-fade menu, select, and fight tracks.
3. Add sound pooling or voice limiting.
4. Persist richer audio preferences.
```

## UI / UX

### Character Select Polish

```text
Improve the current character-select flow:
1. Add clearer lock-in feedback for both players.
2. Display richer stat and special-move descriptions.
3. Add a random-select option.
4. Revisit mirror-match rules only if it improves feel.
5. Add stage preview or stage select follow-up.
```

### Pause Menu

```text
Improve the existing pause flow:
1. Keep `Esc` pause and resume behavior.
2. Expand the pause overlay with restart or quit actions if they improve flow.
3. Consider lightweight audio controls in the pause overlay.
4. Make pause copy clearer for Battle Plan route resumes.
```

### Score Tracking

```text
Add persistent stats:
1. Track wins per player with localStorage.
2. Display win streaks.
3. Store recent match history.
4. Add a reset-stats option.
```

## Technical

### Code Structure

```text
Refactor for maintainability:
1. Separate the single-file game into modules.
2. Centralize tuning values.
3. Formalize the state machine.
4. Preserve current behavior while reducing file size pressure in `index.html`.
```

### Mobile Support

```text
Add touch controls for mobile:
1. Virtual joystick for movement.
2. Attack buttons on screen.
3. Responsive canvas scaling.
4. Touch-friendly menu and pause targets.
```

### Replay System

```text
Add match replay:
1. Record player inputs per frame.
2. Re-simulate matches deterministically.
3. Add replay playback controls.
4. Preserve enough state for specials and route transitions.
```

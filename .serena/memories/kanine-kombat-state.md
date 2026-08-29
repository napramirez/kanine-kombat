# Kanine Kombat - Current State

## Roster (15 fighters)
DOGGO CAGE, BORKO (hidden), SHAO CATNIP (hidden), SKORPDOG, SEKDOG, CYDOG, TREMODOG, RAYNDOG, RAYDOG, DOGGOMELEON, NOOB SAIDOG, REPDOG, DOGGABAL, SNEK (hidden), SUBDOG

## Hidden Character Unlocks
- BORKO: defeat Battle Plan sub-boss
- SHAO CATNIP: defeat Battle Plan final boss
- SNEK: complete Battle Plan as NOOB SAIDOG

## Code Structure
Modularized into `src/` with `bash src/build.sh` assembling `index.html`.
- `src/js/01-config.js` - COMBAT, PHYSICS, enums
- `src/js/03-sprites.js` - sprite drawing
- `src/js/04-fighter.js` - Fighter class
- `src/js/06-projectiles.js` - projectile spawn/update/draw
- `src/js/08-characters.js` - CHARACTERS array, unlock system
- `src/js/12-combat.js` - char select, combat, round mgmt

## Recent Changes
- Removed KA-9 character entirely
- DOGGABAL: dash-past-spin-immobilize special, opponent spins like top
- Blocking prevents ALL special effects (stun, freeze, capture, snake, harpoon, net, snowflake)
- Stunned/frozen fighters fall to ground (gravity applies)
- Title screen and pause screen have keyboard controls (arrows + Enter/Space)
- Character select uses 4 columns
- Punch: 4 damage, 6 frames; Kick: 6 damage, 4 frames
- Combo boost every 12 hits (+1 punch, +2 kick), reset 800ms
- SNEK: bite/punch, tail-whip/kick, coiled block, 2x longer body
- REPDOG: green masked NOOB SAIDOG variant, acid glob projectile
- NOOB SAIDOG/REPDOG snake retreats when blocked

## Documentation
README.md, GAME_DESIGN.md, ROADMAP.md, DEVELOPMENT_PROMPTS.md, BUG_TRACKER.md, CONTROLS.md - all updated to match reality.

# KANINE KOMBAT - Development Roadmap

## Phase 1: Polish & Balance

- [x] Tune combat values for better feel
- [x] Add hit pause on special attacks
- [x] Improve combo counter display
- [x] Add victory pose animation
- [ ] Fix edge cases in corner combat

## Phase 2: Content Expansion

- [x] Character select screen
- [x] Third character (`SHAO CATNIP`)
- [x] Fourth character (`SKORPDOG`)
- [x] Fifth character (`SUBDOG`)
- [x] Sixth character (`SEKDOG`)
- [x] Seventh character (`CYDOG`)
- [x] Eighth character (`TREMODOG`)
- [x] Character-specific stats and movesets
- [ ] 3 new background stages
- [ ] Stage selection

## Phase 3: Game Modes

- [x] Single player vs CPU
- [x] Battle Plan gauntlet mode
- [x] Battle Plan route stepper between matches
- [x] Pause overlay with mode switching
- [ ] Training mode hitbox display
- [ ] Tournament bracket mode
- [ ] Team battle (2v2)

## Phase 4: Audio & Effects

- [x] Web Audio API sound system
- [x] Attack sound effects
- [x] Background music hooks
- [x] Title screen logo
- [ ] Enhanced particle system
- [ ] Screen effects (slow-mo, zoom)

## Phase 5: Technical Improvements

- [ ] Code modularization
- [ ] Mobile touch controls
- [ ] Replay system
- [ ] Online multiplayer (WebRTC)
- [ ] Performance optimization

## Phase 6: Meta Features

- [ ] Character unlockables
- [ ] Achievement system
- [ ] Leaderboard (local storage)
- [ ] Custom controls
- [ ] Accessibility options

## Priority Queue

1. Training mode
2. Tournament mode
3. Background stages
4. Enhanced particle system
5. Online multiplayer

## Current Build Notes

- Roster is now 8 fighters: `DOGGO CAGE`, `BORKO`, `SHAO CATNIP`, `SKORPDOG`, `SEKDOG`, `CYDOG`, `TREMODOG`, and `SUBDOG`
- `CYDOG` uses a bomb-and-net capture special
- `TREMODOG` uses a planted floor shockwave special stance
- `SHAO CATNIP` is the current final Battle Plan opponent
- `BORKO` is the current Battle Plan sub-boss
- `Esc` pause flow exists for fights and Battle Plan stepper screens

## Version History

### v0.3.7 - Harpoon Stun Update

- `SKORPDOG` harpoon now applies a 1-second `STUNNED` state on hit
- Stunned opponents cannot move, attack, or use specials

### v0.3.6 - Battle Plan Update

- Added `BATTLE PLAN` mode on the title screen
- Battle Plan chains CPU matches using the player's selected fighter
- Penultimate match is `BORKO`
- Final match is `SHAO CATNIP`

### v0.3.5 - CPU Update

- `VS CPU` auto-selects and auto-confirms Player 2
- Added basic AI that approaches, blocks, retreats, jumps, and attacks

### v0.3.4 - Ambush Fighter Update

- Sixth playable fighter: `SEKDOG`
- `SEKDOG` uses SKORPDOG-inspired visuals with red gear accents
- `SEKDOG` special launches a missile and follows with a behind-the-back teleport punch

### v0.3.3 - Audio Mix Update

- Removed on-screen audio controls
- Audio now runs at a fixed full-output mix
- Rebalanced move SFX against BGM

### v0.3.2 - Audio System Update

- Added synthesized Web Audio API SFX
- Added background music loop hooks
- Added audio cues for UI, countdown, attacks, blocks, freeze, and KO moments

### v0.3.1 - Roster Expansion Update

- Fifth playable fighter: `SUBDOG`
- Character select updated for the larger roster
- `SUBDOG` special freezes the opponent for 2 seconds
- Game Over returns players to character select

### v0.3.0 - Balance Controls Update

- Block button changed to `H` for P1 and `4` for P2
- Punch duration reduced from 18 to 9 frames
- Kick duration reduced from 24 to 12 frames
- Nonstandard special-meter fighters no longer gain meter from punch or kick
- Round intro changed to `Round X` then `FIGHT!`

### v0.2.0 - Character Select & New Fighters

- Added character select portraits
- Expanded to 4 characters: `DOGGO CAGE`, `BORKO`, `SHAO CATNIP`, `SKORPDOG`
- Added character-specific stats and movesets
- Added combo counter display
- Added special meter blink when ready
- Added flawless victory messaging

### v0.1.0 - Initial Release

- 2 characters: `DOGGO CAGE`, `BORKO`
- Basic combat system
- Round system
- Particle effects

# KANINE KOMBAT - Development Roadmap

## Phase 1: Polish & Balance

- [x] Tune combat values for better feel
- [x] Add hit pause on special attacks
- [x] Improve combo counter display
- [x] Add victory pose animation
- [ ] Fix edge cases in corner combat

## Phase 2: Content Expansion

- [x] Character select screen
- [x] Third character (CATNIP)
- [x] Fourth character (SKORPDOG)
- [x] Fifth character (SUBDOG)
- [x] Sixth character (SEKDOG)
- [x] Character-specific stats/movesets
- [ ] 3 new background stages
- [ ] Stage selection

## Phase 3: Game Modes

- [x] Single player vs CPU (basic AI)
- [x] Battle Plan gauntlet mode
- [ ] Training mode with hitbox display
- [ ] Tournament bracket mode
- [ ] Team battle (2v2)

## Phase 4: Audio & Effects

- [x] Web Audio API sound system
- [x] Attack sound effects
- [x] Background music (chiptune)
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

---

## Priority Queue

1. **High:** Training mode
2. **Medium:** Tournament mode
3. **Medium:** Background stages
4. **Medium:** Enhanced particle system
5. **Low:** Online multiplayer

## Version History

**v0.3.7** - Harpoon Stun Update
- SKORPDOG harpoon now applies a 1-second `STUNNED` state on hit
- Stunned opponents cannot move, attack, or use specials

**v0.3.6** - Battle Plan Update
- Added `BATTLE PLAN` mode on the title screen
- Battle Plan chains CPU matches using the player's selected fighter
- The second-to-last match is a mirror match
- CATNIP is always the final opponent

**v0.3.5** - CPU Battle Update
- Added `VS CPU` mode on the title screen
- CPU auto-selects a fighter and controls Player 2 in battle
- Basic AI can approach, block, retreat, jump, and use attacks/specials

**v0.3.4** - Ambush Fighter Update
- Sixth playable fighter: SEKDOG
- SEKDOG uses SKORPDOG-inspired visuals with red gear accents
- SEKDOG special launches a missile, then performs a behind-the-back teleport punch

**v0.3.3** - Audio Mix Update
- Removed on-screen audio controls
- Audio now runs fixed at full output
- Rebalanced mix so move SFX cut through the BGM more clearly

**v0.3.2** - Audio System Update
- Web Audio API sound system with synthesized SFX
- Chiptune-style background music loop
- Audio cues for UI, countdown, attacks, blocks, freeze, and KO moments
- Title-screen and round BGM file hooks

**v0.3.1** - Roster Expansion Update
- Fifth playable fighter: SUBDOG
- Character select now reflects a 5-fighter roster
- SUBDOG special freezes the opponent for 2 seconds
- Game Over restart returns players to character select

**v0.3.0** - Balance & Controls Update
- Block button changed: P1 Shift → H, P2 Enter → 4
- Punch duration reduced: 18 → 9 frames
- Kick duration reduced: 24 → 12 frames
- SKORPDOG and SUBDOG no longer gain special from Punch/Kick
- Round countdown changed to "Round X" then "Fight!"

**v0.2.0** - Character Select & New Fighters
- Character select screen with portraits
- 4 characters (DOGGO CAGE, BORKO, CATNIP, SKORPDOG)
- Character-specific stats and movesets
- Combo counter display (2+ hits)
- Special meter blink when ready
- Flawless Victory for no-damage wins
- Projectile-based special attacks

**v0.1.0** - Initial release
- 2 characters (DOGGO CAGE, BORKO)
- Basic combat system
- Round system
- Particle effects

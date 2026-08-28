# KANINE KOMBAT - Bug Tracker

## Known Issues

### High Priority

None currently tracked.

### Medium Priority

- [ ] **Sprite cache grows unbounded** - Cache never clears, potential memory issue on long sessions
- [ ] **Timer not pausing on tab switch** - Game timer continues when browser tab is inactive
- [ ] **Attack boxes inconsistent at edges** - Hit detection unreliable near screen boundaries

### Low Priority

- [ ] **Particle count not capped** - Many simultaneous hits could spawn excessive particles
- [ ] **Round dots reset timing** - Dots update slightly before message appears

---

## Fixed Issues

- [x] **Special move deals no damage** - Converted to projectile attack system, removed melee hitbox dependency
- [x] **No visual feedback for special ready** - Meter now blinks when at 100%
- [x] **Initial release bugs** - N/A (first version)

---

## Bug Report Template

```markdown
### Bug Title
**Severity:** High / Medium / Low
**Description:** What happened
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3
**Expected Behavior:** What should happen
**Actual Behavior:** What actually happened
**Screenshot/Video:** (if applicable)
```

---

## Testing Checklist

### Combat
- [ ] All attacks deal correct damage
- [ ] Blocking reduces damage correctly
- [ ] Special meter fills correctly
- [ ] Combos register and reset properly
- [ ] Knockback direction is correct
- [ ] NOOB SAIDOG snake applies a 3-second position lock that prevents movement but allows blocking and attacks
- [ ] NOOB SAIDOG resumes normal movement and jumping after the 3-second snake coil; the simultaneous five-projectile barrage deals 10 total damage
- [ ] NOOB SAIDOG special and five-projectile volley work while airborne, with the fireballs fanning out extremely wide before homing and the snake coiling from behind
- [ ] REPDOG acid glob travels straight without homing
- [ ] KA-9 knives zigzag toward the opponent
- [ ] BORKO and SHAO CATNIP are hidden from character select, Random 8, and regular CPU pools before their Battle Plan defeats
- [ ] Defeating the BORKO sub-boss and SHAO CATNIP final boss unlocks the correct fighter and shows the unlock message
- [ ] Hidden-character unlocks persist after returning to the title screen and reopening the game
- [ ] SNEK remains hidden until the Battle Plan is completed as NOOB SAIDOG
- [ ] SNEK has bite animation on punch, tail-whip animation on kick, and coiled block animation
- [ ] SNEK body is 2x longer with pointy tail tip
- [ ] REPDOG has green vest/mask, black hoodie/legs, yellow glowing eyes, and red snake tongue
- [ ] REPDOG special summons a green python and spits a single large acid glob
- [ ] KA-9 has brown body stripe, split gray/white face, and flashing infrared eye
- [ ] KA-9 special throws 2 zigzag-pattern knives

### Movement
- [ ] Jump height is consistent
- [ ] Ground collision works
- [ ] Wall boundaries work
- [ ] Crouch hitbox is correct
- [ ] Facing direction updates

### UI
- [ ] Health bars update correctly
- [ ] Timer counts down
- [ ] Round dots update
- [ ] Messages display properly
- [ ] Game restarts cleanly
- [ ] Gamepad focus and prompts stay correct across title, select, pause, and Battle Plan screens

### Edge Cases
- [ ] Both players KO simultaneously
- [ ] Timer runs out during attack
- [ ] Both players at 0 health
- [ ] Rapid input during transitions
- [ ] Long play sessions (memory)
- [ ] Gamepad disconnects clear held input cleanly
- [ ] Two connected gamepads keep stable P1/P2 assignment
- [ ] Mixed keyboard and gamepad input do not cancel each other incorrectly
- [ ] NOOB SAIDOG mirror matches keep snake and barrage ownership separate
- [ ] NOOB SAIDOG special state clears between rounds and after KO

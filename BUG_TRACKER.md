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
- [ ] NOOB SAIDOG resumes normal movement and jumping after the leg-latching snake capture; the simultaneous five-projectile barrage deals 10 total damage
- [ ] NOOB SAIDOG special and five-projectile volley work while airborne, with the fireballs fanning out extremely wide before homing and the snake latching from behind

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

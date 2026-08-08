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

### Edge Cases
- [ ] Both players KO simultaneously
- [ ] Timer runs out during attack
- [ ] Both players at 0 health
- [ ] Rapid input during transitions
- [ ] Long play sessions (memory)

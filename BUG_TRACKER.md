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
- [ ] NOOB SAIDOG resumes normal movement and jumping after the 3-second snake coil; the staggered five-projectile barrage deals 10 total damage
- [ ] NOOB SAIDOG special and five-projectile volley work while airborne, with the fireballs fanning out extremely wide before homing and the snake coiling from behind
- [ ] REPDOG acid glob travels straight without homing
- [ ] DOGGABAL dashes through opponent and spins them for 3 seconds
- [ ] BORKO and SHAO CATNIP are hidden from character select, Random 8, and regular CPU pools before their Battle Plan defeats
- [ ] Defeating the BORKO sub-boss and SHAO CATNIP final boss unlocks the correct fighter and shows the unlock message
- [ ] Hidden-character unlocks persist after returning to the title screen and reopening the game
- [ ] SNEK remains hidden until the Battle Plan is completed as NOOB SAIDOG
- [ ] SNEK has bite animation on punch, tail-whip animation on kick, and coiled block animation
- [ ] SNEK body is 2x longer with pointy tail tip
- [ ] REPDOG has green vest/mask, black hoodie/legs, yellow glowing eyes, and red snake tongue
- [ ] REPDOG special summons a green python and spits a single large acid glob
- [ ] SMOWKDAWG has gray gear (vest, mask) instead of SKORPDOG's yellow
- [ ] SMOWKDAWG harpoon is gray-colored and pulls opponent like SKORPDOG
- [ ] DOGGABAL has olive green vertical stripe, brown horizontal stripe, and oxygen mask
- [ ] SUBDOG passive ice clone spawns every 5 seconds, lasts 2 seconds, and freezes opponent on contact for 2 seconds
- [ ] SUBDOG ice clone can be blocked by the opponent
- [ ] MAX COMBO triggers at 10 hits, displays "MAX COMBO" text, and pushes both fighters apart
- [ ] Defeated fighters immediately show defeat pose (crossed eyes, tongue, stars) and cannot attack, take damage, gain meter, or activate specials
- [ ] Health <= 0 guards prevent dead fighters from attacking, being hit, or gaining meter
- [ ] PIXZEL ZLASZH has black body, V-shaped red visor, and rainbow outline glow
- [ ] PIXZEL ZLASZH spawns red glowing pixel squares from feet
- [ ] PIXZEL ZLASZH active special steals opponent's passive or active at random
- [ ] PIXZEL ZLASZH falls back to black katana slash when opponent has no passive to steal
- [ ] PIXZEL ZLASZH katana slash has red pixel square trail
- [ ] PIXZEL ZLASZH stolen passive re-triggers periodically during steal duration
- [ ] PIXZEL ZLASZH is hidden until Battle Plan is completed as DOGGOMELEON
- [ ] PIXZEL ZLASZH unlock persists after returning to title screen and reopening game
- [ ] SKORPDOG passive fire spit burns opponent for 3 seconds
- [ ] SKORPDOG skull face appears when fire is in flight, reverts to normal face on hit
- [ ] KANOINE orbiting daggers home toward opponent on proximity

### Team VS Team
- [ ] Team HUD displays health, special, passive, and combo for all 4 fighters
- [ ] Team round wins tracked separately (best of 3)
- [ ] Friendly fire prevention: teammates cannot damage each other (melee, projectiles, specials)
- [ ] CPU targets closest human opponent
- [ ] Humans can freely attack either CPU opponent
- [ ] Defeated team members show defeat pose and cannot continue fighting
- [ ] Defeated team members stay in defeat pose when their team wins the round
- [ ] Team mode character select allows both P1 and P2 to pick fighters
- [ ] CPU fighters are randomly pre-selected on the opposing side

### MAKDOG
- [ ] Eye glow phase flashes green
- [ ] Lift phase raises opponent 220px
- [ ] Hold phase suspends opponent
- [ ] Slam phase deals 30 damage, 8 knockback, 1-second stun
- [ ] Opponent immobilized during entire grapple sequence

### KANOINE
- [ ] Active special is a dash-punch that flies through opponent
- [ ] Passive daggers spawn every 5 seconds, last 2 seconds
- [ ] Daggers home toward opponent within 300px range, dealing 5 damage each

### SMOWKDAWG Passive
- [ ] Smoke cloud spawns every 8 seconds, lasts 3 seconds
- [ ] Movement speed doubles during smoke cloud
- [ ] Jump velocity boosted by 25% during smoke cloud
- [ ] SMOWKDAWG becomes nearly invisible (15% opacity) during smoke cloud

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
- [ ] Battle Plan continue screen shows on loss with 10-second countdown
- [ ] Pressing punch on continue screen uses 1 credit and resumes match
- [ ] Continue countdown expires and returns to title screen
- [ ] Credits reset to 3 when depleted or starting new Battle Plan
- [ ] Win streak tracks consecutive wins in 2 Player mode
- [ ] Win streak tracks P1 wins in VS CPU mode (no CPU streak)
- [ ] Win streak resets when player loses
- [ ] Win streak displays in fight HUD and character select when2+
- [ ] Win streak hidden when0 or1

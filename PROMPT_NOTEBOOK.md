# Prompt Notebook

## Learning Prompts

Analyze this directory `kanine-kombat` and understand the Markdown files. Tell me what you think before we start changing things.

## Implementation Prompts

### Character Creation

Create a new character named "SEKDOG" based on SKORPDOG's visual design but use red instead of yellow colors for his gear. His special move is a two-step action: first, launch a rocket missile projectile with damage the same as SKORPDOG's harpoon; second, SEKDOG will do a teleport-punch by dipping down the screen until he disappears then reappears behind the opponent coming from the bottommost of the screen while delivering a single punch that knocks the opponent back

Create a new character named "CYDOG" based on SEKDOG's visual design but use yellow instead of red colors for his gear. His special move is a two-step action: first, launch a green net projectile with no damage but renders the opponent immobile while bringing the captured opponent closer to CYDOG; second, CYDOG will drop a yellow spherical bomb between CYDOG and the captured opponent that detonates in 2 seconds with damage of 15

Create a new character called "TREMDOG", based on SKORPDOG's appearance, replace all of TREMDOG's yellow parts to brown, and his special move lasts for 15 seconds and is the ability to summon pink flashing shockwaves across the whole floor, which both damages and immobilizes the opponent. Resize him to 30% big, like CATNIP and BORKO.

Create a new character called "RAYNDOG", based on SKORPDOG's visual appearance, but his yellow gear is replaced with purple. his special move is to summon a lightning cloud to zap his opponent with lightning for 3 seconds

Create a new character named "RAYDOG" based on DOGGO CAGE but without sunglasses. His outfit is all white. His eyes are silver. His gear includes a brown conical hat, a blue apron that is outlined black. His passive special gain is 0.4. His special move is him blasting an arc lightning that always hits the opponent with damage 5.

Create a new character named "DOGGOMELEON" based on SKORPDOG's visual appearance but all the yellow parts are replaced with flashing rainbow colors. His passive special move is the ability to turn into SKORPDOG, SUBDOG, TREMODOG or RAYNDOG and gain their visual appearance and special abilities for 8 seconds before automatically changing again to the next character.  

Implement a new character named "NOOB SAIDOG" based on SKORPDOG's appearance but all the yellow is replaced with black. His eyes are a fully flashing vibrant red, with no visible white part. His special move is a two step action; first, he will summon a giant solid black snake coming out of the ground, only the head and neck of the snake visible. The purpose of this is to immobilize the opponent for 5 seconds. Next; while the opponent is immobilized, he will launch a barrage of flashing red fireballs at the opponent.

Implement a new hidden character named "SNEK" based on NOOB SAIDOG's snake's appearance in his special move. the only way to unlock SNEK is to defeat SHAO CATNIP in both rounds of the battle plan showdown flawlessly as NOOB SAIDOG. SNEK's special move is to slither really fast towards the opponent and coil around the opponent and stun the opponent. The coil lasts for 3 seconds.

Implement a new character named "REPDOG" based on NOOB SAIDOG's visual appearance but his black mask and vest are replaced with a grassy green color. His eyes glow yellow instead of red, and has a red snake tongue on his mask. his special move is the same as NOOB SAIDOG's but the snake is green instead of black and its eyes are yellow. instead of shooting flashing red fireballs, he will spit a barrage of glowing green acid projectiles.

Implement a new character called "KA-9", who does not have any related visual appearance. he is a white dog, with a thick brown horizontal stripe on his body.  The left half of his face is gray, only on the gray side has a flashing red eye. This will be his "Infrared Eye". The other eye is a normal white eye with a black pupil. His special move is to throw 2 knives going in a zigzag pattern.

Implement a new character named "DOGGABAL" who has no similar visual appearance to anyone. he is a black dog with a thick, vertical olive green stripe running down his body. he also has a thick, horizontal brown stripe running across his body. he has an oxygen mask on his face.

### Battle Stage Creation

Implement a new background stage named "Borko's Lair". The setting is indoor, in the sewers so the time of day does not matter. At the background is a canal with flowing sewer water. There is a dark area with glowing yellow eyes in the darkness.

Implement a new background stage named "CATNIP's Domain". The setting is inside a cave, so the time of day does not matter. The fighters will fight atop a rope bridge suspended above a trench. The background is a cave wall illuminated by torches, with scratch marks and stalactites on the ceiling. Beneath the rope bride is dark.

## Behavior Update

Change BORKO's special move. When performed, remember the position of the opponent. BORKO will jump very high towards that remembered position. When BORKO lands, it causes a shockwave within the radius of that position. If the opponent is caught within that radius, the opponent will get stunned for 1 second and receive 10 damage.

In the Battle Plan game mode, after the character selection screen, present a stepper visualization of the sequence of matches and who the player will fight next. Animate the portrait of the player's character to move from the previously won match to point to the next. Display this stepper after every successful match, before the next match. Wait for the player to press space bar to proceed to the next match

Set a track for character selection background music that loops

Implement hidden characters, these are characters that cannot be selected by players in the character select screen. These characters also do not get chosen to be part of the battle plan unless specifically set so. Hidden characters can be unlocked, and selected in the character select screen only after certain conditions are met. The hidden characters include: SHAO CATNIP and BORKO who can be unlocked only after defeating them in the Battle Plan mode.

When a special move is blocked, do not display the special move's effects because they don't activate. Here are examples:
- BORKO's special move should not display STUNNED when it is blocked
- SKORPDOG's spear should not pull the opponent if the opponent blocked the harpoon
- NOOB SAIDOG's and REPDOG's special move should not capture the opponent if the opponent blocks it
- DOGGABAL's special move should not display STUNNED when it is blocked.
Fix wherever else it applies.

Allow player controls in the game mode screen.
Fit the characters into 4 columns instead of 3 in the character select screen.

Change RAYDOG's active special move. RAYDOG will now fly like Superman with front limbs towards the opponent and back limbs pointing the opposite direction.

If unblocked:

- The opponent will be briefly immobile and RAYDOG will continue to fly while pushing the opponent along the end of the screen
- Deal 10 damage to the opponent and stun for 1 second
- Shake the screen on impact to the edge of the screen, then spin and hurl RAYDOG backwards

If blocked:

- spin and hurl RAYDOG backwards

## Game System Feature

### Battle Plan Credits

Implement a new feature in Battle Plan mode. The player starts with 3 credits. Every time a player loses a match, display a countdown of 10 seconds and ask the player whether the player wants to continue. The player can choose to continue by pressing the punch button. If the countdown hits zero, that means the player did not want to continue. If the player chose to continue, use up 1 credit to resume the Battle Plan from where the player lost. If the player did choose to continue, the amount of credits reset and is brought back to the main screen.

### Winning Streaks

Implement a new feature in 2 Player mode. Count the number of consecutive wins a player has won in 2 Player matches. If the player loses a match, reset the streak to zero. Display the win streak during the match right below the health, active special and passive special meters. Do not display if the streak is zero. Also display the streak in the character select screen, right below the player portrait if it is not zero.

## Game System Overhaul

### Query Prompt

What kind of visual elements and artifacts are needed to build a 2d game?

### Sample Response

For a 2D game, you typically need:

Core Visual Assets

- Sprites - Character, NPC, and object animations (idle, walk, attack, etc.)
- Tilesets - Reusable tiles for terrain, platforms, walls, floors
- Backgrounds - Parallax layers, skyboxes, static/dynamic scenes
- UI elements - Buttons, health bars, menus, dialogue boxes, fonts

Effects & Polish

- Particle effects - Explosions, dust, sparks, magic
- Lighting - Glow effects, shadows, day/night cycles
- VFX - Screen transitions, hit flashes, shaders

Supporting Assets

- Sprite sheets / Texture atlases - Packed images for performance
- Animation data - Frame sequences, skeletal rigs (e.g., Spine, DragonBones)
- Maps/Levels - Tilemap data (TMX, JSON) defining level layouts
- Icons - Inventory items, abilities, collectibles

Audio (related)

- Sound effects - Actions, ambient, UI feedback
- Music - Background tracks, dynamic/stems

Formats commonly used: PNG, SVG (sprites), JSON/XML (atlases, maps), TMX (Tiled maps), .tres/.tscn (Godot), .prefab (Unity)

### Query Prompt

In the current codebase, instead of redrawing graphic objects on the canvas, analyze the graphics rendering subsystem and assess what it is going to take and how it will be like if the graphic objects were to be reimplemented with sprite sheets

### Sample Response

Now I have a complete picture. Here's my analysis:

Graphics Rendering Subsystem Analysis: Current State vs Sprite Sheet Migration

Current Rendering Architecture

The game uses 100% procedural Canvas 2D drawing — every visual element is composed at runtime via ctx.fillRect(), ctx.ellipse(), ctx.bezierCurveTo(), ctx.arc(), gradients, and strokes. There are zero image assets for game graphics.

Key rendering components:

| Component               | Location (approx lines)	| Description |
| ---                     | ---                     | ---         |
| createDogSprite()	      | 2056–3095 | ~1040 lines — the monolithic fighter sprite renderer |
| drawSnekSprite()	      | 1986–2054 | Snek character (unique body type) |
| drawProjectiles()	      | 4604–5166 | ~560 lines — all projectile visuals (harpoon, net, bomb, snowflake, lightning, fireballs, shockwaves, missiles, snake coils) |
| drawParticles()	      | 3891–3927 | Spark/text particle effects |
| drawBackground()	      | 5168–5825 | 4 full procedural backgrounds (Temple, Night City, Borko's Lair, Catnip's Domain) |
| drawKanineLogo()	      | 5243–5322 | Title screen logo |
| drawStar()	          | 3097–3107 | Utility star shape |
| Helper draw functions	  | 1782–1985 | drawNoobSaidogEyes, drawDoggoCageSunglasses, drawRaydogGear, drawRaydogSparks |
| Game loop overlay draws | 7650–7710 | Countdown text, round messages |

Total procedural draw code: ~2,500+ lines

What Each Sprite Sheet Would Need to Replace

1. Fighter Sprites (largest effort)

Each of the 13 characters needs frames for these states:

- idle (looping, with bob animation)
- walk (leg spread animation)
- crouch
- block (shield overlay)
- attack_punch (arm extension + impact lines)
- attack_kick (leg rotation + impact lines)
- special (unique per character — 13 different visual effects)
- hit (shake + spark lines)
- stunned (circling stars)
- ko (circling stars)
- frozen (ice crystals + frost particles overlay)
- victory (jumping + waving arms + sparkles)
- defeat (crouched + X eyes + tongue + circling stars)

Per character estimate:

- 2 facings (left/right — can be mirrored)
- ~6–12 frames per state
- 13 states × ~8 frames = ~104 frames per character
- 13 characters = ~1,352 fighter frames

Additional character-specific overlays (drawn on top):

- DOGGO CAGE: sunglasses
- RAYDOG: chef hat + apron + sparks
- SKORPDOG/CYDOG/TREMODOG/RAYNDOG/SEKDOG/SUBDOG/DOGGOMELEON/NOOB SAIDOG: hoodie, vest, mask variants
- NOOB SAIDOG: glowing red eyes
- DOGGOMELEON: rainbow color cycling (currently frame-dependent — would need palette swap or pre-rendered cycle)

2. Projectile Sprites (~12 types)

| Type           | Visual |
| ---            | ---    |
| energy	     | Radial gradient ball + sparks |
| harpoon	     | Diamond tip + chain segments |
| snowflake	     | 6-arm rotating crystal |
| lightningCloud | Cloud + lightning bolt + ground glow |
| arcLightning   | Jagged line from A to B |
| missile        | Arrow shape + flame trail |
| net            | Rotating crosshatch circle |
| bomb           | Sphere + fuse + glow |
| floorShockwave | Elliptical wave bands |
| noobSnake	     | Large snake head + body coils |
| noobFireball   | Glowing red orb |
| snekCoil       | Body coils around target |

~80–100 projectile frames

3. Particle Effects
- Hit sparks (3 colors)
- Block sparks
- KO explosion
- Freeze crystals
- Stunned stars
- Text popups ("BAM!", "BLOCK!", "FROZEN!", "STUNNED!")
~20–30 small particle sprites

4. Backgrounds (4 stages)
Each background is a full 1024×520 scene:
- Temple: sky gradient, sun, clouds, forest bands, temple building with detailed roof/columns/door, ground texture
- Night City: gradient sky, moon, stars, 6 buildings with flickering windows, street
- Borko's Lair: brick wall, glowing eyes in cave, shelves, vegetation, canal with animated water
- Catnip's Domain: cave ceiling with stalactites, torches with animated flames, wooden bridge/planks
4 background images (could be static or layered for parallax)

5. UI / HUD Elements
- Kanine logo (title screen)
- Character select portraits (currently rendered via createDogSprite)
- Battle plan step portraits

Migration Effort Assessment

| Category | Effort | Notes |
| ---      | ---    | ---   |
| Asset creation | Very High | 1,350+ fighter frames, 80+ projectile frames, 4 backgrounds, particles. This is the dominant cost. |
| Code refactor — fighters | High | Replace createDogSprite() (~1040 lines) with a sprite sheet loader + animation state machine. Fighter.draw() already delegates to createDogSprite(), so the | interface stays similar. |
| Code refactor — projectiles | Medium | Replace drawProjectiles() (~560 lines) with sprite lookups per projectile type. |
| Code refactor — backgrounds | Low–Medium | Replace 4 draw functions with ctx.drawImage(bgImage, ...). Could keep procedural as fallback. |
| Code refactor — particles | Low | Simple sprite blitting, ~40 lines replaced. |
| Dynamic color system | High (design decision) | Characters are currently color-parameterized (color1, color2, eyeColor). Sprite sheets lose this flexibility unless you use palette swaps, | tinting via globalCompositeOperation, or pre-render all color variants. |
| Frozen state | Medium | Currently overrides all colors to blue/ice. Would need a separate frozen sprite set or post-process tint. |
| DOGGOMELEON morphing | High | Currently morphs colors every ~480 frames via getRainbowColor(). Sprite sheets would need pre-rendered cycle frames or shader-based palette rotation. |
| Animation timing | Low | Current code uses frame % N for animation. Same logic applies to sprite sheet frame indices. |
| Sprite caching | Already exists | spriteCache object already caches off-screen canvases by key. Could be repurposed to cache loaded sprite sheet regions. |

Recommended Approach (if proceeding)

1. Keep procedural drawing as a fallback — don't delete it; use it for development comparison
2. Sprite sheet format: Use texture atlases (JSON + PNG) — one per character, one for projectiles/effects, one per background
3. Tool pipeline: Use a tool like TexturePacker, Shoebox, or Free Texture Packer to generate atlases from individual frame PNGs
4. Character coloring: Use a grayscale base sprite + color tinting via canvas compositing (source-atop) to preserve the dynamic color system
5. Phased migration: Backgrounds → Particles → Projectiles → Fighters (easiest to hardest)

Key Questions to Resolve

1. Art style: Pixel art (matching current image-rendering: pixelated) or higher-fidelity illustrations?
2. Dynamic colors: Do you want to keep per-character color customization, or lock each character to fixed art?
3. Animation fidelity: Match current ~8 frames per state, or go smoother (12–24 fps)?
4. Background interactivity: Keep animated elements (water, torches, flickering windows) as layered sprites, or static images?
5. Asset source: Will you be creating the art yourself, using AI generation, or commissioning an artist?

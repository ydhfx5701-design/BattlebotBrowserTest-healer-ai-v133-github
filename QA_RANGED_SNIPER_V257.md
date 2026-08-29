# Ranged / Sniper QA — build 20260830-sniper-ai-257

## Static release verification

- `node --check app.js`: PASS
- `node scripts/verify-release.mjs`: PASS (241 checks)

## Live browser verification

Test setup: Industrial Battle Zone 01, 8 vs 8, one browser tab.

- Spawn registry: 16/16 combat robots, BLUE 8, RED 8, unassigned 0, duplicate participant 0, extra scene roots 0.
- 80 m precision stage: PASS. The lightweight player temporarily used the autocannon because the authored machine-gun maximum range is 60 m.
- Wheel aim: PASS. The emitted barrel ray hit a live wheel surface at 78.66 m; yaw error 0, pitch error 0, camera/barrel dot 1.
- Wheel fire: PASS. One shot incremented only the wheel damage channel.
- Precision stage release: PASS. The player weapon was restored to `machineGun`.
- Post-release ranged snapshot: PASS. Invalid mounts 0; class mapping mismatches 0.
- Production class mapping: lightweight/assault = machine gun, middleweight = autocannon, superheavy = cannon, healer = healer support weapon.
- Gun mounting: fixed base directly on a real block `+Y` face, 360-degree upper gun, generated support false.

Earlier live checks on the same implementation path:

- 55 m zoom minimum/middle/maximum: PASS. FOV 35 / 25 / 15 with constant camera-to-robot distance.
- 55 m block, wheel, weapon selective hits: PASS.
- 80 m block, wheel, weapon selective hits: PASS.
- Superheavy cannon at 100 m: PASS, first bounded live shot hit.
- 16-robot class behavior: no stationary spinning, no stalled robot and no idle healer in the sampled run; class-specific action sets were observed.

## Performance status (do not report as a pass)

The user-fixed maximum of three benchmark runs was respected. The last measured build was 253, before the final 1024-pixel medium/mobile texture upload cap and QA-release cleanup.

- Spawn: 25.2 FPS
- Normal driving: 57.8 FPS
- Engagement: 56.2 FPS
- Block destruction: 58.8 FPS
- Post-destruction stabilization: 58.8 FPS
- GPU: 2.35–2.98 ms
- AI: 0.53–0.66 ms
- Physics: 0.45–4.58 ms
- Texture GPU estimate: 2784 MB to 864 MB; 4K uploaded textures: 30 to 0
- Largest remaining measured spike: spawn decode/upload and garbage collection (215 MB allocation, 283.3 ms worst frame)

Strict sustained 60 FPS is therefore **not verified**. Build 257 includes the lower 1024-pixel medium/mobile upload cap, but it was not benchmarked again because the agreed three-run limit had already been reached.

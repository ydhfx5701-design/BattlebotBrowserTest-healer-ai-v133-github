# Battlebot Browser Test — v167 verification

Date: 2026-08-29 (Asia/Seoul)

## Scope

- Added the `assault` weight class and a dedicated low-poly assault wheel.
- Added assault-specific momentum, charge, dash impact, steering-cost and AI behaviour.
- Split all four active weapons into distinct impact profiles: saw, bar spinner, drum spinner and puncher.
- Added class-role, weapon-role and objective-role AI decisions with a hard reverse-duration cap.
- Replaced the main-lobby BGM reference with the supplied `메인화면 음악.mp3` and retained a single looping/cross-fading BGM controller.
- Restored HTTP-served browser QA and verified normal lobby-to-match/workshop flows.

## Asset verification

- Assault wheel: `assets_lowpoly/wheel_assault.glb` — 2,250,380 bytes.
- Main-lobby BGM: `audio/music_main_menu_assault.mp3` — 4,378,975 bytes.
- Runtime asset revision: `remesh-167-assault-four-weapon-qa`.
- Runtime audit: old high-poly combat loads `0`; old environment obstacle loads `0`; deprecated weapon mounts `0`; invalid weapon orientations `0`.

## Real browser flow checks

The build was served from `http://127.0.0.1:8135/`, not opened as a `file://` page.

- Main lobby rendered and accepted pointer input.
- `FIGHT` opened the match-selection dialog.
- Arena 01 entered through the normal UI and ran as a 4v4 match.
- Industrial Battle Zone 01 entered through the normal UI. The runtime view showed the low-poly container/concrete obstacle set and the match continued without a console error.
- Red Canyon entered through the normal UI and ran as 10v10 with the A/B objective HUD and ten participants per team.
- Workshop entered through the normal lobby button. Selecting `돌격형` exposed its dedicated wheel and assault-class limits.
- Mobile survival HUD stayed visible in battle and showed numeric HP/Armor values.
- Runtime FPS HUD was visible in the HTTP build.

## Assault AI 30-second runtime check

- Assault robots: `4`.
- Dominant assault action: `DIRECT_CHARGE` on all four.
- Non-charge actions: `[]`.
- Average peak momentum: `0.975`.
- Dash uses: `17`.
- Maximum reverse duration: `1.517 s` (hard limit below `1.95 s`).
- Robots spinning in place: `[]`.
- Stalled robots: `[]`.
- Idle healers: `[]`.
- Class distribution: assault `4`, healer `4`, lightweight `2`, middleweight `5`, superheavy `4`.

## Four-weapon impact matrix

The runtime matrix completed `180 / 180` real impact-path checks. `rolesDiffer = true`.

| Scenario | Damage | Impulse | Knockback | Airtime | Angular response |
|---|---:|---:|---:|---:|---:|
| saw-normal | 30.45 | 81.14 | 0.044 | 0.000 | — |
| saw-dash | 31.35 | 108.99 | 0.059 | 0.000 | — |
| bar-low-rpm | 40.06 | 150.94 | 0.078 | 0.001 | — |
| bar-high-rpm | 99.18 | 347.14 | 0.179 | 0.002 | — |
| bar-dash-high-rpm | 100.89 | 547.51 | 0.283 | 0.003 | — |
| drum-normal | 63.48 | 235.84 | 0.121 | 0.012 | — |
| drum-dash | 64.82 | 320.77 | 0.164 | 0.017 | — |
| puncher-normal | 38.60 | 315.51 | 0.170 | 0.003 | 0.07 |
| puncher-assault-dash | 129.71 | 1452.50 | 0.787 | 0.006 | 0.42 |

## Player block destruction runtime check

The visible `PLAYER BLOCK` QA control was clicked in the running HTTP build. It uses the real `applyImpactAtPoint` path.

- Result: `passed = true`.
- Damage order: `Armor -> Block -> Core/HP`.
- Blocks: `24 -> 23`.
- Detached parts: `0 -> 1`.
- `partDetached = true`.
- `originalDebrisVisible = true`.
- `renderBatchVisible = true` before impact.

## Static release verification

- `node --check app.js`: PASS.
- `node scripts/verify-release.mjs`: PASS.
- Release verifier checks: `114`.

## Explicitly not claimed

- Physical-phone temperature, battery drain, device CPU percentage and device GPU percentage were not measurable from the desktop in-app browser and are **NOT VERIFIED** here.
- Audible speaker quality of the supplied BGM was not aurally judged; its file, HTTP delivery and runtime reference were verified.
- Browser FPS values are evidence for this HTTP runtime only and are not presented as physical-phone thermal results.


# Release verification 154

Date: 2026-08-29 (Asia/Seoul)

This report deliberately separates checks performed in this workspace from
checks that still require the user's physical phone. It contains no claimed
phone FPS, temperature, CPU, GPU, or long-running gameplay result.

## Verified in this workspace

- `app.js` passes the Node JavaScript syntax check.
- `scripts/verify-release.mjs` passes all release assertions.
- The four new environment GLBs are valid GLB v2 files and each is below 4 MiB.
- Local HTTP serves `index.html`, `app.js`, `styles.css`, and all four new GLBs.
- Removed legacy Arena/BattleZone GLB URLs return HTTP 404.
- Arena 01 registers only eight sparse low-steel gameplay obstacles.
- BattleZone 01 registers 12 containers, 12 concrete barriers, and 8 low-steel barriers from the new environment registry.
- The player and AI share the same block damage/detachment path.
- Class Armor consumes incoming survival damage first; only residual damage can reach block structure and then Core/HP exposure.
- Battle block rendering is grouped by block type with `InstancedMesh`; only destroyed/disconnected blocks become standalone debris.
- A completed robot uses one root physical body with a compound block collider profile. Detached debris alone receives independent motion state.
- The mobile FPS meter remains visible at the top and reports measured FPS/frame time plus a thermal lock when active.

## Not verified here

- Physical-phone temperature before/after ten minutes.
- Android/iOS profiler CPU/GPU utilization.
- Physical-phone average/p95 FPS and frame time.
- Visual obstacle placement and player block detachment in an interactive browser session. The in-app browser automation session was blocked by its navigation policy after the original local tab became an error page.

These pending items must not be interpreted as PASS. Use the on-screen FPS meter
and the `PLAYER BLOCK` QA action on a physical phone or an interactive browser
before accepting the release.

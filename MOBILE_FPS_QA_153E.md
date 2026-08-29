# Mobile FPS HUD QA (153e)

- Verified URL: `http://127.0.0.1:8135/?map=arena01&v=153e-mobile-fps`
- Test viewport: 844 x 390 (landscape mobile breakpoint)
- Match: Arena 01, 2 vs 2
- FPS HUD: visible at the top right, immediately left of the pause button
- Observed live value: `FPS 60 · 16.7 ms`
- Existing player survival HUD: visible with HP and Armor bars
- JavaScript syntax check: passed

The meter counts rendered frames, updates twice per second, and is shown only in
mobile battle/test modes. Its color changes when measured FPS falls below the
configured frame-rate target.

This browser QA is not a substitute for profiling on the user's physical phone.

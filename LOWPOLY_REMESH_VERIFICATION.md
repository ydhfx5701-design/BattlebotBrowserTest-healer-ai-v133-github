# Low-Poly Remesh Runtime Verification

Build: `144-lowpoly-remesh-final-k`

## Runtime replacement

- Lightweight wheel -> `assets_lowpoly/wheel_light.glb`
- Middleweight wheel -> `assets_lowpoly/wheel_medium.glb`
- Superheavy wheel -> `assets_lowpoly/wheel_heavy.glb`
- Saw -> `assets_lowpoly/saw.glb`
- Bar spinner -> `assets_lowpoly/bar_spinner.glb`
- Drum spinner -> `assets_lowpoly/drum_spinner.glb`
- Puncher housing -> `assets_lowpoly/puncher_housing.glb`
- Puncher tip -> `assets_lowpoly/puncher_tip.glb`
- Flat armor -> `assets_lowpoly/armor_flat.glb`

The player and every AI robot use this shared registry. Runtime audit:

- Robots: 20
- Old high-poly combat part loads: 0
- Deprecated weapon mounts/axes: 0
- Invalid direct weapon mounts: 0
- Browser JavaScript errors: 0

Legacy saved assemblies are migrated to direct block-face mounts before a robot is built. Saw, bar spinner, and drum spinner rotate around their own internal pivots. Puncher uses only its housing and sliding tip meshes.

## Desert obstacle replacement

The runtime uses all numbered low-poly variants supplied for cliffs, ridges, medium rocks, and small decorative rocks. Large and medium obstacles use outline-derived polygon collision/minimap geometry. Small rocks are decoration-only and have no collider or navigation obstacle.

The unnumbered `거대 붉은 암벽.glb` and `중형 독립 사막 바위.glb` were inspected and intentionally rejected from runtime: they contain approximately 5.95 million and 5.99 million vertices respectively, unlike the numbered low-poly variants. Loading them would violate the mobile low-poly requirement.

## 10v10 browser verification

The production update loop was simulated for 300 seconds in the browser.

- Result: PASS
- AI robots departed spawn within 5 seconds: 19/19
- AI robots moving: 19/19
- Robots spinning in place at completion: 0
- 20-second AI stalls: 0
- Total AI travel: 42,064.1 world units
- Objective participation and A-to-B sequence participation: PASS
- Healer pulses: 462
- Initial armor/exterior/weapon installation audit: PASS
- Weapon intersections: 0
- Floating or detached initial armor: 0

FPS/frame-time measurement was intentionally not run, per the user's instruction.

## Missing supplied file

`곡면 장갑판.glb` is not present anywhere under the supplied `리메이크` folder. To guarantee that no old high-poly armor is loaded, the curved-armor slot currently uses the new flat low-poly armor mesh. Exact curved-mesh replacement requires the missing GLB to be supplied.

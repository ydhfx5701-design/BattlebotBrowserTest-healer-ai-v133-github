# Mobile Runtime / Ranged AI QA — v258

## Scope

- 모바일 첫 화면 부팅과 메인메뉴 복구
- 로비/전투 리소스 지연 로딩 및 런타임 분리
- 저장 로봇과 8 vs 8 AI의 실제 총기 GLB 장착
- 체급별 사격/이동/근접 전환 규칙
- 거리 감쇠·좌우 패닝을 적용한 3D 총기 사운드

## Mobile boot result

Browser viewport: 844 × 390, single local test tab.

- Result: PASS
- Mode: lobby
- Lobby UI visible: true
- Saved robot visible: true
- Combat robots before battle: 0
- Battle map scenes before battle: 0
- Saved class: lightweight / 경량형
- Expected and actual gun: machineGun
- Direct block-face mount: true
- Fixed lower base: true
- Rotating upper yaw: 360 degrees
- Gun GLB load failures: 0
- Fallback gun assets: 0
- Eager audio preloads: 0

The boot path now renders the lightweight warehouse shell immediately, then loads only the selected saved robot and lobby decoration assets. Battle maps, 16 combat robots, weapon effects, and debris are not created during the first menu frame.

## 8 vs 8 combat result

Map: Industrial Battle Zone 01.

- Result: PASS
- Expected participants: 16
- Actual combat robots: 16
- BLUE: 8
- RED: 8
- Unassigned: 0
- Duplicate participants: 0
- Extra scene robot roots: 0
- Actual gun/emitter load failures: 0
- Invalid gun mounts: 0
- Robots left in ranged mode after gun load failure: 0

Class distribution observed in the live run:

- lightweight: 3 AI + player
- middleweight: 2 AI
- superheavy: 2 AI
- assault: 4 AI
- healer: 4 AI

Class behavior audit:

- 경량형: mobile firing, short flank/approach/rear ambush — PASS
- 중량형: balanced midrange short flank — PASS
- 초중량형: long-range hold line — PASS
- 돌격형: direct charge, ranged support, melee switching observed — PASS
- 힐러: ally support/heal, no idle healer, dash counterattack observed — PASS

All 16 live entities reported the expected actual gun/emitter, a direct block mount, a fixed base, a 360-degree rotating upper assembly, and no load failure.

## 3D gun audio

Distance gain curve:

- 5 m: 1.00
- 10 m: 1.00
- 20 m: 0.80
- 40 m: 0.55
- 70 m: 0.30
- 100 m: 0.15

Class tails:

- machine gun: 112 m
- autocannon: 132 m
- cannon: 165 m

HRTF spatial panning is enabled. The verified battle produced:

- machine gun shots/events: 1,635 / 1,635
- autocannon shots/events: 208 / 208
- cannon shots/events: 32 / 32
- one sound event per shot: PASS

## Automated release verification

- JavaScript syntax: PASS
- Release verifier: PASS (245 checks)

## Physical device status

An actual iPhone/Android device is not connected to this workspace. The responsive browser runtime and mobile viewport tests above passed, but physical-device Safari/Chrome launch, speaker attenuation, thermal behavior, and device memory must be checked from the packaged GitHub build. They are intentionally not reported as passed here.

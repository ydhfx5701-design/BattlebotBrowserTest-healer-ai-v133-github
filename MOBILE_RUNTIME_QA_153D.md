# Mobile runtime QA 153d

검증일: 2026-08-29 (Asia/Seoul)

## 범위

- 반투명 유리 셰이더는 현재 적용 대상이 아니므로 원인 분석과 수정 범위에서 제외했다.
- 실제 Android/iOS 기기 프로파일러에는 접근할 수 없어 물리 기기 발열·CPU/GPU 사용률은 측정하지 않았다.
- 아래 수치는 Codex 인앱 브라우저의 844×390 모바일 뷰포트에서 수집했다. 자동화 탭의 표시 주사율이 14~17Hz로 제한되어 평균 FPS는 기기 성능 지표로 사용하지 않는다.

## 확인된 병목

1. 렌더 제출: Arena 콘크리트 경계의 9,199 triangle GLB를 수십 번 인스턴싱해 약 50만 triangle을 반복 렌더링했다.
2. 물리: 16대 compound body/ground solve가 CPU stage 중 가장 컸다.
3. AI: 전술/장애물/stuck 판단이 물리 다음으로 컸다.

## 수정

- 모바일 기본 FPS 제한 60, 선택값 30/45/60.
- 프리셋별 native DPR/render scale/anisotropy 분리 및 의도적인 30 FPS를 과부하로 오판하던 adaptive threshold 수정.
- 모바일 경계는 동일한 collider 크기와 콘크리트/경고띠 외형을 유지하는 2-draw-call instanced geometry로 교체.
- 12대 이상 모바일 전투의 원거리 wheel/weapon/armor LOD 거리 단축. 플레이어는 항상 LOD0.
- 16대 이상 모바일 물리 24Hz(높음 30Hz), 완성 로봇당 active rigidbody 1개. 파손 debris만 별도 body.
- AI tactical 5~10Hz, obstacle 10~15Hz(원거리 6.25Hz), stuck detector 10Hz 및 robot id phase stagger.
- spinner visual rotation과 contact/damage query 분리(근거리 30Hz, 원거리 10~22Hz).
- minimap은 실시간 3D camera가 아닌 2D canvas이며 모바일 대규모전 5Hz.
- sparks/smoke/dash/heal은 pool/instancing 사용, debris 수명 및 활성 개수 제한.
- 이동 중 DASH가 기존 planar/lateral velocity를 보존하고 조향을 반영하도록 수정. joystick과 DASH는 독립 pointerId를 사용.
- 모바일 battle HUD 숨김 규칙을 제거해 HP/Armor/CORE/BLOCKS/무기/주행 상태를 모든 전투 모드에서 왼쪽 하단에 표시.

## 브라우저 검증 결과

- 8v8 actual combat robots: 16, rigidbodies: 16.
- moving DASH: PASS.
  - speed 6.161 → 16.181
  - lateral velocity 1.4 → 1.4
  - throttle preserved, brake not injected, steering applied.
- Arena mobile triangles: 872,565 → 224,924.
- p95 browser frame interval: 166.6ms → 66.6ms.
- 최종 medium budget: target 60 FPS, solver 24Hz, shadows off, anisotropy 6, pixel ratio 0.829 on DPR=1 automation viewport.
- Arena01 FFA4 survival HUD: visible.
- Industrial Battle Zone 01 2v2 survival HUD: visible.
- Arena01 8v8 survival HUD: visible.
- HUD values verified: 800/800 HP, 450/450 Armor, CORE 100%, BLOCKS 70/70, weapon/mobility status.

## 아직 물리 기기에서 확인해야 하는 값

- Android/iOS profiler CPU/GPU utilization.
- 기기 표면 온도 및 10분 thermal throttling.
- 실제 기기 평균 FPS/frame time before/after.
- 기기 DPR별 LOW/MEDIUM/HIGH 최종 화면 선명도.

위 항목은 실제 기기 측정 없이 PASS로 보고하지 않는다.

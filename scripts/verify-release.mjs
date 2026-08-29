import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const checks = [];

function assert(name, condition, details = '') {
  checks.push({ name, pass: Boolean(condition), details });
  if (!condition) throw new Error(`${name}${details ? `: ${details}` : ''}`);
}

const newEnvironmentFiles = [
  'assets_lowpoly_environment/low_steel_barrier.glb',
  'assets_lowpoly_environment/container.glb',
  'assets_lowpoly_environment/concrete_barrier.glb',
];
for (const relative of newEnvironmentFiles) {
  const absolute = path.join(root, relative);
  assert(`${relative} exists`, fs.existsSync(absolute));
  const file = fs.readFileSync(absolute);
  assert(`${relative} is GLB`, file.subarray(0, 4).toString('ascii') === 'glTF');
  assert(`${relative} GLB version`, file.readUInt32LE(4) === 2);
  assert(`${relative} GLB length`, file.readUInt32LE(8) === file.byteLength, `${file.readUInt32LE(8)} != ${file.byteLength}`);
  assert(`${relative} mobile package size`, file.byteLength < 4 * 1024 * 1024, `${file.byteLength} bytes`);
  assert(`${relative} registered`, app.includes(`./${relative}`));
}

const literalAssetFiles = [...new Set([...app.matchAll(/["'`](\.\/assets_[^?"'`]+\.(?:glb|png))[?"'`]/g)]
  .map((match) => match[1].slice(2)).filter((relative) => !relative.includes('${')))];
for (const relative of literalAssetFiles) {
  assert(`${relative} referenced file exists`, fs.existsSync(path.join(root, relative)));
}

const lowPolyCombatRegistry = {
  wheel_light: 'assets_lowpoly/wheel_light.glb',
  new_wheel: 'assets_lowpoly/wheel_medium.glb',
  wheel_wide: 'assets_lowpoly/wheel_heavy.glb',
  wheel_assault: 'assets_lowpoly/wheel_assault.glb',
  new_saw_blade: 'assets_lowpoly/saw.glb',
  bar_spinner: 'assets_lowpoly/bar_spinner.glb',
  drum_spinner: 'assets_lowpoly/drum_spinner.glb',
  puncher_housing: 'assets_lowpoly/puncher_housing.glb',
  puncher_tip: 'assets_lowpoly/puncher_tip.glb',
  armor_flat: 'assets_lowpoly/armor_flat.glb',
  armor_curved: 'assets_lowpoly/armor_flat.glb',
};
for (const [id, relative] of Object.entries(lowPolyCombatRegistry)) {
  assert(`${id} uses low-poly registry`, app.includes(`${id}: \`./${relative}?v=\${LOWPOLY_REVISION}\``));
}

const removedLegacyEnvironmentFiles = [
  'assets_v5/arena_bumper.glb',
  'assets_v5/arena_fence.glb',
  'assets_v5/arena_stands.glb',
  'assets_v6/industrial_barrier.glb',
  'assets_v6/industrial_container.glb',
  'assets_v9/arena_concrete_boundary.glb',
];
for (const relative of removedLegacyEnvironmentFiles) {
  assert(`${relative} removed`, !fs.existsSync(path.join(root, relative)));
  assert(`${relative} not registered`, !app.includes(`./${relative}`));
}

assert('Arena01 is absent from selectable registry', !app.match(/MAP_DEFINITIONS[\s\S]{0,400}arena01:/) && !index.includes('<option value="arena01"'));
assert('Arena01 assets are absent from runtime map registry', !app.match(/MAP_ASSET_IDS[\s\S]{0,250}arena01:/) && !app.includes('arena_stands: `./'));
assert('BattleZone new containers installed', app.includes("'Industrial01_LowPolyContainers_12'"));
assert('BattleZone new concrete installed', app.includes("'Industrial01_LowPolyConcreteBarriers_12'"));
assert('BattleZone new low steel installed', app.includes("'Industrial01_LowSteelBarriers_8'"));
assert('BattleZone old fence disabled', app.includes('industrialStats.assets.fenceModules = 0'));

assert('armor absorbs incoming first', app.includes('const armorDamage = Math.min(this.armor, incoming);'));
assert('only residual damage can reach structure', app.includes('survivalDamageResult.residual / survivalDamageResult.incoming'));
assert('player destruction QA exists', app.includes('playerBlockDestruction()'));
assert('block rendering is instanced', app.includes('buildBlockRenderBatches()') && app.includes('new THREE.InstancedMesh(getBlockGeometry'));
assert('live logical blocks stay out of scene graph', app.includes('Keep logical live-block transforms out of the Three.js scene graph'));
assert('static block batches avoid dynamic uploads', app.includes('mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage)'));
assert('combat glbs use flattened shared templates', app.includes('flattenedModelTemplateCache') && app.includes('flattenedRuntimeModel: true'));
assert('single primitive glbs omit identity wrapper groups', app.includes('flatRoot.children.length === 1') && app.includes('flatRoot.remove(template)'));
assert('wheel hierarchy removes duplicate root wrapper', app.includes('const wheelRoot = steeringPivot'));
assert('fixed wheel alignment skips per-frame local matrix rebuilds', app.includes('mountOrientation.matrixAutoUpdate = false') && app.includes('visualOrientation.matrixAutoUpdate = false'));
assert('fixed functional mounts skip per-frame local matrix rebuilds', app.includes("part.type === 'wheel' || part.type === 'block'") && app.includes('part.object.matrixAutoUpdate = false'));
assert('weapon lod geometry and material are shared', app.includes('sharedWeaponLodGeometries') && app.includes('sharedWeaponLodMaterial'));
assert('healer turret uses the two supplied GLBs', app.includes("cloneModel('healer_turret_base'") && app.includes("cloneModel('healer_turret_gun'"));
assert('healer fixed base and 360 degree gun yaw are separated', app.includes("rotates: 'gun-only'") && app.includes('yawRangeDegrees: 360') && app.includes('fixedBaseRotates: false'));
assert('legacy procedural healer barrel is absent', !app.includes('sharedHealerBarrelGeometry') && !app.includes('sharedHealerBarrelMaterial'));
assert('far wheels skip invisible animation work', app.includes('this.renderLODLevel < 2') && app.includes('wheelVisualUpdateAccumulator'));
assert('team marker draw lists are pooled', app.includes('const teamMarkerEntries = []') && app.includes('const teamMarkerPlaced = []'));
assert('compound hull is capped at four slices', app.includes("clamp(Math.ceil((overall.maxZ - overall.minZ) / 4), 1, 4)"));
assert('destroyed block becomes real debris', app.includes('this.hideBlockRenderInstance(part);') && app.includes('chunk.attach(part.object);'));
assert('one compound body profile remains', app.includes('this.colliderComponents = createBlockColliderProfile(this.assembly.blocks);'));
assert('assault class data exists', app.includes("assault: { label: '돌격형'") && app.includes("allowedWheels: ['wheel_assault']"));
assert('assault has six silhouettes', ['WEDGE RAMMER', 'LONG NOSE', 'WIDE BULL', 'SPLIT NOSE', 'LOW SPEAR', 'ARMORED RAM'].every((name) => app.includes(name)));
assert('assault momentum is runtime physics', app.includes('this.momentumCharge') && app.includes('momentumTopSpeedGain') && app.includes('dashMomentumAtStart'));
assert('weapon channels are separated', ['HorizontalImpulse', 'VerticalImpulse', 'TorqueImpulse', 'PenetrationDamage', 'ContactDPS', 'ArmorDamage', 'BlockDamage'].every((field) => app.includes(field)));
assert('class and weapon AI roles are explicit', app.includes("this.classRole = {") && app.includes("this.weaponRole = {") && app.includes("this.objectiveRole ="));
assert('AI reverse has a hard time limit', app.includes('this.reverseContinuousSeconds >= 1.95'));
assert('assault generic evasive actions are disabled', app.includes('flankWeight = reverseWeight = rearWeight = feintWeight = 0'));
assert('only active map is built at startup', app.includes('ensureMapScene(initialMapId)') && !app.includes("captureMapScene('industrial01', createIndustrialBattleZone);"));
assert('near AI tactical cadence is capped at 5 Hz', app.includes('const thinkInterval = [0.2, 0.28, 0.55, 1]'));
assert('assault runtime audit is exposed', app.includes('assaultAudit: {') && app.includes('maxReverseContinuousSeconds'));
assert('assault wheel is selectable', index.includes('data-wheel-model="wheel_assault"'));
assert('assault presets are selectable', index.includes('data-robot-preset="assault:puncher"') && index.includes('<option value="assault">돌격형</option>'));
assert('new lobby music is active', app.includes("lobby: './audio/music_main_menu_assault.mp3'") && fs.existsSync(path.join(root, 'audio/music_main_menu_assault.mp3')));
assert('old lobby music is retired', !fs.existsSync(path.join(root, 'audio/music_main_menu.mp3')) && !app.includes('music_main_menu.mp3'));

const rangedRegistry = {
  machine_gun_base: 'assets_ranged/machine_gun_base.glb',
  machine_gun_upper: 'assets_ranged/machine_gun_upper.glb',
  autocannon_base: 'assets_ranged/autocannon_base.glb',
  autocannon_upper: 'assets_ranged/autocannon_upper.glb',
  cannon_base: 'assets_ranged/cannon_base.glb',
  cannon_upper: 'assets_ranged/cannon_upper.glb',
};
for (const [id, relative] of Object.entries(rangedRegistry)) {
  const absolute = path.join(root, relative);
  assert(`${id} supplied ranged GLB exists`, fs.existsSync(absolute));
  assert(`${id} supplied ranged GLB is registered`, app.includes(`${id}: \`./${relative}?v=\${LOWPOLY_REVISION}\``));
  assert(`${id} mobile package size`, fs.statSync(absolute).size < 4 * 1024 * 1024, `${fs.statSync(absolute).size} bytes`);
}
for (const relative of ['audio/machine_gun_shot.mp3','audio/autocannon_shot.mp3','audio/cannon_shot.mp3','audio/enemy_detected.mp3']) {
  assert(`${relative} exists`, fs.existsSync(path.join(root, relative)));
}
assert('ranged class mapping is explicit', app.includes("lightweight: 'machineGun'") && app.includes("middleweight: 'autocannon'") && app.includes("superheavy: 'cannon'"));
assert('ranged weapon uses fixed base plus upper yaw and pitch', app.includes('directBlockFaceMount: true') && app.includes('yawRangeDegrees: 360') && app.includes('pitchRangeDegrees: [-12, 32]'));
assert('manual aim and soft detected-only assistance exist', index.includes('id="aim-crosshair"') && app.includes('this.aimAssistEnabled') && app.includes('combat.detectedTargetsFor(this)'));
assert('team detection is five hertz with memory', app.includes('DETECTION_UPDATE_INTERVAL = 0.2') && app.includes('DETECTION_MEMORY_SECONDS = 2.5'));
assert('ranged effects use fixed pools', app.includes('MAX_RANGED_TRACERS = 128') && app.includes('PooledRangedTracers') && app.includes('PooledRangedMuzzleFlashes'));
assert('ranged runtime evidence reads mounted entities', app.includes('window.__battlebotRangedQA = Object.freeze') && app.includes('classMappingMismatches') && app.includes('arena01Removed'));

assert('mobile quality scale low', app.includes("low: { label: '낮음', pixelRatio: 1.25, renderScale: 0.9"));
assert('mobile quality scale medium', app.includes("medium: { label: '중간', pixelRatio: 1.4, renderScale: 0.92"));
assert('mobile quality scale high', app.includes('renderScale: 1') && app.includes('pixelRatio: 1.5'));
assert('hidden thermal frame lock removed', !app.includes('[THERMAL FRAME LOCK]') && !app.includes('thermalFrameRateLimit > 45'));
assert('legacy frame cap preference invalidated', app.includes("battlebot-frame-rate-v3"));
assert('60 Hz rAF is not double throttled', app.includes('effectiveFrameRateLimit() < 59.5'));
assert('60 FPS is the default UI target', index.includes('<option value="60" selected>60 FPS</option>'));
assert('render and physics clocks are separated', app.includes('let physicsStepAccumulator = 0;') && app.includes('const stepDt = 1 / solverHz;'));
assert('physics no longer runs at least once per render frame', !app.includes('const stepCount = Math.max(1, Math.min(4, Math.ceil(dt / (1 / solverHz))))'));
assert('combat target cache follows simulation cadence', app.includes('if (stepCount > 0) {') && app.includes('rebuildCombatCaches();\n    updateTeamDetection(dt);'));
assert('collider debug geometry is lazy', app.includes('if (colliderDebugEnabled || EXTENDED_PHYSICS_TELEMETRY) this.createColliderDebug();') && app.includes('if (enabled && !this.colliderDebug) this.createColliderDebug();'));
assert('GLB material variants are shared', app.includes('sharedModelMaterialCache') && app.includes('sharedModelMaterial(material, tint'));
assert('wheel LOD geometry and material are shared', app.includes('sharedWheelLodGeometries') && app.includes('sharedWheelLodGeometry(wheelDimensions.radius'));
assert('block fragment meshes use a fixed pool', app.includes('blockFragmentMeshPool') && app.includes('acquireBlockFragmentMesh') && app.includes('releaseBlockFragmentMesh'));
assert('block damage does not rebuild compound body twice', app.includes('Connectivity already finishes with one compound-hull/mass rebuild'));
assert('unstable circular blob shadow removed', !app.includes('RobotContactShadows_Batched') && !app.includes('updateRobotContactShadows();'));
assert('AI class targets equal maximum block counts', ['lightweight', 'middleweight', 'superheavy', 'assault', 'healer'].every((key) => {
  const row = app.match(new RegExp(`${key}: \\{[^\\n]+maxBlocks: (\\d+), aiBlockTarget: (\\d+)`));
  return row && row[1] === row[2];
}));
assert('AI generator enforces strict symmetry', app.includes('function auditAIGeneratedSymmetry') && app.includes('SYMMETRY:${failure}'));
assert('AI generator records reference catalog', app.includes('REFERENCE_ROBOT_DESIGNS') && app.includes('reference-exact-max-mirrored-generator'));
assert('all 20 editable preset cards exist', (index.match(/data-robot-preset=/g) ?? []).length === 20);
assert('GPU timer query is reported when supported', app.includes('EXT_disjoint_timer_query_webgl2') && app.includes('performanceProfile.gpuSamples'));
assert('performance isolation matrix exists', ['ai-off', 'physics-minimal', 'block-destruction-off', 'vfx-debris-off', 'ui-marker-off', 'environment-off', 'robot-render-simplified'].every((name) => app.includes(`'${name}'`)));
assert('population benchmark covers 0 1 4 8 16 AI', app.includes('for (const count of [0, 1, 4, 8, 16])'));
assert('runtime performance pass requires strict displayed 60 FPS in every phase',
  app.includes("'FAIL_RUNTIME_TARGET_NOT_MET'")
  && app.includes('const reportsSixty = (sample) => Number(sample?.actualRenderedFps ?? 0) >= 60')
  && app.includes('Object.values(result.strict60).every(Boolean)')
  && app.includes('result.postDestruction.p95FrameMs <= 18'));
assert('detached combat GLB materials are prewarmed before scored combat', app.includes('TransientCombatMaterialWarmup') && app.includes('for (const id of LOWPOLY_COMBAT_IDS)') && app.includes('for (const tint of armourTints)'));
assert('runtime phase profiler does not run the full scene audit between samples', app.includes('function performanceSampleSnapshot()') && app.includes('const profile = performanceSampleSnapshot();'));
assert('debris fade does not mutate shared material shader flags', !app.includes('setDebrisOpacity(item, clamp(item.life / DEBRIS_FADE_SECONDS'));
assert('per-robot runtime object report exists', app.includes('perRobotRuntime') && app.includes('activeBlockRigidbodies: 0'));
assert('live blocks use transform-only runtime records', app.includes('createCombatBlockTransform(record)'));
assert('detached block meshes are lazy', app.includes('ensureDetachedBlockVisual(part)') && app.includes('sharedBlockDebrisMaterial'));
assert('exact participant performance benchmark exists', app.includes('runAutomaticPerformanceBenchmark(aiCount, totalParticipantCount') && app.includes('performanceBenchmarkAICountOverride'));
assert('follow camera remains close and aim uses true weapon-specific optical FOV',
  app.includes("* 1.62, 9.4, 21")
  && app.includes('NORMAL_COMBAT_FOV = 58')
  && app.includes('aimConfig?.minAimFov')
  && app.includes('manualAimDirectionFor(player')
  && !app.includes('const targetFov = lerp(50, 27, aimZoomRatio) + cameraDashFov'));
assert('precision aim raycasts live individual part surfaces',
  app.includes('raycastLivePartSurface(ray, maxDistance')
  && app.includes('forcedPart: hitPart')
  && app.includes('rangedTelemetry.partHits'));
assert('mobile movement uses touch-origin floating joystick and independent aim pointer',
  app.includes('activateFloatingJoystick(event)')
  && app.includes('event.clientX <= window.innerWidth * 0.45')
  && styles.includes('.joystick.active { opacity:1; pointer-events:auto; }'));
assert('AI posture recovery cannot re-arm into a roly-poly loop',
  app.includes("this.transitionAIState('RESPAWN_DISABLED', 'not-wheel-down')")
  && app.includes("this.destroyRobot(null, 'AI_DISABLED')")
  && !app.includes("this.startPostureRecovery('ai-current-position'"));
assert('integrated block batches still expose individual precision hit surfaces',
  app.includes('worldBoundsForPart(part, target = new THREE.Box3())')
  && app.includes('recordLocalAABB(part.record)')
  && app.includes('target.raycastLivePartSurface'));
assert('class ranged AI has visible-part selection, lead and melee switch bands',
  app.includes('chooseAIRangedAimPart(target, origin)')
  && app.includes("this.weightClass === 'superheavy'")
  && app.includes('meleeSwitchDistance')
  && app.includes('this.switchWeaponMode(desiredMode)'));
assert('80m precision aim QA stages and measures actual live part hits',
  app.includes('stagePrecisionTarget(requestedDistance = 80)')
  && app.includes("aimAtPart(partType = 'block', zoomPercent = 100)")
  && app.includes('firePrecisionShot()'));
assert('lobby uses the supplied icon artwork without baked Korean labels',
  styles.includes('Final icon crop override: art only')
  && index.includes('<span class="lobby-icon icon-home" aria-hidden="true"></span>')
  && !index.includes('UI 아이콘 원본.png'));
assert('lobby notification dots are absent',
  !index.includes('notification-dot')
  && !index.includes('lobby-notification'));
assert('lobby keeps both shelves and the separate drum placement',
  (app.match(/placeLobbyProvidedAsset\('lobby_shelf'/g) ?? []).length === 2
  && app.includes("placeLobbyProvidedAsset('lobby_drums'")
  && app.includes("drumPlacement: 'reference-right-foreground'"));
assert('lobby embedded GLB textures have an in-app browser fallback',
  app.includes('loadEmbeddedGlbTexture')
  && app.includes("String(url).startsWith('blob:')"));
assert('lobby primary actions are wired',
  ['settings', 'reward', 'mission', 'workshop'].every((action) => index.includes(`data-lobby-action="${action}"`))
  && app.includes("ui.lobbyRobotNext?.addEventListener('click'")
  && app.includes("ui.lobbyFight.addEventListener('click'"));
assert('cachebuster updated', index.includes('20260830-sniper-ai-257'));
assert('precision QA restores authored player ranged weapon',
  app.includes('delete player.qaPrecisionOriginalRangedWeapon')
  && app.includes('restoredWeapon = original.type'));
assert('long-range precision verifies emitted barrel ray after parallax retries',
  app.includes('At long range a wheel can be visible from the yaw axis')
  && app.includes('!requestedSurfaceHit && retry < 3')
  && app.includes('pitchError: Number'));
assert('80m precision QA uses a legitimately in-range player weapon',
  app.includes("['autocannon', 'cannon'].find")
  && app.includes('qaPrecisionOriginalRangedWeapon')
  && app.includes('qaWeaponOverride'));
assert('embedded GLB textures use bounded decoded ImageBitmap uploads',
  app.includes("policy: 'medium/mobile<=1024;high=original'")
  && app.includes('resizeWidth: uploadWidth')
  && app.includes('window.__battlebotEmbeddedTextureAudit')
  && app.includes("image.removeAttribute('src')"));
assert('superheavy tactical action is fixed to line holding',
  app.includes("this.weightClass === 'superheavy') this.aiAction = 'HOLD_LINE'"));
assert('runtime class behavior audit exposes every required class',
  app.includes('classBehaviorAudit: Object.fromEntries')
  && app.includes("['lightweight', 'middleweight', 'superheavy', 'assault', 'healer']"));
assert('AI pitch is solved from the live muzzle rather than chassis origin',
  app.includes('const muzzleLocal = this.root.worldToLocal')
  && app.includes('this.aiScratchC.copy(predicted)).sub(muzzleLocal)')
  && !app.includes('local.y - weapon.mount.position.y'));
assert('100m cannon QA is a bounded real three-shot trial',
  app.includes('for (let attempt = 0; attempt < 3')
  && app.includes('attempts.push({'));
assert('real aim camera exposes minimum, medium and maximum optical zoom QA',
  app.includes('sampleZoom(zoomPercent = 0)')
  && app.includes("addRuntimeQAButton('ZOOM MIN'")
  && app.includes("addRuntimeQAButton('ZOOM MID'")
  && app.includes("addRuntimeQAButton('ZOOM MAX'")
  && app.includes('Math.abs(actualFov - expectedFov) <= 0.15'));
assert('large battle physics work is distributed without lowering AI simulation cadence',
  app.includes('const distributedLargeBattle = robots.length >= 12')
  && app.includes('index % 3 === distributedPhase % 3')
  && app.includes('robot.isPlayer ? stepDt * 2 : stepDt * 3')
  && app.includes('largeBattlePhysicsPhase = (largeBattlePhysicsPhase + 1) % 6'));
assert('manual aim remains authoritative over stale soft-assist target',
  app.includes('this.rangedTargetUid && !this.manualAimEnabled')
  && app.includes('player.rangedTargetUid = null;'));
assert('precision QA searches real cardinal presentations for exposed parts',
  app.includes('const presentationYaws = [target.yaw')
  && app.includes('visible = findVisibleRequestedPart(player.rangedWeapon.muzzle.getWorldPosition'));
assert('precision shot acceptance requires one requested live damage channel',
  app.includes('changed.length === 1 && changed[0] === expected'));
assert('normal AI runtime QA panel can run without isolated simulation', app.includes("get('runtimeQA') === '1'"));
assert('precision part QA aims at exposed surface and corrects muzzle parallax', app.includes('selectedSurfacePoint = visible?.point') && app.includes('findVisibleRequestedPart(correctedOrigin)') && app.includes('cameraBarrelDot'));
assert('live chassis aim bounds use grid bounds instead of missing part radius', app.includes('? recordLocalAABB(part.record)') && app.includes(': blockLocalAABB(part.record)'));
assert('ranged turret has detected-only fallback independent of chassis target', app.includes("targetSource = 'detected-turret-fallback'") && app.includes('detectedCandidates.includes(assigned)'));
assert('100m superheavy cannon runtime test is exposed', app.includes("stageClassPrecision(classId = 'superheavy', requestedDistance = 100)") && app.includes("addRuntimeQAButton('CANNON 100m'"));
assert('ordinary floor correction preserves AI combat target',
  app.includes('severePenetrationThreshold')
  && app.includes("this.lastControlWakeReason = 'deep-floor-penetration-corrected'")
  && !app.includes("this.aiState = 'SEARCH';\n      this.aiStateTime = 0;\n      this.aiTargetId = null;"));
assert('flat-map wheel support fast path', app.includes('return this.getFlatWheelSupportInfo(pitch, roll, yaw)'));
assert('obstacle path broadphase precedes sweep', app.indexOf('if (!pathNearObstacle) continue;') < app.indexOf("const sweptContact = obstacle.kind === 'box'"));
assert('gpu timer is sparse', app.includes('gpuTimerRenderSerial % 60 !== 0'));
assert('fixed five phase performance protocol', ['spawn', 'driving', 'engagement', 'destruction', 'postDestruction'].every((phase) => app.includes(`result.phases.${phase}`)));
assert('benchmark roster is exactly sixteen including player', app.includes('const requestedAI = Math.max(0, requestedTotalRobots - 1)'));
assert('phase metrics include heap and CPU stages', app.includes('largestObservedGcDropMB') && app.includes('averagePhysicsMs') && app.includes('averageAiMs'));
assert('map-scoped GLB loading defers inactive battlefields', app.includes('requiredAssetIdsForMap(mapId)') && app.includes('deferredIds: ASSETS.filter') && app.includes('ensureAssetsForMap'));
assert('full runtime telemetry is opt-in and absent from normal combat', app.includes('const runtimeTelemetryEnabled') && app.includes('!refreshTelemetry || !runtimeTelemetryEnabled'));
assert('colliding optional decorations are removed in mirrored pairs', app.includes('optionalDecorations') && app.includes('const removeIds = new Set([invalid.id, mate?.id]'));
assert('post-repair AI exterior mirror reconstruction exists', app.includes('mirroredPartMate') && app.includes('mirroredPartId'));
assert('match AI reference families cannot repeat', app.includes('usedReferenceIds') && app.includes('!usedReferenceIds.has(candidate.aiDesign.referenceId)'));
assert('preset QA requires 20 distinct references and geometry signatures', app.includes('everyPresetUsesDifferentReference') && app.includes('everyPresetHasDifferentGeometry'));

console.log(JSON.stringify({
  ok: checks.every((check) => check.pass),
  checks: checks.length,
  environmentBytes: newEnvironmentFiles.reduce((sum, relative) => sum + fs.statSync(path.join(root, relative)).size, 0),
  root,
}, null, 2));

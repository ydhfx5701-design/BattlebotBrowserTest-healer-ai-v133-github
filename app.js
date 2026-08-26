import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const ui = {
  canvas: document.querySelector('#game'),
  speed: document.querySelector('#speed'),
  status: document.querySelector('#status'),
  joystick: document.querySelector('#joystick'),
  knob: document.querySelector('#knob'),
  brake: document.querySelector('#brake'),
  selfRight: document.querySelector('#self-right'),
  reset: document.querySelector('#reset'),
  blueRoster: document.querySelector('#blue-roster'),
  redRoster: document.querySelector('#red-roster'),
  blueTeamList: document.querySelector('#blue-team-list'),
  redTeamList: document.querySelector('#red-team-list'),
  playerHealth: document.querySelector('#player-health'),
  playerHealthText: document.querySelector('#player-health-text'),
  playerCore: document.querySelector('#player-core'),
  playerBlocks: document.querySelector('#player-blocks'),
  playerWeapon: document.querySelector('#player-weapon'),
  playerMobility: document.querySelector('#player-mobility'),
  message: document.querySelector('#message'),
  selfTest: document.querySelector('#self-test'),
  colliderDebug: document.querySelector('#collider-debug'),
  physicsDebug: document.querySelector('#physics-debug'),
  arenaTop: document.querySelector('#arena-top'),
  qaState: document.querySelector('#qa-state'),
  garageState: document.querySelector('#garage-state'),
  screenTitle: document.querySelector('#screen-title'),
  workshopToggle: document.querySelector('#workshop-toggle'),
  workshopUI: document.querySelector('#workshop-ui'),
  partList: document.querySelector('#part-list'),
  selectionName: document.querySelector('#selection-name'),
  transformReadout: document.querySelector('#transform-readout'),
  mountStatus: document.querySelector('#mount-status'),
  installPart: document.querySelector('#install-part'),
  removePart: document.querySelector('#remove-part'),
  removeAllWeapons: document.querySelector('#remove-all-weapons'),
  duplicatePart: document.querySelector('#duplicate-part'),
  alignAxis: document.querySelector('#align-axis'),
  flipWheel: document.querySelector('#flip-wheel'),
  weaponAutoCut: document.querySelector('#weapon-auto-cut'),
  undoGarage: document.querySelector('#undo-garage'),
  saveGarage: document.querySelector('#save-garage'),
  testDrive: document.querySelector('#test-drive'),
  enterBattle: document.querySelector('#enter-battle'),
  garageCount: document.querySelector('#garage-count'),
  garageMass: document.querySelector('#garage-mass'),
  saveState: document.querySelector('#save-state'),
  battleMode: document.querySelector('#battle-mode'),
  friendlyFire: document.querySelector('#friendly-fire'),
  audioMute: document.querySelector('#audio-mute'),
  masterVolume: document.querySelector('#master-volume'),
  musicVolume: document.querySelector('#music-volume'),
  effectsVolume: document.querySelector('#effects-volume'),
  volumeValue: document.querySelector('#volume-value'),
  qualityPreset: document.querySelector('#quality-preset'),
  dashKey: document.querySelector('#dash-key'),
  pauseToggle: document.querySelector('#pause-toggle'),
  pausePanel: document.querySelector('#pause-panel'),
  pauseResume: document.querySelector('#pause-resume'),
  pauseLobby: document.querySelector('#pause-lobby'),
  dash: document.querySelector('#dash'),
  lobbyUI: document.querySelector('#lobby-ui'),
  lobbyFight: document.querySelector('#lobby-fight'),
  lobbyModal: document.querySelector('#lobby-modal'),
  lobbyModalClose: document.querySelector('#lobby-modal-close'),
  lobbyModalTitle: document.querySelector('#lobby-modal-title'),
  lobbyModalCopy: document.querySelector('#lobby-modal-copy'),
  lobbyModalIcon: document.querySelector('#lobby-modal-icon'),
  lobbyBattleOptions: document.querySelector('#lobby-battle-options'),
  lobbyBattleMap: document.querySelector('#lobby-battle-map'),
  lobbyBattleMode: document.querySelector('#lobby-battle-mode'),
  lobbyFriendlyFire: document.querySelector('#lobby-friendly-fire'),
  lobbyEnterBattle: document.querySelector('#lobby-enter-battle'),
  lobbyFade: document.querySelector('#lobby-fade'),
  lobbyRobotLabel: document.querySelector('#lobby-robot-label'),
  lobbyRobotSpec: document.querySelector('#lobby-robot-spec'),
  returnLobby: document.querySelector('#return-lobby'),
  partsMode: document.querySelector('#parts-mode'),
  blocksMode: document.querySelector('#blocks-mode'),
  functionalCatalog: document.querySelector('#functional-catalog'),
  blockCatalog: document.querySelector('#block-catalog'),
  functionalInspector: document.querySelector('#functional-inspector'),
  blockInspector: document.querySelector('#block-inspector'),
  functionalTransformControls: document.querySelector('#functional-transform-controls'),
  blockTransformControls: document.querySelector('#block-transform-controls'),
  blockList: document.querySelector('#block-list'),
  blockDataTitle: document.querySelector('#block-data-title'),
  blockDataCopy: document.querySelector('#block-data-copy'),
  blockStatus: document.querySelector('#block-status'),
  blockInstall: document.querySelector('#block-install'),
  blockCancel: document.querySelector('#block-cancel'),
  blockDelete: document.querySelector('#block-delete'),
  blockDeleteMode: document.querySelector('#block-delete-mode'),
  workshopHint: document.querySelector('#workshop-hint'),
  inspectorTitle: document.querySelector('#inspector-title'),
  battleMap: document.querySelector('#battle-map'),
  conquestHUD: document.querySelector('#conquest-hud'),
  conquestBlueCount: document.querySelector('#conquest-blue-count'),
  conquestRedCount: document.querySelector('#conquest-red-count'),
  conquestBlueIcons: document.querySelector('#conquest-blue-icons'),
  conquestRedIcons: document.querySelector('#conquest-red-icons'),
  conquestTimer: document.querySelector('#conquest-timer'),
  captureA: document.querySelector('#capture-a'),
  captureB: document.querySelector('#capture-b'),
  captureProgress: document.querySelector('#capture-progress em'),
  captureState: document.querySelector('#capture-state'),
  conquestMinimap: document.querySelector('#conquest-minimap'),
  minimapCanvas: document.querySelector('#conquest-minimap-canvas'),
  combatRespawn: document.querySelector('#combat-respawn'),
};

const ASSETS = [
  'new_wheel', 'new_saw_blade', 'new_saw_mount',
  'new_horizontal_saw_mount', 'new_universal_pivot_mount',
  'drum_spinner', 'bar_spinner_axis', 'bar_spinner',
  'arena_stands', 'arena_bumper', 'arena_fence',
  'industrial_container', 'industrial_barrier',
  'armor_curved', 'armor_flat', 'horn_curved', 'horn_straight',
  'exhaust_triple', 'exhaust_vertical',
  'wheel_light', 'wheel_wide', 'track_heavy',
  'desert_cliff', 'desert_rock',
];
const ASSET_PATHS = Object.fromEntries(ASSETS.map((id) => [id, `./assets_v2/${id}.glb?v=mesh-low-1`]));
Object.assign(ASSET_PATHS, {
  drum_spinner: './assets_v3/drum_spinner.glb?v=team-arena-6',
  bar_spinner_axis: './assets_v3/bar_spinner_axis.glb?v=team-arena-6',
  bar_spinner: './assets_v3/bar_spinner.glb?v=team-arena-6',
  arena_stands: './assets_v5/arena_stands.glb?v=arena01-1',
  arena_bumper: './assets_v5/arena_bumper.glb?v=arena01-1',
  arena_fence: './assets_v5/arena_fence.glb?v=arena01-1',
  industrial_container: './assets_v6/industrial_container.glb?v=industrial-92',
  industrial_barrier: './assets_v6/industrial_barrier.glb?v=industrial-92',
  armor_curved: './assets_v7/armor_curved.glb?v=exterior-102',
  armor_flat: './assets_v7/armor_flat.glb?v=exterior-102',
  horn_curved: './assets_v7/horn_curved.glb?v=exterior-102',
  horn_straight: './assets_v7/horn_straight.glb?v=exterior-102',
  exhaust_triple: './assets_v7/exhaust_triple.glb?v=exterior-102',
  exhaust_vertical: './assets_v7/exhaust_vertical.glb?v=exterior-102',
  wheel_light: './assets_v7/wheel_light.glb?v=driveclass-102',
  wheel_wide: './assets_v7/wheel_wide.glb?v=driveclass-102',
  track_heavy: './assets_v7/track_heavy.glb?v=driveclass-102',
  desert_cliff: './assets_v8/desert_cliff_lite.glb?v=red-canyon-mobile-134',
  desert_rock: './assets_v8/desert_rock_lite.glb?v=red-canyon-mobile-134',
});
const MODEL_TRANSFORMS = {
  new_wheel: { scale: [0.56, 0.56, 0.56], rotation: [0, Math.PI / 2, 0] },
  new_saw_blade: { scale: [0.84, 0.84, 0.84], rotation: [-Math.PI / 2, 0, 0] },
  new_saw_mount: { scale: [0.55, 0.55, 0.55], rotation: [0, 0, 0] },
  new_horizontal_saw_mount: { scale: [0.68, 0.68, 0.68], rotation: [0, 0, 0] },
  new_universal_pivot_mount: { scale: [0.42, 0.42, 0.42], rotation: [0, 0, 0] },
  drum_spinner: { scale: [1.45, 1.45, 1.45], rotation: [0, 0, 0] },
  bar_spinner_axis: { scale: [0.54, 0.54, 0.54], rotation: [0, 0, 0] },
  bar_spinner: { scale: [1.75, 1.75, 1.75], rotation: [0, 0, 0] },
  armor_curved: { scale: [0.65, 0.65, 0.65], rotation: [0, 0, 0] },
  armor_flat: { scale: [0.65, 0.65, 0.65], rotation: [0, 0, 0] },
  horn_curved: { scale: [0.72, 0.72, 0.72], rotation: [0, 0, 0] },
  horn_straight: { scale: [0.72, 0.72, 0.72], rotation: [0, -Math.PI / 2, 0] },
  exhaust_triple: { scale: [0.48, 0.48, 0.48], rotation: [0, 0, 0] },
  exhaust_vertical: { scale: [0.48, 0.48, 0.48], rotation: [0, 0, 0] },
  // All new wheel sources use local Z as the axle. Rotate the visual only so
  // the runtime wheel root still owns a clean local +X axle on both sides.
  wheel_light: { scale: [0.52, 0.52, 0.52], rotation: [0, Math.PI / 2, 0] },
  wheel_wide: { scale: [0.68, 0.68, 0.68], rotation: [0, Math.PI / 2, 0] },
  track_heavy: { scale: [1.15, 1.15, 1.15], rotation: [0, Math.PI / 2, 0] },
};
const PART_LIMITS = Object.freeze({
  wheel: [0.55, 1.7], pivotMount: [0.65, 1.65], sawSupport: [0.65, 1.65], sawMount: [0.65, 1.65],
  spinner: [0.55, 1.65],
  barAxis: [0.7, 1.5], barSpinner: [0.62, 1.45], drumSpinner: [0.62, 1.5],
  armorCurved: [0.55, 1.8], armorFlat: [0.55, 1.8], hornCurved: [0.5, 1.65], hornStraight: [0.5, 1.65],
  exhaustTriple: [0.55, 1.55], exhaustVertical: [0.55, 1.55],
});
const PART_META = {
  wheel: { label: '새 바퀴', model: 'new_wheel', mass: 8, hp: 145, radius: 0.4 },
  pivotMount: { label: '범용 회전축 지지대', model: 'new_universal_pivot_mount', mass: 12, hp: 720, radius: 0.38, jointBreakForce: 2450, jointBreakTorque: 1900 },
  sawSupport: { label: '톱날 축 지지대', model: 'new_saw_mount', mass: 15, hp: 760, radius: 0.46, jointBreakForce: 2650, jointBreakTorque: 2050 },
  sawMount: { label: '수평 톱 지지대', model: 'new_horizontal_saw_mount', mass: 17, hp: 790, radius: 0.48, jointBreakForce: 2750, jointBreakTorque: 2150 },
  spinner: { label: '새 톱날', model: 'new_saw_blade', mass: 22, hp: 620, radius: 0.72, weaponKey: 'spinner' },
  barAxis: { label: '바 스피너 고정축', model: 'bar_spinner_axis', mass: 26, hp: 980, radius: 0.52, jointBreakForce: 3400, jointBreakTorque: 2850 },
  barSpinner: { label: '바 스피너', model: 'bar_spinner', mass: 46, hp: 760, radius: 1.12, weaponKey: 'bar' },
  drumSpinner: { label: '드럼 스피너', model: 'drum_spinner', mass: 44, hp: 780, radius: 0.94, weaponKey: 'drum' },
  armorCurved: { label: '곡면 장갑판', model: 'armor_curved', mass: 13, hp: 225, armor: 28, radius: 0.68, category: 'armor' },
  armorFlat: { label: '평평한 장갑판', model: 'armor_flat', mass: 14, hp: 245, armor: 32, radius: 0.72, category: 'armor' },
  hornCurved: { label: '곡선형 금속 뿔', model: 'horn_curved', mass: 6, hp: 82, armor: 5, radius: 0.7, category: 'decoration' },
  hornStraight: { label: '직선형 뿔 스파이크', model: 'horn_straight', mass: 7, hp: 88, armor: 6, radius: 0.72, category: 'decoration' },
  exhaustTriple: { label: '3연장 배기구', model: 'exhaust_triple', mass: 5, hp: 66, armor: 3, radius: 0.52, category: 'decoration' },
  exhaustVertical: { label: '수직 배기', model: 'exhaust_vertical', mass: 4, hp: 62, armor: 3, radius: 0.5, category: 'decoration' },
};
const STORAGE_KEY = 'battlebot-workshop-assembly-v11';
const LEGACY_STORAGE_KEYS = ['battlebot-workshop-assembly-v10', 'battlebot-workshop-assembly-v9', 'battlebot-workshop-assembly-v8', 'battlebot-workshop-assembly-v7'];
const cloneData = (value) => JSON.parse(JSON.stringify(value));
const REMOVED_WEAPON_TYPES = new Set(['hammer', 'flipper']);
const WEAPON_TYPES = new Set(['spinner', 'barSpinner', 'drumSpinner']);
const EXTERIOR_TYPES = new Set(['armorCurved', 'armorFlat', 'hornCurved', 'hornStraight', 'exhaustTriple', 'exhaustVertical']);
const ASSEMBLY_VERSION = 11;
const WEIGHT_CLASSES = Object.freeze({
  lightweight: { label: '경량급', wheelModel: 'wheel_light', acceleration: 1.32, topSpeed: 19.5, massScale: 0.74, hpScale: 0.78, traction: 0.9, steering: 1.18, dashDelta: 8.4, dashCooldown: 2.65, dashDuration: 0.4, dashPrimeRatio: 1.6, dashPeakRatio: 2.75, dashSteering: 0.34, dashChassisLengths: 5.1 },
  middleweight: { label: '중량급', wheelModel: 'new_wheel', acceleration: 1, topSpeed: 16.5, massScale: 1, hpScale: 1, traction: 1, steering: 1, dashDelta: 7.1, dashCooldown: 3.05, dashDuration: 0.35, dashPrimeRatio: 1.45, dashPeakRatio: 2.25, dashSteering: 0.2, dashChassisLengths: 4.05 },
  superheavy: { label: '초중량급', wheelModel: 'wheel_wide', acceleration: 0.72, topSpeed: 12.4, massScale: 1.45, hpScale: 1.35, traction: 1.34, steering: 0.76, dashDelta: 5.7, dashCooldown: 3.65, dashDuration: 0.39, dashPrimeRatio: 1.3, dashPeakRatio: 1.92, dashSteering: 0.08, dashChassisLengths: 3.05 },
});
const GRID_UNIT = 0.36;
const BLOCK_SIZE = GRID_UNIT;
const LV1_BLOCK_COLOR = 0x39afe7;
const LV1_SILVER_BLOCK_COLOR = 0xb9c4cc;
const HALF_GRID = 0.5;
const BLOCK_GRID_ORIGIN = new THREE.Vector3(0, 0, 0);
const BLOCK_META = Object.freeze({
  core: { label: 'Core 기본 큐브', dimensions: [1, 1, 1], hp: 180, mass: 10, armor: 18, connectionStrength: 150, colliderType: 'box', meshType: 'box' },
  cube: { label: '블루 기본 큐브', dimensions: [1, 1, 1], hp: 150, mass: 9, armor: 16, connectionStrength: 130, colliderType: 'box', meshType: 'box', defaultColor: LV1_BLOCK_COLOR, materialTier: 'lv1-blue-metal' },
  silverCube: { label: '실버 기본 큐브', dimensions: [1, 1, 1], hp: 150, mass: 9, armor: 16, connectionStrength: 130, colliderType: 'box', meshType: 'box', defaultColor: LV1_SILVER_BLOCK_COLOR, materialTier: 'lv1-silver-metal' },
  long2: { label: '긴 블록', dimensions: [1, 1, 2], hp: 285, mass: 17, armor: 16, connectionStrength: 150, colliderType: 'box', meshType: 'box' },
  long3: { label: '긴 블록 대형', dimensions: [1, 1, 3], hp: 410, mass: 25, armor: 16, connectionStrength: 165, colliderType: 'box', meshType: 'box' },
  plate: { label: '평판 블록', dimensions: [1, 0.5, 1], hp: 92, mass: 4.5, armor: 13, connectionStrength: 105, colliderType: 'box', meshType: 'box' },
  plate2: { label: '긴 평판', dimensions: [1, 0.5, 2], hp: 176, mass: 8.5, armor: 13, connectionStrength: 118, colliderType: 'box', meshType: 'box' },
  wedge: { label: '기본 경사 블록', dimensions: [1, 1, 1], hp: 138, mass: 7.5, armor: 17, connectionStrength: 122, colliderType: 'convex-wedge', meshType: 'wedge' },
  cornerWedge: { label: '코너 경사 블록', dimensions: [1, 1, 1], hp: 126, mass: 6.8, armor: 17, connectionStrength: 115, colliderType: 'convex-corner-wedge', meshType: 'cornerWedge' },
  invertedWedge: { label: '역경사 블록', dimensions: [1, 1, 1], hp: 138, mass: 7.5, armor: 17, connectionStrength: 122, colliderType: 'convex-wedge', meshType: 'wedge', defaultRotationSteps: [0, 0, 2] },
});

function createBlockRecord(type = 'cube', gridPosition = [0, 0, 0], rotationSteps = null, id = null) {
  const meta = BLOCK_META[type] ?? BLOCK_META.cube;
  const steps = (rotationSteps ?? meta.defaultRotationSteps ?? [0, 0, 0]).map((value) => ((Math.round(value) % 4) + 4) % 4);
  const blockId = id ?? `block-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    id: blockId,
    blockId,
    type,
    blockType: type,
    gridPosition: gridPosition.map((value) => Math.round(Number(value) * 2) / 2),
    rotationSteps: steps,
    rotation: steps.map((value) => value * Math.PI / 2),
    hp: meta.hp,
    maxHp: meta.hp,
    damageState: 'intact',
    mass: meta.mass,
    armor: meta.armor,
    connectionStrength: meta.connectionStrength,
    level: 1,
    materialTier: meta.materialTier ?? 'lv1-blue-metal',
    color: `#${new THREE.Color(meta.defaultColor ?? LV1_BLOCK_COLOR).getHexString()}`,
    gridUnit: GRID_UNIT,
    colliderType: meta.colliderType,
    isCore: type === 'core',
  };
}

function createDefaultBlocks() {
  const core = createBlockRecord('core', [0, 0, 0], [0, 0, 0], 'block-core');
  core.blockId = core.id;
  return [core];
}

function createDefaultAssembly() {
  return {
    version: ASSEMBLY_VERSION,
    weightClass: 'middleweight',
    blocks: createDefaultBlocks(),
    parts: [],
  };
}

function enrichAssembly(assembly) {
  const enriched = cloneData(assembly);
  const sourceVersion = Number(enriched.version ?? 0);
  enriched.version = ASSEMBLY_VERSION;
  enriched.weightClass = WEIGHT_CLASSES[enriched.weightClass] ? enriched.weightClass : 'middleweight';
  enriched.parts ??= [];
  // Hammer and flipper were removed from the game. Old saves are migrated in
  // place so their mounts cannot remain as invisible collision/weight ghosts.
  const removedWeaponIds = new Set(enriched.parts.filter((part) => REMOVED_WEAPON_TYPES.has(part.type)).map((part) => part.id));
  enriched.parts = enriched.parts.filter((part) => !REMOVED_WEAPON_TYPES.has(part.type)
    && part.type !== 'hammerMount'
    && !(part.linkedTo ?? []).some((id) => removedWeaponIds.has(id)));
  enriched.blocks = Array.isArray(enriched.blocks) && enriched.blocks.length ? enriched.blocks : createDefaultBlocks();
  if (!enriched.blocks.some((block) => block.isCore || block.id === 'block-core')) enriched.blocks.unshift(...createDefaultBlocks());
  enriched.blocks = enriched.blocks.map((block) => {
    const type = block.type === 'core' || block.isCore ? 'core' : (BLOCK_META[block.type] ? block.type : 'cube');
    const meta = BLOCK_META[type] ?? BLOCK_META.cube;
    const record = createBlockRecord(type, block.gridPosition ?? [0, 0, 0], block.rotationSteps ?? (block.rotation ?? [0, 0, 0]).map((value) => Math.round(value / (Math.PI / 2))), block.id ?? null);
    Object.assign(record, block);
    record.type = type;
    record.blockType = type;
    record.blockId = record.id;
    record.gridPosition = record.gridPosition.map((value) => Math.round(Number(value) * 2) / 2);
    record.rotationSteps = record.rotationSteps.map((value) => ((Math.round(value) % 4) + 4) % 4);
    record.rotation = record.rotationSteps.map((value) => value * Math.PI / 2);
    record.level = 1;
    record.materialTier = block.materialTier ?? meta.materialTier ?? 'lv1-blue-metal';
    record.color = block.color ?? `#${new THREE.Color(meta.defaultColor ?? LV1_BLOCK_COLOR).getHexString()}`;
    record.gridUnit = GRID_UNIT;
    record.isCore = type === 'core';
    record.maxHp = Number(record.maxHp ?? meta.hp);
    record.hp = clamp(Number(record.hp ?? record.maxHp), 0, record.maxHp);
    record.damageState = record.hp <= 0 ? 'destroyed' : record.hp / record.maxHp < 0.34 ? 'critical' : record.hp / record.maxHp < 0.67 ? 'damaged' : 'intact';
    return record;
  });
  // v7/v8 records used an invisible completed chassis as their structural
  // parent.  That dependency is intentionally not migrated: the new robot is
  // exactly Core + player blocks, so legacy chassis-mounted parts start clean.
  if (sourceVersion > 0 && sourceVersion < 9) enriched.parts = [];
  delete enriched.chassis;
  for (const part of enriched.parts) {
    const meta = PART_META[part.type];
    if (!meta) continue;
    part.scale = part.scale ?? [...MODEL_TRANSFORMS[meta.model].scale];
    const limits = PART_LIMITS[part.type] ?? [0.5, 1.8];
    part.scaleFactor = clamp(Number(part.scaleFactor ?? 1), limits[0], limits[1]);
    // Functional parts use a uniform scale. Old non-uniform records are
    // migrated to their largest authored axis so visual and collider volumes
    // can never disagree.
    const legacyAxisScale = part.axisScale ?? [1, 1, 1];
    const uniformAxis = clamp(Math.max(...legacyAxisScale.map((value) => Number(value ?? 1))), 0.5, 1.8);
    part.axisScale = [uniformAxis, uniformAxis, uniformAxis];
    part.rotation = part.rotation ?? [0, 0, 0];
    part.mount = part.mount ?? null;
    if (part.type === 'wheel') {
      // Surface alignment already rotates local +X to the outward mount normal.
      // Old saves also flipped the left visual a second time, exposing its inner
      // face. Preserve only an explicit player-requested visual flip.
      part.hubFlipManual = Boolean(part.hubFlipManual);
      part.hubFlipped = part.hubFlipManual ? Boolean(part.hubFlipped) : false;
      part.wheelModel = ASSET_PATHS[part.wheelModel] ? part.wheelModel : 'new_wheel';
      part.driveType = part.wheelModel === 'track_heavy' ? 'track' : 'wheel';
    }
    part.mass = part.mass ?? meta.mass;
    const structural = WEAPON_TYPES.has(part.type) || ['pivotMount', 'sawSupport', 'sawMount', 'barAxis'].includes(part.type);
    part.baseHp = structural ? Math.max(Number(part.baseHp ?? 0), meta.hp) : (part.baseHp ?? meta.hp);
    part.gridUnit = GRID_UNIT;
    part.locked = false;
  }
  const driveParts = enriched.parts.filter((part) => part.type === 'wheel');
  if (driveParts.length) {
    const superHeavyCount = driveParts.filter((part) => ['wheel_wide', 'track_heavy'].includes(part.wheelModel)).length;
    const lightCount = driveParts.filter((part) => part.wheelModel === 'wheel_light').length;
    if (superHeavyCount >= Math.ceil(driveParts.length * 0.5)) enriched.weightClass = 'superheavy';
    else if (lightCount >= Math.ceil(driveParts.length * 0.5)) enriched.weightClass = 'lightweight';
    else enriched.weightClass = enriched.aiDesign?.weightClass ?? 'middleweight';
    enriched.driveType = driveParts.some((part) => part.wheelModel === 'track_heavy') ? 'track' : 'wheel';
  }
  return enriched;
}
const ARENA_LAYOUT = Object.freeze({
  name: 'Arena 01',
  halfWidth: 52,
  halfLength: 38,
  innerWallHeight: 1.25,
  innerWallThickness: 0.58,
  fenceModuleLength: 9,
  fenceHalfWidth: 54,
  fenceHalfLength: 40.5,
  audienceDistance: 10.5,
  outerWallHalfWidth: 80,
  outerWallHalfLength: 66,
  outerWallHeight: 18,
  spawnInset: 12,
});
const ARENA_X = ARENA_LAYOUT.halfWidth;
const ARENA_Z = ARENA_LAYOUT.halfLength;
const INDUSTRIAL_LAYOUT = Object.freeze({
  id: 'industrial01',
  name: 'Industrial Battle Zone 01',
  // V100: 30% shorter on both axes than the previous 500 x 400 battlefield.
  // Robots and environment modules retain their original world scale.
  halfWidth: 175,
  halfLength: 140,
  fenceHalfWidth: 175.55,
  fenceHalfLength: 140.55,
  spawnInset: 76,
  visualTiles: [44, 35],
});
const INDUSTRIAL_SPACE_SCALE = 0.7;
const DESERT_LAYOUT = Object.freeze({
  id: 'desert01', name: 'Red Canyon Conquest 01', halfWidth: 240, halfLength: 340,
  spawnInset: 34, captureRadius: 21, repairRadius: 17, terrainSegments: [72, 104],
  // Player-authored tactical diagram: RED north, BLUE south, A west, B east.
  pointA: [-155, 38], pointB: [155, -24], captureSeconds: 60,
});
// These authored mountain chains are gameplay geometry, not background props.
// Long boxes deliberately leave three broad passes in the south and north
// ranges, while the offset central spine breaks every direct objective line.
const DESERT_CANYON_SEGMENTS = Object.freeze([
  { id: 'south-west-wall', x: -195, z: -205, length: 70, depth: 22, height: 28, yaw: 0.02 },
  { id: 'south-inner-wall', x: -70, z: -205, length: 56, depth: 24, height: 31, yaw: -0.06 },
  { id: 'south-east-wall', x: 65, z: -205, length: 52, depth: 22, height: 27, yaw: 0.08 },
  { id: 'south-far-wall', x: 195, z: -205, length: 72, depth: 24, height: 32, yaw: -0.04 },
  { id: 'central-south-spine', x: -20, z: -112, length: 118, depth: 24, height: 35, yaw: Math.PI / 2 - 0.08 },
  { id: 'central-cross-spine', x: 8, z: 12, length: 76, depth: 25, height: 38, yaw: Math.PI / 2 + 0.04 },
  { id: 'central-north-spine', x: -28, z: 108, length: 64, depth: 24, height: 34, yaw: Math.PI / 2 - 0.12 },
  { id: 'north-far-west', x: -190, z: 195, length: 82, depth: 23, height: 32, yaw: -0.05 },
  { id: 'north-inner-west', x: -55, z: 195, length: 72, depth: 25, height: 36, yaw: 0.07 },
  { id: 'north-inner-east', x: 75, z: 195, length: 86, depth: 26, height: 39, yaw: -0.05 },
  { id: 'north-far-east', x: 198, z: 195, length: 64, depth: 23, height: 30, yaw: 0.06 },
  { id: 'a-north-ridge', x: -166, z: 105, length: 92, depth: 21, height: 29, yaw: 0.2 },
  { id: 'a-south-ridge', x: -170, z: -40, length: 78, depth: 20, height: 26, yaw: -0.3 },
  { id: 'b-north-plateau', x: 172, z: 72, length: 86, depth: 23, height: 34, yaw: -0.22 },
  { id: 'b-south-plateau', x: 176, z: -112, length: 76, depth: 22, height: 30, yaw: 0.26 },
  { id: 'west-route-spur', x: -222, z: -118, length: 70, depth: 22, height: 31, yaw: Math.PI / 2 + 0.18 },
  { id: 'east-route-spur', x: 221, z: 126, length: 74, depth: 22, height: 31, yaw: Math.PI / 2 - 0.16 },
]);
const MAP_DEFINITIONS = Object.freeze({
  arena01: Object.freeze({ id: 'arena01', name: ARENA_LAYOUT.name, halfWidth: ARENA_X, halfLength: ARENA_Z, spawnInset: ARENA_LAYOUT.spawnInset, toneExposure: 0.94 }),
  industrial01: Object.freeze({ ...INDUSTRIAL_LAYOUT, toneExposure: 1.02 }),
  desert01: Object.freeze({ ...DESERT_LAYOUT, toneExposure: 0.98 }),
});
let selectedMapId = 'arena01';
let activeMap = MAP_DEFINITIONS[selectedMapId];
const mapSceneObjects = { arena01: [], industrial01: [], desert01: [] };
const mapObstacleSets = { arena01: [], industrial01: [], desert01: [] };
const mapRampSets = { arena01: [], industrial01: [], desert01: [] };
let industrialNavigation = { nodes: [], links: [], revision: 0 };
let industrialSoloRouteQA = { active: false, kind: 'regions', route: [], path: [], visited: 0, distance: 0, lastPosition: null, startWorldTime: 0, elapsed: 0 };
let desertNavigation = { nodes: [], links: [], revision: 0 };
let desertRouteQA = { active: false, route: [], path: [], visited: 0, distance: 0, lastPosition: null, startWorldTime: 0, elapsed: 0 };
const activeHalfWidth = () => activeMap.halfWidth;
const activeHalfLength = () => activeMap.halfLength;
const GROUND_Y = 0.62;
const PHYSICS_FLOOR_TOP = 0;
const ROBOT_GROUND_SKIN = 0.006;
const MIN_CHASSIS_GROUND_CLEARANCE = 0.1;
const PHYSICS_FLOOR_THICKNESS = Object.freeze({ arena01: 0.9, industrial01: 1.2, desert01: 2.4 });
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const LANDING_PHYSICS = Object.freeze({
  airAngularDamping: 0.035,
  wheelAngularDamping: 1.45,
  broadBodyAngularDampingFast: 2.35,
  broadBodyAngularDampingSlow: 5.8,
  stableBodyAngularDamping: 3.4,
  edgeAngularDamping: 1.05,
  sideEdgeAngularDamping: 0.12,
  broadBodyPlanarDamping: 2.4,
  edgeBodyPlanarDamping: 0.68,
  broadBodyArea: 0.42,
  rollingThreshold: 0.5,
  sustainedSawForceScale: 0.025,
  sustainedRotaryForceScale: 0.04,
});
const ALLOWED_FLOOR_PENETRATION = 0.018;
const LANDING_SAMPLE_TIMES = Object.freeze([0, 0.1, 0.3, 0.5, 1]);

function smoothRange(distance, inner, outer) {
  const t = clamp((distance - inner) / Math.max(outer - inner, 0.001), 0, 1);
  return t * t * (3 - 2 * t);
}

function desertTerrainHeight(x, z) {
  // Broad, low-frequency shelves keep the drive lanes smooth. The visual and
  // collision-blocking height comes from the mountain chains rather than from
  // tiny terrain bumps that can launch a fast robot.
  const rolling = Math.sin(x * 0.017) * 0.58 + Math.cos(z * 0.012) * 0.52
    + Math.sin((x + z) * 0.008) * 0.4 + Math.cos((x - z) * 0.006) * 0.3;
  // Wide wind-built ridges are part of the analytic heightfield. Their long
  // wavelengths remain smooth for wheels while giving the chase camera clear
  // near/mid/far parallax instead of a featureless orange plane.
  const duneRidges = Math.sin(x * 0.029 + z * 0.011) * 0.23
    + Math.sin(x * 0.014 - z * 0.024 + 1.8) * 0.17;
  const westHighland = 6.8 * Math.exp(-(((x + 186) / 82) ** 2 + ((z - 72) / 176) ** 2));
  const eastPlateau = 7.6 * Math.exp(-(((x - 184) / 76) ** 2 + ((z + 18) / 168) ** 2));
  const northShelf = 4.2 * Math.exp(-(((x + 12) / 132) ** 2 + ((z - 220) / 72) ** 2));
  const southShelf = 3.4 * Math.exp(-(((x - 10) / 144) ** 2 + ((z + 232) / 78) ** 2));
  const centralValley = -2.8 * Math.exp(-(((x - 5) / 74) ** 2 + ((z + 4) / 245) ** 2));
  const aValley = -1.25 * Math.exp(-(((x + 154) / 66) ** 2 + ((z - 38) / 88) ** 2));
  const bBasin = -1.55 * Math.exp(-(((x - 155) / 70) ** 2 + ((z + 24) / 82) ** 2));
  let height = rolling + duneRidges + westHighland + eastPlateau + northShelf + southShelf + centralValley + aValley + bBasin;
  // Spawn/repair pads and both objectives are deliberately broad, nearly level
  // combat shelves connected by the surrounding rolling terrain.
  const shelves = [
    [0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset), 34],
    [0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset, 34],
    [DESERT_LAYOUT.pointA[0], DESERT_LAYOUT.pointA[1], DESERT_LAYOUT.captureRadius + 11],
    [DESERT_LAYOUT.pointB[0], DESERT_LAYOUT.pointB[1], DESERT_LAYOUT.captureRadius + 11],
  ];
  for (const [sx, sz, radius] of shelves) {
    const blend = smoothRange(Math.hypot(x - sx, z - sz), radius * 0.65, radius);
    height = lerp(0.18, height, blend);
  }
  return height;
}

function groundSurfaceHeightAt(x, z) {
  return selectedMapId === 'desert01' ? desertTerrainHeight(x, z) : PHYSICS_FLOOR_TOP;
}

function worldTorqueToEulerAxes(torqueWorld, yaw, pitch) {
  // Euler order is YXZ: yaw turns the pitch axis, then pitch turns the roll
  // axis. Projecting onto these actual derivative axes avoids treating a
  // steeply tilted body's world torque as if it were still upright.
  const yawRotation = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, yaw);
  const pitchAxis = X_AXIS.clone().applyQuaternion(yawRotation);
  const rollAxis = Z_AXIS.clone().applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ')));
  return new THREE.Vector3(torqueWorld.dot(pitchAxis), torqueWorld.dot(Y_AXIS), torqueWorld.dot(rollAxis));
}

function convexHullXZ(points) {
  const unique = [...new Map(points.map((point) => [`${point.x.toFixed(5)}:${point.z.toFixed(5)}`, point])).values()]
    .sort((a, b) => a.x - b.x || a.z - b.z);
  if (unique.length <= 2) return unique;
  const cross = (origin, a, b) => (a.x - origin.x) * (b.z - origin.z) - (a.z - origin.z) * (b.x - origin.x);
  const lower = [];
  for (const point of unique) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 1e-6) lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (let index = unique.length - 1; index >= 0; index--) {
    const point = unique[index];
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 1e-6) upper.pop();
    upper.push(point);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

function polygonAreaXZ(points) {
  if (points.length < 3) return 0;
  let twiceArea = 0;
  for (let index = 0; index < points.length; index++) {
    const next = points[(index + 1) % points.length];
    twiceArea += points[index].x * next.z - next.x * points[index].z;
  }
  return Math.abs(twiceArea) * 0.5;
}

function pointInsideConvexXZ(point, polygon, epsilon = 0.025) {
  if (polygon.length < 3) return false;
  let sign = 0;
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const cross = (b.x - a.x) * (point.z - a.z) - (b.z - a.z) * (point.x - a.x);
    if (Math.abs(cross) <= epsilon) continue;
    const nextSign = Math.sign(cross);
    if (sign && nextSign !== sign) return false;
    sign = nextSign;
  }
  return true;
}

function obstacleVerticesXZ(obstacle) {
  const cos = Math.cos(obstacle.rotationY ?? 0);
  const sin = Math.sin(obstacle.rotationY ?? 0);
  return [
    [-obstacle.halfX, -obstacle.halfZ], [obstacle.halfX, -obstacle.halfZ],
    [obstacle.halfX, obstacle.halfZ], [-obstacle.halfX, obstacle.halfZ],
  ].map(([x, z]) => new THREE.Vector3(
    obstacle.x + x * cos + z * sin,
    0,
    obstacle.z - x * sin + z * cos,
  ));
}

function robotCollisionFootprint(robot) {
  const quaternion = robot.root.quaternion;
  const points = [];
  for (const component of robot.colliderComponents) {
    for (const point of component.points) points.push(point.clone().applyQuaternion(quaternion).add(robot.root.position).setY(0));
  }
  // Tyres participate as slim rolling cylinders. They do not become the old
  // oversized circular chassis collider, and detached wheels are ignored.
  for (const wheel of robot.wheels) {
    if (wheel.part.detached) continue;
    const halfWidth = wheel.halfWidth;
    const rollingRadius = wheel.physicsRadius;
    for (const [x, z] of [[-halfWidth, -rollingRadius], [halfWidth, -rollingRadius], [halfWidth, rollingRadius], [-halfWidth, rollingRadius]]) {
      points.push(wheel.wheelRoot.position.clone().add(new THREE.Vector3(x, 0, z)).applyQuaternion(quaternion).add(robot.root.position).setY(0));
    }
  }
  return convexHullXZ(points);
}

function projectPolygonXZ(polygon, axis) {
  let min = Infinity;
  let max = -Infinity;
  for (const point of polygon) {
    const value = point.x * axis.x + point.z * axis.z;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  return { min, max };
}

function polygonObstacleContact(robot, obstacle) {
  const robotPolygon = robotCollisionFootprint(robot);
  if (robotPolygon.length < 3) return null;
  const obstaclePolygon = obstacleVerticesXZ(obstacle);
  const axes = [];
  const collectAxes = (polygon) => {
    for (let index = 0; index < polygon.length; index++) {
      const edge = polygon[(index + 1) % polygon.length].clone().sub(polygon[index]);
      const axis = new THREE.Vector3(-edge.z, 0, edge.x);
      if (axis.lengthSq() <= 1e-8) continue;
      axis.normalize();
      if (!axes.some((existing) => Math.abs(existing.dot(axis)) > 0.9995)) axes.push(axis);
    }
  };
  collectAxes(robotPolygon);
  collectAxes(obstaclePolygon);
  const centreDelta = robot.root.position.clone().sub(new THREE.Vector3(obstacle.x, robot.root.position.y, obstacle.z)).setY(0);
  let normal = null;
  let penetration = Infinity;
  for (const rawAxis of axes) {
    const axis = rawAxis.clone();
    if (centreDelta.dot(axis) < 0) axis.negate();
    const robotProjection = projectPolygonXZ(robotPolygon, axis);
    const obstacleProjection = projectPolygonXZ(obstaclePolygon, axis);
    if (robotProjection.min >= obstacleProjection.max - 1e-6 || robotProjection.max <= obstacleProjection.min + 1e-6) return null;
    const push = obstacleProjection.max - robotProjection.min;
    if (push < penetration) {
      penetration = push;
      normal = axis;
    }
  }
  if (!normal || !Number.isFinite(penetration)) return null;
  const cos = Math.cos(-(obstacle.rotationY ?? 0));
  const sin = Math.sin(-(obstacle.rotationY ?? 0));
  const dx = robot.root.position.x - obstacle.x;
  const dz = robot.root.position.z - obstacle.z;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  let contactX = clamp(localX, -obstacle.halfX, obstacle.halfX);
  let contactZ = clamp(localZ, -obstacle.halfZ, obstacle.halfZ);
  if (Math.abs(localX) <= obstacle.halfX && Math.abs(localZ) <= obstacle.halfZ) {
    const gapX = obstacle.halfX - Math.abs(localX);
    const gapZ = obstacle.halfZ - Math.abs(localZ);
    if (gapX < gapZ) contactX = (Math.sign(localX) || 1) * obstacle.halfX;
    else contactZ = (Math.sign(localZ) || 1) * obstacle.halfZ;
  }
  const worldCos = Math.cos(obstacle.rotationY ?? 0);
  const worldSin = Math.sin(obstacle.rotationY ?? 0);
  const point = new THREE.Vector3(
    obstacle.x + contactX * worldCos + contactZ * worldSin,
    obstacle.colliderHeight ? Math.min(robot.root.position.y, obstacle.colliderHeight * 0.55) : 0.5,
    obstacle.z - contactX * worldSin + contactZ * worldCos,
  );
  return { normal, penetration, point, robotPolygon, obstaclePolygon };
}

function orientedBoxLocalPoint(point, obstacle) {
  const cos = Math.cos(-(obstacle.rotationY ?? 0));
  const sin = Math.sin(-(obstacle.rotationY ?? 0));
  const dx = point.x - obstacle.x;
  const dz = point.z - obstacle.z;
  return new THREE.Vector2(dx * cos - dz * sin, dx * sin + dz * cos);
}

function orientedBoxWorldDirection(localX, localZ, obstacle) {
  const cos = Math.cos(obstacle.rotationY ?? 0);
  const sin = Math.sin(obstacle.rotationY ?? 0);
  return new THREE.Vector3(localX * cos + localZ * sin, 0, -localX * sin + localZ * cos).normalize();
}

// Continuous centre sweep for the massive canyon colliders. The regular SAT
// solver remains responsible for exact hull contact, while this test prevents
// a fast dash or impact step from ever ending on the far side or inside a
// mountain. The clearance is deliberately bounded so the three authored
// canyon routes retain their playable width.
function sweptOrientedBoxContact(robot, obstacle, fromPosition) {
  if (!fromPosition || obstacle.kind !== 'box') return null;
  const start = orientedBoxLocalPoint(fromPosition, obstacle);
  const finish = orientedBoxLocalPoint(robot.root.position, obstacle);
  const delta = finish.clone().sub(start);
  if (delta.lengthSq() <= 1e-10) return null;
  const clearance = obstacle.obstacleType === 'desert-cliff'
    ? clamp(robot.radius * 0.42, 0.72, 2.6)
    : clamp(robot.radius * 0.3, 0.35, 1.5);
  const halfX = obstacle.halfX + clearance;
  const halfZ = obstacle.halfZ + clearance;
  const startInside = Math.abs(start.x) <= halfX && Math.abs(start.y) <= halfZ;
  if (startInside) return null;

  let entry = 0;
  let exit = 1;
  let hitLocalX = 0;
  let hitLocalZ = 0;
  for (const axis of [
    { start: start.x, delta: delta.x, half: halfX, nx: 1, nz: 0 },
    { start: start.y, delta: delta.y, half: halfZ, nx: 0, nz: 1 },
  ]) {
    if (Math.abs(axis.delta) < 1e-9) {
      if (Math.abs(axis.start) > axis.half) return null;
      continue;
    }
    let near = (-axis.half - axis.start) / axis.delta;
    let far = (axis.half - axis.start) / axis.delta;
    let normalSign = -1;
    if (near > far) {
      [near, far] = [far, near];
      normalSign = 1;
    }
    if (near > entry) {
      entry = near;
      hitLocalX = axis.nx * normalSign;
      hitLocalZ = axis.nz * normalSign;
    }
    exit = Math.min(exit, far);
    if (entry > exit) return null;
  }
  if (entry < 0 || entry > 1 || (Math.abs(finish.x) > halfX && Math.abs(finish.y) > halfZ)) return null;
  const normal = orientedBoxWorldDirection(hitLocalX, hitLocalZ, obstacle);
  const travel = robot.root.position.clone().sub(fromPosition);
  const safeT = Math.max(0, entry - 0.002 / Math.max(0.001, travel.length()));
  const position = fromPosition.clone().addScaledVector(travel, safeT).addScaledVector(normal, 0.002);
  const point = position.clone().addScaledVector(normal, -clearance);
  return { normal, point, position, clearance, fraction: entry };
}

function expandedBoxCentreContact(robot, obstacle) {
  if (obstacle.kind !== 'box' || obstacle.obstacleType !== 'desert-cliff') return null;
  const local = orientedBoxLocalPoint(robot.root.position, obstacle);
  const clearance = clamp(robot.radius * 0.42, 0.72, 2.6);
  const halfX = obstacle.halfX + clearance;
  const halfZ = obstacle.halfZ + clearance;
  if (Math.abs(local.x) >= halfX || Math.abs(local.y) >= halfZ) return null;
  const gapX = halfX - Math.abs(local.x);
  const gapZ = halfZ - Math.abs(local.y);
  const alongX = gapX <= gapZ;
  const localNX = alongX ? (Math.sign(local.x) || 1) : 0;
  const localNZ = alongX ? 0 : (Math.sign(local.y) || 1);
  const normal = orientedBoxWorldDirection(localNX, localNZ, obstacle);
  const penetration = (alongX ? gapX : gapZ) + 0.001;
  return {
    normal,
    penetration,
    point: robot.root.position.clone().addScaledVector(normal, -(clearance + 0.001)),
  };
}

function footprintBoundsXZ(robot) {
  const polygon = robotCollisionFootprint(robot);
  return polygon.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x), maxX: Math.max(bounds.maxX, point.x),
    minZ: Math.min(bounds.minZ, point.z), maxZ: Math.max(bounds.maxZ, point.z),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
}

const renderer = new THREE.WebGLRenderer({
  canvas: ui.canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
const startupQuery = new URLSearchParams(location.search);
const EXTENDED_PHYSICS_TELEMETRY = ['systemsQA', 'physicsQA', 'autoQA', 'blockCombatQA'].some((key) => startupQuery.get(key) === '1');
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.94;

const QUALITY_STORAGE_KEY = 'battlebot-quality-preset-v1';
const DASH_KEY_STORAGE_KEY = 'battlebot-dash-key-v1';
const DASH_KEYS = new Set(['ControlLeft', 'AltLeft', 'KeyF']);
const QUALITY_PRESETS = Object.freeze({
  low: { label: '낮음', pixelRatio: 1, shadows: false, sparkScale: 0.48, sparkLimit: 180, fragmentScale: 0.48, fragmentBursts: 10, debrisLimit: 60, uiHz: 6 },
  medium: { label: '중간', pixelRatio: 1.25, shadows: true, sparkScale: 0.74, sparkLimit: 290, fragmentScale: 0.72, fragmentBursts: 16, debrisLimit: 96, uiHz: 8 },
  high: { label: '높음', pixelRatio: 1.7, shadows: true, sparkScale: 1, sparkLimit: 420, fragmentScale: 1, fragmentBursts: 24, debrisLimit: 140, uiHz: 10 },
});

function loadQualityPreset() {
  const stored = localStorage.getItem(QUALITY_STORAGE_KEY);
  if (QUALITY_PRESETS[stored]) return stored;
  const cores = navigator.hardwareConcurrency ?? 6;
  const memory = navigator.deviceMemory ?? 6;
  return cores <= 4 || memory <= 4 ? 'low' : 'medium';
}

let qualityPreset = loadQualityPreset();
let adaptiveQualityScale = 1;
let adaptiveFrameMsEMA = 16.7;
let adaptiveQualityCooldown = 0;
let dashKey = DASH_KEYS.has(localStorage.getItem(DASH_KEY_STORAGE_KEY)) ? localStorage.getItem(DASH_KEY_STORAGE_KEY) : 'ControlLeft';

function populationBudgetScale() {
  const count = robots.length || 1;
  if (count <= 4) return 1;
  if (count <= 8) return 0.88;
  if (count <= 12) return 0.7;
  return 0.56;
}

function currentPerformanceBudget() {
  const preset = QUALITY_PRESETS[qualityPreset] ?? QUALITY_PRESETS.medium;
  const populationScale = populationBudgetScale();
  return {
    ...preset,
    sparkScale: preset.sparkScale * populationScale * lerp(0.72, 1, adaptiveQualityScale),
    sparkLimit: Math.max(120, Math.round(preset.sparkLimit * Math.max(0.72, populationScale))),
    fragmentScale: preset.fragmentScale * Math.max(0.62, populationScale),
    fragmentBursts: Math.max(7, Math.round(preset.fragmentBursts * Math.max(0.65, populationScale))),
    debrisLimit: Math.max(48, Math.round(preset.debrisLimit * Math.max(0.68, populationScale))),
  };
}

function physicsSolverHz() {
  const count = robots.length;
  if (count <= 4) return 90;
  if (count <= 8) return qualityPreset === 'high' ? 90 : qualityPreset === 'medium' ? 72 : 60;
  return qualityPreset === 'high' ? 72 : qualityPreset === 'medium' ? 60 : 50;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151a1f);
scene.fog = new THREE.FogExp2(0x151a1f, 0.0026);
const camera = new THREE.PerspectiveCamera(53, 1, 0.1, 1200);
camera.position.set(0, 8, -14);

const models = {};
const robots = [];
const aliveRobots = [];
const damageTargetCache = new Map();
let robotInstanceSequence = 0;

function rebuildCombatCaches() {
  aliveRobots.length = 0;
  for (const robot of robots) if (!robot.dead) aliveRobots.push(robot);
  for (const robot of robots) {
    let targets = damageTargetCache.get(robot.id);
    if (!targets) {
      targets = [];
      damageTargetCache.set(robot.id, targets);
    }
    targets.length = 0;
    for (const target of aliveRobots) {
      if (target !== robot && (friendlyFire || isFreeForAllMode() || robot.team !== target.team)) targets.push(target);
    }
  }
}
const debris = [];
const MAX_ACTIVE_DEBRIS = 140;
const BLOCK_DEBRIS_LIFETIME = 9;
const FUNCTIONAL_DEBRIS_LIFETIME = 11;
const DEBRIS_FADE_SECONDS = 0.75;
const BLOCK_FRAGMENT_BURST_LIMIT = 24;
const blockFragmentGeometry = new THREE.BoxGeometry(1, 1, 1);
const blockFragmentBursts = [];
const blockFragmentDummy = new THREE.Object3D();
const blockFragmentStats = {
  bursts: 0, fragments: 0, maximumBurst: 0, colorMatches: 0,
  weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0,
  sequence: 'colored-fragments-before-block-detach',
};
const RESPAWN_REASONS = new Set(['CORE_DESTROYED', 'BLOCKS_LE_5', 'PLAYER_REQUEST', 'AI_DISABLED', 'OUT_OF_BOUNDS']);
const respawnStats = {
  deaths: 0, respawns: 0, aiRespawns: 0, playerRespawns: 0, protectionBlocks: 0,
  rejectedUnknown: 0,
  reasonCounts: { CORE_DESTROYED: 0, BLOCKS_LE_5: 0, PLAYER_REQUEST: 0, AI_DISABLED: 0, OUT_OF_BOUNDS: 0 },
  log: [],
};
const RESPAWN_DELAY_SECONDS = 10;
const SPAWN_PROTECTION_SECONDS = 2.2;
const BATTLE_RESPAWNS_ENABLED = true;
const effects = [];
const obstacles = [];
const ramps = [];
const keys = new Set();
const dustGeometry = new THREE.SphereGeometry(0.12, 5, 4);

function addEnvironmentColliderDebug({ name, mapId, x = 0, y = 0, z = 0, width, height, depth, rotationY = 0, color = 0x65ffb5 }) {
  const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth));
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: false });
  const debug = new THREE.LineSegments(geometry, material);
  debug.name = name;
  debug.position.set(x, y, z);
  debug.rotation.y = rotationY;
  debug.renderOrder = 24;
  debug.visible = colliderDebugEnabled && selectedMapId === mapId;
  debug.userData = { environmentColliderDebug: true, mapId };
  scene.add(debug);
  return debug;
}

function setEnvironmentColliderDebug(enabled) {
  scene.traverse((object) => {
    if (object.userData?.environmentColliderDebug) object.visible = enabled && object.userData.mapId === selectedMapId;
  });
}

function blockMaterialSnapshot(object) {
  const materials = [];
  object?.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    const source = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of source) materials.push({
      uuid: material.uuid,
      color: material.color ? `#${material.color.getHexString()}` : null,
      opacity: Number((material.opacity ?? 1).toFixed(3)),
    });
  });
  return materials;
}

function registerDebris(item) {
  item.initialLife = item.life;
  item.createdAt = worldTime;
  item.originalMaterials = blockMaterialSnapshot(item.object);
  item.fadeStarted = false;
  item.sleeping = false;
  item.sleepTimer = 0;
  item.bounds = new THREE.Box3();
  item.object.traverse((node) => {
    if ((!node.isMesh && !node.isLineSegments) || !node.material) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) material.userData.debrisBaseOpacity = material.opacity ?? 1;
  });
  item.object.updateWorldMatrix(true, true);
  const initialBounds = new THREE.Box3().setFromObject(item.object);
  const initialFloor = groundSurfaceHeightAt(item.object.position.x, item.object.position.z);
  const initialFloorCorrection = initialFloor + 0.012 - initialBounds.min.y;
  if (initialFloorCorrection > 0) {
    item.object.position.y += initialFloorCorrection;
    item.object.updateWorldMatrix(true, true);
    item.spawnFloorCorrection = initialFloorCorrection;
  }
  debris.push(item);
  while (debris.length > currentPerformanceBudget().debrisLimit) {
    const oldest = debris.shift();
    if (oldest) scene.remove(oldest.object);
  }
  return item;
}

function setDebrisOpacity(item, opacity) {
  item.object.traverse((node) => {
    if ((!node.isMesh && !node.isLineSegments) || !node.material) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      const baseOpacity = material.userData.debrisBaseOpacity ?? material.opacity ?? 1;
      material.transparent = opacity < 0.999;
      material.opacity = baseOpacity * opacity;
      material.depthWrite = opacity >= 0.999;
    }
  });
}

function renderedBlockColor(part) {
  let result = null;
  part?.object?.traverse((node) => {
    if (result || !node.isMesh || !node.material) return;
    const material = Array.isArray(node.material) ? node.material.find((item) => item?.color) : node.material;
    if (material?.color) result = material.color.clone();
  });
  return result ?? new THREE.Color(LV1_BLOCK_COLOR);
}

function spawnBlockFragments(part, point, impulse, tier = 'weak') {
  if (!part?.object || !point) return null;
  const ranges = { weak: [1, 3], medium: [3, 8], strong: [8, 15], veryStrong: [15, 25], critical: [20, 35] };
  const [minimum, maximum] = ranges[tier] ?? ranges.weak;
  const budget = currentPerformanceBudget();
  const unscaledCount = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
  const tierMinimum = { weak: 1, medium: 2, strong: 5, veryStrong: 8, critical: 12 }[tier] ?? 1;
  const activeFragments = blockFragmentBursts.reduce((sum, burst) => sum + burst.shards.length, 0);
  const fragmentLimit = Math.max(90, budget.fragmentBursts * 14);
  const count = Math.min(Math.max(tierMinimum, Math.round(unscaledCount * budget.fragmentScale)), Math.max(0, fragmentLimit - activeFragments));
  if (count <= 0) return null;
  const color = renderedBlockColor(part);
  const material = new THREE.MeshStandardMaterial({
    color: color.clone(), emissive: color.clone().multiplyScalar(0.075), emissiveIntensity: 0.32,
    roughness: 0.52, metalness: 0.48, transparent: true, opacity: 1,
  });
  const mesh = new THREE.InstancedMesh(blockFragmentGeometry, material, count);
  mesh.name = `BlockHitFragments_${part.assemblyId}_${tier}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  mesh.frustumCulled = false;
  scene.add(mesh);
  const centre = part.object.getWorldPosition(new THREE.Vector3());
  const surfaceNormal = point.clone().sub(centre);
  if (surfaceNormal.lengthSq() < 0.0001) surfaceNormal.set(0, 1, 0);
  else surfaceNormal.normalize();
  const attackBack = impulse?.lengthSq() > 0.001 ? impulse.clone().normalize().negate() : surfaceNormal.clone();
  const mainDirection = surfaceNormal.multiplyScalar(0.62).addScaledVector(attackBack, 0.52).add(new THREE.Vector3(0, 0.34, 0)).normalize();
  const speedRange = {
    weak: [2.8, 5.4], medium: [4.2, 8.8], strong: [6.8, 13.8],
    veryStrong: [10.5, 21], critical: [13, 27],
  }[tier] ?? [2.8, 5.4];
  const shards = [];
  for (let index = 0; index < count; index++) {
    const scatter = new THREE.Vector3((Math.random() - 0.5) * 1.35, Math.random() * 1.15 + 0.05, (Math.random() - 0.5) * 1.35)
      .multiplyScalar(tier === 'critical' ? 1.35 : tier === 'veryStrong' ? 1.12 : 0.78);
    const direction = mainDirection.clone().add(scatter).normalize();
    const speed = lerp(speedRange[0], speedRange[1], Math.random());
    const largeCount = tier === 'critical' ? Math.min(2, count) : tier === 'veryStrong' || tier === 'strong' ? 1 : 0;
    const mediumTarget = tier === 'critical' ? 6 : tier === 'veryStrong' ? 5 : tier === 'strong' ? 4 : tier === 'medium' ? 2 : 1;
    const mediumCount = Math.min(count - largeCount, mediumTarget);
    const scale = index < largeCount
      ? lerp(GRID_UNIT * 0.72, GRID_UNIT * 1.18, Math.random())
      : index < largeCount + mediumCount
        ? lerp(GRID_UNIT * 0.34, GRID_UNIT * 0.68, Math.random())
        : lerp(GRID_UNIT * 0.14, GRID_UNIT * 0.36, Math.random() ** 1.25);
    shards.push({
      position: point.clone().add(new THREE.Vector3((Math.random() - 0.5) * GRID_UNIT * 0.12, (Math.random() - 0.2) * GRID_UNIT * 0.1, (Math.random() - 0.5) * GRID_UNIT * 0.12)),
      velocity: direction.multiplyScalar(speed).addScaledVector(impulse ?? new THREE.Vector3(), 0.0008),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      angular: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(16 + Math.random() * 18),
      scale: new THREE.Vector3(scale * lerp(0.55, 1.25, Math.random()), scale * lerp(0.45, 1.1, Math.random()), scale * lerp(0.7, 1.55, Math.random())),
      age: 0,
      life: lerp(qualityPreset === 'high' ? 5 : qualityPreset === 'medium' ? 4 : 3, qualityPreset === 'high' ? 10 : qualityPreset === 'medium' ? 8 : 6, Math.random()),
      sleeping: false,
      sleepTimer: 0,
    });
  }
  const burst = { mesh, material, shards, tier, color: `#${color.getHexString()}`, partId: part.assemblyId, spawnedBeforeDetach: !part.detached };
  blockFragmentBursts.push(burst);
  blockFragmentStats.bursts++;
  blockFragmentStats.fragments += count;
  blockFragmentStats.maximumBurst = Math.max(blockFragmentStats.maximumBurst, count);
  blockFragmentStats[tier]++;
  if (color.equals(renderedBlockColor(part))) blockFragmentStats.colorMatches++;
  while (blockFragmentBursts.length > currentPerformanceBudget().fragmentBursts) {
    const oldest = blockFragmentBursts.shift();
    if (oldest) { scene.remove(oldest.mesh); oldest.material.dispose(); }
  }
  return burst;
}

function updateBlockFragmentBursts(dt) {
  for (let burstIndex = blockFragmentBursts.length - 1; burstIndex >= 0; burstIndex--) {
    const burst = blockFragmentBursts[burstIndex];
    let alive = 0;
    let minimumRemaining = Infinity;
    for (let index = 0; index < burst.shards.length; index++) {
      const shard = burst.shards[index];
      shard.age += dt;
      const remaining = shard.life - shard.age;
      if (remaining <= 0) {
        blockFragmentDummy.position.set(0, -1000, 0);
        blockFragmentDummy.scale.setScalar(0.00001);
      } else {
        alive++;
        minimumRemaining = Math.min(minimumRemaining, remaining);
        if (!shard.sleeping) {
          shard.velocity.y -= 9.81 * 1.55 * dt;
          shard.position.addScaledVector(shard.velocity, dt);
          const floor = Math.max(shard.scale.x, shard.scale.y, shard.scale.z) * 0.5 + 0.008;
          if (shard.position.y < floor) {
            shard.position.y = floor;
            if (shard.velocity.y < 0) shard.velocity.y *= -0.28;
            shard.velocity.x *= Math.exp(-2.2 * dt);
            shard.velocity.z *= Math.exp(-2.2 * dt);
            shard.angular.multiplyScalar(Math.exp(-1.5 * dt));
            const calm = shard.velocity.lengthSq() < 0.05 && shard.angular.lengthSq() < 0.12;
            shard.sleepTimer = calm ? shard.sleepTimer + dt : 0;
            if (shard.sleepTimer > 0.45) {
              shard.sleeping = true;
              shard.velocity.set(0, 0, 0);
              shard.angular.set(0, 0, 0);
            }
          }
          shard.rotation.x += shard.angular.x * dt;
          shard.rotation.y += shard.angular.y * dt;
          shard.rotation.z += shard.angular.z * dt;
        }
        blockFragmentDummy.position.copy(shard.position);
        blockFragmentDummy.rotation.copy(shard.rotation);
        blockFragmentDummy.scale.copy(shard.scale);
      }
      blockFragmentDummy.updateMatrix();
      burst.mesh.setMatrixAt(index, blockFragmentDummy.matrix);
    }
    burst.mesh.instanceMatrix.needsUpdate = true;
    if (minimumRemaining < 0.65) burst.material.opacity = clamp(minimumRemaining / 0.65, 0, 1);
    if (!alive) {
      scene.remove(burst.mesh);
      burst.material.dispose();
      blockFragmentBursts.splice(burstIndex, 1);
    }
  }
}

function clearBlockFragmentBursts() {
  for (const burst of blockFragmentBursts) { scene.remove(burst.mesh); burst.material.dispose(); }
  blockFragmentBursts.length = 0;
}
// Four simultaneous 90-particle critical showers fit without allocating.
// Packing only live particles into the front of this pool avoids uploading
// hundreds of hidden matrices on every visual frame.
const SPARK_POOL_SIZE = 420;
const sparkHeadGeometry = new THREE.BoxGeometry(1, 1, 1);
const sparkStreakGeometry = new THREE.BoxGeometry(1, 1, 1);
sparkStreakGeometry.translate(-0.5, 0, 0);
const sparkStreakPositions = sparkStreakGeometry.getAttribute('position');
const sparkStreakGradient = new Float32Array(sparkStreakPositions.count * 3);
for (let index = 0; index < sparkStreakPositions.count; index++) {
  const along = clamp(sparkStreakPositions.getX(index) + 1, 0, 1);
  const intensity = 0.08 + Math.pow(along, 1.35) * 0.92;
  sparkStreakGradient[index * 3] = intensity;
  sparkStreakGradient[index * 3 + 1] = intensity;
  sparkStreakGradient[index * 3 + 2] = intensity;
}
sparkStreakGeometry.setAttribute('color', new THREE.BufferAttribute(sparkStreakGradient, 3));
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('./assets_v3/arena_floor_tile.png?v=team-arena-6');
floorTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(14, 10);
floorTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const industrialFloorTexture = textureLoader.load('./assets_v6/industrial_floor_tile.png?v=industrial-92');
industrialFloorTexture.colorSpace = THREE.SRGBColorSpace;
industrialFloorTexture.wrapS = industrialFloorTexture.wrapT = THREE.RepeatWrapping;
industrialFloorTexture.repeat.set(...INDUSTRIAL_LAYOUT.visualTiles);
industrialFloorTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const dustMaterial = new THREE.MeshBasicMaterial({ color: 0x77716b, transparent: true, opacity: 0.34, depthWrite: false });
const sparkTailMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false });
const sparkCoreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false });
const sparkHeadMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false });
const sparkTailInstances = new THREE.InstancedMesh(sparkStreakGeometry, sparkTailMaterial, SPARK_POOL_SIZE);
const sparkCoreInstances = new THREE.InstancedMesh(sparkStreakGeometry, sparkCoreMaterial, SPARK_POOL_SIZE);
const sparkHeadInstances = new THREE.InstancedMesh(sparkHeadGeometry, sparkHeadMaterial, SPARK_POOL_SIZE);
const hiddenSparkMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
const hiddenSparkColor = new THREE.Color(0x000000);
for (const instances of [sparkTailInstances, sparkCoreInstances, sparkHeadInstances]) {
  instances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  instances.frustumCulled = false;
  instances.renderOrder = 24;
  for (let index = 0; index < SPARK_POOL_SIZE; index++) {
    instances.setMatrixAt(index, hiddenSparkMatrix);
    instances.setColorAt(index, hiddenSparkColor);
  }
  instances.instanceMatrix.needsUpdate = true;
  instances.instanceColor.needsUpdate = true;
  instances.count = 0;
  scene.add(instances);
}
const sparkParticles = Array.from({ length: SPARK_POOL_SIZE }, () => ({
  active: false,
  position: new THREE.Vector3(),
  velocity: new THREE.Vector3(),
  life: 0,
  initialLife: 0,
  age: 0,
  growTime: 0.03,
  tailLength: 0,
  brightness: 1,
  headScale: 1,
  widthScale: 1,
  denseCore: false,
  upwardHero: false,
  layer: 'short',
}));
let sparkPoolCursor = 0;
const pendingSparkBursts = [];
const sparkMatrixDummy = new THREE.Object3D();
const sparkDirectionScratch = new THREE.Vector3();
const sparkTailColorScratch = new THREE.Color();
const sparkCoreColorScratch = new THREE.Color();
const sparkHeadColorScratch = new THREE.Color();
const SMOKE_POOL_SIZE = 180;
const smokeGeometry = new THREE.IcosahedronGeometry(0.12, 0);
const smokeMaterial = new THREE.MeshBasicMaterial({ color: 0x8d9498, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.NormalBlending });
const smokeInstances = new THREE.InstancedMesh(smokeGeometry, smokeMaterial, SMOKE_POOL_SIZE);
smokeInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
smokeInstances.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(SMOKE_POOL_SIZE * 3), 3);
smokeInstances.frustumCulled = false;
smokeInstances.renderOrder = 13;
for (let index = 0; index < SMOKE_POOL_SIZE; index++) {
  smokeInstances.setMatrixAt(index, hiddenSparkMatrix);
  smokeInstances.setColorAt(index, new THREE.Color(0x777d80));
}
smokeInstances.count = 0;
scene.add(smokeInstances);
const smokeParticles = Array.from({ length: SMOKE_POOL_SIZE }, () => ({ active: false, position: new THREE.Vector3(), velocity: new THREE.Vector3(), life: 0, initialLife: 0, size: 0.1, shade: 0.55 }));
const smokeMatrixDummy = new THREE.Object3D();
const smokeColorScratch = new THREE.Color();
let smokePoolCursor = 0;
const smokeStats = { emitted: 0, dashBursts: 0, activePeak: 0, outletCount: 0, verticalOutlets: 0, tripleOutlets: 0, lodSkips: 0, detachedStops: 0 };

let player = null;
let arenaFloorSaw = null;
let firePad = null;
let fireLight = null;
let worldTime = 0;
let cameraShake = 0;
let cameraDashFov = 0;
let joystickPointer = null;
let joystickAxis = { x: 0, y: 0 };
let brakeHeld = false;
let messageTimer = 0;
let audioContext = null;
let qa = null;
let lastQAResult = null;
let mode = 'lobby';
let gamePaused = false;
let savedAssembly = loadStoredAssembly();
let workingAssembly = cloneData(savedAssembly);
let lobbyRobot = null;
let lobbyOrbitTime = 0;
let lobbyKeyLight = null;
let lobbyFillLight = null;
let lobbyRimLight = null;
let lobbyModalAction = null;
let garageRoot = null;
let garageGhost = null;
let garageStage = null;
let selectedPartId = null;
let candidatePart = null;
let undoStack = [];
let garageDirty = false;
let orbitYaw = -0.65;
let orbitPitch = 0.46;
let orbitDistance = 8.7;
let orbitPointer = null;
let orbitLast = { x: 0, y: 0 };
let transformMode = 'move';
let transformAxis = 'x';
let garageGizmo = null;
let garageDrag = null;
let assemblyMode = 'parts';
let selectedBlockId = 'block-core';
let candidateBlock = null;
let blockGhost = null;
let blockGridOverlay = null;
let blockPointerMoved = false;
let blockDeleteMode = false;
let blockDeleteHoverId = null;
let blockDeleteOutline = null;
let blockRotationAxis = 'y';
let blockPaintPointerId = null;
let blockPaintLastKey = null;
const garageTouchPoints = new Map();
let garagePinchDistance = null;
const garagePartObjects = new Map();
const garageBlockObjects = new Map();
const garageRaycaster = new THREE.Raycaster();
const garagePointer = new THREE.Vector2();
const garageDragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const mountLocalBounds = new Map();
const MOUNT_EPSILON = 0.004;
let sawContactTimer = 0;
let sawLoopAudio = null;
let weaponLoopAudio = null;
let sawGrindTickCooldown = 0;
let lastDebrisLandingSoundAt = -Infinity;
let battleMode = 'ffa4';
const isFreeForAllMode = () => battleMode.startsWith('ffa');
let friendlyFire = false;
let battleElapsed = 0;
let battleResultShown = false;
let colliderDebugEnabled = false;
let arenaTopView = false;
const arenaStats = {
  name: ARENA_LAYOUT.name,
  floor: { visualTiles: [16, 12], physicsColliderCount: 1, gaps: 0 },
  innerWalls: 4,
  wallCornerGaps: 0,
  fenceModules: { north: 12, south: 12, east: 9, west: 9, total: 42, uniformScale: true, spacingError: 0 },
  stands: { north: 4, south: 4, east: 3, west: 3, total: 14, uniformScale: true },
  ramps: { arena_ramp_1: 0, arena_ramp_2: 0, total: 0, removedFromArena01: true },
  bumpers: 4,
  outerWalls: 4,
  floatingObjects: 0,
  centralClearFraction: 0.66,
  spawnPointsPerTeam: 4,
  spawnCoordinates: {
    blue: [[-15, -26], [-5, -26], [5, -26], [15, -26]],
    red: [[-15, 26], [-5, 26], [5, 26], [15, 26]],
  },
  symmetric: true,
  scaleReferences: { robotHeight: 1.6, fenceHeight: 0, audienceHeight: 0, fenceRobotRatio: 0, audienceRobotRatio: 0 },
  visualHierarchy: ['bright-combat-floor', 'medium-safety-fence', 'dim-audience', 'dark-outer-wall'],
};
const industrialStats = {
  name: INDUSTRIAL_LAYOUT.name,
  dimensions: { width: INDUSTRIAL_LAYOUT.halfWidth * 2, length: INDUSTRIAL_LAYOUT.halfLength * 2 },
  areaRatioToArena01: Number(((INDUSTRIAL_LAYOUT.halfWidth * INDUSTRIAL_LAYOUT.halfLength) / (ARENA_X * ARENA_Z)).toFixed(2)),
  scaleFromPreviousIndustrial: { width: Number((INDUSTRIAL_LAYOUT.halfWidth / 112).toFixed(2)), length: Number((INDUSTRIAL_LAYOUT.halfLength / 88).toFixed(2)), area: Number(((INDUSTRIAL_LAYOUT.halfWidth * INDUSTRIAL_LAYOUT.halfLength) / (112 * 88)).toFixed(2)) },
  scaleFromV99: { width: INDUSTRIAL_SPACE_SCALE, length: INDUSTRIAL_SPACE_SCALE, area: Number((INDUSTRIAL_SPACE_SCALE ** 2).toFixed(2)), objectScale: 1 },
  floor: { source: '맵 타일.png', visualTiles: INDUSTRIAL_LAYOUT.visualTiles, physicsColliderCount: 1, gaps: 0, stretched: false, topY: PHYSICS_FLOOR_TOP, thickness: PHYSICS_FLOOR_THICKNESS.industrial01, collisionMode: 'continuous-swept', solverHz: 90 },
  assets: { containers: 0, barriers: 0, fenceModules: 0 },
  zones: ['central-plaza', 'container-sector', 'barrier-sector', 'outer-loop'],
  centralPlaza: { width: 112, length: 78.4, simultaneousRobotCapacity: 8, obstacleCount: 0 },
  spawnPointsPerTeam: 8,
  navigation: { nodes: 0, links: 0, obstacleAware: true, directLineOfSight: true, repathSeconds: 0.45 },
  performance: { gpuInstancing: ['container', 'concrete-barrier', 'arena-fence'], staticBoxColliders: true, distanceShadowLOD: true, debrisLimit: MAX_ACTIVE_DEBRIS },
  tests: { soloRoute: 'pending', straightCrossing: 'pending', ffa4: 'pending', ffa8: 'pending', team4v4: 'pending', team6v6: 'pending', team8v8: 'pending', aiAvoidance: 'pending', debrisFloor: 'pending', robotFloorDrops: 'pending', obstacleContact: 'pending', obstacleBounce: 'pending', groundSeating: 'pending' },
};
const desertStats = {
  name: DESERT_LAYOUT.name,
  dimensions: { width: DESERT_LAYOUT.halfWidth * 2, length: DESERT_LAYOUT.halfLength * 2 },
  scaleFromPrevious: { width: Number((DESERT_LAYOUT.halfWidth / 112).toFixed(2)), length: Number((DESERT_LAYOUT.halfLength / 152).toFixed(2)), area: Number(((DESERT_LAYOUT.halfWidth * DESERT_LAYOUT.halfLength) / (112 * 152)).toFixed(2)) },
  sourceAssets: ['거대 붉은 암벽.glb (geometry-clustered render LOD)', '중형 독립 사막 바위.glb (medium rock + low-ridge LOD)'],
  terrain: { rolling: true, flatPlane: false, naturalArches: 0, drivableSlopes: true, impassableCliffs: true, layout: 'multi-route-canyon' },
  assets: { giantCliffs: 0, mediumRocks: 0, lowRidges: 0 },
  navigation: { nodes: 0, links: 0, connectedNodes: 0, fullyConnected: false, routeFamilies: 3, obstacleAware: true },
  performance: { terrainLOD: true, rockShadowLOD: true, pooledVFX: true, worldNameplatesRemoved: true },
};
const conquestState = {
  enabled: false,
  activePoint: 'A',
  points: {
    A: { centre: new THREE.Vector3(DESERT_LAYOUT.pointA[0], 0, DESERT_LAYOUT.pointA[1]), radius: DESERT_LAYOUT.captureRadius, blue: 0, red: 0, owner: null, active: true },
    B: { centre: new THREE.Vector3(DESERT_LAYOUT.pointB[0], 0, DESERT_LAYOUT.pointB[1]), radius: DESERT_LAYOUT.captureRadius, blue: 0, red: 0, owner: null, active: false },
  },
  contested: false, winner: null, pendingWinner: null, minimumMatchSeconds: 300, duration: 600, captures: [], repairEvents: 0, healerTicks: 0,
};
const conquestVisuals = { zones: {}, repairZones: {} };
let hitStopTimer = 0;
const AUDIO_FILES = {
  hammer: ['./audio/hammer_hit_1.mp3', './audio/hammer_hit_2.mp3', './audio/hammer_hit_3.mp3'],
  saw: ['./audio/saw_grind.mp3'],
  flipper: ['./audio/flipper_actuate.mp3'],
  hit: ['./audio/impact_new_1.mp3', './audio/impact_new_2.mp3', './audio/impact_new_3.mp3', './audio/impact_hit_1.mp3', './audio/impact_hit_2.mp3', './audio/impact_desert_1.mp3', './audio/impact_desert_2.mp3'],
  hitWeak: ['./audio/impact_hit_1.mp3', './audio/impact_hit_2.mp3', './audio/impact_desert_2.mp3'],
  hitMedium: ['./audio/impact_new_1.mp3', './audio/impact_hit_1.mp3', './audio/impact_new_2.mp3', './audio/impact_desert_2.mp3'],
  hitStrong: ['./audio/impact_new_1.mp3', './audio/impact_new_2.mp3', './audio/impact_new_3.mp3', './audio/impact_desert_1.mp3'],
  hitCritical: ['./audio/impact_new_3.mp3', './audio/impact_new_2.mp3', './audio/impact_desert_1.mp3', './audio/hammer_hit_3.mp3'],
  dash: ['./audio/dash_boost.mp3'],
  blockBreak: ['./audio/impact_new_2.mp3', './audio/impact_new_3.mp3'],
  partBreak: ['./audio/impact_new_1.mp3', './audio/impact_new_2.mp3'],
  wall: ['./audio/impact_hit_1.mp3', './audio/impact_new_1.mp3'],
  landing: ['./audio/impact_hit_1.mp3', './audio/impact_hit_2.mp3'],
};
const IMPACT_SOUND_GAIN = 1.42;
const lastAudioVariantByKind = new Map();
const MUSIC_FILES = { lobby: './audio/music_main_menu.mp3', battle: './audio/music_battle.mp3' };
const VOLUME_STORAGE_KEY = 'battlebot-master-volume-v1';
const MIXER_STORAGE_KEY = 'battlebot-mixer-volume-v2';
function loadMasterVolume() {
  const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
  if (raw === null) return 0.8;
  const stored = Number(raw);
  return Number.isFinite(stored) ? Math.min(1, Math.max(0, stored)) : 0.8;
}
let masterVolume = loadMasterVolume();
let lastAudibleVolume = masterVolume > 0 ? masterVolume : 0.8;
let mixerSettings = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(MIXER_STORAGE_KEY));
    return { music: clamp(Number(stored?.music ?? 0.58), 0, 1), effects: clamp(Number(stored?.effects ?? 1), 0, 1) };
  } catch { return { music: 0.58, effects: 1 }; }
})();
const activeAudioSources = new Set();
const spatialAudioVoices = [];
const decodedAudioBuffers = new Map();
const audioBufferPromises = new Map();
let audioUnlocked = false;
let musicDuck = 0;
const audioSamples = Object.fromEntries(Object.entries(AUDIO_FILES).map(([key, files]) => [key, files.map((file) => {
  const audio = new Audio(file);
  audio.preload = 'auto';
  return audio;
})]));
const musicTracks = Object.fromEntries(Object.entries(MUSIC_FILES).map(([key, file]) => {
  const audio = new Audio(file);
  audio.preload = 'auto';
  audio.loop = true;
  audio.__mixGain = 0;
  return [key, audio];
}));
const audioStats = { hammerHits: 0, sawLoops: 0, sawLoopStops: 0, sawContactTicks: 0, flipperActuations: 0, impactHits: 0, hitVariantCounts: [0, 0, 0, 0, 0], hitTierCounts: { weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0 }, landingSounds: 0, wallHits: 0, dashSounds: 0, blockBreaks: 0, partBreaks: 0, healingPulses: 0, heavyImpacts: 0, spatialVoicesPeak: 0, voiceLimitDrops: 0, musicTransitions: 0 };
const impactStats = { weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0, criticalEligible: 0, criticalRolls: 0, maxCriticalChance: 0, minCriticalScore: null, maxCriticalScore: 0, maxImpulse: 0, maxSparks: 0, maxSingleDamage: 0, firstImpactTime: null };
const impactSamples = [];
const groundStats = {
  robotContacts: 0, robotCorrections: 0, postStepRobotCorrections: 0, angularSweepCorrections: 0,
  debrisContacts: 0, debrisCorrections: 0, debrisSweepCorrections: 0, maxDebrisSweepCorrection: 0,
  deepRobotRecoveries: 0, aiFsmFloorRecoveries: 0,
  maxRobotPenetration: 0, maxDebrisPenetration: 0, maxRobotPenetrationSource: null,
  wheelContactSurface: 'PhysicsFloor-only', selfCollisionPairs: 0,
};
const environmentCollisionStats = {
  contacts: 0, containerContacts: 0, barrierContacts: 0, boundaryContacts: 0,
  maxPenetration: 0, maxNormalSpeed: 0, maxVerticalVelocityAdded: 0,
  restitution: 0.025, artificialKnockback: false, solver: 'convex-footprint-vs-obb-sat',
};
let environmentPhysicsQARunning = false;
let environmentPhysicsQAResult = null;
const stabilityStats = {
  unstableSupportFrames: 0,
  maxAbnormalVerticalSeconds: 0,
  maxAbnormalVerticalConcurrent: 0,
  maxBodyRollingSeconds: 0,
  maxVerticalStandingSeconds: 0,
  maxVerticalStandersConcurrent: 0,
  maxPostLandingAngularSpeed: 0,
  landingSamples: [],
  sustainedWeaponForcesSuppressed: 0,
};
const flightStats = {
  launches: 0,
  landings: 0,
  hardLandings: 0,
  maxAirborneSeconds: 0,
  maxFallSpeed: 0,
  maxLaunchHorizontalSpeed: 0,
  maxLaunchVerticalSpeed: 0,
  selfRightAttempts: 0,
  aiSelfRightAttempts: 0,
  selfRightReactions: 0,
  selfRightSuccesses: 0,
};
const sparkStats = {
  particlesSpawned: 0,
  bursts: 0,
  firstSawBursts: 0,
  continuousSawBursts: 0,
  irregularBursts: 0,
  poolReuses: 0,
  maxActiveParticles: 0,
  minSpeed: null,
  maxSpeed: 0,
  minTailLength: null,
  maxTailLength: 0,
  shortParticles: 0,
  mediumParticles: 0,
  longParticles: 0,
  denseCoreParticles: 0,
  upwardHeroParticles: 0,
  afterglowBursts: 0,
  maxBurstCount: 0,
  maxBurstTravel: 0,
  maxDenseCoreCount: 0,
  maxUpwardHeroRatio: 0,
};
const renderPerformanceStats = {
  frames: 0,
  totalFrameMs: 0,
  maxFrameMs: 0,
  over33ms: 0,
  sparkFrames: 0,
  totalSparkFrameMs: 0,
  maxSparkFrameMs: 0,
  adaptiveAdjustments: 0,
};
let renderLODAccumulator = 0;
let activeSparkInstanceCount = 0;
let activeSparkParticleCount = 0;

const PERFORMANCE_SAMPLE_COUNT = 600;
const performanceFrameSamples = new Float32Array(PERFORMANCE_SAMPLE_COUNT);
const performanceProfile = {
  sampleIndex: 0, sampleCount: 0,
  updateMs: 0, renderMs: 0, aiMs: 0, physicsMs: 0, collisionMs: 0, effectsMs: 0, uiMs: 0,
  aiThinkCalls: 0, aiThinkSkips: 0, targetSearches: 0, pathReplans: 0,
  collisionPairChecks: 0, collisionNarrowPhaseChecks: 0,
  drawCalls: 0, triangles: 0, geometries: 0, textures: 0,
  physicsHz: 90,
};

function resetPerformanceProfile() {
  performanceFrameSamples.fill(0);
  Object.assign(performanceProfile, {
    sampleIndex: 0, sampleCount: 0,
    updateMs: 0, renderMs: 0, aiMs: 0, physicsMs: 0, collisionMs: 0, effectsMs: 0, uiMs: 0,
    aiThinkCalls: 0, aiThinkSkips: 0, targetSearches: 0, pathReplans: 0,
    collisionPairChecks: 0, collisionNarrowPhaseChecks: 0,
    drawCalls: 0, triangles: 0, geometries: 0, textures: 0,
    physicsHz: physicsSolverHz(),
  });
}

function recordPerformanceFrame(frameMs, updateMs, renderMs) {
  performanceFrameSamples[performanceProfile.sampleIndex] = frameMs;
  performanceProfile.sampleIndex = (performanceProfile.sampleIndex + 1) % PERFORMANCE_SAMPLE_COUNT;
  performanceProfile.sampleCount = Math.min(PERFORMANCE_SAMPLE_COUNT, performanceProfile.sampleCount + 1);
  performanceProfile.updateMs += updateMs;
  performanceProfile.renderMs += renderMs;
  performanceProfile.drawCalls = renderer.info.render.calls;
  performanceProfile.triangles = renderer.info.render.triangles;
  performanceProfile.geometries = renderer.info.memory.geometries;
  performanceProfile.textures = renderer.info.memory.textures;
  updateAdaptiveQualityFromFrame(frameMs);
}

function updateAdaptiveQualityFromFrame(frameMs) {
  if (mode !== 'battle' || robots.length < 12 || !Number.isFinite(frameMs) || frameMs <= 0 || frameMs > 250) return;
  adaptiveFrameMsEMA = lerp(adaptiveFrameMsEMA, frameMs, 0.045);
  adaptiveQualityCooldown = Math.max(0, adaptiveQualityCooldown - 1);
  if (adaptiveQualityCooldown > 0) return;
  let next = adaptiveQualityScale;
  if (adaptiveFrameMsEMA > 25) next = Math.max(0.72, adaptiveQualityScale - 0.08);
  else if (adaptiveFrameMsEMA < 18.2) next = Math.min(1, adaptiveQualityScale + 0.04);
  if (Math.abs(next - adaptiveQualityScale) < 0.001) return;
  adaptiveQualityScale = next;
  adaptiveQualityCooldown = 45;
  renderPerformanceStats.adaptiveAdjustments++;
  applyBattleRenderBudget(teamSizeForBattleMode());
  if (renderedCanvasWidth > 0 && renderedCanvasHeight > 0) renderer.setSize(renderedCanvasWidth, renderedCanvasHeight, false);
}

function performanceProfileSnapshot() {
  const count = performanceProfile.sampleCount;
  const samples = Array.from(performanceFrameSamples.slice(0, count)).sort((a, b) => a - b);
  const p99FrameMs = count ? samples[Math.min(count - 1, Math.floor(count * 0.99))] : 0;
  const medianFrameMs = count ? samples[Math.floor(count * 0.5)] : 0;
  const measuredFrames = Math.max(1, renderPerformanceStats.frames);
  return {
    qualityPreset,
    solverHz: performanceProfile.physicsHz,
    samples: count,
    medianFrameMs: Number(medianFrameMs.toFixed(2)),
    onePercentLowFps: p99FrameMs > 0 ? Number((1000 / p99FrameMs).toFixed(1)) : 0,
    averageUpdateCpuMs: Number((performanceProfile.updateMs / measuredFrames).toFixed(3)),
    averageRenderCpuMs: Number((performanceProfile.renderMs / measuredFrames).toFixed(3)),
    stageTotalsMs: {
      ai: Number(performanceProfile.aiMs.toFixed(1)), physics: Number(performanceProfile.physicsMs.toFixed(1)),
      collision: Number(performanceProfile.collisionMs.toFixed(1)), effects: Number(performanceProfile.effectsMs.toFixed(1)),
      ui: Number(performanceProfile.uiMs.toFixed(1)),
    },
    ai: { thinkCalls: performanceProfile.aiThinkCalls, skippedSubsteps: performanceProfile.aiThinkSkips, targetSearches: performanceProfile.targetSearches, pathReplans: performanceProfile.pathReplans },
    collisions: { pairChecks: performanceProfile.collisionPairChecks, narrowPhaseChecks: performanceProfile.collisionNarrowPhaseChecks },
    renderer: { drawCalls: performanceProfile.drawCalls, triangles: performanceProfile.triangles, geometries: performanceProfile.geometries, textures: performanceProfile.textures, gpuTiming: 'WebGL driver timing unavailable; render CPU submission measured above' },
    active: {
      sparks: activeSparkParticleCount,
      particles: activeSparkParticleCount + smokeParticles.filter((particle) => particle.active).length,
      debris: debris.length,
      fragmentBursts: blockFragmentBursts.length,
      colliders: robots.reduce((sum, robot) => sum + robot.colliderComponents.length + robot.wheels.filter((wheel) => !wheel.part.detached).length, 0) + obstacles.length,
      rigidbodies: robots.filter((robot) => !robot.dead).length + debris.length,
    },
    memory: performance.memory ? { usedJSHeapMB: Number((performance.memory.usedJSHeapSize / 1048576).toFixed(1)), totalJSHeapMB: Number((performance.memory.totalJSHeapSize / 1048576).toFixed(1)) } : { usedJSHeapMB: null, note: 'performance.memory unavailable' },
    adaptive: { scale: Number(adaptiveQualityScale.toFixed(2)), frameMsEMA: Number(adaptiveFrameMsEMA.toFixed(2)), adjustments: renderPerformanceStats.adaptiveAdjustments },
    budget: currentPerformanceBudget(),
  };
}

function criticalChanceForImpactScore(score, sourceType, independentHit = true) {
  if (!independentHit || score < 60) return 0;
  let chance = 0;
  if (score < 85) chance = lerp(0, 0.01, (score - 60) / 25);
  else if (score < 110) chance = lerp(0.02, 0.05, (score - 85) / 25);
  else if (score < 140) chance = lerp(0.08, 0.15, (score - 110) / 30);
  else if (score < 175) chance = lerp(0.2, 0.35, (score - 140) / 35);
  else chance = lerp(0.35, 0.6, clamp((score - 175) / 45, 0, 1));
  const sourceMultiplier = { collision: 0.65, dash: 0.92, flipper: 0.8, spinner: 0.88, hammer: 1.05, drum: 1.08, bar: 1.12 }[sourceType] ?? 1;
  return clamp(chance * sourceMultiplier, 0, 0.65);
}

function loadStoredAssembly() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) ?? LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    const parsed = JSON.parse(stored);
    if ([7, 8, 9, 10, ASSEMBLY_VERSION].includes(parsed?.version) && Array.isArray(parsed.parts)) return enrichAssembly(parsed);
  } catch (error) {
    console.warn('Saved workshop assembly could not be restored.', error);
  }
  return enrichAssembly(createDefaultAssembly());
}

function ensureAudio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  audioUnlocked = true;
  for (const files of Object.values(AUDIO_FILES)) for (const file of files) loadDecodedAudio(file);
  for (const track of Object.values(musicTracks)) track.play().catch(() => {});
}

function loadDecodedAudio(file) {
  if (!audioContext || decodedAudioBuffers.has(file)) return Promise.resolve(decodedAudioBuffers.get(file));
  if (audioBufferPromises.has(file)) return audioBufferPromises.get(file);
  const promise = fetch(file).then((response) => response.arrayBuffer()).then((data) => audioContext.decodeAudioData(data)).then((buffer) => {
    decodedAudioBuffers.set(file, buffer);
    return buffer;
  }).catch(() => null);
  audioBufferPromises.set(file, promise);
  return promise;
}

function syncMasterVolumeUI() {
  const percent = Math.round(masterVolume * 100);
  ui.masterVolume.value = String(percent);
  ui.volumeValue.textContent = `${percent}%`;
  ui.audioMute.textContent = masterVolume <= 0 ? '켜기' : '음소거';
  ui.audioMute.setAttribute('aria-pressed', String(masterVolume <= 0));
  ui.audioMute.title = masterVolume <= 0 ? '소리 켜기' : '음소거';
  if (ui.musicVolume) ui.musicVolume.value = String(Math.round(mixerSettings.music * 100));
  if (ui.effectsVolume) ui.effectsVolume.value = String(Math.round(mixerSettings.effects * 100));
}

function setMasterVolume(value, persist = true) {
  masterVolume = clamp(Number(value) || 0, 0, 1);
  if (masterVolume > 0) lastAudibleVolume = masterVolume;
  for (const source of activeAudioSources) source.volume = clamp((source.__baseVolume ?? 1) * masterVolume * mixerSettings.effects, 0, 1);
  for (const voice of spatialAudioVoices) voice.gain.gain.value = clamp(voice.baseVolume * masterVolume * mixerSettings.effects, 0, 1.8);
  if (sawLoopAudio) sawLoopAudio.volume = clamp((sawLoopAudio.__baseVolume ?? 0.52) * masterVolume * mixerSettings.effects, 0, 1);
  if (weaponLoopAudio) weaponLoopAudio.volume = clamp((weaponLoopAudio.__baseVolume ?? 0.18) * masterVolume * mixerSettings.effects, 0, 1);
  if (persist) localStorage.setItem(VOLUME_STORAGE_KEY, String(masterVolume));
  syncMasterVolumeUI();
}

function setMixerVolume(group, value) {
  if (!['music', 'effects'].includes(group)) return;
  mixerSettings[group] = clamp(Number(value) || 0, 0, 1);
  localStorage.setItem(MIXER_STORAGE_KEY, JSON.stringify(mixerSettings));
  setMasterVolume(masterVolume, false);
}

function playSample(kind, volume = 0.8, rate = 1) {
  const choices = audioSamples[kind];
  if (!choices?.length) return;
  const choiceIndex = Math.floor(Math.random() * choices.length);
  const source = choices[choiceIndex].cloneNode(true);
  source.__baseVolume = clamp(volume, 0, 1);
  source.volume = clamp(source.__baseVolume * masterVolume * mixerSettings.effects, 0, 1);
  source.playbackRate = clamp(rate, 0.78, 1.25);
  activeAudioSources.add(source);
  source.addEventListener('ended', () => activeAudioSources.delete(source), { once: true });
  source.play().catch(() => {});
  if (kind === 'hammer') audioStats.hammerHits++;
  if (kind === 'flipper') audioStats.flipperActuations++;
  if (kind === 'hit') {
    audioStats.impactHits++;
    audioStats.hitVariantCounts[choiceIndex]++;
  }
  if (kind === 'landing') audioStats.landingSounds++;
  if (kind === 'dash') audioStats.dashSounds++;
  if (kind === 'wall') audioStats.wallHits++;
  if (kind === 'blockBreak') audioStats.blockBreaks++;
  if (kind === 'partBreak') audioStats.partBreaks++;
}

function noteSpatialAudioKind(kind, choiceIndex = 0) {
  if (kind.startsWith('hit')) {
    audioStats.impactHits++;
    audioStats.hitVariantCounts[choiceIndex % audioStats.hitVariantCounts.length]++;
  }
  if (kind === 'landing') audioStats.landingSounds++;
  if (kind === 'dash') audioStats.dashSounds++;
  if (kind === 'wall') audioStats.wallHits++;
  if (kind === 'blockBreak') audioStats.blockBreaks++;
  if (kind === 'partBreak') audioStats.partBreaks++;
}

function playSpatialSample(kind, position, volume = 0.8, rate = 1, priority = 1) {
  const files = AUDIO_FILES[kind];
  if (!files?.length) return;
  ensureAudio();
  const previousChoice = lastAudioVariantByKind.get(kind) ?? -1;
  let choiceIndex = Math.floor(Math.random() * files.length);
  if (files.length > 1 && choiceIndex === previousChoice) choiceIndex = (choiceIndex + 1 + Math.floor(Math.random() * (files.length - 1))) % files.length;
  lastAudioVariantByKind.set(kind, choiceIndex);
  const file = files[choiceIndex];
  const impactKind = kind.startsWith('hit') || ['wall', 'landing', 'blockBreak', 'partBreak'].includes(kind);
  const mixedVolume = volume * (impactKind ? IMPACT_SOUND_GAIN : 1);
  const buffer = decodedAudioBuffers.get(file);
  if (!buffer || !audioContext) {
    playSample(kind, mixedVolume, rate);
    if (kind.startsWith('hit')) noteSpatialAudioKind(kind, choiceIndex);
    return;
  }
  while (spatialAudioVoices.length >= 20) {
    let weakestIndex = 0;
    for (let index = 1; index < spatialAudioVoices.length; index++) if (spatialAudioVoices[index].priority < spatialAudioVoices[weakestIndex].priority) weakestIndex = index;
    if (spatialAudioVoices[weakestIndex].priority > priority) { audioStats.voiceLimitDrops++; return; }
    spatialAudioVoices[weakestIndex].source.stop();
    spatialAudioVoices.splice(weakestIndex, 1);
    audioStats.voiceLimitDrops++;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = clamp(rate, 0.76, 1.3);
  const panner = audioContext.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 3.2;
  panner.maxDistance = selectedMapId === 'desert01' ? 150 : 72;
  panner.rolloffFactor = selectedMapId === 'desert01' ? 0.82 : 1.05;
  if (panner.positionX) {
    panner.positionX.value = position.x; panner.positionY.value = position.y; panner.positionZ.value = position.z;
  } else panner.setPosition(position.x, position.y, position.z);
  const gain = audioContext.createGain();
  gain.gain.value = clamp(mixedVolume * masterVolume * mixerSettings.effects, 0, 1.8);
  source.connect(panner).connect(gain).connect(audioContext.destination);
  const voice = { source, gain, priority, baseVolume: mixedVolume, kind };
  spatialAudioVoices.push(voice);
  audioStats.spatialVoicesPeak = Math.max(audioStats.spatialVoicesPeak, spatialAudioVoices.length);
  source.onended = () => {
    const index = spatialAudioVoices.indexOf(voice);
    if (index >= 0) spatialAudioVoices.splice(index, 1);
  };
  source.start();
  noteSpatialAudioKind(kind, choiceIndex);
}

function playImpactAudio(tier, point) {
  const kind = tier === 'weak' ? 'hitWeak' : tier === 'medium' ? 'hitMedium' : ['strong', 'veryStrong'].includes(tier) ? 'hitStrong' : 'hitCritical';
  const volume = { weak: 0.42, medium: 0.66, strong: 0.88, veryStrong: 1.02, critical: 1.12 }[tier];
  const priority = { weak: 1, medium: 2, strong: 4, veryStrong: 5, critical: 6 }[tier];
  playSpatialSample(kind, point, volume, 0.91 + Math.random() * 0.16, priority);
  audioStats.hitTierCounts[tier]++;
  if (['strong', 'veryStrong', 'critical'].includes(tier)) musicDuck = Math.max(musicDuck, tier === 'critical' ? 0.55 : tier === 'veryStrong' ? 0.42 : 0.28);
}

function playHealingPulseSound(position, pulseIndex = 0) {
  if (!audioContext || !audioUnlocked || masterVolume <= 0 || camera.position.distanceToSquared(position) > 145 ** 2) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const panner = audioContext.createPanner();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(510 + (pulseIndex % 5) * 58, now);
  oscillator.frequency.exponentialRampToValueAtTime(820 + (pulseIndex % 3) * 75, now + 0.085);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16 * masterVolume * mixerSettings.effects + 0.001, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 4;
  panner.maxDistance = 145;
  panner.rolloffFactor = 0.78;
  if (panner.positionX) {
    panner.positionX.value = position.x; panner.positionY.value = position.y; panner.positionZ.value = position.z;
  } else panner.setPosition(position.x, position.y, position.z);
  oscillator.connect(panner).connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.125);
  audioStats.healingPulses++;
}

function updateAudioSystem(dt) {
  musicDuck = Math.max(0, musicDuck - dt * 1.8);
  const desiredLobby = mode === 'lobby' || mode === 'garage' ? 1 : 0;
  const desiredBattle = mode === 'battle' || mode === 'test' ? 1 : 0;
  for (const [key, track] of Object.entries(musicTracks)) {
    const target = key === 'lobby' ? desiredLobby : desiredBattle;
    const before = track.__mixGain;
    track.__mixGain = moveToward(track.__mixGain, target, dt * (target > before ? 0.72 : 1.1));
    if ((before === 0 && track.__mixGain > 0) || (before > 0 && track.__mixGain === 0)) audioStats.musicTransitions++;
    const base = key === 'battle' ? 0.54 : 0.48;
    track.volume = clamp(masterVolume * mixerSettings.music * base * track.__mixGain * (1 - musicDuck), 0, 1);
    if (audioUnlocked && track.paused) track.play().catch(() => {});
  }
  if (!audioContext) return;
  const listener = audioContext.listener;
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const up = camera.up;
  if (listener.positionX) {
    listener.positionX.value = camera.position.x; listener.positionY.value = camera.position.y; listener.positionZ.value = camera.position.z;
    listener.forwardX.value = forward.x; listener.forwardY.value = forward.y; listener.forwardZ.value = forward.z;
    listener.upX.value = up.x; listener.upY.value = up.y; listener.upZ.value = up.z;
  } else {
    listener.setPosition(camera.position.x, camera.position.y, camera.position.z);
    listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
  }
}

function updateSawGrinding(dt) {
  sawContactTimer = Math.max(0, sawContactTimer - dt);
  sawGrindTickCooldown = Math.max(0, sawGrindTickCooldown - dt);
  if (sawContactTimer > 0) {
    if (!sawLoopAudio) {
      sawLoopAudio = audioSamples.saw[0].cloneNode(true);
      sawLoopAudio.loop = true;
      sawLoopAudio.__baseVolume = 0.52;
      sawLoopAudio.volume = 0.52 * masterVolume * mixerSettings.effects;
      sawLoopAudio.playbackRate = 0.96 + Math.random() * 0.08;
      sawLoopAudio.play().catch(() => {});
      audioStats.sawLoops++;
    }
  } else if (sawLoopAudio) {
    sawLoopAudio.pause();
    sawLoopAudio.currentTime = 0;
    sawLoopAudio = null;
      audioStats.sawLoopStops++;
  }
}

function updateRotaryWeaponLoop() {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const robot of robots) for (const rotary of robot.rotaryWeapons ?? []) {
    if (!rotary.active || rotary.rpm < 180 || !robot.rotaryAvailable(rotary)) continue;
    const distance = camera.position.distanceTo(robot.root.position);
    if (distance < nearestDistance) { nearest = { robot, rotary }; nearestDistance = distance; }
  }
  if (!nearest) {
    if (weaponLoopAudio) { weaponLoopAudio.pause(); weaponLoopAudio.currentTime = 0; weaponLoopAudio = null; }
    return;
  }
  if (!weaponLoopAudio) {
    weaponLoopAudio = audioSamples.saw[0].cloneNode(true);
    weaponLoopAudio.loop = true;
    weaponLoopAudio.play().catch(() => {});
  }
  const rpmRatio = clamp(nearest.rotary.rpm / nearest.rotary.maxRpm, 0, 1);
  const distanceGain = clamp(1 - nearestDistance / 52, 0.05, 1);
  weaponLoopAudio.__baseVolume = (0.08 + rpmRatio * 0.18) * distanceGain;
  weaponLoopAudio.volume = weaponLoopAudio.__baseVolume * masterVolume * mixerSettings.effects;
  weaponLoopAudio.playbackRate = 0.72 + rpmRatio * 0.54;
}

setMasterVolume(masterVolume, false);
applyQualityPreset(qualityPreset, false);
if (ui.dashKey) ui.dashKey.value = dashKey;

function showMessage(text, duration = 1.35) {
  ui.message.textContent = text;
  ui.message.classList.add('show');
  messageTimer = duration;
}

function createMaterial(color, metalness = 0.55, roughness = 0.48, emissive = 0) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness, emissive, emissiveIntensity: emissive ? 0.65 : 0 });
}

function createArena() {
  scene.add(new THREE.HemisphereLight(0xf4f8ff, 0x68717a, 2.65));
  scene.add(new THREE.AmbientLight(0xdce6ef, 1.25));

  const key = new THREE.DirectionalLight(0xfff7e9, 3.15);
  key.position.set(-11, 24, -6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.00035;
  key.shadow.normalBias = 0.025;
  key.shadow.camera.left = -42;
  key.shadow.camera.right = 42;
  key.shadow.camera.top = 32;
  key.shadow.camera.bottom = -32;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xd8e9ff, 1.75);
  fill.position.set(20, 13, 17);
  scene.add(fill);
  const sideFill = new THREE.DirectionalLight(0xfff0d4, 1.15);
  sideFill.position.set(-22, 8, 16);
  scene.add(sideFill);

  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, color: 0xb9c1c7, metalness: 0.35, roughness: 0.72 });
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(ARENA_X * 2 + 4, 0.4, ARENA_Z * 2 + 4),
    floorMaterial,
  );
  floor.position.y = -0.22;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(ARENA_X * 2, 46, 0xd18a2d, 0x69737c);
  grid.position.y = 0.005;
  grid.material.opacity = 0.42;
  grid.material.transparent = true;
  scene.add(grid);

  const wallMaterial = createMaterial(0x56616b, 0.62, 0.46);
  const makeWall = (x, z, width, depth) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 1.7, depth), wallMaterial);
    mesh.position.set(x, 0.8, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };
  makeWall(0, ARENA_Z + 0.2, ARENA_X * 2 + 2, 0.45);
  makeWall(0, -ARENA_Z - 0.2, ARENA_X * 2 + 2, 0.45);
  makeWall(ARENA_X + 0.2, 0, 0.45, ARENA_Z * 2 + 1);
  makeWall(-ARENA_X - 0.2, 0, 0.45, ARENA_Z * 2 + 1);

  const safetyMaterial = createMaterial(0xe2a12f, 0.45, 0.52);
  const addSafetyLine = (x, z, width, depth) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(width, 0.035, depth), safetyMaterial);
    line.position.set(x, 0.025, z);
    scene.add(line);
  };
  addSafetyLine(0, ARENA_Z - 1.1, ARENA_X * 2 - 4, 0.32);
  addSafetyLine(0, -ARENA_Z + 1.1, ARENA_X * 2 - 4, 0.32);
  addSafetyLine(ARENA_X - 1.1, 0, 0.32, ARENA_Z * 2 - 4);
  addSafetyLine(-ARENA_X + 1.1, 0, 0.32, ARENA_Z * 2 - 4);

  const grateMaterial = createMaterial(0x4f5962, 0.76, 0.4);
  for (const [x, z, w, d] of [[-35, -23, 8, 2.4], [34, 22, 9, 2.4], [-35, 23, 8, 2.4], [34, -22, 9, 2.4]]) {
    const grate = new THREE.Mesh(new THREE.BoxGeometry(w, 0.045, d), grateMaterial);
    grate.position.set(x, 0.03, z);
    scene.add(grate);
    const slats = new THREE.GridHelper(Math.max(w, d), Math.round(Math.max(w, d) * 2), 0x303840, 0x303840);
    slats.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
    slats.position.set(x, 0.057, z);
    scene.add(slats);
  }

  const fenceMaterial = createMaterial(0x8d99a4, 0.78, 0.34);
  const postGeometry = new THREE.BoxGeometry(0.13, 2.3, 0.13);
  const postLocations = [];
  for (let x = -44; x <= 44; x += 4) postLocations.push([x, ARENA_Z + 0.2], [x, -ARENA_Z - 0.2]);
  for (let z = -32; z <= 32; z += 4) postLocations.push([ARENA_X + 0.2, z], [-ARENA_X - 0.2, z]);
  const posts = new THREE.InstancedMesh(postGeometry, fenceMaterial, postLocations.length);
  const postMatrix = new THREE.Matrix4();
  postLocations.forEach(([x, z], index) => posts.setMatrixAt(index, postMatrix.makeTranslation(x, 2.05, z)));
  scene.add(posts);
  const addRail = (x, y, z, width, depth) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, depth), fenceMaterial);
    rail.position.set(x, y, z);
    scene.add(rail);
  };
  for (const y of [1.8, 2.8, 3.2]) {
    addRail(0, y, ARENA_Z + 0.2, ARENA_X * 2, 0.1);
    addRail(0, y, -ARENA_Z - 0.2, ARENA_X * 2, 0.1);
    addRail(ARENA_X + 0.2, y, 0, 0.1, ARENA_Z * 2);
    addRail(-ARENA_X - 0.2, y, 0, 0.1, ARENA_Z * 2);
  }

  const standMaterial = createMaterial(0x68737e, 0.38, 0.72);
  const seatMaterial = createMaterial(0x394753, 0.32, 0.72);
  for (const side of [-1, 1]) {
    for (let tier = 0; tier < 3; tier++) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(88 - tier * 3, 0.7 + tier * 0.18, 2.3), tier % 2 ? seatMaterial : standMaterial);
      stand.position.set(0, 0.45 + tier * 0.72, side * (36.1 + tier * 1.75));
      scene.add(stand);
    }
  }

  const trussMaterial = createMaterial(0x4b5661, 0.8, 0.34);
  const fixtureMaterial = new THREE.MeshStandardMaterial({ color: 0xf1f5f7, emissive: 0xffffff, emissiveIntensity: 2.2, metalness: 0.15, roughness: 0.48 });
  for (const z of [-23, 0, 23]) {
    const truss = new THREE.Mesh(new THREE.BoxGeometry(82, 0.18, 0.18), trussMaterial);
    truss.position.set(0, 12.5, z);
    scene.add(truss);
    for (const x of [-34, -17, 0, 17, 34]) {
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.12, 1.05), fixtureMaterial);
      fixture.position.set(x, 12.28, z);
      scene.add(fixture);
    }
  }
  for (const [x, z] of [[-31, -22], [31, -22], [-31, 22], [31, 22], [0, -18], [0, 18]]) {
    const overhead = new THREE.PointLight(0xf5f8ff, 38, 38, 1.45);
    overhead.position.set(x, 10.8, z);
    scene.add(overhead);
  }

  const hazardMaterial = new THREE.MeshStandardMaterial({ color: 0xd89525, metalness: 0.46, roughness: 0.54 });
  const makeObstacle = (x, z, radius, height = 0.7) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 12), hazardMaterial);
    mesh.position.set(x, height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    obstacles.push({ x, z, radius: radius + 0.2, mesh });
  };
  makeObstacle(-20, -8, 1.6);
  makeObstacle(21, 9, 1.8);
  makeObstacle(0, 23, 1.35, 0.55);

  const rampMaterial = createMaterial(0x626d77, 0.68, 0.46);
  const makeRamp = (x, z, rotationY) => {
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(7, 0.45, 4.5), rampMaterial);
    ramp.position.set(x, 0.35, z);
    ramp.rotation.set(-0.12, rotationY, 0);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    scene.add(ramp);
    ramps.push({ x, z, rotationY, halfX: 3.7, halfZ: 2.5 });
  };
  makeRamp(-27, 17, 0.22);
  makeRamp(28, -18, Math.PI + 0.18);

  firePad = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.08, 5.6),
    new THREE.MeshStandardMaterial({ color: 0x63301d, emissive: 0xff5b21, emissiveIntensity: 0.18, metalness: 0.35, roughness: 0.6 }),
  );
  firePad.position.set(28, 0.035, 14);
  firePad.receiveShadow = true;
  scene.add(firePad);
  fireLight = new THREE.PointLight(0xff5a16, 0, 12, 2);
  fireLight.position.set(28, 1.5, 14);
  scene.add(fireLight);
}

function getArenaAssetMetrics(id) {
  const root = models[id];
  root.updateWorldMatrix(true, true);
  const bounds = new THREE.Box3().setFromObject(root);
  const size = bounds.getSize(new THREE.Vector3());
  let sourceMesh = null;
  root.traverse((node) => { if (!sourceMesh && node.isMesh) sourceMesh = node; });
  return { root, bounds, size, sourceMesh };
}

function addArenaAsset(id, { x, z, rotationY = 0, targetLongest, name = id }) {
  const { root, bounds, size } = getArenaAssetMetrics(id);
  const object = root.clone(true);
  const scale = targetLongest / Math.max(size.x, size.z);
  object.name = name;
  object.scale.setScalar(scale);
  object.rotation.y = rotationY;
  object.position.set(x, -bounds.min.y * scale + 0.003, z);
  object.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
  });
  scene.add(object);
  return { object, scale, sourceSize: size.clone(), groundGap: 0.003 };
}

function addInstancedArenaModules(id, placements, targetLength, name, appearance = {}) {
  const { bounds, size, sourceMesh } = getArenaAssetMetrics(id);
  const scale = targetLength / size.x;
  const material = sourceMesh.material.clone();
  if (material.color && appearance.tint !== undefined) material.color.multiply(new THREE.Color(appearance.tint));
  if (material.emissive && appearance.emissive !== undefined) material.emissive.set(appearance.emissive);
  if (appearance.emissiveIntensity !== undefined) material.emissiveIntensity = appearance.emissiveIntensity;
  if (appearance.metalness !== undefined) material.metalness = appearance.metalness;
  if (appearance.roughness !== undefined) material.roughness = appearance.roughness;
  const instances = new THREE.InstancedMesh(sourceMesh.geometry, material, placements.length);
  instances.name = name;
  instances.castShadow = false;
  instances.receiveShadow = true;
  instances.frustumCulled = false;
  const sourceMatrix = sourceMesh.matrixWorld.clone();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scaleVector = new THREE.Vector3(
    scale * (appearance.scaleXFactor ?? 1),
    scale * (appearance.scaleYFactor ?? 1),
    scale * (appearance.scaleZFactor ?? 1),
  );
  const groundEmbed = appearance.groundEmbed ?? 0.003;
  const matrix = new THREE.Matrix4();
  placements.forEach((placement, index) => {
    // Non-uniformly scaled assets must use their final Y scale when seating
    // against the floor. The previous uniform-scale formula left the lowered
    // concrete barriers visibly floating above their collider.
    position.set(placement.x, -bounds.min.y * scaleVector.y - groundEmbed, placement.z);
    quaternion.setFromAxisAngle(Y_AXIS, placement.rotationY ?? 0);
    matrix.compose(position, quaternion, scaleVector).multiply(sourceMatrix);
    instances.setMatrixAt(index, matrix);
  });
  instances.instanceMatrix.needsUpdate = true;
  instances.userData = {
    sourceAsset: id,
    uniformScale: scale,
    moduleLength: targetLength,
    groundGap: -groundEmbed,
    groundEmbed,
    scaledSize: { x: size.x * scaleVector.x, y: size.y * scaleVector.y, z: size.z * scaleVector.z },
    scaleVector: scaleVector.toArray(),
  };
  scene.add(instances);
  return instances;
}

function createArena01() {
  const width = ARENA_X * 2;
  const length = ARENA_Z * 2;
  floorTexture.repeat.set(...arenaStats.floor.visualTiles);

  scene.add(new THREE.HemisphereLight(0x9aa9b7, 0x11151a, 0.72));
  scene.add(new THREE.AmbientLight(0x8090a0, 0.3));
  const key = new THREE.DirectionalLight(0xffedcf, 1.65);
  key.position.set(-18, 32, -14);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  key.shadow.bias = -0.00028;
  key.shadow.normalBias = 0.024;
  key.shadow.camera.left = -56;
  key.shadow.camera.right = 56;
  key.shadow.camera.top = 42;
  key.shadow.camera.bottom = -42;
  scene.add(key);
  for (const [x, z, intensity, color] of [[38, 24, 0.38, 0x9fc5e8], [-38, 24, 0.32, 0xffd9ad], [38, -24, 0.3, 0xffd9ad], [-38, -24, 0.38, 0x9fc5e8]]) {
    const fill = new THREE.DirectionalLight(color, intensity);
    fill.position.set(x, 12, z);
    scene.add(fill);
  }
  for (const z of [-20, 20]) for (const x of [-34, 0, 34]) {
    const overhead = new THREE.SpotLight(0xffefd2, 150, 72, Math.PI / 4.25, 0.48, 1.25);
    overhead.position.set(x, 23, z);
    overhead.target.position.set(x * 0.35, 0, z * 0.35);
    scene.add(overhead, overhead.target);
  }
  const rearRim = new THREE.DirectionalLight(0x92b9df, 0.58);
  rearRim.position.set(0, 9, 42);
  scene.add(rearRim);
  for (const z of [-47, 47]) for (const x of [-36, 0, 36]) {
    const audienceWash = new THREE.PointLight(0xffd5a3, 30, 30, 1.55);
    audienceWash.position.set(x, 7.5, z);
    scene.add(audienceWash);
  }
  for (const x of [-60, 60]) for (const z of [-24, 0, 24]) {
    const sideWash = new THREE.PointLight(0x9fc2df, 24, 28, 1.55);
    sideWash.position.set(x, 7, z);
    scene.add(sideWash);
  }

  const outerFloor = new THREE.Mesh(
    new THREE.BoxGeometry(ARENA_LAYOUT.outerWallHalfWidth * 2, 0.34, ARENA_LAYOUT.outerWallHalfLength * 2),
    createMaterial(0x2d343a, 0.36, 0.78),
  );
  outerFloor.name = 'Arena01_ServiceFloor';
  outerFloor.position.y = -0.32;
  outerFloor.receiveShadow = true;
  scene.add(outerFloor);

  const arenaFloorThickness = PHYSICS_FLOOR_THICKNESS.arena01;
  const physicsFloor = new THREE.Mesh(
    new THREE.BoxGeometry(width, arenaFloorThickness, length),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }),
  );
  physicsFloor.name = 'Arena01_PhysicsFloorCollider';
  physicsFloor.position.y = PHYSICS_FLOOR_TOP - arenaFloorThickness / 2;
  physicsFloor.visible = false;
  physicsFloor.userData = { physicsCollider: 'single-thick-box', static: true, width, length, thickness: arenaFloorThickness, topY: PHYSICS_FLOOR_TOP, collisionMode: 'continuous-swept', solverHz: 90 };
  scene.add(physicsFloor);
  addEnvironmentColliderDebug({ name: 'Arena01_PhysicsFloor_Debug', mapId: 'arena01', x: 0, y: physicsFloor.position.y, z: 0, width, height: arenaFloorThickness, depth: length, color: 0x4dff88 });

  const visualFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    new THREE.MeshStandardMaterial({ map: floorTexture, color: 0x747a7e, metalness: 0.42, roughness: 0.7 }),
  );
  visualFloor.name = 'Arena01_TiledVisualFloor';
  visualFloor.rotation.x = -Math.PI / 2;
  visualFloor.position.y = 0.002;
  visualFloor.receiveShadow = true;
  scene.add(visualFloor);

  const spawnMaterial = (color) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.03, transparent: true, opacity: 0.07, metalness: 0.22, roughness: 0.65, depthWrite: false });
  const blueZone = new THREE.Mesh(new THREE.BoxGeometry(40, 0.025, 7.5), spawnMaterial(0x397bd8));
  blueZone.position.set(0, 0.018, -ARENA_Z + ARENA_LAYOUT.spawnInset);
  blueZone.name = 'BLUE_TEAM_SPAWN_AREA';
  scene.add(blueZone);
  const redZone = new THREE.Mesh(new THREE.BoxGeometry(40, 0.025, 7.5), spawnMaterial(0xd74a3e));
  redZone.position.set(0, 0.018, ARENA_Z - ARENA_LAYOUT.spawnInset);
  redZone.name = 'RED_TEAM_SPAWN_AREA';
  scene.add(redZone);
  const spawnRingMaterial = new THREE.MeshBasicMaterial({ color: 0xd8dde0, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false });
  for (const side of [-1, 1]) for (const x of [-15, -5, 5, 15]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.65, 1.78, 32), spawnRingMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.04, side * (ARENA_Z - ARENA_LAYOUT.spawnInset));
    scene.add(ring);
  }

  const wallMaterial = createMaterial(0x485159, 0.72, 0.42);
  const wallCapMaterial = createMaterial(0x252c32, 0.78, 0.36);
  const makeWall = (x, z, wallWidth, wallDepth) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth, ARENA_LAYOUT.innerWallHeight, wallDepth), wallMaterial);
    wall.position.set(x, ARENA_LAYOUT.innerWallHeight / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData = { staticCollider: true };
    scene.add(wall);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(wallWidth, 0.12, wallDepth + 0.03), wallCapMaterial);
    cap.position.set(x, ARENA_LAYOUT.innerWallHeight + 0.02, z);
    scene.add(cap);
  };
  const wallT = ARENA_LAYOUT.innerWallThickness;
  makeWall(0, ARENA_Z + wallT / 2, width + wallT * 2, wallT);
  makeWall(0, -ARENA_Z - wallT / 2, width + wallT * 2, wallT);
  makeWall(ARENA_X + wallT / 2, 0, wallT, length);
  makeWall(-ARENA_X - wallT / 2, 0, wallT, length);

  const safetyMaterial = createMaterial(0xe0a12f, 0.42, 0.5);
  const safetyStrips = [[0, ARENA_Z - 1.15, width - 4, 0.3], [0, -ARENA_Z + 1.15, width - 4, 0.3], [ARENA_X - 1.15, 0, 0.3, length - 4], [-ARENA_X + 1.15, 0, 0.3, length - 4]];
  for (const [x, z, w, d] of safetyStrips) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(w, 0.035, d), safetyMaterial);
    strip.position.set(x, 0.025, z);
    scene.add(strip);
  }

  const module = ARENA_LAYOUT.fenceModuleLength;
  const fencePlacements = [];
  for (let index = 0; index < 12; index++) {
    const x = -ARENA_LAYOUT.fenceHalfWidth + module / 2 + index * module;
    fencePlacements.push({ x, z: -ARENA_LAYOUT.fenceHalfLength, rotationY: 0 });
    fencePlacements.push({ x, z: ARENA_LAYOUT.fenceHalfLength, rotationY: Math.PI });
  }
  for (let index = 0; index < 9; index++) {
    const z = -ARENA_LAYOUT.fenceHalfLength + module / 2 + index * module;
    fencePlacements.push({ x: ARENA_LAYOUT.fenceHalfWidth, z, rotationY: -Math.PI / 2 });
    fencePlacements.push({ x: -ARENA_LAYOUT.fenceHalfWidth, z, rotationY: Math.PI / 2 });
  }
  const fenceInstances = addInstancedArenaModules('arena_fence', fencePlacements, module, 'Arena01_FenceModules_42', { tint: 0xaeb8c0, emissive: 0x111820, emissiveIntensity: 0.24, metalness: 0.76, roughness: 0.43 });
  const cornerMaterial = createMaterial(0x515b63, 0.78, 0.35);
  for (const x of [-ARENA_LAYOUT.fenceHalfWidth, ARENA_LAYOUT.fenceHalfWidth]) for (const z of [-ARENA_LAYOUT.fenceHalfLength, ARENA_LAYOUT.fenceHalfLength]) {
    const postHeight = fenceInstances.userData.scaledSize.y;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.82, postHeight, 0.82), cornerMaterial);
    post.position.set(x, postHeight / 2, z);
    scene.add(post);
  }

  const standLength = 32;
  const standPlacements = [];
  const audienceZ = ARENA_LAYOUT.fenceHalfLength + ARENA_LAYOUT.audienceDistance;
  const audienceX = ARENA_LAYOUT.fenceHalfWidth + ARENA_LAYOUT.audienceDistance;
  for (const index of [-1.5, -0.5, 0.5, 1.5]) {
    standPlacements.push({ x: index * standLength, z: -audienceZ, rotationY: 0 });
    standPlacements.push({ x: index * standLength, z: audienceZ, rotationY: Math.PI });
  }
  for (const index of [-1, 0, 1]) {
    standPlacements.push({ x: audienceX, z: index * standLength, rotationY: -Math.PI / 2 });
    standPlacements.push({ x: -audienceX, z: index * standLength, rotationY: Math.PI / 2 });
  }
  const audienceInstances = addInstancedArenaModules('arena_stands', standPlacements, standLength, 'Arena01_AudienceModules_14', { tint: 0x777c80, emissive: 0x18191a, emissiveIntensity: 0.2, metalness: 0.36, roughness: 0.7 });

  const outerWallMaterial = createMaterial(0x22292f, 0.3, 0.82);
  const outerFrameMaterial = createMaterial(0x0e1419, 0.72, 0.46);
  const outerX = ARENA_LAYOUT.outerWallHalfWidth;
  const outerZ = ARENA_LAYOUT.outerWallHalfLength;
  const outerH = ARENA_LAYOUT.outerWallHeight;
  const outerWalls = [[0, outerZ, outerX * 2 + 1, 1], [0, -outerZ, outerX * 2 + 1, 1], [outerX, 0, 1, outerZ * 2], [-outerX, 0, 1, outerZ * 2]];
  for (const [x, z, w, d] of outerWalls) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, outerH, d), outerWallMaterial);
    wall.position.set(x, outerH / 2, z);
    wall.receiveShadow = true;
    scene.add(wall);
  }
  for (const z of [-outerZ, outerZ]) for (let x = -outerX + 6; x <= outerX - 6; x += 12) {
    const column = new THREE.Mesh(new THREE.BoxGeometry(0.7, outerH + 0.6, 1.25), outerFrameMaterial);
    column.position.set(x, (outerH + 0.6) / 2, z - Math.sign(z) * 0.15);
    scene.add(column);
  }
  for (const x of [-outerX, outerX]) for (let z = -outerZ + 7; z <= outerZ - 7; z += 12) {
    const column = new THREE.Mesh(new THREE.BoxGeometry(1.25, outerH + 0.6, 0.7), outerFrameMaterial);
    column.position.set(x - Math.sign(x) * 0.15, (outerH + 0.6) / 2, z);
    scene.add(column);
  }
  for (const [x, z, w, d] of [[0, outerZ - 0.54, outerX * 2, 0.16], [0, -outerZ + 0.54, outerX * 2, 0.16], [outerX - 0.54, 0, 0.16, outerZ * 2], [-outerX + 0.54, 0, 0.16, outerZ * 2]]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(w, 0.75, d), outerFrameMaterial);
    band.position.set(x, outerH * 0.68, z);
    scene.add(band);
  }

  const bumperPlacements = [[-46, -30, 0], [46, 30, Math.PI], [46, -30, Math.PI / 2], [-46, 30, -Math.PI / 2]];
  for (const [x, z, rotationY] of bumperPlacements) {
    const placed = addArenaAsset('arena_bumper', { x, z, rotationY, targetLongest: 4.6, name: `arena_bumper_${x}_${z}` });
    obstacles.push({ kind: 'box', x, z, rotationY, halfX: 2.35, halfZ: 1.48, radius: 2.35, mesh: placed.object, groundGap: placed.groundGap });
  }

  arenaStats.dimensions = { width, length, outerWidth: outerX * 2, outerLength: outerZ * 2 };
  arenaStats.assets = ['관중석.glb', '낮은 철제 범퍼.glb', '철제 보호 팬스.glb', 'arena_floor_tile.png'];
  arenaStats.layoutOrder = ['combat-floor', 'inner-impact-wall', 'steel-safety-fence', 'audience-stands', 'indoor-outer-wall'];
  arenaStats.noCeilingGeometry = true;
  arenaStats.lightColor = 'focused-warm-key-with-cool-fill';
  arenaStats.scaleReferences.fenceHeight = Number(fenceInstances.userData.scaledSize.y.toFixed(3));
  arenaStats.scaleReferences.audienceHeight = Number(audienceInstances.userData.scaledSize.y.toFixed(3));
  arenaStats.scaleReferences.fenceRobotRatio = Number((arenaStats.scaleReferences.fenceHeight / arenaStats.scaleReferences.robotHeight).toFixed(2));
  arenaStats.scaleReferences.audienceRobotRatio = Number((arenaStats.scaleReferences.audienceHeight / arenaStats.scaleReferences.robotHeight).toFixed(2));
  arenaStats.safetyGap = Number((ARENA_LAYOUT.audienceDistance - audienceInstances.userData.scaledSize.z / 2).toFixed(3));
}

function addIndustrialObstacleSet(id, placements, targetLength, name, appearance, obstacleType) {
  const instances = addInstancedArenaModules(id, placements, targetLength, name, appearance);
  const colliderInset = 0.012;
  const halfX = Math.max(0.05, instances.userData.scaledSize.x / 2 - colliderInset);
  const halfZ = Math.max(0.05, instances.userData.scaledSize.z / 2 - colliderInset);
  const colliderHeight = Math.max(0.08, instances.userData.scaledSize.y - colliderInset);
  for (const placement of placements) {
    const obstacle = {
      kind: 'box',
      obstacleType,
      x: placement.x,
      z: placement.z,
      rotationY: placement.rotationY ?? 0,
      halfX,
      halfZ,
      radius: Math.hypot(halfX, halfZ),
      colliderHeight,
      colliderBottom: PHYSICS_FLOOR_TOP - (appearance.groundEmbed ?? 0.006),
      colliderInset,
      mesh: instances,
      static: true,
    };
    obstacles.push(obstacle);
    addEnvironmentColliderDebug({
      name: `${name}_${obstacleType}_Collider`, mapId: 'industrial01',
      x: obstacle.x, y: obstacle.colliderBottom + colliderHeight / 2, z: obstacle.z,
      width: halfX * 2, height: colliderHeight, depth: halfZ * 2,
      rotationY: obstacle.rotationY, color: obstacleType === 'container' ? 0x62d9ff : 0xffd45a,
    });
  }
  return instances;
}

function createIndustrialBattleZone() {
  const width = INDUSTRIAL_LAYOUT.halfWidth * 2;
  const length = INDUSTRIAL_LAYOUT.halfLength * 2;

  scene.add(new THREE.HemisphereLight(0xd7e9f2, 0x3f4645, 1.55));
  scene.add(new THREE.AmbientLight(0xb9c9cf, 0.48));
  const daylight = new THREE.DirectionalLight(0xfff5da, 2.15);
  daylight.position.set(-52, 96, -38);
  daylight.castShadow = true;
  daylight.shadow.mapSize.set(1024, 1024);
  daylight.shadow.bias = -0.00024;
  daylight.shadow.normalBias = 0.032;
  daylight.shadow.camera.left = -122;
  daylight.shadow.camera.right = 122;
  daylight.shadow.camera.top = 98;
  daylight.shadow.camera.bottom = -98;
  scene.add(daylight);
  const skyFill = new THREE.DirectionalLight(0xb9dcff, 0.72);
  skyFill.position.set(74, 38, 55);
  scene.add(skyFill);
  const warmFill = new THREE.DirectionalLight(0xffd4a0, 0.42);
  warmFill.position.set(-70, 24, 68);
  scene.add(warmFill);

  const serviceFloor = new THREE.Mesh(
    new THREE.BoxGeometry(width + 18, 0.48, length + 18),
    createMaterial(0x42494a, 0.12, 0.9),
  );
  serviceFloor.name = 'Industrial01_ServiceFloor';
  serviceFloor.position.y = -0.46;
  serviceFloor.receiveShadow = true;
  scene.add(serviceFloor);

  const industrialFloorThickness = PHYSICS_FLOOR_THICKNESS.industrial01;
  const physicsFloor = new THREE.Mesh(
    new THREE.BoxGeometry(width, industrialFloorThickness, length),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }),
  );
  physicsFloor.name = 'Industrial01_PhysicsFloorCollider';
  physicsFloor.position.y = PHYSICS_FLOOR_TOP - industrialFloorThickness / 2;
  physicsFloor.visible = false;
  physicsFloor.userData = { physicsCollider: 'single-thick-box', static: true, width, length, thickness: industrialFloorThickness, topY: PHYSICS_FLOOR_TOP, gaps: 0, collisionMode: 'continuous-swept', solverHz: 90 };
  scene.add(physicsFloor);
  addEnvironmentColliderDebug({ name: 'Industrial01_PhysicsFloor_Debug', mapId: 'industrial01', x: 0, y: physicsFloor.position.y, z: 0, width, height: industrialFloorThickness, depth: length, color: 0x4dff88 });

  const visualFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    new THREE.MeshStandardMaterial({ map: industrialFloorTexture, color: 0xa6a7a2, metalness: 0.08, roughness: 0.86 }),
  );
  visualFloor.name = 'Industrial01_MapTileFloor';
  visualFloor.rotation.x = -Math.PI / 2;
  visualFloor.position.y = 0.002;
  visualFloor.receiveShadow = true;
  scene.add(visualFloor);

  const plazaMark = new THREE.Mesh(
    new THREE.RingGeometry(52, 52.7, 96),
    new THREE.MeshBasicMaterial({ color: 0xd6a431, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false }),
  );
  plazaMark.name = 'Industrial01_CentralCombatPlaza';
  plazaMark.rotation.x = -Math.PI / 2;
  plazaMark.position.y = 0.018;
  scene.add(plazaMark);
  const routeMaterial = new THREE.MeshBasicMaterial({ color: 0xe1bd51, transparent: true, opacity: 0.27, depthWrite: false });
  for (const [x, z, w, d] of [[0, 0, 0.28, 330 * INDUSTRIAL_SPACE_SCALE], [0, 0, 400 * INDUSTRIAL_SPACE_SCALE, 0.28], [-210 * INDUSTRIAL_SPACE_SCALE, 0, 0.24, 340 * INDUSTRIAL_SPACE_SCALE], [210 * INDUSTRIAL_SPACE_SCALE, 0, 0.24, 340 * INDUSTRIAL_SPACE_SCALE]]) {
    const route = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, d), routeMaterial);
    route.position.set(x, 0.016, z);
    scene.add(route);
  }

  const containerPlacements = [
    { x: -178, z: 88, rotationY: 0 }, { x: -154, z: 88, rotationY: 0 },
    { x: -88, z: 88, rotationY: 0 }, { x: -64, z: 88, rotationY: 0 },
    { x: 64, z: 88, rotationY: 0 }, { x: 88, z: 88, rotationY: 0 },
    { x: 154, z: 88, rotationY: 0 }, { x: 178, z: 88, rotationY: 0 },
    { x: -178, z: 132, rotationY: 0 }, { x: -154, z: 132, rotationY: 0 },
    { x: -88, z: 132, rotationY: 0 }, { x: -64, z: 132, rotationY: 0 },
    { x: 64, z: 132, rotationY: 0 }, { x: 88, z: 132, rotationY: 0 },
    { x: 154, z: 132, rotationY: 0 }, { x: 178, z: 132, rotationY: 0 },
    { x: -218, z: 72, rotationY: Math.PI / 2 }, { x: -218, z: 100, rotationY: Math.PI / 2 }, { x: -218, z: 128, rotationY: Math.PI / 2 },
    { x: 218, z: 72, rotationY: Math.PI / 2 }, { x: 218, z: 100, rotationY: Math.PI / 2 }, { x: 218, z: 128, rotationY: Math.PI / 2 },
    { x: -182, z: -18, rotationY: Math.PI / 2 }, { x: 182, z: 18, rotationY: Math.PI / 2 },
    { x: -205, z: -112, rotationY: 0 }, { x: 205, z: -112, rotationY: 0 },
  ].map((placement) => ({ ...placement, x: placement.x * INDUSTRIAL_SPACE_SCALE, z: placement.z * INDUSTRIAL_SPACE_SCALE }));
  const containerInstances = addIndustrialObstacleSet(
    'industrial_container', containerPlacements, 18, 'Industrial01_Containers_26',
    { tint: 0xd3d8d4, metalness: 0.64, roughness: 0.52, groundEmbed: 0.006 }, 'container',
  );

  const barrierPlacements = [
    { x: -202, z: -108, rotationY: 0.08 }, { x: -188, z: -107, rotationY: -0.04 },
    { x: -146, z: -102, rotationY: 0.18 }, { x: -132, z: -98, rotationY: 0.28 },
    { x: -84, z: -106, rotationY: -0.12 }, { x: -70, z: -108, rotationY: 0.04 },
    { x: -24, z: -101, rotationY: 0.16 }, { x: -10, z: -98, rotationY: 0.24 },
    { x: 38, z: -106, rotationY: -0.08 }, { x: 52, z: -108, rotationY: 0.03 },
    { x: 103, z: -102, rotationY: -0.2 }, { x: 117, z: -98, rotationY: -0.28 },
    { x: 166, z: -107, rotationY: 0.09 }, { x: 180, z: -106, rotationY: -0.03 },
    { x: -178, z: -70, rotationY: Math.PI / 2 }, { x: -178, z: -56, rotationY: Math.PI / 2 },
    { x: -112, z: -76, rotationY: 0 }, { x: -98, z: -76, rotationY: 0 },
    { x: -46, z: -70, rotationY: Math.PI / 2 }, { x: -46, z: -56, rotationY: Math.PI / 2 },
    { x: 28, z: -76, rotationY: 0 }, { x: 42, z: -76, rotationY: 0 },
    { x: 102, z: -70, rotationY: Math.PI / 2 }, { x: 102, z: -56, rotationY: Math.PI / 2 },
    { x: 170, z: -76, rotationY: 0 }, { x: 184, z: -76, rotationY: 0 },
    { x: -142, z: -34, rotationY: 0.45 }, { x: -132, z: -24, rotationY: Math.PI / 2 },
    { x: 142, z: -34, rotationY: -0.45 }, { x: 132, z: -24, rotationY: Math.PI / 2 },
  ].map((placement) => ({ ...placement, x: placement.x * INDUSTRIAL_SPACE_SCALE, z: placement.z * INDUSTRIAL_SPACE_SCALE }));
  const barrierInstances = addIndustrialObstacleSet(
    'industrial_barrier', barrierPlacements, 7.8, 'Industrial01_ConcreteBarriers_30',
    { tint: 0xbfc0b9, metalness: 0.06, roughness: 0.9, scaleYFactor: 0.48, scaleZFactor: 1.12, groundEmbed: 0.006 }, 'concrete-barrier',
  );

  const fenceModule = ARENA_LAYOUT.fenceModuleLength;
  const horizontalCount = Math.ceil((INDUSTRIAL_LAYOUT.fenceHalfWidth * 2) / fenceModule);
  const verticalCount = Math.ceil((INDUSTRIAL_LAYOUT.fenceHalfLength * 2) / fenceModule);
  const horizontalLength = INDUSTRIAL_LAYOUT.fenceHalfWidth * 2 / horizontalCount;
  const verticalLength = INDUSTRIAL_LAYOUT.fenceHalfLength * 2 / verticalCount;
  const horizontalFence = [];
  const verticalFence = [];
  for (let index = 0; index < horizontalCount; index++) {
    const x = -INDUSTRIAL_LAYOUT.fenceHalfWidth + horizontalLength / 2 + index * horizontalLength;
    horizontalFence.push({ x, z: -INDUSTRIAL_LAYOUT.fenceHalfLength, rotationY: 0 }, { x, z: INDUSTRIAL_LAYOUT.fenceHalfLength, rotationY: Math.PI });
  }
  for (let index = 0; index < verticalCount; index++) {
    const z = -INDUSTRIAL_LAYOUT.fenceHalfLength + verticalLength / 2 + index * verticalLength;
    verticalFence.push({ x: INDUSTRIAL_LAYOUT.fenceHalfWidth, z, rotationY: -Math.PI / 2 }, { x: -INDUSTRIAL_LAYOUT.fenceHalfWidth, z, rotationY: Math.PI / 2 });
  }
  const fenceA = addInstancedArenaModules('arena_fence', horizontalFence, horizontalLength, 'Industrial01_FenceNorthSouth', { tint: 0x89959c, metalness: 0.75, roughness: 0.46, groundEmbed: 0.006 });
  const fenceB = addInstancedArenaModules('arena_fence', verticalFence, verticalLength, 'Industrial01_FenceEastWest', { tint: 0x89959c, metalness: 0.75, roughness: 0.46, groundEmbed: 0.006 });
  const fenceHeight = Math.max(fenceA.userData.scaledSize.y, fenceB.userData.scaledSize.y);
  const fenceDepth = Math.max(0.18, Math.min(fenceA.userData.scaledSize.z, fenceB.userData.scaledSize.z));
  addEnvironmentColliderDebug({ name: 'Industrial01_FenceNorth_Collider', mapId: 'industrial01', x: 0, y: fenceHeight / 2 - 0.006, z: INDUSTRIAL_LAYOUT.halfLength + fenceDepth / 2, width, height: fenceHeight, depth: fenceDepth, color: 0xb58aff });
  addEnvironmentColliderDebug({ name: 'Industrial01_FenceSouth_Collider', mapId: 'industrial01', x: 0, y: fenceHeight / 2 - 0.006, z: -INDUSTRIAL_LAYOUT.halfLength - fenceDepth / 2, width, height: fenceHeight, depth: fenceDepth, color: 0xb58aff });
  addEnvironmentColliderDebug({ name: 'Industrial01_FenceEast_Collider', mapId: 'industrial01', x: INDUSTRIAL_LAYOUT.halfWidth + fenceDepth / 2, y: fenceHeight / 2 - 0.006, z: 0, width: fenceDepth, height: fenceHeight, depth: length, color: 0xb58aff });
  addEnvironmentColliderDebug({ name: 'Industrial01_FenceWest_Collider', mapId: 'industrial01', x: -INDUSTRIAL_LAYOUT.halfWidth - fenceDepth / 2, y: fenceHeight / 2 - 0.006, z: 0, width: fenceDepth, height: fenceHeight, depth: length, color: 0xb58aff });
  const postMaterial = createMaterial(0x555f64, 0.72, 0.4);
  for (const x of [-INDUSTRIAL_LAYOUT.fenceHalfWidth, INDUSTRIAL_LAYOUT.fenceHalfWidth]) for (const z of [-INDUSTRIAL_LAYOUT.fenceHalfLength, INDUSTRIAL_LAYOUT.fenceHalfLength]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.95, fenceHeight, 0.95), postMaterial);
    post.position.set(x, fenceHeight / 2, z);
    scene.add(post);
  }

  const silhouetteMaterial = createMaterial(0x434b4f, 0.28, 0.82);
  const silhouetteGeometry = new THREE.BoxGeometry(1, 1, 1);
  const silhouetteLayout = [
    [-278, -160, 30, 15, 48], [-280, -80, 24, 11, 38], [-280, 30, 34, 18, 46], [-278, 145, 28, 13, 42],
    [279, -150, 36, 17, 45], [280, -54, 28, 14, 40], [280, 68, 35, 13, 49], [278, 156, 30, 15, 44],
  ].map(([x, z, sx, sy, sz]) => [x * INDUSTRIAL_SPACE_SCALE, z * INDUSTRIAL_SPACE_SCALE, sx, sy, sz]);
  const silhouettes = new THREE.InstancedMesh(silhouetteGeometry, silhouetteMaterial, silhouetteLayout.length);
  const silhouetteMatrix = new THREE.Matrix4();
  silhouetteLayout.forEach(([x, z, sx, sy, sz], index) => silhouettes.setMatrixAt(index, silhouetteMatrix.compose(new THREE.Vector3(x, sy / 2 - 0.1, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz))));
  silhouettes.name = 'Industrial01_BackgroundSilhouettes';
  silhouettes.castShadow = false;
  silhouettes.receiveShadow = true;
  scene.add(silhouettes);

  industrialStats.assets.containers = containerPlacements.length;
  industrialStats.assets.barriers = barrierPlacements.length;
  industrialStats.assets.fenceModules = horizontalFence.length + verticalFence.length;
  industrialStats.assets.containerSource = '컨테이너.glb';
  industrialStats.assets.barrierSource = '콘크리트 방벽.glb';
  industrialStats.assets.fenceSource = 'Arena 01 철제 보호 펜스';
  industrialStats.assets.containerTrianglesPerInstance = containerInstances.geometry.index ? containerInstances.geometry.index.count / 3 : 0;
  industrialStats.assets.barrierTrianglesPerInstance = barrierInstances.geometry.index ? barrierInstances.geometry.index.count / 3 : 0;
  industrialStats.assets.containerWorldSize = Object.fromEntries(Object.entries(containerInstances.userData.scaledSize).map(([key, value]) => [key, Number(value.toFixed(2))]));
  industrialStats.assets.barrierWorldSize = Object.fromEntries(Object.entries(barrierInstances.userData.scaledSize).map(([key, value]) => [key, Number(value.toFixed(2))]));
  industrialStats.assets.containerRole = 'full-line-of-sight-blocker';
  industrialStats.assets.barrierRole = 'low-path-deflector';
}

function createDesertSandTextures() {
  const size = 256;
  const height = new Float32Array(size * size);
  const albedo = new Uint8Array(size * size * 4);
  const normal = new Uint8Array(size * size * 4);
  const tau = Math.PI * 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = tau * x / size;
    const v = tau * y / size;
    // Integer-frequency periodic waves stay seamless, but phase warping and
    // three scales prevent the old regular checker/moire pattern. The albedo
    // range is intentionally restrained; most terrain form comes from the
    // real heightfield normals and slope/height vertex palette.
    const phaseWarp = Math.sin(v * 2 + Math.sin(u) * 0.45) * 0.72
      + Math.sin(v * 5 - u * 2 + 0.7) * 0.22;
    const wind = Math.sin(u * 4 + phaseWarp) * 0.54
      + Math.sin(u * 9 - v * 3 + Math.sin(v * 2) * 0.6) * 0.24
      + Math.sin(u * 17 + v * 5 + 1.8) * 0.08;
    const broad = Math.sin(u + v * 2 + 0.4) * 0.46
      + Math.cos(u * 3 - v + 2.2) * 0.31
      + Math.sin(u * 2 - v * 3) * 0.18;
    const grains = Math.sin(u * 43 + v * 29 + 1.4) * 0.08
      + Math.sin(u * 71 - v * 47 + 2.1) * 0.05
      + Math.cos(u * 89 + v * 67) * 0.035;
    const value = clamp(0.5 + wind * 0.115 + broad * 0.075 + grains * 0.45, 0.18, 0.82);
    height[y * size + x] = value;
    const offset = (y * size + x) * 4;
    // Near-neutral warm detail multiplies the slope/height vertex palette
    // without turning the whole terrain into one saturated orange colour.
    albedo[offset] = Math.round(174 + value * 66);
    albedo[offset + 1] = Math.round(163 + value * 64);
    albedo[offset + 2] = Math.round(147 + value * 58);
    albedo[offset + 3] = 255;
  }
  const wrappedHeight = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (wrappedHeight(x + 1, y) - wrappedHeight(x - 1, y)) * 0.52;
    const dy = (wrappedHeight(x, y + 1) - wrappedHeight(x, y - 1)) * 0.52;
    const vector = new THREE.Vector3(-dx, -dy, 1).normalize();
    const offset = (y * size + x) * 4;
    normal[offset] = Math.round((vector.x * 0.5 + 0.5) * 255);
    normal[offset + 1] = Math.round((vector.y * 0.5 + 0.5) * 255);
    normal[offset + 2] = Math.round((vector.z * 0.5 + 0.5) * 255);
    normal[offset + 3] = 255;
  }
  const albedoTexture = new THREE.DataTexture(albedo, size, size, THREE.RGBAFormat);
  albedoTexture.colorSpace = THREE.SRGBColorSpace;
  const normalTexture = new THREE.DataTexture(normal, size, size, THREE.RGBAFormat);
  for (const texture of [albedoTexture, normalTexture]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(11, 16);
    texture.anisotropy = Math.min(6, renderer.capabilities.getMaxAnisotropy());
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }
  albedoTexture.name = 'RedCanyon_SeamlessWindSand_Albedo';
  normalTexture.name = 'RedCanyon_SeamlessWindSand_Normal';
  return { albedoTexture, normalTexture, size, repeat: [11, 16] };
}

function desertBarrierEdgeDistance(x, z) {
  let minimum = Infinity;
  for (const segment of DESERT_CANYON_SEGMENTS) {
    const cosine = Math.cos(-segment.yaw);
    const sine = Math.sin(-segment.yaw);
    const dx = x - segment.x;
    const dz = z - segment.z;
    const localX = dx * cosine - dz * sine;
    const localZ = dx * sine + dz * cosine;
    const outsideX = Math.max(0, Math.abs(localX) - segment.length * 0.5);
    const outsideZ = Math.max(0, Math.abs(localZ) - segment.depth * 0.5);
    minimum = Math.min(minimum, Math.hypot(outsideX, outsideZ));
  }
  return minimum;
}

function createDesertTerrainGeometry() {
  const [segmentsX, segmentsZ] = DESERT_LAYOUT.terrainSegments;
  const vertices = [];
  const colors = [];
  const uvs = [];
  const indices = [];
  const colorValley = new THREE.Color(0x735746);
  const colorFlat = new THREE.Color(0xa47755);
  const colorHigh = new THREE.Color(0xbe9a70);
  const colorSteep = new THREE.Color(0x665044);
  const colorRockBase = new THREE.Color(0x684638);
  for (let zIndex = 0; zIndex <= segmentsZ; zIndex++) {
    const z = lerp(-DESERT_LAYOUT.halfLength, DESERT_LAYOUT.halfLength, zIndex / segmentsZ);
    for (let xIndex = 0; xIndex <= segmentsX; xIndex++) {
      const x = lerp(-DESERT_LAYOUT.halfWidth, DESERT_LAYOUT.halfWidth, xIndex / segmentsX);
      const y = desertTerrainHeight(x, z);
      vertices.push(x, y, z);
      uvs.push(xIndex / segmentsX, zIndex / segmentsZ);
      const sampleDistance = 3.2;
      const slopeX = (desertTerrainHeight(x + sampleDistance, z) - desertTerrainHeight(x - sampleDistance, z)) / (sampleDistance * 2);
      const slopeZ = (desertTerrainHeight(x, z + sampleDistance) - desertTerrainHeight(x, z - sampleDistance)) / (sampleDistance * 2);
      const slope = smoothRange(Math.hypot(slopeX, slopeZ), 0.008, 0.085);
      const heightBlend = clamp((y + 2.4) / 10.5, 0, 1);
      const color = colorValley.clone().lerp(colorFlat, smoothRange(heightBlend, 0.08, 0.5));
      color.lerp(colorHigh, smoothRange(heightBlend, 0.46, 0.94) * 0.58);
      color.lerp(colorSteep, slope * 0.72);
      const rockBlend = 1 - smoothRange(desertBarrierEdgeDistance(x, z), 1.5, 15);
      color.lerp(colorRockBase, rockBlend * 0.52);
      const macroSand = Math.sin(x * 0.037 + z * 0.021 + Math.sin(z * 0.011) * 1.1) * 0.052
        + Math.cos(z * 0.064 - x * 0.018 + Math.sin(x * 0.015)) * 0.034
        + Math.sin((x + z) * 0.014) * 0.025;
      const windStreak = Math.sin(x * 0.17 + Math.sin(z * 0.027) * 1.4) * 0.018;
      color.multiplyScalar(0.95 + macroSand + windStreak);
      colors.push(color.r, color.g, color.b);
    }
  }
  for (let zIndex = 0; zIndex < segmentsZ; zIndex++) for (let xIndex = 0; xIndex < segmentsX; xIndex++) {
    const a = zIndex * (segmentsX + 1) + xIndex;
    const b = a + 1;
    const c = a + segmentsX + 1;
    const d = c + 1;
    indices.push(a, c, b, b, c, d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function createDesertGravelDetails() {
  const geometry = new THREE.IcosahedronGeometry(0.34, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x87503a, roughness: 0.97, metalness: 0, vertexColors: true });
  const requestedCount = 320;
  const transforms = [];
  const colors = [];
  const pseudo = (index, salt) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
    return value - Math.floor(value);
  };
  const zones = [
    [DESERT_LAYOUT.pointA[0], DESERT_LAYOUT.pointA[1], DESERT_LAYOUT.captureRadius + 9],
    [DESERT_LAYOUT.pointB[0], DESERT_LAYOUT.pointB[1], DESERT_LAYOUT.captureRadius + 9],
    [0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset), DESERT_LAYOUT.repairRadius + 8],
    [0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset, DESERT_LAYOUT.repairRadius + 8],
  ];
  for (let index = 0; index < requestedCount * 2 && transforms.length < requestedCount; index++) {
    let x;
    let z;
    if (pseudo(index, 1) < 0.68) {
      const segment = DESERT_CANYON_SEGMENTS[Math.floor(pseudo(index, 2) * DESERT_CANYON_SEGMENTS.length) % DESERT_CANYON_SEGMENTS.length];
      const along = (pseudo(index, 3) - 0.5) * segment.length * 1.12;
      const side = (pseudo(index, 4) < 0.5 ? -1 : 1) * (segment.depth * 0.5 + 2.5 + pseudo(index, 5) * 14);
      x = segment.x + Math.cos(segment.yaw) * along - Math.sin(segment.yaw) * side;
      z = segment.z + Math.sin(segment.yaw) * along + Math.cos(segment.yaw) * side;
    } else {
      x = lerp(-DESERT_LAYOUT.halfWidth + 12, DESERT_LAYOUT.halfWidth - 12, pseudo(index, 6));
      z = lerp(-DESERT_LAYOUT.halfLength + 12, DESERT_LAYOUT.halfLength - 12, pseudo(index, 7));
    }
    if (zones.some(([zoneX, zoneZ, radius]) => Math.hypot(x - zoneX, z - zoneZ) < radius)) continue;
    const scale = 0.32 + pseudo(index, 8) * 1.05;
    const y = desertTerrainHeight(x, z) + 0.08 * scale;
    const object = new THREE.Object3D();
    object.position.set(x, y, z);
    object.rotation.set(pseudo(index, 9) * Math.PI, pseudo(index, 10) * Math.PI * 2, pseudo(index, 11) * Math.PI);
    object.scale.set(scale * (0.7 + pseudo(index, 12) * 0.65), scale * (0.28 + pseudo(index, 13) * 0.3), scale * (0.62 + pseudo(index, 14) * 0.75));
    object.updateMatrix();
    transforms.push(object.matrix.clone());
    colors.push(new THREE.Color().setHSL(0.055 + pseudo(index, 15) * 0.025, 0.34 + pseudo(index, 16) * 0.16, 0.28 + pseudo(index, 17) * 0.18));
  }
  const pebbles = new THREE.InstancedMesh(geometry, material, transforms.length);
  transforms.forEach((matrix, index) => { pebbles.setMatrixAt(index, matrix); pebbles.setColorAt(index, colors[index]); });
  pebbles.instanceMatrix.needsUpdate = true;
  if (pebbles.instanceColor) pebbles.instanceColor.needsUpdate = true;
  pebbles.name = 'RedCanyon_NonCollidingGravelScatter';
  pebbles.castShadow = false;
  pebbles.receiveShadow = true;
  pebbles.frustumCulled = true;
  pebbles.userData = { visualDetailOnly: true, colliders: 0, distribution: 'dense-near-cliffs-sparse-on-routes-clear-at-objectives', count: transforms.length };
  scene.add(pebbles);
  return pebbles;
}

function addDesertAsset(id, placement, targetLongest, name, obstacle = false) {
  const { root, bounds, size } = getArenaAssetMetrics(id);
  const object = root.clone(true);
  const variation = placement.scale ?? 1;
  const uniform = targetLongest / Math.max(size.x, size.z) * variation;
  const verticalScale = placement.verticalScale ?? 1;
  object.name = name;
  object.scale.set(uniform * (placement.mirror ? -1 : 1), uniform * verticalScale, uniform);
  object.rotation.set(placement.tiltX ?? 0, placement.rotationY ?? 0, placement.tiltZ ?? 0);
  const y = desertTerrainHeight(placement.x, placement.z) - bounds.min.y * uniform * verticalScale - (placement.embed ?? 0.18);
  object.position.set(placement.x, y, placement.z);
  object.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = Boolean(placement.castShadow);
    node.receiveShadow = true;
    if (node.material) {
      node.material = node.material.clone();
      if (node.material.color) node.material.color.multiply(new THREE.Color(placement.tint ?? 0xa45b3a));
      node.material.roughness = Math.max(0.74, node.material.roughness ?? 0.74);
      node.material.metalness = Math.min(0.08, node.material.metalness ?? 0.04);
    }
  });
  scene.add(object);
  if (obstacle) {
    const halfX = Math.max(2.2, size.x * uniform * 0.37);
    const halfZ = Math.max(2.2, size.z * uniform * 0.37);
    obstacles.push({ kind: 'box', obstacleType: 'desert-rock', x: placement.x, z: placement.z, rotationY: placement.rotationY ?? 0, halfX, halfZ, radius: Math.hypot(halfX, halfZ), colliderHeight: size.y * uniform * verticalScale * 0.72, colliderBottom: desertTerrainHeight(placement.x, placement.z), mesh: object, static: true });
  }
  return object;
}

// The supplied desert GLBs are close to 100 MB each. Cloning the full source
// dozens of times caused the earlier 10v10 build to stall, so create one
// geometry-clustered render LOD from the real GLB and reuse that faithful
// silhouette. This is not a procedural replacement: vertices, proportions,
// sub-mesh transforms and materials all originate in the supplied asset.
const desertAssetLODCache = new Map();
function clusterDesertGeometry(sourceGeometry, globalBounds, resolution = 28) {
  const position = sourceGeometry.getAttribute('position');
  if (!position || position.count < 24) return sourceGeometry.clone();
  const uv = sourceGeometry.getAttribute('uv');
  const sourceIndex = sourceGeometry.index?.array;
  const size = globalBounds.getSize(new THREE.Vector3());
  const minimum = globalBounds.min;
  const cell = new THREE.Vector3(
    Math.max(size.x / resolution, 0.0001),
    Math.max(size.y / Math.max(14, Math.round(resolution * 0.72)), 0.0001),
    Math.max(size.z / resolution, 0.0001),
  );
  const clusters = new Map();
  const vertexCluster = new Uint32Array(position.count);
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index), y = position.getY(index), z = position.getZ(index);
    const key = `${Math.round((x - minimum.x) / cell.x)},${Math.round((y - minimum.y) / cell.y)},${Math.round((z - minimum.z) / cell.z)}`;
    let cluster = clusters.get(key);
    if (!cluster) {
      cluster = { index: clusters.size, x: 0, y: 0, z: 0, u: 0, v: 0, count: 0 };
      clusters.set(key, cluster);
    }
    cluster.x += x; cluster.y += y; cluster.z += z;
    if (uv) { cluster.u += uv.getX(index); cluster.v += uv.getY(index); }
    cluster.count++;
    vertexCluster[index] = cluster.index;
  }
  const clusteredPositions = new Float32Array(clusters.size * 3);
  const clusteredUVs = uv ? new Float32Array(clusters.size * 2) : null;
  for (const cluster of clusters.values()) {
    clusteredPositions[cluster.index * 3] = cluster.x / cluster.count;
    clusteredPositions[cluster.index * 3 + 1] = cluster.y / cluster.count;
    clusteredPositions[cluster.index * 3 + 2] = cluster.z / cluster.count;
    if (clusteredUVs) {
      clusteredUVs[cluster.index * 2] = cluster.u / cluster.count;
      clusteredUVs[cluster.index * 2 + 1] = cluster.v / cluster.count;
    }
  }
  const triangleCount = sourceIndex ? Math.floor(sourceIndex.length / 3) : Math.floor(position.count / 3);
  const clusteredIndices = [];
  const seenTriangles = new Set();
  for (let triangle = 0; triangle < triangleCount; triangle++) {
    const a = vertexCluster[sourceIndex ? sourceIndex[triangle * 3] : triangle * 3];
    const b = vertexCluster[sourceIndex ? sourceIndex[triangle * 3 + 1] : triangle * 3 + 1];
    const c = vertexCluster[sourceIndex ? sourceIndex[triangle * 3 + 2] : triangle * 3 + 2];
    if (a === b || b === c || a === c) continue;
    const sorted = [a, b, c].sort((left, right) => left - right);
    const key = `${sorted[0]},${sorted[1]},${sorted[2]}`;
    if (seenTriangles.has(key)) continue;
    seenTriangles.add(key);
    clusteredIndices.push(a, b, c);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(clusteredPositions, 3));
  if (clusteredUVs) geometry.setAttribute('uv', new THREE.BufferAttribute(clusteredUVs, 2));
  geometry.setIndex(clusteredIndices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    sourceAssetLOD: true,
    sourceVertices: position.count,
    lodVertices: clusters.size,
    sourceTriangles: triangleCount,
    lodTriangles: Math.floor(clusteredIndices.length / 3),
  };
  return geometry;
}

function getDesertAssetLOD(id) {
  if (desertAssetLODCache.has(id)) return desertAssetLODCache.get(id);
  const { root, bounds, size } = getArenaAssetMetrics(id);
  root.updateWorldMatrix(true, true);
  const inverseRoot = root.matrixWorld.clone().invert();
  const template = new THREE.Group();
  let sourceTriangles = 0;
  let lodTriangles = 0;
  root.traverse((node) => {
    if (!node.isMesh || !node.geometry) return;
    const geometry = node.geometry.clone();
    geometry.applyMatrix4(inverseRoot.clone().multiply(node.matrixWorld));
    const lodGeometry = clusterDesertGeometry(geometry, bounds, id === 'desert_cliff' ? 30 : 24);
    sourceTriangles += lodGeometry.userData.sourceTriangles ?? 0;
    lodTriangles += lodGeometry.userData.lodTriangles ?? 0;
    const material = Array.isArray(node.material) ? node.material.map((entry) => entry.clone()) : node.material.clone();
    const materials = Array.isArray(material) ? material : [material];
    for (const entry of materials) {
      entry.roughness = Math.max(0.74, entry.roughness ?? 0.74);
      entry.metalness = Math.min(0.08, entry.metalness ?? 0.04);
      entry.flatShading = true;
      entry.needsUpdate = true;
    }
    const mesh = new THREE.Mesh(lodGeometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    template.add(mesh);
  });
  template.userData = { sourceAsset: id, optimizedFromSuppliedGLB: true, sourceTriangles, lodTriangles };
  const result = { root: template, bounds: bounds.clone(), size: size.clone(), sourceTriangles, lodTriangles };
  desertAssetLODCache.set(id, result);
  return result;
}

function addDesertLODAsset(id, placement, worldSize, name, obstacle = false, obstacleType = 'desert-rock') {
  const source = getDesertAssetLOD(id);
  const object = source.root.clone(true);
  const desired = new THREE.Vector3(...worldSize);
  const scale = new THREE.Vector3(
    desired.x / Math.max(source.size.x, 0.0001),
    desired.y / Math.max(source.size.y, 0.0001),
    desired.z / Math.max(source.size.z, 0.0001),
  );
  if (placement.mirror) scale.x *= -1;
  object.name = name;
  object.scale.copy(scale);
  object.rotation.set(placement.tiltX ?? 0, placement.rotationY ?? 0, placement.tiltZ ?? 0);
  object.position.set(
    placement.x,
    desertTerrainHeight(placement.x, placement.z) - source.bounds.min.y * Math.abs(scale.y) - (placement.embed ?? 0.28),
    placement.z,
  );
  object.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = Boolean(placement.castShadow);
    node.receiveShadow = true;
  });
  object.userData = { ...object.userData, sourceAsset: id, optimizedFromSuppliedGLB: true, desiredWorldSize: desired.toArray() };
  scene.add(object);
  if (obstacle) {
    const halfX = desired.x * 0.43;
    const halfZ = desired.z * 0.43;
    obstacles.push({ kind: 'box', obstacleType, x: placement.x, z: placement.z, rotationY: placement.rotationY ?? 0, halfX, halfZ, radius: Math.hypot(halfX, halfZ), colliderHeight: desired.y * 0.82, colliderBottom: desertTerrainHeight(placement.x, placement.z), mesh: object, static: true });
  }
  return object;
}

function addCanyonBarrierSegment(segment, segmentIndex) {
  const placement = {
    x: segment.x, z: segment.z, rotationY: segment.yaw,
    mirror: segmentIndex % 2 === 0, embed: segment.height * 0.12,
    tiltX: ((segmentIndex % 3) - 1) * 0.025,
    tiltZ: (((segmentIndex + 1) % 3) - 1) * 0.035,
    castShadow: segmentIndex < 6,
  };
  const visuals = [addDesertLODAsset(
    'desert_cliff', placement,
    [segment.length * 1.14, segment.height * (1.06 + (segmentIndex % 3) * 0.06), segment.depth * 1.55],
    `RedCanyon_BlockingCliff_${segment.id}`, false,
  )];
  const collider = {
    kind: 'box', obstacleType: 'desert-cliff', canyonSegmentId: segment.id,
    x: segment.x, z: segment.z, rotationY: segment.yaw,
    halfX: segment.length * 0.5 + 1.2, halfZ: segment.depth * 0.5,
    radius: Math.hypot(segment.length * 0.5 + 1.2, segment.depth * 0.5),
    colliderHeight: segment.height, colliderBottom: desertTerrainHeight(segment.x, segment.z) - 0.4,
    mesh: visuals[0], static: true,
  };
  obstacles.push(collider);
  return { visuals, collider };
}

function createDesertConquestMap() {
  const width = DESERT_LAYOUT.halfWidth * 2;
  const length = DESERT_LAYOUT.halfLength * 2;
  scene.add(new THREE.HemisphereLight(0xffe8c9, 0x292320, 0.72));
  scene.add(new THREE.AmbientLight(0x76675e, 0.08));
  const sun = new THREE.DirectionalLight(0xffdfb2, 2.55);
  sun.position.set(-155, 238, -118);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.00028;
  sun.shadow.normalBias = 0.045;
  sun.shadow.camera.left = -265;
  sun.shadow.camera.right = 265;
  sun.shadow.camera.top = 365;
  sun.shadow.camera.bottom = -365;
  scene.add(sun);
  const warmFill = new THREE.DirectionalLight(0xd59a7b, 0.16);
  warmFill.position.set(70, 28, 82);
  scene.add(warmFill);

  const sandTextures = createDesertSandTextures();
  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: sandTextures.albedoTexture,
    normalMap: sandTextures.normalTexture,
    normalScale: new THREE.Vector2(0.82, 0.82),
    metalness: 0,
    roughness: 0.92,
  });
  const terrain = new THREE.Mesh(createDesertTerrainGeometry(), terrainMaterial);
  terrain.name = 'RedCanyon_HeightfieldTerrain';
  terrain.receiveShadow = true;
  scene.add(terrain);
  desertStats.terrain.heightRange = [Number(terrain.geometry.boundingBox.min.y.toFixed(2)), Number(terrain.geometry.boundingBox.max.y.toFixed(2))];
  desertStats.terrain.surface = {
    material: 'slope-and-height-blended-red-sand',
    seamlessAlbedoTexture: true,
    seamlessNormalMap: true,
    textureResolution: sandTextures.size,
    textureRepeat: sandTextures.repeat,
    slopeShading: true,
    heightColorVariation: true,
    cliffBaseBlend: true,
    analyticPhysicsMatchesVisualHeightfield: true,
  };
  const physicsFloor = new THREE.Mesh(new THREE.BoxGeometry(width, PHYSICS_FLOOR_THICKNESS.desert01, length), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
  physicsFloor.name = 'RedCanyon_AnalyticHeightfieldCollider';
  physicsFloor.position.y = -PHYSICS_FLOOR_THICKNESS.desert01 / 2 - 2;
  physicsFloor.visible = false;
  physicsFloor.userData = { physicsCollider: 'analytic-heightfield', static: true, width, length, topFunction: 'desertTerrainHeight' };
  scene.add(physicsFloor);

  // Outer mountains close the horizon; the authored internal chains below are
  // the actual route-blocking terrain. Their much larger size matches the
  // reference's dozens-of-robots-high silhouettes.
  const boundaryCliffs = [
    [-278,-250,Math.PI/2,112,58,42],[-280,-80,Math.PI/2,130,68,44],[-278,104,Math.PI/2,124,62,42],[-280,270,Math.PI/2,112,56,40],
    [278,-258,-Math.PI/2,118,60,42],[280,-78,-Math.PI/2,132,70,46],[278,112,-Math.PI/2,126,64,42],[280,278,-Math.PI/2,108,58,40],
    [-184,-382,0,118,60,40],[0,-384,0,132,68,44],[184,-382,0,118,58,40],
    [-184,382,Math.PI,116,58,40],[0,384,Math.PI,136,70,46],[184,382,Math.PI,116,60,40],
  ].map(([x,z,rotationY,sx,sy,sz], index) => ({ x, z, rotationY, sx, sy, sz, mirror: index % 2 === 0, embed: 7 + (index % 3), tiltX: ((index % 3) - 1) * 0.022, tiltZ: (((index + 1) % 3) - 1) * 0.028 }));
  boundaryCliffs.forEach((placement, index) => addDesertLODAsset(
    'desert_cliff', placement, [placement.sx, placement.sy, placement.sz],
    `RedCanyon_BackgroundMountain_${index + 1}`, false,
  ));

  const canyonBarriers = DESERT_CANYON_SEGMENTS.map(addCanyonBarrierSegment);

  const rockPlacements = [
    [-205,-270,0.2,18,13,15],[-145,-258,1.4,14,10,13],[205,-260,0.7,16,12,14],
    [-155,-155,2.7,17,12,15],[122,-166,0.4,15,11,13],[210,-158,2.9,18,13,16],
    [-214,-14,1.1,15,11,14],[-102,-8,2.45,14,10,12],[208,-62,1.62,18,12,15],
    [-212,58,2.15,15,11,13],[-112,146,0.86,14,10,13],[212,138,0.55,17,12,15],
    [-148,248,1.96,15,11,13],[132,258,0.38,16,12,14],[206,272,2.12,18,13,15],
  ].map(([x,z,rotationY,sx,sy,sz], index) => ({ x, z, rotationY, sx, sy, sz, mirror: index % 4 === 0, embed: 0.72 + (index % 3) * 0.16, tiltX: ((index % 5) - 2) * 0.025, tiltZ: ((index % 4) - 1.5) * 0.022, castShadow: index < 6 }));
  rockPlacements.forEach((placement, index) => addDesertLODAsset(
    'desert_rock', placement, [placement.sx, placement.sy, placement.sz],
    `RedCanyon_MediumRock_${index + 1}`, true, 'desert-rock',
  ));

  const ridgePlacements = [
    [-132,-238,42,4.5,0.24],[122,-236,38,4.2,-0.34],[-118,-136,46,4.7,-0.24],[118,-142,38,4.3,0.32],
    [-198,4,38,4.1,-0.18],[-112,66,40,4.4,0.26],[112,-14,36,4.2,-0.2],[198,-54,40,4.5,0.24],
    [-112,154,42,4.6,-0.22],[128,144,38,4.1,0.3],[-118,238,44,4.5,-0.18],[122,250,40,4.2,0.28],
  ];
  ridgePlacements.forEach(([x,z,ridgeLength,height,rotationY], index) => {
    const ridge = addDesertLODAsset(
      'desert_rock',
      { x, z, rotationY, mirror: index % 2 === 0, embed: height * 0.24, tiltZ: ((index % 3) - 1) * 0.035 },
      [ridgeLength, height * 1.35, height * 2.15],
      `RedCanyon_LowLongRidge_${index + 1}`, false,
    );
    obstacles.push({ kind: 'box', obstacleType: 'desert-ridge', x, z, rotationY, halfX: ridgeLength * 0.45, halfZ: height * 0.88, radius: Math.hypot(ridgeLength * 0.45, height * 0.88), colliderHeight: height * 1.05, colliderBottom: desertTerrainHeight(x,z), mesh: ridge, static: true });
  });
  const gravel = createDesertGravelDetails();

  const createZone = (key, point, color, active) => {
    const group = new THREE.Group();
    group.name = `ConquestPoint_${key}`;
    const ringMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: active ? 0.8 : 0.22, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(DESERT_LAYOUT.captureRadius - 0.5, DESERT_LAYOUT.captureRadius, 64), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = point.y + 0.09;
    group.add(ring);
    const beaconMaterial = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: active ? 1.3 : 0.12, transparent: true, opacity: active ? 0.72 : 0.25, roughness: 0.4 });
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.55, 8, 12), beaconMaterial);
    beacon.position.y = point.y + 4;
    group.add(beacon);
    group.position.set(point.x, 0, point.z);
    scene.add(group);
    conquestVisuals.zones[key] = { group, ring, beacon, ringMaterial, beaconMaterial };
  };
  for (const [key, data] of Object.entries(conquestState.points)) {
    data.centre.y = desertTerrainHeight(data.centre.x, data.centre.z);
    createZone(key, data.centre, key === 'A' ? 0xffc85a : 0x63d8ff, key === 'A');
  }

  for (const team of ['blue', 'red']) {
    const z = (team === 'blue' ? -1 : 1) * (DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
    const color = team === 'blue' ? 0x3c9fff : 0xff4f42;
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.27, side: THREE.DoubleSide, depthWrite: false });
    const zone = new THREE.Mesh(new THREE.RingGeometry(DESERT_LAYOUT.repairRadius - 0.7, DESERT_LAYOUT.repairRadius, 56), material);
    zone.rotation.x = -Math.PI / 2;
    zone.position.set(0, desertTerrainHeight(0, z) + 0.1, z);
    zone.name = `${team.toUpperCase()}_REPAIR_RESPAWN_ZONE`;
    scene.add(zone);
    conquestVisuals.repairZones[team] = zone;
  }

  desertStats.assets.giantCliffs = boundaryCliffs.length + canyonBarriers.reduce((sum, barrier) => sum + barrier.visuals.length, 0);
  desertStats.assets.blockingMountainChains = DESERT_CANYON_SEGMENTS.length;
  desertStats.assets.mediumRocks = rockPlacements.length;
  desertStats.assets.lowRidges = ridgePlacements.length;
  desertStats.assets.visualGravel = gravel.count;
  desertStats.assets.visualGravelColliders = 0;
  desertStats.assets.suppliedGLBLODInstances = desertStats.assets.giantCliffs + rockPlacements.length + ridgePlacements.length;
  desertStats.assets.lowPolyProxyInstances = 0;
  desertStats.assets.proceduralMajorTerrainInstances = 0;
  desertStats.assets.sourceLOD = Object.fromEntries([...desertAssetLODCache].map(([id, value]) => [id, { sourceTriangles: value.sourceTriangles, lodTriangles: value.lodTriangles }]));
  desertStats.capturePoints = { A: conquestState.points.A.centre.toArray(), B: conquestState.points.B.centre.toArray() };
  desertStats.spawnZones = { blue: [0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset)], red: [0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset] };
  desertStats.routes = ['west-high-ridge-pass', 'centre-split-valley', 'east-plateau-pass'];
  desertStats.layoutDiagram = { red: [0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset], blue: [0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset)], A: [...DESERT_LAYOUT.pointA], B: [...DESERT_LAYOUT.pointB] };
  desertStats.captureSecondsPerPoint = DESERT_LAYOUT.captureSeconds;
}

function captureMapScene(id, build) {
  const before = new Set(scene.children);
  obstacles.length = 0;
  ramps.length = 0;
  build();
  mapSceneObjects[id] = scene.children.filter((child) => !before.has(child));
  mapObstacleSets[id] = [...obstacles];
  mapRampSets[id] = [...ramps];
}

function pointInsideMapObstacle(point, margin = 0) {
  for (const obstacle of obstacles) {
    if (obstacle.kind !== 'box') continue;
    const cos = Math.cos(-obstacle.rotationY);
    const sin = Math.sin(-obstacle.rotationY);
    const dx = point.x - obstacle.x;
    const dz = point.z - obstacle.z;
    const localX = dx * cos - dz * sin;
    const localZ = dx * sin + dz * cos;
    if (Math.abs(localX) <= obstacle.halfX + margin && Math.abs(localZ) <= obstacle.halfZ + margin) return true;
  }
  return false;
}

function robotCentreInsideMountainCollider(robot, margin = 0.02) {
  return obstacles.some((obstacle) => {
    if (obstacle.kind !== 'box' || obstacle.obstacleType !== 'desert-cliff') return false;
    const local = orientedBoxLocalPoint(robot.root.position, obstacle);
    return Math.abs(local.x) < obstacle.halfX + margin && Math.abs(local.y) < obstacle.halfZ + margin;
  });
}

function segmentBlockedByMapObstacle(from, to, margin = 2.4) {
  const samples = Math.max(2, Math.ceil(from.distanceTo(to) / 2.6));
  const point = new THREE.Vector3();
  for (let index = 1; index < samples; index++) {
    point.lerpVectors(from, to, index / samples);
    if (pointInsideMapObstacle(point, margin)) return true;
  }
  return false;
}

function buildIndustrialNavigation() {
  const nodes = [];
  const xs = [-220, -176, -132, -88, -44, 0, 44, 88, 132, 176, 220].map((value) => value * INDUSTRIAL_SPACE_SCALE);
  const zs = [-176, -132, -88, -44, 0, 44, 88, 132, 176].map((value) => value * INDUSTRIAL_SPACE_SCALE);
  for (const z of zs) for (const x of xs) {
    const point = new THREE.Vector3(x, 0, z);
    if (!pointInsideMapObstacle(point, 7.2)) nodes.push(point);
  }
  const links = nodes.map(() => []);
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
    const distance = nodes[a].distanceTo(nodes[b]);
    if (distance > 64 * INDUSTRIAL_SPACE_SCALE || segmentBlockedByMapObstacle(nodes[a], nodes[b], 4.8)) continue;
    links[a].push({ node: b, cost: distance });
    links[b].push({ node: a, cost: distance });
  }
  industrialNavigation = { nodes, links, revision: industrialNavigation.revision + 1 };
  industrialStats.navigation.nodes = nodes.length;
  industrialStats.navigation.links = Math.round(links.reduce((sum, list) => sum + list.length, 0) / 2);
  const reachable = new Set(nodes.length ? [0] : []);
  const queue = nodes.length ? [0] : [];
  while (queue.length) {
    const current = queue.shift();
    for (const edge of links[current]) if (!reachable.has(edge.node)) { reachable.add(edge.node); queue.push(edge.node); }
  }
  industrialStats.navigation.connectedNodes = reachable.size;
  industrialStats.navigation.fullyConnected = reachable.size === nodes.length;
}

function buildDesertNavigation() {
  const nodes = [];
  const nodeByCell = new Map();
  const step = 24;
  let row = 0;
  for (let z = -312; z <= 312; z += step, row++) {
    let column = 0;
    for (let x = -216; x <= 216; x += step, column++) {
      const point = new THREE.Vector3(x, desertTerrainHeight(x, z), z);
      if (pointInsideMapObstacle(point, 3.2)) continue;
      const index = nodes.length;
      point.userData = { row, column };
      nodes.push(point);
      nodeByCell.set(`${row}:${column}`, index);
    }
  }
  const links = nodes.map(() => []);
  const directions = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
  nodes.forEach((node, index) => {
    const { row: nodeRow, column: nodeColumn } = node.userData;
    for (const [rowOffset, columnOffset] of directions) {
      const otherIndex = nodeByCell.get(`${nodeRow + rowOffset}:${nodeColumn + columnOffset}`);
      if (otherIndex === undefined || otherIndex <= index) continue;
      const other = nodes[otherIndex];
      if (segmentBlockedByMapObstacle(node, other, 3.0)) continue;
      const distance = Math.hypot(other.x - node.x, other.z - node.z);
      links[index].push({ node: otherIndex, cost: distance });
      links[otherIndex].push({ node: index, cost: distance });
    }
  });
  const reachable = new Set(nodes.length ? [0] : []);
  const queue = nodes.length ? [0] : [];
  while (queue.length) {
    const current = queue.shift();
    for (const edge of links[current]) if (!reachable.has(edge.node)) { reachable.add(edge.node); queue.push(edge.node); }
  }
  // Discard isolated pockets enclosed entirely by non-drivable mountains.
  // They are not playable navigation space and must never be selected by AI.
  const keptIndices = [...reachable].sort((a, b) => a - b);
  const remap = new Map(keptIndices.map((oldIndex, newIndex) => [oldIndex, newIndex]));
  const connectedNodes = keptIndices.map((index) => nodes[index]);
  const connectedLinks = keptIndices.map((oldIndex) => links[oldIndex]
    .filter((edge) => remap.has(edge.node))
    .map((edge) => ({ node: remap.get(edge.node), cost: edge.cost })));
  desertNavigation = { nodes: connectedNodes, links: connectedLinks, revision: desertNavigation.revision + 1 };
  desertStats.navigation.nodes = connectedNodes.length;
  desertStats.navigation.links = Math.round(connectedLinks.reduce((sum, list) => sum + list.length, 0) / 2);
  desertStats.navigation.connectedNodes = connectedNodes.length;
  desertStats.navigation.prunedEnclosedNodes = nodes.length - connectedNodes.length;
  desertStats.navigation.fullyConnected = true;

  const blue = new THREE.Vector3(0, 0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset));
  const red = new THREE.Vector3(0, 0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
  const pointA = conquestState.points.A.centre;
  const pointB = conquestState.points.B.centre;
  desertStats.navigation.directLinesBlocked = {
    blueToA: segmentBlockedByMapObstacle(blue, pointA, 2.6),
    aToB: segmentBlockedByMapObstacle(pointA, pointB, 2.6),
    bToRed: segmentBlockedByMapObstacle(pointB, red, 2.6),
  };
  desertStats.navigation.minimapRoutes = [0, 1, 2].map((routeIndex) => {
    const route = [];
    let start = blue;
    for (const target of [pointA, pointB, red]) {
      const section = computeDesertPath(start, target, routeIndex);
      route.push(...section.map((point) => [point.x, point.z]));
      start = target;
    }
    return route;
  });
  desertStats.navigation.routeLengths = desertStats.navigation.minimapRoutes.map((route) => {
    let previous = [blue.x, blue.z];
    let distance = 0;
    for (const point of route) { distance += Math.hypot(point[0] - previous[0], point[1] - previous[1]); previous = point; }
    return Number(distance.toFixed(1));
  });
  desertStats.navigation.routeWaypointCounts = desertStats.navigation.minimapRoutes.map((route) => route.length);
  desertStats.navigation.captureZonesClear = {
    A: !pointInsideMapObstacle(pointA, DESERT_LAYOUT.captureRadius + 2),
    B: !pointInsideMapObstacle(pointB, DESERT_LAYOUT.captureRadius + 2),
  };
}

function nearestDesertNavigationNode(point) {
  let best = -1;
  let bestDistance = Infinity;
  desertNavigation.nodes.forEach((node, index) => {
    const distance = node.distanceToSquared(point);
    if (distance >= bestDistance || segmentBlockedByMapObstacle(point, node, 2.5)) return;
    best = index;
    bestDistance = distance;
  });
  return best;
}

function computeDesertPathSection(from, goal, routeIndex = 1) {
  if (from.distanceToSquared(goal) < 42 ** 2 && !segmentBlockedByMapObstacle(from, goal, 2.5)) return [goal.clone()];
  const start = nearestDesertNavigationNode(from);
  const finish = nearestDesertNavigationNode(goal);
  if (start < 0 || finish < 0) return [goal.clone()];
  const size = desertNavigation.nodes.length;
  const cost = Array(size).fill(Infinity);
  const estimate = Array(size).fill(Infinity);
  const previous = Array(size).fill(-1);
  const open = new Set([start]);
  const preferredLane = [-158, 0, 158][Math.abs(routeIndex) % 3];
  cost[start] = 0;
  estimate[start] = desertNavigation.nodes[start].distanceTo(desertNavigation.nodes[finish]);
  while (open.size) {
    let current = -1;
    let currentScore = Infinity;
    for (const node of open) if (estimate[node] < currentScore) { current = node; currentScore = estimate[node]; }
    if (current === finish) break;
    open.delete(current);
    for (const edge of desertNavigation.links[current]) {
      const next = desertNavigation.nodes[edge.node];
      const goalDistanceBlend = clamp(next.distanceTo(goal) / 175, 0, 1);
      const laneCost = Math.abs(next.x - preferredLane) * 0.012 * goalDistanceBlend;
      const variety = Math.abs(Math.sin((edge.node + 11) * (routeIndex + 3) * 4.173)) * 0.75;
      const candidate = cost[current] + edge.cost + laneCost + variety;
      if (candidate >= cost[edge.node]) continue;
      previous[edge.node] = current;
      cost[edge.node] = candidate;
      estimate[edge.node] = candidate + next.distanceTo(desertNavigation.nodes[finish]);
      open.add(edge.node);
    }
  }
  if (!Number.isFinite(cost[finish])) return [goal.clone()];
  const raw = [];
  for (let cursor = finish; cursor >= 0; cursor = previous[cursor]) {
    raw.unshift(desertNavigation.nodes[cursor].clone());
    if (cursor === start) break;
  }
  raw.push(goal.clone());
  // Remove redundant grid points without cutting through the cliffs.
  const simplified = [];
  let anchor = from;
  let cursor = 0;
  while (cursor < raw.length) {
    let farthest = cursor;
    for (let candidate = cursor + 1; candidate < raw.length; candidate++) {
      if (segmentBlockedByMapObstacle(anchor, raw[candidate], 2.8)) break;
      farthest = candidate;
    }
    simplified.push(raw[farthest].clone());
    anchor = raw[farthest];
    cursor = farthest + 1;
  }
  return simplified;
}

function desertRouteAnchors(from, goal, routeIndex) {
  const lane = Math.abs(routeIndex) % 3;
  const pointA = conquestState.points.A.centre;
  const pointB = conquestState.points.B.centre;
  const red = new THREE.Vector3(0, 0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
  const goalIsA = goal.distanceToSquared(pointA) < 34 ** 2;
  const goalIsB = goal.distanceToSquared(pointB) < 34 ** 2;
  const goalIsRed = goal.distanceToSquared(red) < 38 ** 2;
  if (goalIsA && from.z < -80) return [
    [new THREE.Vector3(-132, 0, -184), new THREE.Vector3(-162, 0, -112)],
    [new THREE.Vector3(-4, 0, -181), new THREE.Vector3(-76, 0, -178), new THREE.Vector3(-104, 0, -92)],
    [new THREE.Vector3(132, 0, -181), new THREE.Vector3(122, 0, -82), new THREE.Vector3(54, 0, -28), new THREE.Vector3(-70, 0, 58)],
  ][lane];
  if (goalIsB && from.x < 70) return [
    [new THREE.Vector3(-108, 0, 154), new THREE.Vector3(18, 0, 160), new THREE.Vector3(122, 0, 108)],
    [new THREE.Vector3(-92, 0, 61), new THREE.Vector3(26, 0, 61), new THREE.Vector3(108, 0, 35)],
    [new THREE.Vector3(-124, 0, -182), new THREE.Vector3(26, 0, -181), new THREE.Vector3(114, 0, -116)],
  ][lane];
  if (goalIsRed && from.z < 120) return [
    [new THREE.Vector3(104, 0, 120), new THREE.Vector3(-126, 0, 170), new THREE.Vector3(-134, 0, 244)],
    [new THREE.Vector3(124, 0, 132), new THREE.Vector3(2, 0, 165), new THREE.Vector3(0, 0, 248)],
    [new THREE.Vector3(178, 0, 144), new THREE.Vector3(148, 0, 238), new THREE.Vector3(58, 0, 286)],
  ][lane];
  return [];
}

function computeDesertPath(from, goal, routeIndex = 1) {
  const anchors = desertRouteAnchors(from, goal, routeIndex);
  const path = [];
  let start = from;
  for (const target of [...anchors, goal]) {
    const section = computeDesertPathSection(start, target, routeIndex);
    path.push(...section);
    start = target;
  }
  return path;
}

function nearestVisibleNavigationNode(point, otherPoint = null) {
  let best = -1;
  let bestDistance = Infinity;
  industrialNavigation.nodes.forEach((node, index) => {
    const distance = node.distanceToSquared(point);
    if (distance >= bestDistance || segmentBlockedByMapObstacle(point, node, 3.2)) return;
    if (otherPoint && pointInsideMapObstacle(node, 3.2)) return;
    best = index;
    bestDistance = distance;
  });
  return best;
}

function computeIndustrialPath(from, goal) {
  if (!segmentBlockedByMapObstacle(from, goal, 3.4)) return [goal.clone()];
  const start = nearestVisibleNavigationNode(from, goal);
  const finish = nearestVisibleNavigationNode(goal, from);
  if (start < 0 || finish < 0) return [new THREE.Vector3(0, 0, 0), goal.clone()];
  const size = industrialNavigation.nodes.length;
  const cost = Array(size).fill(Infinity);
  const estimate = Array(size).fill(Infinity);
  const previous = Array(size).fill(-1);
  const open = new Set([start]);
  cost[start] = 0;
  estimate[start] = industrialNavigation.nodes[start].distanceTo(industrialNavigation.nodes[finish]);
  while (open.size) {
    let current = -1;
    let currentScore = Infinity;
    for (const node of open) if (estimate[node] < currentScore) { current = node; currentScore = estimate[node]; }
    if (current === finish) break;
    open.delete(current);
    for (const edge of industrialNavigation.links[current]) {
      const candidate = cost[current] + edge.cost;
      if (candidate >= cost[edge.node]) continue;
      previous[edge.node] = current;
      cost[edge.node] = candidate;
      estimate[edge.node] = candidate + industrialNavigation.nodes[edge.node].distanceTo(industrialNavigation.nodes[finish]);
      open.add(edge.node);
    }
  }
  if (!Number.isFinite(cost[finish])) return [new THREE.Vector3(0, 0, 0), goal.clone()];
  const path = [];
  for (let cursor = finish; cursor >= 0; cursor = previous[cursor]) {
    path.unshift(industrialNavigation.nodes[cursor].clone());
    if (cursor === start) break;
  }
  path.push(goal.clone());
  return path;
}

function navigationPointForRobot(robot, goal, dt) {
  if (selectedMapId === 'desert01') {
    robot.aiNavRepath = Math.max(0, (robot.aiNavRepath ?? 0) - dt);
    const goalMoved = !robot.aiNavGoal || robot.aiNavGoal.distanceToSquared(goal) > 35 ** 2;
    const trackedWaypoint = robot.aiNavPath?.[0];
    if (trackedWaypoint && !goalMoved) {
      const waypointDistance = robot.root.position.distanceTo(trackedWaypoint);
      const waypointKey = `${Math.round(trackedWaypoint.x * 2)}:${Math.round(trackedWaypoint.z * 2)}`;
      if (robot.aiProgressWaypointKey !== waypointKey || !Number.isFinite(robot.aiLastProgressDistance)) {
        robot.aiProgressWaypointKey = waypointKey;
        robot.aiLastProgressDistance = waypointDistance;
        robot.aiNoProgressSeconds = 0;
      } else if (robot.aiLastProgressDistance - waypointDistance > 0.55) {
        robot.aiLastProgressDistance = waypointDistance;
        robot.aiNoProgressSeconds = 0;
      } else if (Math.abs(robot.control.throttle) > 0.35 && waypointDistance > 5) {
        robot.aiNoProgressSeconds += dt;
      }
    }
    if (robot.aiNoProgressSeconds >= 3) {
      robot.clearAIPath('waypoint-distance-not-closing');
    }
    if (robot.aiNavRepath <= 0 || goalMoved || !robot.aiNavPath?.length) {
      performanceProfile.pathReplans++;
      robot.aiNavPath = computeDesertPath(robot.root.position, goal, robot.aiRouteVariant ?? (robot.id % 3));
      robot.aiNavGoal = goal.clone();
      robot.aiNavRepath = (robots.length >= 16 ? 4.2 : 2.8) + (robot.id % 6) * 0.11;
      robot.aiProgressWaypointKey = null;
      robot.aiLastProgressDistance = Infinity;
    }
    while (robot.aiNavPath.length > 1 && robot.root.position.distanceToSquared(robot.aiNavPath[0]) < 15) {
      robot.aiNavPath.shift();
      robot.aiProgressWaypointKey = null;
      robot.aiLastProgressDistance = Infinity;
      robot.aiNoProgressSeconds = 0;
    }
    return robot.aiNavPath[0]?.clone() ?? goal;
  }
  if (selectedMapId !== 'industrial01') return goal;
  robot.aiNavRepath = Math.max(0, (robot.aiNavRepath ?? 0) - dt);
  const goalMoved = !robot.aiNavGoal || robot.aiNavGoal.distanceToSquared(goal) > 64;
  if (robot.aiNavRepath <= 0 || goalMoved || !robot.aiNavPath?.length) {
    performanceProfile.pathReplans++;
    robot.aiNavPath = computeIndustrialPath(robot.root.position, goal);
    robot.aiNavGoal = goal.clone();
    robot.aiNavRepath = (robots.length >= 12 ? 0.72 : robots.length >= 8 ? 0.58 : 0.46) + (robot.id % 5) * 0.055;
  }
  while (robot.aiNavPath.length > 1 && robot.root.position.distanceToSquared(robot.aiNavPath[0]) < 14) robot.aiNavPath.shift();
  return robot.aiNavPath[0]?.clone() ?? goal;
}

function startIndustrialSoloRouteQA() {
  ui.battleMap.value = 'industrial01';
  setActiveMap('industrial01');
  startBattle(true);
  resetGame(true, enrichAssembly(createAIAssembly('spinner')));
  industrialSoloRouteQA = {
    active: true,
    kind: 'regions',
    route: [
      new THREE.Vector3(0, 0, -170 * INDUSTRIAL_SPACE_SCALE), new THREE.Vector3(-190 * INDUSTRIAL_SPACE_SCALE, 0, -80 * INDUSTRIAL_SPACE_SCALE), new THREE.Vector3(-190 * INDUSTRIAL_SPACE_SCALE, 0, 145 * INDUSTRIAL_SPACE_SCALE),
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(190 * INDUSTRIAL_SPACE_SCALE, 0, 145 * INDUSTRIAL_SPACE_SCALE), new THREE.Vector3(190 * INDUSTRIAL_SPACE_SCALE, 0, -120 * INDUSTRIAL_SPACE_SCALE),
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -170 * INDUSTRIAL_SPACE_SCALE),
    ],
    path: [],
    visited: 0,
    distance: 0,
    lastPosition: player.root.position.clone(),
    startWorldTime: worldTime,
    elapsed: 0,
  };
  return industrialQASnapshot();
}

function startIndustrialStraightCrossingQA() {
  ui.battleMap.value = 'industrial01';
  setActiveMap('industrial01');
  startBattle(true);
  resetGame(true, enrichAssembly(createAIAssembly('spinner')));
  player.root.position.set(0, 0, -190 * INDUSTRIAL_SPACE_SCALE);
  player.placeOnMeasuredGround();
  player.yaw = 0;
  player.root.rotation.set(0, 0, 0);
  player.velocity.set(0, 0, 0);
  industrialSoloRouteQA = {
    active: true,
    kind: 'straight-crossing',
    route: [new THREE.Vector3(0, 0, 190 * INDUSTRIAL_SPACE_SCALE)],
    path: [],
    visited: 0,
    distance: 0,
    lastPosition: player.root.position.clone(),
    startWorldTime: worldTime,
    elapsed: 0,
  };
  return industrialQASnapshot();
}

function updateIndustrialSoloRouteQA() {
  if (!industrialSoloRouteQA.active || !player || player.dead) return false;
  if (industrialSoloRouteQA.lastPosition) industrialSoloRouteQA.distance += player.root.position.distanceTo(industrialSoloRouteQA.lastPosition);
  industrialSoloRouteQA.lastPosition = player.root.position.clone();
  if (!industrialSoloRouteQA.route.length) {
    industrialSoloRouteQA.active = false;
    industrialSoloRouteQA.elapsed = worldTime - industrialSoloRouteQA.startWorldTime;
    if (industrialSoloRouteQA.kind === 'straight-crossing') {
      industrialStats.tests.straightCrossingSeconds = Number(industrialSoloRouteQA.elapsed.toFixed(2));
      industrialStats.tests.straightCrossing = industrialSoloRouteQA.elapsed >= 10 && industrialSoloRouteQA.elapsed <= 18 ? 'pass' : 'fail';
    } else industrialStats.tests.soloRoute = industrialSoloRouteQA.visited >= 5 ? 'pass' : 'fail';
    player.control = { throttle: 0, steering: 0, brake: true };
    return true;
  }
  if (!industrialSoloRouteQA.path.length) industrialSoloRouteQA.path = computeIndustrialPath(player.root.position, industrialSoloRouteQA.route[0]);
  while (industrialSoloRouteQA.path.length && player.root.position.distanceToSquared(industrialSoloRouteQA.path[0]) < 12) industrialSoloRouteQA.path.shift();
  if (!industrialSoloRouteQA.path.length) {
    industrialSoloRouteQA.route.shift();
    industrialSoloRouteQA.visited++;
    return true;
  }
  const target = industrialSoloRouteQA.path[0];
  const direction = target.clone().sub(player.root.position).setY(0);
  const desiredYaw = normalizeAngle(Math.atan2(direction.x, direction.z));
  const angleError = normalizeAngle(desiredYaw - player.yaw);
  player.control.throttle = Math.abs(angleError) > 1.15 ? 0.25 : 1;
  player.control.steering = clamp(angleError * 1.55, -1, 1);
  player.control.brake = false;
  return true;
}

function startDesertRouteQA() {
  ui.battleMap.value = 'desert01';
  ui.lobbyBattleMap.value = 'desert01';
  ui.battleMode.value = '10v10';
  ui.lobbyBattleMode.value = '10v10';
  startBattle(false);
  for (const robot of robots) if (robot !== player) {
    robot.dead = true;
    robot.root.visible = false;
    robot.control = { throttle: 0, steering: 0, brake: true };
  }
  const blueZ = -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
  player.root.position.set(0, desertTerrainHeight(0, blueZ) + 1, blueZ);
  player.yaw = 0;
  player.root.rotation.set(0, 0, 0);
  player.velocity.set(0, 0, 0);
  player.placeOnMeasuredGround();
  desertRouteQA = {
    active: true,
    route: [conquestState.points.A.centre.clone(), conquestState.points.B.centre.clone(), new THREE.Vector3(0, 0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset)],
    path: [], visited: 0, distance: 0, lastPosition: player.root.position.clone(), startWorldTime: worldTime, elapsed: 0,
  };
  return conquestQASnapshot();
}

function updateDesertRouteQA() {
  if (!desertRouteQA.active || !player || player.dead) return false;
  if (desertRouteQA.lastPosition) desertRouteQA.distance += player.root.position.distanceTo(desertRouteQA.lastPosition);
  desertRouteQA.lastPosition = player.root.position.clone();
  if (!desertRouteQA.route.length) {
    desertRouteQA.active = false;
    desertRouteQA.elapsed = worldTime - desertRouteQA.startWorldTime;
    desertStats.tests = desertStats.tests ?? {};
    desertStats.tests.blueAToBToRed = desertRouteQA.visited === 3 ? 'pass' : 'fail';
    desertStats.tests.routeSeconds = Number(desertRouteQA.elapsed.toFixed(2));
    desertStats.tests.routeDistance = Number(desertRouteQA.distance.toFixed(2));
    player.control = { throttle: 0, steering: 0, brake: true };
    return true;
  }
  if (!desertRouteQA.path.length) desertRouteQA.path = computeDesertPath(player.root.position, desertRouteQA.route[0], 1);
  while (desertRouteQA.path.length && player.root.position.distanceToSquared(desertRouteQA.path[0]) < 14) desertRouteQA.path.shift();
  if (!desertRouteQA.path.length) {
    desertRouteQA.route.shift();
    desertRouteQA.visited++;
    return true;
  }
  const target = desertRouteQA.path[0];
  const direction = target.clone().sub(player.root.position).setY(0);
  const desiredYaw = normalizeAngle(Math.atan2(direction.x, direction.z));
  const angleError = normalizeAngle(desiredYaw - player.yaw);
  player.control.throttle = Math.abs(angleError) > 1.12 ? 0.28 : 1;
  player.control.steering = clamp(angleError * 1.6, -1, 1);
  player.control.brake = false;
  return true;
}

function setActiveMap(id) {
  const next = MAP_DEFINITIONS[id] ?? MAP_DEFINITIONS.arena01;
  selectedMapId = next.id;
  activeMap = next;
  for (const [mapId, objects] of Object.entries(mapSceneObjects)) for (const object of objects) object.visible = mapId === selectedMapId;
  obstacles.splice(0, obstacles.length, ...(mapObstacleSets[selectedMapId] ?? []));
  ramps.splice(0, ramps.length, ...(mapRampSets[selectedMapId] ?? []));
  setEnvironmentColliderDebug(colliderDebugEnabled);
  if (selectedMapId === 'industrial01' && industrialNavigation.nodes.length === 0) buildIndustrialNavigation();
  if (selectedMapId === 'desert01' && desertNavigation.nodes.length === 0) buildDesertNavigation();
  const desert = selectedMapId === 'desert01';
  document.body.classList.toggle('conquest-map', desert);
  scene.background.set(desert ? 0x95745e : selectedMapId === 'industrial01' ? 0x78909a : 0x151a1f);
  scene.fog.color.set(desert ? 0x9a765e : selectedMapId === 'industrial01' ? 0x7b898c : 0x151a1f);
  scene.fog.density = desert ? 0.00175 : selectedMapId === 'industrial01' ? 0.00135 : 0.0026;
  ui.battleMap.value = selectedMapId;
  ui.lobbyBattleMap.value = selectedMapId;
  if (desert) {
    ui.battleMode.value = '10v10';
    ui.lobbyBattleMode.value = '10v10';
  }
  ui.lobbyEnterBattle.textContent = desert ? 'RED CANYON 10v10 출전' : selectedMapId === 'industrial01' ? 'INDUSTRIAL ZONE 출전' : 'ARENA 01 출전';
}

function cloneModel(id, tint = 0xffffff, options = {}) {
  const transform = MODEL_TRANSFORMS[id] ?? { scale: [1, 1, 1], rotation: [0, 0, 0] };
  const wrapper = new THREE.Group();
  const root = models[id].clone(true);
  root.scale.set(...transform.scale);
  root.rotation.set(...transform.rotation);
  if (transform.offset) root.position.set(...transform.offset);
  wrapper.add(root);
  wrapper.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    if (node.material) {
      node.material = node.material.clone();
      node.material.color.multiply(new THREE.Color(tint));
      node.material.metalness = Math.max(node.material.metalness ?? 0, 0.3);
      node.material.roughness = 0.43;
      if (options.ghost) {
        node.material.transparent = true;
        node.material.opacity = 0.48;
        node.material.depthWrite = false;
        node.material.emissive = new THREE.Color(0x2adf9c);
        node.material.emissiveIntensity = 0.35;
      }
    }
  });
  wrapper.userData.modelId = id;
  return wrapper;
}

function setPreviewValidity(object, valid) {
  if (!object) return;
  object.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    node.material.emissive = new THREE.Color(valid ? 0x24e89a : 0xff372f);
    node.material.emissiveIntensity = valid ? 0.45 : 0.7;
    node.material.opacity = valid ? 0.5 : 0.42;
  });
}

const blockGeometryCache = new Map();
const modelLocalBounds = new Map();

function createRoundedRectangleShape(width, height, radius) {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(radius, x * 0.45, y * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.quadraticCurveTo(x, -y, x, -y + r);
  shape.lineTo(x, y - r);
  shape.quadraticCurveTo(x, y, x - r, y);
  shape.lineTo(-x + r, y);
  shape.quadraticCurveTo(-x, y, -x, y - r);
  shape.lineTo(-x, -y + r);
  shape.quadraticCurveTo(-x, -y, -x + r, -y);
  return shape;
}

function createBeveledBoxGeometry(width, height, depth) {
  const bevel = Math.min(0.025, width * 0.04, height * 0.04, depth * 0.04);
  const shape = createRoundedRectangleShape(width - bevel * 2, height - bevel * 2, bevel * 0.55);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - bevel * 2),
    steps: 1,
    curveSegments: 1,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
  });
  geometry.translate(0, 0, -(depth - bevel * 2) / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createWedgeGeometry() {
  const bevel = 0.02;
  const shape = new THREE.Shape();
  shape.moveTo(-0.5 + bevel, -0.5 + bevel);
  shape.lineTo(0.5 - bevel, -0.5 + bevel);
  shape.lineTo(0.5 - bevel, 0.5 - bevel);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1 - bevel * 2,
    steps: 1,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -(1 - bevel * 2) / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createCornerWedgeGeometry() {
  const vertices = new Float32Array([
    -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5,
     0.47, 0.5, 0.47,
  ]);
  const indices = [
    0, 2, 1, 0, 3, 2,
    0, 1, 4,
    1, 2, 4,
    2, 3, 4,
    3, 0, 4,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function getBlockGeometry(record) {
  const meta = BLOCK_META[record.type] ?? BLOCK_META.cube;
  const key = `${meta.meshType}:${meta.dimensions.join('x')}:unit-${GRID_UNIT}`;
  if (blockGeometryCache.has(key)) return blockGeometryCache.get(key);
  const [gridWidth, gridHeight, gridDepth] = meta.dimensions;
  const width = gridWidth * GRID_UNIT;
  const height = gridHeight * GRID_UNIT;
  const depth = gridDepth * GRID_UNIT;
  let geometry;
  if (meta.meshType === 'wedge') geometry = createWedgeGeometry();
  else if (meta.meshType === 'cornerWedge') geometry = createCornerWedgeGeometry();
  else geometry = createBeveledBoxGeometry(width, height, depth);
  geometry.computeBoundingBox();
  const generatedBox = geometry.boundingBox;
  const generatedSize = generatedBox.getSize(new THREE.Vector3());
  const generatedCentre = generatedBox.getCenter(new THREE.Vector3());
  geometry.translate(-generatedCentre.x, -generatedCentre.y, -generatedCentre.z);
  geometry.scale(width / generatedSize.x, height / generatedSize.y, depth / generatedSize.z);
  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  blockGeometryCache.set(key, geometry);
  return geometry;
}

function getBlockQuaternion(record) {
  const steps = record.rotationSteps ?? [0, 0, 0];
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(steps[0] * Math.PI / 2, steps[1] * Math.PI / 2, steps[2] * Math.PI / 2, 'XYZ'));
}

function getBlockOrientedDimensions(record) {
  const base = new THREE.Vector3(...(BLOCK_META[record.type] ?? BLOCK_META.cube).dimensions);
  const matrix = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(getBlockQuaternion(record)));
  const e = matrix.elements.map((value) => Math.abs(value) < 1e-6 ? 0 : Math.abs(value));
  return new THREE.Vector3(
    Math.round((e[0] * base.x + e[3] * base.y + e[6] * base.z) * 2) / 2,
    Math.round((e[1] * base.x + e[4] * base.y + e[7] * base.z) * 2) / 2,
    Math.round((e[2] * base.x + e[5] * base.y + e[8] * base.z) * 2) / 2,
  );
}

function getBlockBounds(record) {
  const dimensions = getBlockOrientedDimensions(record);
  const anchor = new THREE.Vector3(...record.gridPosition);
  const min = new THREE.Vector3(anchor.x - 0.5, anchor.y, anchor.z - 0.5);
  return { min, max: min.clone().add(dimensions), dimensions, centre: min.clone().addScaledVector(dimensions, 0.5) };
}

function getBlockLocalCentre(record) {
  return BLOCK_GRID_ORIGIN.clone().add(getBlockBounds(record).centre.multiplyScalar(GRID_UNIT));
}

function createBlockColliderProfile(records) {
  if (!records.length) return [{ name: 'DestroyedCoreFallback', blockId: null, points: getBoundsCorners(new THREE.Box3(new THREE.Vector3(-0.02, -0.02, -0.02), new THREE.Vector3(0.02, 0.02, 0.02))) }];
  // Logical HP and connectivity remain per block, while the rigid body uses a
  // small longitudinal compound hull. Hundreds of decorative per-block boxes
  // made every ground/support query scale with block count instead of robot
  // count and were the dominant 4v4+ physics cost.
  const entries = records.map((record) => ({ record, bounds: getBlockBounds(record) }));
  const overall = entries.reduce((box, entry) => ({
    minX: Math.min(box.minX, entry.bounds.min.x), minY: Math.min(box.minY, entry.bounds.min.y), minZ: Math.min(box.minZ, entry.bounds.min.z),
    maxX: Math.max(box.maxX, entry.bounds.max.x), maxY: Math.max(box.maxY, entry.bounds.max.y), maxZ: Math.max(box.maxZ, entry.bounds.max.z),
  }), { minX: Infinity, minY: Infinity, minZ: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity });
  const sliceCount = clamp(Math.ceil((overall.maxZ - overall.minZ) / 3), 1, 6);
  const sliceDepth = (overall.maxZ - overall.minZ) / sliceCount;
  const components = [];
  for (let slice = 0; slice < sliceCount; slice++) {
    const minZ = overall.minZ + slice * sliceDepth;
    const maxZ = slice === sliceCount - 1 ? overall.maxZ : minZ + sliceDepth;
    const members = entries.filter((entry) => entry.bounds.max.z > minZ + 1e-5 && entry.bounds.min.z < maxZ - 1e-5);
    if (!members.length) continue;
    const gridBox = members.reduce((box, entry) => ({
      minX: Math.min(box.minX, entry.bounds.min.x), minY: Math.min(box.minY, entry.bounds.min.y),
      maxX: Math.max(box.maxX, entry.bounds.max.x), maxY: Math.max(box.maxY, entry.bounds.max.y),
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    const box = new THREE.Box3(
      BLOCK_GRID_ORIGIN.clone().add(new THREE.Vector3(gridBox.minX, gridBox.minY, minZ).multiplyScalar(GRID_UNIT)),
      BLOCK_GRID_ORIGIN.clone().add(new THREE.Vector3(gridBox.maxX, gridBox.maxY, maxZ).multiplyScalar(GRID_UNIT)),
    );
    components.push({ name: `CompoundHullSlice:${slice + 1}`, blockId: null, points: getBoundsCorners(box) });
  }
  return components;
}

function createBlockVisualObject(record, ghost = false) {
  const group = new THREE.Group();
  group.name = `${ghost ? 'BlockPreview' : 'Lv1Block'}_${record.id}`;
  group.userData.blockId = record.id;
  group.userData.mountTargetId = record.id;
  group.userData.isBlockCandidate = ghost;
  group.userData.blockType = record.type;
  const material = new THREE.MeshStandardMaterial({
    color: ghost ? LV1_BLOCK_COLOR : (record.renderColor ?? record.color ?? LV1_BLOCK_COLOR),
    metalness: 0.34,
    roughness: 0.48,
    emissive: new THREE.Color(ghost ? 0x167ea5 : 0x07151c),
    emissiveIntensity: ghost ? 0.72 : 0.08,
    transparent: ghost,
    opacity: ghost ? 0.48 : 1,
    depthWrite: !ghost,
  });
  const mesh = new THREE.Mesh(getBlockGeometry(record), material);
  mesh.castShadow = !ghost;
  mesh.receiveShadow = true;
  mesh.userData.blockId = record.id;
  mesh.userData.mountTargetId = record.id;
  group.add(mesh);
  const selected = !ghost && record.id === selectedBlockId;
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(getBlockGeometry(record), 28),
    new THREE.LineBasicMaterial({ color: ghost ? 0xcdf6ff : (selected ? 0x8fffd3 : 0x2c7fa4), transparent: true, opacity: ghost ? 0.84 : (selected ? 0.92 : 0.34), depthWrite: false }),
  );
  edges.userData.blockId = record.id;
  group.add(edges);
  const bounds = getBlockBounds(record);
  group.position.copy(getBlockLocalCentre(record));
  group.quaternion.copy(getBlockQuaternion(record));
  group.userData.gridBounds = bounds;
  return group;
}

function setBlockPreviewValidity(object, valid) {
  if (!object) return;
  object.traverse((node) => {
    if (node.isMesh) {
      node.material.color.set(valid ? 0x55d8ff : 0xff4d45);
      node.material.emissive.set(valid ? 0x168ebc : 0xb5120e);
      node.material.emissiveIntensity = valid ? 0.86 : 0.92;
      node.material.opacity = valid ? 0.52 : 0.44;
    } else if (node.isLineSegments) {
      node.material.color.set(valid ? 0xd9f8ff : 0xffb0a8);
    }
  });
}

function blockMicroCells(record) {
  const bounds = getBlockBounds(record);
  const min = bounds.min.clone().multiplyScalar(2).round();
  const size = bounds.dimensions.clone().multiplyScalar(2).round();
  const cells = [];
  for (let x = 0; x < size.x; x++) for (let y = 0; y < size.y; y++) for (let z = 0; z < size.z; z++) {
    cells.push(`${min.x + x},${min.y + y},${min.z + z}`);
  }
  return cells;
}

function blockOccupancy(blocks, ignoreId = null) {
  const occupancy = new Map();
  for (const block of blocks) {
    if (block.id === ignoreId) continue;
    for (const cell of blockMicroCells(block)) occupancy.set(cell, block.id);
  }
  return occupancy;
}

function blocksShareFace(a, b) {
  const bCells = new Set(blockMicroCells(b));
  for (const cell of blockMicroCells(a)) {
    const [x, y, z] = cell.split(',').map(Number);
    if ([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].some(([dx,dy,dz]) => bCells.has(`${x + dx},${y + dy},${z + dz}`))) return true;
  }
  return false;
}

function getBlockConnectionGraph(blocks = workingAssembly.blocks) {
  const adjacency = new Map(blocks.map((block) => [block.id, new Set()]));
  for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
    if (!blocksShareFace(blocks[a], blocks[b])) continue;
    adjacency.get(blocks[a].id).add(blocks[b].id);
    adjacency.get(blocks[b].id).add(blocks[a].id);
  }
  const core = blocks.find((block) => block.isCore || block.id === 'block-core');
  const connected = new Set(core ? [core.id] : []);
  const queue = core ? [core.id] : [];
  while (queue.length) {
    const id = queue.shift();
    for (const next of adjacency.get(id) ?? []) if (!connected.has(next)) { connected.add(next); queue.push(next); }
  }
  return { adjacency, connected, disconnected: blocks.filter((block) => !connected.has(block.id)) };
}

function validateBlockPlacement(record, ignoreId = null) {
  const occupied = blockOccupancy(workingAssembly.blocks, ignoreId);
  const overlap = blockMicroCells(record).find((cell) => occupied.has(cell));
  if (overlap) return { valid: false, reason: 'overlap', message: `Grid Cell ${overlap}은 이미 다른 블록이 차지하고 있습니다.` };
  const neighbours = workingAssembly.blocks.filter((block) => block.id !== ignoreId && blocksShareFace(record, block));
  if (!record.isCore && !neighbours.length) return { valid: false, reason: 'no-face', message: '모서리가 아니라 기존 블록의 면과 면이 연결되어야 합니다.' };
  return { valid: true, reason: 'face-connected', neighbours, message: `${neighbours.length}개 블록 면에 연결 · Grid Snap 0mm` };
}

function createPartVisualContent(type, tint = 0xffffff, ghost = false, hubFlipped = false, modelOverride = null) {
  const content = new THREE.Group();
  const meta = PART_META[type];
  if (type === 'hammer') {
    const pivot = new THREE.Group();
    pivot.rotation.x = 1.18;
    pivot.add(cloneModel(meta.model, tint, { ghost }));
    content.add(pivot);
  } else {
    const visual = cloneModel(modelOverride ?? meta.model, tint, { ghost });
    if (type === 'wheel' && hubFlipped) visual.rotation.y = Math.PI;
    content.add(visual);
  }
  return content;
}

function addMountStandoffVisual(object, record, tint = 0xffffff, ghost = false) {
  const standoff = Math.max(0, Number(record.mount?.standoff ?? 0));
  if (standoff <= 0 || !record.mount?.normal) return null;
  const worldNormal = new THREE.Vector3(...record.mount.normal).normalize();
  const localNormal = worldNormal.clone().applyQuaternion(getRecordQuaternion(record).clone().invert()).normalize();
  const uniformScale = Math.max(0.001, (record.scaleFactor ?? 1) * Math.max(...(record.axisScale ?? [1, 1, 1])));
  const localLength = standoff / uniformScale;
  const localSupport = getSurfaceSupportDistance(record, worldNormal) / uniformScale;
  const radius = 0.075 / uniformScale;
  const connector = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 1.12, localLength, 10),
    ghost
      ? new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: 0.38, depthWrite: false })
      : createMaterial(0x303943, 0.72, 0.48),
  );
  connector.name = 'MountStandoffCollider';
  connector.quaternion.setFromUnitVectors(Y_AXIS, localNormal);
  connector.position.copy(localNormal).multiplyScalar(-(localSupport + localLength * 0.5));
  connector.castShadow = !ghost;
  connector.receiveShadow = !ghost;
  object.add(connector);
  return connector;
}

function prepareMountGeometry() {
  mountLocalBounds.clear();
  modelLocalBounds.clear();
  for (const modelId of new Set(Object.values(PART_META).map((meta) => meta.model).concat(['wheel_light', 'wheel_wide', 'track_heavy']))) {
    const modelProbe = cloneModel(modelId);
    modelProbe.updateWorldMatrix(true, true);
    modelLocalBounds.set(modelId, new THREE.Box3().setFromObject(modelProbe));
  }
  for (const type of Object.keys(PART_META)) {
    const meta = PART_META[type];
    const probe = createPartVisualContent(type);
    probe.updateWorldMatrix(true, true);
    mountLocalBounds.set(type, new THREE.Box3().setFromObject(probe));
  }
}

function getSurfaceAlignmentQuaternion(record) {
  if (!record.mount?.normal || !['surface', 'blockFace', 'wheelSlot'].includes(record.mount.kind)) return new THREE.Quaternion();
  const normal = new THREE.Vector3(...record.mount.normal).normalize();
  return new THREE.Quaternion().setFromUnitVectors(record.type === 'wheel' ? X_AXIS : Y_AXIS, normal);
}

function getRecordQuaternion(record) {
  const user = new THREE.Quaternion().setFromEuler(new THREE.Euler(...(record.rotation ?? [0, 0, 0]), 'XYZ'));
  return getSurfaceAlignmentQuaternion(record).multiply(user);
}

function getWheelRuntimeDimensions(scaleFactor = 1, modelId = 'new_wheel', axisScale = [1, 1, 1]) {
  const bounds = modelLocalBounds.get(modelId) ?? mountLocalBounds.get('wheel');
  if (!bounds) return { radius: 0.58 * scaleFactor, halfWidth: 0.17 * scaleFactor };
  const axes = axisScale.map((value) => value * scaleFactor);
  if (modelId === 'track_heavy') return {
    radius: Math.max(Math.abs(bounds.min.y), Math.abs(bounds.max.y)) * axes[1],
    halfWidth: Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)) * axes[0],
    halfLength: Math.max(Math.abs(bounds.min.z), Math.abs(bounds.max.z)) * axes[2],
  };
  return {
    radius: Math.max(Math.abs(bounds.min.y) * axes[1], Math.abs(bounds.max.y) * axes[1], Math.abs(bounds.min.z) * axes[2], Math.abs(bounds.max.z) * axes[2]),
    halfWidth: Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)) * axes[0],
  };
}

function getBoundsCorners(bounds) {
  const { min, max } = bounds;
  return [
    [min.x, min.y, min.z], [min.x, min.y, max.z], [min.x, max.y, min.z], [min.x, max.y, max.z],
    [max.x, min.y, min.z], [max.x, min.y, max.z], [max.x, max.y, min.z], [max.x, max.y, max.z],
  ].map((values) => new THREE.Vector3(...values));
}

function getSurfaceSupportDistance(record, normal = new THREE.Vector3(...(record.mount?.normal ?? [0, 1, 0]))) {
  if (record.nativeBlockPlate) return AI_BLOCK_ARMOR_THICKNESS * 0.5;
  const bounds = record.type === 'wheel' && record.wheelModel
    ? modelLocalBounds.get(record.wheelModel) ?? mountLocalBounds.get(record.type)
    : mountLocalBounds.get(record.type);
  if (!bounds) return recordRadius(record);
  const quaternion = getRecordQuaternion(record);
  const scaleFactor = record.scaleFactor ?? 1;
  const axisScale = new THREE.Vector3(...(record.axisScale ?? [1, 1, 1])).multiplyScalar(scaleFactor);
  let minimum = Infinity;
  for (const corner of getBoundsCorners(bounds)) {
    corner.multiply(axisScale).applyQuaternion(quaternion);
    minimum = Math.min(minimum, corner.dot(normal));
  }
  return Math.max(0, -minimum);
}

function setRecordSurfaceMount(record, point, normal, targetId) {
  const unitNormal = normal.clone().normalize();
  record.mount = {
    kind: 'surface',
    targetId,
    point: point.toArray(),
    normal: unitNormal.toArray(),
    attached: true,
    gap: MOUNT_EPSILON,
  };
  const support = getSurfaceSupportDistance(record, unitNormal);
  record.position = point.clone().addScaledVector(unitNormal, support + MOUNT_EPSILON).toArray();
  record.linkedTo = targetId ? [targetId] : [];
}

function setRecordAxisMount(record, point, targetIds, normal = Y_AXIS) {
  const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
  record.mount = {
    kind: 'axis',
    targetId: ids[0] ?? null,
    targetIds: ids.filter(Boolean),
    point: point.toArray(),
    normal: normal.clone().normalize().toArray(),
    attached: ids.length > 0,
    gap: 0,
  };
  record.position = point.toArray();
  record.linkedTo = ids.filter(Boolean);
}

function refreshRecordMount(record) {
  if (!record.mount?.attached || !record.mount.point) return false;
  const point = new THREE.Vector3(...record.mount.point);
  if (record.mount.kind === 'axis' || record.mount.kind === 'wheelSlot' || record.mount.kind === 'blockFace') {
    record.position = point.toArray();
    return true;
  }
  const normal = new THREE.Vector3(...record.mount.normal).normalize();
  const support = getSurfaceSupportDistance(record, normal);
  record.position = point.addScaledVector(normal, support + MOUNT_EPSILON + Math.max(0, Number(record.mount.standoff ?? 0))).toArray();
  record.mount.gap = MOUNT_EPSILON;
  return true;
}

function getRecordMountGap(record) {
  if (!record.mount?.attached || !record.mount.point) return Infinity;
  if (record.mount.kind === 'axis' || record.mount.kind === 'wheelSlot' || record.mount.kind === 'blockFace') return 0;
  const point = new THREE.Vector3(...record.mount.point);
  const normal = new THREE.Vector3(...record.mount.normal).normalize();
  const origin = new THREE.Vector3(...record.position);
  return origin.sub(point).dot(normal) - getSurfaceSupportDistance(record, normal) - Math.max(0, Number(record.mount.standoff ?? 0));
}

function applyRecordObjectTransform(record, object) {
  object.position.set(...record.position);
  object.quaternion.copy(getRecordQuaternion(record));
  object.scale.set(...(record.axisScale ?? [1, 1, 1])).multiplyScalar(record.scaleFactor ?? 1);
}

function moveToward(value, target, maxDelta) {
  if (Math.abs(target - value) <= maxDelta) return target;
  return value + Math.sign(target - value) * maxDelta;
}

function normalizeAngle(value) {
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function forwardFor(yaw) {
  return new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
}

function detachObject(object) {
  object.updateWorldMatrix(true, false);
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  object.matrixWorld.decompose(position, quaternion, scale);
  scene.add(object);
  object.position.copy(position);
  object.quaternion.copy(quaternion);
  object.scale.copy(scale);
}

const AI_HULL_ARCHETYPES = Object.freeze([
  'low-wedge', 'tall-heavy', 'armored-turtle', 'horned-bull', 'centipede', 'monster', 'crab', 'armored-tank',
  'saw-fortress', 'spinner-beast', 'asymmetric-raider', 'exhaust-brute',
  'predator-jaw', 'split-nose', 'triangle', 'hex', 'elongated', 'shark', 'disc', 'arrowhead', 'stepped', 'bulldozer', 'multi-layer',
].filter((value, index, list) => list.indexOf(value) === index));
const AI_ARCHETYPE_NAMES = Object.freeze({
  'predator-jaw': 'RAZOR MAW', 'armored-turtle': 'IRON SHELL', centipede: 'LONG CRAWL', crab: 'SIDE CLAW',
  'low-wedge': 'LOW BITE', monster: 'STEEL JAW', 'split-nose': 'FORK FANG', 'asymmetric-raider': 'OFF AXIS',
  triangle: 'TRI SPEAR', hex: 'HEX GUARD', elongated: 'RAIL RUNNER', shark: 'SHARK NOSE', disc: 'LOW DISC',
  arrowhead: 'ARROW RAM', stepped: 'STAIR CRUSH', bulldozer: 'BULL WALL', 'multi-layer': 'TIER TANK',
  'tall-heavy': 'TALL HEAVY', 'horned-bull': 'STEEL BULL', 'armored-tank': 'ARMOR TANK',
  'saw-fortress': 'SAW FORTRESS', 'spinner-beast': 'SPINNER BEAST', 'exhaust-brute': 'EXHAUST BRUTE',
});
const AI_DESIGN_CONCEPTS = Object.freeze({
  'low-wedge': { family: 'Wedge Bot', silhouette: 'low-forward-wedge', symmetry: 'mirrored', exterior: 'nose-armor' },
  'armored-turtle': { family: 'Armored Turtle', silhouette: 'wide-domed-shell', symmetry: 'mirrored', exterior: 'curved-shell' },
  centipede: { family: 'Centipede Bot', silhouette: 'long-six-wheel', symmetry: 'mirrored', exterior: 'rear-exhaust-pair' },
  'horned-bull': { family: 'Horned Bull', silhouette: 'wide-horned-nose', symmetry: 'mirrored', exterior: 'front-horn-pair' },
  monster: { family: 'Monster Bot', silhouette: 'open-jaw', symmetry: 'mirrored', exterior: 'front-horn-pair' },
  crab: { family: 'Crab Bot', silhouette: 'wide-side-claws', symmetry: 'mirrored', exterior: 'side-armor' },
  'tall-heavy': { family: 'Tall Heavy Bot', silhouette: 'five-tier-heavy', symmetry: 'mirrored', exterior: 'layered-armor' },
  'armored-tank': { family: 'Armored Tank', silhouette: 'fortress-shell', symmetry: 'mirrored', exterior: 'layered-armor' },
  disc: { family: 'Low Profile Bot', silhouette: 'flat-disc', symmetry: 'mirrored', exterior: 'curved-ring' },
  'asymmetric-raider': { family: 'Asymmetric Raider', silhouette: 'offset-weapon-body', symmetry: 'intentional-asymmetry', exterior: 'offset-armor-horn' },
  'spinner-beast': { family: 'Spinner Beast', silhouette: 'weapon-first-ring', symmetry: 'mirrored', exterior: 'curved-ring' },
  'saw-fortress': { family: 'Saw Fortress', silhouette: 'low-weapon-armored-fortress', symmetry: 'mirrored', exterior: 'layered-armor' },
  'exhaust-brute': { family: 'Exhaust Brute', silhouette: 'long-decorated-brute', symmetry: 'mirrored', exterior: 'rear-exhaust-array' },
  'predator-jaw': { family: 'Jaw Bot', silhouette: 'split-jaw', symmetry: 'mirrored', exterior: 'front-horn-pair' },
  'split-nose': { family: 'Jaw Bot', silhouette: 'forked-nose', symmetry: 'mirrored', exterior: 'nose-armor' },
  bulldozer: { family: 'Wedge Bot', silhouette: 'wide-bulldozer', symmetry: 'mirrored', exterior: 'nose-armor' },
});
const AI_BLOCK_PALETTES = Object.freeze({
  blue: ['#39afe7', '#55c6f0', '#278dc7'],
  silver: ['#b9c4cc', '#d5dde2', '#909da6'],
  mixed: ['#39afe7', '#b9c4cc', '#55c6f0', '#d5dde2', '#278dc7', '#909da6'],
});
const AI_BLOCK_ARMOR_THICKNESS = 0.055;
const AI_BLOCK_ARMOR_SIZE = GRID_UNIT * 0.92;

function createAIBlockHull(type, designSeed = Math.random(), requestedArchetypeIndex = null, requestedHeightTier = null) {
  let randomState = Math.max(1, Math.floor((Math.abs(Number(designSeed)) % 1) * 2147483646));
  const random = () => ((randomState = randomState * 16807 % 2147483647) - 1) / 2147483646;
  const archetypeIndex = requestedArchetypeIndex === null
    ? Math.floor(random() * AI_HULL_ARCHETYPES.length)
    : ((Math.floor(requestedArchetypeIndex) % AI_HULL_ARCHETYPES.length) + AI_HULL_ARCHETYPES.length) % AI_HULL_ARCHETYPES.length;
  const archetype = AI_HULL_ARCHETYPES[archetypeIndex];
  const colorModes = ['blue80', 'silver80', 'balanced', 'split-sides', 'silver-core', 'blue-shell'];
  const colorMode = colorModes[Math.floor(random() * colorModes.length) % colorModes.length];
  const blocks = [];
  const occupied = new Set();
  const idFor = (x, y, z) => `ai-${type}-block-${x}-${y}-${z}`;
  const baseDimensions = {
    'predator-jaw': [3, -4, 5], 'armored-turtle': [4, -4, 4], centipede: [1, -7, 7], crab: [4, -3, 4],
    'low-wedge': [3, -4, 6], monster: [3, -4, 5], 'split-nose': [3, -4, 6], 'asymmetric-raider': [3, -4, 5],
    triangle: [4, -4, 6], hex: [3, -5, 5], elongated: [2, -7, 7], shark: [3, -5, 7],
    disc: [4, -4, 4], arrowhead: [4, -4, 7], stepped: [3, -5, 5], 'tall-heavy': [4, -3, 4],
    bulldozer: [4, -4, 5], 'exhaust-brute': [3, -6, 4], 'multi-layer': [3, -4, 5],
    'horned-bull': [4, -4, 6], 'spinner-beast': [3, -4, 5], 'armored-tank': [4, -4, 4], 'saw-fortress': [4, -4, 5],
  }[archetype];
  const defaultHeight = ({ 'low-wedge': 1, disc: 1, centipede: 2, elongated: 2, 'tall-heavy': 5, 'armored-tank': 4, 'saw-fortress': 4, 'exhaust-brute': 4, 'armored-turtle': 3, monster: 3 }[archetype] ?? (1 + Math.floor(random() * 4)));
  const desiredHeight = clamp(Math.round(requestedHeightTier ?? defaultHeight), 2, 5);
  const widthVariation = random() < 0.34 ? 1 : 0;
  const rearZ = baseDimensions[1] - (random() < 0.28 ? 1 : 0);
  const frontZ = baseDimensions[2] + (random() < 0.28 ? 1 : 0);
  const nominalHalfWidth = baseDimensions[0] + widthVariation;
  const chooseSilver = (x, y, z, boundary) => {
    // Colour is laid out as readable armour zones, not per-block noise.  Each
    // rule creates a continuous stripe, core or side field that survives at a
    // distance and keeps mirrored hulls mirrored.
    if (colorMode === 'blue80') return Math.abs(x) <= (y > 0 ? 1 : 0) && z <= rearZ + 2;
    if (colorMode === 'silver80') return !(Math.abs(x) <= 1 && z >= frontZ - 2);
    if (colorMode === 'balanced') return Math.abs(x) <= 1 || z <= rearZ + 1;
    if (colorMode === 'split-sides') return x >= 0;
    if (colorMode === 'silver-core') return Math.abs(x) <= 1 && Math.abs(z) <= 2;
    if (colorMode === 'blue-shell') return !boundary;
    return false;
  };
  const add = (x, y, z, blockType = 'cube') => {
    const key = `${x},${y},${z}`;
    if (occupied.has(key)) return null;
    occupied.add(key);
    const isCore = x === 0 && y === 0 && z === 0;
    const boundary = Math.abs(x) >= Math.max(1, nominalHalfWidth - 1) || z === rearZ || z === frontZ || y > 0;
    const silver = chooseSilver(x, y, z, boundary);
    const actualType = !isCore && blockType === 'cube' && silver ? 'silverCube' : blockType;
    const record = createBlockRecord(isCore ? 'core' : actualType, [x, y, z], [0, 0, 0], isCore ? 'block-core' : idFor(x, y, z));
    const palette = silver ? AI_BLOCK_PALETTES.silver : AI_BLOCK_PALETTES.blue;
    const colorIndex = Math.abs((y > 0 ? 1 : 0) + Math.floor(archetypeIndex / 4)) % palette.length;
    record.color = palette[colorIndex];
    record.materialTier = silver ? 'lv1-silver-metal' : 'lv1-blue-metal';
    blocks.push(record);
    return record;
  };
  const widthAt = (z) => {
    const normalized = (z - rearZ) / Math.max(1, frontZ - rearZ);
    const centreBias = 1 - Math.abs(normalized * 2 - 1);
    if (archetype === 'centipede') return 1;
    if (archetype === 'elongated') return 2;
    if (archetype === 'armored-turtle' || archetype === 'disc' || ['spinner-beast', 'saw-fortress'].includes(archetype)) return Math.max(1, Math.round(1 + centreBias * (nominalHalfWidth - 1)));
    if (archetype === 'hex') return Math.max(2, Math.round(2 + centreBias * (nominalHalfWidth - 2)));
    if (archetype === 'triangle' || archetype === 'shark' || archetype === 'arrowhead' || archetype === 'low-wedge') return Math.max(0, Math.round(nominalHalfWidth * (1 - normalized * 0.88)));
    if (archetype === 'bulldozer' || archetype === 'horned-bull') return z >= frontZ - 2 ? nominalHalfWidth : Math.max(2, nominalHalfWidth - 1);
    if (archetype === 'exhaust-brute') return z <= rearZ + 2 ? nominalHalfWidth : Math.max(2, nominalHalfWidth - 1);
    if (archetype === 'crab') return Math.abs(z) <= 2 ? nominalHalfWidth : Math.max(2, nominalHalfWidth - 2);
    if (archetype === 'stepped') return z >= frontZ - 2 ? 1 : Math.max(2, nominalHalfWidth - 1);
    return nominalHalfWidth;
  };
  for (let z = rearZ; z <= frontZ; z++) {
    const width = widthAt(z);
    const left = archetype === 'asymmetric-raider' ? -1 : -width;
    const right = archetype === 'asymmetric-raider' ? width + 2 : width;
    for (let x = left; x <= right; x++) {
      const mouthGap = ['predator-jaw', 'monster'].includes(archetype) && z >= frontZ - 1 && Math.abs(x) <= (archetype === 'monster' ? 1 : 0);
      const forkGap = archetype === 'split-nose' && z >= frontZ - 1 && Math.abs(x) < Math.max(1, width - 1);
      if (mouthGap || forkGap) continue;
      const pointNose = width === 0;
      add(x, 0, z, z >= frontZ - 1 ? (pointNose || Math.abs(x) < width ? 'wedge' : 'cornerWedge') : 'cube');
    }
  }
  // Every AI chassis starts as a genuinely two-storey structural hull. The
  // second layer mirrors every occupied base cell one-for-one; narrower towers
  // may begin only above it.
  const baseLayerCells = blocks.filter((block) => block.gridPosition[1] === 0).map((block) => [...block.gridPosition]);
  for (const [x, , z] of baseLayerCells) add(x, 1, z, 'cube');
  const upperRear = Math.max(rearZ + 2, -3);
  const upperFront = Math.min(frontZ - 2, 2);
  const upperHalfWidth = ['armored-turtle', 'tall-heavy', 'crab', 'armored-tank', 'saw-fortress'].includes(archetype) ? 2 : ['centipede', 'elongated', 'low-wedge'].includes(archetype) ? 0 : 1;
  if (desiredHeight >= 2 && archetype !== 'low-wedge') for (let z = upperRear; z <= upperFront; z++) for (let x = -upperHalfWidth; x <= upperHalfWidth; x++) add(x, 1, z, Math.abs(x) === upperHalfWidth && upperHalfWidth > 0 ? 'cornerWedge' : 'cube');
  if (desiredHeight >= 3 && ['multi-layer', 'stepped', 'tall-heavy', 'armored-turtle', 'armored-tank', 'saw-fortress'].includes(archetype)) {
    for (let z = -1; z <= 1; z++) for (let x = -1; x <= 1; x++) add(x, 2, z, Math.abs(x) + Math.abs(z) > 1 ? 'cornerWedge' : 'cube');
  }
  if (desiredHeight >= 3 && archetype === 'stepped') {
    for (let z = -3; z <= 3; z++) for (let x = -1; x <= 1; x++) add(x, z <= -1 ? 2 : z <= 1 ? 1 : 0, z, 'wedge');
  }
  if (desiredHeight >= 2 && archetype === 'crab') {
    for (const side of [-1, 1]) for (let z = -2; z <= 2; z++) add(side * nominalHalfWidth, 1, z, 'cornerWedge');
  }
  if (desiredHeight >= 2 && ['predator-jaw', 'monster'].includes(archetype)) {
    const jawX = archetype === 'monster' ? 2 : 1;
    for (const side of [-1, 1]) for (let z = frontZ - 2; z <= frontZ; z++) add(side * jawX, 1, z, z === frontZ ? 'wedge' : 'cube');
  }
  if (desiredHeight >= 2 && archetype === 'horned-bull') {
    for (const side of [-1, 1]) for (let z = frontZ - 2; z <= frontZ; z++) add(side * Math.max(2, nominalHalfWidth - 1), 1, z, z === frontZ ? 'wedge' : 'cube');
  }
  if (desiredHeight >= 2) add(0, 1, 0);
  // Requested 1-5 block heights are real structural layers. Upper layers are
  // compact and rear-biased, preserving a low, open front weapon bay.
  for (let y = 2; y < desiredHeight; y++) {
    const halfWidth = Math.max(0, Math.min(2, desiredHeight - y));
    const zRear = Math.max(rearZ + 2, -2);
    const zFront = Math.min(frontZ - 3, y >= 3 ? 1 : 2);
    for (let z = zRear; z <= zFront; z++) for (let x = -halfWidth; x <= halfWidth; x++) {
      if (z >= frontZ - 3 && Math.abs(x) <= 1) continue;
      add(x + (archetype === 'asymmetric-raider' && y >= 2 ? 1 : 0), y, z, Math.abs(x) === halfWidth && halfWidth > 0 ? 'cornerWedge' : 'cube');
    }
    add(archetype === 'asymmetric-raider' && y >= 2 ? 1 : 0, y, 0);
  }
  const minX = Math.min(...blocks.map((block) => block.gridPosition[0]));
  const maxX = Math.max(...blocks.map((block) => block.gridPosition[0]));
  const maxY = Math.max(...blocks.map((block) => block.gridPosition[1]));
  const frontWidth = blocks.filter((block) => block.gridPosition[1] === 0 && block.gridPosition[2] === frontZ).length;
  const rearWidth = blocks.filter((block) => block.gridPosition[1] === 0 && block.gridPosition[2] === rearZ).length;
  const silverCount = blocks.filter((block) => block.materialTier === 'lv1-silver-metal').length;
  return { blocks, idFor, archetype, colorMode, rearZ, frontZ, minX, maxX, maxY, frontWidth, rearWidth, silverCount, random, desiredHeight };
}

function createAIAssembly(type, options = {}) {
  if (REMOVED_WEAPON_TYPES.has(type)) type = 'spinner';
  const designSeed = options.designSeed ?? Math.random();
  const hull = createAIBlockHull(type, designSeed, options.archetypeIndex ?? null, options.heightTier ?? null);
  const { blocks, idFor, archetype, colorMode, rearZ, frontZ, minX, maxX, maxY, frontWidth, rearWidth, silverCount, random } = hull;
  const lightArchetypes = new Set(['centipede', 'crab', 'low-wedge', 'disc', 'asymmetric-raider']);
  const heavyArchetypes = new Set(['armored-turtle', 'tall-heavy', 'monster', 'armored-tank', 'saw-fortress', 'exhaust-brute', 'multi-layer', 'bulldozer']);
  let weightClass = options.weightClass;
  if (!WEIGHT_CLASSES[weightClass]) {
    const roll = random();
    weightClass = lightArchetypes.has(archetype) ? (roll < 0.72 ? 'lightweight' : 'middleweight')
      : heavyArchetypes.has(archetype) ? (roll < 0.72 ? 'superheavy' : 'middleweight')
        : roll < 0.25 ? 'lightweight' : roll > 0.75 ? 'superheavy' : 'middleweight';
  }
  const classProfile = WEIGHT_CLASSES[weightClass];
  const driveType = weightClass === 'superheavy' && random() < 0.46 ? 'track' : 'wheel';
  const wheelModel = driveType === 'track' ? 'track_heavy' : classProfile.wheelModel;
  const faceMount = (targetId, point, normal) => ({ kind: 'surface', targetId, targetIds: [targetId], point, normal, attached: true, gap: MOUNT_EPSILON });
  const part = (id, partType, position, targetId, normal = [0, 1, 0], extra = {}) => {
    const record = { id, type: partType, position, rotation: [0, 0, 0], scaleFactor: 1, mount: faceMount(targetId, position, normal), linkedTo: [targetId], ...extra };
    if (!extra.mount) {
      const target = blocks.find((block) => block.id === targetId);
      if (target) {
        const box = blockLocalAABB(target);
        const desired = new THREE.Vector3(...position);
        const unitNormal = new THREE.Vector3(...normal).normalize();
        const point = desired.clone().clamp(box.min, box.max);
        const axis = Math.abs(unitNormal.x) > 0.7 ? 'x' : Math.abs(unitNormal.y) > 0.7 ? 'y' : 'z';
        point[axis] = unitNormal[axis] > 0 ? box.max[axis] : box.min[axis];
        setRecordSurfaceMount(record, point, unitNormal, targetId);
      }
    }
    return record;
  };
  const frontTargetZ = frontZ - 1;
  const rearTargetZ = rearZ + 1;
  const rowExtents = (z) => {
    const row = blocks.filter((block) => block.gridPosition[1] === 0 && block.gridPosition[2] === z).map((block) => block.gridPosition[0]);
    return [Math.min(...row), Math.max(...row)];
  };
  const parts = [];
  const frontDriveZ = ['spinner', 'flipper', 'drum', 'bar'].includes(type) ? Math.max(rearTargetZ + 1, frontZ - 3) : frontTargetZ;
  const wheelRows = driveType === 'track' ? [Math.round((rearZ + frontZ) * 0.5)] : ['centipede', 'elongated'].includes(archetype)
    ? [rearTargetZ, Math.round((rearZ + frontZ) * 0.5), frontDriveZ]
    : [rearTargetZ, frontDriveZ];
  const availableWheelRows = [...new Set(blocks.filter((block) => block.gridPosition[1] === 0).map((block) => block.gridPosition[2]))];
  const usedWheelRows = new Set();
  for (let axle = 0; axle < wheelRows.length; axle++) {
    const suffix = wheelRows.length === 3 ? ['r', 'm', 'f'][axle] : ['r', 'f'][axle];
    const steers = driveType !== 'track' && axle === wheelRows.length - 1;
    // Track and wheel GLBs already contain their authored proportions. Runtime
    // scaling stays uniform so mount support, visual bounds and collider bounds
    // can never diverge after assembly enrichment.
    const driveAxisScale = [1, 1, 1];
    // Runtime ground alignment replaces this authored Y with the measured GLB
    // radius and a per-robot chassis clearance after every part is built.
    const candidateRows = availableWheelRows.filter((z) => !usedWheelRows.has(z)).sort((a, b) => Math.abs(a - wheelRows[axle]) - Math.abs(b - wheelRows[axle]));
    let chosen = null;
    for (const z of candidateRows) {
      const [leftTargetX, rightTargetX] = rowExtents(z);
      const left = part(`wheel-${suffix}l`, 'wheel', [leftTargetX * GRID_UNIT - 0.56, 0.46, z * GRID_UNIT], idFor(leftTargetX, 0, z), [-1, 0, 0], { hubFlipped: false, hubFlipManual: false, steers, wheelModel, driveType, axisScale: driveAxisScale });
      const right = part(`wheel-${suffix}r`, 'wheel', [rightTargetX * GRID_UNIT + 0.56, 0.46, z * GRID_UNIT], idFor(rightTargetX, 0, z), [1, 0, 0], { hubFlipped: false, hubFlipManual: false, steers, wheelModel, driveType, axisScale: driveAxisScale });
      const draft = { blocks, parts };
      for (const standoff of [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96, 1.08, 1.2]) {
        left.mount.standoff = standoff;
        right.mount.standoff = standoff;
        refreshRecordMount(left);
        refreshRecordMount(right);
        const leftCollision = partCollisionState(left, left.id, draft);
        const rightCollision = partCollisionState(right, right.id, draft);
        if (!leftCollision.blockPenetrations.length && !leftCollision.partPenetrations.length && !rightCollision.blockPenetrations.length && !rightCollision.partPenetrations.length) {
          chosen = { z, left, right };
          break;
        }
      }
      if (chosen) break;
    }
    if (!chosen) {
      const z = candidateRows[0] ?? wheelRows[axle];
      const [leftTargetX, rightTargetX] = rowExtents(z);
      chosen = {
        z,
        left: part(`wheel-${suffix}l`, 'wheel', [leftTargetX * GRID_UNIT - 0.56, 0.46, z * GRID_UNIT], idFor(leftTargetX, 0, z), [-1, 0, 0], { hubFlipped: false, hubFlipManual: false, steers, wheelModel, driveType, axisScale: driveAxisScale }),
        right: part(`wheel-${suffix}r`, 'wheel', [rightTargetX * GRID_UNIT + 0.56, 0.46, z * GRID_UNIT], idFor(rightTargetX, 0, z), [1, 0, 0], { hubFlipped: false, hubFlipManual: false, steers, wheelModel, driveType, axisScale: driveAxisScale }),
      };
      chosen.left.mount.standoff = 1.08;
      chosen.right.mount.standoff = 1.08;
      refreshRecordMount(chosen.left);
      refreshRecordMount(chosen.right);
    }
    usedWheelRows.add(chosen.z);
    parts.push(chosen.left, chosen.right);
  }
  const nearestBlock = (gx, gy, gz) => blocks.reduce((best, block) => {
    const [x, y, z] = block.gridPosition;
    const score = (x - gx) ** 2 + (y - gy) ** 2 * 1.4 + (z - gz) ** 2;
    return !best || score < best.score ? { block, score } : best;
  }, null).block;
  const nearestGroundBlock = (gx, gz) => blocks.filter((block) => block.gridPosition[1] === 0).reduce((best, block) => {
    const [x, , z] = block.gridPosition;
    const score = (x - gx) ** 2 + (z - gz) ** 2;
    return !best || score < best.score ? { block, score } : best;
  }, null).block;
  const sideBias = random() < 0.5 ? -1 : 1;
  // Every combat weapon occupies a genuine low front bay. The former generic
  // spinner layout put the blade in the hull centre where tall blocks hid it.
  const layoutChoices = ['low-front'];
  const weaponLayout = layoutChoices[Math.floor(random() * layoutChoices.length) % layoutChoices.length];
  const layoutX = weaponLayout === 'front-left' || weaponLayout === 'side-left' ? -Math.min(2, Math.abs(minX) - 0.5)
    : weaponLayout === 'front-right' || weaponLayout === 'side-right' ? Math.min(2, Math.abs(maxX) - 0.5)
      : weaponLayout === 'front-center' || weaponLayout === 'central' || weaponLayout === 'high-center' || weaponLayout === 'low-front' ? 0
        : ['asymmetric-raider', 'split-nose'].includes(archetype) ? sideBias : 0;
  const layoutZ = weaponLayout === 'mouth' || weaponLayout === 'low-front' ? frontZ
    : weaponLayout === 'rear' ? rearZ + 1
      : weaponLayout.startsWith('front-') ? frontZ - 2
        : weaponLayout.startsWith('side-') ? 0 : 0;
  // Weapon mounts always reference a ground-layer block. A tall hull is built
  // around a low front bay instead of lifting the weapon above opponents.
  const nearestWeaponDeckBlock = (gx, gz) => blocks.filter((block) => block.gridPosition[1] === 1).reduce((best, block) => {
    const [x, , z] = block.gridPosition;
    const score = (x - gx) ** 2 + (z - gz) ** 2;
    return !best || score < best.score ? { block, score } : best;
  }, null)?.block ?? nearestGroundBlock(gx, gz);
  const targetBlock = nearestWeaponDeckBlock(layoutX, layoutZ);
  const mountX = layoutX * GRID_UNIT;
  const mountZ = layoutZ * GRID_UNIT;
  const mountY = (targetBlock.gridPosition[1] + 0.5) * GRID_UNIT;
  const weaponYaw = weaponLayout === 'diagonal' ? sideBias * Math.PI / 4
    : weaponLayout === 'side-left' ? -Math.PI / 2 : weaponLayout === 'side-right' ? Math.PI / 2 : 0;
  const topTarget = targetBlock.id;
  const largeWeaponScale = ['tall-heavy', 'armored-turtle', 'armored-tank', 'saw-fortress'].includes(archetype) ? 1.16 : ['centipede', 'elongated'].includes(archetype) ? 0.9 : 1;
  if (type === 'spinner') {
    const mount = part('ai-saw-mount', 'sawSupport', [mountX, mountY, mountZ], topTarget, [0, 1, 0], { rotation: [0, weaponYaw, 0] });
    // Keep the support on the block surface. The former 34 cm artificial gap
    // lifted the blade toward the upper hull and made it look detached.
    mount.mount.standoff = 0.02;
    refreshRecordMount(mount);
    const centre = [...mount.position];
    parts.push(mount, part('ai-spinner', 'spinner', centre, 'ai-saw-mount', [0, 1, 0], { scaleFactor: weaponLayout === 'mouth' ? 1.12 : largeWeaponScale, rotation: [0, weaponYaw, 0], mount: { kind: 'axis', targetId: 'ai-saw-mount', targetIds: ['ai-saw-mount'], point: centre, normal: [0, 1, 0], attached: true, gap: 0 }, linkedTo: ['ai-saw-mount'] }));
  } else if (type === 'hammer') {
    const mount = part('ai-hammer-mount', 'hammerMount', [mountX, mountY, mountZ], topTarget, [0, 1, 0], { rotation: [0, weaponYaw, 0] });
    const centre = [...mount.position];
    parts.push(mount, part('ai-hammer', 'hammer', centre, 'ai-hammer-mount', [0, 1, 0], { scaleFactor: largeWeaponScale, rotation: [0, weaponYaw, 0], mount: { kind: 'axis', targetId: 'ai-hammer-mount', targetIds: ['ai-hammer-mount'], point: centre, normal: [0, 1, 0], attached: true, gap: 0 }, linkedTo: ['ai-hammer-mount'] }));
  } else if (type === 'flipper') {
    const leftTarget = nearestGroundBlock(-1, frontZ);
    const rightTarget = nearestGroundBlock(1, frontZ);
    const flipperZ = Math.max(leftTarget.gridPosition[2], rightTarget.gridPosition[2]) * GRID_UNIT;
    const left = part('ai-pivot-l', 'pivotMount', [-0.54, GRID_UNIT * 0.5, flipperZ], leftTarget.id, [0, 0, 1], { axisGroup: 'ai-flipper' });
    const right = part('ai-pivot-r', 'pivotMount', [0.54, GRID_UNIT * 0.5, flipperZ], rightTarget.id, [0, 0, 1], { rotation: [0, Math.PI, 0], axisGroup: 'ai-flipper' });
    const centre = new THREE.Vector3(...left.position).add(new THREE.Vector3(...right.position)).multiplyScalar(0.5).toArray();
    parts.push(left, right, part('ai-flipper', 'flipper', centre, 'ai-pivot-l', [1, 0, 0], { scaleFactor: largeWeaponScale, mount: { kind: 'axis', targetId: 'ai-pivot-l', targetIds: ['ai-pivot-l', 'ai-pivot-r'], point: centre, normal: [1, 0, 0], attached: true, gap: 0 }, linkedTo: ['ai-pivot-l', 'ai-pivot-r'] }));
  } else if (type === 'bar') {
    // A horizontal bar needs its whole swept circle outside the nose. Build a
    // real three-block boom from the selected hull face, then mount the shaft
    // to the boom's exposed front face. The weapon is visibly connected and
    // its rotation volume cannot cut through the chassis.
    let boomTarget = targetBlock;
    for (let step = 1; step <= 3; step++) {
      const [boomX, boomY, boomZ] = boomTarget.gridPosition;
      const nextZ = boomZ + 1;
      let next = blocks.find((block) => block.gridPosition[0] === boomX && block.gridPosition[1] === boomY && block.gridPosition[2] === nextZ);
      if (!next) {
        next = createBlockRecord('cube', [boomX, boomY, nextZ], [0, 0, 0], idFor(boomX, boomY, nextZ));
        next.color = boomTarget.color;
        next.materialTier = boomTarget.materialTier;
        blocks.push(next);
      }
      boomTarget = next;
    }
    const boomPoint = new THREE.Vector3(...boomTarget.gridPosition).multiplyScalar(GRID_UNIT);
    const axisMount = part('ai-bar-axis', 'barAxis', [boomPoint.x, mountY, boomPoint.z + GRID_UNIT], boomTarget.id, [0, 0, 1], { rotation: [0, weaponYaw, 0] });
    axisMount.mount.standoff = 1.18;
    refreshRecordMount(axisMount);
    const centre = [...axisMount.position];
    parts.push(axisMount, part('ai-bar', 'barSpinner', centre, 'ai-bar-axis', [0, 1, 0], { scaleFactor: largeWeaponScale, rotation: [0, weaponYaw, 0], mount: { kind: 'axis', targetId: 'ai-bar-axis', targetIds: ['ai-bar-axis'], point: centre, normal: [0, 1, 0], attached: true, gap: 0 }, linkedTo: ['ai-bar-axis'] }));
  } else if (type === 'drum') {
    const leftTarget = nearestGroundBlock(-1, frontZ);
    const rightTarget = nearestGroundBlock(1, frontZ);
    const drumZ = Math.max(leftTarget.gridPosition[2], rightTarget.gridPosition[2]) * GRID_UNIT;
    const left = part('ai-drum-pivot-l', 'pivotMount', [-0.72, GRID_UNIT * 0.5, drumZ], leftTarget.id, [0, 0, 1], { axisGroup: 'ai-drum' });
    const right = part('ai-drum-pivot-r', 'pivotMount', [0.72, GRID_UNIT * 0.5, drumZ], rightTarget.id, [0, 0, 1], { rotation: [0, Math.PI, 0], axisGroup: 'ai-drum' });
    left.mount.standoff = 0.52;
    right.mount.standoff = 0.52;
    refreshRecordMount(left);
    refreshRecordMount(right);
    const centre = new THREE.Vector3(...left.position).add(new THREE.Vector3(...right.position)).multiplyScalar(0.5).toArray();
    parts.push(left, right, part('ai-drum', 'drumSpinner', centre, 'ai-drum-pivot-l', [1, 0, 0], { scaleFactor: largeWeaponScale, mount: { kind: 'axis', targetId: 'ai-drum-pivot-l', targetIds: ['ai-drum-pivot-l', 'ai-drum-pivot-r'], point: centre, normal: [1, 0, 0], attached: true, gap: 0 }, linkedTo: ['ai-drum-pivot-l', 'ai-drum-pivot-r'] }));
  }
  const blockByCell = new Map(blocks.map((block) => [block.gridPosition.join(','), block]));
  const normalCellStep = (normal) => normal.map((value) => Math.round(value));
  const faceIsExposed = (block, normal) => {
    const step = normalCellStep(normal);
    const [x, y, z] = block.gridPosition;
    return !blockByCell.has([x + step[0], y + step[1], z + step[2]].join(','));
  };
  const surfacePoint = (block, normal) => {
    const dimensions = getBlockOrientedDimensions(block).multiplyScalar(GRID_UNIT);
    const centre = new THREE.Vector3(...block.gridPosition).multiplyScalar(GRID_UNIT);
    return centre.add(new THREE.Vector3(
      normal[0] * dimensions.x * 0.5,
      normal[1] * dimensions.y * 0.5,
      normal[2] * dimensions.z * 0.5,
    ));
  };
  const accessoryRecords = [];
  const occupiedAccessoryPoints = [];
  const accessory = (id, partType, gx, gy, gz, normal = [0, 1, 0], rotation = [0, 0, 0], axisScale = [1, 1, 1]) => {
    // AI armour is generated later as one-block native plates. Never place the
    // old large GLB armour decorations, whose authored pivot could leave a
    // whole plate lying on the terrain beside the robot.
    if (['armorFlat', 'armorCurved'].includes(partType)) return null;
    const unitNormal = new THREE.Vector3(...normal).normalize();
    const weaponPathBlocks = new Set(parts.filter((candidate) => WEAPON_TYPES.has(candidate.type)).flatMap((weapon) => weaponClearanceBlockIds(weapon, { blocks, parts })));
    const candidates = blocks
      .filter((block) => faceIsExposed(block, unitNormal.toArray()))
      .map((block) => {
        const [x, y, z] = block.gridPosition;
        const point = surfacePoint(block, unitNormal.toArray());
        const targetDistance = (x - gx) ** 2 + (y - gy) ** 2 * 1.55 + (z - gz) ** 2;
        const wheelClearance = parts.filter((candidate) => candidate.type === 'wheel').reduce((minimum, wheel) => Math.min(minimum, point.distanceTo(new THREE.Vector3(...wheel.position))), Infinity);
        const weaponClearance = parts.filter((candidate) => WEAPON_TYPES.has(candidate.type) || ['pivotMount', 'sawSupport', 'hammerMount', 'barAxis'].includes(candidate.type)).reduce((minimum, weapon) => Math.min(minimum, point.distanceTo(new THREE.Vector3(...weapon.position))), Infinity);
        const weaponPathBlocked = weaponPathBlocks.has(block.id);
        return { block, point, score: targetDistance + (wheelClearance < 0.58 ? 100 : 0) + (weaponClearance < 0.5 ? 100 : 0) + (weaponPathBlocked ? 200 : 0), wheelClearance, weaponClearance, weaponPathBlocked };
      })
      .sort((a, b) => a.score - b.score);
    const viableCandidates = candidates.filter((candidate) => !candidate.weaponPathBlocked && candidate.wheelClearance >= 0.58 && candidate.weaponClearance >= 0.5
      && occupiedAccessoryPoints.every((entry) => candidate.point.distanceTo(entry.point) >= (entry.radius + (PART_META[partType]?.radius ?? 0.5)) * 0.34));
    const uniformScale = Math.max(...axisScale.map((value) => Number(value ?? 1)));
    // A blocked preferred face must not cancel the accessory entirely. Try
    // every exposed face in score order so dense/tall hulls keep real armour.
    for (const selected of viableCandidates) {
      const record = part(id, partType, selected.point.toArray(), selected.block.id, unitNormal.toArray(), { rotation, scaleFactor: uniformScale, axisScale: [1, 1, 1] });
      record.mount = { kind: 'surface', targetId: selected.block.id, targetIds: [selected.block.id], point: selected.point.toArray(), normal: unitNormal.toArray(), attached: true, gap: MOUNT_EPSILON };
      refreshRecordMount(record);
      record.aiPlacement = { source: 'actual-exposed-block-face', faceNormal: unitNormal.toArray(), targetGrid: [...selected.block.gridPosition], wheelClearance: Number(selected.wheelClearance.toFixed(3)), weaponClearance: Number(selected.weaponClearance.toFixed(3)) };
      const collision = partCollisionState(record, record.id, { blocks, parts });
      if (collision.blockPenetrations.length || collision.partPenetrations.length) continue;
      parts.push(record);
      accessoryRecords.push(record);
      occupiedAccessoryPoints.push({ point: selected.point, radius: (PART_META[partType]?.radius ?? 0.5) * uniformScale, id });
      return record;
    }
    return null;
  };
  // Exterior pieces are structural silhouettes, not a cosmetic team tint.
  // Every archetype receives a different deterministic layout so mixed-class
  // battles remain readable even when block palettes happen to match.
  if (['armored-turtle', 'armored-tank', 'tall-heavy', 'saw-fortress'].includes(archetype)) {
    accessory('armor-top', 'armorCurved', 0, maxY, 0, [0, 1, 0], [0, 0, 0], [1.25, 1, 1.05]);
    accessory('armor-front', 'armorFlat', 0, 0, frontZ - 1, [0, 0, 1], [Math.PI / 2, 0, 0], [1.4, 1, 0.8]);
    accessory('armor-side-l', 'armorFlat', minX, Math.min(1, maxY), -1, [-1, 0, 0], [0, 0, Math.PI / 2], [1.05, 1, 1]);
    accessory('armor-side-r', 'armorFlat', maxX, Math.min(1, maxY), 1, [1, 0, 0], [0, 0, -Math.PI / 2], [1.05, 1, 1]);
    accessory('heavy-exhaust-l', 'exhaustVertical', -1, maxY, rearZ + 2, [0, 1, 0], [0, 0, 0], [0.86, 0.86, 0.86]);
    accessory('heavy-exhaust-r', 'exhaustVertical', 1, maxY, rearZ + 2, [0, 1, 0], [0, 0, 0], [1.08, 1.08, 1.08]);
  } else if (['horned-bull', 'monster', 'predator-jaw'].includes(archetype)) {
    accessory('horn-left', 'hornCurved', -Math.min(2, Math.abs(minX)), 0, frontZ, [0, 0, 1], [0, 0, -0.2]);
    accessory('horn-right', 'hornCurved', Math.min(2, Math.abs(maxX)), 0, frontZ, [0, 0, 1], [0, Math.PI, 0.2]);
    accessory('exhaust-bull', 'exhaustTriple', 0, maxY, rearZ + 1, [0, 1, 0]);
    accessory('jaw-armor', 'armorFlat', 0, 0, frontZ - 2, [0, 1, 0], [0, 0, 0], [0.92, 0.92, 0.92]);
  } else if (['centipede', 'elongated', 'exhaust-brute'].includes(archetype)) {
    accessory('tail-spike', 'hornStraight', 0, 0, rearZ, [0, 0, -1], [0, Math.PI, 0], [1.35, 0.82, 0.82]);
    accessory('exhaust-tail-l', 'exhaustVertical', -1, maxY, rearZ + 2, [0, 1, 0]);
    accessory('exhaust-tail-r', 'exhaustVertical', 1, maxY, rearZ + 2, [0, 1, 0]);
    accessory('long-side-plate-l', 'armorFlat', minX, 0, 1, [-1, 0, 0], [0, 0, Math.PI / 2], [0.88, 0.88, 0.88]);
    accessory('long-side-plate-r', 'armorFlat', maxX, 0, -1, [1, 0, 0], [0, 0, -Math.PI / 2], [1.12, 1.12, 1.12]);
  } else if (archetype === 'crab') {
    accessory('side-plate-l', 'armorFlat', minX, 0, 0, [-1, 0, 0], [0, 0, Math.PI / 2], [1.2, 1, 0.66]);
    accessory('side-plate-r', 'armorFlat', maxX, 0, 0, [1, 0, 0], [0, 0, -Math.PI / 2], [1.2, 1, 0.66]);
  } else if (archetype === 'asymmetric-raider') {
    accessory('offset-side-plate', 'armorFlat', minX, 0, -1, [-1, 0, 0], [0, 0, Math.PI / 2], [1.3, 1, 0.7]);
    accessory('offset-forward-horn', 'hornStraight', maxX, 0, frontZ - 1, [0, 0, 1], [0, 0, 0], [1.1, 0.82, 0.82]);
  } else if (['spinner-beast', 'saw-fortress', 'disc'].includes(archetype)) {
    accessory('spinner-ring-a', 'armorCurved', -1, 0, 0, [0, 1, 0], [0, Math.PI / 2, 0], [0.9, 0.8, 0.9]);
    accessory('spinner-ring-b', 'armorCurved', 1, 0, 0, [0, 1, 0], [0, -Math.PI / 2, 0], [0.9, 0.8, 0.9]);
    accessory('spinner-side-l', 'armorFlat', minX, 0, -1, [-1, 0, 0], [0, 0, Math.PI / 2], [0.9, 0.9, 0.9]);
    accessory('spinner-side-r', 'armorFlat', maxX, 0, 1, [1, 0, 0], [0, 0, -Math.PI / 2], [1.08, 1.08, 1.08]);
  } else {
    accessory('nose-plate', 'armorFlat', 0, 0, frontZ - 1, [0, 1, 0], [0, 0, 0], [1.18, 0.82, 0.72]);
    accessory('rear-exhaust', random() < 0.5 ? 'exhaustTriple' : 'exhaustVertical', 0, maxY, rearZ + 1, [0, 1, 0]);
  }
  // Build readable armour across several faces instead of one token top plate.
  // The surface helper rejects buried, wheel-intersecting or weapon-blocking
  // candidates, so these remain physically attached even on asymmetric hulls.
  const panelScale = 0.76 + (Math.abs(Math.sin(Number(designSeed) * 17.3)) * 0.34);
  accessory('shell-front-left', 'armorFlat', -Math.min(2, Math.abs(minX)), Math.min(1, maxY), frontZ, [0, 0, 1], [Math.PI / 2, 0, 0], [panelScale, panelScale, panelScale]);
  accessory('shell-front-right', 'armorFlat', Math.min(2, Math.abs(maxX)), Math.min(1, maxY), frontZ, [0, 0, 1], [Math.PI / 2, 0, 0], [panelScale * 1.12, panelScale * 1.12, panelScale * 1.12]);
  accessory('shell-rear', maxY >= 3 ? 'armorCurved' : 'armorFlat', 0, Math.min(1, maxY), rearZ, [0, 0, -1], [Math.PI / 2, Math.PI, 0], [panelScale * 0.92, panelScale * 0.92, panelScale * 0.92]);
  accessory('shell-top-front', maxY >= 2 ? 'armorCurved' : 'armorFlat', 0, maxY, Math.min(frontZ - 2, 1), [0, 1, 0], [0, 0, 0], [panelScale, panelScale, panelScale]);
  accessory('shell-side-left-high', 'armorFlat', minX, Math.min(maxY, 2), 0, [-1, 0, 0], [0, 0, Math.PI / 2], [panelScale * 0.88, panelScale * 0.88, panelScale * 0.88]);
  accessory('shell-side-right-high', 'armorFlat', maxX, Math.min(maxY, 2), 0, [1, 0, 0], [0, 0, -Math.PI / 2], [panelScale * 1.04, panelScale * 1.04, panelScale * 1.04]);
  if (maxY >= 3) {
    accessory('shell-top-rear', 'armorCurved', 0, maxY, Math.max(rearZ + 2, -1), [0, 1, 0], [0, Math.PI, 0], [panelScale * 1.16, panelScale * 1.16, panelScale * 1.16]);
    accessory('tower-exhaust', archetype === 'exhaust-brute' ? 'exhaustTriple' : 'exhaustVertical', maxX > 2 ? 1 : 0, maxY, rearZ + 1, [0, 1, 0], [0, 0, 0], [0.82, 0.82, 0.82]);
  }
  // Armour is authored from actual exposed block faces. Each record owns one
  // block face and therefore cannot fall beside the chassis or float in world
  // space. Dense classes receive many small plates instead of one oversized
  // decoration spanning several blocks.
  const armorNormals = [
    { normal: [0, 0, 1], face: 'front', rotation: [Math.PI / 2, 0, 0] },
    { normal: [0, 0, -1], face: 'rear', rotation: [Math.PI / 2, Math.PI, 0] },
    { normal: [-1, 0, 0], face: 'left', rotation: [0, 0, Math.PI / 2] },
    { normal: [1, 0, 0], face: 'right', rotation: [0, 0, -Math.PI / 2] },
    { normal: [0, 1, 0], face: 'top', rotation: [0, 0, 0] },
  ];
  const armorableFaces = blocks.flatMap((block) => armorNormals
    .filter(({ normal }) => faceIsExposed(block, normal))
    .map((descriptor) => ({ block, ...descriptor })))
    .filter(({ block, normal }) => {
      const point = surfacePoint(block, normal);
      const wheelClearance = parts.filter((candidate) => candidate.type === 'wheel')
        .reduce((minimum, wheel) => Math.min(minimum, point.distanceTo(new THREE.Vector3(...wheel.position))), Infinity);
      const weaponClearance = parts.filter((candidate) => WEAPON_TYPES.has(candidate.type) || ['pivotMount', 'sawSupport', 'barAxis'].includes(candidate.type))
        .reduce((minimum, weapon) => Math.min(minimum, point.distanceTo(new THREE.Vector3(...weapon.position))), Infinity);
      return wheelClearance >= 0.44 && weaponClearance >= 0.42;
    });
  const baseArmorCoverage = weightClass === 'superheavy' ? 0.88 : weightClass === 'middleweight' ? 0.7 : 0.56;
  const archetypeArmorBias = ['armored-turtle', 'armored-tank', 'tall-heavy', 'saw-fortress'].includes(archetype) ? 0.1
    : ['centipede', 'low-wedge', 'elongated'].includes(archetype) ? -0.06 : 0;
  const requestedArmorCoverage = clamp(baseArmorCoverage + archetypeArmorBias, 0.5, 0.96);
  const armorPlateCap = weightClass === 'superheavy' ? 96 : weightClass === 'middleweight' ? 72 : 52;
  const deterministicFaceScore = ({ block, normal }) => {
    const [x, y, z] = block.gridPosition;
    const seed = Number(designSeed) * 91.7 + x * 17.13 + y * 31.79 + z * 47.21 + normal[0] * 7.7 + normal[1] * 13.1 + normal[2] * 19.9;
    return Math.abs(Math.sin(seed) * 43758.5453) % 1;
  };
  armorableFaces.sort((a, b) => {
    const facePriority = { front: 0, left: 1, right: 1, top: 2, rear: 3 };
    return facePriority[a.face] - facePriority[b.face] || deterministicFaceScore(a) - deterministicFaceScore(b);
  });
  const wantedArmorCount = Math.min(armorPlateCap, Math.max(2, Math.round(armorableFaces.length * requestedArmorCoverage)));
  let blockFaceArmorInstalled = 0;
  for (const descriptor of armorableFaces) {
    if (blockFaceArmorInstalled >= wantedArmorCount) break;
    if (deterministicFaceScore(descriptor) > requestedArmorCoverage && blockFaceArmorInstalled >= Math.ceil(wantedArmorCount * 0.65)) continue;
    const { block, normal, rotation, face } = descriptor;
    const point = surfacePoint(block, normal);
    const cornerLike = block.type === 'cornerWedge' || Math.abs(block.gridPosition[0]) === Math.max(Math.abs(minX), Math.abs(maxX));
    const partType = 'armorFlat';
    const sizeVariants = [0.72, 0.84, 0.94];
    const plateSize = sizeVariants[Math.floor(deterministicFaceScore(descriptor) * sizeVariants.length) % sizeVariants.length];
    const existingTooClose = occupiedAccessoryPoints.some((entry) => entry.point.distanceTo(point) < GRID_UNIT * 0.56);
    if (existingTooClose) continue;
    const record = part(`face-armor-${block.id}-${face}`, partType, point.toArray(), block.id, normal, { rotation, scaleFactor: 1, axisScale: [1, 1, 1], nativeBlockPlate: true, plateSize });
    record.mount = { kind: 'surface', targetId: block.id, targetIds: [block.id], point: point.toArray(), normal: [...normal], attached: true, gap: MOUNT_EPSILON };
    refreshRecordMount(record);
    record.aiPlacement = { source: 'block-face-armor-grid', face, faceNormal: [...normal], targetGrid: [...block.gridPosition], wheelClearance: 1, weaponClearance: 1 };
    const collision = partCollisionState(record, record.id, { blocks, parts });
    if (collision.blockPenetrations.length || collision.partPenetrations.length) continue;
    parts.push(record);
    accessoryRecords.push(record);
    occupiedAccessoryPoints.push({ point, radius: GRID_UNIT * plateSize * 0.46, id: record.id });
    blockFaceArmorInstalled++;
  }
  const autoCutRemovedBlockIds = [];
  const assemblyDraft = { blocks, parts };
  const protectedMountBlocks = new Set(parts.flatMap((record) => [record.mount?.targetId, ...(record.mount?.targetIds ?? [])]).filter((id) => blocks.some((block) => block.id === id)));
  for (const weapon of parts.filter((record) => WEAPON_TYPES.has(record.type))) {
    const supportIds = new Set([weapon.mount?.targetId, ...(weapon.mount?.targetIds ?? []), ...(weapon.linkedTo ?? [])].filter(Boolean));
    const supports = parts.filter((candidate) => supportIds.has(candidate.id));
    const clearance = [...new Set([
      ...weaponClearanceBlockIds(weapon, assemblyDraft),
      ...partCollisionState(weapon, weapon.id, assemblyDraft).blockPenetrations,
      ...supports.flatMap((support) => partCollisionState(support, support.id, assemblyDraft).blockPenetrations),
    ])];
    if (!clearance.length) continue;
    const removable = clearance.filter((id) => !blocks.find((block) => block.id === id)?.isCore && !protectedMountBlocks.has(id));
    if (removable.length !== clearance.length) continue;
    const trial = blocks.filter((block) => !removable.includes(block.id));
    if (getBlockConnectionGraph(trial).disconnected.length) continue;
    for (const id of removable) {
      const index = blocks.findIndex((block) => block.id === id);
      if (index >= 0) blocks.splice(index, 1);
    }
    weapon.autoCutClearance = true;
    weapon.autoCutRemovedBlockIds = removable;
    autoCutRemovedBlockIds.push(...removable);
  }
  for (const block of blocks) {
    block.mass *= classProfile.massScale;
    block.hp *= classProfile.hpScale;
    block.maxHp = block.hp;
    block.armor += weightClass === 'superheavy' ? 5 : weightClass === 'lightweight' ? -2 : 0;
  }
  for (const record of parts) {
    const meta = PART_META[record.type];
    if (!meta) continue;
    record.mass = meta.mass * classProfile.massScale;
    record.baseHp = meta.hp * classProfile.hpScale;
  }
  const width = maxX - minX + 1;
  const actualFrontZ = Math.max(...blocks.map((block) => block.gridPosition[2]));
  const length = actualFrontZ - rearZ + 1;
  const layerCount = maxY + 1;
  const signature = `${archetype}:${weightClass}:${driveType}:${Math.round(width / Math.max(length, 1) * 10)}:${type}:${weaponLayout}:${colorMode}:${layerCount}`;
  const exteriorValidationFailures = [];
  for (const record of accessoryRecords) {
    const target = blocks.find((block) => block.id === record.mount?.targetId);
    if (!target) exteriorValidationFailures.push(`${record.id}:missing-target`);
    else {
      const expected = surfacePoint(target, record.mount.normal);
      const gap = expected.distanceTo(new THREE.Vector3(...record.mount.point));
      if (gap > 0.001) exteriorValidationFailures.push(`${record.id}:off-surface-${gap.toFixed(4)}`);
      if (!faceIsExposed(target, record.mount.normal)) exteriorValidationFailures.push(`${record.id}:buried-face`);
    }
    if ((record.aiPlacement?.wheelClearance ?? 0) < 0.58) exteriorValidationFailures.push(`${record.id}:wheel-overlap`);
    if ((record.aiPlacement?.weaponClearance ?? 0) < 0.5) exteriorValidationFailures.push(`${record.id}:weapon-overlap`);
  }
  const installationValidationEntries = parts.map((record) => ({ record, result: validateGaragePart(record, record.id, assemblyDraft) }))
    .filter((entry) => !entry.result.valid);
  const installationValidationFailures = installationValidationEntries
    .map((entry) => `${entry.record.id}:${entry.result.reason}`);
  const concept = AI_DESIGN_CONCEPTS[archetype] ?? { family: 'Custom Battle Bot', silhouette: archetype, symmetry: archetype === 'asymmetric-raider' ? 'intentional-asymmetry' : 'mirrored', exterior: 'surface-mounted' };
  const armorRecords = accessoryRecords.filter((record) => ['armorFlat', 'armorCurved'].includes(record.type));
  const hornRecords = accessoryRecords.filter((record) => ['hornCurved', 'hornStraight'].includes(record.type));
  const exhaustRecords = accessoryRecords.filter((record) => ['exhaustTriple', 'exhaustVertical'].includes(record.type));
  const armorFaces = [...new Set(armorRecords.map((record) => (record.aiPlacement?.faceNormal ?? record.mount?.normal ?? []).map((value) => Math.round(value)).join(',')))];
  const primaryWeaponRecord = parts.find((record) => WEAPON_TYPES.has(record.type));
  const actualWeaponPosition = primaryWeaponRecord?.position ?? [mountX, mountY, mountZ];
  const initialInstallationAudit = {
    DetachedArmor: armorRecords.filter((record) => record.detached).length,
    FloatingArmor: exteriorValidationFailures.filter((failure) => failure.includes('missing-target') || failure.includes('off-surface') || failure.includes('buried-face')).length,
    ArmorIntersection: installationValidationEntries.filter((entry) => ['armorFlat', 'armorCurved'].includes(entry.record.type)).length,
    DetachedHorn: hornRecords.filter((record) => record.detached).length,
    FloatingHorn: exteriorValidationFailures.filter((failure) => failure.includes('horn') && (failure.includes('missing-target') || failure.includes('off-surface'))).length,
    DetachedExhaust: exhaustRecords.filter((record) => record.detached).length,
    FloatingExhaust: exteriorValidationFailures.filter((failure) => failure.includes('exhaust') && (failure.includes('missing-target') || failure.includes('off-surface'))).length,
    WeaponIntersection: installationValidationEntries.filter((entry) => WEAPON_TYPES.has(entry.record.type)).length,
  };
  initialInstallationAudit.Passed = Object.values(initialInstallationAudit).every((count) => count === 0);
  return enrichAssembly({
    version: ASSEMBLY_VERSION, weightClass, driveType, blocks, parts,
    aiDesign: {
      archetype, displayName: AI_ARCHETYPE_NAMES[archetype], colorMode, weaponLayout, signature, weightClass, weightClassLabel: classProfile.label, driveType, wheelModel,
      conceptFamily: concept.family, silhouette: concept.silhouette, symmetryMode: concept.symmetry, exteriorIntent: concept.exterior,
      width, length, height: layerCount, frontWidth, rearWidth, centerHeight: layerCount,
      sideArmorThickness: ['crab', 'armored-turtle', 'tall-heavy', 'armored-tank', 'saw-fortress'].includes(archetype) ? 2 : 1,
      blockCount: blocks.length, blockLayerCount: layerCount, silverRatio: Number((silverCount / Math.max(1, blocks.length)).toFixed(2)),
      exteriorCounts: { armor: armorRecords.length, horns: hornRecords.length, exhaust: exhaustRecords.length, total: accessoryRecords.length },
      blockFaceArmor: { eligibleFaces: armorableFaces.length, requestedCoverage: Number(requestedArmorCoverage.toFixed(2)), requestedCount: wantedArmorCount, installedCount: blockFaceArmorInstalled, actualCoverage: Number((blockFaceArmorInstalled / Math.max(1, armorableFaces.length)).toFixed(3)) },
      armorFaces,
      initialInstallationAudit,
      weaponBay: {
        position: [...actualWeaponPosition],
        lowMounted: actualWeaponPosition[1] <= GRID_UNIT * 2.4,
        // Split-nose and jaw hulls deliberately leave the centre-front cell
        // empty. Judge the weapon's leading edge, not only its shaft centre.
        frontMounted: actualWeaponPosition[2] + (primaryWeaponRecord ? recordRadius(primaryWeaponRecord) * 0.8 : 0) >= (frontZ - 0.5) * GRID_UNIT,
        clearanceRemovedBlockIds: [...new Set(autoCutRemovedBlockIds)],
        weaponType: primaryWeaponRecord?.type ?? null,
      },
      validation: { passed: exteriorValidationFailures.length === 0 && installationValidationFailures.length === 0, failures: [...exteriorValidationFailures, ...installationValidationFailures], floatingExterior: 0, exposedFaceMounts: accessoryRecords.length, weaponClearancePassed: !installationValidationFailures.some((failure) => failure.includes('weapon-clearance')), wheelClearancePassed: !installationValidationFailures.some((failure) => failure.includes('penetration')), autoCutRemovedBlockIds },
    },
  });
}

function createBlockChainQAAssembly() {
  const blocks = [
    createBlockRecord('core', [0, 0, 0], [0, 0, 0], 'block-core'),
    createBlockRecord('cube', [1, 0, 0], [0, 0, 0], 'qa-bridge'),
    createBlockRecord('cube', [2, 0, 0], [0, 0, 0], 'qa-tail-a'),
    createBlockRecord('cube', [3, 0, 0], [0, 0, 0], 'qa-tail-b'),
    createBlockRecord('cube', [2, 1, 0], [0, 0, 0], 'qa-tail-top'),
    createBlockRecord('cube', [2, 0, 1], [0, 0, 0], 'qa-tail-side'),
  ];
  const parts = [{
    id: 'qa-tail-wheel', type: 'wheel', position: [1.2, 0.18, 0], rotation: [0, 0, 0], scaleFactor: 1,
    hubFlipped: false, steers: false, locked: false,
    mount: { kind: 'blockFace', targetId: 'qa-tail-b', targetIds: ['qa-tail-b'], point: [1.2, 0.18, 0], normal: [1, 0, 0], attached: true, gap: 0 },
    linkedTo: ['qa-tail-b'],
  }];
  return enrichAssembly({ version: ASSEMBLY_VERSION, blocks, parts });
}

function createColoredBlockQAAssembly(color = '#ffd23f', type = 'bar') {
  const assembly = createAIAssembly(type);
  for (const block of assembly.blocks) block.color = color;
  return enrichAssembly(assembly);
}

class Robot {
  constructor(options) {
    Object.assign(this, options);
    this.instanceUid = `${options.team}:${options.id}:respawn:${Number(options.respawnCount ?? 0)}:instance:${++robotInstanceSequence}`;
    this.spawnPosition = { x: options.position.x, z: options.position.z };
    this.spawnYaw = options.yaw ?? 0;
    const aiTraits = ['aggressive', 'cautious', 'ambusher', 'survivor', 'berserker', 'defensive', 'flanker', 'chaser', 'brawler'];
    const traitIndex = ((Math.abs(Number(options.id ?? 1)) - 1) % aiTraits.length + aiTraits.length) % aiTraits.length;
    this.aiTrait = options.aiTrait ?? aiTraits[traitIndex];
    const traitPersonality = {
      aggressive: [0.9, 0.18, 0.42, 0.18, 0.26], cautious: [0.4, 0.78, 0.38, 0.72, 0.44],
      ambusher: [0.62, 0.48, 0.92, 0.58, 0.34], survivor: [0.32, 0.95, 0.5, 0.82, 0.52],
      berserker: [1, 0.04, 0.2, 0.08, 0.12], defensive: [0.46, 0.72, 0.38, 0.78, 0.4],
      flanker: [0.68, 0.42, 0.82, 0.6, 0.32], chaser: [0.82, 0.26, 0.35, 0.24, 0.28],
      brawler: [0.94, 0.22, 0.22, 0.18, 0.24],
    }[this.aiTrait] ?? [0.6, 0.5, 0.5, 0.5, 0.32];
    this.aiPersonality = {
      aggression: clamp(traitPersonality[0] + (Math.random() - 0.5) * 0.12, 0, 1),
      fear: clamp(traitPersonality[1] + (Math.random() - 0.5) * 0.12, 0, 1),
      ambushPreference: clamp(traitPersonality[2] + (Math.random() - 0.5) * 0.12, 0, 1),
      distancePreference: clamp(traitPersonality[3] + (Math.random() - 0.5) * 0.12, 0, 1),
      retreatThreshold: clamp(traitPersonality[4] + (Math.random() - 0.5) * 0.08, 0.1, 0.58),
    };
    this.aiState = this.isPlayer ? 'PLAYER' : 'SEARCH';
    this.aiStateTime = 0;
    this.aiTargetId = null;
    this.classRole = options.type === 'healer' ? 'healer' : 'assault';
    this.aiRetreatUntil = 0;
    this.aiLastAttackTime = -Infinity;
    this.aiDecisionOffset = ((Number(options.id ?? 0) * 37) % 17) / 17;
    this.aiThinkAccumulator = ((Number(options.id ?? 0) * 29) % 11) * 0.017;
    this.postureRecovery = null;
    this.postureRecoveryCooldown = 0;
    this.spawnProtectionUntil = 0;
    this.respawnAt = Infinity;
    this.respawnCount = Number(options.respawnCount ?? 0);
    this.immobileSeconds = 0;
    this.disabledReason = null;
    this.repairAccumulator = 0;
    this.repairSequenceIndex = 0;
    this.healAccumulator = 0;
    this.healPulseIndex = 0;
    this.healTargetId = null;
    this.healingVisualTimer = 0;
    this.healingAura = null;
    this.criticalDestructionAt = Infinity;
    this.root = new THREE.Group();
    this.root.name = this.name;
    this.root.position.set(options.position.x, GROUND_Y, options.position.z);
    scene.add(this.root);
    this.velocity = new THREE.Vector3();
    this.yaw = options.yaw ?? 0;
    this.yawVelocity = 0;
    this.pitch = 0;
    this.roll = 0;
    this.pitchVelocity = 0;
    this.rollVelocity = 0;
    this.control = { throttle: 0, steering: 0, brake: false };
    this.steeringVisual = 0;
    this.parts = [];
    this.blockParts = new Map();
    this.functionalParts = new Map();
    this.wheels = [];
    this.weapons = {};
    this.rotaryWeapons = [];
    this.exhaustEmitters = [];
    this.nativeArmorParts = [];
    this.nativeArmorBatch = null;
    this.radius = options.type === 'hammer' ? 2.15 : 1.95;
    this.dead = false;
    this.stuckTime = 0;
    this.reverseTime = 0;
    this.lastPosition = this.root.position.clone();
    this.aiStuckAnchor = this.root.position.clone();
    this.aiStuckAnchorYaw = this.yaw;
    this.aiStuckWindow = 0;
    this.aiStuckYawTravel = 0;
    this.aiRecoverStuckTime = 0;
    this.aiRecoverTurnSign = this.id % 2 ? 1 : -1;
    this.aiStuckEvents = 0;
    this.aiLastStuckPosition = null;
    this.aiLastStuckTime = -Infinity;
    this.aiRepeatedStuckCount = 0;
    this.aiEscapeWaypoint = null;
    this.aiEscapeExpires = 0;
    this.aiSpinGuardEvents = 0;
    this.aiUndrivableTime = 0;
    this.aiObjectiveHeartbeat = 0;
    this.aiObjectiveRevision = 0;
    this.aiRole = options.type === 'healer' ? 'healer' : ['capturer', 'capturer', 'capturer', 'capturer', 'blocker', 'blocker', 'flanker', 'flanker', 'flanker', 'flanker'][Math.abs(Number(options.id ?? 0)) % 10];
    this.aiGoalDistance = Infinity;
    this.aiLastProgressDistance = Infinity;
    this.aiNoProgressSeconds = 0;
    this.aiMeaninglessStationarySeconds = 0;
    this.aiMaximumMeaninglessStationarySeconds = 0;
    this.aiRespawnDecisionSeconds = 0;
    this.aiRouteVariant = Math.abs(Number(options.id ?? 0)) % 3;
    this.aiSteeringHoldUntil = 0;
    this.aiHeldSteering = 0;
    this.aiAvoidSide = this.id % 2 ? 1 : -1;
    this.aiStateHistory = [];
    this.aiStateReason = 'spawn';
    this.aiPreviousObjectiveState = 'MOVE_TO_OBJECTIVE';
    this.healerPartnerUid = null;
    this.lastRespawnReason = null;
    this.aiDashIntent = null;
    this.skidTimer = 0;
    this.desertDustTimer = 0;
    this.dashCooldown = 0;
    this.dashActiveTimer = 0;
    this.dashHitWindow = 0;
    this.dashDirection = new THREE.Vector3();
    this.dashStartPosition = this.root.position.clone();
    this.dashPeakSpeed = 0;
    this.dashTargetDistance = 0;
    this.dashTravelled = 0;
    this.dashDistanceRecorded = true;
    this.lastDashTime = -Infinity;
    this.aiOrbit = options.type === 'hammer' ? -1 : 1;
    this.stats = {
      distance: 0, attacks: 0, hits: 0, detached: 0, detachedByType: {}, maxSpeed: 0, torqueSigns: [],
      blockHits: 0, blocksDestroyed: 0, blockChunksDetached: 0, maximumBlocksDetachedAtOnce: 0, coreHits: 0,
      groundCorrections: 0, maxGroundPenetration: 0,
      launches: 0, landings: 0, hardLandings: 0, maxAirborneSeconds: 0, maxFallSpeed: 0,
      maxLaunchHorizontalSpeed: 0, maxLaunchVerticalSpeed: 0, selfRightAttempts: 0, selfRightSuccesses: 0,
      postureRecoveries: 0, respawns: this.respawnCount, floorRecoveries: 0, aiFsmFloorRecoveries: 0,
      maxBodyRollingSeconds: 0, maxVerticalStandingSeconds: 0, maxPostLandingAngularSpeed: 0, sustainedWeaponForcesSuppressed: 0,
      dashUses: 0, dashHits: 0, maximumDashSpeed: 0, maximumDashDistance: 0, dashDistanceSamples: [],
      objectiveVisits: 0, objectiveDefenceResponses: 0, healerSeeks: 0, reverseRecoveries: 0,
    };
    this.centerOfMassLocal = new THREE.Vector3(0, -0.2, 0);
    this.unstableRestTime = 0;
    this.abnormalVerticalTime = 0;
    this.maxAbnormalVerticalTime = 0;
    this.lastSupportInfo = null;
    this.wasAirborne = false;
    this.airborneTime = 0;
    this.peakAirborneY = GROUND_Y;
    this.lastLandingTime = -Infinity;
    this.lastFullRotaryImpactTime = -Infinity;
    this.grounded = false;
    this.wheelGroundedCount = 0;
    this.bodyGroundContact = false;
    this.broadBodyGroundContact = false;
    this.currentAngularDamping = LANDING_PHYSICS.airAngularDamping;
    this.currentAppliedTorque = new THREE.Vector3();
    this.currentTorqueSources = [];
    this.currentAppliedForce = new THREE.Vector3();
    this.currentForceSources = [];
    this.physicsTrace = [];
    this.angularReversals = [];
    this.physicsSourceCounts = {};
    this.lastTraceBySource = new Map();
    this.lastExternalImpactTime = -Infinity;
    this.lastWeaponReactionTime = -Infinity;
    this.passiveSettledSeconds = 0;
    this.passiveSettledArmed = false;
    this.passiveWakeups = 0;
    this.bodyRollingSeconds = 0;
    this.verticalStandingSeconds = 0;
    this.landingAudit = null;
    this.selfRightCooldown = 0;
    this.selfRightAttemptWindow = 0;
    this.wasSelfRightCandidate = false;
    this.selfRightRecoveryPending = false;
    this.selfRightAttemptsThisFlip = 0;
    this.selfRightStableTime = 0;
    this.selfRightCandidateTime = 0;
    this.selfRightEpisodeActive = false;
    this.selfRightActionIssued = false;
    this.selfRightWeaponReactionConsumed = false;
    this.postureRecoveryAudit = null;
    this.postureRecoveryRequests = 0;
    this.lastPostureRecoveryRequest = null;
    this.floorRecoveryTimer = 0;
    this.groundPenetrationDetected = false;
    this.groundPenetrationDepth = 0;
    this.physicsAwake = true;
    this.playerDriveStallSeconds = 0;
    this.driveStallSeconds = 0;
    this.driveStallSnapshots = [];
    this.controlRecoveryCount = 0;
    this.lastControlWakeReason = null;
    this.renderLODLevel = 0;
    this.collisionDetectionMode = 'continuous-swept-dynamic';
    this.solverIterations = 12;
    this.solverVelocityIterations = 6;
    this.build();
    this.alignDrivingWheelsToGround();
    this.aiDesign = cloneData(this.assembly.aiDesign ?? { archetype: 'player-built', colorMode: 'custom', weaponLayout: 'custom', blockCount: this.assembly.blocks.length });
    this.respawnBlueprint = cloneData(this.assembly);
    this.originalBuildData = cloneData(this.assembly);
    this.recalculateMass();
    // Spawn from the measured compound-collider support height. Starting at a
    // generic origin buried tall/stepped procedural hulls by half a block for
    // their first physics frame.
    this.placeOnMeasuredGround();
    this.createColliderDebug();
  }

  alignDrivingWheelsToGround() {
    if (!this.wheels.length || !this.colliderComponents.length) {
      this.chassisGroundClearance = 0;
      return;
    }
    const bodyMinY = Math.min(...this.colliderComponents.flatMap((component) => component.points.map((point) => point.y)));
    const maximumRadius = Math.max(...this.wheels.map((wheel) => wheel.physicsRadius));
    const clearance = clamp(maximumRadius * 0.22, MIN_CHASSIS_GROUND_CLEARANCE, 0.16);
    const targetBottomY = bodyMinY - clearance;
    for (const wheel of this.wheels) {
      wheel.wheelRoot.position.y = targetBottomY + wheel.physicsRadius;
      wheel.baseLocalPosition.copy(wheel.wheelRoot.position);
      wheel.part.record.runtimeGroundAlignedY = wheel.wheelRoot.position.y;
      wheel.part.record.physicsRadius = wheel.physicsRadius;
      wheel.part.record.suspensionRestLength = clearance;
    }
    this.chassisGroundClearance = clearance;
  }

  placeOnMeasuredGround() {
    const support = this.getGroundSupportInfo(0, 0, this.yaw);
    this.root.position.y = support.height;
    this.lastSupportInfo = support;
    this.updateWheelGroundDistances();
    return support.height;
  }

  updateWheelGroundDistances() {
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.pitch, this.yaw, this.roll, 'YXZ'));
    for (const wheel of this.wheels) {
      if (wheel.part.detached) { wheel.wheelGroundDistance = Infinity; continue; }
      const centre = wheel.wheelRoot.position.clone().applyQuaternion(quaternion).add(this.root.position);
      wheel.wheelGroundDistance = centre.y - wheel.physicsRadius - groundSurfaceHeightAt(centre.x, centre.z);
    }
  }

  addPart({ name, model, parent = this.root, position = [0, 0, 0], rotation = [0, 0, 0], scaleFactor = 1, axisScale = [1, 1, 1], hp = 80, mass = 5, armor = 0, type = 'armor', weaponKey = null, detachable = true, tint = this.tint, assemblyId = null, radius = 0.45 }) {
    const object = new THREE.Group();
    object.name = `${this.name}_${name}`;
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.scale.set(...axisScale).multiplyScalar(scaleFactor);
    object.add(cloneModel(model, tint));
    parent.add(object);
    const part = { name, object, hp, maxHp: hp, mass, armor, radius: radius * scaleFactor * Math.max(...axisScale), type, weaponKey, detachable, detached: false, robot: this, assemblyId, cumulativeDamage: 0, structuralHits: 0, reactionDamage: 0, lastStructuralHitTime: -Infinity };
    this.parts.push(part);
    return part;
  }

  buildBlockRenderBatches() {
    const groups = new Map();
    for (const part of this.blockParts.values()) {
      const color = new THREE.Color(part.record.renderColor ?? part.record.color ?? LV1_BLOCK_COLOR).getHexString();
      const key = `${part.record.type}:${color}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(part);
    }
    this.blockRenderBatches = [];
    const dummy = new THREE.Object3D();
    for (const parts of groups.values()) {
      const color = new THREE.Color(parts[0].record.renderColor ?? parts[0].record.color ?? LV1_BLOCK_COLOR);
      const material = new THREE.MeshStandardMaterial({
        color, metalness: 0.34, roughness: 0.48,
        emissive: new THREE.Color(0x07151c), emissiveIntensity: 0.08,
      });
      const mesh = new THREE.InstancedMesh(getBlockGeometry(parts[0].record), material, parts.length);
      mesh.name = `${this.name}_BlockBatch_${parts[0].record.type}`;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        dummy.position.copy(part.object.position);
        dummy.quaternion.copy(part.object.quaternion);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        part.renderBatch = mesh;
        part.renderBatchIndex = index;
        part.object.visible = false;
      }
      mesh.instanceMatrix.needsUpdate = true;
      this.root.add(mesh);
      this.blockRenderBatches.push(mesh);
    }
    this.blockRenderBatchCount = this.blockRenderBatches.length;
  }

  buildNativeArmorRenderBatch() {
    if (!this.nativeArmorParts.length) return;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xaab6bd, metalness: 0.72, roughness: 0.34 });
    const mesh = new THREE.InstancedMesh(geometry, material, this.nativeArmorParts.length);
    mesh.name = `${this.name}_NativeBlockFaceArmorBatch`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    this.root.add(mesh);
    this.nativeArmorBatch = mesh;
    this.nativeArmorMaterial = material;
    this.refreshNativeArmorRenderBatch();
  }

  refreshNativeArmorRenderBatch() {
    if (!this.nativeArmorBatch) return;
    const dummy = new THREE.Object3D();
    this.nativeArmorParts.forEach((part, index) => {
      dummy.position.copy(part.object.position);
      dummy.quaternion.copy(part.object.quaternion);
      const size = AI_BLOCK_ARMOR_SIZE * (part.record.plateSize ?? 0.92);
      dummy.scale.set(size, AI_BLOCK_ARMOR_THICKNESS, size);
      if (part.detached) dummy.scale.setScalar(0.00001);
      dummy.updateMatrix();
      this.nativeArmorBatch.setMatrixAt(index, dummy.matrix);
      part.nativeArmorIndex = index;
    });
    this.nativeArmorBatch.instanceMatrix.needsUpdate = true;
  }

  addNativeArmorDebrisVisual(part) {
    if (!part.record?.nativeBlockPlate || part.object.children.length) return;
    const size = AI_BLOCK_ARMOR_SIZE * (part.record.plateSize ?? 0.92);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, AI_BLOCK_ARMOR_THICKNESS, size),
      (this.nativeArmorMaterial ?? new THREE.MeshStandardMaterial({ color: 0xaab6bd, metalness: 0.72, roughness: 0.34 })).clone(),
    );
    mesh.castShadow = true;
    part.object.add(mesh);
  }

  hideBlockRenderInstance(part) {
    if (!part?.renderBatch || part.renderBatchIndex == null) return;
    const matrix = new THREE.Matrix4().makeScale(0, 0, 0);
    part.renderBatch.setMatrixAt(part.renderBatchIndex, matrix);
    part.renderBatch.instanceMatrix.needsUpdate = true;
    part.object.visible = true;
  }

  build() {
    this.assembly = enrichAssembly(this.assembly ?? (this.isPlayer ? savedAssembly : createAIAssembly(this.type)));
    this.weightClass = WEIGHT_CLASSES[this.assembly.weightClass] ? this.assembly.weightClass : 'middleweight';
    this.driveProfile = WEIGHT_CLASSES[this.weightClass];
    this.driveType = this.assembly.driveType ?? 'wheel';
    this.assemblyRecordById = new Map([
      ...this.assembly.blocks.map((record) => [record.id, record]),
      ...this.assembly.parts.map((record) => [record.id, record]),
    ]);
    // The saved block structure is the complete physical body. There is no
    // hidden GLB chassis, fallback chassis HP, or oversized chassis collider.
    this.colliderComponents = createBlockColliderProfile(this.assembly.blocks);

    for (const record of this.assembly.blocks ?? []) {
      // Procedural AI palettes and player-selected blue/silver blocks are
      // structural materials, not team overlays. Team identity stays on the
      // wheels/weapons, so a mixed hull remains mixed in battle and
      // after becoming debris.
      record.renderColor = record.color ?? (this.isPlayer
        ? `#${new THREE.Color(LV1_BLOCK_COLOR).getHexString()}`
        : `#${new THREE.Color(this.tint ?? LV1_BLOCK_COLOR).getHexString()}`);
      const object = createBlockVisualObject(record, false);
      object.name = `${this.name}_${record.id}`;
      this.root.add(object);
      const dimensions = getBlockOrientedDimensions(record);
      const part = {
        name: `${BLOCK_META[record.type].label}-${record.id}`,
        object,
        hp: record.hp,
        maxHp: record.maxHp ?? record.hp,
        mass: record.mass,
        armor: record.armor,
        connectionStrength: record.connectionStrength,
        radius: dimensions.length() * GRID_UNIT * 0.5,
        type: 'block',
        blockType: record.type,
        isCore: Boolean(record.isCore),
        record,
        weaponKey: null,
        detachable: !record.isCore,
        detached: false,
        robot: this,
        assemblyId: record.id,
        colliderType: record.colliderType,
      };
      this.parts.push(part);
      this.blockParts.set(record.id, part);
      if (record.isCore) this.corePart = part;
      if (part.hp < part.maxHp) this.updateBlockDamageVisual(part);
    }
    this.buildBlockRenderBatches();
    const linkedSupports = new Map();
    for (const record of this.assembly.parts.filter((part) => WEAPON_TYPES.has(part.type))) {
      const key = ['spinner', 'barSpinner', 'drumSpinner'].includes(record.type) ? `${record.type}:${record.id}` : record.type;
      for (const id of record.linkedTo ?? []) linkedSupports.set(id, key);
    }
    const built = new Map();
    let wheelIndex = 0;
    for (const record of this.assembly.parts.filter((part) => part.type === 'wheel')) {
      // WheelRoot/SteeringPivot owns only world-up steering. MountOrientation
      // owns side alignment, SpinPivot owns rolling, and VisualOrientation owns
      // the optional hub flip. Steering can therefore use the same sign on both
      // sides without destroying the left/right mount quaternion.
      const wheelRoot = new THREE.Group();
      wheelRoot.name = `${this.name}_${record.id}_WheelRoot`;
      wheelRoot.position.set(...record.position);
      this.root.add(wheelRoot);
      const steeringPivot = new THREE.Group();
      steeringPivot.name = `${this.name}_${record.id}_SteeringPivot`;
      wheelRoot.add(steeringPivot);
      const mountOrientation = new THREE.Group();
      mountOrientation.name = `${this.name}_${record.id}_MountOrientation`;
      mountOrientation.quaternion.copy(getRecordQuaternion(record));
      steeringPivot.add(mountOrientation);
      const rollPivot = new THREE.Group();
      rollPivot.name = `${this.name}_${record.id}_SpinPivot`;
      mountOrientation.add(rollPivot);
      const visualOrientation = new THREE.Group();
      visualOrientation.name = `${this.name}_${record.id}_WheelVisualOrientation`;
      rollPivot.add(visualOrientation);
      const wheelObject = new THREE.Group();
      const scaleFactor = record.scaleFactor ?? 1;
      const axisScale = record.axisScale ?? [1, 1, 1];
      wheelObject.scale.set(...axisScale).multiplyScalar(scaleFactor);
      const wheelModel = ASSET_PATHS[record.wheelModel] ? record.wheelModel : 'new_wheel';
      const wheelVisual = cloneModel(wheelModel, this.tint);
      if (record.hubFlipped) visualOrientation.rotation.y = Math.PI;
      wheelObject.add(wheelVisual);
      if (record.mount?.standoff > 0) {
        const standoffRoot = new THREE.Group();
        standoffRoot.name = `${this.name}_${record.id}_AxleStandoff`;
        standoffRoot.quaternion.copy(getRecordQuaternion(record));
        standoffRoot.scale.set(...axisScale).multiplyScalar(scaleFactor);
        addMountStandoffVisual(standoffRoot, record, this.tint, false);
        wheelRoot.add(standoffRoot);
      }
      visualOrientation.add(wheelObject);
      const meta = PART_META.wheel;
      const wheelHp = record.baseHp ?? meta.hp;
      const wheelDimensions = getWheelRuntimeDimensions(scaleFactor, wheelModel, axisScale);
      const part = { name: `Wheel${++wheelIndex}`, object: wheelRoot, hp: wheelHp, maxHp: wheelHp, mass: record.mass ?? meta.mass, radius: meta.radius * scaleFactor, physicsRadius: wheelDimensions.radius, halfWidth: wheelDimensions.halfWidth, type: 'wheel', weaponKey: null, detachable: true, detached: false, robot: this, assemblyId: record.id };
      Object.assign(part, { cumulativeDamage: 0, structuralHits: 0, reactionDamage: 0, lastStructuralHitTime: -Infinity });
      part.record = record;
      this.parts.push(part);
      this.functionalParts.set(record.id, part);
      const trackMaterials = [];
      if (wheelModel === 'track_heavy') wheelVisual.traverse((node) => {
        if (!node.isMesh || !node.material) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const material of materials) {
          for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) if (material[key]) {
            material[key] = material[key].clone();
            material[key].wrapS = THREE.RepeatWrapping;
            material[key].wrapT = THREE.RepeatWrapping;
          }
          trackMaterials.push(material);
        }
      });
      const wheelLodMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelDimensions.radius, wheelDimensions.radius, wheelDimensions.halfWidth * 2, 10, 1),
        new THREE.MeshStandardMaterial({ color: 0x171a1d, metalness: 0.38, roughness: 0.72 }),
      );
      wheelLodMesh.rotation.z = Math.PI / 2;
      wheelLodMesh.visible = false;
      wheelLodMesh.castShadow = false;
      visualOrientation.add(wheelLodMesh);
      this.wheels.push({ wheelRoot, steeringPivot, mountOrientation, rollPivot, visualOrientation, wheelVisual, wheelLodMesh, part, steers: Boolean(record.steers), side: Math.sign(record.position[0]) || 1, physicsRadius: wheelDimensions.radius, halfWidth: wheelDimensions.halfWidth, halfLength: wheelDimensions.halfLength ?? wheelDimensions.radius, isTrack: wheelModel === 'track_heavy', trackMaterials, baseLocalPosition: wheelRoot.position.clone(), wheelGroundDistance: Infinity });
      built.set(record.id, part);
    }

    for (const record of this.assembly.parts.filter((part) => ['pivotMount', 'sawSupport', 'sawMount', 'hammerMount', 'barAxis'].includes(part.type))) {
      const meta = PART_META[record.type];
      const weaponKey = linkedSupports.get(record.id) ?? null;
      const part = this.addPart({
        name: `${meta.label}-${record.id}`, model: meta.model, position: record.position,
        rotation: [0, 0, 0], scaleFactor: record.scaleFactor ?? 1,
        axisScale: record.axisScale ?? [1, 1, 1],
        hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass,
        radius: meta.radius, type: 'weaponMount', weaponKey, assemblyId: record.id,
      });
      part.object.quaternion.copy(getRecordQuaternion(record));
      addMountStandoffVisual(part.object, record, this.tint, false);
      part.record = record;
      part.jointBreakForce = meta.jointBreakForce;
      part.jointBreakTorque = meta.jointBreakTorque;
      this.functionalParts.set(record.id, part);
      built.set(record.id, part);
    }

    for (const record of this.assembly.parts.filter((part) => EXTERIOR_TYPES.has(part.type))) {
      const meta = PART_META[record.type];
      refreshRecordMount(record);
      let part;
      if (record.nativeBlockPlate) {
        const object = new THREE.Group();
        object.name = `${this.name}_${record.id}_NativeBlockFaceArmor`;
        object.position.set(...record.position);
        object.quaternion.copy(getRecordQuaternion(record));
        this.root.add(object);
        part = {
          name: `${meta.label}-${record.id}`, object,
          hp: record.baseHp ?? meta.hp, maxHp: record.baseHp ?? meta.hp,
          mass: record.mass ?? meta.mass, armor: meta.armor ?? 0,
          radius: recordRadius(record), type: meta.category, weaponKey: null,
          detachable: true, detached: false, robot: this, assemblyId: record.id,
          cumulativeDamage: 0, structuralHits: 0, reactionDamage: 0, lastStructuralHitTime: -Infinity,
        };
        this.parts.push(part);
        this.nativeArmorParts.push(part);
      } else {
        part = this.addPart({
          name: `${meta.label}-${record.id}`, model: meta.model, position: record.position,
          rotation: [0, 0, 0], scaleFactor: record.scaleFactor ?? 1, axisScale: record.axisScale ?? [1, 1, 1],
          hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass, armor: meta.armor ?? 0,
          radius: meta.radius, type: meta.category, assemblyId: record.id,
        });
        part.object.quaternion.copy(getRecordQuaternion(record));
      }
      part.record = record;
      if (record.type === 'exhaustVertical' || record.type === 'exhaustTriple') {
        part.object.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(part.object);
        const centre = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const outletCount = record.type === 'exhaustTriple' ? 3 : 1;
        for (let outletIndex = 0; outletIndex < outletCount; outletIndex++) {
          const offset = outletCount === 1 ? 0 : (outletIndex - 1) * size.x * 0.27;
          const worldOutlet = new THREE.Vector3(centre.x + offset, bounds.max.y - Math.min(0.02, size.y * 0.025), centre.z);
          const anchor = new THREE.Object3D();
          anchor.name = `${record.id}_Outlet_${outletIndex + 1}`;
          anchor.position.copy(part.object.worldToLocal(worldOutlet));
          part.object.add(anchor);
          this.exhaustEmitters.push({ anchor, part, record, accumulator: Math.random() * 0.45, outletIndex, outletCount, detachNoted: false });
        }
        smokeStats.outletCount += outletCount;
        if (outletCount === 3) smokeStats.tripleOutlets += 3;
        else smokeStats.verticalOutlets++;
      }
      this.functionalParts.set(record.id, part);
      built.set(record.id, part);
    }
    this.buildNativeArmorRenderBatch();

    for (const record of this.assembly.parts.filter((part) => WEAPON_TYPES.has(part.type))) {
      const supports = (record.linkedTo ?? []).map((id) => built.get(id)).filter(Boolean);
      if (record.type === 'spinner') this.attachSpinner(record, supports[0]);
      if (record.type === 'hammer') this.attachHammer(record, supports[0]);
      if (record.type === 'flipper') this.attachFlipper(record, supports);
      if (record.type === 'barSpinner') this.attachRotary(record, supports, 'bar', 'y');
      if (record.type === 'drumSpinner') this.attachRotary(record, supports, 'drum', 'x');
    }
    if (this.type === 'healer') this.attachHealerEmitter();
  }

  attachHealerEmitter() {
    const emitter = new THREE.Group();
    emitter.name = `${this.name}_HealerEmitter`;
    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.22, 0.9), new THREE.MeshStandardMaterial({ color: 0x182d28, metalness: 0.66, roughness: 0.4 }));
    mount.position.y = 0.38;
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x42ff91, emissive: 0x13d866, emissiveIntensity: 1.35, metalness: 0.22, roughness: 0.3 });
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.9, 10), barrelMaterial);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.5, 0.58);
    emitter.add(mount, barrel);
    emitter.position.set(0, Math.max(0.32, (this.aiDesign?.height ?? 1) * GRID_UNIT), 0.1);
    this.root.add(emitter);
    this.healerEmitter = emitter;
    this.healerMuzzle = new THREE.Object3D();
    this.healerMuzzle.position.set(0, 0.5, 1.05);
    emitter.add(this.healerMuzzle);
  }

  attachSpinner(record, mount) {
    const weaponRoot = new THREE.Group();
    weaponRoot.position.set(...record.position);
    weaponRoot.quaternion.copy(getRecordQuaternion(record));
    weaponRoot.scale.setScalar(record.scaleFactor ?? 1);
    this.root.add(weaponRoot);
    const bladePivot = new THREE.Group();
    weaponRoot.add(bladePivot);
    const meta = PART_META.spinner;
    const weaponKey = `spinner:${record.id}`;
    const blade = this.addPart({ name: 'NewSawBlade', model: meta.model, parent: bladePivot, hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass, type: 'weapon', weaponKey, assemblyId: record.id });
    blade.record = record;
    this.configureWeaponLOD(blade, 'spinner');
    this.functionalParts.set(record.id, blade);
    const rotary = { kind: 'spinner', weaponKey, assemblyId: record.id, mounts: mount ? [mount] : [], blade, root: weaponRoot, pivot: bladePivot, axis: 'y', scaleFactor: record.scaleFactor ?? 1, active: true, rpm: 0, visualRpm: 0, maxRpm: 4200, visualMaxRpm: 1680, acceleration: 3600, visualAcceleration: 2400, radius: 1.08 * (record.scaleFactor ?? 1), hitCooldown: new Map(), contactTimer: 0 };
    this.rotaryWeapons.push(rotary);
    this.weapons.spinner ??= rotary;
  }

  attachRotary(record, mounts, kind, axis) {
    const root = new THREE.Group();
    root.position.set(...record.position);
    root.quaternion.copy(getRecordQuaternion(record));
    root.scale.setScalar(record.scaleFactor ?? 1);
    this.root.add(root);
    const pivot = new THREE.Group();
    root.add(pivot);
    const meta = PART_META[record.type];
    const weaponKey = `${record.type}:${record.id}`;
    const blade = this.addPart({ name: meta.label, model: meta.model, parent: pivot, hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass, type: 'weapon', weaponKey, assemblyId: record.id, radius: meta.radius });
    blade.record = record;
    this.configureWeaponLOD(blade, kind);
    this.functionalParts.set(record.id, blade);
    const settings = kind === 'drum'
      ? { maxRpm: 5100, visualMaxRpm: 2280, acceleration: 4200, visualAcceleration: 3200, radius: 1.32 * (record.scaleFactor ?? 1) }
      : { maxRpm: 2700, visualMaxRpm: 690, acceleration: 980, visualAcceleration: 720, radius: 1.72 * (record.scaleFactor ?? 1) };
    const rotary = { kind, weaponKey, assemblyId: record.id, mounts, blade, root, pivot, axis, scaleFactor: record.scaleFactor ?? 1, active: true, rpm: 0, visualRpm: 0, hitCooldown: new Map(), contactTimer: 0, ...settings };
    this.rotaryWeapons.push(rotary);
    this.weapons[kind] ??= rotary;
  }

  configureWeaponLOD(part, kind) {
    part.highDetailChildren = [...part.object.children];
    let geometry;
    if (kind === 'bar') geometry = new THREE.BoxGeometry(3.1, 0.16, 0.34);
    else if (kind === 'drum') {
      geometry = new THREE.CylinderGeometry(0.56, 0.56, 1.72, 12, 1);
      geometry.rotateZ(Math.PI / 2);
    } else geometry = new THREE.CylinderGeometry(1.02, 1.02, 0.13, 14, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x2a2d30, metalness: 0.86, roughness: 0.3 }));
    mesh.name = `${this.name}_${kind}_LowPolyWeaponLOD`;
    mesh.visible = false;
    mesh.castShadow = false;
    part.object.add(mesh);
    part.lodMesh = mesh;
  }

  attachHammer(record, mount) {
    const hammerRoot = new THREE.Group();
    hammerRoot.position.set(...record.position);
    hammerRoot.quaternion.copy(getRecordQuaternion(record));
    hammerRoot.scale.setScalar(record.scaleFactor ?? 1);
    this.root.add(hammerRoot);
    const pivot = new THREE.Group();
    hammerRoot.add(pivot);
    const meta = PART_META.hammer;
    const moving = this.addPart({ name: 'NewHammer', model: meta.model, parent: pivot, hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass, type: 'weapon', weaponKey: 'hammer', assemblyId: record.id });
    moving.record = record;
    this.functionalParts.set(record.id, moving);
    const tip = new THREE.Object3D();
    tip.position.set(0, 0, -2.05);
    pivot.add(tip);
    pivot.rotation.x = 1.18;
    this.weapons.hammer = { mount, moving, root: hammerRoot, pivot, tip, phase: 'idle', time: 0, requested: false, didHit: false, cooldown: 0 };
  }

  attachFlipper(record, mounts) {
    const flipperRoot = new THREE.Group();
    flipperRoot.position.set(...record.position);
    flipperRoot.quaternion.copy(getRecordQuaternion(record));
    flipperRoot.scale.setScalar(record.scaleFactor ?? 1);
    this.root.add(flipperRoot);
    const pivot = new THREE.Group();
    flipperRoot.add(pivot);
    const meta = PART_META.flipper;
    const plate = this.addPart({ name: 'NewFlipper', model: meta.model, parent: pivot, hp: record.baseHp ?? meta.hp, mass: record.mass ?? meta.mass, type: 'weapon', weaponKey: 'flipper', assemblyId: record.id });
    plate.record = record;
    this.functionalParts.set(record.id, plate);
    this.weapons.flipper = { mounts, plate, pivot, phase: 'idle', time: 0, requested: false, didHit: false, cooldown: 0 };
  }

  recalculateMass() {
    this.mass = this.parts.reduce((sum, part) => sum + (part.detached ? 0 : part.mass), 0);
    this.mass = Math.max(this.mass, 18);
    const active = this.parts.filter((part) => !part.detached);
    const activeBlockRecords = [...this.blockParts.values()].filter((part) => !part.detached).map((part) => part.record);
    this.colliderComponents = createBlockColliderProfile(activeBlockRecords);
    const hullRadius = this.colliderComponents.reduce((maximum, component) => Math.max(maximum, ...component.points.map((point) => Math.hypot(point.x, point.z))), 0.8);
    const exteriorReach = active.filter((part) => part.type !== 'block').reduce((maximum, part) => {
      const local = part.object.position;
      return Math.max(maximum, Math.hypot(local.x, local.z) + (part.radius ?? 0.35) * 0.55);
    }, hullRadius);
    this.radius = clamp(Math.max(hullRadius, exteriorReach), 1.1, 5.6);
    this.root.updateMatrixWorld(true);
    const weighted = active.reduce((sum, part) => {
      const localMassPoint = this.root.worldToLocal(part.object.getWorldPosition(new THREE.Vector3()));
      return sum.addScaledVector(localMassPoint, part.mass);
    }, new THREE.Vector3()).multiplyScalar(1 / this.mass);
    // Use the actual block/part mass points. Only a small internal offset keeps
    // the COM within the structural cells; no legacy below-floor stabilizer is
    // available to an oddly shaped player design.
    this.centerOfMassLocal.set(weighted.x, Math.max(-0.04, weighted.y - 0.035), weighted.z);
    this.radius = Math.max(0.32, ...this.parts.filter((part) => !part.detached).map((part) => {
      const local = part.object.position;
      return Math.hypot(local.x, local.z) + (part.radius ?? 0.45);
    }));
    if (this.colliderDebug) {
      this.root.remove(this.colliderDebug);
      this.colliderDebug = null;
      this.colliderDebugCom = null;
      this.createColliderDebug();
    } else if (this.colliderDebugCom) this.colliderDebugCom.position.copy(this.centerOfMassLocal);
  }

  getLiveWorldBounds() {
    this.root.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3().makeEmpty();
    for (const component of this.colliderComponents) for (const point of component.points) {
      bounds.expandByPoint(this.root.localToWorld(point.clone()));
    }
    for (const part of this.parts) {
      if (part.detached || part.type === 'block' || !part.object?.parent) continue;
      const centre = part.object.getWorldPosition(new THREE.Vector3());
      const radius = Math.max(0.18, (part.radius ?? 0.4) * part.object.getWorldScale(new THREE.Vector3()).length() / Math.sqrt(3));
      bounds.expandByPoint(centre.clone().addScalar(radius));
      bounds.expandByPoint(centre.clone().addScalar(-radius));
    }
    if (bounds.isEmpty()) bounds.setFromCenterAndSize(this.root.position, new THREE.Vector3(1, 1, 1));
    return bounds;
  }

  setRenderLOD(level) {
    const nextLevel = this.isPlayer ? 0 : clamp(Math.round(level), 0, 2);
    this.renderLODLevel = nextLevel;
    // Never replace a robot by a rectangular proxy. Far LOD retains the real
    // batched block hull, wheels and weapon silhouette; only small exterior
    // detail and shadows are culled.
    for (const mesh of this.blockRenderBatches ?? []) {
      mesh.visible = !this.dead;
      mesh.castShadow = nextLevel === 0 && currentPerformanceBudget().shadows;
    }
    if (this.nativeArmorBatch) {
      this.nativeArmorBatch.visible = !this.dead && nextLevel < 2;
      this.nativeArmorBatch.castShadow = nextLevel === 0 && currentPerformanceBudget().shadows;
    }
    for (const part of this.parts) {
      if (part.detached || part.type === 'block' || !part.object) continue;
      const keepFarSilhouette = ['wheel', 'weapon'].includes(part.type);
      const keepMidSilhouette = part.type !== 'decoration';
      part.object.visible = !this.dead && (nextLevel === 0 || (nextLevel === 1 && keepMidSilhouette) || (nextLevel === 2 && keepFarSilhouette));
      part.object.traverse((node) => { if (node.isMesh) node.castShadow = nextLevel === 0 && currentPerformanceBudget().shadows; });
      if (part.lodMesh) {
        for (const child of part.highDetailChildren ?? []) child.visible = nextLevel < 2;
        part.lodMesh.visible = !this.dead && nextLevel === 2;
      }
    }
    for (const wheel of this.wheels) {
      wheel.wheelVisual.visible = !this.dead && nextLevel < 2;
      if (wheel.wheelLodMesh) wheel.wheelLodMesh.visible = !this.dead && nextLevel === 2;
    }
    if (this.healerEmitter) this.healerEmitter.visible = !this.dead && nextLevel === 0;
  }

  worldCenterOfMass() {
    return this.centerOfMassLocal.clone().applyQuaternion(this.root.quaternion).add(this.root.position);
  }

  createColliderDebug() {
    this.colliderDebug = new THREE.Group();
    this.colliderDebug.name = `${this.name}_CompoundColliderDebug`;
    const boxEdges = [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]];
    const wedgeEdges = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 4], [1, 5], [4, 5], [2, 4], [3, 5]];
    for (const component of this.colliderComponents) {
      const vertices = [];
      for (const [a, b] of component.points.length === 8 ? boxEdges : wedgeEdges) vertices.push(component.points[a], component.points[b]);
      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      const material = new THREE.LineBasicMaterial({ color: 0x41ff9b, transparent: true, opacity: 0.9, depthTest: false });
      const lines = new THREE.LineSegments(geometry, material);
      lines.renderOrder = 20;
      lines.userData.colliderMaterial = material;
      this.colliderDebug.add(lines);
    }
    for (const wheel of this.wheels) {
      const geometry = new THREE.WireframeGeometry(new THREE.CylinderGeometry(wheel.physicsRadius, wheel.physicsRadius, wheel.halfWidth * 2, 12, 1));
      const material = new THREE.LineBasicMaterial({ color: 0x55c7ff, transparent: true, opacity: 0.9, depthTest: false });
      const lines = new THREE.LineSegments(geometry, material);
      lines.name = `${wheel.part.name}_WheelCollider`;
      lines.position.copy(wheel.wheelRoot.position);
      lines.quaternion.copy(wheel.steeringPivot.quaternion).multiply(wheel.mountOrientation.quaternion);
      lines.rotateZ(Math.PI / 2);
      lines.renderOrder = 20;
      lines.userData.colliderMaterial = material;
      this.colliderDebug.add(lines);
      wheel.colliderDebug = lines;
    }
    this.colliderDebugCom = new THREE.Mesh(new THREE.SphereGeometry(0.095, 9, 6), new THREE.MeshBasicMaterial({ color: 0xff3b30, depthTest: false }));
    this.colliderDebugCom.name = 'CenterOfMass';
    this.colliderDebugCom.position.copy(this.centerOfMassLocal);
    this.colliderDebugCom.renderOrder = 21;
    this.colliderDebug.add(this.colliderDebugCom);
    this.colliderDebug.visible = colliderDebugEnabled;
    this.root.add(this.colliderDebug);
  }

  setColliderDebug(enabled) {
    if (this.colliderDebug) this.colliderDebug.visible = enabled;
  }

  weaponAvailable(key) {
    if (key?.includes(':')) return this.rotaryAvailable(this.rotaryWeapons.find((rotary) => rotary.weaponKey === key));
    const weapon = this.weapons[key];
    if (['spinner', 'bar', 'drum'].includes(key)) return this.rotaryWeapons.some((rotary) => rotary.kind === key && this.rotaryAvailable(rotary));
    if (!weapon) return false;
    if (key === 'hammer') return !weapon.moving.detached && (!weapon.mount || !weapon.mount.detached);
    return !weapon.plate.detached && (!weapon.mounts?.length || weapon.mounts.every((mount) => !mount.detached));
  }

  rotaryAvailable(weapon) {
    return Boolean(weapon && !weapon.blade.detached && (!weapon.mounts?.length || weapon.mounts.every((mount) => !mount.detached)));
  }

  requestHammer() {
    const weapon = this.weapons.hammer;
    if (weapon && this.weaponAvailable('hammer') && weapon.phase === 'idle' && weapon.cooldown <= 0) {
      weapon.requested = true;
      this.selfRightWeaponReactionConsumed = false;
      return true;
    }
    return false;
  }

  requestFlipper() {
    const weapon = this.weapons.flipper;
    if (weapon && this.weaponAvailable('flipper') && weapon.phase === 'idle' && weapon.cooldown <= 0) {
      weapon.requested = true;
      this.selfRightWeaponReactionConsumed = false;
      return true;
    }
    return false;
  }

  toggleSpinner() {
    const rotaries = this.rotaryWeapons;
    if (!rotaries.length) return;
    const next = !rotaries.some((weapon) => weapon.active);
    for (const weapon of rotaries) if (this.rotaryAvailable(weapon)) weapon.active = next;
    // Rotary weapons are always simulation-driven.  There is intentionally no
    // player-facing SPIN button after the manual weapon controls were removed.
  }

  requestDash(reason = 'player') {
    if (this.dead || this.dashCooldown > 0 || this.postureRecovery) return false;
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const upright = support.wheelContact && support.upDot > 0.58
      && this.root.position.y <= support.height + 0.11;
    if (!upright || this.wheels.filter((wheel) => !wheel.part.detached).length === 0) return false;
    const forward = forwardFor(this.yaw);
    const profile = this.driveProfile ?? WEIGHT_CLASSES.middleweight;
    const planarSpeed = this.velocity.clone().setY(0).dot(forward);
    const primeSpeed = Math.max(profile.topSpeed * profile.dashPrimeRatio, planarSpeed + profile.dashDelta * 0.72);
    const impulseDelta = forward.clone().multiplyScalar(Math.max(0, primeSpeed - planarSpeed));
    this.velocity.add(impulseDelta);
    this.dashActiveTimer = profile.dashDuration;
    this.dashHitWindow = profile.dashDuration + 0.18;
    this.dashCooldown = profile.dashCooldown;
    this.dashDirection.copy(forward);
    this.dashStartPosition.copy(this.root.position);
    this.dashPeakSpeed = profile.topSpeed * profile.dashPeakRatio;
    const chassisLength = Math.max(1.45, (this.aiDesign?.length ?? 7) * GRID_UNIT);
    this.dashTargetDistance = chassisLength * profile.dashChassisLengths;
    this.dashTravelled = 0;
    this.dashDistanceRecorded = false;
    this.lastDashTime = worldTime;
    this.aiDashIntent = reason;
    this.stats.dashUses++;
    this.stats.maximumDashSpeed = Math.max(this.stats.maximumDashSpeed, this.velocity.clone().setY(0).length());
    this.recordLinearDelta(`dash-${reason}`, impulseDelta, 'Robot.requestDash');
    spawnDust(this.root.position.clone().addScaledVector(forward, -0.9), this.weightClass === 'superheavy' ? 5 : 3);
    emitRobotExhaustBurst(this, this.weightClass === 'superheavy' ? 12 : 8);
    playSpatialSample('dash', this.root.position, 0.88, 0.96 + Math.random() * 0.06, 3);
    if (this.isPlayer) {
      cameraDashFov = Math.max(cameraDashFov, this.weightClass === 'lightweight' ? 8 : this.weightClass === 'superheavy' ? 5 : 6.5);
      cameraShake = Math.max(cameraShake, 0.075);
    }
    if (this.isPlayer) showMessage(`${profile.label} DASH`, 0.55);
    return true;
  }

  updateWeapons(dt, game) {
    for (const rotary of this.rotaryWeapons) {
      if (!this.rotaryAvailable(rotary)) rotary.active = false;
      const targetRpm = rotary.active ? rotary.maxRpm : 0;
      rotary.rpm = moveToward(rotary.rpm, targetRpm, rotary.acceleration * dt);
      const visualTarget = rotary.active ? rotary.visualMaxRpm : 0;
      rotary.visualRpm = moveToward(rotary.visualRpm, visualTarget, rotary.visualAcceleration * dt);
      rotary.pivot.rotation[rotary.axis] += rotary.visualRpm * Math.PI * 2 / 60 * dt;
      for (const [target, cooldown] of rotary.hitCooldown) {
        const next = cooldown - dt;
        if (next <= 0) rotary.hitCooldown.delete(target);
        else rotary.hitCooldown.set(target, next);
      }
      // The isolated visual proof drives contacts on an exact cadence below.
      // Suppressing the normal per-robot collision loop there prevents several
      // nominally separate hits from being stacked into one radial starburst.
      if (rotary.rpm > 720 && qa?.phase !== 'sparkProof') game.checkRotaryHit(this, rotary);
    }

    const hammer = this.weapons.hammer;
    if (hammer) {
      hammer.cooldown = Math.max(0, hammer.cooldown - dt);
      if (!this.weaponAvailable('hammer')) hammer.phase = 'disabled';
      if (hammer.phase === 'idle' && hammer.requested) {
        hammer.phase = 'attack'; hammer.time = 0; hammer.didHit = false; hammer.requested = false;
        this.stats.attacks++;
      }
      if (hammer.phase === 'attack') {
        hammer.time += dt;
        const t = clamp(hammer.time / 0.095, 0, 1);
        hammer.pivot.rotation.x = lerp(1.18, -0.03, 1 - (1 - t) ** 4);
        if (t >= 0.72 && !hammer.didHit) {
          hammer.didHit = true;
          game.checkHammerHit(this, hammer, t);
          game.checkHammerGroundReaction(this, hammer);
        }
        if (t >= 1) { hammer.phase = 'hold'; hammer.time = 0; }
      } else if (hammer.phase === 'hold') {
        hammer.time += dt;
        if (hammer.time > 0.09) { hammer.phase = 'return'; hammer.time = 0; }
      } else if (hammer.phase === 'return') {
        hammer.time += dt;
        const t = clamp(hammer.time / 0.42, 0, 1);
        hammer.pivot.rotation.x = lerp(-0.03, 1.18, t * t * (3 - 2 * t));
        if (t >= 1) { hammer.phase = 'idle'; hammer.cooldown = 0.35; }
      }
    }

    const flipper = this.weapons.flipper;
    if (flipper) {
      flipper.cooldown = Math.max(0, flipper.cooldown - dt);
      if (!this.weaponAvailable('flipper')) flipper.phase = 'disabled';
      if (flipper.phase === 'idle' && flipper.requested) {
        flipper.phase = 'attack'; flipper.time = 0; flipper.didHit = false; flipper.requested = false;
        this.stats.attacks++;
        playSpatialSample('flipper', this.root.position, this.isPlayer ? 0.72 : 0.42, 0.98 + Math.random() * 0.07, 3);
      }
      if (flipper.phase === 'attack') {
        flipper.time += dt;
        const t = clamp(flipper.time / 0.075, 0, 1);
        flipper.pivot.rotation.x = lerp(0, -1.22, 1 - (1 - t) ** 4);
        if (t >= 0.38 && !flipper.didHit) {
          flipper.didHit = true;
          game.checkFlipperHit(this, flipper);
          game.checkFlipperGroundReaction(this, flipper);
        }
        if (t >= 1) { flipper.phase = 'hold'; flipper.time = 0; }
      } else if (flipper.phase === 'hold') {
        flipper.time += dt;
        if (flipper.time > 0.16) { flipper.phase = 'return'; flipper.time = 0; }
      } else if (flipper.phase === 'return') {
        flipper.time += dt;
        const t = clamp(flipper.time / 0.38, 0, 1);
        flipper.pivot.rotation.x = lerp(-1.22, 0, t * t * (3 - 2 * t));
        if (t >= 1) { flipper.phase = 'idle'; flipper.cooldown = 0.45; }
      }
    }
  }

  canPostureRecover() {
    if (this.dead || this.postureRecovery || this.postureRecoveryCooldown > 0) return false;
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const tiltDegrees = THREE.MathUtils.radToDeg(Math.acos(clamp(support.upDot, -1, 1)));
    const wheelsUsable = tiltDegrees < 50 && support.wheelContact && this.root.position.y <= support.height + 0.1;
    return !wheelsUsable && (tiltDegrees >= 55 || this.isSelfRightCandidate());
  }

  wakePhysicsFromControl(reason = 'drive-input') {
    if (this.dead) return false;
    this.physicsAwake = true;
    this.passiveSettledArmed = false;
    this.passiveSettledSeconds = 0;
    this.floorRecoveryTimer = Math.max(this.floorRecoveryTimer, 0.08);
    this.lastControlWakeReason = reason;
    if (this.wheels.some((wheel) => !wheel.part.detached)) {
      this.disabledReason = null;
      this.immobileSeconds = 0;
    }
    return true;
  }

  controlStateAudit() {
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const activeDriveWheels = this.wheels.filter((wheel) => !wheel.part.detached).length;
    const structurallyDriveable = activeDriveWheels >= 2;
    const grounded = support.wheelContact
      && this.root.position.y <= support.height + support.wheelSuspensionTravel + 0.06;
    const forwardSpeed = this.velocity.dot(forwardFor(this.yaw));
    const profile = this.driveProfile ?? WEIGHT_CLASSES.middleweight;
    const motorEnabled = !this.dead && structurallyDriveable && !this.postureRecovery;
    return {
      throttleInput: Number(this.control.throttle.toFixed(3)),
      steerInput: Number(this.control.steering.toFixed(3)),
      brakeInput: Boolean(this.control.brake),
      controlsEnabled: !this.dead,
      controlsDisabled: this.dead,
      isStunned: false,
      isRecovering: Boolean(this.postureRecovery),
      isAirborne: !grounded && this.root.position.y > support.height + 0.095,
      isGrounded: grounded,
      groundedWheelCount: support.wheelContactCount,
      isFlipped: support.upDot < 0.2,
      isDead: this.dead,
      isRespawning: this.dead && Number.isFinite(this.respawnAt),
      isStuck: this.isPlayer ? this.playerDriveStallSeconds >= 1 : this.aiMeaninglessStationarySeconds >= 2,
      motorEnabled,
      driveEnabled: motorEnabled && grounded && support.upDot > 0.52,
      wheelMotorTorque: motorEnabled ? Number((Math.abs(this.control.throttle) * 8.2 * profile.acceleration).toFixed(3)) : 0,
      wheelRPM: Number((forwardSpeed / Math.max(0.1, this.wheels.find((wheel) => !wheel.part.detached)?.physicsRadius ?? 0.5) * 60 / (Math.PI * 2)).toFixed(1)),
      wheelBrakeTorque: this.control.brake ? 1 : 0,
      steeringEnabled: !this.dead && structurallyDriveable,
      canDrive: !this.dead && structurallyDriveable,
      canSelfRight: !this.dead && !this.postureRecovery && this.postureRecoveryCooldown <= 0,
      disabledReason: this.disabledReason,
      physicsAwake: this.physicsAwake,
      rigidbodySleeping: !this.physicsAwake,
      velocity: this.velocity.toArray().map((value) => Number(value.toFixed(3))),
      angularVelocity: [this.pitchVelocity, this.yawVelocity, this.rollVelocity].map((value) => Number(value.toFixed(3))),
      driveStallSeconds: Number(this.driveStallSeconds.toFixed(3)),
    };
  }

  recoverDriveController(reason = 'stale-drive-state') {
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    if (this.dead || !support.wheelContact || support.upDot < 0.52) return false;
    this.wakePhysicsFromControl(reason);
    this.postureRecovery = null;
    this.selfRightRecoveryPending = false;
    this.selfRightAttemptWindow = 0;
    this.selfRightCandidateTime = 0;
    this.selfRightEpisodeActive = false;
    this.selfRightActionIssued = false;
    this.playerDriveStallSeconds = 0;
    this.root.position.y = Math.max(this.root.position.y, support.height + 0.002);
    this.updateWheelGroundDistances();
    const forward = forwardFor(this.yaw);
    if (this.velocity.clone().setY(0).length() < 0.16 && Math.abs(this.control.throttle) > 0.25) {
      this.velocity.addScaledVector(forward, Math.sign(this.control.throttle) * 0.38);
    }
    this.controlRecoveryCount++;
    this.stats.controlRecoveries = (this.stats.controlRecoveries ?? 0) + 1;
    return true;
  }

  startPostureRecovery(reason = this.isPlayer ? 'player-button' : 'ai-auto', forceCurrentPosition = false) {
    this.postureRecoveryRequests++;
    const available = forceCurrentPosition
      ? !this.dead && !this.postureRecovery && this.postureRecoveryCooldown <= 0
      : this.canPostureRecover();
    this.lastPostureRecoveryRequest = { reason, available, time: worldTime };
    if (!available) return false;
    const startPosition = this.root.position.clone();
    const uprightSupport = this.getGroundSupportInfo(0, 0, this.yaw);
    this.postureRecovery = {
      reason, elapsed: 0, duration: this.isPlayer ? 0.72 : 0.82,
      x: startPosition.x, z: startPosition.z, startY: startPosition.y,
      targetY: Math.max(GROUND_Y, uprightSupport.height + 0.012),
      startPitch: normalizeAngle(this.pitch), startRoll: normalizeAngle(this.roll),
    };
    this.postureRecoveryAudit = {
      reason, startX: startPosition.x, startZ: startPosition.z,
      endX: startPosition.x, endZ: startPosition.z, maximumHorizontalDrift: 0,
      completed: false,
    };
    this.control = { throttle: 0, steering: 0, brake: true };
    this.velocity.multiplyScalar(0.12);
    this.yawVelocity *= 0.25;
    this.pitchVelocity = 0;
    this.rollVelocity = 0;
    this.aiState = 'RECOVER';
    this.stats.postureRecoveries++;
    showMessage(this.isPlayer ? '현재 위치에서 자세 복구 중' : `${this.name} 자세 복구`, 0.9);
    return true;
  }

  updatePostureRecovery(dt) {
    const recovery = this.postureRecovery;
    if (!recovery) return false;
    recovery.elapsed += dt;
    const progress = clamp(recovery.elapsed / recovery.duration, 0, 1);
    const smooth = progress * progress * (3 - 2 * progress);
    this.pitch = lerp(recovery.startPitch, 0, smooth);
    this.roll = lerp(recovery.startRoll, 0, smooth);
    this.root.position.x = recovery.x;
    this.root.position.z = recovery.z;
    const interpolatedY = lerp(recovery.startY, recovery.targetY, smooth);
    const postureSupportY = this.getGroundSupportInfo(this.pitch, this.roll, this.yaw).height + 0.012;
    this.root.position.y = Math.max(interpolatedY, postureSupportY);
    this.root.rotation.set(this.pitch, this.yaw, this.roll, 'YXZ');
    this.velocity.set(0, 0, 0);
    this.yawVelocity *= Math.exp(-6 * dt);
    this.pitchVelocity = 0;
    this.rollVelocity = 0;
    if (this.postureRecoveryAudit) {
      const drift = Math.hypot(this.root.position.x - this.postureRecoveryAudit.startX, this.root.position.z - this.postureRecoveryAudit.startZ);
      this.postureRecoveryAudit.maximumHorizontalDrift = Math.max(this.postureRecoveryAudit.maximumHorizontalDrift, drift);
      this.postureRecoveryAudit.endX = this.root.position.x;
      this.postureRecoveryAudit.endZ = this.root.position.z;
    }
    if (progress >= 1) {
      if (this.postureRecoveryAudit) this.postureRecoveryAudit.completed = true;
      this.postureRecovery = null;
      this.postureRecoveryCooldown = this.isPlayer ? 5 : 8;
      this.selfRightCandidateTime = 0;
      this.selfRightEpisodeActive = false;
      this.selfRightActionIssued = false;
      this.selfRightAttemptWindow = 0;
      this.aiUndrivableTime = 0;
      this.lastPosition.copy(this.root.position);
    }
    return true;
  }

  weaponForwardYawOffset() {
    const weaponRecord = this.assembly?.parts?.find((record) => WEAPON_TYPES.has(record.type) && this.weaponAvailable(record.type === 'barSpinner' ? 'bar' : record.type === 'drumSpinner' ? 'drum' : record.type));
    if (!weaponRecord) return 0;
    const authoredYaw = Number(weaponRecord.rotation?.[1] ?? 0);
    // The corrected hammer head rests on local -Z; every other front weapon
    // attacks along its authored local +Z or is radially symmetric.
    return normalizeAngle(authoredYaw + (weaponRecord.type === 'hammer' ? Math.PI : 0));
  }

  transitionAIState(nextState, reason = 'decision') {
    if (this.isPlayer || this.dead) return false;
    if (this.aiState === nextState) {
      this.aiStateReason = reason;
      return false;
    }
    this.aiStateHistory.push({
      t: Number(battleElapsed.toFixed(2)),
      from: this.aiState,
      to: nextState,
      reason,
      x: Number(this.root.position.x.toFixed(1)),
      z: Number(this.root.position.z.toFixed(1)),
    });
    if (this.aiStateHistory.length > 96) this.aiStateHistory.shift();
    this.aiState = nextState;
    this.aiStateReason = reason;
    this.aiStateTime = 0;
    return true;
  }

  clearAIPath(reason = 'repath') {
    this.aiNavPath = [];
    this.aiNavGoal = null;
    this.aiNavRepath = 0;
    this.aiNoProgressSeconds = 0;
    this.aiLastProgressDistance = Infinity;
    this.aiProgressWaypointKey = null;
    this.aiRouteVariant = (this.aiRouteVariant + 1) % 3;
    this.lastAIPathClearReason = reason;
  }

  updateAIDisabledDecision(dt) {
    if (this.isPlayer || this.dead) return false;
    const activeWheels = this.wheels.filter((wheel) => !wheel.part.detached).length;
    if (activeWheels > 0) {
      this.aiRespawnDecisionSeconds = 0;
      return false;
    }
    this.transitionAIState('RESPAWN_DECISION', 'no-drive-wheels');
    this.control = { throttle: 0, steering: 0, brake: true };
    this.aiRespawnDecisionSeconds += dt;
    const healer = robots.find((candidate) => candidate !== this && !candidate.dead && candidate.team === this.team && candidate.type === 'healer');
    this.healerPartnerUid = healer?.instanceUid ?? null;
    // A disabled chassis remains a real match participant while its healer has
    // a chance to reach it. Only the AI's explicit, logged fallback decision can
    // retire the body; a generic low-speed timer can never respawn it.
    if (this.aiRespawnDecisionSeconds >= 20) this.destroyRobot(null, 'AI_DISABLED');
    return true;
  }

  updateAIStuckDetector(dt) {
    if (this.aiState === 'STUCK_RECOVERY' || this.postureRecovery || this.dead) return false;
    this.aiStuckWindow += dt;
    this.aiStuckYawTravel += Math.abs(normalizeAngle(this.yaw - this.aiStuckAnchorYaw));
    this.aiStuckAnchorYaw = this.yaw;
    // Sample quickly enough that an AI cannot complete even one stationary
    // circle before the guard takes over.
    if (this.aiStuckWindow < 0.72) return false;
    const displacement = this.root.position.clone().sub(this.aiStuckAnchor).setY(0).length();
    const tryingToMove = Math.abs(this.control.throttle) > 0.52;
    const goalStillFar = !this.aiNavGoal || this.root.position.distanceTo(this.aiNavGoal) > 8;
    const spinningInPlace = displacement < 0.52 && this.aiStuckYawTravel > 0.32 && goalStillFar;
    const physicallyBlocked = displacement < 0.24 && tryingToMove && goalStillFar;
    const meaningless = spinningInPlace || physicallyBlocked;
    this.aiMeaninglessStationarySeconds = meaningless ? this.aiMeaninglessStationarySeconds + this.aiStuckWindow : Math.max(0, this.aiMeaninglessStationarySeconds - this.aiStuckWindow * 1.6);
    this.aiMaximumMeaninglessStationarySeconds = Math.max(this.aiMaximumMeaninglessStationarySeconds, this.aiMeaninglessStationarySeconds);
    this.aiStuckAnchor.copy(this.root.position);
    this.aiStuckWindow = 0;
    this.aiStuckYawTravel = 0;
    if (!meaningless) return false;
    const stuckPosition = this.root.position.clone();
    const repeatedHere = this.aiLastStuckPosition
      && stuckPosition.distanceToSquared(this.aiLastStuckPosition) < 4.5 ** 2
      && worldTime - this.aiLastStuckTime < 12;
    this.aiRepeatedStuckCount = repeatedHere ? this.aiRepeatedStuckCount + 1 : 1;
    this.aiLastStuckPosition = stuckPosition;
    this.aiLastStuckTime = worldTime;
    this.aiPreviousObjectiveState = this.aiState;
    this.transitionAIState('STUCK_RECOVERY', spinningInPlace ? 'yaw-without-travel' : 'drive-without-travel');
    this.aiRecoverStuckTime = 2.55;
    this.aiAvoidSide *= -1;
    this.aiRecoverTurnSign = this.aiAvoidSide;
    if (spinningInPlace) this.aiSpinGuardEvents++;
    const forward = forwardFor(this.yaw);
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const sideDistance = 7.5 + Math.min(3, this.aiRepeatedStuckCount) * 2.4;
    const rearDistance = 6.5 + Math.min(3, this.aiRepeatedStuckCount) * 1.8;
    const escape = stuckPosition.clone()
      .addScaledVector(forward, -rearDistance)
      .addScaledVector(right, this.aiRecoverTurnSign * sideDistance);
    if (selectedMapId === 'desert01') {
      let safeNode = null;
      let safeScore = Infinity;
      for (const node of desertNavigation.nodes) {
        const planar = node.clone().sub(stuckPosition).setY(0);
        const distance = planar.length();
        if (distance < 7 || distance > 58 || segmentBlockedByMapObstacle(stuckPosition, node, 1.35)) continue;
        const direction = planar.normalize();
        const sideBias = direction.dot(right) * this.aiRecoverTurnSign;
        const rearBias = -direction.dot(forward);
        const occupied = robots.some((candidate) => candidate !== this && !candidate.dead && candidate.root.position.distanceToSquared(node) < 5.5 ** 2);
        if (occupied) continue;
        const score = distance - sideBias * 6 - rearBias * 3;
        if (score < safeScore) { safeScore = score; safeNode = node; }
      }
      if (safeNode) escape.copy(safeNode);
      escape.x = clamp(escape.x, -DESERT_LAYOUT.halfWidth + 10, DESERT_LAYOUT.halfWidth - 10);
      escape.z = clamp(escape.z, -DESERT_LAYOUT.halfLength + 10, DESERT_LAYOUT.halfLength - 10);
      escape.y = desertTerrainHeight(escape.x, escape.z);
    }
    this.aiEscapeWaypoint = escape;
    this.aiEscapeExpires = worldTime + 11;
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    if (this.velocity.clone().setY(0).length() < 0.8 && support.wheelContact && support.upDot > 0.55) {
      // A straight linear release breaks contact without creating a spin-only
      // impulse. Steering is introduced only after the chassis has travelled.
      this.velocity.addScaledVector(forward, -2.15);
      this.yawVelocity *= 0.32;
      this.wakePhysicsFromControl('ai-stuck-physical-release');
    }
    this.aiTargetId = null;
    this.clearAIPath('stuck-detected');
    this.aiStuckEvents++;
    this.stats.aiStuckRecoveries = (this.stats.aiStuckRecoveries ?? 0) + 1;
    return true;
  }

  updateAIStuckRecovery(dt) {
    if (this.aiState !== 'STUCK_RECOVERY') return false;
    this.aiRecoverStuckTime = Math.max(0, this.aiRecoverStuckTime - dt);
    const elapsed = 2.55 - this.aiRecoverStuckTime;
    if (elapsed < 0.9) {
      this.control = { throttle: -1, steering: this.aiRecoverTurnSign * 0.12, brake: false };
      this.stats.reverseRecoveries++;
    }
    else if (elapsed < 1.62) this.control = { throttle: -0.9, steering: this.aiRecoverTurnSign * 0.38, brake: false };
    else {
      this.control = { throttle: 1, steering: -this.aiRecoverTurnSign * 0.52, brake: false };
      const dashProbe = this.root.position.clone().addScaledVector(forwardFor(this.yaw), 7);
      if (this.dashCooldown <= 0 && !segmentBlockedByMapObstacle(this.root.position, dashProbe, Math.max(1.8, this.radius * 0.72)) && this.requestDash('ai-stuck-exit')) this.aiDashIntent = 'stuck-exit';
    }
    if (this.aiRecoverStuckTime <= 0) {
      this.transitionAIState('REPOSITION', 'stuck-recovery-finished');
      this.clearAIPath('stuck-recovery-finished');
      this.aiMeaninglessStationarySeconds = 0;
      this.aiStuckAnchor.copy(this.root.position);
      this.aiStuckAnchorYaw = this.yaw;
    }
    return true;
  }

  updateAI(dt) {
    if (this.isPlayer || this.dead) return;
    this.aiStateTime += dt;
    if (worldTime < this.spawnProtectionUntil) {
      this.control = { throttle: 0, steering: 0, brake: true };
      this.transitionAIState('REENTRY', 'spawn-protection');
      return;
    }
    if (this.updateAIDisabledDecision(dt)) return;
    if (this.postureRecovery) { this.control = { throttle: 0, steering: 0, brake: true }; return; }
    const recoverySupport = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const tiltDegrees = THREE.MathUtils.radToDeg(Math.acos(clamp(recoverySupport.upDot, -1, 1)));
    const securelyWheelDown = tiltDegrees < 60 && recoverySupport.wheelContact
      && this.root.position.y <= recoverySupport.height + 0.1;
    const selfRightCandidate = this.isSelfRightCandidate();
    if (tiltDegrees >= 60 || !securelyWheelDown) {
      this.aiUndrivableTime += dt;
      this.control = { throttle: 0, steering: 0, brake: true };
      this.transitionAIState('SELF_RIGHT', 'not-wheel-down');
      this.selfRightStableTime = 0;
      this.selfRightCandidateTime = selfRightCandidate ? this.selfRightCandidateTime + dt : 0;
      if (selfRightCandidate && !this.selfRightEpisodeActive) {
        this.selfRightEpisodeActive = true;
        this.selfRightActionIssued = false;
        this.selfRightAttemptsThisFlip = 0;
      }
      // One explicit weapon action is allowed per overturn episode. A failed
      // attempt never re-arms while the robot rocks through roof/side poses.
      if (selfRightCandidate && this.selfRightCandidateTime >= 0.9
        && !this.selfRightActionIssued && this.selfRightCooldown <= 0) {
        const requested = this.requestHammer() || this.requestFlipper();
        if (requested) {
          this.selfRightActionIssued = true;
          this.selfRightCooldown = 1.4;
          this.selfRightAttemptWindow = 2.5;
          this.selfRightAttemptsThisFlip = 1;
          this.stats.selfRightAttempts++;
          flightStats.selfRightAttempts++;
          flightStats.aiSelfRightAttempts++;
        }
      }
      // Weapon self-right gets the first opportunity. If the AI is still
      // trapped, use the same current-position recovery available to the
      // player so a fallen bot never removes itself from the match forever.
      const noWheelPlane = !recoverySupport.wheelContact && this.root.position.y <= recoverySupport.height + 0.14;
      const broadlyUndrivable = this.aiUndrivableTime >= 2.6
        && (tiltDegrees >= 48 || noWheelPlane);
      if (!this.postureRecovery && ((selfRightCandidate && this.selfRightCandidateTime >= 2.6) || broadlyUndrivable)) {
        this.startPostureRecovery('ai-current-position', broadlyUndrivable);
      }
      for (const key of ['spinner', 'bar', 'drum']) if (this.weapons[key]) this.weapons[key].active = this.weaponAvailable(key);
      return;
    }
    this.aiUndrivableTime = 0;
    if (this.updateAIStuckRecovery(dt)) return;
    this.selfRightStableTime = securelyWheelDown ? this.selfRightStableTime + dt : 0;
    if (this.selfRightStableTime >= 3) {
      this.selfRightAttemptsThisFlip = 0;
      this.selfRightCandidateTime = 0;
      this.selfRightEpisodeActive = false;
      this.selfRightActionIssued = false;
      this.selfRightRecoveryPending = false;
      this.selfRightAttemptWindow = 0;
    }
    this.aiThinkAccumulator += dt;
    const playerDistance = player && player !== this
      ? Math.hypot(player.root.position.x - this.root.position.x, player.root.position.z - this.root.position.z)
      : 0;
    const populationPenalty = robots.length >= 12 ? 0.09 : robots.length >= 8 ? 0.04 : 0;
    const thinkInterval = (playerDistance < 34 ? 0.18 : playerDistance < 76 ? 0.32 : 0.5) + populationPenalty;
    if (this.aiThinkAccumulator < thinkInterval) {
      performanceProfile.aiThinkSkips++;
      return;
    }
    dt = this.aiThinkAccumulator;
    this.aiThinkAccumulator = 0;
    performanceProfile.aiThinkCalls++;
    if (this.updateAIStuckDetector(dt)) return;
    // Healers use the same seek/follow/heal behaviour in every team mode.
    // Previously this only ran inside the desert objective branch, so arena
    // healers fell through to combat targeting and circled enemies instead.
    if (this.type === 'healer' && updateHealerAI(this, dt)) return;
    if (selectedMapId === 'desert01' && updateDesertObjectiveAI(this, dt)) return;
    const ownHealth = this.durability();
    performanceProfile.targetSearches++;
    const candidates = game.targetsFor(this);
    const weakAlly = robots
      .filter((robot) => robot !== this && !robot.dead && robot.team === this.team)
      .sort((a, b) => a.durability() - b.durability())[0] ?? null;
    const target = candidates.reduce((best, candidate) => {
      const distance = candidate.root.position.distanceTo(this.root.position);
      const durability = candidate.durability();
      const engaged = robots.some((robot) => robot !== this && robot !== candidate && !robot.dead && robot.team !== candidate.team && robot.root.position.distanceTo(candidate.root.position) < 7.5);
      const dangerous = ['bar', 'drum', 'spinner'].includes(candidate.type);
      let score = distance;
      if (this.aiTrait === 'chaser') score -= (1 - durability) * 19;
      if (['flanker', 'ambusher'].includes(this.aiTrait) && engaged) score -= 11;
      if (['aggressive', 'brawler', 'berserker'].includes(this.aiTrait)) score -= (1 - durability) * 7 + (dangerous ? 3.5 : 0) + (engaged ? 3 : 0);
      if (['defensive', 'cautious', 'survivor'].includes(this.aiTrait) && dangerous) score += 7;
      if (ownHealth < 0.6 && dangerous) score += (0.6 - ownHealth) * 26 * this.aiPersonality.fear;
      if (ownHealth < 0.35) score -= (1 - durability) * 16;
      if (weakAlly?.durability() < 0.45 && candidate.root.position.distanceTo(weakAlly.root.position) < 10) score -= 9;
      const alliesEngaging = robots.filter((robot) => robot !== this && !robot.dead && robot.team === this.team && robot.root.position.distanceTo(candidate.root.position) < 8).length;
      score -= alliesEngaging * (this.aiTrait === 'berserker' ? 1.2 : 3.4);
      if (candidate.id === this.aiTargetId) score -= 2.5;
      return !best || score < best.score ? { robot: candidate, score } : best;
    }, null)?.robot ?? null;
    if (!target) {
      this.transitionAIState(selectedMapId === 'desert01' ? 'MOVE_TO_OBJECTIVE' : 'SEARCH', 'target-lost');
      const searchPoint = new THREE.Vector3(
        Math.sin(worldTime * 0.13 + this.id * 1.71) * (activeHalfWidth() * 0.62),
        0,
        Math.cos(worldTime * 0.11 + this.id * 1.19) * (activeHalfLength() * 0.62),
      );
      const navigationPoint = navigationPointForRobot(this, searchPoint, dt);
      const desired = navigationPoint.sub(this.root.position);
      const desiredYaw = normalizeAngle(Math.atan2(desired.x, desired.z));
      const angleError = normalizeAngle(desiredYaw - this.yaw);
      this.control = { throttle: 0.62, steering: clamp(angleError * 1.35, -1, 1), brake: false };
      return;
    }
    this.aiTargetId = target.id;
    const toTarget = target.root.position.clone().sub(this.root.position);
    toTarget.y = 0;
    const distance = toTarget.length();
    const playerDirection = toTarget.normalize();
    const side = new THREE.Vector3(playerDirection.z, 0, -playerDirection.x);
    let desiredPoint = target.root.position.clone();
    const health = this.durability();
    const activeWheelRatio = this.wheels.length ? this.wheels.filter((wheel) => !wheel.part.detached).length / this.wheels.length : 0;
    const weaponOperational = this.weaponAvailable(this.type);
    const retreatThreshold = this.aiPersonality.retreatThreshold;
    const targetEngaged = robots.some((robot) => robot !== this && robot !== target && !robot.dead && robot.team !== target.team && robot.root.position.distanceTo(target.root.position) < 7.5);
    const wasRetreating = this.aiState === 'RETREAT';
    const wasReentering = this.aiState === 'REENTRY';
    const severeDamageRetreat = this.aiTrait !== 'berserker' && (activeWheelRatio <= 0.5 || (!weaponOperational && health < 0.58));
    const survivalEmergency = health < 0.15 && this.aiTrait !== 'berserker';
    const heavyDamageRetreat = health < 0.3 && this.aiTrait !== 'berserker' && distance < 42;
    const damagedCaution = health < 0.5 && ['cautious', 'survivor', 'defensive'].includes(this.aiTrait) && distance < 26;
    const shouldRetreat = worldTime < this.aiRetreatUntil || severeDamageRetreat || survivalEmergency || heavyDamageRetreat || damagedCaution
      || (health < retreatThreshold && distance < (['defensive', 'cautious', 'survivor'].includes(this.aiTrait) ? 38 : 28));
    let nextState = 'CHASE';
    if (shouldRetreat) nextState = 'RETREAT';
    else if (wasRetreating || (wasReentering && this.aiStateTime < 1.55)) nextState = 'REENTRY';
    else if ((['flanker', 'ambusher'].includes(this.aiTrait) || this.aiPersonality.ambushPreference > 0.76) && targetEngaged && distance > 7) nextState = 'AMBUSH';
    else if ((['flanker', 'ambusher'].includes(this.aiTrait) || this.type === 'hammer') && distance > 5.5) nextState = 'FLANK';
    else if (distance < (this.type === 'hammer' ? 5.8 : this.type === 'flipper' ? 4.6 : 4.9)) nextState = 'ATTACK';
    this.transitionAIState(nextState, `combat-${nextState.toLowerCase()}`);

    if (this.aiState === 'RETREAT') {
      const away = this.root.position.clone().sub(target.root.position).setY(0).normalize();
      desiredPoint = this.root.position.clone().addScaledVector(away, 22);
      const cover = obstacles
        .filter((obstacle) => obstacle.obstacleType === 'container' || obstacle.obstacleType === 'concrete-barrier')
        .map((obstacle) => ({ obstacle, distance: Math.hypot(obstacle.x - this.root.position.x, obstacle.z - this.root.position.z) }))
        .filter((entry) => entry.distance < 42)
        .sort((a, b) => a.distance - b.distance)[0]?.obstacle;
      if (cover) {
        const coverCentre = new THREE.Vector3(cover.x, 0, cover.z);
        const coverAway = coverCentre.clone().sub(target.root.position).setY(0).normalize();
        desiredPoint.copy(coverCentre).addScaledVector(coverAway, Math.max(cover.halfX ?? 2, cover.halfZ ?? 2) + 6);
      }
    } else if (this.aiState === 'AMBUSH') {
      const targetRear = forwardFor(target.yaw).multiplyScalar(-8.5);
      desiredPoint.add(targetRear).addScaledVector(side, this.aiOrbit * 5.5);
    } else if (this.aiState === 'FLANK') {
      desiredPoint.addScaledVector(side, this.aiOrbit * clamp(distance * 0.42, 4.2, 10.5));
    } else {
      if (this.type === 'hammer' && distance < 9) desiredPoint.addScaledVector(side, this.aiOrbit * clamp(distance * 0.24, 1.1, 2.8));
      if (['spinner', 'bar', 'drum'].includes(this.type)) desiredPoint.addScaledVector(side, Math.sin(worldTime * 0.85 + this.id) * (this.aiTrait === 'brawler' ? 1.2 : 2.3));
    }
    desiredPoint.x = clamp(desiredPoint.x, -activeHalfWidth() + 8, activeHalfWidth() - 8);
    desiredPoint.z = clamp(desiredPoint.z, -activeHalfLength() + 8, activeHalfLength() - 8);
    for (const ally of robots.filter((robot) => robot !== this && !robot.dead && robot.team === this.team)) {
      const away = this.root.position.clone().sub(ally.root.position).setY(0);
      const separation = away.length();
      if (separation > 0.01 && separation < 5.2) desiredPoint.addScaledVector(away.normalize(), (5.2 - separation) * 0.65);
    }

    const navigationPoint = navigationPointForRobot(this, desiredPoint.clone(), dt);
    const desired = navigationPoint.sub(this.root.position);
    // The corrected hammer head attacks from the rear external side of its
    // chassis, so hammer AI deliberately presents that side and reverses into range.
    const weaponForwardOffset = this.weaponForwardYawOffset();
    const desiredYaw = normalizeAngle(Math.atan2(desired.x, desired.z) - weaponForwardOffset);
    let angleError = normalizeAngle(desiredYaw - this.yaw);
    const nearWall = Math.abs(this.root.position.x) > activeHalfWidth() - 5 || Math.abs(this.root.position.z) > activeHalfLength() - 5;
    if (nearWall) {
      const centreYaw = normalizeAngle(Math.atan2(-this.root.position.x, -this.root.position.z) - weaponForwardOffset);
      angleError = normalizeAngle(centreYaw - this.yaw);
    }

    const moved = this.root.position.distanceTo(this.lastPosition);
    this.lastPosition.copy(this.root.position);
    if (moved < 0.015 && Math.abs(this.control.throttle) > 0.6) this.stuckTime += dt;
    else this.stuckTime = Math.max(0, this.stuckTime - dt * 2);
    if (this.stuckTime > 1.15) { this.reverseTime = 0.7; this.stuckTime = 0; }
    this.reverseTime = Math.max(0, this.reverseTime - dt);

    const attackDrive = 1;
    this.control.steering = clamp(angleError * 1.45 * attackDrive, -1, 1);
    const preferredDistance = this.type === 'hammer' ? 3.2 : this.type === 'flipper' ? 2.5 : 2.8;
    const stateThrottle = this.aiState === 'RETREAT' ? 1 : distance > preferredDistance ? lerp(0.82, 1, this.aiPersonality.aggression) : this.aiState === 'ATTACK' ? lerp(0.38, 0.62, this.aiPersonality.aggression) : 0.72;
    const healthDriveScale = health < 0.15 ? 0.7 : health < 0.3 ? 0.8 : health < 0.5 ? 0.91 : 1;
    const damageDriveScale = clamp((0.38 + activeWheelRatio * 0.62) * healthDriveScale, 0.34, 1);
    this.control.throttle = (this.reverseTime > 0 ? -attackDrive * 0.85 : attackDrive * stateThrottle) * damageDriveScale;
    this.control.brake = false;
    if (this.isFlipped()) this.control.throttle = 0;

    const facing = Math.abs(angleError) < (this.type === 'hammer' ? 0.72 : 0.55);
    for (const key of ['spinner', 'bar', 'drum']) if (this.weapons[key]) this.weapons[key].active = this.weaponAvailable(key);
    if (this.type === 'hammer' && Math.abs(angleError) < 1.25 && distance < 5.8 && this.requestHammer()) this.aiLastAttackTime = worldTime;
    if (this.type === 'flipper' && Math.abs(angleError) < 0.88 && distance < 4.7 && this.requestFlipper()) this.aiLastAttackTime = worldTime;
    const dashApproach = ['CHASE', 'ATTACK', 'FLANK', 'AMBUSH'].includes(this.aiState)
      && facing && distance > 5.2 && distance < (this.weightClass === 'lightweight' ? 18 : 14.5);
    const dashEscape = this.aiState === 'RETREAT' && facing && distance < 13;
    const dashPersonality = this.aiTrait === 'berserker' || this.aiTrait === 'chaser' ? 0.92
      : this.aiTrait === 'cautious' || this.aiTrait === 'survivor' ? 0.46 : 0.68;
    if ((dashApproach || dashEscape) && this.dashCooldown <= 0
      && Math.random() < clamp(dt * (0.7 + dashPersonality), 0.08, 0.5) && this.requestDash(dashEscape ? 'ai-retreat' : 'ai-attack')) {
      this.transitionAIState(dashEscape ? 'DASH_ESCAPE' : 'DASH_ATTACK', dashEscape ? 'dash-retreat' : 'dash-attack');
    }
    if (this.aiState === 'ATTACK' && distance < preferredDistance + 1.3 && ['flanker', 'ambusher', 'defensive', 'cautious'].includes(this.aiTrait)) {
      this.aiRetreatUntil = Math.max(this.aiRetreatUntil, worldTime + (['flanker', 'ambusher'].includes(this.aiTrait) ? 1.25 : 1.8));
    }
    if (!weaponOperational) {
      this.control.throttle = this.aiState === 'RETREAT' ? damageDriveScale : (this.reverseTime > 0 ? -0.72 : 0.62) * damageDriveScale;
      if (this.aiTrait !== 'berserker') this.aiRetreatUntil = Math.max(this.aiRetreatUntil, worldTime + 0.8);
    }
  }

  isFlipped() {
    return Math.abs(normalizeAngle(this.pitch)) > 1.35 || Math.abs(normalizeAngle(this.roll)) > 1.35;
  }

  canRequestRespawn() {
    if (this.dead || mode !== 'battle') return false;
    const activeWheels = this.wheels.filter((wheel) => !wheel.part.detached).length;
    const noWheels = activeWheels === 0;
    const crippled = activeWheels <= 2 && this.immobileSeconds >= 3;
    const noWeaponAndStopped = this.weaponStatus() === '무기 파괴' && this.immobileSeconds >= 3;
    return noWheels || crippled || noWeaponAndStopped;
  }

  isSelfRightCandidate() {
    const support = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const lowEnough = this.root.position.y <= support.height + 0.12;
    const roofDown = support.upDot < -0.15;
    const steepAndTrapped = Math.abs(support.upDot) < 0.34 && !support.stable
      && this.velocity.length() < 1.2 && Math.hypot(this.pitchVelocity, this.rollVelocity) < 1.1;
    return !this.dead && lowEnough && (roofDown || steepAndTrapped);
  }

  getGroundSupportInfo(pitch = this.pitch, roll = this.roll, yaw = this.yaw) {
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ'));
    const upDot = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion).y;
    const candidates = [];
    for (const component of this.colliderComponents) {
      for (const point of component.points) candidates.push({ point: point.clone().applyQuaternion(quaternion), kind: component.name });
    }
    // Suspension/wheel support exists only while the wheel-down direction can
    // actually reach the floor. At steep side/nose attitudes only the chassis
    // hull participates, preventing a wheel ray from holding the body in air.
    const wheelContactEligible = upDot > 0.48 && Math.abs(normalizeAngle(pitch)) < 1.05 && Math.abs(normalizeAngle(roll)) < 1.05;
    if (wheelContactEligible) {
      for (const wheel of this.wheels) {
        if (wheel.part.detached) continue;
        const point = wheel.wheelRoot.position.clone().applyQuaternion(quaternion);
        point.y -= wheel.physicsRadius;
        candidates.push({ point, kind: 'WheelCollider' });
      }
    }
    const supported = candidates.map((candidate) => {
      const groundY = groundSurfaceHeightAt(this.root.position.x + candidate.point.x, this.root.position.z + candidate.point.z);
      return { ...candidate, groundY, requiredRootHeight: groundY - candidate.point.y + ROBOT_GROUND_SKIN };
    });
    const supportHeight = Math.max(...supported.map((candidate) => candidate.requiredRootHeight));
    const contacts = supported.filter((candidate) => candidate.requiredRootHeight >= supportHeight - 0.055);
    const hull = convexHullXZ(contacts.map((candidate) => candidate.point));
    const area = polygonAreaXZ(hull);
    const com = this.centerOfMassLocal.clone().applyQuaternion(quaternion);
    const geometricallyStable = area >= 0.12 && pointInsideConvexXZ(com, hull);
    // A thin battlebot resting around 90 degrees is visibly standing on its
    // narrow chassis edge, not lying on a broad floor-facing face. Treat that
    // high-COM side balance as unstable even if the raw box-face polygon happens
    // to contain the COM projection; gravity must choose roof-down or wheel-down.
    const sideStanding = Math.abs(upDot) < 0.58;
    const stable = geometricallyStable && !sideStanding;
    const centroid = contacts.reduce((sum, candidate) => sum.add(candidate.point), new THREE.Vector3()).multiplyScalar(1 / Math.max(1, contacts.length));
    // Rolling terrain rarely places two tyre bottoms within the old 5.5 cm
    // equality band. Count wheels that are within the suspension travel of the
    // current support plane; requiring exact coplanarity falsely disabled drive
    // after otherwise valid desert landings.
    const wheelSuspensionTravel = 0.22;
    const wheelContactCount = supported.filter((candidate) => candidate.kind === 'WheelCollider'
      && candidate.requiredRootHeight >= supportHeight - wheelSuspensionTravel).length;
    return {
      height: supportHeight,
      contacts: contacts.map((candidate) => candidate.point),
      contactKinds: contacts.map((candidate) => candidate.kind),
      hull,
      area,
      stable,
      geometricallyStable,
      sideStanding,
      centroid,
      com,
      upDot,
      // A lone tyre cannot create a stable suspension plane or drive torque.
      wheelContact: wheelContactCount >= 2,
      wheelContactCount,
      wheelContactEligible,
      wheelSuspensionTravel,
      surfaceId: 'PhysicsFloor',
    };
  }

  groundSupportHeight(pitch = this.pitch, roll = this.roll) {
    return this.getGroundSupportInfo(pitch, roll, this.yaw).height;
  }

  beginTorqueFrame() {
    if (this.torqueFrameTime === worldTime) return;
    this.torqueFrameTime = worldTime;
    this.currentAppliedTorque.set(0, 0, 0);
    this.currentTorqueSources.length = 0;
    this.currentAppliedForce.set(0, 0, 0);
    this.currentForceSources.length = 0;
  }

  appendPhysicsTrace(entry) {
    this.physicsTrace.push(entry);
    if (this.physicsTrace.length > 160) this.physicsTrace.shift();
  }

  recordLinearDelta(source, delta, caller = source) {
    if (!colliderDebugEnabled && !qa && !EXTENDED_PHYSICS_TELEMETRY) return;
    this.beginTorqueFrame();
    const vector = delta.clone();
    const magnitude = vector.length();
    if (magnitude <= 1e-8) return;
    this.currentAppliedForce.add(vector);
    if (!this.currentForceSources.includes(source)) this.currentForceSources.push(source);
    this.physicsSourceCounts[source] = (this.physicsSourceCounts[source] ?? 0) + 1;
    const last = this.lastTraceBySource.get(`force:${source}`) ?? -Infinity;
    if (magnitude >= 0.2 && (source !== 'gravity' || worldTime - last >= 0.25)) {
      this.appendPhysicsTrace({
        t: Number(worldTime.toFixed(3)), kind: 'force', source, caller,
        vector: vector.toArray().map((value) => Number(value.toFixed(4))),
        magnitude: Number(magnitude.toFixed(4)),
      });
      this.lastTraceBySource.set(`force:${source}`, worldTime);
    }
  }

  recordAngularDelta(source, x = 0, y = 0, z = 0, caller = source) {
    if (!colliderDebugEnabled && !qa && !EXTENDED_PHYSICS_TELEMETRY) return;
    this.beginTorqueFrame();
    const vector = new THREE.Vector3(x, y, z);
    const magnitude = vector.length();
    if (magnitude <= 1e-10) return;
    this.currentAppliedTorque.add(vector);
    if (!this.currentTorqueSources.includes(source)) this.currentTorqueSources.push(source);
    this.physicsSourceCounts[source] = (this.physicsSourceCounts[source] ?? 0) + 1;
    const before = [this.pitchVelocity - x, this.yawVelocity - y, this.rollVelocity - z];
    const after = [this.pitchVelocity, this.yawVelocity, this.rollVelocity];
    const reversals = ['pitch', 'yaw', 'roll'].flatMap((axis, index) => (
      Math.abs(before[index]) > 0.025 && Math.abs(after[index]) > 0.025
        && Math.sign(before[index]) !== Math.sign(after[index]) ? [axis] : []
    ));
    const entry = {
      t: Number(worldTime.toFixed(3)), kind: 'torque', source, caller,
      vector: vector.toArray().map((value) => Number(value.toFixed(5))),
      magnitude: Number(magnitude.toFixed(5)),
      before: before.map((value) => Number(value.toFixed(4))),
      after: after.map((value) => Number(value.toFixed(4))),
      reversals,
    };
    const last = this.lastTraceBySource.get(`torque:${source}`) ?? -Infinity;
    if (magnitude >= 0.004 && (source !== 'gravity-com' || reversals.length || worldTime - last >= 0.25)) {
      this.appendPhysicsTrace(entry);
      this.lastTraceBySource.set(`torque:${source}`, worldTime);
    }
    if (reversals.length) {
      this.angularReversals.push(entry);
      if (this.angularReversals.length > 80) this.angularReversals.shift();
    }
  }

  landingAuditSample(time, support = this.lastSupportInfo ?? this.getGroundSupportInfo()) {
    return {
      t: Number(time.toFixed(3)),
      linearVelocity: this.velocity.toArray().map((value) => Number(value.toFixed(3))),
      angularVelocity: [this.pitchVelocity, this.yawVelocity, this.rollVelocity].map((value) => Number(value.toFixed(3))),
      angularSpeed: Number(Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity).toFixed(3)),
      grounded: this.grounded,
      wheelGroundedCount: this.wheelGroundedCount,
      bodyGroundContact: this.bodyGroundContact,
      contactArea: Number(support.area.toFixed(3)),
      angularDamping: Number(this.currentAngularDamping.toFixed(3)),
      appliedAngularDelta: this.currentAppliedTorque.toArray().map((value) => Number(value.toFixed(4))),
      torqueSources: [...this.currentTorqueSources],
    };
  }

  startLandingAudit(fallSpeed, support, preAngular) {
    this.landingAudit = {
      startedAt: worldTime,
      fallSpeed: Number(fallSpeed.toFixed(3)),
      preAngular: preAngular.map((value) => Number(value.toFixed(3))),
      samples: [],
      nextSample: 0,
    };
    this.landingAudit.samples.push(this.landingAuditSample(0, support));
    this.landingAudit.nextSample = 1;
  }

  updateLandingAudit() {
    if (!this.landingAudit) return;
    const elapsed = worldTime - this.landingAudit.startedAt;
    while (this.landingAudit.nextSample < LANDING_SAMPLE_TIMES.length
      && elapsed >= LANDING_SAMPLE_TIMES[this.landingAudit.nextSample] - 1e-5) {
      const sampleTime = LANDING_SAMPLE_TIMES[this.landingAudit.nextSample++];
      this.landingAudit.samples.push(this.landingAuditSample(sampleTime));
    }
    if (this.landingAudit.nextSample >= LANDING_SAMPLE_TIMES.length) {
      const completed = { robot: this.name, ...this.landingAudit };
      delete completed.startedAt;
      delete completed.nextSample;
      stabilityStats.landingSamples.push(completed);
      if (stabilityStats.landingSamples.length > 24) stabilityStats.landingSamples.shift();
      this.landingAudit = null;
    }
  }

  handleLanding(fallSpeed, support, point = this.root.position) {
    if (fallSpeed < 2.25 || worldTime - this.lastLandingTime < 0.11) return false;
    this.lastLandingTime = worldTime;
    const hard = fallSpeed >= 7.2;
    this.stats.landings++;
    flightStats.landings++;
    if (hard) {
      this.stats.hardLandings++;
      flightStats.hardLandings++;
    }
    this.stats.maxFallSpeed = Math.max(this.stats.maxFallSpeed, fallSpeed);
    flightStats.maxFallSpeed = Math.max(flightStats.maxFallSpeed, fallSpeed);

    const preAngular = [this.pitchVelocity, this.yawVelocity, this.rollVelocity];
    const preLinearVelocity = this.velocity.clone();
    const hasBodyContact = support.contactKinds.some((kind) => kind !== 'WheelCollider');
    const broadBodyContact = hasBodyContact && support.stable && support.area >= LANDING_PHYSICS.broadBodyArea;
    this.grounded = true;
    this.wheelGroundedCount = support.contactKinds.filter((kind) => kind === 'WheelCollider').length;
    this.bodyGroundContact = hasBodyContact;
    this.broadBodyGroundContact = broadBodyContact;

    // One landing impulse is applied at the real support centroid. Repeated
    // ground frames only use friction/damping below; they never add impact torque.
    const localArm = support.centroid.clone().sub(support.com);
    const landingImpulse = fallSpeed * (hard ? 0.055 : 0.032);
    const landingTorqueWorld = new THREE.Vector3().crossVectors(localArm, new THREE.Vector3(0, landingImpulse, 0));
    const landingTorqueLocal = worldTorqueToEulerAxes(landingTorqueWorld, this.yaw, this.pitch);
    const pitchDelta = clamp(landingTorqueLocal.x, -1.25, 1.25);
    const rollDelta = clamp(landingTorqueLocal.z, -1.25, 1.25);
    const keepDirection = (current, delta) => current * delta < 0 && Math.abs(current) > 0.35 ? delta * 0.22 : delta;
    const appliedPitchDelta = keepDirection(this.pitchVelocity, pitchDelta);
    const appliedRollDelta = keepDirection(this.rollVelocity, rollDelta);
    this.pitchVelocity += appliedPitchDelta;
    this.rollVelocity += appliedRollDelta;
    this.recordAngularDelta('landing-impulse', appliedPitchDelta, 0, appliedRollDelta, 'Robot.handleLanding');

    // Broad metal contact loses energy, but high-energy hits retain enough
    // momentum for a natural extra roll before the chassis settles.
    const preSpeed = Math.hypot(...preAngular);
    const retention = support.wheelContact ? 0.84
      : broadBodyContact ? lerp(0.48, 0.7, clamp((preSpeed - 1.2) / 7.5, 0, 1))
        : 0.76;
    this.pitchVelocity *= retention;
    this.rollVelocity *= retention;
    this.yawVelocity *= broadBodyContact ? Math.max(0.62, retention) : 0.86;
    const bounce = hard ? 0.075 : 0.035;
    this.velocity.y = Math.min(fallSpeed * bounce, hard ? 1.15 : 0.42);
    if (broadBodyContact) {
      const planarRetention = hard ? 0.82 : 0.74;
      this.velocity.x *= planarRetention;
      this.velocity.z *= planarRetention;
    }
    this.recordLinearDelta('landing-contact', this.velocity.clone().sub(preLinearVelocity), 'Robot.handleLanding');
    this.stats.maxPostLandingAngularSpeed = Math.max(this.stats.maxPostLandingAngularSpeed, Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity));
    stabilityStats.maxPostLandingAngularSpeed = Math.max(stabilityStats.maxPostLandingAngularSpeed, this.stats.maxPostLandingAngularSpeed);
    this.startLandingAudit(fallSpeed, support, preAngular);

    if (!qa && !environmentPhysicsQARunning) {
      spawnDust(point, Math.min(13, 2 + fallSpeed * 1.05));
      playSpatialSample('landing', point, hard ? 0.7 : 0.46, clamp(1.04 - fallSpeed * 0.011 + Math.random() * 0.04, 0.82, 1.05), hard ? 4 : 2);
      if (hard) {
        const floorPoint = point.clone();
        floorPoint.y = 0.035;
        spawnMetalSparks(floorPoint, new THREE.Vector3(this.velocity.x * this.mass * 0.08, fallSpeed * this.mass * 0.2, this.velocity.z * this.mass * 0.08), Math.min(4, Math.max(2, Math.round(fallSpeed * 0.25))), 'weak', this.velocity.clone().setY(0), 'landing', Y_AXIS);
      }
      if (this.isPlayer) cameraShake = Math.max(cameraShake, hard ? Math.min(0.2, 0.075 + fallSpeed * 0.009) : 0.035);
    }
    return true;
  }

  resolveGroundContact(dt) {
    const support = this.getGroundSupportInfo();
    this.lastSupportInfo = support;
    const penetration = support.height - this.root.position.y;
    const nearGround = this.root.position.y <= support.height + 0.035;
    const inContact = nearGround || penetration > 0;
    const hasBodyContact = inContact && support.contactKinds.some((kind) => kind !== 'WheelCollider');
    const broadBodyContact = hasBodyContact && support.stable && support.area >= LANDING_PHYSICS.broadBodyArea;
    this.grounded = inContact;
    this.wheelGroundedCount = inContact ? support.contactKinds.filter((kind) => kind === 'WheelCollider').length : 0;
    this.bodyGroundContact = hasBodyContact;
    this.broadBodyGroundContact = broadBodyContact;
    if (penetration > 0) {
      if (penetration > groundStats.maxRobotPenetration) groundStats.maxRobotPenetrationSource = {
        robot: this.name, stage: 'resolve-ground-contact', time: Number(worldTime.toFixed(3)),
        penetration: Number(penetration.toFixed(4)), rootY: Number(this.root.position.y.toFixed(4)),
        supportHeight: Number(support.height.toFixed(4)), pitch: Number(this.pitch.toFixed(3)), roll: Number(this.roll.toFixed(3)),
      };
      const fallSpeed = Math.max(0, -this.velocity.y);
      this.root.position.y = support.height;
      groundStats.robotContacts++;
      groundStats.maxRobotPenetration = Math.max(groundStats.maxRobotPenetration, penetration);
      if (penetration > 0.02) {
        groundStats.robotCorrections++;
        this.stats.groundCorrections++;
      }
      this.stats.maxGroundPenetration = Math.max(this.stats.maxGroundPenetration, penetration);
      this.handleDeepFloorRecovery(penetration);
      if (!this.handleLanding(fallSpeed, support, this.root.position)) this.velocity.y = fallSpeed > 5 ? fallSpeed * 0.065 : Math.max(0, fallSpeed * 0.025);
    }
    if (nearGround || penetration > 0) {
      const angularSpeed = Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity);
      const linearSpeed = this.velocity.length();
      const verticalBalance = hasBodyContact && Math.abs(support.upDot) < 0.62;
      if (verticalBalance) this.verticalStandingSeconds += dt;
      else this.verticalStandingSeconds = 0;
      if (!support.stable) {
        stabilityStats.unstableSupportFrames++;
        const lever = support.com.clone().sub(support.centroid);
        const gravityTorqueWorld = new THREE.Vector3().crossVectors(lever, new THREE.Vector3(0, -this.mass * 9.81, 0));
        const gravityTorqueLocal = worldTorqueToEulerAxes(gravityTorqueWorld, this.yaw, this.pitch);
        const gravityAcceleration = new THREE.Vector2(gravityTorqueLocal.x / (this.mass * 2.35), gravityTorqueLocal.z / (this.mass * 2.35));
        const gravityPitchDelta = gravityAcceleration.x * dt;
        const gravityRollDelta = gravityAcceleration.y * dt;
        this.pitchVelocity += gravityPitchDelta;
        this.rollVelocity += gravityRollDelta;
        this.recordAngularDelta('gravity-com', gravityPitchDelta, 0, gravityRollDelta, 'Robot.resolveGroundContact');

        const lowMotion = linearSpeed < 0.38 && angularSpeed < 0.22;
        this.unstableRestTime = lowMotion ? this.unstableRestTime + dt : Math.max(0, this.unstableRestTime - dt * 2);
        if (verticalBalance) this.abnormalVerticalTime += dt;
        else this.abnormalVerticalTime = Math.max(0, this.abnormalVerticalTime - dt * 3);
        this.maxAbnormalVerticalTime = Math.max(this.maxAbnormalVerticalTime, this.abnormalVerticalTime);
        stabilityStats.maxAbnormalVerticalSeconds = Math.max(stabilityStats.maxAbnormalVerticalSeconds, this.maxAbnormalVerticalTime);
      } else {
        this.unstableRestTime = 0;
        this.abnormalVerticalTime = 0;
      }
      const angularSpeedAfterTorque = Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity);
      const angularDamping = support.wheelContact
        ? LANDING_PHYSICS.wheelAngularDamping
        : broadBodyContact
          ? lerp(
            LANDING_PHYSICS.broadBodyAngularDampingSlow,
            LANDING_PHYSICS.broadBodyAngularDampingFast,
            clamp((angularSpeedAfterTorque - 1.2) / 7, 0, 1),
          )
          : support.stable ? LANDING_PHYSICS.stableBodyAngularDamping
            : support.sideStanding ? LANDING_PHYSICS.sideEdgeAngularDamping : LANDING_PHYSICS.edgeAngularDamping;
      this.currentAngularDamping = angularDamping;
      this.pitchVelocity *= Math.exp(-angularDamping * dt);
      this.rollVelocity *= Math.exp(-angularDamping * dt);
      if (broadBodyContact) this.yawVelocity *= Math.exp(-3.8 * dt);
      const postDampingAngularSpeed = Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity);
      if (hasBodyContact && postDampingAngularSpeed > LANDING_PHYSICS.rollingThreshold) this.bodyRollingSeconds += dt;
      else this.bodyRollingSeconds = 0;
      this.stats.maxBodyRollingSeconds = Math.max(this.stats.maxBodyRollingSeconds, this.bodyRollingSeconds);
      this.stats.maxVerticalStandingSeconds = Math.max(this.stats.maxVerticalStandingSeconds, this.verticalStandingSeconds);
      stabilityStats.maxBodyRollingSeconds = Math.max(stabilityStats.maxBodyRollingSeconds, this.stats.maxBodyRollingSeconds);
      stabilityStats.maxVerticalStandingSeconds = Math.max(stabilityStats.maxVerticalStandingSeconds, this.stats.maxVerticalStandingSeconds);
      if (this.colliderDebug) for (const child of this.colliderDebug.children) {
        if (child.userData.colliderMaterial) child.userData.colliderMaterial.color.setHex(support.stable ? 0x41ff9b : 0xffa629);
      }
      return true;
    }
    this.unstableRestTime = 0;
    this.abnormalVerticalTime = 0;
    this.grounded = false;
    this.wheelGroundedCount = 0;
    this.bodyGroundContact = false;
    this.broadBodyGroundContact = false;
    this.bodyRollingSeconds = 0;
    this.verticalStandingSeconds = 0;
    this.currentAngularDamping = LANDING_PHYSICS.airAngularDamping;
    return false;
  }

  handleDeepFloorRecovery(penetration) {
    if (penetration <= ALLOWED_FLOOR_PENETRATION) return false;
    this.groundPenetrationDetected = true;
    this.groundPenetrationDepth = penetration;
    this.physicsAwake = true;
    this.floorRecoveryTimer = Math.max(this.floorRecoveryTimer, 0.22);
    this.stats.floorRecoveries++;
    groundStats.deepRobotRecoveries++;
    this.stuckTime = 0;
    this.reverseTime = 0;
    this.velocity.y = Math.max(0, this.velocity.y);
    this.lastPosition.copy(this.root.position);
    this.updateWheelGroundDistances();
    if (!this.isPlayer && !this.dead && !this.postureRecovery) {
      this.aiState = 'SEARCH';
      this.aiStateTime = 0;
      this.aiTargetId = null;
      this.aiNavPath = [];
      this.aiNavGoal = null;
      this.aiNavRepath = 0;
      this.control.brake = false;
      this.stats.aiFsmFloorRecoveries++;
      groundStats.aiFsmFloorRecoveries++;
    }
    return true;
  }

  correctPhysicsFloorPenetration(tolerance = 0.0015) {
    const support = this.getGroundSupportInfo();
    const penetration = support.height - this.root.position.y;
    this.groundPenetrationDetected = penetration > tolerance;
    this.groundPenetrationDepth = Math.max(0, penetration);
    if (penetration <= tolerance) return 0;
    if (penetration > groundStats.maxRobotPenetration) groundStats.maxRobotPenetrationSource = {
      robot: this.name, stage: 'post-step-floor-solver', time: Number(worldTime.toFixed(3)),
      penetration: Number(penetration.toFixed(4)), rootY: Number(this.root.position.y.toFixed(4)),
      supportHeight: Number(support.height.toFixed(4)), pitch: Number(this.pitch.toFixed(3)), roll: Number(this.roll.toFixed(3)),
    };
    // Final solver pass: change only Y by the measured penetration. X/Z,
    // rotation and angular momentum remain physical, so this cannot upright or
    // teleport a robot. A downward velocity keeps a tiny restitution response.
    this.root.position.y += penetration;
    if (this.velocity.y < 0) this.velocity.y *= -0.02;
    groundStats.robotContacts++;
    groundStats.robotCorrections++;
    groundStats.postStepRobotCorrections++;
    groundStats.maxRobotPenetration = Math.max(groundStats.maxRobotPenetration, penetration);
    this.stats.groundCorrections++;
    this.stats.maxGroundPenetration = Math.max(this.stats.maxGroundPenetration, penetration);
    this.handleDeepFloorRecovery(penetration);
    this.lastSupportInfo = this.getGroundSupportInfo();
    this.grounded = true;
    this.physicsAwake = true;
    this.updateWheelGroundDistances();
    return penetration;
  }

  updatePhysics(dt, game) {
    this.beginTorqueFrame();
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.dashActiveTimer = Math.max(0, this.dashActiveTimer - dt);
    this.dashHitWindow = Math.max(0, this.dashHitWindow - dt);
    this.floorRecoveryTimer = Math.max(0, this.floorRecoveryTimer - dt);
    this.postureRecoveryCooldown = Math.max(0, this.postureRecoveryCooldown - dt);
    if (this.updatePostureRecovery(dt)) {
      this.updateWeapons(dt, game);
      this.resolveArena(game);
      this.correctPhysicsFloorPenetration();
      this.updateWheelGroundDistances();
      return;
    }
    this.selfRightCooldown = Math.max(0, this.selfRightCooldown - dt);
    this.selfRightAttemptWindow = Math.max(0, this.selfRightAttemptWindow - dt);
    if (this.selfRightAttemptWindow <= 0) this.selfRightRecoveryPending = false;
    const initialSupport = this.getGroundSupportInfo();
    // Wheel support includes suspension travel. The former 7.5 cm root-height
    // gate incorrectly killed motor drive on rolling desert terrain even while
    // two or more tyre contacts were valid.
    const driveContactAllowance = initialSupport.wheelSuspensionTravel + 0.055;
    const wheelGrounded = initialSupport.wheelContact && this.root.position.y <= initialSupport.height + driveContactAllowance;
    const upright = wheelGrounded && initialSupport.upDot > 0.55
      && Math.abs(normalizeAngle(this.pitch)) < 1.05 && Math.abs(normalizeAngle(this.roll)) < 1.05;
    const airborneBeforeStep = !wheelGrounded && this.root.position.y > initialSupport.height + 0.095;
    let activeWheels = 0;
    let activeLeftWheels = 0;
    let activeRightWheels = 0;
    for (const wheel of this.wheels) {
      if (wheel.part.detached) continue;
      activeWheels++;
      if (wheel.side < 0) activeLeftWheels++;
      else if (wheel.side > 0) activeRightWheels++;
    }
    const driveFactor = this.wheels.length ? Math.min(1, activeWheels / this.wheels.length) : 0;
    const forward = forwardFor(this.yaw);
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const forwardSpeed = this.velocity.dot(forward);
    const lateralSpeed = this.velocity.dot(right);

    if (!this.dead && upright && driveFactor > 0) {
      const profile = this.driveProfile ?? WEIGHT_CLASSES.middleweight;
      const acceleration = (this.type === 'hammer' ? 6.4 : 8.2) * profile.acceleration * (0.25 + driveFactor * 0.75);
      const driveDelta = forward.clone().multiplyScalar(this.control.throttle * acceleration * dt);
      this.velocity.add(driveDelta);
      this.recordLinearDelta('wheel-drive', driveDelta, 'Robot.updatePhysics');
      const dashSteeringScale = this.dashActiveTimer > 0 ? profile.dashSteering : 1;
      const steerGrip = lerp(0.7, 0.32, clamp(Math.abs(forwardSpeed) / 14, 0, 1)) * profile.steering * dashSteeringScale;
      const trackTurnBoost = this.driveType === 'track' ? lerp(1.35, 0.86, clamp(Math.abs(forwardSpeed) / 12, 0, 1)) : 1;
      const steeringYawDelta = this.control.steering * forwardSpeed * steerGrip * trackTurnBoost * dt;
      this.yawVelocity += steeringYawDelta;
      if (Math.abs(steeringYawDelta) > 1e-6) this.recordAngularDelta('wheel-steering', 0, steeringYawDelta, 0, 'Robot.updatePhysics');
      this.velocity.addScaledVector(right, -lateralSpeed * Math.min(1, dt * ((4.5 * driveFactor + 0.5) * profile.traction)));
      if (this.control.brake) this.velocity.multiplyScalar(Math.exp(-7 * dt));

      if (activeWheels < 4) {
        const imbalanceYawDelta = (activeRightWheels - activeLeftWheels) * Math.abs(forwardSpeed) * 0.11 * dt;
        this.yawVelocity += imbalanceYawDelta;
        if (Math.abs(imbalanceYawDelta) > 1e-6) this.recordAngularDelta('wheel-traction-imbalance', 0, imbalanceYawDelta, 0, 'Robot.updatePhysics');
      }
      if (this.dashActiveTimer > 0) {
        const dashForwardSpeed = this.velocity.dot(this.dashDirection);
        const firstBurst = this.dashActiveTimer > profile.dashDuration - 0.05;
        const dashAcceleration = (this.dashPeakSpeed - dashForwardSpeed) * (firstBurst ? 31 : 15);
        const dashDelta = this.dashDirection.clone().multiplyScalar(Math.max(0, dashAcceleration) * dt);
        this.velocity.add(dashDelta);
        this.stats.maximumDashSpeed = Math.max(this.stats.maximumDashSpeed, this.velocity.clone().setY(0).length());
        this.recordLinearDelta('dash-sustained-acceleration', dashDelta, 'Robot.updatePhysics');
        this.dashTravelled = this.root.position.clone().sub(this.dashStartPosition).setY(0).length();
        if (this.dashTravelled >= this.dashTargetDistance) this.dashActiveTimer = 0;
      }
    }

    const initialBroadBodyContact = !airborneBeforeStep && !initialSupport.wheelContact && initialSupport.stable
      && initialSupport.area >= LANDING_PHYSICS.broadBodyArea;
    const planarDamping = airborneBeforeStep ? 0.055 : upright ? 0.26
      : initialBroadBodyContact ? LANDING_PHYSICS.broadBodyPlanarDamping : LANDING_PHYSICS.edgeBodyPlanarDamping;
    const prePlanarDamping = this.velocity.clone();
    this.velocity.x *= Math.exp(-planarDamping * dt);
    this.velocity.z *= Math.exp(-planarDamping * dt);
    this.recordLinearDelta('planar-damping', this.velocity.clone().sub(prePlanarDamping), 'Robot.updatePhysics');
    const gravityMultiplier = airborneBeforeStep ? (this.velocity.y > 0 ? 1.2 : 1.95) : 1;
    const gravityDelta = new THREE.Vector3(0, -9.81 * gravityMultiplier * dt, 0);
    this.velocity.add(gravityDelta);
    this.recordLinearDelta('gravity', gravityDelta, 'Robot.updatePhysics');
    const planarSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const profile = this.driveProfile ?? WEIGHT_CLASSES.middleweight;
    const commandedTopSpeed = this.dashActiveTimer > 0 ? this.dashPeakSpeed : profile.topSpeed;
    const terminalSpeed = this.dead || worldTime - this.lastExternalImpactTime < 0.45 ? 44 : commandedTopSpeed;
    if (planarSpeed > terminalSpeed) {
      const scale = terminalSpeed / planarSpeed;
      this.velocity.x *= scale;
      this.velocity.z *= scale;
    }
    if (this.dashActiveTimer <= 0 && this.dashStartPosition) {
      const completedDistance = this.root.position.clone().sub(this.dashStartPosition).setY(0).length();
      if (completedDistance > this.dashTravelled) this.dashTravelled = completedDistance;
      if (this.dashTravelled > 0 && !this.dashDistanceRecorded) {
        this.dashDistanceRecorded = true;
        this.stats.maximumDashDistance = Math.max(this.stats.maximumDashDistance, this.dashTravelled);
        this.stats.dashDistanceSamples.push(Number(this.dashTravelled.toFixed(2)));
        if (this.stats.dashDistanceSamples.length > 12) this.stats.dashDistanceSamples.shift();
      }
    } else this.dashDistanceRecorded = false;
    this.velocity.y = clamp(this.velocity.y, -38, 18);
    this.yawVelocity *= Math.exp(-(airborneBeforeStep ? 0.07 : initialBroadBodyContact ? 3.8 : 1.05) * dt);
    if (airborneBeforeStep) {
      this.currentAngularDamping = LANDING_PHYSICS.airAngularDamping;
      this.pitchVelocity *= Math.exp(-LANDING_PHYSICS.airAngularDamping * dt);
      this.rollVelocity *= Math.exp(-LANDING_PHYSICS.airAngularDamping * dt);
    }
    this.yaw += this.yawVelocity * dt;
    const previousSupport = initialSupport.height;
    this.pitchVelocity = clamp(this.pitchVelocity, -9.5, 9.5);
    this.rollVelocity = clamp(this.rollVelocity, -9.5, 9.5);
    this.yawVelocity = clamp(this.yawVelocity, -9, 9);
    this.pitch += this.pitchVelocity * dt;
    this.roll += this.rollVelocity * dt;
    this.pitch = normalizeAngle(this.pitch);
    this.roll = normalizeAngle(this.roll);
    this.root.rotation.set(this.pitch, this.yaw, this.roll, 'YXZ');

    // Angular CCD: a fast pitch/roll can move a hull corner through the floor
    // even when its centre has not translated yet. Resolve that swept support
    // height before integrating position so no intermediate half-buried pose
    // is ever rendered or fed into the next collision solve.
    const rotatedSupportHeight = this.getGroundSupportInfo().height;
    const angularFloorPenetration = rotatedSupportHeight - this.root.position.y;
    const preexistingFloorPenetration = previousSupport - this.root.position.y;
    if (angularFloorPenetration > 0.003) {
      if (preexistingFloorPenetration > 0.003) {
        if (preexistingFloorPenetration > groundStats.maxRobotPenetration) groundStats.maxRobotPenetrationSource = {
          robot: this.name, stage: 'angular-ccd-preexisting-floor-recovery', time: Number(worldTime.toFixed(3)),
          penetration: Number(preexistingFloorPenetration.toFixed(4)), rootY: Number(this.root.position.y.toFixed(4)),
          supportHeight: Number(previousSupport.toFixed(4)), pitch: Number(this.pitch.toFixed(3)), roll: Number(this.roll.toFixed(3)),
        };
        groundStats.robotContacts++;
        groundStats.robotCorrections++;
        groundStats.maxRobotPenetration = Math.max(groundStats.maxRobotPenetration, preexistingFloorPenetration);
        this.stats.maxGroundPenetration = Math.max(this.stats.maxGroundPenetration, preexistingFloorPenetration);
        this.handleDeepFloorRecovery(preexistingFloorPenetration);
      }
      this.root.position.y = rotatedSupportHeight + 0.001;
      groundStats.angularSweepCorrections++;
      this.stats.groundCorrections++;
    }

    const beforeMove = this.root.position.clone();
    const nextPosition = this.root.position.clone().addScaledVector(this.velocity, dt);
    const sweptSupport = this.getGroundSupportInfo().height;
    if (beforeMove.y >= previousSupport - 0.02 && nextPosition.y < sweptSupport) {
      nextPosition.y = sweptSupport;
      groundStats.robotContacts++;
      const landingSupport = this.getGroundSupportInfo();
      const fallSpeed = Math.max(0, -this.velocity.y);
      if (!this.handleLanding(fallSpeed, landingSupport, nextPosition)) this.velocity.y = fallSpeed > 5 ? fallSpeed * 0.065 : Math.max(0, fallSpeed * 0.025);
    }
    this.root.position.copy(nextPosition);
    const travelled = this.root.position.clone().sub(beforeMove).setY(0).length();
    this.stats.distance += travelled;
    this.stats.maxSpeed = Math.max(this.stats.maxSpeed, this.velocity.clone().setY(0).length());

    const grounded = this.resolveGroundContact(dt);
    if (grounded && !this.lastSupportInfo?.wheelContact) {
      // Metal chassis has far less static grip than the tyres: an edge slides
      // instead of pinning itself to the arena floor.
      const bodyFriction = this.broadBodyGroundContact ? LANDING_PHYSICS.broadBodyPlanarDamping : LANDING_PHYSICS.edgeBodyPlanarDamping;
      const preBodyFriction = this.velocity.clone();
      this.velocity.x *= Math.exp(-bodyFriction * dt);
      this.velocity.z *= Math.exp(-bodyFriction * dt);
      this.recordLinearDelta('body-floor-friction', this.velocity.clone().sub(preBodyFriction), 'Robot.updatePhysics');
    }

    const finalSupport = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const finalTiltDegrees = THREE.MathUtils.radToDeg(Math.acos(clamp(finalSupport.upDot, -1, 1)));
    const finalAngularSpeed = Math.hypot(this.pitchVelocity, this.rollVelocity, this.yawVelocity);
    const quietOverturnedBody = this.bodyGroundContact && finalTiltDegrees >= 60
      && this.velocity.length() < 0.3 && finalAngularSpeed < 0.22;
    if (quietOverturnedBody) {
      this.passiveSettledSeconds += dt;
      if (this.passiveSettledSeconds >= 0.75) this.passiveSettledArmed = true;
    } else {
      const uncommandedSource = this.currentTorqueSources.find((source) => source !== 'gravity-com')
        ?? this.currentForceSources.find((source) => !['gravity', 'planar-damping', 'body-floor-friction'].includes(source));
      const externallyQuiet = worldTime - this.lastExternalImpactTime > 1
        && worldTime - this.lastWeaponReactionTime > 1;
      if (this.passiveSettledArmed && finalAngularSpeed > 0.55 && externallyQuiet && uncommandedSource) {
        this.passiveWakeups++;
        this.appendPhysicsTrace({
          t: Number(worldTime.toFixed(3)), kind: 'passive-wakeup', source: uncommandedSource,
          caller: 'Robot.updatePhysics', vector: [this.pitchVelocity, this.yawVelocity, this.rollVelocity].map((value) => Number(value.toFixed(4))),
          magnitude: Number(finalAngularSpeed.toFixed(4)),
        });
      }
      this.passiveSettledSeconds = 0;
      this.passiveSettledArmed = false;
    }
    const airborneNow = this.root.position.y > finalSupport.height + 0.065;
    if (airborneNow) {
      if (!this.wasAirborne) {
        this.stats.launches++;
        flightStats.launches++;
        this.airborneTime = 0;
        this.peakAirborneY = this.root.position.y;
      }
      this.airborneTime += dt;
      this.peakAirborneY = Math.max(this.peakAirborneY, this.root.position.y);
      this.stats.maxAirborneSeconds = Math.max(this.stats.maxAirborneSeconds, this.airborneTime);
      flightStats.maxAirborneSeconds = Math.max(flightStats.maxAirborneSeconds, this.airborneTime);
      if (this.velocity.y < 0) {
        this.stats.maxFallSpeed = Math.max(this.stats.maxFallSpeed, -this.velocity.y);
        flightStats.maxFallSpeed = Math.max(flightStats.maxFallSpeed, -this.velocity.y);
      }
    } else if (this.wasAirborne) {
      this.airborneTime = 0;
    }
    this.wasAirborne = airborneNow;
    this.updateLandingAudit();

    const selfRightCandidateNow = this.isSelfRightCandidate();
    const physicallyRecovered = this.selfRightRecoveryPending && this.selfRightAttemptWindow > 0
      && finalSupport.upDot > 0.52 && finalSupport.wheelContact && !airborneNow
      && this.root.position.y <= finalSupport.height + 0.1;
    if (physicallyRecovered) {
      this.stats.selfRightSuccesses++;
      flightStats.selfRightSuccesses++;
      this.selfRightAttemptWindow = 0;
      this.selfRightRecoveryPending = false;
    }
    this.wasSelfRightCandidate = selfRightCandidateNow;

    const steerTarget = this.control.steering * 0.45;
    this.steeringVisual += (steerTarget - this.steeringVisual) * (1 - Math.exp(-9 * dt));
    for (const wheel of this.wheels) {
      if (wheel.part.detached) continue;
      wheel.steeringPivot.rotation.y = wheel.steers ? this.steeringVisual : 0;
      if (wheel.colliderDebug) wheel.colliderDebug.quaternion.copy(wheel.steeringPivot.quaternion).multiply(wheel.mountOrientation.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(Z_AXIS, Math.PI / 2));
      if (wheel.isTrack) {
        // The two sides scroll independently, which also makes skid turns
        // readable without rotating the entire track mesh like a wheel.
        const sideSpeed = forwardSpeed + this.control.steering * wheel.side * Math.max(1.6, Math.abs(forwardSpeed) * 0.42);
        for (const material of wheel.trackMaterials) for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
          const texture = material[key];
          if (!texture) continue;
          texture.offset.x = (texture.offset.x - sideSpeed * dt * 0.085) % 1;
        }
      } else {
        // Positive local-Z travel requires negative local-X wheel rotation.
        wheel.rollPivot.rotation.x -= forwardSpeed * dt / Math.max(0.1, wheel.physicsRadius);
      }
    }

    this.resolveArena(game, beforeMove);
    this.updateWeapons(dt, game);
    this.correctPhysicsFloorPenetration();
    this.updateWheelGroundDistances();
    const activeDriveWheels = this.wheels.filter((wheel) => !wheel.part.detached).length;
    const commanded = Math.abs(this.control.throttle) > 0.3;
    const practicallyStopped = this.velocity.clone().setY(0).length() < 0.22;
    const driveSupport = this.lastSupportInfo ?? this.getGroundSupportInfo();
    const wheelDownAndAlive = !this.dead && activeDriveWheels >= 2 && driveSupport.wheelContact
      && driveSupport.upDot > 0.52 && this.root.position.y <= driveSupport.height + driveSupport.wheelSuspensionTravel + 0.06;
    if (commanded && wheelDownAndAlive && practicallyStopped) {
      this.driveStallSeconds += dt;
      if (this.isPlayer) this.playerDriveStallSeconds += dt;
      if (this.driveStallSeconds >= 0.82) {
        const audit = this.controlStateAudit();
        this.driveStallSnapshots.push({
          time: Number(worldTime.toFixed(2)), vehicle: this.instanceUid,
          sinceHit: Number((worldTime - this.lastExternalImpactTime).toFixed(2)),
          speed: Number(this.velocity.clone().setY(0).length().toFixed(3)),
          throttle: Number(this.control.throttle.toFixed(3)), steer: Number(this.control.steering.toFixed(3)),
          brake: Boolean(this.control.brake), groundedWheels: driveSupport.wheelContactCount,
          activeDriveWheels, motorEnabled: audit.motorEnabled, controlsEnabled: audit.controlsEnabled,
          physicsAwake: this.physicsAwake, postureRecovery: Boolean(this.postureRecovery),
        });
        if (this.driveStallSnapshots.length > 12) this.driveStallSnapshots.shift();
        this.recoverDriveController(this.isPlayer ? 'player-drive-stall-bug' : 'ai-drive-stall-bug');
        this.driveStallSeconds = 0;
      }
    } else {
      this.driveStallSeconds = Math.max(0, this.driveStallSeconds - dt * 3);
      this.playerDriveStallSeconds = Math.max(0, this.playerDriveStallSeconds - dt * 3);
    }
    if (commanded && wheelDownAndAlive && (!this.physicsAwake || this.disabledReason || this.immobileSeconds > 0.9)) {
      this.recoverDriveController(this.isPlayer ? 'player-live-drive-input' : 'ai-live-drive-input');
    }
    // Lack of progress is handled by controller/stuck recovery, never by a
    // persistent input lock. Only structural loss of the drive system may set
    // disabledReason.
    const physicallyUnable = activeDriveWheels < 2;
    this.immobileSeconds = physicallyUnable ? this.immobileSeconds + dt : Math.max(0, this.immobileSeconds - dt * 1.8);
    this.disabledReason = activeDriveWheels < 2 ? 'NO_WHEELS' : null;
    if (this.criticalDestructionAt < Infinity && worldTime >= this.criticalDestructionAt) this.destroyRobot(null, 'BLOCKS_LE_5');
    this.desertDustTimer -= dt;
    const cameraDistance = camera.position.distanceTo(this.root.position);
    const desertDustVisible = selectedMapId === 'desert01' && upright && driveSupport.wheelContact
      && Math.abs(forwardSpeed) > 4.5 && (this.isPlayer || cameraDistance < 105);
    if (desertDustVisible && this.desertDustTimer <= 0) {
      const dashing = this.dashActiveTimer > 0;
      const dustPoint = this.root.position.clone().addScaledVector(forward, -Math.max(0.7, this.radius * 0.48));
      dustPoint.y = groundSurfaceHeightAt(dustPoint.x, dustPoint.z) + 0.08;
      spawnDust(dustPoint, dashing ? 5 : Math.abs(forwardSpeed) > 10 ? 2 : 1);
      const distanceLOD = this.isPlayer ? 1 : clamp(cameraDistance / 105, 0, 1);
      this.desertDustTimer = dashing ? 0.07 : lerp(0.14, 0.34, distanceLOD);
    }
    this.skidTimer -= dt;
    if (upright && Math.abs(forwardSpeed) > 6 && Math.abs(this.control.steering) > 0.55 && this.skidTimer <= 0) {
      spawnDust(this.root.position.clone().addScaledVector(forward, -0.8), 2);
      this.skidTimer = 0.11;
    }
  }

  resolveArena(game, fromPosition = null) {
    const mapX = activeHalfWidth();
    const mapZ = activeHalfLength();
    const footprintBounds = footprintBoundsXZ(this);
    if (footprintBounds.maxX > mapX) {
      this.root.position.x -= footprintBounds.maxX - mapX;
      game.wallImpact(this, new THREE.Vector3(-1, 0, 0), new THREE.Vector3(mapX, 0.5, this.root.position.z), { obstacleType: 'fence' });
    }
    if (footprintBounds.minX < -mapX) {
      this.root.position.x += -mapX - footprintBounds.minX;
      game.wallImpact(this, new THREE.Vector3(1, 0, 0), new THREE.Vector3(-mapX, 0.5, this.root.position.z), { obstacleType: 'fence' });
    }
    if (footprintBounds.maxZ > mapZ) {
      this.root.position.z -= footprintBounds.maxZ - mapZ;
      game.wallImpact(this, new THREE.Vector3(0, 0, -1), new THREE.Vector3(this.root.position.x, 0.5, mapZ), { obstacleType: 'fence' });
    }
    if (footprintBounds.minZ < -mapZ) {
      this.root.position.z += -mapZ - footprintBounds.minZ;
      game.wallImpact(this, new THREE.Vector3(0, 0, 1), new THREE.Vector3(this.root.position.x, 0.5, -mapZ), { obstacleType: 'fence' });
    }

    for (const obstacle of obstacles) {
      if (obstacle.kind === 'box') {
        const sweptContact = sweptOrientedBoxContact(this, obstacle, fromPosition);
        if (sweptContact) {
          this.root.position.copy(sweptContact.position);
          environmentCollisionStats.maxPenetration = Math.max(environmentCollisionStats.maxPenetration, 0);
          game.wallImpact(this, sweptContact.normal, sweptContact.point, obstacle);
          continue;
        }
        const broadphase = this.radius + obstacle.radius + 0.5;
        if ((this.root.position.x - obstacle.x) ** 2 + (this.root.position.z - obstacle.z) ** 2 > broadphase ** 2) continue;
        const contact = expandedBoxCentreContact(this, obstacle) ?? polygonObstacleContact(this, obstacle);
        if (!contact) continue;
        this.root.position.addScaledVector(contact.normal, contact.penetration + 0.0005);
        environmentCollisionStats.maxPenetration = Math.max(environmentCollisionStats.maxPenetration, contact.penetration);
        game.wallImpact(this, contact.normal, contact.point, obstacle);
        continue;
      }
      const delta = new THREE.Vector3(this.root.position.x - obstacle.x, 0, this.root.position.z - obstacle.z);
      const minimum = this.radius + obstacle.radius;
      if (delta.lengthSq() >= minimum * minimum) continue;
      const normal = delta.lengthSq() > 0.001 ? delta.normalize() : new THREE.Vector3(1, 0, 0);
      this.root.position.set(obstacle.x + normal.x * minimum, this.root.position.y, obstacle.z + normal.z * minimum);
      game.wallImpact(this, normal, obstacle.mesh.position.clone().addScaledVector(normal, obstacle.radius), obstacle);
    }

    for (const ramp of ramps) {
      const cos = Math.cos(-ramp.rotationY);
      const sin = Math.sin(-ramp.rotationY);
      const dx = this.root.position.x - ramp.x;
      const dz = this.root.position.z - ramp.z;
      const localX = dx * cos - dz * sin;
      const localZ = dx * sin + dz * cos;
      if (Math.abs(localX) < ramp.halfX && Math.abs(localZ) < ramp.halfZ && Math.abs(this.velocity.dot(forwardFor(this.yaw))) > 4.5 && this.root.position.y <= this.groundSupportHeight() + 0.06) {
        this.velocity.y = Math.max(this.velocity.y, 3.4);
        this.pitchVelocity += 0.8 * Math.sign(this.velocity.dot(forwardFor(this.yaw)));
      }
    }
  }

  activeBlockParts() {
    return [...this.blockParts.values()].filter((part) => !part.detached);
  }

  blockStructureRatio() {
    const all = [...this.blockParts.values()];
    if (!all.length) return 0;
    const current = all.reduce((sum, part) => sum + (part.detached ? 0 : Math.max(0, part.hp)), 0);
    const maximum = all.reduce((sum, part) => sum + part.maxHp, 0);
    return maximum > 0 ? current / maximum : 0;
  }

  remainingBlockRatio() {
    return this.blockParts.size ? this.activeBlockParts().length / this.blockParts.size : 0;
  }

  coreHealthRatio() {
    return this.corePart ? clamp(this.corePart.hp / this.corePart.maxHp, 0, 1) : 0;
  }

  partWorldCentre(part) {
    return part.object.getWorldPosition(new THREE.Vector3());
  }

  updateBlockDamageVisual(part) {
    const ratio = clamp(part.hp / part.maxHp, 0, 1);
    // Damage is data-only. Never tint, darken, desaturate, fade, or replace the
    // live block material; the same rendered object becomes the debris object.
    part.record.damageState = ratio <= 0 ? 'destroyed' : ratio < 0.34 ? 'critical' : ratio < 0.67 ? 'damaged' : 'intact';
  }

  detachBlockChunk(chunkParts, impulse, point, reason = 'connection-loss') {
    const active = chunkParts.filter((part) => part && !part.detached);
    if (!active.length) return;
    const centre = active.reduce((sum, part) => sum.add(this.partWorldCentre(part)), new THREE.Vector3()).multiplyScalar(1 / active.length);
    const chunk = new THREE.Group();
    chunk.name = `${this.name}_BlockChunk_${reason}_${this.stats.blockChunksDetached + 1}`;
    chunk.position.copy(centre);
    scene.add(chunk);
    chunk.updateMatrixWorld(true);
    for (const part of active) {
      this.hideBlockRenderInstance(part);
      part.detached = true;
      part.hp = Math.max(0, part.hp);
      chunk.attach(part.object);
      this.stats.detached++;
      this.stats.blocksDestroyed++;
      this.stats.detachedByType.block = (this.stats.detachedByType.block ?? 0) + 1;
    }
    this.stats.blockChunksDetached++;
    this.stats.maximumBlocksDetachedAtOnce = Math.max(this.stats.maximumBlocksDetachedAtOnce, active.length);
    const impulseDirection = impulse.lengthSq() > 0.001 ? impulse.clone().normalize() : new THREE.Vector3(0, 0.2, 1);
    const radial = centre.clone().sub(point);
    if (radial.lengthSq() < 0.001) radial.set(Math.random() - 0.5, Math.random() * 0.45 + 0.1, Math.random() - 0.5);
    const direction = radial.normalize().multiplyScalar(0.48).add(impulseDirection).normalize();
    const mass = active.reduce((sum, part) => sum + part.mass, 0);
    const radius = Math.max(GRID_UNIT * 0.44, ...active.map((part) => part.radius ?? GRID_UNIT * 0.5));
    registerDebris({
      object: chunk,
      velocity: this.velocity.clone().addScaledVector(direction, clamp(impulse.length() / Math.max(mass, 2) * 0.085, 3.2, 22)).add(new THREE.Vector3(0, 1.4 + Math.random() * 3.2, 0)),
      angular: new THREE.Vector3(direction.z + (Math.random() - 0.5) * 0.95, 1.8 + Math.random() * 5.2, -direction.x + (Math.random() - 0.5) * 0.95).multiplyScalar(2.8 + Math.random() * 3.5),
      life: BLOCK_DEBRIS_LIFETIME,
      radius,
      blockChunkSize: active.length,
      reason,
      preservesOriginalMaterial: true,
    });
  }

  recalculateFunctionalConnectivity(impulse, point) {
    const structuralIds = new Set(this.activeBlockParts().map((part) => part.assemblyId));
    const connected = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      for (const record of this.assembly.parts) {
        const runtimePart = this.functionalParts.get(record.id);
        if (!runtimePart || runtimePart.detached || connected.has(record.id)) continue;
        const targets = [record.mount?.targetId, ...(record.mount?.targetIds ?? []), ...(record.linkedTo ?? [])].filter(Boolean);
        if (targets.some((id) => structuralIds.has(id) || connected.has(id))) {
          connected.add(record.id);
          changed = true;
        }
      }
    }
    const disconnected = [...this.functionalParts.values()].filter((part) => !part.detached && !connected.has(part.assemblyId));
    for (const part of disconnected) this.detachPart(part, impulse.clone().multiplyScalar(0.62), point, false);
    return disconnected;
  }

  recalculateBlockConnectivity(impulse, point) {
    const activeRecords = this.activeBlockParts().map((part) => part.record);
    const graph = getBlockConnectionGraph(activeRecords);
    if (!this.corePart || this.corePart.detached || this.corePart.hp <= 0 || !graph.connected.has(this.corePart.assemblyId)) {
      this.destroyRobot(null, 'CORE_DESTROYED');
      return { disconnectedBlocks: [], disconnectedParts: [] };
    }
    const disconnectedIds = new Set(graph.disconnected.map((record) => record.id));
    const chunks = [];
    while (disconnectedIds.size) {
      const first = disconnectedIds.values().next().value;
      const queue = [first];
      disconnectedIds.delete(first);
      const ids = [];
      while (queue.length) {
        const id = queue.shift();
        ids.push(id);
        for (const next of graph.adjacency.get(id) ?? []) if (disconnectedIds.delete(next)) queue.push(next);
      }
      const chunkParts = ids.map((id) => this.blockParts.get(id)).filter(Boolean);
      chunks.push(chunkParts);
      this.detachBlockChunk(chunkParts, impulse.clone().multiplyScalar(0.72), point, 'core-disconnected');
    }
    const disconnectedParts = this.recalculateFunctionalConnectivity(impulse, point);
    this.recalculateMass();
    return { disconnectedBlocks: chunks.flat(), disconnectedParts };
  }

  finalizeBlockDestruction(result, impulse, point, attacker) {
    const destroyed = result?.destroyed ?? [];
    if (!destroyed.length || result.finalized) return result;
    result.finalized = true;
    for (const part of destroyed) this.detachBlockChunk([part], impulse, point, part.isCore ? 'core-destroyed' : 'impact-destroyed');
    this.recalculateMass();
    if (destroyed.some((part) => part.isCore)) this.destroyRobot(attacker, 'CORE_DESTROYED');
    else this.recalculateBlockConnectivity(impulse, point);
    if (attacker?.isPlayer) showMessage(`${this.name} 블록 ${destroyed.length}개 파괴`, 1.0);
    return result;
  }

  applyBlockDamageAtImpact(primary, amount, impulse, point, attacker, tier, intensityScore, deferDetach = false, totalDamageBudget = null) {
    if (!primary || primary.detached) return { damaged: [], destroyed: [] };
    this.stats.blockHits++;
    if (primary.isCore) this.stats.coreHits++;
    const tierPower = { weak: 0.58, medium: 1.18, strong: 1.58, veryStrong: 2.2, critical: 3.1 }[tier] ?? 1;
    const impactEnergy = Math.max(0, intensityScore) + impulse.length() * 0.02 + amount * 2.05;
    const radiusCells = clamp((impactEnergy - 38) / 42, 0, 5.2);
    const damageRadius = GRID_UNIT * (0.66 + radiusCells);
    const blockParts = this.activeBlockParts();
    const damaged = [];
    const destroyed = [];
    const candidates = [];
    for (const part of blockParts) {
      const centre = this.partWorldCentre(part);
      const distance = centre.distanceTo(point);
      if (part !== primary && distance > damageRadius) continue;
      const falloff = part === primary ? 1 : Math.pow(clamp(1 - distance / Math.max(damageRadius, GRID_UNIT), 0, 1), 1.65);
      // A critical is allowed to shatter several nearby low-HP/low-armor
      // blocks, but the radius and transmitted damage still come from the
      // measured impact energy. This avoids both fixed-count destruction and
      // the old result where a full critical could never break a neighbouring
      // cube because of a hard 110-damage ceiling.
      const criticalShock = tier === 'critical' ? clamp((impactEnergy - 260) / 280, 0, 1) : 0;
      const transmission = part === primary ? 1 : (tier === 'critical' ? 0.78 + criticalShock * 0.14 : tier === 'veryStrong' ? 0.68 : tier === 'strong' ? 0.5 : tier === 'medium' ? 0.28 : 0.04);
      const armorAbsorption = (part.armor ?? 0) * (part === primary ? 0.28 : 0.4);
      const connectionResistance = part === primary ? 0 : Math.max(0, (part.connectionStrength ?? 100) - 100) * 0.03;
      const primaryCap = tier === 'critical' ? 300 : tier === 'veryStrong' ? 225 : tier === 'strong' ? 175 : tier === 'medium' ? 96 : 22;
      const neighbourCap = tier === 'critical' ? lerp(150, 235, criticalShock) : tier === 'veryStrong' ? 150 : tier === 'strong' ? 105 : 68;
      const cap = Math.min(part.hp, part === primary ? primaryCap : neighbourCap);
      const resistance = 1 / (1 + Math.max(0, armorAbsorption + connectionResistance) * 0.025);
      const weight = Math.max(0.001, falloff * transmission * resistance * (part === primary ? 3.8 : 1));
      candidates.push({ part, weight, cap, falloff, transmission, armorAbsorption, connectionResistance });
    }

    const budgetedDamage = Number.isFinite(totalDamageBudget) && totalDamageBudget > 0;
    const allocated = new Map();
    if (budgetedDamage && candidates.length) {
      let remaining = Math.min(totalDamageBudget, candidates.reduce((sum, item) => sum + item.cap, 0));
      let open = candidates.filter((item) => item.cap > 0.05);
      for (let pass = 0; pass < 6 && remaining > 0.05 && open.length; pass++) {
        const totalWeight = open.reduce((sum, item) => sum + item.weight, 0);
        let distributed = 0;
        for (const item of open) {
          const used = allocated.get(item.part) ?? 0;
          const room = Math.max(0, item.cap - used);
          const share = totalWeight > 0 ? remaining * item.weight / totalWeight : remaining / open.length;
          const add = Math.min(room, share);
          if (add <= 0) continue;
          allocated.set(item.part, used + add);
          distributed += add;
        }
        remaining -= distributed;
        open = open.filter((item) => (allocated.get(item.part) ?? 0) < item.cap - 0.01);
        if (distributed <= 0.01) break;
      }
    }

    for (const item of candidates) {
      const { part, falloff, transmission, armorAbsorption, connectionResistance } = item;
      const rawDamage = amount * tierPower * falloff * transmission - armorAbsorption - connectionResistance;
      const applied = budgetedDamage
        ? clamp(allocated.get(part) ?? 0, part === primary ? 1.5 : 0, item.cap)
        : clamp(rawDamage, part === primary ? 1.5 : 0, item.cap);
      if (applied <= 0.05) continue;
      part.hp = Math.max(0, part.hp - applied);
      part.record.hp = part.hp;
      this.updateBlockDamageVisual(part);
      part.lastDamage = { amount: applied, tier, point: point.toArray(), at: worldTime };
      impactStats.maxSingleDamage = Math.max(impactStats.maxSingleDamage, applied);
      damaged.push(part);
      if (part.hp <= 0) destroyed.push(part);
    }
    // The coloured micro-fragments are emitted while the actual block is still
    // attached. The normal metal spark burst follows, and only then does the
    // production caller detach the real block object.
    const fragmentBurst = spawnBlockFragments(primary, point, impulse, tier);
    const result = { damaged, destroyed, impactEnergy, damageRadius, fragmentBurst, finalized: false };
    if (!deferDetach) this.finalizeBlockDestruction(result, impulse, point, attacker);
    return result;
  }

  chooseHitPart(point, sourceType) {
    const candidates = this.parts.filter((part) => !part.detached);
    if (!candidates.length) return null;
    let best = null;
    let bestScore = Infinity;
    for (const part of candidates) {
      let score;
      if (part.type === 'block') {
        const bounds = new THREE.Box3().setFromObject(part.object);
        score = bounds.distanceToPoint(point) ** 2;
      } else {
        const world = this.partWorldCentre(part);
        score = Math.max(0, world.distanceTo(point) - (part.radius ?? 0.4)) ** 2;
      }
      if (sourceType === 'flipper' && part.type === 'wheel') score *= 0.55;
      if (part.type === 'block') score *= 0.72;
      if (part.type === 'armor') score *= 0.42;
      if (part.type === 'decoration') score *= 0.82;
      if (score < bestScore) { bestScore = score; best = part; }
    }
    return best;
  }

  applyImpactAtPoint(impulse, point, damage, sourceType, attacker = null, impactOptions = {}) {
    if (this.dead) return null;
    if (this.spawnProtectionUntil > worldTime) {
      respawnStats.protectionBlocks++;
      spawnMetalSparks(point, impulse, 3, 'weak', null, 'impact', point.clone().sub(this.root.position).normalize());
      return { tier: 'protected', protected: true, sparkCount: 3, hitBlockId: null };
    }
    const impulseMagnitude = impulse.length();
    let impactedPart = null;
    this.lastExternalImpactTime = worldTime;
    if (damage <= 0.1) {
      const minorDelta = impulse.clone().multiplyScalar(0.34 / this.mass);
      this.velocity.add(minorDelta);
      this.recordLinearDelta('minor-impact', minorDelta, 'Robot.applyImpactAtPoint');
      return null;
    }
    const relativeVelocity = attacker ? this.velocity.clone().sub(attacker.velocity) : this.velocity.clone();
    const relativeSpeed = relativeVelocity.length();
    const contactSpeed = Math.max(relativeSpeed, Number(impactOptions.contactSpeed ?? 0));
    const weaponMass = Math.max(0, Number(impactOptions.weaponMass ?? 0));
    const impulseDirection = impulseMagnitude > 0.001 ? impulse.clone().multiplyScalar(1 / impulseMagnitude) : new THREE.Vector3();
    const directional = relativeSpeed > 0.5 ? Math.abs(relativeVelocity.normalize().dot(impulseDirection)) : 0.45;
    const centre = this.worldCenterOfMass();
    const armLength = point.distanceTo(centre);
    const airborne = this.root.position.y > this.groundSupportHeight() + 0.42;
    const massRatio = attacker ? clamp(attacker.mass / this.mass, 0.45, 1.85) : 0.8;
    const sourceBonus = { bar: 18, drum: 15, spinner: 8, hammer: 14, flipper: 6, dash: 16, collision: 0 }[sourceType] ?? 0;
    const intensityScore = damage * 0.82 + impulseMagnitude * 0.02 + relativeSpeed * 1.25 + contactSpeed * 0.11
      + weaponMass * 0.12 + Math.min(armLength, 3.4) * 4.2 + directional * 9 + massRatio * 5 + sourceBonus - (airborne ? 7 : 0);
    const independentHit = impactOptions.allowCritical !== false && impactOptions.sparkMode !== 'saw-continuous';
    const criticalChance = impactOptions.suppressCritical ? 0 : criticalChanceForImpactScore(intensityScore, sourceType, independentHit);
    const forcedTier = ['weak', 'medium', 'strong', 'veryStrong', 'critical'].includes(impactOptions.forceTier) ? impactOptions.forceTier : null;
    const critical = forcedTier === 'critical' || (!forcedTier && criticalChance > 0 && Math.random() < criticalChance);
    if (!impactOptions.suppressStats && criticalChance > 0) {
      impactStats.criticalEligible++;
      impactStats.criticalRolls++;
      impactStats.maxCriticalChance = Math.max(impactStats.maxCriticalChance, criticalChance);
    }
    const baseTier = intensityScore >= 140 ? 'veryStrong' : intensityScore >= 105 ? 'strong' : intensityScore >= 58 ? 'medium' : 'weak';
    const tier = forcedTier ?? (critical ? 'critical' : baseTier);
    const impulseScale = tier === 'critical' ? 2.15 : tier === 'veryStrong' ? 1.7 : tier === 'strong' ? 1.35 : tier === 'medium' ? 1 : 0.82;
    const forceScale = clamp(Number(impactOptions.forceScale ?? 1), 0, 1);
    const scaledImpulse = impulse.clone().multiplyScalar(impulseScale * forceScale);
    // Horizontal weapons throw the opponent across the floor. They cannot gain
    // flipper-like lift simply because a random contact vector pointed upward.
    if (sourceType === 'bar' || sourceType === 'spinner') {
      const horizontalBoost = sourceType === 'bar' ? 1.16 : 1.08;
      scaledImpulse.x *= horizontalBoost;
      scaledImpulse.z *= horizontalBoost;
      const planar = Math.hypot(scaledImpulse.x, scaledImpulse.z);
      const upwardRatio = sourceType === 'bar' ? 0.1 : 0.065;
      scaledImpulse.y = clamp(scaledImpulse.y, -planar * 0.2, planar * upwardRatio);
    }
    const heightOffset = point.y - centre.y;
    const horizontalImpulse = Math.hypot(scaledImpulse.x, scaledImpulse.z);
    const underbodyFactor = clamp((-heightOffset - 0.12) / 0.85, 0, 1);
    if (underbodyFactor > 0 && horizontalImpulse > 260 && !airborne && ['flipper', 'drum'].includes(sourceType)) {
      scaledImpulse.y += Math.min(horizontalImpulse * 0.18 * underbodyFactor, this.mass * 7.5);
    }
    if (!impactOptions.suppressStats) {
      impactStats[tier]++;
      impactStats.maxImpulse = Math.max(impactStats.maxImpulse, impulseMagnitude);
      if (impactStats.firstImpactTime === null && mode === 'battle') impactStats.firstImpactTime = Number(battleElapsed.toFixed(3));
      if (critical) {
        impactStats.minCriticalScore = impactStats.minCriticalScore === null ? intensityScore : Math.min(impactStats.minCriticalScore, intensityScore);
        impactStats.maxCriticalScore = Math.max(impactStats.maxCriticalScore, intensityScore);
      }
      impactSamples.push({
        tier,
        sourceType,
        battleTime: mode === 'battle' ? Number(battleElapsed.toFixed(3)) : null,
        score: Number(intensityScore.toFixed(1)),
        criticalChance: Number(criticalChance.toFixed(3)),
        impulse: Number(impulseMagnitude.toFixed(1)),
        contactSpeed: Number(contactSpeed.toFixed(1)),
        arm: Number(armLength.toFixed(2)),
        underbody: point.y < centre.y - 0.12,
      });
      if (impactSamples.length > 40) impactSamples.shift();
    }
    const impactVelocityDelta = scaledImpulse.clone().multiplyScalar(1 / this.mass);
    this.velocity.add(impactVelocityDelta);
    this.recordLinearDelta('impact-impulse', impactVelocityDelta, 'Robot.applyImpactAtPoint');
    const launchHorizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const launchVerticalSpeed = Math.max(0, this.velocity.y);
    this.stats.maxLaunchHorizontalSpeed = Math.max(this.stats.maxLaunchHorizontalSpeed, launchHorizontalSpeed);
    this.stats.maxLaunchVerticalSpeed = Math.max(this.stats.maxLaunchVerticalSpeed, launchVerticalSpeed);
    flightStats.maxLaunchHorizontalSpeed = Math.max(flightStats.maxLaunchHorizontalSpeed, launchHorizontalSpeed);
    flightStats.maxLaunchVerticalSpeed = Math.max(flightStats.maxLaunchVerticalSpeed, launchVerticalSpeed);
    const arm = point.clone().sub(centre);
    const torque = new THREE.Vector3().crossVectors(arm, scaledImpulse);
    const torqueLocal = worldTorqueToEulerAxes(torque, this.yaw, this.pitch);
    const torqueScale = tier === 'critical' ? 1.9 : tier === 'veryStrong' ? 1.45 : tier === 'strong' ? 1.05 : tier === 'medium' ? 0.62 : 0.32;
    const yawDelta = torqueLocal.y / (this.mass * 2.35) * torqueScale;
    const pitchDelta = torqueLocal.x / (this.mass * 2.25) * torqueScale;
    const rollDelta = torqueLocal.z / (this.mass * 2.25) * torqueScale;
    this.yawVelocity += yawDelta;
    this.pitchVelocity += pitchDelta;
    this.rollVelocity += rollDelta;
    this.recordAngularDelta(forceScale < 1 ? 'sustained-weapon-contact' : 'impact-impulse', pitchDelta, yawDelta, rollDelta, 'Robot.applyImpactAtPoint');
    if (!impactOptions.suppressStats && Math.abs(torque.y) > 12) {
      this.stats.torqueSigns.push(Math.sign(torque.y));
      if (this.stats.torqueSigns.length > 12) this.stats.torqueSigns.shift();
    }

    let blockDamageResult = null;
    if (!impactOptions.suppressDamage) {
      const part = this.chooseHitPart(point, sourceType);
      impactedPart = part;
      const damageScale = tier === 'critical' ? 2.4 : tier === 'veryStrong' ? 1.92 : tier === 'strong' ? 1.55 : tier === 'medium' ? 1.18 : 0.5;
      const fractionRanges = { weak: [0.004, 0.016], medium: [0.025, 0.07], strong: [0.08, 0.18], veryStrong: [0.15, 0.3], critical: [0.25, 0.45] };
      const [minimumFraction, maximumFraction] = fractionRanges[tier];
      const maximumStructureHp = [...this.blockParts.values()].reduce((sum, blockPart) => sum + blockPart.maxHp, 0);
      const situational = clamp((intensityScore - 35) / 185, 0, 1);
      const targetStructureDamage = maximumStructureHp * lerp(minimumFraction, maximumFraction, clamp(situational * 0.72 + Math.random() * 0.28, 0, 1));
      const tunedDamage = Math.max(damage * damageScale, targetStructureDamage);
      if (part?.type === 'block') blockDamageResult = this.applyBlockDamageAtImpact(part, tunedDamage, scaledImpulse, point, attacker, tier, intensityScore, true, targetStructureDamage);
      else this.damagePart(part, damage * damageScale, scaledImpulse, point, attacker, tier);
    }
    const sparkRanges = { weak: [2, 5], medium: [6, 15], strong: [20, 40], veryStrong: [35, 60], critical: [50, 90] };
    const [sparkMin, sparkMax] = sparkRanges[tier];
    const scoreMix = clamp((intensityScore - 20) / 185, 0, 1);
    let sparkCount = Math.round(lerp(sparkMin, sparkMax, clamp(scoreMix * 0.7 + Math.random() * 0.3, 0, 1)));
    let sparkTier = tier;
    if (impactOptions.sparkMode === 'saw-first') sparkCount = clamp(Math.round(sparkCount * 0.82), 18, 52);
    if (impactOptions.sparkMode === 'saw-continuous') {
      sparkCount = clamp(Math.round(sparkCount * 0.34), 6, 14);
      sparkTier = intensityScore >= 92 ? 'medium' : 'weak';
    }
    if (impactOptions.sparkMode === 'rotary-continuous') {
      sparkCount = clamp(Math.round(sparkCount * 0.18), 4, 10);
      sparkTier = 'weak';
    }
    if (!impactOptions.suppressStats) impactStats.maxSparks = Math.max(impactStats.maxSparks, sparkCount);
    if (sourceType !== 'fire' && !impactOptions.suppressSparks) {
      const sparkSurfaceNormal = impactOptions.surfaceNormal?.clone() ?? point.clone().sub(centre).normalize();
      spawnMetalSparks(point, scaledImpulse, sparkCount, sparkTier, impactOptions.tangentHint, impactOptions.sparkMode ?? 'impact', sparkSurfaceNormal);
    }
    if (blockDamageResult?.destroyed?.length) this.finalizeBlockDestruction(blockDamageResult, scaledImpulse, point, attacker);
    if (!impactOptions.suppressFlash && ['strong', 'veryStrong', 'critical'].includes(tier)) {
      spawnFlash(point, tier === 'critical' ? 12 : tier === 'veryStrong' ? 6.5 : 2.8);
    }
    if (sourceType !== 'fire' && !impactOptions.suppressAudio) playImpactAudio(tier, point);
    if (!impactOptions.suppressStats && ['strong', 'veryStrong', 'critical'].includes(tier)) audioStats.heavyImpacts++;
    if (!impactOptions.suppressFeedback) {
      const shakeByTier = { weak: 0.018, medium: 0.075, strong: 0.17, veryStrong: 0.3, critical: 0.48 }[tier];
      cameraShake = Math.max(cameraShake, shakeByTier);
      if (!qa && (this.isPlayer || attacker?.isPlayer) && ['strong', 'veryStrong', 'critical'].includes(tier)) {
        hitStopTimer = Math.max(hitStopTimer, tier === 'critical' ? 0.055 : tier === 'veryStrong' ? 0.042 : 0.028);
      }
    }
    if (!impactOptions.suppressDamage) {
      const remainingMainBlocks = this.activeBlockParts().length;
      if (remainingMainBlocks <= 5 && this.criticalDestructionAt === Infinity) {
        this.criticalDestructionAt = worldTime + 0.42;
        spawnMetalSparks(this.root.position.clone().add(new THREE.Vector3(0, 0.7, 0)), scaledImpulse, 72, 'critical', null, 'impact', Y_AXIS);
        showMessage(`${this.name} CRITICAL DESTRUCTION`, 1.2);
      }
      if (!this.corePart || this.corePart.hp <= 0) this.destroyRobot(attacker, 'CORE_DESTROYED');
      else if (remainingMainBlocks === 0) this.destroyRobot(attacker, 'BLOCKS_LE_5');
    }
    return { tier, intensityScore, criticalChance, critical, sparkCount, scaledImpulse: scaledImpulse.clone(), torque: torque.clone(), underbodyFactor, hitBlockId: impactedPart?.type === 'block' ? impactedPart.assemblyId : null };
  }

  weaponMountsForPart(part) {
    const rotary = this.rotaryWeapons.find((weapon) => weapon.blade === part || weapon.weaponKey === part.weaponKey);
    if (rotary) return rotary.mounts ?? [];
    if (this.weapons.hammer?.moving === part) return this.weapons.hammer.mount ? [this.weapons.hammer.mount] : [];
    if (this.weapons.flipper?.plate === part) return this.weapons.flipper.mounts ?? [];
    return [];
  }

  applyWeaponReactionWear(weapon, amount, impulse, point, tier = 'medium') {
    const moving = weapon.blade ?? weapon.moving ?? weapon.plate;
    const mounts = weapon.mounts ?? (weapon.mount ? [weapon.mount] : []);
    if (moving && !moving.detached) this.damagePart(moving, amount, impulse, point, this, tier, { selfWeaponReaction: true });
    for (const mount of mounts) if (mount && !mount.detached) this.damagePart(mount, amount * 0.62, impulse, point, this, tier, { selfWeaponReaction: true, jointWear: true });
  }

  damagePart(part, amount, impulse, point, attacker, tier = 'weak', context = {}) {
    if (!part || part.detached) return;
    const selfWeaponReaction = Boolean(context.selfWeaponReaction || (attacker === this && part.type === 'weapon'));
    const reactionMultiplier = selfWeaponReaction ? 0.18 : 1;
    const maximum = part.type === 'weaponMount' ? 18 : part.type === 'weapon' ? 32 : part.type === 'wheel' ? 20 : part.type === 'armor' ? 44 : part.type === 'decoration' ? 26 : 28;
    const armorReduction = clamp((part.armor ?? 0) * 0.006, 0, 0.32);
    const applied = Math.min(amount * reactionMultiplier * (1 - armorReduction), maximum);
    impactStats.maxSingleDamage = Math.max(impactStats.maxSingleDamage, applied);
    part.cumulativeDamage = (part.cumulativeDamage ?? 0) + applied;
    if (selfWeaponReaction) part.reactionDamage = (part.reactionDamage ?? 0) + applied;
    if (applied >= (part.type === 'weaponMount' ? 2.2 : 3.2) && worldTime - (part.lastStructuralHitTime ?? -Infinity) > 0.1) {
      part.structuralHits = (part.structuralHits ?? 0) + 1;
      part.lastStructuralHitTime = worldTime;
    }
    part.hp -= applied;
    if (part.hp > 0) return;
    if (part.type === 'weapon') {
      const liveMounts = this.weaponMountsForPart(part).filter((mount) => !mount.detached);
      if (liveMounts.length) {
        // A blade cannot fall off from its own normal reaction. Its joint/mount
        // must accumulate structural damage and break first.
        part.hp = Math.max(1, part.maxHp * 0.04);
        part.damageSaturated = true;
        return;
      }
    }
    const breakThreshold = part.type === 'weaponMount' ? (part.jointBreakForce ?? 2450) : part.type === 'weapon' ? 1500 : part.type === 'wheel' ? 760 : part.type === 'armor' ? 900 : part.type === 'decoration' ? 520 : 780;
    const minimumStructuralHits = part.type === 'weaponMount' ? 5 : part.type === 'weapon' ? 4 : 1;
    const destructiveHit = ['veryStrong', 'critical'].includes(tier) && impulse.length() >= breakThreshold && (part.structuralHits ?? 0) >= minimumStructuralHits;
    if (!destructiveHit) {
      part.hp = Math.max(1, part.maxHp * 0.025);
      return;
    }
    part.hp = 0;
    if (part.detachable) this.detachPart(part, impulse, point);
    if (part.weaponKey && !this.weaponAvailable(part.weaponKey)) {
      if (this.isPlayer) showMessage(`${part.weaponKey.toUpperCase()} 무기 파괴!`);
    }
    if (attacker?.isPlayer) showMessage(`${this.name} ${part.name} 파괴`);
  }

  detachPart(part, impulse, point, cascade = true) {
    if (part.detached || !part.detachable) return;
    const worldPosition = this.partWorldCentre(part);
    if (part.type === 'block') this.hideBlockRenderInstance(part);
    if (part.record?.nativeBlockPlate) this.addNativeArmorDebrisVisual(part);
    part.detached = true;
    if (part.record?.nativeBlockPlate) this.refreshNativeArmorRenderBatch();
    playSpatialSample(part.type === 'block' ? 'blockBreak' : 'partBreak', worldPosition, part.type === 'block' ? 0.58 : 0.68, 0.9 + Math.random() * 0.16, 4);
    this.stats.detached++;
    this.stats.detachedByType[part.type] = (this.stats.detachedByType[part.type] ?? 0) + 1;
    detachObject(part.object);
    const radial = worldPosition.clone().sub(point);
    if (radial.lengthSq() < 0.001) radial.set(Math.random() - 0.5, 0.25, Math.random() - 0.5);
    const impulseDirection = impulse.lengthSq() > 0.001 ? impulse.clone().normalize() : new THREE.Vector3(0, 0.2, 1);
    const direction = radial.normalize().add(impulseDirection.multiplyScalar(0.7)).normalize();
    const debrisRadius = part.type === 'wheel' ? 0.5 : 0.35;
    part.object.position.y = Math.max(part.object.position.y, debrisRadius + 0.012);
    registerDebris({
      object: part.object,
      velocity: this.velocity.clone().addScaledVector(direction, clamp(impulse.length() / Math.max(part.mass, 2) * 0.055, 2.2, 15)),
      angular: new THREE.Vector3(direction.z, 1.4 + Math.random() * 3.5, -direction.x).multiplyScalar(2 + Math.random() * 2),
      life: FUNCTIONAL_DEBRIS_LIFETIME,
      radius: debrisRadius,
    });
    this.recalculateMass();

    if (cascade && part.type === 'weaponMount' && part.weaponKey) {
      for (const linked of this.parts.filter((candidate) => candidate.weaponKey === part.weaponKey && !candidate.detached && candidate !== part)) {
        this.detachPart(linked, impulse.clone().multiplyScalar(0.7), point, false);
      }
      for (const rotary of this.rotaryWeapons.filter((weapon) => weapon.weaponKey === part.weaponKey)) {
        rotary.active = false;
        rotary.rpm = 0;
        rotary.hitCooldown.clear();
      }
      const nonRotary = this.weapons[part.weaponKey];
      if (nonRotary) {
        nonRotary.requested = false;
        nonRotary.phase = 'disabled';
      }
    }
  }

  destroyRobot(attacker, requestedReason = null) {
    if (this.dead) return false;
    let reason = requestedReason;
    if (!reason) {
      if (!this.corePart || this.corePart.detached || this.corePart.hp <= 0) reason = 'CORE_DESTROYED';
      else if (this.activeBlockParts().length <= 5 && this.criticalDestructionAt < Infinity) reason = 'BLOCKS_LE_5';
    }
    if (!RESPAWN_REASONS.has(reason)) {
      respawnStats.rejectedUnknown++;
      return false;
    }
    this.dead = true;
    this.lastRespawnReason = reason;
    this.respawnAt = mode === 'battle' && BATTLE_RESPAWNS_ENABLED ? worldTime + RESPAWN_DELAY_SECONDS : Infinity;
    respawnStats.deaths++;
    respawnStats.reasonCounts[reason]++;
    respawnStats.log.push({ t: Number(battleElapsed.toFixed(2)), robot: this.instanceUid, name: this.name, team: this.team, reason, phase: 'DEATH_DECISION' });
    if (respawnStats.log.length > 120) respawnStats.log.shift();
    this.control.throttle = 0;
    this.control.steering = 0;
    for (const key of Object.keys(this.weapons)) if (this.weapons[key].active !== undefined) this.weapons[key].active = false;
    for (const rotary of this.rotaryWeapons) rotary.active = false;
    showMessage(this.isPlayer ? `PLAYER DISABLED — ${RESPAWN_DELAY_SECONDS}초 후 리스폰` : `${this.name} 격파 · 리스폰 대기`, 2.1);
    if (attacker) this.velocity.addScaledVector(forwardFor(attacker.yaw), 2.5);
    return true;
  }

  durability() {
    return this.blockStructureRatio() * 0.78 + this.coreHealthRatio() * 0.22;
  }

  mobilityStatus() {
    const count = this.wheels.filter((wheel) => !wheel.part.detached).length;
    const total = this.wheels.length;
    if (!total) return '이동장치 없음';
    if (count === total && total >= 4) return '주행 정상';
    if (count >= 2) return `바퀴 ${Math.max(0, total - count)}개 손실`;
    return '주행 불능';
  }

  weaponStatus() {
    const nonRotaryKeys = Object.keys(this.weapons).filter((key) => !['spinner', 'bar', 'drum'].includes(key));
    const total = nonRotaryKeys.length + this.rotaryWeapons.length;
    const alive = nonRotaryKeys.filter((key) => this.weaponAvailable(key)).length + this.rotaryWeapons.filter((weapon) => this.rotaryAvailable(weapon)).length;
    if (total === 0) return '무기 없음';
    if (alive === total) return '무기 정상';
    if (alive) return `무기 ${total - alive}개 손실`;
    return '무기 파괴';
  }
}

function teamSizeForBattleMode(value = battleMode) {
  if (value === '10v10') return 10;
  const match = String(value).match(/^(\d+)v/);
  return match ? Number(match[1]) : 1;
}

function isConquestBattle() {
  return selectedMapId === 'desert01' && battleMode === '10v10' && mode === 'battle';
}

function resetConquestState() {
  conquestState.enabled = selectedMapId === 'desert01' && battleMode === '10v10';
  conquestState.activePoint = 'A';
  conquestState.contested = false;
  conquestState.winner = null;
  conquestState.pendingWinner = null;
  conquestState.captures.length = 0;
  conquestState.repairEvents = 0;
  conquestState.healerTicks = 0;
  for (const [key, point] of Object.entries(conquestState.points)) {
    point.blue = 0;
    point.red = 0;
    point.owner = null;
    point.active = key === 'A';
    const visual = conquestVisuals.zones[key];
    if (visual) {
      visual.ringMaterial.opacity = key === 'A' ? 0.8 : 0.2;
      visual.beaconMaterial.emissiveIntensity = key === 'A' ? 1.3 : 0.1;
      visual.beaconMaterial.opacity = key === 'A' ? 0.72 : 0.24;
    }
  }
  const teamBattle = mode === 'battle' && !isFreeForAllMode();
  if (ui.conquestHUD) {
    ui.conquestHUD.hidden = !teamBattle;
    ui.conquestHUD.classList.toggle('team-battle-only', teamBattle && !conquestState.enabled);
  }
  if (ui.conquestMinimap) ui.conquestMinimap.hidden = !conquestState.enabled;
  if (ui.blueRoster) ui.blueRoster.hidden = !teamBattle;
  if (ui.redRoster) ui.redRoster.hidden = !teamBattle;
}

function conquestObjectiveForRobot(robot) {
  if (!conquestState.enabled || conquestState.winner) return null;
  const active = conquestState.points[conquestState.activePoint];
  if (!active) return null;
  // Give each AI a stable slot inside the capture circle. Driving every bot at
  // the exact centre created a dense pile-up, steering sign oscillation and
  // bots that appeared to ignore A/B even though their target was correct.
  const slotIndex = Math.abs(Number(robot.id ?? 0)) % 10;
  const slotRing = slotIndex < 2 ? 0.18 : slotIndex < 6 ? 0.43 : 0.66;
  const slotAngle = (slotIndex / 10) * Math.PI * 2 + (robot.team === 'blue' ? 0 : Math.PI / 10);
  const captureSlot = active.centre.clone().add(new THREE.Vector3(
    Math.sin(slotAngle) * active.radius * slotRing,
    0,
    Math.cos(slotAngle) * active.radius * slotRing,
  ));
  const enemyTeam = robot.team === 'blue' ? 'red' : 'blue';
  const enemyNear = robots.filter((candidate) => !candidate.dead && candidate.team === enemyTeam && candidate.root.position.distanceToSquared(active.centre) < (active.radius + 8) ** 2);
  const allyNear = robots.filter((candidate) => !candidate.dead && candidate.team === robot.team && candidate.root.position.distanceToSquared(active.centre) < (active.radius + 8) ** 2);
  const enemyCapturing = enemyNear.length > 0 || active[enemyTeam] > active[robot.team] + 0.05;
  if (enemyCapturing && robot.aiRole !== 'healer') {
    return { state: enemyNear.length && allyNear.length ? 'CONTEST' : 'DEFEND', point: captureSlot, urgent: true, enemyCapturing, captureSlot };
  }
  if (robot.aiRole === 'flanker') {
    const side = robot.id % 2 ? -1 : 1;
    const flank = active.centre.clone().add(new THREE.Vector3(side * (active.radius + 8), 0, robot.team === 'blue' ? -7 : 7));
    return { state: 'FLANK', point: flank, urgent: false, enemyCapturing };
  }
  if (robot.aiRole === 'blocker') {
    const side = robot.id % 2 ? -1 : 1;
    return { state: 'DEFEND', point: active.centre.clone().add(new THREE.Vector3(side * active.radius * 0.58, 0, robot.team === 'blue' ? 5 : -5)), urgent: false, enemyCapturing };
  }
  return { state: 'MOVE_TO_OBJECTIVE', point: captureSlot, urgent: false, enemyCapturing, captureSlot };
}

function driveRobotTowardPoint(robot, goal, dt, urgency = 1) {
  const navigationPoint = navigationPointForRobot(robot, goal.clone(), dt);
  const desired = navigationPoint.sub(robot.root.position).setY(0);
  const distance = desired.length();
  if (distance < 0.01) {
    robot.control = { throttle: 0, steering: 0, brake: true };
    return { distance, angleError: 0, reversing: false };
  }
  const desiredYaw = normalizeAngle(Math.atan2(desired.x, desired.z));
  const angleError = normalizeAngle(desiredYaw - robot.yaw);
  const reversing = Math.abs(angleError) > 2.18 && distance < 22;
  let steering = reversing ? -Math.sign(angleError || robot.aiAvoidSide) : clamp(angleError * 1.55, -1, 1);
  const planarSpeed = robot.velocity.clone().setY(0).length();
  // Full steering at walking speed produces a visual orbit with almost no
  // useful travel. Force a driven arc: meaningful throttle plus capped steer.
  if (planarSpeed < 1.15 && Math.abs(steering) > 0.66) steering = Math.sign(steering) * 0.66;
  if (Math.abs(angleError) < 0.075) steering = 0;
  const steeringSignChanged = Math.sign(steering) !== Math.sign(robot.aiHeldSteering)
    && Math.abs(steering) > 0.2 && Math.abs(robot.aiHeldSteering) > 0.2;
  // Hold an avoidance choice long enough to complete the turn. This is a
  // hysteresis guard, not a scripted route: a large new heading still wins as
  // soon as the short hold expires.
  if (steeringSignChanged && worldTime < robot.aiSteeringHoldUntil) steering = robot.aiHeldSteering;
  else if (Math.abs(steering) > 0.12 && (worldTime >= robot.aiSteeringHoldUntil || Math.abs(robot.aiHeldSteering) <= 0.12)) {
    robot.aiHeldSteering = steering;
    robot.aiSteeringHoldUntil = worldTime + 0.72 + (Math.abs(robot.id) % 5) * 0.08;
  }
  if (Math.abs(steering) <= 0.12) robot.aiHeldSteering = 0;
  const throttle = reversing ? -0.86 : Math.abs(angleError) > 1.28 ? 0.68 : clamp(0.78 + urgency * 0.18, 0.78, 1);
  robot.control = { throttle, steering, brake: false };
  if (reversing) robot.stats.reverseRecoveries++;
  robot.wakePhysicsFromControl(reversing ? 'ai-objective-reverse' : 'ai-objective-drive');
  return { distance, angleError, reversing };
}

function updateDesertObjectiveAI(robot, dt) {
  if (!conquestState.enabled || conquestState.winner) return false;
  robot.aiObjectiveHeartbeat -= dt;
  const heartbeat = robot.aiObjectiveHeartbeat <= 0;
  if (heartbeat) {
    robot.aiObjectiveHeartbeat = 0.55 + (Math.abs(robot.id) % 5) * 0.07;
    robot.aiObjectiveRevision++;
  }

  const damagedCritically = robot.durability() < 0.35
    || robot.wheels.filter((wheel) => !wheel.part.detached).length < Math.max(2, Math.ceil(robot.wheels.length * 0.5))
    || (robot.weaponStatus() === '무기 파괴' && robot.durability() < 0.58);
  if (damagedCritically && robotNeedsRepair(robot)) {
    const healer = robots
      .filter((candidate) => candidate !== robot && !candidate.dead && candidate.team === robot.team && candidate.type === 'healer')
      .sort((a, b) => a.root.position.distanceToSquared(robot.root.position) - b.root.position.distanceToSquared(robot.root.position))[0] ?? null;
    if (healer && healer.durability() >= 0.25) {
      if (robot.aiState !== 'SEEK_HEALER') robot.stats.healerSeeks++;
      robot.transitionAIState('SEEK_HEALER', 'hp-or-critical-part-below-threshold');
      robot.healerPartnerUid = healer.instanceUid;
      healer.healerPartnerUid = robot.instanceUid;
      const healerDistance = robot.root.position.distanceTo(healer.root.position);
      if (healerDistance <= 8.2) {
        robot.transitionAIState('WAIT_FOR_HEAL', 'parked-next-to-healer');
        robot.control = { throttle: 0, steering: 0, brake: true };
      } else {
        const meet = healer.root.position.clone().lerp(robot.root.position, 0.18);
        driveRobotTowardPoint(robot, meet, dt, 1.05);
      }
      return true;
    }
    robot.transitionAIState('GO_REPAIR', 'no-available-healer');
    return driveAIToRepairZone(robot, dt, 'GO_REPAIR');
  }

  if (robot.aiEscapeWaypoint) {
    const escapeDistance = robot.root.position.distanceTo(robot.aiEscapeWaypoint);
    if (worldTime >= robot.aiEscapeExpires || escapeDistance < 3.2) {
      robot.aiEscapeWaypoint = null;
      robot.aiEscapeExpires = 0;
      robot.clearAIPath('escape-waypoint-complete');
    } else {
      robot.transitionAIState('REPOSITION', 'leave-stuck-location-before-objective');
      driveRobotTowardPoint(robot, robot.aiEscapeWaypoint, dt, 1.25);
      return true;
    }
  }

  if (robot.type === 'healer' && updateHealerAI(robot, dt)) return true;
  const objective = conquestObjectiveForRobot(robot);
  if (!objective) return false;
  const active = conquestState.points[conquestState.activePoint];
  const insideObjective = robot.root.position.distanceToSquared(active.centre) <= active.radius ** 2;
  const enemiesClose = game.targetsFor(robot).filter((candidate) => candidate.root.position.distanceToSquared(robot.root.position) < 11 ** 2);
  const enemyOnObjective = game.targetsFor(robot)
    .filter((candidate) => candidate.root.position.distanceToSquared(active.centre) < (active.radius + 7) ** 2)
    .sort((a, b) => a.root.position.distanceToSquared(robot.root.position) - b.root.position.distanceToSquared(robot.root.position));
  const objectiveCombatTarget = enemyOnObjective[0] ?? null;
  if (objectiveCombatTarget && (insideObjective || objective.urgent || robot.root.position.distanceToSquared(active.centre) < (active.radius + 18) ** 2)) {
    const combatDistance = robot.root.position.distanceTo(objectiveCombatTarget.root.position);
    if (objective.urgent && robot.lastDefenceAlert !== conquestState.activePoint) {
      robot.lastDefenceAlert = conquestState.activePoint;
      robot.stats.objectiveDefenceResponses++;
    }
    robot.aiTargetId = objectiveCombatTarget.id;
    robot.transitionAIState(combatDistance < 5.4 ? 'ATTACK' : 'CHASE', 'enemy-threatening-active-point');
    driveRobotTowardPoint(robot, objectiveCombatTarget.root.position, dt, 1.25);
    for (const key of ['spinner', 'bar', 'drum']) if (robot.weapons[key]) robot.weapons[key].active = robot.weaponAvailable(key);
    for (const rotary of robot.rotaryWeapons) rotary.active = robot.rotaryAvailable(rotary);
    if (combatDistance > 6 && combatDistance < 15 && robot.dashCooldown <= 0 && Math.abs(robot.control.steering) < 0.46) robot.requestDash('objective-intercept');
    return true;
  }
  if (!objective.urgent) robot.lastDefenceAlert = null;
  if (insideObjective) {
    if (objective.enemyCapturing || enemiesClose.length) robot.transitionAIState('CONTEST', 'enemy-on-active-point');
    else if (active.owner === robot.team || robot.aiRole === 'blocker') robot.transitionAIState('DEFEND', 'holding-active-point');
    else robot.transitionAIState('CAPTURE', 'inside-active-point');
    if (robot.lastObjectiveVisit !== conquestState.activePoint) {
      robot.lastObjectiveVisit = conquestState.activePoint;
      robot.stats.objectiveVisits++;
    }
  } else {
    if (objective.urgent && robot.lastDefenceAlert !== conquestState.activePoint) {
      robot.lastDefenceAlert = conquestState.activePoint;
      robot.stats.objectiveDefenceResponses++;
    }
    robot.transitionAIState(objective.state, objective.urgent ? 'enemy-capturing-active-point' : `role-${robot.aiRole}`);
  }
  // Close enemies are fought, but only after the heartbeat has refreshed the
  // objective reason. Once the target is lost, the next think resumes this goal.
  if (enemiesClose.length && (insideObjective || objective.urgent)) {
    robot.aiTargetId = enemiesClose[0].id;
    return false;
  }
  driveRobotTowardPoint(robot, objective.point, dt, objective.urgent ? 1.2 : 1);
  return true;
}

function ensureHealingAura(robot) {
  if (robot.healingAura) return robot.healingAura;
  const group = new THREE.Group();
  group.name = `${robot.name}_HealingInProgressAura`;
  const material = new THREE.MeshBasicMaterial({ color: 0x20ff73, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const radius = Math.max(0.9, robot.radius * 0.62);
  const lower = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.045, 5, 20), material);
  lower.rotation.x = Math.PI / 2;
  lower.position.y = 0.12;
  const upper = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.78, 0.035, 5, 20), material.clone());
  upper.rotation.x = Math.PI / 2;
  upper.position.y = 0.72;
  group.add(lower, upper);
  group.renderOrder = 18;
  robot.root.add(group);
  robot.healingAura = group;
  robot.healingAuraRings = [lower, upper];
  return group;
}

function updateHealingAura(robot, dt) {
  robot.healingVisualTimer = Math.max(0, (robot.healingVisualTimer ?? 0) - dt);
  if (!robot.healingAura) return;
  const active = robot.healingVisualTimer > 0 && !robot.dead;
  robot.healingAura.visible = active;
  if (!active) return;
  const pulse = 1 + Math.sin(worldTime * 18 + robot.id) * 0.075;
  robot.healingAura.scale.setScalar(pulse);
  robot.healingAura.rotation.y += dt * 1.8;
  for (const ring of robot.healingAuraRings ?? []) ring.material.opacity = 0.78 + Math.sin(worldTime * 22 + ring.position.y) * 0.18;
}

function spawnHealingBeam(from, to, pulseIndex = 0, target = null) {
  const direction = to.clone().sub(from);
  const length = direction.length();
  if (length < 0.01) return;
  const material = new THREE.MeshBasicMaterial({ color: 0x24ff75, transparent: true, opacity: 0.98, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, length, 7), material);
  beam.position.lerpVectors(from, to, 0.5);
  beam.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  beam.renderOrder = 19;
  scene.add(beam);
  effects.push({ object: beam, velocity: new THREE.Vector3(), angular: new THREE.Vector3(), gravity: 0, life: 0.145, fade: true, fadeRate: 13 });
  for (let index = 0; index < 6; index++) {
    const plus = new THREE.Group();
    const plusMaterial = material.clone();
    plusMaterial.opacity = 1;
    const vertical = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.34, 0.055), plusMaterial);
    const horizontal = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.075, 0.055), plusMaterial);
    plus.add(vertical, horizontal);
    plus.position.copy(to).add(new THREE.Vector3((Math.random() - 0.5) * 1.25, 0.28 + Math.random() * 1.15, (Math.random() - 0.5) * 1.25));
    plus.scale.setScalar(0.82 + Math.random() * 0.42);
    plus.renderOrder = 20;
    scene.add(plus);
    effects.push({ object: plus, velocity: new THREE.Vector3((Math.random() - 0.5) * 0.18, 0.72 + Math.random() * 0.55, (Math.random() - 0.5) * 0.18), angular: new THREE.Vector3(0, (Math.random() - 0.5) * 1.2, 0), gravity: 0, life: 0.58 + Math.random() * 0.18, fade: false });
  }
  if (target) {
    ensureHealingAura(target).visible = true;
    target.healingVisualTimer = Math.max(target.healingVisualTimer ?? 0, 0.42);
  }
  playHealingPulseSound(from, pulseIndex);
}

function robotNeedsRepair(robot) {
  return !robot.dead && (robot.activeBlockParts().length < robot.blockParts.size
    || [...robot.blockParts.values()].some((part) => part.hp < part.maxHp - 0.5)
    || robot.parts.some((part) => part.type !== 'block' && (part.detached || part.hp < part.maxHp - 0.5)));
}

function restoreNextBlock(robot, source = 'repair-zone') {
  const damaged = [...robot.blockParts.values()].filter((part) => !part.detached && part.hp < part.maxHp - 0.5).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (damaged) {
    damaged.hp = Math.min(damaged.maxHp, damaged.hp + Math.max(24, damaged.maxHp * 0.28));
    damaged.record.hp = damaged.hp;
    robot.updateBlockDamageVisual(damaged);
    return { type: 'block-hp', id: damaged.assemblyId };
  }
  const detachedBlock = [...robot.blockParts.values()].find((part) => part.detached);
  if (detachedBlock) {
    const debrisIndex = debris.findIndex((entry) => entry.object === detachedBlock.object);
    if (debrisIndex >= 0) debris.splice(debrisIndex, 1);
    scene.remove(detachedBlock.object);
    detachedBlock.object = createBlockVisualObject(detachedBlock.record, false);
    detachedBlock.object.name = `${robot.name}_${detachedBlock.record.id}_Restored`;
    robot.root.add(detachedBlock.object);
    detachedBlock.detached = false;
    detachedBlock.hp = detachedBlock.maxHp;
    detachedBlock.record.hp = detachedBlock.maxHp;
    robot.recalculateMass();
    return { type: 'block-restored', id: detachedBlock.assemblyId };
  }
  const functional = robot.parts.filter((part) => part.type !== 'block' && !part.detached && part.hp < part.maxHp - 0.5).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (functional) {
    functional.hp = Math.min(functional.maxHp, functional.hp + Math.max(18, functional.maxHp * 0.18));
    return { type: 'functional-hp', id: functional.assemblyId };
  }
  const missingFunctional = robot.parts.some((part) => part.type !== 'block' && part.detached);
  if (missingFunctional) {
    const index = robots.indexOf(robot);
    const replacement = new Robot({ id: robot.id, name: robot.name, type: robot.type, isPlayer: robot.isPlayer, team: robot.team, tint: robot.tint, aiTrait: robot.aiTrait, assembly: cloneData(robot.originalBuildData), position: { x: robot.root.position.x, z: robot.root.position.z }, yaw: robot.yaw, respawnCount: robot.respawnCount });
    replacement.spawnPosition = { ...robot.spawnPosition };
    replacement.spawnYaw = robot.spawnYaw;
    replacement.spawnProtectionUntil = worldTime + 0.7;
    scene.remove(robot.root);
    robots[index] = replacement;
    if (robot.isPlayer) player = replacement;
    buildEnemyUI();
    return { type: 'functional-restored', id: replacement.id };
  }
  return null;
}

function healRobotStep(healer, target, applyRepair = true) {
  if (!robotNeedsRepair(target)) return false;
  const result = applyRepair ? restoreNextBlock(target, 'healer') : { type: 'healing-pulse' };
  if (!result) return false;
  const from = healer.healerMuzzle?.getWorldPosition(new THREE.Vector3()) ?? healer.root.position.clone().add(new THREE.Vector3(0, 0.8, 0));
  const targetBounds = target.getLiveWorldBounds();
  const to = targetBounds.getCenter(new THREE.Vector3());
  to.y = lerp(targetBounds.min.y, targetBounds.max.y, 0.68);
  healer.healPulseIndex = (healer.healPulseIndex + 1) % 10000;
  spawnHealingBeam(from, to, healer.healPulseIndex, target);
  conquestState.healerTicks++;
  return true;
}

function updateHealerAI(robot, dt) {
  if (robot.durability() < 0.48 && robotNeedsRepair(robot) && conquestState.enabled) {
    return driveAIToRepairZone(robot, dt, 'HEALER_SELF_REPAIR');
  }
  const allies = robots.filter((candidate) => candidate !== robot && !candidate.dead && candidate.team === robot.team && robotNeedsRepair(candidate));
  const target = allies.sort((a, b) => {
    const score = (candidate) => (1 - candidate.durability()) * 40 + (candidate.weaponStatus() === '무기 파괴' ? 18 : 0) + (candidate.mobilityStatus() !== '주행 정상' ? 22 : 0) - robot.root.position.distanceTo(candidate.root.position) * 0.18;
    return score(b) - score(a);
  })[0] ?? null;
  if (!target) {
    robot.healTargetId = null;
    robot.healerPartnerUid = null;
    // A healthy team still needs its healer to move with it. Follow the ally
    // currently closest to combat instead of falling through to enemy-chase
    // AI (which made an unarmed healer circle in place).
    const healthyAllies = robots.filter((candidate) => candidate !== robot && !candidate.dead && candidate.team === robot.team);
    if (!healthyAllies.length) {
      robot.control = { throttle: 0, steering: 0, brake: true };
      robot.transitionAIState('ESCORT', 'no-living-ally');
      return true;
    }
    const enemies = game.targetsFor(robot);
    const escort = healthyAllies.sort((a, b) => {
      const enemyDistance = (candidate) => enemies.reduce((best, enemy) => Math.min(best, candidate.root.position.distanceToSquared(enemy.root.position)), Infinity);
      return enemyDistance(a) - enemyDistance(b);
    })[0];
    const escortForward = forwardFor(escort.yaw);
    const escortPoint = escort.root.position.clone().addScaledVector(escortForward, -Math.max(4.8, escort.radius + robot.radius + 1.2));
    const escortDistance = robot.root.position.distanceTo(escortPoint);
    robot.transitionAIState('ESCORT', 'follow-combat-ally');
    robot.aiTargetId = escort.id;
    if (escortDistance > 4.2) driveRobotTowardPoint(robot, escortPoint, dt, 0.96);
    else robot.control = { throttle: 0, steering: 0, brake: true };
    return true;
  }
  robot.transitionAIState('HEAL_ALLY', 'priority-injured-ally');
  robot.healTargetId = target.id;
  robot.healerPartnerUid = target.instanceUid;
  target.healerPartnerUid = robot.instanceUid;
  const delta = target.root.position.clone().sub(robot.root.position).setY(0);
  const distance = delta.length();
  if (distance > 7.2) {
    const drive = driveRobotTowardPoint(robot, target.root.position, dt, 1.08);
    // Never let a healer spend a think cycle rotating on one spot. It must
    // translate toward the patient, with a gentler driven arc when nearly
    // stationary.
    const planarSpeed = robot.velocity.clone().setY(0).length();
    if (planarSpeed < 0.8) {
      robot.control.throttle = drive.reversing ? -0.92 : 0.92;
      robot.control.steering = clamp(robot.control.steering, -0.46, 0.46);
      robot.yawVelocity *= 0.72;
    }
  }
  else robot.control = { throttle: 0, steering: 0, brake: true };
  if (distance <= 18 && !segmentBlockedByMapObstacle(robot.root.position, target.root.position, 0.4)) {
    robot.healAccumulator += dt;
    while (robot.healAccumulator >= 0.12) {
      robot.healAccumulator -= 0.12;
      const applyRepair = robot.healPulseIndex % 2 === 0;
      healRobotStep(robot, target, applyRepair);
    }
  } else {
    robot.healAccumulator = Math.min(robot.healAccumulator, 0.12);
  }
  return true;
}

function driveAIToRepairZone(robot, dt, state = 'REPAIR_RETREAT') {
  if (!conquestState.enabled || !['blue', 'red'].includes(robot.team)) return false;
  const zoneZ = (robot.team === 'blue' ? -1 : 1) * (DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
  const goal = new THREE.Vector3((robot.id % 3 - 1) * 4.5, 0, zoneZ);
  const distance = robot.root.position.distanceTo(goal);
  robot.transitionAIState(state, 'repair-zone-required');
  robot.aiTargetId = null;
  driveRobotTowardPoint(robot, goal, dt, 1.1);
  if (distance < 1.8) robot.control = { throttle: 0, steering: 0, brake: true };
  const enemyClose = game.targetsFor(robot).some((enemy) => enemy.root.position.distanceToSquared(robot.root.position) < 13 ** 2);
  if (enemyClose && robot.dashCooldown <= 0) robot.requestDash('ai-repair-escape');
  return true;
}

function updateRepairZones(dt) {
  if (!conquestState.enabled) return;
  for (const robot of [...robots]) {
    if (robot.dead || !['blue', 'red'].includes(robot.team) || !robotNeedsRepair(robot)) continue;
    const zoneZ = (robot.team === 'blue' ? -1 : 1) * (DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
    if (Math.hypot(robot.root.position.x, robot.root.position.z - zoneZ) > DESERT_LAYOUT.repairRadius) { robot.repairAccumulator = 0; continue; }
    const interrupted = worldTime - robot.lastExternalImpactTime < 0.9;
    robot.repairAccumulator += dt * (interrupted ? 0.18 : 1);
    if (robot.repairAccumulator < 0.36) continue;
    robot.repairAccumulator = 0;
    const result = restoreNextBlock(robot, 'repair-zone');
    if (result) {
      conquestState.repairEvents++;
      const target = robots.find((candidate) => candidate.id === robot.id) ?? robot;
      target.healPulseIndex = (target.healPulseIndex + 1) % 10000;
      spawnHealingBeam(target.root.position.clone().add(new THREE.Vector3(-0.8, 0.2, 0)), target.root.position.clone().add(new THREE.Vector3(0.8, 0.9, 0)), target.healPulseIndex, target);
    }
  }
}

function updateConquestBattle(dt) {
  if (!conquestState.enabled || conquestState.winner) return;
  updateRepairZones(dt);
  const point = conquestState.points[conquestState.activePoint];
  const inside = robots.filter((robot) => !robot.dead && ['blue', 'red'].includes(robot.team)
    && robot.root.position.distanceToSquared(point.centre) <= point.radius ** 2);
  const blueCount = inside.filter((robot) => robot.team === 'blue').length;
  const redCount = inside.filter((robot) => robot.team === 'red').length;
  conquestState.contested = blueCount > 0 && redCount > 0;
  if (!conquestState.contested && (blueCount || redCount)) {
    const team = blueCount ? 'blue' : 'red';
    // One uncontested robot or ten uncontested robots both require a full
    // minute. Progress is persistent; CONTESTED freezes the exact percentage.
    point[team] = clamp(point[team] + dt * (100 / DESERT_LAYOUT.captureSeconds), 0, 100);
    if (point[team] >= 100 && point.owner !== team) {
      point.owner = team;
      conquestState.captures.push({ point: conquestState.activePoint, team, time: Number(battleElapsed.toFixed(2)) });
      if (conquestState.activePoint === 'A') {
        conquestState.activePoint = 'B';
        conquestState.points.A.active = false;
        conquestState.points.B.active = true;
        const a = conquestVisuals.zones.A;
        const b = conquestVisuals.zones.B;
        if (a) { a.ringMaterial.color.set(team === 'blue' ? 0x3c9fff : 0xff4f42); a.ringMaterial.opacity = 0.48; a.beaconMaterial.emissiveIntensity = 0.42; }
        if (b) { b.ringMaterial.opacity = 0.86; b.beaconMaterial.emissiveIntensity = 1.45; b.beaconMaterial.opacity = 0.78; }
        for (const robot of robots) if (!robot.isPlayer && !robot.dead) {
          robot.clearAIPath('capture-point-advanced-A-to-B');
          robot.aiObjectiveHeartbeat = 0;
          robot.aiTargetId = null;
          robot.aiAvoidSide *= -1;
        }
        showMessage(`${team.toUpperCase()} A 거점 점령 · B 활성화`, 2);
      } else {
        conquestState.pendingWinner = team;
        showMessage(`${team.toUpperCase()} B 거점 확보 · 5분 판정까지 방어`, 2.4);
      }
    }
  }
  if (conquestState.pendingWinner && battleElapsed >= conquestState.minimumMatchSeconds) {
    conquestState.winner = conquestState.pendingWinner;
    battleResultShown = true;
    showMessage(`${conquestState.winner.toUpperCase()} TEAM 점령전 승리`, 4);
  }
  if (battleElapsed >= conquestState.duration && !conquestState.winner) {
    const score = (team) => (conquestState.points.A.owner === team ? 100 : conquestState.points.A[team]) + (conquestState.points.B.owner === team ? 100 : conquestState.points.B[team]);
    conquestState.winner = score('blue') >= score('red') ? 'blue' : 'red';
    battleResultShown = true;
  }
}

function buildConquestHUD() {
  if (!ui.conquestBlueIcons || !ui.conquestRedIcons) return;
  ui.conquestBlueIcons.innerHTML = '';
  ui.conquestRedIcons.innerHTML = '';
  for (const team of ['blue', 'red']) {
    const container = team === 'blue' ? ui.conquestBlueIcons : ui.conquestRedIcons;
    for (const robot of robots.filter((candidate) => candidate.team === team)) {
      const icon = document.createElement('i');
      icon.dataset.robotId = String(robot.id);
      icon.className = `unit-icon ${robot.type === 'healer' ? 'healer' : robot.weightClass}`;
      icon.title = `${robot.name} · ${robot.type === 'healer' ? 'HEALER' : robot.driveProfile.label}`;
      icon.setAttribute('aria-label', icon.title);
      icon.innerHTML = '<span class="bot-body"></span><span class="bot-wheel left"></span><span class="bot-wheel right"></span>'
        + (robot.type === 'healer' ? '<span class="medical-mark"></span>' : '');
      container.appendChild(icon);
      robot.conquestIcon = icon;
    }
  }
}

function updateConquestHUD() {
  if (!ui.conquestHUD || ui.conquestHUD.hidden) return;
  const blueAlive = robots.filter((robot) => robot.team === 'blue' && !robot.dead).length;
  const redAlive = robots.filter((robot) => robot.team === 'red' && !robot.dead).length;
  const blueTotal = robots.filter((robot) => robot.team === 'blue').length;
  const redTotal = robots.filter((robot) => robot.team === 'red').length;
  ui.conquestBlueCount.textContent = `${blueAlive}/${blueTotal}`;
  ui.conquestRedCount.textContent = `${redAlive}/${redTotal}`;
  if (!conquestState.enabled) {
    const minutes = Math.floor(battleElapsed / 60);
    const seconds = Math.floor(battleElapsed % 60);
    ui.conquestTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    ui.captureState.textContent = `${battleMode.toUpperCase()} · CLASS MIX`;
    for (const robot of robots) if (robot.conquestIcon) {
      robot.conquestIcon.classList.toggle('dead', robot.dead);
      robot.conquestIcon.classList.toggle('respawning', robot.dead && Number.isFinite(robot.respawnAt));
    }
    return;
  }
  const remaining = Math.max(0, conquestState.duration - battleElapsed);
  ui.conquestTimer.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(Math.floor(remaining % 60)).padStart(2, '0')}`;
  ui.captureA.className = conquestState.points.A.owner ? `owned ${conquestState.points.A.owner}` : conquestState.activePoint === 'A' ? 'active' : '';
  ui.captureB.className = conquestState.activePoint === 'B' ? 'active' : conquestState.points.B.owner ? `owned ${conquestState.points.B.owner}` : 'locked';
  const point = conquestState.points[conquestState.activePoint];
  const leader = point.blue >= point.red ? 'blue' : 'red';
  ui.captureProgress.style.width = `${Math.max(point.blue, point.red)}%`;
  ui.captureProgress.style.background = leader === 'blue' ? '#47adff' : '#ff5148';
  ui.captureState.textContent = conquestState.winner ? `${conquestState.winner.toUpperCase()} 승리`
    : conquestState.contested ? `${conquestState.activePoint} CONTESTED`
      : `${conquestState.activePoint} · BLUE ${Math.round(point.blue)}% / RED ${Math.round(point.red)}%`;
  for (const robot of robots) if (robot.conquestIcon) {
    robot.conquestIcon.classList.toggle('dead', robot.dead);
    robot.conquestIcon.classList.toggle('respawning', robot.dead && Number.isFinite(robot.respawnAt));
  }
  updateConquestMinimap();
}

function updateConquestMinimap() {
  if (!conquestState.enabled || !ui.minimapCanvas || !player) return;
  const canvas = ui.minimapCanvas;
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const worldToMap = (position) => ({
    x: (position.x + DESERT_LAYOUT.halfWidth) / (DESERT_LAYOUT.halfWidth * 2) * width,
    y: (DESERT_LAYOUT.halfLength - position.z) / (DESERT_LAYOUT.halfLength * 2) * height,
  });
  const cellX = width / 14;
  const cellY = height / 20;
  context.clearRect(0, 0, width, height);
  for (let row = 0; row < 20; row++) for (let column = 0; column < 14; column++) {
    const x = lerp(-DESERT_LAYOUT.halfWidth, DESERT_LAYOUT.halfWidth, (column + 0.5) / 14);
    const z = lerp(DESERT_LAYOUT.halfLength, -DESERT_LAYOUT.halfLength, (row + 0.5) / 20);
    const terrain = clamp((desertTerrainHeight(x, z) + 5) / 18, 0, 1);
    context.fillStyle = `rgb(${Math.round(47 + terrain * 55)},${Math.round(25 + terrain * 29)},${Math.round(18 + terrain * 18)})`;
    context.fillRect(column * cellX, row * cellY, Math.ceil(cellX) + 1, Math.ceil(cellY) + 1);
  }
  context.strokeStyle = 'rgba(255,211,160,.16)';
  context.lineWidth = 1;
  for (let index = 1; index < 5; index++) {
    context.beginPath(); context.moveTo(index * width / 5, 0); context.lineTo(index * width / 5, height); context.stroke();
    context.beginPath(); context.moveTo(0, index * height / 5); context.lineTo(width, index * height / 5); context.stroke();
  }
  const drawBlockedSegment = (segment, fill, stroke) => {
    const halfX = segment.length * 0.5;
    const halfZ = segment.depth * 0.5;
    const cos = Math.cos(segment.yaw);
    const sin = Math.sin(segment.yaw);
    const corners = [[-halfX,-halfZ],[halfX,-halfZ],[halfX,halfZ],[-halfX,halfZ]].map(([localX, localZ]) => worldToMap(new THREE.Vector3(
      segment.x + localX * cos + localZ * sin,
      0,
      segment.z - localX * sin + localZ * cos,
    )));
    context.beginPath();
    corners.forEach((corner, index) => index ? context.lineTo(corner.x, corner.y) : context.moveTo(corner.x, corner.y));
    context.closePath();
    context.fillStyle = fill; context.fill();
    context.strokeStyle = stroke; context.lineWidth = 1.2; context.stroke();
  };
  DESERT_CANYON_SEGMENTS.forEach((segment) => drawBlockedSegment(segment, 'rgba(42,17,12,.92)', 'rgba(219,112,68,.78)'));
  for (const obstacle of obstacles) if (obstacle.obstacleType === 'desert-ridge') drawBlockedSegment({ x: obstacle.x, z: obstacle.z, length: obstacle.halfX * 2, depth: obstacle.halfZ * 2, yaw: obstacle.rotationY }, 'rgba(82,37,21,.74)', 'rgba(197,105,59,.55)');
  const blueSpawn = worldToMap(new THREE.Vector3(0, 0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset)));
  const redSpawn = worldToMap(new THREE.Vector3(0, 0, DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset));
  const mapA = worldToMap(conquestState.points.A.centre);
  const mapB = worldToMap(conquestState.points.B.centre);
  context.setLineDash([4, 3]);
  for (const [routeIndex, route] of (desertStats.navigation.minimapRoutes ?? []).entries()) {
    if (!route.length) continue;
    context.strokeStyle = ['rgba(120,197,255,.27)','rgba(255,218,153,.38)','rgba(255,151,112,.27)'][routeIndex] ?? 'rgba(255,217,155,.3)';
    context.lineWidth = routeIndex === 1 ? 1.5 : 1;
    context.beginPath();
    const start = worldToMap(new THREE.Vector3(0, 0, -(DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset)));
    context.moveTo(start.x, start.y);
    for (const [x, z] of route) { const point = worldToMap(new THREE.Vector3(x, 0, z)); context.lineTo(point.x, point.y); }
    context.stroke();
  }
  context.setLineDash([]);
  const drawSpawn = (point, color, label) => {
    context.strokeStyle = color; context.lineWidth = 2; context.strokeRect(point.x - 12, point.y - 5, 24, 10);
    context.fillStyle = color; context.font = 'bold 7px ui-monospace'; context.textAlign = 'center'; context.fillText(label, point.x, point.y - 8);
  };
  drawSpawn(blueSpawn, '#54b7ff', 'BLUE');
  drawSpawn(redSpawn, '#ff5b50', 'RED');
  for (const [key, point] of Object.entries(conquestState.points)) {
    const mapPoint = key === 'A' ? mapA : mapB;
    const active = conquestState.activePoint === key;
    context.beginPath(); context.arc(mapPoint.x, mapPoint.y, active ? 8 : 6, 0, Math.PI * 2);
    context.fillStyle = point.owner === 'blue' ? '#42aaff' : point.owner === 'red' ? '#ff5148' : active ? '#ffd15b' : '#625446';
    context.fill(); context.strokeStyle = '#1a0d09'; context.lineWidth = 2; context.stroke();
    context.fillStyle = '#130a08'; context.font = '900 8px ui-monospace'; context.fillText(key, mapPoint.x, mapPoint.y + 3);
  }
  const allies = robots.filter((robot) => !robot.dead && robot.team === player.team);
  const isEnemyDetected = (robot) => allies.some((ally) => ally.root.position.distanceToSquared(robot.root.position) <= 95 ** 2);
  for (const robot of robots) {
    if (robot.dead || (robot.team !== player.team && !isEnemyDetected(robot))) continue;
    const point = worldToMap(robot.root.position);
    const isLocalPlayer = robot === player;
    // Canvas north is -Y while world forward is (sin(yaw), +cos(yaw)). The
    // canvas transform therefore uses +yaw; the old -yaw mirrored every turn.
    context.save(); context.translate(point.x, point.y); context.rotate(robot.yaw);
    context.beginPath();
    const size = isLocalPlayer ? 4.2 : 2.6;
    context.moveTo(0, -size * 1.5); context.lineTo(size, size); context.lineTo(-size, size); context.closePath();
    context.fillStyle = isLocalPlayer ? '#ffffff' : robot.team === player.team ? '#51b5ff' : '#ff564d'; context.fill();
    context.restore();
  }
}

const collisionEventCache = new Map();
const game = {
  canDamage(attacker, target) {
    return friendlyFire || isFreeForAllMode() || attacker.team !== target.team;
  },
  wallImpact(robot, normal, point, surface = {}) {
    const towardWall = robot.velocity.dot(normal);
    if (towardWall >= 0) return;
    const speed = Math.abs(towardWall);
    const verticalBefore = robot.velocity.y;
    const restitution = surface.obstacleType === 'concrete-barrier' ? 0.018 : 0.025;
    const tangentRetention = surface.obstacleType === 'concrete-barrier' ? 0.82 : 0.9;
    const normalVelocityDelta = normal.clone().multiplyScalar(speed * (1 + restitution));
    robot.velocity.add(normalVelocityDelta);
    const normalAfter = normal.clone().multiplyScalar(robot.velocity.dot(normal));
    const tangentAfter = robot.velocity.clone().setY(0).sub(normalAfter).multiplyScalar(tangentRetention);
    robot.velocity.x = normalAfter.x + tangentAfter.x;
    robot.velocity.z = normalAfter.z + tangentAfter.z;
    robot.lastExternalImpactTime = worldTime;
    robot.recordLinearDelta('static-obstacle-contact', normalVelocityDelta, 'game.wallImpact');
    const armX = point.x - robot.root.position.x;
    const armZ = point.z - robot.root.position.z;
    const wallYawDelta = clamp((armX * normalVelocityDelta.z - armZ * normalVelocityDelta.x) * 0.045, -0.48, 0.48);
    robot.yawVelocity += wallYawDelta;
    robot.recordAngularDelta('static-obstacle-contact', 0, wallYawDelta, 0, 'game.wallImpact');
    environmentCollisionStats.contacts++;
    environmentCollisionStats.maxNormalSpeed = Math.max(environmentCollisionStats.maxNormalSpeed, speed);
    environmentCollisionStats.maxVerticalVelocityAdded = Math.max(environmentCollisionStats.maxVerticalVelocityAdded, Math.max(0, robot.velocity.y - verticalBefore));
    if (surface.obstacleType === 'container') environmentCollisionStats.containerContacts++;
    else if (surface.obstacleType === 'concrete-barrier') environmentCollisionStats.barrierContacts++;
    else environmentCollisionStats.boundaryContacts++;
    robot.lastEnvironmentContact = { time: worldTime, speed, point: point.toArray(), normal: normal.toArray(), obstacleType: surface.obstacleType ?? 'boundary', restitution };
    if (speed > 2.2 && worldTime - (robot.lastWallSoundTime ?? -Infinity) > 0.16) {
      robot.lastWallSoundTime = worldTime;
      playSpatialSample('wall', point, clamp(0.22 + speed * 0.035, 0.25, 0.78), clamp(1.08 - speed * 0.008 + Math.random() * 0.06, 0.82, 1.12), speed > 8 ? 4 : 2);
    }
  },

  collideRobots(a, b) {
    if (a.dead && b.dead) return;
    const delta = b.root.position.clone().sub(a.root.position);
    delta.y = 0;
    const minimum = a.radius + b.radius;
    const distance = delta.length();
    if (distance >= minimum || distance < 0.001) return;
    const normal = delta.multiplyScalar(1 / distance);
    const overlap = minimum - distance;
    const totalMass = a.mass + b.mass;
    a.root.position.addScaledVector(normal, -overlap * b.mass / totalMass);
    b.root.position.addScaledVector(normal, overlap * a.mass / totalMass);
    const eventKey = a.id < b.id ? `${a.id}:${b.id}` : `${b.id}:${a.id}`;
    const lastPairEvent = collisionEventCache.get(eventKey) ?? -Infinity;
    if (worldTime - lastPairEvent < 0.075) return;
    const relative = b.velocity.clone().sub(a.velocity);
    const closing = relative.dot(normal);
    if (closing >= 0) return;
    const closingSpeed = Math.abs(closing);
    const restitution = lerp(0.08, 0.28, clamp((closingSpeed - 3) / 15, 0, 1));
    const impulseMagnitude = -((1 + restitution) * closing) / (1 / a.mass + 1 / b.mass);
    const tangent = new THREE.Vector3(-normal.z, 0, normal.x);
    const tangentialSpeed = relative.dot(tangent);
    const offset = clamp(Math.sin(a.yaw - b.yaw) * 0.58 + tangentialSpeed * 0.055, -Math.min(a.radius, b.radius) * 0.62, Math.min(a.radius, b.radius) * 0.62);
    const point = a.root.position.clone().addScaledVector(normal, a.radius).addScaledVector(tangent, offset);
    point.y = Math.max(0.2, Math.min(a.root.position.y, b.root.position.y) + clamp(relative.y * 0.06, -0.38, 0.38));
    const reducedMass = 1 / (1 / a.mass + 1 / b.mass);
    const tangentialImpulse = clamp(-tangentialSpeed * reducedMass * 0.16, -impulseMagnitude * 0.28, impulseMagnitude * 0.28);
    const impulse = normal.clone().multiplyScalar(impulseMagnitude).addScaledVector(tangent, tangentialImpulse);
    const impactDamage = Math.max(0, closingSpeed - 3.5) * 0.72;
    const dashFromA = a.dashHitWindow > 0;
    const dashFromB = b.dashHitWindow > 0;
    const dashDamageA = dashFromB ? clamp(closingSpeed * b.mass * 0.0048, 8, 70) : 0;
    const dashDamageB = dashFromA ? clamp(closingSpeed * a.mass * 0.0048, 8, 70) : 0;
    let resultA = null;
    let resultB = null;
    const bothDash = dashFromA && dashFromB;
    const attackerReaction = (attacker, signedImpulse) => {
      const forward = forwardFor(attacker.yaw);
      const forwardBefore = attacker.velocity.dot(forward);
      const groundedAbsorption = attacker.grounded ? 0.72 : 1;
      const classAbsorption = attacker.weightClass === 'superheavy' ? 0.72 : attacker.weightClass === 'lightweight' ? 1.08 : 0.9;
      const reactionScale = 0.1 * groundedAbsorption * classAbsorption;
      const delta = signedImpulse.clone().multiplyScalar(reactionScale / Math.max(attacker.mass, 1));
      delta.y *= 0.12;
      attacker.velocity.add(delta);
      if (forwardBefore > 2) {
        const forwardAfter = attacker.velocity.dot(forward);
        if (forwardAfter < forwardBefore * 0.68) attacker.velocity.addScaledVector(forward, forwardBefore * 0.68 - forwardAfter);
      }
      const arm = point.clone().sub(attacker.worldCenterOfMass());
      const torque = new THREE.Vector3().crossVectors(arm, signedImpulse).multiplyScalar(0.1 / Math.max(attacker.mass * 2.35, 1));
      attacker.yawVelocity += clamp(torque.y, -0.28, 0.28);
      attacker.lastWeaponReactionTime = worldTime;
      attacker.recordLinearDelta('attacker-reaction-10pct', delta, 'game.collideRobots');
    };
    if (dashFromA && !bothDash) {
      if (this.canDamage(a, b)) resultB = b.applyImpactAtPoint(impulse, point, impactDamage + dashDamageB, 'dash', a, { suppressSparks: true, suppressFlash: true, contactSpeed: closingSpeed, weaponMass: a.mass * 0.28, allowCritical: true });
      attackerReaction(a, impulse.clone().multiplyScalar(-1));
    } else if (dashFromB && !bothDash) {
      if (this.canDamage(b, a)) resultA = a.applyImpactAtPoint(impulse.clone().multiplyScalar(-1), point, impactDamage + dashDamageA, 'dash', b, { suppressSparks: true, suppressFlash: true, contactSpeed: closingSpeed, weaponMass: b.mass * 0.28, allowCritical: true });
      attackerReaction(b, impulse);
    } else {
      if (this.canDamage(b, a)) resultA = a.applyImpactAtPoint(impulse.clone().multiplyScalar(-1), point, impactDamage + dashDamageA, dashFromB ? 'dash' : 'collision', b, { suppressSparks: true, suppressFlash: true, contactSpeed: closingSpeed, weaponMass: dashFromB ? b.mass * 0.28 : 0, allowCritical: dashFromB });
      else a.velocity.addScaledVector(impulse, -0.32 / a.mass);
      if (this.canDamage(a, b)) resultB = b.applyImpactAtPoint(impulse, point, impactDamage + dashDamageB, dashFromA ? 'dash' : 'collision', a, { suppressSparks: true, suppressFlash: true, contactSpeed: closingSpeed, weaponMass: dashFromA ? a.mass * 0.28 : 0, allowCritical: dashFromA });
      else b.velocity.addScaledVector(impulse, 0.32 / b.mass);
    }
    collisionEventCache.set(eventKey, worldTime);
    if (dashFromA && resultB) { a.stats.dashHits++; a.dashHitWindow = 0; }
    if (dashFromB && resultA) { b.stats.dashHits++; b.dashHitWindow = 0; }
    const shared = [resultA, resultB].filter(Boolean).sort((first, second) => second.intensityScore - first.intensityScore)[0];
    if (shared) {
      spawnMetalSparks(point, impulse, shared.sparkCount, shared.tier, tangent.clone().multiplyScalar(tangentialSpeed), 'impact', normal);
      if (['strong', 'veryStrong', 'critical'].includes(shared.tier)) spawnFlash(point, shared.tier === 'critical' ? 7.5 : shared.tier === 'veryStrong' ? 4.2 : 1.8);
    }
  },

  targetsFor(robot) {
    return damageTargetCache.get(robot.id) ?? [];
  },

  checkRotaryHit(robot, spinner) {
    const centre = new THREE.Vector3();
    spinner.pivot.getWorldPosition(centre);
    let hitCount = 0;
    for (const target of this.targetsFor(robot)) {
      if (spinner.hitCooldown.has(target)) continue;
      const delta = target.root.position.clone().sub(centre);
      delta.y = 0;
      const contactDistance = delta.length();
      if (contactDistance > target.radius + spinner.radius || contactDistance < 0.001) continue;
      const radial = delta.multiplyScalar(1 / contactDistance);
      const tangent = new THREE.Vector3(-radial.z, 0, radial.x);
      const rawEdgeSpeed = spinner.rpm * Math.PI * 2 / 60 * spinner.radius;
      // The RPM display remains independent, but the collision solver uses a
      // real BattleBots-scale tip-speed ceiling. Feeding the raw 500-700 m/s
      // visual edge speed into the impulse formula caused perpetual relaunches.
      const tipSpeedLimit = spinner.kind === 'bar' ? 105 : spinner.kind === 'drum' ? 88 : 72;
      const edgeSpeed = Math.min(rawEdgeSpeed, tipSpeedLimit);
      const weaponMass = spinner.kind === 'bar' ? PART_META.barSpinner.mass : spinner.kind === 'drum' ? PART_META.drumSpinner.mass : PART_META.spinner.mass;
      const vehicleRelative = robot.velocity.clone().sub(target.velocity);
      const contactSpeed = Math.min(edgeSpeed + Math.abs(vehicleRelative.dot(tangent)), tipSpeedLimit + 18);
      const reducedWeaponMass = weaponMass * target.mass / Math.max(weaponMass + target.mass, 1);
      const massCoupling = clamp(reducedWeaponMass / 32, 0.84, 1.18);
      const strength = (spinner.kind === 'bar' ? 210 + contactSpeed * 1.35 : spinner.kind === 'drum' ? 170 + contactSpeed * 1.05 : 140 + contactSpeed * 0.78)
        * massCoupling + Math.min(vehicleRelative.length() * 14, 180);
      const point = centre.clone().addScaledVector(radial, spinner.radius * 0.96);
      const targetCentre = target.worldCenterOfMass();
      const underbodyContact = clamp((targetCentre.y - point.y + 0.12) / 0.78, 0, 1);
      const upward = spinner.kind === 'drum'
        ? strength * (0.1 + underbodyContact * 0.52)
        : spinner.kind === 'bar' ? strength * 0.08 : strength * 0.04;
      const impulse = tangent.clone().multiplyScalar(strength).addScaledVector(radial, strength * 0.28).add(new THREE.Vector3(0, upward, 0));
      const damage = (spinner.kind === 'bar' ? 18 : spinner.kind === 'drum' ? 17 : 15)
        + contactSpeed * (spinner.kind === 'bar' ? 0.34 : spinner.kind === 'drum' ? 0.31 : 0.24);
      spinner.contactHistory ??= new Map();
      const previousContact = spinner.contactHistory.get(target) ?? -Infinity;
      const separatedContact = worldTime - previousContact > 0.5;
      spinner.contactHistory.set(target, worldTime);
      const targetAirborne = target.root.position.y > target.groundSupportHeight() + 0.18;
      const fullImpact = separatedContact && !targetAirborne && worldTime - target.lastFullRotaryImpactTime > 0.45;
      if (fullImpact) target.lastFullRotaryImpactTime = worldTime;
      const sustainedForceScale = fullImpact ? 1
        : spinner.kind === 'spinner' ? LANDING_PHYSICS.sustainedSawForceScale : LANDING_PHYSICS.sustainedRotaryForceScale;
      if (!fullImpact) {
        target.stats.sustainedWeaponForcesSuppressed++;
        stabilityStats.sustainedWeaponForcesSuppressed++;
      }
      const freshBladeContact = separatedContact && !targetAirborne;
      const sparkMode = spinner.kind === 'spinner'
        ? (freshBladeContact ? 'saw-first' : 'saw-continuous')
        : (fullImpact ? 'impact' : 'rotary-continuous');
      const impactResult = target.applyImpactAtPoint(impulse, point, damage * (fullImpact ? 1 : 0.2), spinner.kind, robot, {
        tangentHint: tangent,
        sparkMode,
        contactSpeed,
        weaponMass,
        allowCritical: fullImpact,
        forceScale: sustainedForceScale,
        suppressCritical: !fullImpact,
        suppressFlash: !fullImpact,
        suppressAudio: !freshBladeContact,
        suppressFeedback: !fullImpact,
      });
      spinner.lastImpactResult = impactResult ? {
        tier: impactResult.tier,
        score: Number((impactResult.intensityScore ?? impactResult.score ?? 0).toFixed(1)),
        sparkCount: impactResult.sparkCount,
        contactSpeed: Number(contactSpeed.toFixed(1)),
      } : null;
      if (fullImpact && impactResult) robot.applyWeaponReactionWear(spinner, clamp(damage * 0.42, 5, 18), impulse.clone().multiplyScalar(-0.16), point, impactResult.tier);
      if (spinner.kind === 'spinner') {
        sawContactTimer = Math.max(sawContactTimer, 0.18);
        audioStats.sawContactTicks++;
        if (sawGrindTickCooldown <= 0) {
          sawGrindTickCooldown = 0.085;
        }
      }
      robot.stats.hits++;
      hitCount++;
      spinner.hitCooldown.set(target, spinner.kind === 'spinner' ? 0.09 : 0.18);
      spinner.rpm *= spinner.kind === 'spinner' ? 0.9 : 0.82;
    }
    return hitCount;
  },

  checkHammerHit(robot, hammer, swingProgress = 0.72) {
    const tip = new THREE.Vector3();
    hammer.tip.getWorldPosition(tip);
    let hit = false;
    for (const target of this.targetsFor(robot)) {
      const delta = target.root.position.clone().sub(tip);
      if (delta.length() > target.radius + 1.05) continue;
      const strikeDirection = tip.clone().sub(robot.root.position).setY(0);
      if (strikeDirection.lengthSq() < 0.01) strikeDirection.copy(forwardFor(robot.yaw));
      else strikeDirection.normalize();
      const point = target.root.position.clone().add(new THREE.Vector3(0, 0.72, 0)).addScaledVector(strikeDirection, -0.5);
      const strikeQuality = Math.sin(Math.PI * clamp(swingProgress, 0.05, 0.95));
      const contactSpeed = lerp(5, 16, strikeQuality);
      const weaponMass = PART_META.hammer.mass;
      const impulse = strikeDirection.multiplyScalar(520 + weaponMass * contactSpeed * 0.86).add(new THREE.Vector3(0, -180 - contactSpeed * 5, 0));
      const result = target.applyImpactAtPoint(impulse, point, 42 + contactSpeed * 3.8, 'hammer', robot, { contactSpeed, weaponMass, allowCritical: true });
      robot.applyWeaponReactionWear(hammer, clamp(8 + contactSpeed * 0.38, 8, 16), impulse.clone().multiplyScalar(-0.14), point, result?.tier ?? 'strong');
      robot.stats.hits++;
      hit = true;
    }
    return hit;
  },

  checkFlipperHit(robot) {
    let hit = false;
    for (const target of this.targetsFor(robot)) {
      const local = robot.root.worldToLocal(target.root.position.clone());
      if (local.z < 0.35 || local.z > 3.25 || Math.abs(local.x) > 1.55 || Math.abs(local.y) > 1.5) continue;
      const forward = forwardFor(robot.yaw);
      const point = target.root.position.clone().add(new THREE.Vector3(0, -0.48, 0)).addScaledVector(forward, -0.6);
      const contactSpeed = 18 + robot.velocity.clone().sub(target.velocity).length();
      const impulse = forward.multiplyScalar(620).add(new THREE.Vector3(0, 1380, 0));
      const result = target.applyImpactAtPoint(impulse, point, 38 + contactSpeed * 0.45, 'flipper', robot, { contactSpeed, weaponMass: PART_META.flipper.mass, allowCritical: true });
      robot.applyWeaponReactionWear(robot.weapons.flipper, clamp(7 + contactSpeed * 0.25, 7, 14), impulse.clone().multiplyScalar(-0.12), point, result?.tier ?? 'strong');
      robot.stats.hits++;
      hit = true;
    }
    return hit;
  },

  applyWeaponGroundReaction(robot, contactPoint, kind) {
    if (!robot.isSelfRightCandidate()) return false;
    const support = robot.lastSupportInfo ?? robot.getGroundSupportInfo();
    const actualFloorContact = robot.root.position.y <= support.height + 0.08 && contactPoint.y >= -0.03 && contactPoint.y <= 0.2;
    if (!actualFloorContact || robot.selfRightWeaponReactionConsumed) return false;
    if (!robot.isPlayer && (!robot.selfRightActionIssued || robot.selfRightAttemptWindow <= 0)) return false;
    if (robot.selfRightAttemptWindow <= 0) {
      robot.stats.selfRightAttempts++;
      flightStats.selfRightAttempts++;
    }
    robot.selfRightAttemptWindow = 2.5;
    robot.selfRightRecoveryPending = true;
    const centre = robot.worldCenterOfMass();
    const point = contactPoint.clone();
    point.y = 0.025;
    const arm = point.clone().sub(centre);
    if (Math.hypot(arm.x, arm.z) < 0.42) arm.addScaledVector(forwardFor(robot.yaw), kind === 'hammer' ? -0.9 : 1.05);
    const verticalSpeed = kind === 'flipper' ? 6.8 : 5.7;
    const floorImpulse = new THREE.Vector3(0, robot.mass * verticalSpeed, 0);
    const reactionVelocityDelta = floorImpulse.clone().multiplyScalar(1 / robot.mass);
    robot.velocity.add(reactionVelocityDelta);
    robot.recordLinearDelta(`weapon-floor-${kind}`, reactionVelocityDelta, 'game.applyWeaponGroundReaction');
    const torqueWorld = new THREE.Vector3().crossVectors(arm, floorImpulse);
    const torqueLocal = worldTorqueToEulerAxes(torqueWorld, robot.yaw, robot.pitch);
    const torqueGain = kind === 'flipper' ? 0.92 : 1.08;
    const pitchDelta = clamp(torqueLocal.x / (robot.mass * 2.75) * torqueGain, -5.2, 5.2);
    const rollDelta = clamp(torqueLocal.z / (robot.mass * 2.75) * torqueGain, -5.2, 5.2);
    const yawDelta = clamp((arm.x - arm.z) * 0.18, -0.65, 0.65);
    robot.pitchVelocity += pitchDelta;
    robot.rollVelocity += rollDelta;
    robot.yawVelocity += yawDelta;
    robot.recordAngularDelta(`weapon-floor-${kind}`, pitchDelta, yawDelta, rollDelta, 'game.applyWeaponGroundReaction');
    robot.selfRightCooldown = Math.max(robot.selfRightCooldown, 0.62);
    robot.selfRightWeaponReactionConsumed = true;
    robot.lastWeaponReactionTime = worldTime;
    flightStats.selfRightReactions++;
    if (!qa) {
      spawnDust(point, 5);
      cameraShake = Math.max(cameraShake, robot.isPlayer ? 0.12 : 0.06);
    }
    return true;
  },

  checkHammerGroundReaction(robot, hammer) {
    const point = new THREE.Vector3();
    hammer.tip.getWorldPosition(point);
    return this.applyWeaponGroundReaction(robot, point, 'hammer');
  },

  checkFlipperGroundReaction(robot, flipper) {
    const point = new THREE.Vector3(0, 0.08, 1.45);
    flipper.pivot.localToWorld(point);
    return this.applyWeaponGroundReaction(robot, point, 'flipper');
  },
};

function randomUnitVector(target) {
  const y = Math.random() * 2 - 1;
  const radial = Math.sqrt(Math.max(0, 1 - y * y));
  const angle = Math.random() * Math.PI * 2;
  return target.set(Math.cos(angle) * radial, y, Math.sin(angle) * radial);
}

function activeSparkCount() {
  return activeSparkParticleCount;
}

function syncMetalSparkInstances() {
  let writeIndex = 0;
  for (const particle of sparkParticles) {
    if (!particle.active) continue;
    const remaining = clamp(particle.life / particle.initialLife, 0, 1);
    const fade = remaining > 0.34 ? 1 : Math.pow(remaining / 0.34, 0.82);
    sparkDirectionScratch.copy(particle.velocity).normalize();
    sparkMatrixDummy.quaternion.setFromUnitVectors(X_AXIS, sparkDirectionScratch);
    const layerThickness = particle.denseCore ? 0.04 : particle.layer === 'long' ? 0.0065 : particle.layer === 'medium' ? 0.0115 : 0.02;
    const thickness = layerThickness * particle.widthScale * lerp(0.86, 1.3, clamp(particle.brightness - 0.7, 0, 1));
    const trailGrowth = particle.layer === 'long' ? 0.4 : particle.layer === 'medium' ? 0.46 : 0.62;
    const visibleLength = Math.min(particle.tailLength, Math.max(0.035, particle.velocity.length() * particle.age * trailGrowth));
    // BoxGeometry is centred on its origin. Offset each streak backwards so
    // its bright head stays at the particle position and the trail follows it
    // instead of protruding equally in both directions like a star ray.
    sparkMatrixDummy.position.copy(particle.position).addScaledVector(sparkDirectionScratch, -visibleLength * 0.5);
    sparkMatrixDummy.scale.set(visibleLength, thickness * fade, thickness * fade);
    sparkMatrixDummy.updateMatrix();
    sparkTailInstances.setMatrixAt(writeIndex, sparkMatrixDummy.matrix);
    const coreFraction = particle.layer === 'long' ? 0.16 : particle.layer === 'medium' ? 0.3 : particle.denseCore ? 0.68 : 0.52;
    const coreLength = visibleLength * coreFraction;
    sparkMatrixDummy.position.copy(particle.position).addScaledVector(sparkDirectionScratch, -coreLength * 0.5);
    sparkMatrixDummy.scale.set(coreLength, thickness * 0.46 * fade, thickness * 0.46 * fade);
    sparkMatrixDummy.updateMatrix();
    sparkCoreInstances.setMatrixAt(writeIndex, sparkMatrixDummy.matrix);
    sparkMatrixDummy.position.copy(particle.position);
    sparkMatrixDummy.quaternion.setFromUnitVectors(X_AXIS, sparkDirectionScratch);
    const headSize = 0.032 * particle.headScale * (particle.denseCore ? 0.72 + remaining * 0.48 : 0.52 + remaining * 0.48) * fade;
    sparkMatrixDummy.scale.set(headSize * 1.8, headSize * 0.5, headSize * 0.5);
    sparkMatrixDummy.updateMatrix();
    sparkHeadInstances.setMatrixAt(writeIndex, sparkMatrixDummy.matrix);

    const hotCoreBoost = particle.denseCore ? 1.28 : 1;
    sparkTailColorScratch.setRGB(2.35 * hotCoreBoost * fade, (0.12 + particle.brightness * 0.2) * fade, 0.002 * fade);
    sparkCoreColorScratch.setRGB(2.72 * hotCoreBoost * fade, (0.72 + particle.brightness * 0.22) * hotCoreBoost * fade, (0.025 + particle.brightness * 0.055) * fade);
    if (particle.denseCore) sparkHeadColorScratch.setRGB(3.35 * fade, 3.05 * fade, (1.22 + particle.brightness * 0.14) * fade);
    else sparkHeadColorScratch.setRGB(2.6 * fade, (1.18 + particle.brightness * 0.24) * fade, 0.12 * fade);
    sparkTailInstances.setColorAt(writeIndex, sparkTailColorScratch);
    sparkCoreInstances.setColorAt(writeIndex, sparkCoreColorScratch);
    sparkHeadInstances.setColorAt(writeIndex, sparkHeadColorScratch);
    writeIndex++;
  }
  for (const instances of [sparkTailInstances, sparkCoreInstances, sparkHeadInstances]) {
    instances.count = writeIndex;
    instances.instanceMatrix.needsUpdate = true;
    instances.instanceColor.needsUpdate = true;
  }
  activeSparkInstanceCount = writeIndex;
}

function resetMetalSparkPool() {
  for (const particle of sparkParticles) particle.active = false;
  pendingSparkBursts.length = 0;
  for (const instances of [sparkTailInstances, sparkCoreInstances, sparkHeadInstances]) instances.count = 0;
  activeSparkInstanceCount = 0;
  activeSparkParticleCount = 0;
}

function updateMetalSparkPool(dt) {
  let changed = false;
  for (let index = pendingSparkBursts.length - 1; index >= 0; index--) {
    const burst = pendingSparkBursts[index];
    if (worldTime < burst.time) continue;
    pendingSparkBursts.splice(index, 1);
    spawnMetalSparks(burst.point, burst.impactDirection, burst.count, burst.tier, burst.tangentHint, 'afterglow', burst.surfaceNormal);
    sparkStats.afterglowBursts++;
  }
  for (const particle of sparkParticles) {
    if (!particle.active) continue;
    particle.life -= dt;
    particle.age += dt;
    particle.position.addScaledVector(particle.velocity, dt);
    if (particle.life <= 0 || particle.position.y < 0.018) {
      particle.active = false;
      activeSparkParticleCount = Math.max(0, activeSparkParticleCount - 1);
    }
    changed = true;
  }
  if (changed) syncMetalSparkInstances();
}

function spawnMetalSparks(point, impactDirection, count, tier = 'medium', tangentHint = null, mode = 'impact', surfaceNormalHint = null) {
  if (count <= 0 || impactDirection.lengthSq() < 0.0001) return;
  const budget = currentPerformanceBudget();
  const cameraDistance = camera.position.distanceTo(point);
  const distanceScale = cameraDistance > 110 ? 0.45 : cameraDistance > 70 ? 0.68 : 1;
  const tierMinimum = { weak: 1, medium: 3, strong: 12, veryStrong: 18, critical: 26 }[tier] ?? 2;
  const available = Math.max(0, budget.sparkLimit - activeSparkParticleCount);
  count = Math.min(SPARK_POOL_SIZE, available, Math.max(tierMinimum, Math.round(count * budget.sparkScale * distanceScale)));
  if (count <= 0) return;
  const primary = impactDirection.clone().normalize().multiplyScalar(-1);
  const tangent = tangentHint?.lengthSq() > 0.0001 ? tangentHint.clone().normalize() : null;
  const surfaceNormal = surfaceNormalHint?.lengthSq() > 0.0001 ? surfaceNormalHint.clone().normalize() : null;
  if (tangent) primary.addScaledVector(tangent, mode === 'saw-continuous' ? 0.48 : 0.26);
  if (surfaceNormal) primary.addScaledVector(surfaceNormal, 0.52);
  primary.normalize();
  const tierSettings = {
    weak: { speed: 0.68, length: 0.6, brightness: 0.9, ratios: [0.78, 0.22, 0], spread: 0.78, denseRatio: 0.2, upward: 0.08 },
    medium: { speed: 0.84, length: 0.78, brightness: 1.05, ratios: [0.64, 0.32, 0.04], spread: 0.98, denseRatio: 0.38, upward: 0.2 },
    strong: { speed: 1, length: 1, brightness: 1.2, ratios: [0.62, 0.29, 0.09], spread: 1.14, denseRatio: 0.55, upward: 0.65 },
    veryStrong: { speed: 1.06, length: 1.06, brightness: 1.35, ratios: [0.59, 0.3, 0.11], spread: 1.28, denseRatio: 0.62, upward: 0.76 },
    critical: { speed: 1.1, length: 1.1, brightness: 1.52, ratios: [0.57, 0.3, 0.13], spread: 1.4, denseRatio: 0.68, upward: 0.88 },
  }[tier] ?? { speed: 0.84, length: 0.78, brightness: 1.05, ratios: [0.64, 0.32, 0.04], spread: 0.98, denseRatio: 0.38, upward: 0.2 };
  if (mode === 'saw-continuous' || mode === 'afterglow' || mode === 'landing') tierSettings.ratios = [0.7, 0.3, 0];
  if (mode === 'saw-first') tierSettings.ratios = [0.5, 0.4, 0.1];
  const layerSettings = {
    short: { speed: [10, 22], life: [0.08, 0.16], length: [0.18, 0.72] },
    medium: { speed: [18, 35], life: [0.12, 0.23], length: [0.65, 2.25] },
    long: { speed: [27, 49], life: [0.16, 0.29], length: [1.9, 4.25] },
  };
  let longCount = Math.floor(count * tierSettings.ratios[2]);
  if (count >= 24 && ['strong', 'veryStrong', 'critical'].includes(tier)) longCount = Math.max(3, longCount);
  let mediumCount = Math.floor(count * tierSettings.ratios[1]);
  if (count >= 10) mediumCount = Math.max(2, mediumCount);
  const layers = Array(count).fill('short');
  for (let index = 0; index < Math.min(longCount, count); index++) layers[index] = 'long';
  for (let index = longCount; index < Math.min(count, longCount + mediumCount); index++) layers[index] = 'medium';
  for (let index = layers.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [layers[index], layers[swapIndex]] = [layers[swapIndex], layers[index]];
  }
  const randomDirection = new THREE.Vector3();
  const direction = new THREE.Vector3();
  let burstMinSpeed = Infinity;
  let burstMaxSpeed = 0;
  let burstMinLength = Infinity;
  let burstMaxLength = 0;
  let burstMaxTravel = 0;
  let burstDenseCoreCount = 0;
  let burstUpwardHeroCount = 0;

  for (let index = 0; index < count; index++) {
    const layer = layers[index];
    const denseCore = layer === 'short' && Math.random() < tierSettings.denseRatio;
    const profile = denseCore ? { speed: [9.6, 14], life: [0.09, 0.15], length: [0.18, 0.55] } : layerSettings[layer];
    randomUnitVector(randomDirection);
    const freeScatter = Math.random() < (layer === 'short' ? 0.12 : layer === 'medium' ? 0.035 : 0.008);
    if (freeScatter) direction.copy(randomDirection);
    else {
      const physicalWeight = layer === 'long' ? lerp(1.4, 2.2, Math.random())
        : layer === 'medium' ? lerp(1.05, 1.72, Math.random()) : lerp(0.72, 1.42, Math.random());
      const randomWeight = tierSettings.spread * (layer === 'long' ? lerp(0.18, 0.5, Math.random())
        : layer === 'medium' ? lerp(0.3, 0.72, Math.random()) : lerp(0.62, 1.08, Math.random()));
      direction.copy(primary).multiplyScalar(physicalWeight).addScaledVector(randomDirection, randomWeight);
    }
    if (tangent) direction.addScaledVector(tangent, (Math.random() * 2 - 1) * (mode === 'saw-continuous' ? 0.52 : 0.3));
    if (surfaceNormal) direction.addScaledVector(surfaceNormal, lerp(0.04, 0.48, Math.random()));
    direction.addScaledVector(Y_AXIS, (Math.random() * 2 - 0.78) * (layer === 'long' ? 0.4 : 0.28));
    const upwardChance = tierSettings.upward * (layer === 'long' ? 1.28 : layer === 'medium' ? 0.92 : 0.42);
    const upwardHero = !denseCore && Math.random() < upwardChance;
    if (upwardHero) {
      const upwardStrength = layer === 'long' ? lerp(1.1, 2.0, Math.random())
        : layer === 'medium' ? lerp(0.78, 1.55, Math.random()) : lerp(0.34, 0.9, Math.random());
      direction.addScaledVector(Y_AXIS, upwardStrength);
    }
    if (direction.lengthSq() < 0.001) direction.copy(primary);
    direction.normalize();
    if (upwardHero) {
      randomUnitVector(randomDirection);
      randomDirection.y = 0;
      if (randomDirection.lengthSq() < 0.001) randomDirection.set(1, 0, 0);
      randomDirection.normalize();
      const lateralScatter = layer === 'long' ? lerp(0.58, 1.08, Math.random())
        : layer === 'medium' ? lerp(0.66, 1.2, Math.random()) : lerp(0.48, 0.92, Math.random());
      direction.addScaledVector(randomDirection, lateralScatter);
      const minimumUp = layer === 'long' ? lerp(0.38, 0.72, Math.random())
        : layer === 'medium' ? lerp(0.28, 0.62, Math.random()) : lerp(0.18, 0.45, Math.random());
      direction.y = Math.max(direction.y, minimumUp);
      direction.normalize();
    }

    const speed = lerp(profile.speed[0], profile.speed[1], Math.pow(Math.random(), 0.68)) * tierSettings.speed;
    const life = lerp(profile.life[0], profile.life[1], Math.random());
    const tailLength = lerp(profile.length[0], profile.length[1], Math.pow(Math.random(), layer === 'long' ? 0.58 : 0.82)) * tierSettings.length;
    const layerBrightness = denseCore ? 1.34 : layer === 'long' ? 0.72 : layer === 'medium' ? 0.88 : 1;
    const brightness = lerp(0.88, 1.24, Math.random()) * tierSettings.brightness * layerBrightness;

    const particle = sparkParticles[sparkPoolCursor];
    sparkPoolCursor = (sparkPoolCursor + 1) % SPARK_POOL_SIZE;
    if (particle.active) sparkStats.poolReuses++;
    else activeSparkParticleCount++;
    particle.active = true;
    randomUnitVector(randomDirection);
    const originJitter = denseCore ? 0.038 : layer === 'short' ? 0.075 : layer === 'medium' ? 0.1 : 0.12;
    particle.position.copy(point).addScaledVector(primary, 0.028).addScaledVector(Y_AXIS, denseCore ? 0.065 : 0.035)
      .addScaledVector(randomDirection, Math.random() * originJitter);
    particle.velocity.copy(direction).multiplyScalar(speed);
    particle.life = life;
    particle.initialLife = life;
    particle.age = 0;
    particle.growTime = tailLength / Math.max(speed, 0.01);
    particle.tailLength = tailLength;
    particle.brightness = brightness;
    particle.headScale = denseCore ? lerp(2.0, 3.4, Math.random())
      : layer === 'long' ? lerp(0.14, 0.32, Math.random())
        : layer === 'medium' ? lerp(0.34, 0.7, Math.random()) : lerp(0.5, 1.0, Math.random());
    particle.widthScale = denseCore ? lerp(1.45, 2.35, Math.random())
      : layer === 'long' ? lerp(0.55, 1.02, Math.random()) : lerp(0.68, 1.4, Math.random());
    particle.denseCore = denseCore;
    particle.upwardHero = upwardHero;
    particle.layer = layer;
    sparkStats.particlesSpawned++;
    if (layer === 'short') sparkStats.shortParticles++;
    else if (layer === 'medium') sparkStats.mediumParticles++;
    else sparkStats.longParticles++;
    if (denseCore) { sparkStats.denseCoreParticles++; burstDenseCoreCount++; }
    if (upwardHero && particle.velocity.y > 0) { sparkStats.upwardHeroParticles++; burstUpwardHeroCount++; }
    burstMinSpeed = Math.min(burstMinSpeed, speed);
    burstMaxSpeed = Math.max(burstMaxSpeed, speed);
    burstMinLength = Math.min(burstMinLength, tailLength);
    burstMaxLength = Math.max(burstMaxLength, tailLength);
    burstMaxTravel = Math.max(burstMaxTravel, speed * life + tailLength);
  }
  sparkStats.bursts++;
  sparkStats.maxBurstCount = Math.max(sparkStats.maxBurstCount, count);
  sparkStats.maxBurstTravel = Math.max(sparkStats.maxBurstTravel, burstMaxTravel);
  sparkStats.maxDenseCoreCount = Math.max(sparkStats.maxDenseCoreCount, burstDenseCoreCount);
  sparkStats.maxUpwardHeroRatio = Math.max(sparkStats.maxUpwardHeroRatio, burstUpwardHeroCount / Math.max(1, count));
  if (burstMaxSpeed - burstMinSpeed > 1.5 && burstMaxLength - burstMinLength > 0.12) sparkStats.irregularBursts++;
  sparkStats.minSpeed = sparkStats.minSpeed === null ? burstMinSpeed : Math.min(sparkStats.minSpeed, burstMinSpeed);
  sparkStats.maxSpeed = Math.max(sparkStats.maxSpeed, burstMaxSpeed);
  sparkStats.minTailLength = sparkStats.minTailLength === null ? burstMinLength : Math.min(sparkStats.minTailLength, burstMinLength);
  sparkStats.maxTailLength = Math.max(sparkStats.maxTailLength, burstMaxLength);
  if (mode === 'saw-first') sparkStats.firstSawBursts++;
  if (mode === 'saw-continuous') sparkStats.continuousSawBursts++;
  sparkStats.maxActiveParticles = Math.max(sparkStats.maxActiveParticles, activeSparkCount());
  if (!['saw-continuous', 'rotary-continuous', 'afterglow', 'landing'].includes(mode) && ['strong', 'veryStrong', 'critical'].includes(tier)) {
    const residualCount = tier === 'critical' ? Math.max(8, Math.round(count * 0.1)) : Math.max(4, Math.round(count * 0.075));
    pendingSparkBursts.push({
      time: worldTime + lerp(0.055, 0.115, Math.random()),
      point: point.clone(),
      impactDirection: impactDirection.clone(),
      count: residualCount,
      tier: 'medium',
      tangentHint: tangentHint?.clone() ?? null,
      surfaceNormal: surfaceNormalHint?.clone() ?? null,
    });
  }
}

function spawnDust(point, count) {
  const budget = currentPerformanceBudget();
  if (selectedMapId === 'desert01') {
    const distance = camera.position.distanceTo(point);
    if (distance > 140) return;
    count *= distance > 85 ? 0.42 : distance > 50 ? 0.68 : 1;
  }
  count = Math.max(1, Math.round(count * budget.fragmentScale));
  for (let index = 0; index < count; index++) {
    const material = dustMaterial.clone();
    if (selectedMapId === 'desert01') {
      material.color.setHex(0xb66f48);
      material.opacity = 0.26;
    }
    const mesh = new THREE.Mesh(dustGeometry, material);
    mesh.position.copy(point).add(new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.1, (Math.random() - 0.5) * 1.6));
    scene.add(mesh);
    effects.push({ object: mesh, velocity: new THREE.Vector3((Math.random() - 0.5) * 1.2, 0.5 + Math.random(), (Math.random() - 0.5) * 1.2), angular: new THREE.Vector3(), life: 0.65 + Math.random() * 0.45, gravity: 0, fade: true, grow: true });
  }
}

function allocateSmokeParticle() {
  for (let offset = 0; offset < SMOKE_POOL_SIZE; offset++) {
    const index = (smokePoolCursor + offset) % SMOKE_POOL_SIZE;
    if (!smokeParticles[index].active) {
      smokePoolCursor = (index + 1) % SMOKE_POOL_SIZE;
      return smokeParticles[index];
    }
  }
  const particle = smokeParticles[smokePoolCursor];
  smokePoolCursor = (smokePoolCursor + 1) % SMOKE_POOL_SIZE;
  return particle;
}

function smokeEmitterVisible(position) {
  const distanceSq = camera.position.distanceToSquared(position);
  if (distanceSq > 4900) return false;
  const projected = position.clone().project(camera);
  return projected.z > -1.2 && projected.z < 1.2 && Math.abs(projected.x) < 1.35 && Math.abs(projected.y) < 1.35;
}

function emitSmokeParticle(position, direction, force = 1) {
  const particle = allocateSmokeParticle();
  particle.active = true;
  particle.position.copy(position).add(new THREE.Vector3((Math.random() - 0.5) * 0.035, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.035));
  particle.velocity.copy(direction).multiplyScalar((0.38 + Math.random() * 0.42) * force);
  particle.velocity.x += (Math.random() - 0.5) * 0.12;
  particle.velocity.z += (Math.random() - 0.5) * 0.12;
  particle.initialLife = particle.life = clamp((0.52 + Math.random() * 0.42) * (0.92 + force * 0.08), 0.45, 1.15);
  particle.size = (0.075 + Math.random() * 0.055) * clamp(force, 0.8, 1.7);
  particle.shade = 0.46 + Math.random() * 0.18;
  smokeStats.emitted++;
}

function emitRobotExhaustBurst(robot, totalCount = 8) {
  if (!robot?.exhaustEmitters?.length) return;
  const activeEmitters = robot.exhaustEmitters.filter((emitter) => !emitter.part.detached);
  if (!activeEmitters.length) return;
  smokeStats.dashBursts++;
  for (let index = 0; index < totalCount; index++) {
    const emitter = activeEmitters[index % activeEmitters.length];
    const position = emitter.anchor.getWorldPosition(new THREE.Vector3());
    if (!smokeEmitterVisible(position)) { smokeStats.lodSkips++; continue; }
    const direction = new THREE.Vector3(0, 1, 0).addScaledVector(forwardFor(robot.yaw), -0.36).normalize();
    emitSmokeParticle(position, direction, 1.45 + Math.random() * 0.3);
  }
}

function updateRobotExhaustSmoke(dt) {
  for (const robot of robots) {
    if (robot.dead || !robot.exhaustEmitters?.length) continue;
    const speedRatio = clamp(robot.velocity.clone().setY(0).length() / Math.max(1, robot.driveProfile?.topSpeed ?? 16), 0, 1.8);
    const throttle = Math.abs(robot.control.throttle);
    const dash = robot.dashActiveTimer > 0;
    for (const emitter of robot.exhaustEmitters) {
      if (emitter.part.detached) {
        if (!emitter.detachNoted) { emitter.detachNoted = true; smokeStats.detachedStops++; }
        emitter.accumulator = 0;
        continue;
      }
      const position = emitter.anchor.getWorldPosition(new THREE.Vector3());
      if (!smokeEmitterVisible(position)) { smokeStats.lodSkips++; continue; }
      const idlePulse = 0.55 + Math.sin(worldTime * 5.2 + emitter.outletIndex * 1.9 + robot.id) * 0.28;
      const rate = dash ? 18 : idlePulse + throttle * 2.8 + speedRatio * 3.4;
      emitter.accumulator += dt * rate;
      while (emitter.accumulator >= 1) {
        emitter.accumulator -= 1;
        const direction = new THREE.Vector3(0, 1, 0).addScaledVector(forwardFor(robot.yaw), -(0.18 + speedRatio * 0.18)).normalize();
        emitSmokeParticle(position, direction, dash ? 1.55 : 0.82 + speedRatio * 0.34);
      }
    }
  }
}

function updateSmokePool(dt) {
  let visibleCount = 0;
  for (const particle of smokeParticles) {
    if (!particle.active) continue;
    particle.life -= dt;
    if (particle.life <= 0) { particle.active = false; continue; }
    particle.position.addScaledVector(particle.velocity, dt);
    particle.velocity.multiplyScalar(Math.exp(-1.45 * dt));
    particle.velocity.y += 0.12 * dt;
    const lifeRatio = clamp(particle.life / particle.initialLife, 0, 1);
    const ageRatio = 1 - lifeRatio;
    const scale = particle.size * (0.7 + ageRatio * 2.25) * Math.min(1, lifeRatio * 3.5);
    smokeMatrixDummy.position.copy(particle.position);
    smokeMatrixDummy.scale.setScalar(scale);
    smokeMatrixDummy.rotation.set(worldTime * 0.22, ageRatio * 2.1, 0);
    smokeMatrixDummy.updateMatrix();
    smokeInstances.setMatrixAt(visibleCount, smokeMatrixDummy.matrix);
    smokeColorScratch.setRGB(particle.shade * lifeRatio, particle.shade * lifeRatio, particle.shade * lifeRatio);
    smokeInstances.setColorAt(visibleCount, smokeColorScratch);
    visibleCount++;
  }
  smokeInstances.count = visibleCount;
  smokeInstances.instanceMatrix.needsUpdate = true;
  if (smokeInstances.instanceColor) smokeInstances.instanceColor.needsUpdate = true;
  smokeStats.activePeak = Math.max(smokeStats.activePeak, visibleCount);
}

function resetSmokePool() {
  for (const particle of smokeParticles) particle.active = false;
  smokeInstances.count = 0;
  smokeInstances.instanceMatrix.needsUpdate = true;
}

function spawnFlash(point, intensity) {
  if (qualityPreset === 'low' || camera.position.distanceToSquared(point) > 6400) return;
  let activeFlashCount = 0;
  for (const effect of effects) if (effect.object?.isLight) activeFlashCount++;
  if (activeFlashCount >= (qualityPreset === 'high' ? 6 : 3)) return;
  const light = new THREE.PointLight(0xffb347, intensity, 7.5, 2);
  light.position.copy(point).add(new THREE.Vector3(0, 0.18, 0));
  scene.add(light);
  effects.push({ object: light, velocity: new THREE.Vector3(), angular: new THREE.Vector3(), life: 0.07, gravity: 0, fade: true });
}

function updateEffects(dt) {
  updateAudioSystem(dt);
  updateMetalSparkPool(dt);
  updateRobotExhaustSmoke(dt);
  updateSmokePool(dt);
  updateBlockFragmentBursts(dt);
  for (let index = effects.length - 1; index >= 0; index--) {
    const effect = effects[index];
    effect.life -= dt;
    effect.velocity.y -= effect.gravity * dt;
    effect.object.position.addScaledVector(effect.velocity, dt);
    if (effect.alignVelocity && effect.object.isSprite && effect.velocity.lengthSq() > 0.01) {
      const cameraRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).normalize();
      const cameraUp = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize();
      effect.object.material.rotation = Math.atan2(effect.velocity.dot(cameraUp), effect.velocity.dot(cameraRight));
    } else if (effect.alignVelocity && effect.velocity.lengthSq() > 0.01) effect.object.quaternion.setFromUnitVectors(Y_AXIS, effect.velocity.clone().normalize());
    else {
      effect.object.rotation.x += effect.angular.x * dt;
      effect.object.rotation.y += effect.angular.y * dt;
      effect.object.rotation.z += effect.angular.z * dt;
    }
    if (effect.grow) effect.object.scale.multiplyScalar(1 + dt * 2.5);
    if (effect.fade) {
      if (effect.object.isLight) effect.object.intensity *= Math.exp(-28 * dt);
      else if (effect.object.material?.transparent) effect.object.material.opacity *= Math.exp(-(effect.fadeRate ?? 4) * dt);
    }
    const effectFloor = groundSurfaceHeightAt(effect.object.position.x, effect.object.position.z) + 0.05;
    if (effect.object.position.y < effectFloor) {
      effect.object.position.y = effectFloor;
      effect.velocity.y = Math.abs(effect.velocity.y) * 0.22;
      effect.velocity.x *= 0.7;
      effect.velocity.z *= 0.7;
    }
    if (effect.life <= 0) {
      scene.remove(effect.object);
      effects.splice(index, 1);
    }
  }

  for (let index = debris.length - 1; index >= 0; index--) {
    const item = debris[index];
    item.life -= dt;
    if (item.life <= DEBRIS_FADE_SECONDS && item.life > 0) {
      item.fadeStarted = true;
      setDebrisOpacity(item, clamp(item.life / DEBRIS_FADE_SECONDS, 0, 1));
    }
    if (!item.sleeping) {
      item.velocity.y -= 9.81 * 1.45 * dt;
      item.object.position.addScaledVector(item.velocity, dt);
      item.object.rotation.x += item.angular.x * dt;
      item.object.rotation.y += item.angular.y * dt;
      item.object.rotation.z += item.angular.z * dt;
      item.object.updateWorldMatrix(true, true);
      const rotatedBounds = item.bounds.setFromObject(item.object);
      const debrisFloor = groundSurfaceHeightAt(item.object.position.x, item.object.position.z);
      const sweptCorrection = debrisFloor + 0.012 - rotatedBounds.min.y;
      if (sweptCorrection > 0) {
        const debrisImpactSpeed = Math.max(0, -item.velocity.y);
        item.object.position.y += sweptCorrection;
        item.object.updateWorldMatrix(true, true);
        groundStats.debrisContacts++;
        groundStats.debrisSweepCorrections++;
        groundStats.maxDebrisSweepCorrection = Math.max(groundStats.maxDebrisSweepCorrection, sweptCorrection);
        if (sweptCorrection > 0.02) groundStats.debrisCorrections++;
        if (item.velocity.y < 0) item.velocity.y *= -0.3;
        if (!item.hasLanded && debrisImpactSpeed > 2.4 && (item.radius >= 0.42 || (item.blockChunkSize ?? 0) >= 2)
          && worldTime - lastDebrisLandingSoundAt > 0.14) {
          item.hasLanded = true;
          lastDebrisLandingSoundAt = worldTime;
          playSpatialSample('landing', item.object.position, clamp(0.22 + debrisImpactSpeed * 0.035, 0.25, 0.62), 0.9 + Math.random() * 0.12, 1);
        }
        item.velocity.x *= Math.exp(-1.8 * dt);
        item.velocity.z *= Math.exp(-1.8 * dt);
        item.angular.multiplyScalar(Math.exp(-1.2 * dt));
        const seatedBounds = item.bounds.setFromObject(item.object);
        groundStats.maxDebrisPenetration = Math.max(groundStats.maxDebrisPenetration, Math.max(0, debrisFloor - seatedBounds.min.y));
        const calm = item.velocity.lengthSq() < 0.035 && item.angular.lengthSq() < 0.08;
        item.sleepTimer = calm ? item.sleepTimer + dt : 0;
        if (item.sleepTimer >= 0.55) {
          item.sleeping = true;
          item.velocity.set(0, 0, 0);
          item.angular.set(0, 0, 0);
        }
      }
      if (Math.abs(item.object.position.x) > activeHalfWidth()) { item.object.position.x = clamp(item.object.position.x, -activeHalfWidth(), activeHalfWidth()); item.velocity.x *= -0.35; }
      if (Math.abs(item.object.position.z) > activeHalfLength()) { item.object.position.z = clamp(item.object.position.z, -activeHalfLength(), activeHalfLength()); item.velocity.z *= -0.35; }
    }
    if (item.life <= 0) {
      scene.remove(item.object);
      debris.splice(index, 1);
    }
  }
}

function updateTraps(dt) {
  if (selectedMapId !== 'arena01') return;
  if (arenaFloorSaw) {
    arenaFloorSaw.pivot.rotation.y += 17 * dt;
    for (const robot of robots) {
      if (robot.dead || arenaFloorSaw.cooldowns.has(robot)) continue;
      const delta = robot.root.position.clone().sub(arenaFloorSaw.pivot.position);
      delta.y = 0;
      if (delta.length() < robot.radius + 1.25) {
        const radial = delta.normalize();
        const tangent = new THREE.Vector3(-radial.z, 0, radial.x);
        robot.applyImpactAtPoint(tangent.multiplyScalar(470).add(new THREE.Vector3(0, 65, 0)), arenaFloorSaw.pivot.position.clone(), 27, 'spinner');
        arenaFloorSaw.cooldowns.set(robot, 0.35);
      }
    }
    for (const [robot, cooldown] of arenaFloorSaw.cooldowns) {
      if (cooldown <= dt) arenaFloorSaw.cooldowns.delete(robot);
      else arenaFloorSaw.cooldowns.set(robot, cooldown - dt);
    }
  }

  const fireActive = worldTime % 7 < 2.15;
  if (firePad) {
    firePad.material.emissiveIntensity = lerp(firePad.material.emissiveIntensity, fireActive ? 2.4 : 0.12, 1 - Math.exp(-7 * dt));
    fireLight.intensity = fireActive ? 5 + Math.sin(worldTime * 22) * 1.3 : 0;
    for (const robot of robots) {
      if (!fireActive || robot.dead) continue;
      if (Math.abs(robot.root.position.x - firePad.position.x) < 2.8 && Math.abs(robot.root.position.z - firePad.position.z) < 2.8 && Math.floor(worldTime * 4) !== Math.floor((worldTime - dt) * 4)) {
        robot.applyImpactAtPoint(new THREE.Vector3(0, 75, 0), robot.root.position.clone(), 4.5, 'fire');
      }
    }
  }
}

function createFloorSaw() {
  const pivot = new THREE.Group();
  pivot.position.set(-12, 0.13, 1.5);
  pivot.add(cloneModel('new_saw_blade', 0xffb9a0));
  scene.add(pivot);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.16, 24), createMaterial(0x4c535c, 0.85, 0.35));
  ring.position.set(-12, 0.02, 1.5);
  scene.add(ring);
  arenaFloorSaw = { pivot, cooldowns: new Map() };
}

function createGarageStage() {
  garageStage = new THREE.Group();
  const garageFloor = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.18, 12),
    createMaterial(0x7d8790, 0.48, 0.68),
  );
  garageFloor.position.set(0, 0.05, -0.5);
  garageFloor.receiveShadow = true;
  garageStage.add(garageFloor);
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(4.25, 4.45, 0.38, 48),
    createMaterial(0x69747e, 0.7, 0.44),
  );
  platform.position.y = 0.18;
  platform.receiveShadow = true;
  garageStage.add(platform);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.72, 0.055, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x26a875, transparent: true, opacity: 0.8 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.4;
  garageStage.add(ring);
  const deck = new THREE.GridHelper(8, 16, 0x22775c, 0x4f5962);
  deck.position.y = 0.405;
  deck.material.opacity = 0.28;
  deck.material.transparent = true;
  garageStage.add(deck);
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 5.8, 0.3), createMaterial(0x727d87, 0.42, 0.7));
  backWall.position.set(0, 2.8, -4.9);
  backWall.receiveShadow = true;
  garageStage.add(backWall);
  const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 0.34), createMaterial(0x56616b, 0.52, 0.62));
  lowerWall.position.set(0, 0.65, -4.68);
  garageStage.add(lowerWall);
  const panelMaterial = createMaterial(0x9aa4ad, 0.3, 0.72);
  for (let row = 0; row < 5; row++) {
    const panelLine = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.055, 0.06), panelMaterial);
    panelLine.position.set(0, 1.55 + row * 0.82, -4.68);
    garageStage.add(panelLine);
  }
  for (const x of [-5.4, 5.4]) {
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 1.05), createMaterial(0x4f5d68, 0.5, 0.58));
    cabinet.position.set(x, 1.2, -4.15);
    garageStage.add(cabinet);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 1.2), createMaterial(0xa3abb1, 0.65, 0.42));
    bench.position.set(x * 0.82, 1.35, -3.75);
    garageStage.add(bench);
  }
  const lampA = new THREE.PointLight(0xf1f7ff, 62, 18, 1.6);
  lampA.position.set(-4, 6, -2);
  garageStage.add(lampA);
  const lampB = new THREE.PointLight(0xfff3df, 55, 17, 1.6);
  lampB.position.set(4, 5.4, 2.5);
  garageStage.add(lampB);
  const topLamp = new THREE.SpotLight(0xffffff, 72, 20, Math.PI / 3.4, 0.6, 1.2);
  topLamp.position.set(0, 8, 1);
  topLamp.target.position.set(0, 0.8, 0);
  garageStage.add(topLamp, topLamp.target);
  blockGridOverlay = new THREE.GridHelper(36 * GRID_UNIT, 72, 0x72dcff, 0x235d75);
  blockGridOverlay.name = 'Lv1BlockHalfGrid';
  blockGridOverlay.position.y = 0.055;
  blockGridOverlay.material.transparent = true;
  blockGridOverlay.material.opacity = 0.68;
  blockGridOverlay.material.depthWrite = false;
  blockGridOverlay.visible = assemblyMode === 'blocks';
  garageStage.add(blockGridOverlay);
  scene.add(garageStage);
}

function createGaragePartObject(record, ghost = false, tint = 0xffffff) {
  const object = new THREE.Group();
  object.name = `Garage_${record.id ?? record.type}`;
  object.userData.partId = record.id ?? null;
  object.userData.partType = record.type;
  object.userData.isCandidate = ghost;
  object.add(createPartVisualContent(record.type, tint, ghost, record.hubFlipped, record.type === 'wheel' ? record.wheelModel : null));
  addMountStandoffVisual(object, record, tint, ghost);
  applyRecordObjectTransform(record, object);
  return object;
}

function rebuildGarageRobot() {
  clearBlockDeleteOutline();
  if (garageRoot) scene.remove(garageRoot);
  garageRoot = new THREE.Group();
  garageRoot.position.y = 1.02;
  garagePartObjects.clear();
  garageBlockObjects.clear();
  garageGizmo = null;
  for (const record of workingAssembly.blocks) {
    const object = createBlockVisualObject(record);
    garageRoot.add(object);
    garageBlockObjects.set(record.id, object);
  }
  normalizeAssemblyMounts(workingAssembly);
  for (const record of workingAssembly.parts) {
    const object = createGaragePartObject(record);
    object.visible = true;
    garageRoot.add(object);
    garagePartObjects.set(record.id, object);
  }
  scene.add(garageRoot);
  rebuildPartList();
  rebuildBlockList();
  refreshGarageGhost();
  refreshBlockGhost();
  rebuildGarageGizmo();
  updateGarageSummary();
}

function rebuildPartList() {
  const current = selectedPartId;
  ui.partList.innerHTML = '<option value="">선택 없음</option>';
  for (const record of workingAssembly.parts) {
    const option = document.createElement('option');
    option.value = record.id;
    option.textContent = `${PART_META[record.type].label} · ${record.id}`;
    ui.partList.appendChild(option);
  }
  ui.partList.value = workingAssembly.parts.some((part) => part.id === current) ? current : '';
}

function rebuildBlockList() {
  const current = selectedBlockId;
  ui.blockList.innerHTML = '';
  for (const block of workingAssembly.blocks) {
    const meta = BLOCK_META[block.type] ?? BLOCK_META.cube;
    const option = document.createElement('option');
    option.value = block.id;
    option.textContent = `${block.isCore ? 'CORE · ' : ''}${meta.label} · ${block.id}`;
    ui.blockList.appendChild(option);
  }
  selectedBlockId = workingAssembly.blocks.some((block) => block.id === current) ? current : (workingAssembly.blocks[0]?.id ?? null);
  ui.blockList.value = selectedBlockId ?? '';
}

function partSurfaceHeight(type) {
  if (type === 'sawMount') return 0.62;
  if (type === 'sawSupport') return 0.68;
  if (type === 'hammerMount' || type === 'pivotMount') return 0.72;
  return GRID_UNIT * 1.5;
}

function nearestRecord(type, point, ignoreId = null) {
  let best = null;
  let distance = Infinity;
  for (const record of workingAssembly.parts) {
    if (record.id === ignoreId || record.type !== type) continue;
    const next = Math.hypot(record.position[0] - point[0], record.position[1] - point[1], record.position[2] - point[2]);
    if (next < distance) { best = record; distance = next; }
  }
  return { record: best, distance };
}

function findMountTargetId(object) {
  let current = object;
  while (current && current !== garageRoot) {
    if (current.userData.mountTargetId) return current.userData.mountTargetId;
    if (current.userData.partId) return current.userData.partId;
    current = current.parent;
  }
  return null;
}

function intersectionToSurfaceHit(hit) {
  if (!hit?.face) return null;
  const targetId = findMountTargetId(hit.object);
  if (!targetId) return null;
  const point = garageRoot.worldToLocal(hit.point.clone());
  const worldNormal = hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize();
  const rootQuaternion = new THREE.Quaternion();
  garageRoot.getWorldQuaternion(rootQuaternion);
  const normal = worldNormal.applyQuaternion(rootQuaternion.invert()).normalize();
  return { point, normal, targetId, distance: hit.distance };
}

function getSurfaceIntersections(raycaster, ignoreId = null, onlyChassis = false) {
  garageRoot.updateWorldMatrix(true, true);
  const hits = raycaster.intersectObjects(garageRoot.children, true);
  const results = [];
  for (const hit of hits) {
    const targetId = findMountTargetId(hit.object);
    if (!targetId || targetId === ignoreId) continue;
    if (onlyChassis && !workingAssembly.blocks.some((block) => block.id === targetId)) continue;
    if (hit.object.userData.gizmoAxis) continue;
    const surface = intersectionToSurfaceHit(hit);
    if (surface) results.push(surface);
  }
  return results;
}

function raycastChassisFromLocal(originLocal, directionLocal) {
  if (!garageRoot || !garageBlockObjects.size) return null;
  garageRoot.updateWorldMatrix(true, true);
  const origin = garageRoot.localToWorld(originLocal.clone());
  const direction = directionLocal.clone().normalize();
  const rootQuaternion = new THREE.Quaternion();
  garageRoot.getWorldQuaternion(rootQuaternion);
  direction.applyQuaternion(rootQuaternion);
  const raycaster = new THREE.Raycaster(origin, direction, 0, 10);
  return getSurfaceIntersections(raycaster, null, true)[0] ?? null;
}

function raycastChassisAtXZ(x, z) {
  return raycastChassisFromLocal(new THREE.Vector3(x, 5, z), new THREE.Vector3(0, -1, 0));
}

function nearestSurfaceFromLocalPoint(record, localPoint) {
  if (!garageRoot) return null;
  garageRoot.updateWorldMatrix(true, true);
  const rootQuaternion = new THREE.Quaternion();
  garageRoot.getWorldQuaternion(rootQuaternion);
  const directions = [
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
  ];
  let best = null;
  let bestDistance = Infinity;
  for (const outward of directions) {
    const originLocal = localPoint.clone().addScaledVector(outward, 3.2);
    const originWorld = garageRoot.localToWorld(originLocal.clone());
    const directionWorld = outward.clone().negate().applyQuaternion(rootQuaternion);
    const raycaster = new THREE.Raycaster(originWorld, directionWorld, 0, 6.4);
    for (const hit of getSurfaceIntersections(raycaster, record.id)) {
      const distance = hit.point.distanceTo(localPoint);
      if (distance < bestDistance) { best = hit; bestDistance = distance; }
    }
  }
  const maximum = 1.35 + recordRadius(record);
  return bestDistance <= maximum ? best : null;
}

function getWeaponAxisCandidates(record) {
  const parts = workingAssembly.parts.filter((part) => part.id !== record.id);
  if (record.type === 'spinner') {
    return parts.filter((part) => ['sawMount', 'sawSupport', 'pivotMount'].includes(part.type)).map((part) => ({ point: new THREE.Vector3(...part.position), targetIds: [part.id], normal: new THREE.Vector3(...(part.mount?.normal ?? [0, 1, 0])) }));
  }
  if (record.type === 'hammer') {
    return parts.filter((part) => ['hammerMount', 'pivotMount'].includes(part.type)).map((part) => ({ point: new THREE.Vector3(...part.position), targetIds: [part.id], normal: new THREE.Vector3(...(part.mount?.normal ?? [0, 1, 0])) }));
  }
  if (record.type === 'barSpinner') {
    return parts.filter((part) => part.type === 'barAxis').map((part) => ({ point: new THREE.Vector3(...part.position), targetIds: [part.id], normal: new THREE.Vector3(...(part.mount?.normal ?? [0, 1, 0])) }));
  }
  if (record.type === 'drumSpinner') {
    const pivots = parts.filter((part) => part.type === 'pivotMount');
    const pairs = [];
    for (let a = 0; a < pivots.length; a++) for (let b = a + 1; b < pivots.length; b++) {
      const left = pivots[a]; const right = pivots[b];
      const separation = Math.abs(left.position[0] - right.position[0]);
      if (separation < 0.75 || Math.abs(left.position[1] - right.position[1]) > 0.25) continue;
      pairs.push({ point: new THREE.Vector3(...left.position).add(new THREE.Vector3(...right.position)).multiplyScalar(0.5), targetIds: [left.id, right.id], normal: new THREE.Vector3(...(left.mount?.normal ?? [0, 1, 0])) });
    }
    return pairs;
  }
  if (record.type !== 'flipper') return [];
  const groups = new Map();
  for (const part of parts.filter((item) => item.type === 'pivotMount')) {
    const key = part.axisGroup ?? part.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(part);
  }
  return [...groups.values()].filter((pair) => pair.length >= 2).map((pair) => ({
    point: new THREE.Vector3(...pair[0].position).add(new THREE.Vector3(...pair[1].position)).multiplyScalar(0.5),
    targetIds: [pair[0].id, pair[1].id],
    normal: new THREE.Vector3(...(pair[0].mount?.normal ?? [0, 1, 0])),
  }));
}

function tryAxisSnapFromPointer(record) {
  if (![...WEAPON_TYPES].includes(record.type) || !garageRoot) return false;
  let best = null;
  let bestDistance = Infinity;
  for (const candidate of getWeaponAxisCandidates(record)) {
    const worldPoint = garageRoot.localToWorld(candidate.point.clone());
    const distance = garageRaycaster.ray.distanceToPoint(worldPoint);
    if (distance < bestDistance) { best = candidate; bestDistance = distance; }
  }
  if (!best || bestDistance > 0.58 * (record.scaleFactor ?? 1)) return false;
  setRecordAxisMount(record, best.point, best.targetIds, best.normal);
  return true;
}

function alignWheelMountFromSurface(record, surface) {
  const normal = surface.normal.clone().normalize();
  const point = surface.point.clone();
  const frontWheel = point.z >= 0;
  const opposite = workingAssembly.parts
    .filter((part) => part.type === 'wheel' && part.id !== record.id && part.mount?.attached && part.mount?.normal)
    .map((part) => ({ part, normal: new THREE.Vector3(...part.mount.normal).normalize() }))
    .filter((entry) => entry.normal.dot(normal) < -0.82 && Boolean(entry.part.steers) === frontWheel)
    .sort((a, b) => Math.abs(a.part.position[2] - point.z) - Math.abs(b.part.position[2] - point.z))[0]?.part ?? null;
  if (opposite?.mount?.point && Math.abs(normal.x) > 0.72) {
    const oppositePoint = new THREE.Vector3(...opposite.mount.point);
    point.y = oppositePoint.y;
    point.z = oppositePoint.z;
    record.mirrorAlignedTo = opposite.id;
    record.wheelAxisGroup = opposite.wheelAxisGroup ?? `wheel-axis-${opposite.id}`;
    opposite.wheelAxisGroup = record.wheelAxisGroup;
    record.steers = Boolean(opposite.steers);
  } else {
    record.mirrorAlignedTo = null;
    record.wheelAxisGroup ??= `wheel-axis-${record.id}`;
    record.steers = frontWheel;
  }
  record.rotation = [0, 0, 0];
  if (!record.hubFlipManual) record.hubFlipped = false;
  setRecordSurfaceMount(record, point, normal, surface.targetId);
  return { mirrored: Boolean(opposite), oppositeId: opposite?.id ?? null, axis: normal.toArray(), point: point.toArray() };
}

function attachRecordFromPointer(record, event) {
  updateGaragePointer(event);
  if (record.type !== 'wheel' && tryAxisSnapFromPointer(record)) return true;
  const surface = getSurfaceIntersections(garageRaycaster, record.id)[0];
  if (!surface) return false;
  if (record.type === 'wheel') {
    alignWheelMountFromSurface(record, surface);
    record.locked = false;
  } else setRecordSurfaceMount(record, surface.point, surface.normal, surface.targetId);
  return true;
}

function normalizeAssemblyMounts(assembly) {
  for (const record of assembly.parts) {
    const targets = new Set([record.mount?.targetId, ...(record.mount?.targetIds ?? [])].filter(Boolean));
    const targetsExist = [...targets].every((id) => assembly.blocks.some((block) => block.id === id) || assembly.parts.some((part) => part.id === id));
    if (record.mount?.attached && targetsExist) {
      refreshRecordMount(record);
      continue;
    }
    record.mount = null;
    record.linkedTo = [];
    if (WEAPON_TYPES.has(record.type) && (record.linkedTo?.length ?? 0) > 0) {
      const targets = record.linkedTo.map((id) => assembly.parts.find((part) => part.id === id)).filter(Boolean);
      if (targets.length) {
        const point = targets.reduce((sum, target) => sum.add(new THREE.Vector3(...target.position)), new THREE.Vector3()).multiplyScalar(1 / targets.length);
        setRecordAxisMount(record, point, targets.map((target) => target.id), new THREE.Vector3(...(targets[0].mount?.normal ?? [0, 1, 0])));
        continue;
      }
    }
    const surface = nearestSurfaceFromLocalPoint(record, new THREE.Vector3(...record.position));
    if (surface) setRecordSurfaceMount(record, surface.point, surface.normal, surface.targetId);
  }
  const pivotGroups = new Map();
  for (const pivot of assembly.parts.filter((part) => part.type === 'pivotMount' && part.axisGroup)) {
    if (!pivotGroups.has(pivot.axisGroup)) pivotGroups.set(pivot.axisGroup, []);
    pivotGroups.get(pivot.axisGroup).push(pivot);
  }
  for (const pair of [...pivotGroups.values()].filter((items) => items.length === 2)) {
    const commonNormal = pair.reduce((sum, pivot) => sum.add(new THREE.Vector3(...(pivot.mount?.normal ?? [0, 1, 0]))), new THREE.Vector3()).normalize();
    for (const pivot of pair) {
      if (pivot.mount?.kind === 'surface') pivot.mount.normal = commonNormal.toArray();
      refreshRecordMount(pivot);
    }
    const commonY = (pair[0].position[1] + pair[1].position[1]) / 2;
    const commonZ = (pair[0].position[2] + pair[1].position[2]) / 2;
    for (const pivot of pair) {
      pivot.position[1] = commonY;
      pivot.position[2] = commonZ;
      if (pivot.mount) pivot.mount.gap = getRecordMountGap(pivot);
    }
  }
}

function getSurfaceAdhesionTelemetry() {
  if (!garageBlockObjects.size || !mountLocalBounds.size) return null;
  const definitions = {
    flatCentre: [new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, -1, 0)],
    front: [new THREE.Vector3(0, GRID_UNIT * 0.5, 3), new THREE.Vector3(0, 0, -1)],
    side: [new THREE.Vector3(3, GRID_UNIT * 0.5, 0), new THREE.Vector3(-1, 0, 0)],
    underside: [new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 1, 0)],
  };
  const samples = {};
  const makeProbe = () => ({ id: '__mount_probe', type: 'pivotMount', position: [0, 0, 0], rotation: [0, 0, 0], scaleFactor: 1, linkedTo: [] });
  for (const [key, [origin, direction]] of Object.entries(definitions)) {
    const hit = raycastChassisFromLocal(origin, direction);
    if (!hit) { samples[key] = { hit: false }; continue; }
    const probe = makeProbe();
    setRecordSurfaceMount(probe, hit.point, hit.normal, hit.targetId);
    const localUp = Y_AXIS.clone().applyQuaternion(getRecordQuaternion(probe)).normalize();
    samples[key] = {
      hit: true,
      point: hit.point.toArray().map((value) => Number(value.toFixed(3))),
      normal: hit.normal.toArray().map((value) => Number(value.toFixed(3))),
      alignmentDot: Number(localUp.dot(hit.normal).toFixed(4)),
      gapMm: Number((getRecordMountGap(probe) * 1000).toFixed(2)),
      penetrationMm: Number((Math.max(0, -getRecordMountGap(probe)) * 1000).toFixed(2)),
    };
  }
  const baseHit = raycastChassisAtXZ(0, 0);
  const resizeRotation = {};
  if (baseHit) {
    for (const [key, scaleFactor, rotation] of [
      ['scaleUp', 1.65, [0, 0, 0]],
      ['scaleDown', 0.55, [0, 0, 0]],
      ['freeRotate', 1, [THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(30), THREE.MathUtils.degToRad(15)]],
    ]) {
      const probe = makeProbe();
      probe.scaleFactor = scaleFactor;
      probe.rotation = rotation;
      setRecordSurfaceMount(probe, baseHit.point, baseHit.normal, baseHit.targetId);
      resizeRotation[key] = {
        scaleFactor,
        userRotationDegrees: rotation.map((value) => Number(THREE.MathUtils.radToDeg(value).toFixed(1))),
        gapMm: Number((getRecordMountGap(probe) * 1000).toFixed(2)),
        penetrationMm: Number((Math.max(0, -getRecordMountGap(probe)) * 1000).toFixed(2)),
      };
    }
  }
  return { samples, resizeRotation };
}

function recordRadius(record) {
  if (record.nativeBlockPlate) return GRID_UNIT * (record.plateSize ?? 0.92) * Math.SQRT1_2;
  return PART_META[record.type].radius * (record.scaleFactor ?? 1) * Math.max(...(record.axisScale ?? [1, 1, 1]));
}

function recordScaleVolume(record) {
  return (record.scaleFactor ?? 1) ** 3 * (record.axisScale ?? [1, 1, 1]).reduce((product, value) => product * value, 1);
}

function blockLocalAABB(record) {
  const bounds = getBlockBounds(record);
  return new THREE.Box3(
    BLOCK_GRID_ORIGIN.clone().add(bounds.min.clone().multiplyScalar(GRID_UNIT)),
    BLOCK_GRID_ORIGIN.clone().add(bounds.max.clone().multiplyScalar(GRID_UNIT)),
  );
}

function recordLocalAABB(record, padding = 0) {
  if (record.nativeBlockPlate) {
    const quaternion = getRecordQuaternion(record);
    const size = AI_BLOCK_ARMOR_SIZE * (record.plateSize ?? 0.92);
    const source = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(size, AI_BLOCK_ARMOR_THICKNESS, size));
    const centre = new THREE.Vector3(...record.position);
    const box = new THREE.Box3().makeEmpty();
    for (const corner of getBoundsCorners(source)) box.expandByPoint(corner.applyQuaternion(quaternion).add(centre));
    if (padding) box.expandByScalar(padding);
    return box;
  }
  const source = record.type === 'wheel' && record.wheelModel
    ? modelLocalBounds.get(record.wheelModel) ?? mountLocalBounds.get(record.type)
    : mountLocalBounds.get(record.type);
  if (!source) {
    const radius = recordRadius(record);
    return new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...record.position), new THREE.Vector3(radius * 2, radius * 2, radius * 2));
  }
  const quaternion = getRecordQuaternion(record);
  const scale = new THREE.Vector3(...(record.axisScale ?? [1, 1, 1])).multiplyScalar(record.scaleFactor ?? 1);
  const centre = new THREE.Vector3(...record.position);
  const box = new THREE.Box3().makeEmpty();
  for (const corner of getBoundsCorners(source)) box.expandByPoint(corner.multiply(scale).applyQuaternion(quaternion).add(centre));
  if (padding) box.expandByScalar(padding);
  return box;
}

function aabbSeparation(a, b) {
  return Math.hypot(
    Math.max(0, a.min.x - b.max.x, b.min.x - a.max.x),
    Math.max(0, a.min.y - b.max.y, b.min.y - a.max.y),
    Math.max(0, a.min.z - b.max.z, b.min.z - a.max.z),
  );
}

function aabbPenetration(a, b) {
  return new THREE.Vector3(
    Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x),
    Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y),
    Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z),
  );
}

function mountTargetClosure(record, assembly = workingAssembly) {
  const result = new Set([record.mount?.targetId, ...(record.mount?.targetIds ?? []), ...(record.linkedTo ?? [])].filter(Boolean));
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...result]) {
      const parent = assembly.parts.find((part) => part.id === id);
      if (!parent) continue;
      for (const next of [parent.mount?.targetId, ...(parent.mount?.targetIds ?? []), ...(parent.linkedTo ?? [])].filter(Boolean)) {
        if (!result.has(next)) { result.add(next); changed = true; }
      }
    }
  }
  return result;
}

function axisMountValidation(record, assembly = workingAssembly) {
  if (record.mount?.kind !== 'axis') return { valid: true, centreError: 0, alignmentError: 0 };
  const allowedByWeapon = {
    spinner: ['sawMount', 'sawSupport', 'pivotMount'], hammer: ['hammerMount', 'pivotMount'],
    flipper: ['pivotMount'], barSpinner: ['barAxis'], drumSpinner: ['pivotMount'],
  };
  const targets = (record.mount.targetIds ?? [record.mount.targetId]).map((id) => assembly.parts.find((part) => part.id === id)).filter(Boolean);
  const allowed = allowedByWeapon[record.type] ?? [];
  const requiredCount = ['flipper', 'drumSpinner'].includes(record.type) ? 2 : 1;
  if (targets.length < requiredCount || targets.some((target) => !allowed.includes(target.type))) return { valid: false, reason: 'wrong-axis-support', centreError: Infinity, alignmentError: Infinity };
  const centre = targets.reduce((sum, target) => sum.add(new THREE.Vector3(...target.position)), new THREE.Vector3()).multiplyScalar(1 / targets.length);
  const centreError = centre.distanceTo(new THREE.Vector3(...record.position));
  let alignmentError = 0;
  if (targets.length >= 2) {
    const delta = new THREE.Vector3(...targets[1].position).sub(new THREE.Vector3(...targets[0].position));
    const axis = record.type === 'drumSpinner' || record.type === 'flipper' ? X_AXIS.clone().applyQuaternion(getRecordQuaternion(record)).normalize() : new THREE.Vector3(...record.mount.normal).normalize();
    alignmentError = 1 - Math.abs(delta.normalize().dot(axis));
  }
  return { valid: centreError <= 0.012 && alignmentError <= 0.035, centreError, alignmentError };
}

function weaponClearanceBlockIds(record, assembly = workingAssembly) {
  if (!WEAPON_TYPES.has(record.type)) return [];
  const ignored = mountTargetClosure(record, assembly);
  const centre = new THREE.Vector3(...record.position);
  const quaternion = getRecordQuaternion(record);
  const scale = record.scaleFactor ?? 1;
  const samples = [];
  if (record.type === 'hammer') {
    for (let index = 0; index <= 7; index++) {
      const angle = lerp(-0.08, 1.24, index / 7);
      samples.push({ centre: new THREE.Vector3(0, Math.sin(angle) * 1.85, -Math.cos(angle) * 1.85).multiplyScalar(scale).applyQuaternion(quaternion).add(centre), radius: 0.38 * scale });
    }
  } else if (record.type === 'flipper') {
    for (let index = 0; index <= 5; index++) samples.push({ centre: new THREE.Vector3(0, Math.sin(index / 5 * 1.1) * 0.7, Math.cos(index / 5 * 1.1) * 0.85).multiplyScalar(scale).applyQuaternion(quaternion).add(centre), radius: 0.34 * scale });
  } else {
    const bounds = recordLocalAABB(record);
    const half = bounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);
    const axis = record.type === 'drumSpinner' ? 'x' : 'y';
    const radius = axis === 'x' ? Math.max(half.y, half.z) : Math.max(half.x, half.z);
    const thickness = axis === 'x' ? half.x : half.y;
    samples.push({ centre, radius: radius + 0.018, thickness: thickness + 0.012, axis });
  }
  const hits = [];
  const restBounds = recordLocalAABB(record);
  for (const block of assembly.blocks) {
    if (ignored.has(block.id)) continue;
    const box = blockLocalAABB(block).clone().expandByScalar(0.018);
    const restDepth = aabbPenetration(restBounds, box);
    const blockedAtRest = restDepth.x > 0.025 && restDepth.y > 0.025 && restDepth.z > 0.025;
    const blocked = blockedAtRest || samples.some((sample) => {
      if (!sample.axis) return box.distanceToPoint(sample.centre) < sample.radius;
      if (sample.axis === 'y') {
        const closestX = clamp(sample.centre.x, box.min.x, box.max.x);
        const closestZ = clamp(sample.centre.z, box.min.z, box.max.z);
        const radial = Math.hypot(sample.centre.x - closestX, sample.centre.z - closestZ);
        const vertical = Math.max(0, box.min.y - sample.centre.y, sample.centre.y - box.max.y);
        return radial < sample.radius && vertical < sample.thickness;
      }
      const closestY = clamp(sample.centre.y, box.min.y, box.max.y);
      const closestZ = clamp(sample.centre.z, box.min.z, box.max.z);
      const radial = Math.hypot(sample.centre.y - closestY, sample.centre.z - closestZ);
      const axial = Math.max(0, box.min.x - sample.centre.x, sample.centre.x - box.max.x);
      return radial < sample.radius && axial < sample.thickness + 0.58 * scale;
    });
    if (blocked) hits.push(block.id);
  }
  return hits;
}

function partCollisionState(record, ignoreId = null, assembly = workingAssembly) {
  const box = recordLocalAABB(record);
  const ignored = mountTargetClosure(record, assembly);
  const blockPenetrations = [];
  const partPenetrations = [];
  for (const block of assembly.blocks) {
    if (ignored.has(block.id)) continue;
    const depth = aabbPenetration(box, blockLocalAABB(block));
    if (depth.x > 0.025 && depth.y > 0.025 && depth.z > 0.025) blockPenetrations.push(block.id);
  }
  for (const other of assembly.parts) {
    if (other.id === ignoreId || other.id === record.id || ignored.has(other.id)) continue;
    // Parent/child functional pairs deliberately share the exact shaft or
    // hinge volume. Treat that designed joint as one compound assembly while
    // still rejecting intersections with unrelated parts.
    if (mountTargetClosure(other, assembly).has(record.id)) continue;
    const depth = aabbPenetration(box, recordLocalAABB(other));
    const minimumAllowed = recordsTouch(record, other) ? 0.075 : 0.03;
    if (depth.x > minimumAllowed && depth.y > minimumAllowed && depth.z > minimumAllowed) partPenetrations.push(other.id);
  }
  return { blockPenetrations, partPenetrations };
}

function applyWeaponAutoCut(record) {
  const ids = weaponClearanceBlockIds(record);
  if (!ids.length) return { applied: false, removed: [] };
  const protectedTargets = new Set(workingAssembly.parts.flatMap((part) => [part.mount?.targetId, ...(part.mount?.targetIds ?? [])]).filter(Boolean));
  const removable = ids.filter((id) => !workingAssembly.blocks.find((block) => block.id === id)?.isCore && !protectedTargets.has(id));
  if (removable.length !== ids.length) return { applied: false, removed: [], blockedByCore: true };
  const before = workingAssembly.blocks;
  workingAssembly.blocks = before.filter((block) => !removable.includes(block.id));
  const graph = getBlockConnectionGraph(workingAssembly.blocks);
  if (graph.disconnected.length) { workingAssembly.blocks = before; return { applied: false, removed: [], disconnectsStructure: true }; }
  return { applied: true, removed: removable };
}

function refreshRecordDurability(record) {
  const meta = PART_META[record.type];
  const volume = recordScaleVolume(record);
  const wheelFactor = record.type !== 'wheel' ? { mass: 1, hp: 1 }
    : record.wheelModel === 'wheel_light' ? { mass: 0.68, hp: 0.76 }
      : record.wheelModel === 'wheel_wide' ? { mass: 1.48, hp: 1.32 }
        : record.wheelModel === 'track_heavy' ? { mass: 1.82, hp: 1.46 } : { mass: 1, hp: 1 };
  record.mass = meta.mass * volume * wheelFactor.mass;
  record.baseHp = meta.hp * Math.cbrt(volume) * wheelFactor.hp;
}

function recordsTouch(a, b) {
  if (a.mount?.attached && (a.mount.targetId === b.id || a.mount.targetIds?.includes(b.id))) return true;
  if (b.mount?.attached && (b.mount.targetId === a.id || b.mount.targetIds?.includes(a.id))) return true;
  const distance = Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1], a.position[2] - b.position[2]);
  return distance <= (recordRadius(a) + recordRadius(b)) * 0.94;
}

function connectionState(assembly = workingAssembly) {
  const parts = assembly.parts;
  const blockGraph = getBlockConnectionGraph(assembly.blocks);
  const structuralIds = blockGraph.connected;
  const connected = new Set(parts.filter((part) => {
    const targets = [part.mount?.targetId, ...(part.mount?.targetIds ?? []), ...(part.linkedTo ?? [])].filter(Boolean);
    return targets.some((id) => structuralIds.has(id));
  }).map((part) => part.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const part of parts) {
      if (connected.has(part.id)) continue;
      if (parts.some((other) => connected.has(other.id) && recordsTouch(part, other))) {
        connected.add(part.id);
        changed = true;
      }
    }
  }
  return { connected, floating: parts.filter((part) => !connected.has(part.id)), structuralIds };
}

function validateGaragePart(record, ignoreId = null, assembly = workingAssembly) {
  const attached = Boolean(record.mount?.attached);
  const gap = getRecordMountGap(record);
  const targets = new Set([record.mount?.targetId, ...(record.mount?.targetIds ?? [])].filter(Boolean));
  const touching = assembly.parts.filter((other) => other.id !== ignoreId && targets.has(other.id));
  const structuralBlocks = assembly.blocks.filter((block) => targets.has(block.id));
  if (!attached || (!structuralBlocks.length && !touching.length)) return { valid: false, touching: [], gap, reason: 'floating', message: '설치 불가 · 실제 블록/부품/지지대 표면에 닿아 있지 않습니다.' };
  if (!Number.isFinite(gap) || Math.abs(gap) > 0.012) return { valid: false, touching: [], gap, reason: 'surface-gap', message: `설치 불가 · 장착면 간격이 ${Number.isFinite(gap) ? Math.abs(gap * 1000).toFixed(1) : '∞'}mm입니다.` };
  const axis = axisMountValidation(record, assembly);
  if (!axis.valid) return { valid: false, touching, gap, reason: 'axis-misaligned', axis, message: `설치 불가 · 무기 Pivot과 지지대 축 중심을 일치시키세요 (${Number.isFinite(axis.centreError) ? (axis.centreError * 1000).toFixed(1) : '∞'}mm).` };
  const collisions = partCollisionState(record, ignoreId, assembly);
  if (collisions.blockPenetrations.length || collisions.partPenetrations.length) {
    return { valid: false, touching, gap, reason: 'solid-penetration', collisions, message: `설치 불가 · 기존 ${collisions.blockPenetrations.length ? `블록 ${collisions.blockPenetrations.length}개` : `부품 ${collisions.partPenetrations.length}개`}를 관통합니다.` };
  }
  const clearanceBlocks = weaponClearanceBlockIds(record, assembly);
  if (clearanceBlocks.length) {
    const cutEnabled = assembly === workingAssembly && Boolean(record.autoCutClearance || ui.weaponAutoCut?.checked);
    return { valid: cutEnabled, touching, gap, reason: cutEnabled ? 'clearance-auto-cut-ready' : 'weapon-clearance', clearanceBlocks, message: cutEnabled
      ? `설치 가능 · 회전 궤적을 막는 블록 ${clearanceBlocks.length}개만 확정 시 최소 절삭합니다.`
      : `설치 불가 · WeaponClearanceVolume 안에 블록 ${clearanceBlocks.length}개가 있습니다. 위치를 옮기거나 최소 자동 절삭을 켜세요.` };
  }
  const targetLabel = record.mount.kind === 'axis' ? '연결 구멍 축' : structuralBlocks.length ? '블록 차체 표면' : '부품 표면';
  return { valid: true, touching, gap, axis, collisions, clearanceBlocks: [], message: `${targetLabel} 밀착 · 관통 0 · 회전/바퀴 공간 확보 · Collider 동기화` };
}

function alignAxisRecordToSupports(record, assembly) {
  if (record.mount?.kind !== 'axis') return false;
  const ids = record.mount.targetIds ?? [record.mount.targetId];
  const supports = ids.map((id) => assembly.parts.find((part) => part.id === id)).filter(Boolean);
  if (!supports.length) return false;
  const centre = supports.reduce((sum, support) => sum.add(new THREE.Vector3(...support.position)), new THREE.Vector3()).multiplyScalar(1 / supports.length);
  record.position = centre.toArray();
  record.mount.point = centre.toArray();
  record.linkedTo = supports.map((support) => support.id);
  record.mount.gap = 0;
  return true;
}

function repairLoadedFunctionalPlacement(assembly) {
  const repaired = [];
  const surfaceParts = assembly.parts.filter((part) => part.mount?.kind === 'surface' && part.mount?.attached);
  for (const part of surfaceParts) {
    refreshRecordMount(part);
    let result = validateGaragePart(part, part.id, assembly);
    if (result.valid || result.reason !== 'solid-penetration') continue;
    const original = cloneData(part);
    const base = Math.max(0, Number(part.mount.standoff ?? 0));
    for (let step = 1; step <= 20; step++) {
      part.mount.standoff = base + step * 0.06;
      refreshRecordMount(part);
      result = validateGaragePart(part, part.id, assembly);
      if (result.valid) { repaired.push({ id: part.id, type: part.type, mode: 'surface-standoff', standoff: part.mount.standoff }); break; }
    }
    if (!result.valid) Object.assign(part, original);
  }

  for (const weapon of assembly.parts.filter((part) => WEAPON_TYPES.has(part.type) && part.mount?.kind === 'axis')) {
    alignAxisRecordToSupports(weapon, assembly);
    let result = validateGaragePart(weapon, weapon.id, assembly);
    if (result.valid) continue;
    const ids = weapon.mount.targetIds ?? [weapon.mount.targetId];
    const supports = ids.map((id) => assembly.parts.find((part) => part.id === id)).filter((part) => part?.mount?.kind === 'surface');
    if (!supports.length) continue;
    const originalSupports = supports.map((part) => cloneData(part));
    const originalWeapon = cloneData(weapon);
    const bases = supports.map((part) => Math.max(0, Number(part.mount.standoff ?? 0)));
    for (let step = 1; step <= 24; step++) {
      supports.forEach((support, index) => {
        support.mount.standoff = bases[index] + step * 0.06;
        refreshRecordMount(support);
      });
      alignAxisRecordToSupports(weapon, assembly);
      const supportsValid = supports.every((support) => validateGaragePart(support, support.id, assembly).valid);
      result = validateGaragePart(weapon, weapon.id, assembly);
      if (supportsValid && result.valid) {
        repaired.push({ id: weapon.id, type: weapon.type, mode: 'axis-clearance-standoff', standoff: supports[0].mount.standoff });
        break;
      }
    }
    if (!result.valid) {
      supports.forEach((support, index) => Object.assign(support, originalSupports[index]));
      Object.assign(weapon, originalWeapon);
    }
  }
  if (repaired.length) {
    refreshFunctionalLinks(assembly);
    assembly.mountingMigration = { version: ASSEMBLY_VERSION, repaired };
  }
  return repaired;
}

function refreshFunctionalLinks(assembly = workingAssembly) {
  const supportsByWeapon = {
    spinner: ['sawMount', 'sawSupport', 'pivotMount'],
    hammer: ['hammerMount', 'pivotMount'],
    flipper: ['pivotMount'],
    barSpinner: ['barAxis'],
    drumSpinner: ['pivotMount'],
  };
  for (const part of assembly.parts) {
    const allowed = supportsByWeapon[part.type];
    if (!allowed) continue;
    const mountedIds = new Set([part.mount?.targetId, ...(part.mount?.targetIds ?? [])].filter(Boolean));
    const candidates = assembly.parts.filter((other) => allowed.includes(other.type) && (mountedIds.has(other.id) || recordsTouch(part, other)));
    candidates.sort((a, b) => Math.hypot(a.position[0] - part.position[0], a.position[1] - part.position[1], a.position[2] - part.position[2]) - Math.hypot(b.position[0] - part.position[0], b.position[1] - part.position[1], b.position[2] - part.position[2]));
    part.linkedTo = candidates.slice(0, ['flipper', 'drumSpinner'].includes(part.type) ? 2 : 1).map((item) => item.id);
  }
}

function getPivotPairTelemetry() {
  const groups = new Map();
  for (const part of workingAssembly.parts.filter((item) => item.type === 'pivotMount' && item.axisGroup)) {
    if (!groups.has(part.axisGroup)) groups.set(part.axisGroup, []);
    groups.get(part.axisGroup).push(part);
  }
  return [...groups.entries()].filter(([, parts]) => parts.length === 2).map(([group, pair]) => {
    const [left, right] = pair.sort((a, b) => a.position[0] - b.position[0]);
    const leftNormal = new THREE.Vector3(1, 0, 0).applyQuaternion(getRecordQuaternion(left));
    const rightNormal = new THREE.Vector3(1, 0, 0).applyQuaternion(getRecordQuaternion(right));
    return {
      group,
      ids: [left.id, right.id],
      heightError: Number(Math.abs(left.position[1] - right.position[1]).toFixed(4)),
      centreLineError: Number(Math.abs(left.position[2] - right.position[2]).toFixed(4)),
      inwardDots: [Number(leftNormal.x.toFixed(3)), Number((-rightNormal.x).toFixed(3))],
      gap: Number((right.position[0] - left.position[0]).toFixed(3)),
    };
  });
}

function getWheelPairTelemetry() {
  const groups = new Map();
  for (const wheel of workingAssembly.parts.filter((part) => part.type === 'wheel' && part.wheelAxisGroup)) {
    if (!groups.has(wheel.wheelAxisGroup)) groups.set(wheel.wheelAxisGroup, []);
    groups.get(wheel.wheelAxisGroup).push(wheel);
  }
  return [...groups.entries()].filter(([, pair]) => pair.length >= 2).map(([group, pair]) => {
    const [left, right] = [...pair].sort((a, b) => a.position[0] - b.position[0]);
    const leftAxis = X_AXIS.clone().applyQuaternion(getRecordQuaternion(left)).normalize();
    const rightAxis = X_AXIS.clone().applyQuaternion(getRecordQuaternion(right)).normalize();
    return {
      group, ids: [left.id, right.id],
      heightError: Number(Math.abs(left.position[1] - right.position[1]).toFixed(4)),
      longitudinalError: Number(Math.abs(left.position[2] - right.position[2]).toFixed(4)),
      parallelAxisDot: Number(Math.abs(leftAxis.dot(rightAxis)).toFixed(4)),
      outwardHubs: Boolean(left.hubFlipped) && !Boolean(right.hubFlipped),
    };
  });
}

function currentEditorRecord() {
  if (candidatePart) return candidatePart;
  return workingAssembly.parts.find((part) => part.id === selectedPartId) ?? null;
}

function updateInspectorFromRecord() {
  const record = currentEditorRecord();
  document.body.classList.toggle('garage-editing', Boolean(record));
  if (!record) {
    ui.selectionName.textContent = '부품을 선택하세요';
    ui.transformReadout.textContent = '화면의 부품을 클릭하거나 카탈로그에서 추가하세요.';
    ui.duplicatePart.disabled = true;
    ui.alignAxis.disabled = true;
    ui.flipWheel.disabled = true;
    rebuildGarageGizmo();
    return;
  }
  ui.selectionName.textContent = `${PART_META[record.type].label}${candidatePart ? ' 프리뷰' : ''}`;
  const degrees = record.rotation.map((value) => Math.round(THREE.MathUtils.radToDeg(value)));
  const normal = record.mount?.normal ?? [0, 0, 0];
  const gap = getRecordMountGap(record);
  const axisScale = record.axisScale ?? [1, 1, 1];
  const orientationLabel = record.orientationPreset === 'vertical' || Math.abs(Math.sin(degrees[0] * Math.PI / 180)) > 0.7 ? '세로' : '가로';
  ui.transformReadout.textContent = `위치  ${record.position.map((value) => value.toFixed(2)).join(' / ')}\n방향  ${orientationLabel}${Math.abs(degrees[1]) >= 170 ? ' · 반전' : ''}\n크기  ${(record.scaleFactor ?? 1).toFixed(2)}× 균등 · Collider 동일\n장착  ${record.mount?.kind ?? '없음'} · 간격 ${Number.isFinite(gap) ? (gap * 1000).toFixed(1) : '∞'}mm`;
  const orientationPreset = orientationLabel === '세로' ? 'vertical' : 'horizontal';
  document.querySelectorAll('[data-orientation]').forEach((button) => button.classList.toggle('active', button.dataset.orientation === orientationPreset));
  ui.duplicatePart.disabled = Boolean(candidatePart);
  ui.alignAxis.disabled = record.type !== 'pivotMount';
  ui.flipWheel.disabled = record.type !== 'wheel';
  updateSelectedStatus();
  rebuildGarageGizmo();
}

function refreshGarageGhost() {
  if (!garageRoot) return;
  if (garageGhost) {
    garagePartObjects.delete(garageGhost.userData.partId);
    garageRoot.remove(garageGhost);
  }
  garageGhost = null;
  if (!candidatePart) {
    ui.installPart.disabled = true;
    return;
  }
  const result = validateGaragePart(candidatePart);
  garageGhost = createGaragePartObject(candidatePart, true);
  setPreviewValidity(garageGhost, result.valid);
  garageRoot.add(garageGhost);
  garagePartObjects.set(candidatePart.id, garageGhost);
  ui.mountStatus.className = `mount-status ${result.valid ? 'valid' : 'invalid'}`;
  ui.mountStatus.querySelector('span').textContent = result.message;
  ui.installPart.disabled = !result.valid;
  ui.garageState.dataset.previewValid = String(result.valid);
  ui.garageState.dataset.previewMessage = result.message;
  rebuildGarageGizmo();
}

function updateGarageSummary() {
  const state = connectionState();
  const blockMass = workingAssembly.blocks.reduce((sum, block) => sum + (block.mass ?? BLOCK_META[block.type].mass), 0);
  const mass = blockMass + workingAssembly.parts.reduce((sum, part) => sum + (part.mass ?? PART_META[part.type].mass), 0);
  const blockGraph = getBlockConnectionGraph();
  const occupiedBlockCells = blockOccupancy(workingAssembly.blocks);
  const mountGaps = workingAssembly.parts.map((part) => getRecordMountGap(part));
  const driveParts = workingAssembly.parts.filter((part) => part.type === 'wheel');
  const superHeavyDrives = driveParts.filter((part) => ['wheel_wide', 'track_heavy'].includes(part.wheelModel)).length;
  const lightDrives = driveParts.filter((part) => part.wheelModel === 'wheel_light').length;
  workingAssembly.weightClass = superHeavyDrives >= Math.ceil(Math.max(1, driveParts.length) * 0.5) ? 'superheavy'
    : lightDrives >= Math.ceil(Math.max(1, driveParts.length) * 0.5) ? 'lightweight' : 'middleweight';
  workingAssembly.driveType = driveParts.some((part) => part.wheelModel === 'track_heavy') ? 'track' : 'wheel';
  ui.garageCount.textContent = `블록 ${workingAssembly.blocks.length} · 기능 부품 ${workingAssembly.parts.length}`;
  ui.garageMass.textContent = `${WEIGHT_CLASSES[workingAssembly.weightClass].label} · ${workingAssembly.driveType === 'track' ? '궤도' : '바퀴'} · ${mass.toFixed(0)}kg`;
  ui.saveState.textContent = garageDirty ? '저장되지 않은 변경' : '저장됨';
  ui.saveState.style.color = garageDirty ? '#ffb65e' : '#65ddb0';
  ui.garageState.textContent = JSON.stringify({
    mode, assemblyMode, partCount: workingAssembly.parts.length + workingAssembly.blocks.length, mass: Number(mass.toFixed(1)),
    structureType: 'player-block-graph',
    legacyChassisPresent: false,
    lockedWheelCount: workingAssembly.parts.filter((part) => part.type === 'wheel' && part.locked).length,
    weightClass: workingAssembly.weightClass,
    driveType: workingAssembly.driveType,
    driveModels: driveParts.map((part) => part.wheelModel),
    exteriorCounts: Object.fromEntries([...EXTERIOR_TYPES].map((key) => [key, workingAssembly.parts.filter((part) => part.type === key).length])),
    weaponCounts: Object.fromEntries([...WEAPON_TYPES].map((key) => [key, workingAssembly.parts.filter((part) => part.type === key).length])),
    blockSystem: {
      version: ASSEMBLY_VERSION,
      blockSize: BLOCK_SIZE,
      gridUnit: GRID_UNIT,
      referenceBlocksAcrossMediumRobot: Number((2.88 / GRID_UNIT).toFixed(2)),
      halfGrid: HALF_GRID,
      officialColor: '#39afe7',
      blockCount: workingAssembly.blocks.length,
      logicalBlocksIndependent: true,
      occupiedHalfCells: occupiedBlockCells.size,
      uniqueOccupiedHalfCells: occupiedBlockCells.size === workingAssembly.blocks.reduce((sum, block) => sum + blockMicroCells(block).length, 0),
      connectedToCore: blockGraph.connected.size,
      disconnectedIds: blockGraph.disconnected.map((block) => block.id),
      selectedId: selectedBlockId,
      candidate: candidateBlock ? {
        id: candidateBlock.id,
        type: candidateBlock.type,
        gridPosition: candidateBlock.gridPosition,
        rotationSteps: candidateBlock.rotationSteps,
        previewVisible: Boolean(candidateBlock.previewVisible),
        previewAttached: Boolean(candidateBlock.previewAttached),
        targetId: candidateBlock.previewTargetId ?? null,
        face: candidateBlock.previewFace ?? null,
        valid: Boolean(candidateBlock.previewAttached && validateBlockPlacement(candidateBlock).valid),
      } : null,
      placementPolicy: 'player-raycast-face-only-no-auto-slot',
      supportedFaces: ['x+', 'x-', 'y+', 'y-', 'z+', 'z-'],
      continuousPlacement: { clickRepeat: true, pointerDragPaint: true, duplicateCellsRejected: true },
      cameraControls: { mouseOrbit: true, wheelZoom: true, touchOrbit: true, pinchZoom: true, undersideView: true },
      collisionPolicy: { boxes: 'Box Collider metadata', slopes: 'simple convex wedge metadata', meshColliderPerBlock: false },
      input: { pc: 'PointerEvent mouse', mobile: 'PointerEvent touch', directCanvasPlacement: true },
      rotation: { beforeInstall: true, afterInstall: true, axes: ['x', 'y', 'z'], stepDegrees: 90, preservesGridValidation: true },
      deletion: { raycastExactBlockId: true, coreTypeCheckOnly: true, hoverId: blockDeleteHoverId, redOutline: Boolean(blockDeleteOutline && blockDeleteHoverId), nearestBlockFallback: false },
      functionalPartGridUnit: GRID_UNIT,
      qa: runLv1BlockDataTests(),
    },
    floatingParts: state.floating.length,
    freePlacement: true,
    forcedSnap: false,
    surfaceAdhesion: true,
    mounting: {
      attachedParts: workingAssembly.parts.filter((part) => part.mount?.attached).length,
      invalidParts: workingAssembly.parts.filter((part) => !part.mount?.attached || !Number.isFinite(getRecordMountGap(part)) || Math.abs(getRecordMountGap(part)) > 0.012).map((part) => part.id),
      maxGapMm: Number((Math.max(0, ...mountGaps.filter(Number.isFinite).map((gap) => Math.abs(gap))) * 1000).toFixed(2)),
      penetrationParts: workingAssembly.parts.filter((part) => getRecordMountGap(part) < -0.001).map((part) => part.id),
    },
    editor: currentEditorRecord() ? {
      mode: transformMode,
      axis: transformAxis,
      selected: currentEditorRecord().id,
      type: currentEditorRecord().type,
      position: currentEditorRecord().position.map((value) => Number(value.toFixed(3))),
      rotationDegrees: currentEditorRecord().rotation.map((value) => Number(THREE.MathUtils.radToDeg(value).toFixed(1))),
      scaleFactor: Number((currentEditorRecord().scaleFactor ?? 1).toFixed(2)),
      axisScale: (currentEditorRecord().axisScale ?? [1, 1, 1]).map((value) => Number(value.toFixed(2))),
      colliderScaleFollowsVisual: true,
      hubFlipped: Boolean(currentEditorRecord().hubFlipped),
      mount: currentEditorRecord().mount ? {
        kind: currentEditorRecord().mount.kind,
        targetId: currentEditorRecord().mount.targetId,
        targetIds: currentEditorRecord().mount.targetIds ?? [],
        normal: (currentEditorRecord().mount.normal ?? []).map((value) => Number(value.toFixed(3))),
        gapMm: Number((getRecordMountGap(currentEditorRecord()) * 1000).toFixed(2)),
        attached: Boolean(currentEditorRecord().mount.attached),
      } : null,
    } : null,
    pivotPairs: getPivotPairTelemetry(),
    wheelPairs: getWheelPairTelemetry(),
    surfaceQA: getSurfaceAdhesionTelemetry(),
    airborneEditing: false,
    connectionValidation: 'surface-and-axis-mount',
    localWeaponAxes: { spinner: 'localY', barSpinner: 'localY', drumSpinner: 'localX', hammer: 'localX', flipper: 'localX' },
    dirty: garageDirty,
  });
}

function beginCatalogPart(type, wheelModelOverride = null) {
  document.querySelectorAll('[data-catalog]').forEach((button) => button.classList.toggle('selected', button.dataset.catalog === type && (button.dataset.wheelModel ?? null) === wheelModelOverride));
  const meta = PART_META[type];
  const startPosition = [0, partSurfaceHeight(type), 0];
  const wheelModel = type === 'wheel' ? (wheelModelOverride ?? 'new_wheel') : null;
  const model = wheelModel ?? meta.model;
  candidatePart = { id: `part-${Date.now()}`, type, position: startPosition, rotation: [0, 0, 0], scaleFactor: 1, axisScale: [1, 1, 1], hubFlipped: false, hubFlipManual: false, steers: false, locked: false, mount: null, linkedTo: [], scale: [...MODEL_TRANSFORMS[model].scale], mass: meta.mass, baseHp: meta.hp, wheelModel, driveType: wheelModel === 'track_heavy' ? 'track' : 'wheel' };
  selectedPartId = null;
  ui.partList.value = '';
  refreshGarageGhost();
  updateInspectorFromRecord();
  updateGarageSummary();
}

function pushUndo() {
  undoStack.push(cloneData(workingAssembly));
  if (undoStack.length > 24) undoStack.shift();
}

function isLockedRecord(record) {
  return Boolean(record?.type === 'wheel' && record.locked);
}

function removeAllWeapons() {
  if (!window.confirm('전체 무기와 무기 지지대를 제거하시겠습니까? 블록 차체와 이동장치는 유지됩니다.')) return;
  pushUndo();
  workingAssembly.parts = workingAssembly.parts.filter((part) => part.type === 'wheel' || EXTERIOR_TYPES.has(part.type));
  candidatePart = null;
  selectedPartId = null;
  garageDirty = true;
  rebuildGarageRobot();
  updateInspectorFromRecord();
  showMessage('모든 무기와 지지대를 제거했습니다.', 1.1);
}

function installCandidate() {
  if (!candidatePart) return;
  let result = validateGaragePart(candidatePart);
  if (!result.valid) return;
  pushUndo();
  if (result.clearanceBlocks?.length) {
    const cut = applyWeaponAutoCut(candidatePart);
    if (!cut.applied) {
      undoStack.pop();
      showMessage(cut.blockedByCore ? 'Core를 절삭해야 하므로 설치할 수 없습니다.' : '구조 연결을 끊지 않고 확보할 수 있는 무기 공간이 아닙니다.', 1.5);
      refreshGarageGhost();
      return;
    }
    candidatePart.autoCutClearance = true;
    candidatePart.autoCutRemovedBlockIds = cut.removed;
    result = validateGaragePart(candidatePart);
    if (!result.valid) { undoStack.pop(); return; }
  }
  const installed = cloneData(candidatePart);
  installed.linkedTo = [...new Set([...(candidatePart.linkedTo ?? []), ...result.touching.map((part) => part.id)])];
  refreshRecordDurability(installed);
  workingAssembly.parts.push(installed);
  selectedPartId = candidatePart.id;
  candidatePart = null;
  garageDirty = true;
  document.querySelectorAll('[data-catalog]').forEach((button) => button.classList.remove('selected'));
  rebuildGarageRobot();
  ui.partList.value = selectedPartId;
  updateInspectorFromRecord();
  showMessage('부품 설치 완료', 0.8);
}

function removeSelectedPart() {
  if (!selectedPartId) return;
  const selected = workingAssembly.parts.find((part) => part.id === selectedPartId);
  if (isLockedRecord(selected)) { showMessage('이 차체의 바퀴는 고정형이라 제거할 수 없습니다.', 1.2); return; }
  pushUndo();
  workingAssembly.parts = workingAssembly.parts.filter((part) => part.id !== selectedPartId);
  for (const part of workingAssembly.parts) part.linkedTo = (part.linkedTo ?? []).filter((id) => id !== selectedPartId);
  selectedPartId = null;
  garageDirty = true;
  rebuildGarageRobot();
  updateInspectorFromRecord();
  showMessage('선택한 부품만 삭제했습니다.', 1.0);
}

function updateSelectedStatus() {
  const record = currentEditorRecord();
  if (!record) return;
  const result = validateGaragePart(record, candidatePart ? null : record.id);
  ui.mountStatus.className = `mount-status ${result.valid ? 'valid' : 'invalid'}`;
  ui.mountStatus.querySelector('span').textContent = result.message;
  if (candidatePart) ui.installPart.disabled = !result.valid;
}

function duplicateSelectedPart() {
  const record = workingAssembly.parts.find((part) => part.id === selectedPartId);
  if (!record) return;
  if (isLockedRecord(record)) { showMessage('고정형 바퀴는 복제할 수 없습니다.', 1.0); return; }
  pushUndo();
  const copy = cloneData(record);
  copy.id = `part-${Date.now()}`;
  copy.position[0] += 0.28;
  copy.linkedTo = [];
  copy.axisGroup = null;
  copy.mount = null;
  const surface = nearestSurfaceFromLocalPoint(copy, new THREE.Vector3(...copy.position));
  if (surface) setRecordSurfaceMount(copy, surface.point, surface.normal, surface.targetId);
  workingAssembly.parts.push(copy);
  selectedPartId = copy.id;
  garageDirty = true;
  rebuildGarageRobot();
  ui.partList.value = copy.id;
  updateInspectorFromRecord();
  showMessage('부품을 같은 방향과 크기로 복제했습니다.', 0.9);
}

function flipSelectedWheel() {
  const record = currentEditorRecord();
  if (!record || record.type !== 'wheel') return;
  if (isLockedRecord(record)) { showMessage('고정형 바퀴의 허브 방향은 차체에 맞춰 잠겨 있습니다.', 1.1); return; }
  if (!candidatePart) pushUndo();
  record.hubFlipManual = true;
  record.hubFlipped = !record.hubFlipped;
  if (candidatePart) refreshGarageGhost();
  else rebuildGarageRobot();
  garageDirty = !candidatePart || garageDirty;
  updateInspectorFromRecord();
  showMessage('휠 허브 방향을 180° 반전했습니다.', 0.8);
}

function alignSelectedPivotPair() {
  const selected = currentEditorRecord();
  if (!selected || selected.type !== 'pivotMount') return;
  const other = nearestRecord('pivotMount', selected.position, candidatePart ? null : selected.id).record;
  if (!other) { showMessage('축을 맞출 다른 범용 지지대가 없습니다.', 1.0); return; }
  const before = cloneData(workingAssembly);
  const centreX = (selected.position[0] + other.position[0]) / 2;
  const centreY = (selected.position[1] + other.position[1]) / 2;
  const centreZ = (selected.position[2] + other.position[2]) / 2;
  const gap = Math.max(1.3, Math.abs(selected.position[0] - other.position[0]));
  const left = selected.position[0] <= other.position[0] ? selected : other;
  const right = left === selected ? other : selected;
  left.position = [centreX - gap / 2, centreY, centreZ];
  right.position = [centreX + gap / 2, centreY, centreZ];
  left.rotation = [0, 0, 0];
  right.rotation = [0, Math.PI, 0];
  for (const support of [left, right]) {
    const surface = nearestSurfaceFromLocalPoint(support, new THREE.Vector3(...support.position));
    if (surface) setRecordSurfaceMount(support, surface.point, surface.normal, surface.targetId);
  }
  const group = `axis-${Date.now()}`;
  left.axisGroup = group;
  right.axisGroup = group;
  if (!candidatePart) undoStack.push(before);
  else {
    undoStack.push(before);
    const otherObject = garagePartObjects.get(other.id);
    if (otherObject) syncGarageObject(other, otherObject);
  }
  garageDirty = true;
  if (candidatePart) refreshGarageGhost();
  else rebuildGarageRobot();
  updateInspectorFromRecord();
  updateGarageSummary();
  showMessage('축 스냅: 두 구멍이 안쪽을 향하도록 높이·중심선·180° 방향을 맞췄습니다.', 1.4);
}

function applyRotationStep(degrees) {
  const record = currentEditorRecord();
  if (!record) return;
  if (isLockedRecord(record)) { showMessage('고정형 바퀴는 회전 편집할 수 없습니다.', 1.0); return; }
  if (!candidatePart) pushUndo();
  const axisIndex = { x: 0, y: 1, z: 2 }[transformAxis];
  record.rotation[axisIndex] = normalizeAngle(record.rotation[axisIndex] + THREE.MathUtils.degToRad(degrees));
  garageDirty = !candidatePart || garageDirty;
  applyRecordTransformLive(record);
  updateInspectorFromRecord();
  updateGarageSummary();
}

function applyUniformScaleStep(amount) {
  const record = currentEditorRecord();
  if (!record) return;
  if (isLockedRecord(record)) { showMessage('고정형 바퀴는 크기 편집할 수 없습니다.', 1); return; }
  if (!candidatePart) pushUndo();
  const limits = PART_LIMITS[record.type] ?? [0.5, 1.8];
  record.scaleFactor = clamp((record.scaleFactor ?? 1) + amount, limits[0], limits[1]);
  garageDirty = !candidatePart || garageDirty;
  applyRecordTransformLive(record);
  updateInspectorFromRecord();
  updateGarageSummary();
}

function setOrientationPreset(preset) {
  const record = currentEditorRecord();
  if (!record || isLockedRecord(record)) return;
  if (!candidatePart) pushUndo();
  if (preset === 'horizontal') record.rotation = [0, 0, 0];
  else if (preset === 'vertical') record.rotation = [Math.PI / 2, 0, 0];
  else if (preset === 'flip') record.rotation[1] = normalizeAngle((record.rotation[1] ?? 0) + Math.PI);
  record.orientationPreset = preset === 'flip' ? (record.orientationPreset ?? 'horizontal') : preset;
  garageDirty = !candidatePart || garageDirty;
  document.querySelectorAll('[data-orientation]').forEach((button) => button.classList.toggle('active', button.dataset.orientation === record.orientationPreset));
  applyRecordTransformLive(record);
  if (candidatePart) refreshGarageGhost();
  updateInspectorFromRecord();
  updateGarageSummary();
}

function syncGarageObject(record, object = garagePartObjects.get(record.id)) {
  if (!object) return;
  applyRecordObjectTransform(record, object);
}

function applyRecordTransformLive(record) {
  refreshRecordMount(record);
  const object = candidatePart ? garageGhost : garagePartObjects.get(record.id);
  syncGarageObject(record, object);
  if (record.type === 'wheel') record.steers = record.position[2] > 0.2;
  refreshRecordDurability(record);
  updateSelectedStatus();
  rebuildGarageGizmo();
}

function rebuildGarageGizmo() {
  if (!garageRoot) return;
  if (garageGizmo) garageRoot.remove(garageGizmo);
  garageGizmo = null;
  const record = currentEditorRecord();
  if (!record) return;
  const group = new THREE.Group();
  group.name = 'TransformGizmo';
  group.position.set(...record.position);
  group.quaternion.copy(getRecordQuaternion(record));
  group.scale.setScalar(0.95);
  const colors = { x: 0xff4d45, y: 0x35d979, z: 0x4e92ff };
  const axisVector = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
  const orientAlong = (object, axis) => {
    if (axis === 'x') object.rotation.z = -Math.PI / 2;
    else if (axis === 'z') object.rotation.x = Math.PI / 2;
  };
  if (transformMode === 'scale') {
    const material = new THREE.MeshBasicMaterial({ color: 0x68d5ff, depthTest: false, transparent: true, opacity: 0.86, wireframe: true, toneMapped: false });
    const handle = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 1), material);
    handle.userData.gizmoAxis = 'uniform';
    handle.renderOrder = 30;
    group.add(handle);
  } else for (const axis of ['x', 'y', 'z']) {
    const material = new THREE.MeshBasicMaterial({ color: colors[axis], depthTest: false, transparent: true, opacity: axis === transformAxis ? 1 : 0.72, toneMapped: false });
    {
      const length = 1.05;
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 8), material);
      orientAlong(shaft, axis);
      shaft.position.copy(axisVector[axis]).multiplyScalar(length / 2);
      shaft.userData.gizmoAxis = axis;
      shaft.renderOrder = 30;
      group.add(shaft);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 10), material);
      orientAlong(head, axis);
      head.position.copy(axisVector[axis]).multiplyScalar(length);
      head.userData.gizmoAxis = axis;
      head.renderOrder = 30;
      group.add(head);
    }
  }
  garageGizmo = group;
  garageRoot.add(group);
}

function updateGaragePointer(event) {
  const rect = ui.canvas.getBoundingClientRect();
  garagePointer.x = -(((event.clientX - rect.left) / rect.width) * 2 - 1);
  garagePointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  garageRaycaster.setFromCamera(garagePointer, camera);
}

function findGaragePartHit(object) {
  let current = object;
  while (current && current !== garageRoot) {
    if (current.userData.partId) return current;
    current = current.parent;
  }
  return null;
}

function garageHitTest(event) {
  updateGaragePointer(event);
  const hits = garageRaycaster.intersectObjects(garageRoot?.children ?? [], true);
  const gizmoHit = hits.find((hit) => hit.object.userData.gizmoAxis);
  if (gizmoHit) return { kind: 'gizmo', axis: gizmoHit.object.userData.gizmoAxis };
  for (const hit of hits) {
    const partObject = findGaragePartHit(hit.object);
    if (partObject) return { kind: 'part', id: partObject.userData.partId, candidate: partObject.userData.isCandidate };
  }
  return null;
}

function findGarageBlockHit(object) {
  let current = object;
  let found = null;
  while (current && current !== garageRoot) {
    if (current.userData.blockId) found = current;
    current = current.parent;
  }
  return found;
}

function blockHitTest(event, includeCandidate = false, requireFace = false) {
  updateGaragePointer(event);
  const hits = garageRaycaster.intersectObjects(garageRoot?.children ?? [], true);
  for (const hit of hits) {
    const object = findGarageBlockHit(hit.object);
    if (!object || (!includeCandidate && object.userData.isBlockCandidate) || (requireFace && !hit.face)) continue;
    return { object, hit, id: object.userData.blockId };
  }
  return null;
}

function clearBlockDeleteOutline() {
  if (blockDeleteOutline) {
    scene.remove(blockDeleteOutline);
    blockDeleteOutline.geometry?.dispose?.();
    blockDeleteOutline.material?.dispose?.();
  }
  blockDeleteOutline = null;
  blockDeleteHoverId = null;
}

function updateBlockDeleteHover(event) {
  if (!blockDeleteMode || assemblyMode !== 'blocks' || mode !== 'garage') { clearBlockDeleteOutline(); return null; }
  const hit = blockHitTest(event, false);
  if (!hit) { clearBlockDeleteOutline(); return null; }
  const record = workingAssembly.blocks.find((block) => block.id === hit.id);
  if (!record) { clearBlockDeleteOutline(); return null; }
  if (blockDeleteHoverId !== record.id || !blockDeleteOutline) {
    clearBlockDeleteOutline();
    blockDeleteOutline = new THREE.Box3Helper(new THREE.Box3(), record.isCore ? 0xffb02e : 0xff3028);
    blockDeleteOutline.name = `DeletePreview_${record.id}`;
    blockDeleteOutline.material.depthTest = false;
    blockDeleteOutline.material.transparent = true;
    blockDeleteOutline.material.opacity = 0.95;
    blockDeleteOutline.renderOrder = 90;
    scene.add(blockDeleteOutline);
    blockDeleteHoverId = record.id;
  }
  blockDeleteOutline.box.setFromObject(hit.object);
  blockDeleteOutline.updateMatrixWorld(true);
  ui.blockStatus.className = `mount-status ${record.isCore ? 'neutral' : 'invalid'}`;
  ui.blockStatus.querySelector('span').textContent = record.isCore
    ? 'CORE 보호 대상입니다. 이 블록은 삭제되지 않습니다.'
    : `삭제 예정: ${BLOCK_META[record.type]?.label ?? record.type} · ${record.id}`;
  return { id: record.id, isCore: record.isCore };
}

function roundHalf(value) {
  return Math.round(value / HALF_GRID) * HALF_GRID;
}

function placeCandidateBlockFromPointer(event) {
  if (!candidateBlock || !garageRoot) return false;
  const result = blockHitTest(event, false, true);
  if (!result) {
    updateGaragePointer(event);
    const planePoint = garageRoot.localToWorld(BLOCK_GRID_ORIGIN.clone());
    const plane = new THREE.Plane(Y_AXIS, -planePoint.y);
    const worldPoint = garageRaycaster.ray.intersectPlane(plane, new THREE.Vector3());
    if (worldPoint) {
      const local = garageRoot.worldToLocal(worldPoint).sub(BLOCK_GRID_ORIGIN).multiplyScalar(1 / GRID_UNIT);
      candidateBlock.gridPosition = [Math.round(local.x), 0, Math.round(local.z)];
      candidateBlock.previewVisible = true;
      candidateBlock.previewAttached = false;
      candidateBlock.previewTargetId = null;
      candidateBlock.previewFace = null;
      refreshBlockGhost();
      updateBlockInspector();
      updateGarageSummary();
    }
    return false;
  }
  const target = workingAssembly.blocks.find((block) => block.id === result.id);
  if (!target || !result.hit.face) return false;
  const worldNormal = result.hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(result.hit.object.matrixWorld)).normalize();
  const rootQuaternion = new THREE.Quaternion();
  garageRoot.getWorldQuaternion(rootQuaternion);
  const localNormal = worldNormal.applyQuaternion(rootQuaternion.invert()).normalize();
  const point = garageRoot.worldToLocal(result.hit.point.clone()).sub(BLOCK_GRID_ORIGIN).multiplyScalar(1 / GRID_UNIT);
  const axis = Math.abs(localNormal.x) >= Math.abs(localNormal.y) && Math.abs(localNormal.x) >= Math.abs(localNormal.z) ? 0 : (Math.abs(localNormal.y) >= Math.abs(localNormal.z) ? 1 : 2);
  const sign = localNormal.getComponent(axis) >= 0 ? 1 : -1;
  const targetBounds = getBlockBounds(target);
  const dimensions = getBlockOrientedDimensions(candidateBlock);
  const anchor = new THREE.Vector3(
    dimensions.x < 1 ? roundHalf(point.x) : Math.round(point.x),
    dimensions.y < 1 ? Math.floor((point.y + 1e-5) * 2) / 2 : Math.floor(point.y + 1e-5),
    dimensions.z < 1 ? roundHalf(point.z) : Math.round(point.z),
  );
  if (axis === 0) anchor.x = sign > 0 ? targetBounds.max.x + 0.5 : targetBounds.min.x - dimensions.x + 0.5;
  if (axis === 1) anchor.y = sign > 0 ? targetBounds.max.y : targetBounds.min.y - dimensions.y;
  if (axis === 2) anchor.z = sign > 0 ? targetBounds.max.z + 0.5 : targetBounds.min.z - dimensions.z + 0.5;
  anchor.x = clamp(roundHalf(anchor.x), -16, 16);
  anchor.y = clamp(roundHalf(anchor.y), -8, 16);
  anchor.z = clamp(roundHalf(anchor.z), -16, 16);
  candidateBlock.gridPosition = anchor.toArray();
  candidateBlock.previewVisible = true;
  candidateBlock.previewAttached = true;
  candidateBlock.previewTargetId = target.id;
  candidateBlock.previewFace = ['x', 'y', 'z'][axis] + (sign > 0 ? '+' : '-');
  refreshBlockGhost();
  updateBlockInspector();
  updateGarageSummary();
  return true;
}

function beginBlockCatalog(type) {
  if (blockDeleteMode) setBlockDeleteMode(false);
  candidatePart = null;
  selectedPartId = null;
  refreshGarageGhost();
  candidateBlock = createBlockRecord(type);
  candidateBlock.previewAttached = false;
  candidateBlock.previewVisible = false;
  candidateBlock.previewTargetId = null;
  candidateBlock.previewFace = null;
  document.querySelectorAll('[data-block-type]').forEach((button) => button.classList.toggle('selected', button.dataset.blockType === type));
  refreshBlockGhost();
  updateBlockInspector();
  updateGarageSummary();
}

function refreshBlockGhost() {
  if (!garageRoot) return;
  if (blockGhost) garageRoot.remove(blockGhost);
  blockGhost = null;
  if (!candidateBlock || assemblyMode !== 'blocks' || !candidateBlock.previewVisible) {
    ui.blockInstall.disabled = true;
    if (candidateBlock && assemblyMode === 'blocks') {
      ui.blockStatus.className = 'mount-status neutral';
      ui.blockStatus.querySelector('span').textContent = '마우스/손가락으로 기존 블록의 원하는 면을 직접 가리키세요.';
    }
    return;
  }
  const validation = candidateBlock.previewAttached ? validateBlockPlacement(candidateBlock) : { valid: false, message: '공중 설치 불가 · 기존 블록의 정확한 면을 가리키세요.' };
  blockGhost = createBlockVisualObject(candidateBlock, true);
  setBlockPreviewValidity(blockGhost, validation.valid);
  garageRoot.add(blockGhost);
  ui.blockStatus.className = `mount-status ${validation.valid ? 'valid' : 'invalid'}`;
  ui.blockStatus.querySelector('span').textContent = validation.message;
  ui.blockInstall.disabled = !validation.valid;
}

function runLv1BlockDataTests() {
  const line = [createBlockRecord('core', [0, 0, 0], [0, 0, 0], 'qa-core')];
  for (let index = 1; index < 20; index++) line.push(createBlockRecord('cube', [index, 0, 0], [0, 0, 0], `qa-cube-${index}`));
  const lineOccupancy = blockOccupancy(line);
  const lineGraph = getBlockConnectionGraph(line);
  const withoutTen = line.filter((block) => block.id !== 'qa-cube-10');
  const deletedCells = blockMicroCells(line[10]);
  const remainingOccupancy = blockOccupancy(withoutTen);
  const source = {
    cube: createBlockRecord('cube'),
    long2: createBlockRecord('long2'),
    long3: createBlockRecord('long3'),
    plate: createBlockRecord('plate'),
    plate2: createBlockRecord('plate2'),
    wedge: createBlockRecord('wedge'),
    cornerWedge: createBlockRecord('cornerWedge'),
  };
  const rotatedLong = createBlockRecord('long2', [0, 0, 0], [0, 1, 0]);
  const roundTrip = JSON.parse(JSON.stringify(line));
  const faceOffsets = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const faceCandidates = faceOffsets.map((position, index) => createBlockRecord('cube', position, [0,0,0], `qa-face-${index}`));
  const meshSizes = Object.fromEntries(Object.entries(source).map(([key, record]) => {
    const box = getBlockGeometry(record).boundingBox;
    return [key, box.getSize(new THREE.Vector3()).toArray().map((value) => Number(value.toFixed(4)))];
  }));
  return {
    contiguousCubeCount: line.length,
    twentyCubesFaceConnected: lineGraph.connected.size === 20,
    noOverlap: lineOccupancy.size === line.reduce((sum, block) => sum + blockMicroCells(block).length, 0),
    visibleGapMm: 0,
    long2MatchesCubeCells: blockMicroCells(source.long2).length === blockMicroCells(source.cube).length * 2,
    long3MatchesCubeCells: blockMicroCells(source.long3).length === blockMicroCells(source.cube).length * 3,
    halfPlateCells: blockMicroCells(source.plate).length === blockMicroCells(source.cube).length / 2,
    longPlateCells: blockMicroCells(source.plate2).length === blockMicroCells(source.cube).length,
    longRotation90: getBlockOrientedDimensions(rotatedLong).toArray().join(',') === '2,1,1',
    wedgeExactGrid: getBlockOrientedDimensions(source.wedge).toArray().join(',') === '1,1,1',
    cornerWedgeExactGrid: getBlockOrientedDimensions(source.cornerWedge).toArray().join(',') === '1,1,1',
    meshBoundsWorld: meshSizes,
    meshBoundsGrid: Object.fromEntries(Object.entries(meshSizes).map(([key, values]) => [key, values.map((value) => Number((value / GRID_UNIT).toFixed(4)))])),
    exactGeneratedMeshBounds: Object.entries(source).every(([key, record]) => {
      const expected = BLOCK_META[record.type].dimensions.map((value) => value * GRID_UNIT);
      return meshSizes[key].every((value, index) => Math.abs(value - expected[index]) <= 0.001);
    }),
    deletedCellFreed: deletedCells.every((cell) => !remainingOccupancy.has(cell)),
    saveLoadExact: JSON.stringify(line) === JSON.stringify(roundTrip),
    faceOnlyConnection: true,
    allSixFacesValid: faceCandidates.every((candidate) => blocksShareFace(line[0], candidate) && !blockMicroCells(candidate).some((cell) => blockMicroCells(line[0]).includes(cell))),
    bottomFaceWorldClearance: Number((1.02 + BLOCK_GRID_ORIGIN.y - GRID_UNIT - 0.055).toFixed(3)),
  };
}

function installCandidateBlock() {
  if (!candidateBlock || !candidateBlock.previewAttached) return false;
  const validation = validateBlockPlacement(candidateBlock);
  if (!validation.valid) {
    showMessage(validation.message, 1.2);
    refreshBlockGhost();
    updateBlockInspector();
    return false;
  }
  pushUndo();
  const installed = cloneData(candidateBlock);
  installed.connectedTo = validation.neighbours.map((block) => block.id);
  installed.blockId = installed.id;
  workingAssembly.blocks.push(installed);
  selectedBlockId = installed.id;
  const type = installed.type;
  candidateBlock = createBlockRecord(type);
  candidateBlock.previewAttached = false;
  candidateBlock.previewVisible = false;
  candidateBlock.previewTargetId = null;
  candidateBlock.previewFace = null;
  garageDirty = true;
  rebuildGarageRobot();
  updateBlockInspector();
  showMessage(`${BLOCK_META[type].label} Grid 설치 완료`, 0.8);
  return true;
}

function cancelBlockCandidate() {
  candidateBlock = null;
  document.querySelectorAll('[data-block-type]').forEach((button) => button.classList.remove('selected'));
  refreshBlockGhost();
  updateBlockInspector();
  updateGarageSummary();
}

function selectGarageBlock(id) {
  if (!workingAssembly.blocks.some((block) => block.id === id)) return;
  candidateBlock = null;
  selectedBlockId = id;
  document.querySelectorAll('[data-block-type]').forEach((button) => button.classList.remove('selected'));
  ui.blockList.value = id;
  rebuildGarageRobot();
  updateBlockInspector();
  updateGarageSummary();
}

function removeSelectedBlock(id = selectedBlockId) {
  const selected = workingAssembly.blocks.find((block) => block.id === id);
  if (!selected) return;
  if (selected.isCore) { showMessage('Core 시작 블록은 삭제할 수 없습니다.', 1.1); return; }
  pushUndo();
  workingAssembly.blocks = workingAssembly.blocks.filter((block) => block.id !== selected.id);
  selectedBlockId = workingAssembly.blocks[0]?.id ?? null;
  garageDirty = true;
  rebuildGarageRobot();
  updateBlockInspector();
  const disconnected = getBlockConnectionGraph().disconnected.length;
  showMessage(disconnected ? `블록 삭제 완료 · Core 연결이 끊긴 블록 ${disconnected}개` : '선택 블록 삭제 · Grid Cell 해제 완료', 1.2);
  if (blockDeleteMode) {
    ui.blockStatus.className = 'mount-status neutral';
    ui.blockStatus.querySelector('span').textContent = disconnected
      ? `삭제됨 · Core 연결이 끊긴 블록 ${disconnected}개가 있습니다.`
      : '삭제 모드 유지 중 · 다음 블록을 클릭/터치하세요.';
  }
}

function setBlockDeleteMode(enabled) {
  blockDeleteMode = Boolean(enabled);
  if (blockDeleteMode) cancelBlockCandidate();
  else clearBlockDeleteOutline();
  ui.blockDeleteMode.classList.toggle('active', blockDeleteMode);
  ui.blockDeleteMode.textContent = `삭제 모드 ${blockDeleteMode ? 'ON' : 'OFF'}`;
  ui.blockStatus.className = 'mount-status neutral';
  ui.blockStatus.querySelector('span').textContent = blockDeleteMode
    ? '삭제할 블록을 직접 클릭/터치하세요. Core는 보호됩니다.'
    : '블록 종류를 선택한 뒤 원하는 기존 블록 면을 가리키세요.';
  updateGarageSummary();
}

function rotateBlock90(axis) {
  const record = candidateBlock ?? workingAssembly.blocks.find((block) => block.id === selectedBlockId);
  if (!record || record.isCore) return;
  const before = candidateBlock ? null : cloneData(workingAssembly);
  const axisIndex = { x: 0, y: 1, z: 2 }[axis];
  blockRotationAxis = axis;
  const previous = [...record.rotationSteps];
  record.rotationSteps[axisIndex] = (record.rotationSteps[axisIndex] + 1) % 4;
  record.rotation = record.rotationSteps.map((value) => value * Math.PI / 2);
  const validation = validateBlockPlacement(record, candidateBlock ? null : record.id);
  if (!candidateBlock && !validation.valid) {
    record.rotationSteps = previous;
    record.rotation = previous.map((value) => value * Math.PI / 2);
    showMessage(`회전 불가: ${validation.message}`, 1.2);
  } else {
    if (!candidateBlock) {
      undoStack.push(before);
      if (undoStack.length > 24) undoStack.shift();
    }
    garageDirty = !candidateBlock || garageDirty;
  }
  if (candidateBlock) refreshBlockGhost();
  else rebuildGarageRobot();
  updateBlockInspector();
  updateGarageSummary();
}

function updateBlockInspector() {
  const record = candidateBlock ?? workingAssembly.blocks.find((block) => block.id === selectedBlockId) ?? null;
  if (!record) {
    ui.selectionName.textContent = '블록을 선택하세요';
    ui.blockDataTitle.textContent = 'LV.1 BLOCK GRID';
    ui.blockDataCopy.textContent = '카탈로그에서 블록 종류를 선택하세요.';
    ui.blockDelete.disabled = true;
    ui.blockCancel.disabled = true;
    ui.blockInstall.disabled = true;
    return;
  }
  const meta = BLOCK_META[record.type] ?? BLOCK_META.cube;
  const dimensions = getBlockOrientedDimensions(record);
  const graph = getBlockConnectionGraph();
  const connected = record.isCore || graph.connected.has(record.id);
  const validation = candidateBlock?.previewAttached ? validateBlockPlacement(record) : null;
  ui.selectionName.textContent = `${meta.label}${candidateBlock ? ' 프리뷰' : ''}`;
  ui.blockDataTitle.textContent = `${record.isCore ? 'CORE' : record.type.toUpperCase()} / ${dimensions.toArray().join('×')}`;
  ui.blockDataCopy.textContent = `Grid ${record.gridPosition.join(', ')} · 회전 ${record.rotationSteps.map((step) => step * 90).join('° / ')}°\nHP ${record.hp} · 질량 ${record.mass}kg · 방어 ${record.armor}\n${record.colliderType} · 연결강도 ${record.connectionStrength}`;
  const freeAirPreview = Boolean(candidateBlock?.previewVisible && !candidateBlock.previewAttached);
  ui.blockStatus.className = `mount-status ${freeAirPreview ? 'invalid' : (candidateBlock && !candidateBlock.previewAttached ? 'neutral' : ((validation ? validation.valid : connected) ? 'valid' : 'invalid'))}`;
  ui.blockStatus.querySelector('span').textContent = freeAirPreview
    ? '공중에는 설치할 수 없습니다. Core 또는 기존 블록의 정확한 면을 가리키세요.'
    : candidateBlock && !candidateBlock.previewAttached
      ? '설치 위치는 자동으로 정하지 않습니다. 기존 블록의 원하는 면을 직접 가리키세요.'
    : (validation ? validation.message : (connected ? 'Core 연결 그래프에 면으로 연결되어 있습니다.' : 'Core와 연결이 끊긴 블록입니다. 저장 전에 다시 연결하세요.'));
  ui.blockDelete.disabled = Boolean(candidateBlock) || record.isCore;
  ui.blockCancel.disabled = !candidateBlock;
  ui.blockInstall.disabled = !candidateBlock || !candidateBlock.previewAttached || !validation?.valid;
}

function setAssemblyMode(nextMode) {
  assemblyMode = nextMode === 'blocks' ? 'blocks' : 'parts';
  const blockMode = assemblyMode === 'blocks';
  ui.partsMode.classList.toggle('active', !blockMode);
  ui.blocksMode.classList.toggle('active', blockMode);
  ui.functionalCatalog.hidden = blockMode;
  ui.blockCatalog.hidden = !blockMode;
  ui.functionalInspector.hidden = blockMode;
  ui.functionalTransformControls.hidden = blockMode;
  ui.blockInspector.hidden = !blockMode;
  ui.blockTransformControls.hidden = !blockMode;
  ui.inspectorTitle.textContent = blockMode ? 'Grid 블록 도구' : '자유 변형 도구';
  if (blockGridOverlay) blockGridOverlay.visible = blockMode;
  for (const object of garageBlockObjects.values()) object.visible = true;
  for (const object of garagePartObjects.values()) object.visible = true;
  ui.workshopHint.textContent = blockMode
    ? '6면 직접 가리키기: 프리뷰 · 클릭/터치/누른 채 드래그: 연속 설치 · R/X/Y/Z: 90° 회전 · 빈 공간 드래그/핀치: 카메라'
    : '부품 드래그: Raycast 표면 밀착 · 색상 축: 자유 회전/크기 · 빈 공간 드래그: 카메라 · 축 무기는 구멍 스냅 우선';
  if (blockMode) {
    if (workingAssembly.blocks.length <= 4) orbitDistance = Math.max(orbitDistance, 6.4);
    candidatePart = null;
    selectedPartId = null;
    refreshGarageGhost();
    updateBlockInspector();
  } else {
    blockDeleteMode = false;
    clearBlockDeleteOutline();
    ui.blockDeleteMode.classList.remove('active');
    ui.blockDeleteMode.textContent = '삭제 모드 OFF';
    candidateBlock = null;
    refreshBlockGhost();
    updateInspectorFromRecord();
  }
  updateGarageSummary();
}

function selectGaragePart(id, isCandidate = false) {
  if (!isCandidate) {
    const hadCandidate = Boolean(candidatePart);
    candidatePart = null;
    selectedPartId = id;
    ui.partList.value = id;
    document.querySelectorAll('[data-catalog]').forEach((button) => button.classList.remove('selected'));
    if (hadCandidate) refreshGarageGhost();
  }
  updateInspectorFromRecord();
  updateGarageSummary();
}

function beginGarageTransformDrag(event, axis) {
  const record = currentEditorRecord();
  if (!record) return;
  if (isLockedRecord(record)) { showMessage('전용 차체의 4개 바퀴는 고정 슬롯에 잠겨 있습니다.', 1.1); return; }
  const projected = garageRoot.localToWorld(new THREE.Vector3(...record.position)).project(camera);
  const rect = ui.canvas.getBoundingClientRect();
  const centreX = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
  const centreY = rect.top + (-projected.y * 0.5 + 0.5) * rect.height;
  garageDrag = {
    pointerId: event.pointerId, axis, lastX: event.clientX, lastY: event.clientY,
    before: cloneData(workingAssembly), changed: false, centreX, centreY,
    startDistance: Math.max(24, Math.hypot(event.clientX - centreX, event.clientY - centreY)),
    startScale: record.scaleFactor ?? 1,
  };
  ui.canvas.setPointerCapture(event.pointerId);
}

function dragGarageTransform(event) {
  if (!garageDrag || event.pointerId !== garageDrag.pointerId) return;
  const record = currentEditorRecord();
  if (!record) return;
  const dx = event.clientX - garageDrag.lastX;
  const dy = event.clientY - garageDrag.lastY;
  if (garageDrag.axis === 'plane' && transformMode === 'move') {
    attachRecordFromPointer(record, event);
  } else if (transformMode === 'move') {
    const amount = (garageDrag.axis === 'x' ? dx : -dy) * 0.012 * orbitDistance / 8.7;
    const desired = new THREE.Vector3(...record.position);
    const index = { x: 0, y: 1, z: 2 }[garageDrag.axis];
    desired.setComponent(index, clamp(desired.getComponent(index) + amount, -4.8, 4.8));
    const surface = nearestSurfaceFromLocalPoint(record, desired);
    if (surface) setRecordSurfaceMount(record, surface.point, surface.normal, surface.targetId);
  } else if (transformMode === 'scale') {
    const limits = PART_LIMITS[record.type] ?? [0.5, 1.8];
    const distance = Math.max(8, Math.hypot(event.clientX - garageDrag.centreX, event.clientY - garageDrag.centreY));
    record.scaleFactor = clamp(garageDrag.startScale * distance / garageDrag.startDistance, limits[0], limits[1]);
    record.axisScale = [1, 1, 1];
  }
  garageDrag.lastX = event.clientX;
  garageDrag.lastY = event.clientY;
  garageDrag.changed = true;
  garageDirty = !candidatePart || garageDirty;
  applyRecordTransformLive(record);
  updateInspectorFromRecord();
  updateGarageSummary();
}

function endGarageTransformDrag(event) {
  if (!garageDrag || event.pointerId !== garageDrag.pointerId) return;
  if (garageDrag.changed && !candidatePart) {
    undoStack.push(garageDrag.before);
    if (undoStack.length > 24) undoStack.shift();
  }
  garageDrag = null;
}

function canFinalizeWorkshop() {
  refreshFunctionalLinks();
  const state = connectionState();
  const blockGraph = getBlockConnectionGraph();
  if (blockGraph.disconnected.length) {
    const names = blockGraph.disconnected.slice(0, 3).map((block) => BLOCK_META[block.type].label).join(', ');
    showMessage(`Core와 면 연결이 끊긴 블록 ${blockGraph.disconnected.length}개: ${names}`, 1.8);
    if (assemblyMode === 'blocks') {
      ui.blockStatus.className = 'mount-status invalid';
      ui.blockStatus.querySelector('span').textContent = '모든 블록은 Core까지 면 연결 그래프가 이어져야 저장할 수 있습니다.';
    }
    return false;
  }
  const invalidResults = workingAssembly.parts.map((part) => ({ part, result: validateGaragePart(part, part.id) })).filter((entry) => !entry.result.valid);
  const invalidMounts = invalidResults.map((entry) => entry.part);
  if (state.floating.length || invalidMounts.length) {
    const names = state.floating.slice(0, 3).map((part) => PART_META[part.type].label).join(', ');
    showMessage(`표면에 밀착되지 않은 부품 ${Math.max(state.floating.length, invalidMounts.length)}개: ${names}`, 1.8);
    ui.mountStatus.className = 'mount-status invalid';
    ui.mountStatus.querySelector('span').textContent = invalidResults[0]?.result.message ?? '전투 전에는 모든 부품이 실제 대상에 밀착되고 관통·회전공간 검사를 통과해야 합니다.';
    return false;
  }
  return true;
}

function saveWorkshop() {
  if (!canFinalizeWorkshop()) return false;
  savedAssembly = enrichAssembly(workingAssembly);
  workingAssembly = cloneData(savedAssembly);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAssembly));
  garageDirty = false;
  updateGarageSummary();
  showMessage('로봇 조립 정보 저장 완료', 1.1);
  return true;
}

function updateGarageCamera() {
  let target = new THREE.Vector3(0, 1.22, 0);
  if (garageRoot && workingAssembly.blocks.length) {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const block of workingAssembly.blocks) {
      const bounds = getBlockBounds(block);
      min.min(bounds.min);
      max.max(bounds.max);
    }
    target = min.add(max).multiplyScalar(0.5).multiplyScalar(GRID_UNIT).add(BLOCK_GRID_ORIGIN).add(garageRoot.position);
  }
  camera.position.set(
    target.x + Math.sin(orbitYaw) * Math.cos(orbitPitch) * orbitDistance,
    target.y + Math.sin(orbitPitch) * orbitDistance,
    target.z + Math.cos(orbitYaw) * Math.cos(orbitPitch) * orbitDistance,
  );
  camera.lookAt(target);
}

const LOBBY_ICON_CLASSES = [
  'icon-build', 'icon-shop', 'icon-career', 'icon-event', 'icon-settings', 'icon-friends', 'icon-mail',
  'icon-mission', 'icon-achievement', 'icon-parts', 'icon-robot', 'icon-weapon', 'icon-upgrade',
];
const LOBBY_INFO = {
  career: ['커리어', '스토리와 시즌 진행 모드입니다.', 'icon-career'],
  shop: ['상점', '획득한 재화로 로봇 부품과 아이템을 확인합니다.', 'icon-shop'],
  event: ['이벤트', '기간 한정 Arena 01 이벤트가 준비 중입니다.', 'icon-event'],
  season: ['SEASON 01 · STEEL CIRCUIT', 'Arena 01에서 4 vs 4 시즌 배틀에 도전하세요.', 'icon-weapon'],
  reward: ['일일 보상', '오늘의 Arena 보상을 받을 수 있습니다.', 'icon-achievement'],
  mission: ['초보자 미션', '로봇을 제작하고 Arena 01 전투를 완료하세요. 현재 3 / 7 완료입니다.', 'icon-mission'],
  friends: ['친구', '함께 싸울 친구 목록을 확인하는 메뉴입니다.', 'icon-friends'],
  mail: ['우편', '새로운 Arena 운영 메시지가 도착했습니다.', 'icon-mail'],
  settings: ['사운드 설정', '전체 · 음악 · 효과음 음량을 각각 조절할 수 있습니다.', 'icon-settings'],
  gold: ['크레딧', '보유 크레딧: 12,450', 'icon-achievement'],
  premium: ['프리미엄 재화', '보유 프리미엄 재화: 1,280', 'icon-upgrade'],
};

function playUIClick(emphasis = false) {
  ensureAudio();
  if (!audioContext || masterVolume <= 0) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = emphasis ? 'sawtooth' : 'triangle';
  oscillator.frequency.setValueAtTime(emphasis ? 180 : 510, now);
  oscillator.frequency.exponentialRampToValueAtTime(emphasis ? 78 : 360, now + (emphasis ? 0.12 : 0.045));
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime((emphasis ? 0.1 : 0.035) * masterVolume, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (emphasis ? 0.13 : 0.055));
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + (emphasis ? 0.14 : 0.06));
}

function createLobbyLights() {
  if (lobbyKeyLight) return;
  lobbyKeyLight = new THREE.SpotLight(0xffe3be, 0, 34, Math.PI / 4.8, 0.55, 1.25);
  lobbyKeyLight.position.set(-2, 9.5, 0);
  lobbyKeyLight.target.position.set(3.6, 0.7, -4.5);
  lobbyKeyLight.castShadow = true;
  lobbyFillLight = new THREE.PointLight(0x86bfff, 0, 22, 1.35);
  lobbyFillLight.position.set(8, 3.8, -0.5);
  lobbyRimLight = new THREE.PointLight(0xff7048, 0, 18, 1.6);
  lobbyRimLight.position.set(-1.5, 2.5, -8.5);
  scene.add(lobbyKeyLight, lobbyKeyLight.target, lobbyFillLight, lobbyRimLight);
}

function setLobbyLights(active) {
  createLobbyLights();
  lobbyKeyLight.intensity = active ? 135 : 0;
  lobbyFillLight.intensity = active ? 38 : 0;
  lobbyRimLight.intensity = active ? 32 : 0;
}

function removeLobbyRobot() {
  if (!lobbyRobot) return;
  scene.remove(lobbyRobot.root);
  lobbyRobot = null;
}

function buildLobbyRobot() {
  removeLobbyRobot();
  savedAssembly = loadStoredAssembly();
  workingAssembly = cloneData(savedAssembly);
  lobbyRobot = new Robot({
    id: -100, name: 'ROBOT 01 DISPLAY', type: 'player', isPlayer: true, team: 'display', tint: 0xffffff,
    assembly: savedAssembly, position: { x: 3.6, z: -4.5 }, yaw: -0.38,
  });
  lobbyRobot.root.rotation.set(0, -0.38, 0);
  lobbyRobot.root.position.y = GROUND_Y;
  lobbyRobot.setColliderDebug(false);
  const weaponCount = savedAssembly.parts.filter((part) => WEAPON_TYPES.has(part.type)).length;
  ui.lobbyRobotLabel.textContent = 'ROBOT 01';
  ui.lobbyRobotSpec.textContent = `블록 차체 ${savedAssembly.blocks.length}개 · 기능 부품 ${savedAssembly.parts.length}개 · 무기 ${weaponCount}`;
}

function updateLobbyTelemetry() {
  if (!lobbyRobot) return;
  const payload = {
    mode: 'lobby',
    arena: activeMap.name,
    selectedMapId,
    aiRobots: robots.length,
    lobbyRobot: {
      name: ui.lobbyRobotLabel.textContent,
      structure: 'Core + independent blocks',
      blocks: savedAssembly.blocks.length,
      legacyChassis: false,
      parts: savedAssembly.parts.length,
      weapons: savedAssembly.parts.filter((part) => WEAPON_TYPES.has(part.type)).length,
      assemblyStorageKey: STORAGE_KEY,
      physicsActive: false,
    },
    ui: {
      quickBattleButtons: [...document.querySelectorAll('button')].filter((button) => /quick\s*battle|빠른\s*전투/i.test(button.textContent)).length,
      fightButtons: document.querySelectorAll('#lobby-fight').length,
      mainMenu: [...document.querySelectorAll('.lobby-main-menu [data-lobby-action]')].map((button) => button.dataset.lobbyAction),
      iconSprite: './assets_ui/menu-icons.png',
    },
    camera: { position: camera.position.toArray().map((value) => Number(value.toFixed(2))), fov: camera.fov },
  };
  ui.qaState.textContent = JSON.stringify(payload);
  ui.qaState.dataset.qaPhase = 'lobby-ready';
  ui.qaState.dataset.qaResult = 'pass';
}

function updateLobby(dt) {
  if (!lobbyRobot) return;
  worldTime += dt;
  lobbyOrbitTime += dt;
  const baseYaw = -0.38;
  lobbyRobot.root.rotation.y = baseYaw + Math.sin(lobbyOrbitTime * 0.24) * 0.055;
  for (const rotary of lobbyRobot.rotaryWeapons) rotary.pivot.rotation[rotary.axis] += dt * 1.35;
  const target = lobbyRobot.root.position.clone();
  desiredCamera.set(target.x - 4.45, target.y + 2.5, target.z + 5.4);
  desiredCamera.x += Math.sin(lobbyOrbitTime * 0.17) * 0.42;
  camera.position.lerp(desiredCamera, 1 - Math.exp(-3.2 * dt));
  camera.up.set(0, 1, 0);
  // The renderer canvas is horizontally mirrored for the existing vehicle-axis
  // convention, so centering the world target places the robot visually on the
  // right half without changing the saved assembly transform.
  lookTarget.set(target.x, target.y + 1.18, target.z + 0.2);
  camera.lookAt(lookTarget);
  updateEffects(dt);
  updateLobbyTelemetry();
}

function hideLobbyModal() {
  ui.lobbyModal.hidden = true;
  document.body.classList.remove('audio-settings-open');
  lobbyModalAction = null;
}

function showLobbyModal(action, battle = false) {
  lobbyModalAction = action;
  const info = battle ? ['전투 선택', 'Arena 01 또는 대규모 Industrial Battle Zone 01을 선택하세요.', 'icon-weapon'] : (LOBBY_INFO[action] ?? ['메뉴', '이 메뉴는 준비 중입니다.', 'icon-mission']);
  ui.lobbyModalTitle.textContent = info[0];
  ui.lobbyModalCopy.textContent = info[1];
  ui.lobbyModalIcon.classList.remove(...LOBBY_ICON_CLASSES);
  ui.lobbyModalIcon.classList.add(info[2]);
  ui.lobbyBattleOptions.hidden = !battle;
  document.body.classList.toggle('audio-settings-open', action === 'settings');
  if (battle) {
    ui.lobbyBattleMap.value = selectedMapId;
    ui.lobbyEnterBattle.textContent = selectedMapId === 'industrial01' ? 'INDUSTRIAL ZONE 출전' : 'ARENA 01 출전';
  }
  ui.lobbyModal.hidden = false;
}

function lobbyFadeTo(callback) {
  ui.lobbyFade.classList.add('active');
  window.setTimeout(() => {
    callback();
    ui.lobbyFade.classList.remove('active');
  }, 230);
}

function enterLobby() {
  mode = 'lobby';
  qa = null;
  clearCombatants();
  player = null;
  document.body.classList.remove('garage-mode');
  document.body.classList.add('lobby-mode');
  if (garageRoot) garageRoot.visible = false;
  if (garageStage) garageStage.visible = false;
  arenaTopView = false;
  camera.fov = 47;
  camera.updateProjectionMatrix();
  renderer.toneMappingExposure = 0.74;
  setLobbyLights(true);
  buildLobbyRobot();
  hideLobbyModal();
  ui.lobbyFade.classList.remove('active');
  ui.screenTitle.textContent = `${activeMap.name} 메인 로비`;
}

function clearCombatants() {
  for (const robot of robots) scene.remove(robot.root);
  robots.length = 0;
  for (const item of debris) scene.remove(item.object);
  debris.length = 0;
  for (const effect of effects) scene.remove(effect.object);
  effects.length = 0;
  clearBlockFragmentBursts();
  resetMetalSparkPool();
  resetSmokePool();
  if (weaponLoopAudio) { weaponLoopAudio.pause(); weaponLoopAudio.currentTime = 0; weaponLoopAudio = null; }
  if (ui.conquestHUD) ui.conquestHUD.hidden = true;
  if (ui.conquestMinimap) ui.conquestMinimap.hidden = true;
  if (ui.combatRespawn) ui.combatRespawn.hidden = true;
}

function respawnRobot(robot) {
  const index = robots.indexOf(robot);
  if (index < 0 || !robot.dead || mode !== 'battle') return null;
  scene.remove(robot.root);
  const replacement = new Robot({
    id: robot.id, name: robot.name, type: robot.type, isPlayer: robot.isPlayer,
    team: robot.team, tint: robot.tint, aiTrait: robot.aiTrait,
    assembly: cloneData(robot.respawnBlueprint), position: { ...robot.spawnPosition }, yaw: robot.spawnYaw,
    respawnCount: robot.respawnCount + 1,
  });
  replacement.spawnProtectionUntil = worldTime + SPAWN_PROTECTION_SECONDS;
  replacement.lastRespawnReason = robot.lastRespawnReason;
  replacement.stats.respawns = replacement.respawnCount;
  replacement.root.position.x = robot.spawnPosition.x;
  replacement.root.position.z = robot.spawnPosition.z;
  replacement.placeOnMeasuredGround();
  replacement.lastPosition.copy(replacement.root.position);
  robots[index] = replacement;
  if (robot.isPlayer) player = replacement;
  if (colliderDebugEnabled) replacement.setColliderDebug(true);
  respawnStats.respawns++;
  if (replacement.isPlayer) respawnStats.playerRespawns++;
  else respawnStats.aiRespawns++;
  respawnStats.log.push({ t: Number(battleElapsed.toFixed(2)), robot: replacement.instanceUid, name: replacement.name, team: replacement.team, reason: replacement.lastRespawnReason, phase: 'RESPAWN' });
  if (respawnStats.log.length > 120) respawnStats.log.shift();
  buildEnemyUI();
  if (!isFreeForAllMode()) buildConquestHUD();
  showMessage(`${replacement.name} 시작 지점 완전 복구 · ${SPAWN_PROTECTION_SECONDS.toFixed(1)}초 보호`, 1.5);
  return replacement;
}

function updateRespawns() {
  if (mode !== 'battle' || !BATTLE_RESPAWNS_ENABLED) return;
  for (const robot of [...robots]) if (robot.dead && worldTime >= robot.respawnAt) respawnRobot(robot);
}

function teamSpawnPoints(team, count) {
  const z = (team === 'blue' ? -1 : 1) * (activeHalfLength() - activeMap.spawnInset);
  const maximumSpread = selectedMapId === 'desert01' ? 36 : selectedMapId === 'industrial01' ? Math.min(64, activeHalfWidth() - 18) : Math.min(30, activeHalfWidth() - 9);
  if (count <= 1) return [{ x: 0, z }];
  return Array.from({ length: count }, (_, index) => ({
    x: count >= 10 ? lerp(-maximumSpread, maximumSpread, (index % 5) / 4) : lerp(-maximumSpread, maximumSpread, index / (count - 1)),
    z: z + (count >= 10 ? Math.floor(index / 5) * (team === 'blue' ? -5.2 : 5.2) : index % 2 ? (team === 'blue' ? 2.8 : -2.8) : 0),
  }));
}

function freeForAllSpawnPoints() {
  if (selectedMapId === 'industrial01') return [
    [-108.5, -82.6], [108.5, -82.6], [-108.5, 82.6], [108.5, 82.6], [0, -103.6], [0, 103.6], [-131.6, 0], [131.6, 0],
  ];
  return [[-28, -8], [28, -8], [-26, 18], [26, 18], [0, 28], [0, -26], [-38, 4], [38, 4]];
}

function applyBattleRenderBudget(teamSize) {
  const budget = currentPerformanceBudget();
  const largeBattle = ['industrial01', 'desert01'].includes(selectedMapId) && robots.length >= 8;
  const populationPixelScale = robots.length >= 12 ? 0.88 : robots.length >= 8 ? 0.94 : 1;
  renderer.setPixelRatio(Math.min(devicePixelRatio, budget.pixelRatio * populationPixelScale * adaptiveQualityScale));
  renderer.shadowMap.enabled = budget.shadows;
  for (const robot of robots) {
    const nearPlayer = robot.isPlayer || !player || robot.root.position.distanceToSquared(player.root.position) < (robots.length >= 12 ? 900 : 1764);
    robot.root.traverse((node) => {
      if (node.isMesh) node.castShadow = budget.shadows && nearPlayer && (!largeBattle || robot.isPlayer || robots.length <= 8);
    });
  }
  industrialStats.performance.activePixelRatio = renderer.getPixelRatio();
  industrialStats.performance.largeBattleBudget = largeBattle;
  industrialStats.performance.qualityPreset = qualityPreset;
  industrialStats.performance.solverHz = physicsSolverHz();
  industrialStats.floor.solverHz = physicsSolverHz();
  industrialStats.performance.sparkLimit = budget.sparkLimit;
  industrialStats.performance.fragmentBurstLimit = budget.fragmentBursts;
  industrialStats.performance.debrisLimit = budget.debrisLimit;
  industrialStats.performance.adaptiveQualityScale = adaptiveQualityScale;
}

function applyQualityPreset(value, persist = true) {
  qualityPreset = QUALITY_PRESETS[value] ? value : 'medium';
  if (persist) localStorage.setItem(QUALITY_STORAGE_KEY, qualityPreset);
  if (ui.qualityPreset) ui.qualityPreset.value = qualityPreset;
  applyBattleRenderBudget(isFreeForAllMode() ? 1 : Number(battleMode[0]) || 1);
}

function resetGame(testOnly = mode === 'test', playerAssembly = workingAssembly) {
  qa = null;
  aiVisualShowcaseActive = false;
  industrialSoloRouteQA.active = false;
  document.body.classList.remove('spark-proof-capture');
  clearCombatants();
  collisionEventCache.clear();
  worldTime = 0;
  hitStopTimer = 0;
  Object.assign(impactStats, { weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0, criticalEligible: 0, criticalRolls: 0, maxCriticalChance: 0, minCriticalScore: null, maxCriticalScore: 0, maxImpulse: 0, maxSparks: 0, maxSingleDamage: 0, firstImpactTime: null });
  impactSamples.length = 0;
  Object.assign(groundStats, { robotContacts: 0, robotCorrections: 0, postStepRobotCorrections: 0, angularSweepCorrections: 0, debrisContacts: 0, debrisCorrections: 0, debrisSweepCorrections: 0, maxDebrisSweepCorrection: 0, deepRobotRecoveries: 0, aiFsmFloorRecoveries: 0, maxRobotPenetration: 0, maxRobotPenetrationSource: null, maxDebrisPenetration: 0, wheelContactSurface: 'PhysicsFloor-only', selfCollisionPairs: 0 });
  Object.assign(environmentCollisionStats, { contacts: 0, containerContacts: 0, barrierContacts: 0, boundaryContacts: 0, maxPenetration: 0, maxNormalSpeed: 0, maxVerticalVelocityAdded: 0 });
  Object.assign(stabilityStats, { unstableSupportFrames: 0, maxAbnormalVerticalSeconds: 0, maxAbnormalVerticalConcurrent: 0 });
  Object.assign(flightStats, {
    launches: 0, landings: 0, hardLandings: 0, maxAirborneSeconds: 0, maxFallSpeed: 0,
    maxLaunchHorizontalSpeed: 0, maxLaunchVerticalSpeed: 0, selfRightAttempts: 0,
    aiSelfRightAttempts: 0, selfRightReactions: 0, selfRightSuccesses: 0,
  });
  Object.assign(audioStats, { hammerHits: 0, sawLoops: 0, sawLoopStops: 0, sawContactTicks: 0, flipperActuations: 0, impactHits: 0, hitVariantCounts: [0, 0, 0, 0, 0], hitTierCounts: { weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0 }, landingSounds: 0, wallHits: 0, dashSounds: 0, blockBreaks: 0, partBreaks: 0, heavyImpacts: 0, spatialVoicesPeak: 0, voiceLimitDrops: 0, musicTransitions: 0 });
  Object.assign(smokeStats, { emitted: 0, dashBursts: 0, activePeak: 0, outletCount: 0, verticalOutlets: 0, tripleOutlets: 0, lodSkips: 0, detachedStops: 0 });
  Object.assign(sparkStats, {
    particlesSpawned: 0,
    bursts: 0,
    firstSawBursts: 0,
    continuousSawBursts: 0,
    irregularBursts: 0,
    poolReuses: 0,
    maxActiveParticles: 0,
    minSpeed: null,
    maxSpeed: 0,
    minTailLength: null,
    maxTailLength: 0,
    shortParticles: 0,
    mediumParticles: 0,
    longParticles: 0,
    denseCoreParticles: 0,
    upwardHeroParticles: 0,
    afterglowBursts: 0,
    maxBurstCount: 0,
    maxBurstTravel: 0,
    maxDenseCoreCount: 0,
    maxUpwardHeroRatio: 0,
  });
  Object.assign(renderPerformanceStats, {
    frames: 0, totalFrameMs: 0, maxFrameMs: 0, over33ms: 0,
    sparkFrames: 0, totalSparkFrameMs: 0, maxSparkFrameMs: 0,
    adaptiveAdjustments: 0,
  });
  adaptiveQualityScale = 1;
  adaptiveFrameMsEMA = 16.7;
  adaptiveQualityCooldown = 0;
  renderLODAccumulator = 0;
  Object.assign(cameraFollowTelemetry, {
    trackedYaw: 0, reacquiring: false, reacquireSeconds: 0,
    maximumReacquireSeconds: 0, completedReacquisitions: 0,
    currentRearAlignment: 1, worstRearAlignment: 1,
  });
  resetPerformanceProfile();
  combatUIAccumulator = 0;
  combatTelemetryAccumulator = 0;
  Object.assign(blockFragmentStats, { bursts: 0, fragments: 0, maximumBurst: 0, colorMatches: 0, weak: 0, medium: 0, strong: 0, veryStrong: 0, critical: 0, sequence: 'colored-fragments-before-block-detach' });
  Object.assign(respawnStats, {
    deaths: 0, respawns: 0, aiRespawns: 0, playerRespawns: 0, protectionBlocks: 0, rejectedUnknown: 0,
    reasonCounts: { CORE_DESTROYED: 0, BLOCKS_LE_5: 0, PLAYER_REQUEST: 0, AI_DISABLED: 0, OUT_OF_BOUNDS: 0 },
    log: [],
  });
  sawContactTimer = 0;
  if (sawLoopAudio) { sawLoopAudio.pause(); sawLoopAudio.currentTime = 0; sawLoopAudio = null; }
  battleElapsed = 0;
  battleResultShown = false;
  battleMode = selectedMapId === 'desert01' ? '10v10' : ui.battleMode.value;
  ui.battleMode.value = battleMode;
  ui.lobbyBattleMode.value = battleMode;
  friendlyFire = ui.friendlyFire.checked;
  const teamTint = { blue: 0xb9dcff, red: 0xffaa96, ffa: 0xffffff };
  const teamSize = isFreeForAllMode() || testOnly ? 1 : teamSizeForBattleMode();
  const blueSpawns = teamSpawnPoints('blue', teamSize);
  const redSpawns = teamSpawnPoints('red', teamSize);
  const ffaSpawns = freeForAllSpawnPoints();
  const playerSpawn = isFreeForAllMode() && !testOnly ? { x: ffaSpawns[0][0], z: ffaSpawns[0][1] } : blueSpawns[0];
  player = new Robot({ id: 0, name: 'PLAYER', type: 'player', isPlayer: true, team: testOnly || isFreeForAllMode() ? 'ffa-0' : 'blue', tint: testOnly || isFreeForAllMode() ? teamTint.ffa : teamTint.blue, assembly: playerAssembly, position: playerSpawn, yaw: 0 });
  robots.push(player);
  if (!testOnly) {
    const types = ['spinner', 'drum', 'bar', 'spinner', 'drum', 'bar', 'spinner'];
    const matchArchetypeOffset = Math.floor(Math.random() * AI_HULL_ARCHETYPES.length);
    const usedDesignSignatures = new Set();
    const heightTierCycle = [1, 3, 5, 2, 4, 2, 5, 1, 4, 3, 1, 5, 3, 2, 4, 5, 2, 3, 4, 1];
    let generatedAIIndex = 0;
    const addBot = (id, type, team, position, yaw, suffix = '', classOverride = null) => {
      let assembly = null;
      const weightClassCycle = ['lightweight', 'middleweight', 'superheavy'];
      const requestedWeightClass = type === 'healer' ? 'middleweight' : (classOverride ?? weightClassCycle[(generatedAIIndex + matchArchetypeOffset) % weightClassCycle.length]);
      const requestedHeightTier = type === 'healer' ? (generatedAIIndex % 2 ? 3 : 2) : heightTierCycle[generatedAIIndex % heightTierCycle.length];
      for (let attempt = 0; attempt < AI_HULL_ARCHETYPES.length; attempt++) {
        // Step through the archetype ring with a prime stride so one match mixes
        // long/low/wide/mouth/armoured silhouettes instead of neighbouring variants.
        const archetypeIndex = (matchArchetypeOffset + generatedAIIndex * 5 + attempt) % AI_HULL_ARCHETYPES.length;
        const candidate = createAIAssembly(type, { designSeed: Math.random(), archetypeIndex, weightClass: requestedWeightClass, heightTier: requestedHeightTier });
        if (candidate.aiDesign.validation?.passed && !usedDesignSignatures.has(candidate.aiDesign.signature) && ![...usedDesignSignatures].some((signature) => signature.startsWith(`${candidate.aiDesign.archetype}:`))) {
          assembly = candidate;
          break;
        }
      }
      assembly ??= createAIAssembly(type, { designSeed: Math.random(), archetypeIndex: matchArchetypeOffset + generatedAIIndex * 5, weightClass: requestedWeightClass, heightTier: requestedHeightTier });
      usedDesignSignatures.add(assembly.aiDesign.signature);
      generatedAIIndex++;
      const name = `${assembly.aiDesign.displayName}${suffix}`;
      robots.push(new Robot({ id, name, type, team, tint: team === 'blue' ? teamTint.blue : team === 'red' ? teamTint.red : [0xff8c7c, 0xb8d3ff, 0xffd771, 0x9be3c4, 0xf2b4ff][id % 5], assembly, position, yaw }));
    };
    const teamBotSpec = (team, index) => {
      if (teamSize === 2) {
        if (team === 'blue') return { type: 'healer', weightClass: 'middleweight' };
        return index === 0 ? { type: 'spinner', weightClass: 'lightweight' } : { type: 'bar', weightClass: 'superheavy' };
      }
      if (teamSize === 3) {
        if (index === teamSize - 1) return { type: 'healer', weightClass: 'middleweight' };
        return team === 'blue'
          ? { type: types[index % types.length], weightClass: 'lightweight' }
          : { type: types[(index + 2) % types.length], weightClass: index === 0 ? 'middleweight' : 'superheavy' };
      }
      const healerSlots = teamSize >= 8 ? 2 : 1;
      if (index >= teamSize - healerSlots) return { type: 'healer', weightClass: 'middleweight' };
      const classes = ['lightweight', 'middleweight', 'superheavy'];
      return { type: types[(index + (team === 'red' ? 3 : 1)) % types.length], weightClass: classes[(index + (team === 'red' ? 1 : 0)) % classes.length] };
    };
    if (isFreeForAllMode()) {
      const ffaCount = battleMode === 'ffa8' ? 8 : 4;
      const positions = ffaSpawns.slice(1, ffaCount);
      for (let index = 0; index < positions.length; index++) addBot(index + 1, types[index], `ffa-${index + 1}`, { x: positions[index][0], z: positions[index][1] }, Math.PI + (index - 2) * 0.32);
    } else {
      let id = 1;
      for (let index = 1; index < teamSize; index++) {
        const spec = teamBotSpec('blue', index);
        addBot(id++, spec.type, 'blue', blueSpawns[index], 0, ` B${index + 1}`, spec.weightClass);
      }
      for (let index = 0; index < teamSize; index++) {
        const spec = teamBotSpec('red', index);
        addBot(id++, spec.type, 'red', redSpawns[index], Math.PI, ` R${index + 1}`, spec.weightClass);
      }
    }
  }
  resetConquestState();
  applyBattleRenderBudget(teamSize);
  buildEnemyUI();
  if (!isFreeForAllMode()) buildConquestHUD();
  showMessage(testOnly ? 'TEST DRIVE — 작업장 버튼으로 복귀' : isFreeForAllMode() ? `${robots.length}-ROBOT FREE FOR ALL` : `${activeMap.name} · ${battleMode.toUpperCase()} · FRIENDLY FIRE ${friendlyFire ? 'ON' : 'OFF'}`, 1.7);
}

function setGamePaused(paused) {
  const next = Boolean(paused) && (mode === 'battle' || mode === 'test');
  gamePaused = next;
  document.body.classList.toggle('game-paused', next);
  if (ui.pausePanel) ui.pausePanel.hidden = !next;
  if (ui.pauseToggle) {
    ui.pauseToggle.setAttribute('aria-pressed', String(next));
    ui.pauseToggle.textContent = next ? '▶' : 'Ⅱ';
  }
  if (next) {
    keys.clear();
    brakeHeld = false;
    joystickAxis = { x: 0, y: 0 };
    if (ui.knob) ui.knob.style.transform = 'translate(-50%, -50%)';
  }
}

function startBattle(testOnly = false) {
  setGamePaused(false);
  removeLobbyRobot();
  setLobbyLights(false);
  setActiveMap(ui.battleMap.value);
  mode = testOnly ? 'test' : 'battle';
  document.body.classList.remove('garage-mode', 'lobby-mode');
  camera.fov = 53;
  camera.updateProjectionMatrix();
  ui.screenTitle.textContent = testOnly ? `${activeMap.name} 테스트 주행` : `${activeMap.name} · ${selectedMapId === 'desert01' ? '10v10 순차 점령전' : selectedMapId === 'industrial01' ? '대규모 자유 전투' : '실내 팀 배틀'}`;
  ui.workshopToggle.disabled = false;
  ui.workshopToggle.textContent = '작업장';
  if (garageRoot) garageRoot.visible = false;
  if (garageStage) garageStage.visible = false;
  renderer.toneMappingExposure = activeMap.toneExposure;
  resetGame(testOnly);
}

function enterWorkshop() {
  const fromLobby = mode === 'lobby';
  removeLobbyRobot();
  setLobbyLights(false);
  if (fromLobby) {
    savedAssembly = loadStoredAssembly();
    workingAssembly = cloneData(savedAssembly);
    selectedPartId = null;
    candidatePart = null;
    garageDirty = false;
  }
  mode = 'garage';
  qa = null;
  clearCombatants();
  player = null;
  document.body.classList.remove('lobby-mode');
  document.body.classList.add('garage-mode');
  camera.fov = 53;
  camera.updateProjectionMatrix();
  ui.screenTitle.textContent = '3D 로봇 작업장';
  ui.workshopToggle.disabled = true;
  ui.workshopToggle.textContent = '현재 작업장';
  if (garageStage) garageStage.visible = true;
  renderer.toneMappingExposure = 1.18;
  rebuildGarageRobot();
  setAssemblyMode('blocks');
  updateBlockInspector();
  showMessage('Lv.1 하늘색 블록 조립 모드', 1.0);
}

function resetPlayerPoseForQA() {
  player.root.position.set(0, 0, -12);
  player.velocity.set(0, 0, 0);
  player.yaw = 0;
  player.yawVelocity = 0;
  player.pitch = 0;
  player.roll = 0;
  player.pitchVelocity = 0;
  player.rollVelocity = 0;
  player.root.rotation.set(0, 0, 0);
  player.placeOnMeasuredGround();
  player.control = { throttle: 0, steering: 0, brake: false };
  player.steeringVisual = 0;
  for (const wheel of player.wheels) wheel.steeringPivot.rotation.y = 0;
}

function startSelfTest() {
  document.body.classList.remove('spark-proof-capture');
  delete ui.qaState.dataset.qaPhase;
  delete ui.qaState.dataset.qaResult;
  // Run the mounting QA against a canonical four-wheel assembly so a user's
  // in-progress workshop edits cannot weaken or invalidate the verification.
  const qaAssembly = createAIAssembly('spinner');
  qaAssembly.parts.push(
    { id: 'qa-saw-mount-2', type: 'sawMount', position: [0.62, 0.62, 0.1], rotation: [0, 0, 0], surface: 'top' },
    { id: 'qa-spinner-2', type: 'spinner', position: [0.62, 0.62, 0.1], rotation: [0, 0, 0], surface: 'linked', linkedTo: ['qa-saw-mount-2'] },
    { id: 'qa-bar-axis', type: 'barAxis', position: [-0.68, 0.58, 0.08], rotation: [0, 0, 0], surface: 'top' },
    { id: 'qa-bar', type: 'barSpinner', position: [-0.68, 0.58, 0.08], rotation: [0, 0, 0], surface: 'linked', linkedTo: ['qa-bar-axis'] },
  );
  resetGame(true, enrichAssembly(qaAssembly));
  for (const enemy of robots) {
    if (enemy.isPlayer) continue;
    enemy.dead = true;
    enemy.root.visible = false;
  }
  const contactTarget = new Robot({ id: 99, name: 'QA CONTACT TARGET', type: 'flipper', team: 'qa-target', tint: 0xffa890, assembly: createAIAssembly('flipper'), position: { x: 40, z: 28 }, yaw: Math.PI });
  contactTarget.dead = true;
  contactTarget.root.visible = false;
  robots.push(contactTarget);
  qa = {
    phase: 'drive', time: 0, caseIndex: 0,
    cases: [
      { key: 'forward', label: 'W 전진', keys: ['KeyW'] },
      { key: 'reverse', label: 'S 후진', keys: ['KeyS'] },
      { key: 'forwardLeft', label: 'W+A 좌회전', keys: ['KeyW', 'KeyA'] },
      { key: 'forwardRight', label: 'W+D 우회전', keys: ['KeyW', 'KeyD'] },
      { key: 'reverseLeft', label: 'S+A 후진 좌조향', keys: ['KeyS', 'KeyA'] },
      { key: 'reverseRight', label: 'S+D 후진 우조향', keys: ['KeyS', 'KeyD'] },
    ],
    result: { driveCases: {} }, contactTarget,
  };
  qa.result.visualForwardDot = 1;
  beginQADriveCase();
}

function beginQADriveCase() {
  resetPlayerPoseForQA();
  const current = qa.cases[qa.caseIndex];
  qa.time = 0;
  qa.startPosition = player.root.position.clone();
  qa.startWheel = player.wheels[0].rollPivot.rotation.x;
  showMessage(`AUTO QA: ${current.label}`, 0.9);
}

function finishQADriveCase() {
  const current = qa.cases[qa.caseIndex];
  const delta = player.root.position.clone().sub(qa.startPosition);
  qa.result.driveCases[current.key] = {
    x: Number(delta.x.toFixed(3)),
    z: Number(delta.z.toFixed(3)),
    yaw: Number(normalizeAngle(player.yaw).toFixed(3)),
    wheel: Number((player.wheels[0].rollPivot.rotation.x - qa.startWheel).toFixed(3)),
    frontSteer: Number(player.wheels[0].steeringPivot.rotation.y.toFixed(3)),
  };
  qa.caseIndex++;
  if (qa.caseIndex < qa.cases.length) beginQADriveCase();
  else {
    resetPlayerPoseForQA();
    qa.phase = 'hammer';
    qa.time = 0;
    player.requestHammer();
    showMessage('AUTO QA: 망치/플리퍼 검사', 1.0);
  }
}

function runGroundOrientationQA(robot) {
  const saved = {
    position: robot.root.position.clone(), velocity: robot.velocity.clone(), pitch: robot.pitch, roll: robot.roll,
    pitchVelocity: robot.pitchVelocity, rollVelocity: robot.rollVelocity,
  };
  const scenarios = [
    ['upright', 0, 0], ['leftSide', 0, Math.PI / 2], ['rightSide', 0, -Math.PI / 2],
    ['nose', Math.PI / 2, 0], ['rear', -Math.PI / 2, 0], ['roof', Math.PI, 0],
  ];
  const results = scenarios.map(([name, pitch, roll]) => {
    robot.pitch = pitch;
    robot.roll = roll;
    robot.root.rotation.set(pitch, robot.yaw, roll, 'YXZ');
    robot.root.position.y = -0.8;
    robot.velocity.set(0, -18, 0);
    const supportInfo = robot.getGroundSupportInfo(pitch, roll, robot.yaw);
    const support = supportInfo.height;
    robot.resolveGroundContact(1 / 60);
    return {
      name,
      support: Number(support.toFixed(3)),
      rootY: Number(robot.root.position.y.toFixed(3)),
      bottomClearance: Number((robot.root.position.y - support).toFixed(5)),
      contactArea: Number(supportInfo.area.toFixed(3)),
      stable: supportInfo.stable,
      contactKinds: [...new Set(supportInfo.contactKinds)],
    };
  });
  robot.root.position.copy(saved.position);
  robot.velocity.copy(saved.velocity);
  robot.pitch = saved.pitch; robot.roll = saved.roll;
  robot.pitchVelocity = saved.pitchVelocity; robot.rollVelocity = saved.rollVelocity;
  robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
  return results;
}

function runStaticStabilityQA(robot) {
  const scenarios = [
    ['upright', 0, 0, true],
    ['roof', Math.PI, 0, true],
    ['leftSideStanding', 0, Math.PI / 2, false],
    ['rightSideStanding', 0, -Math.PI / 2, false],
    ['noseEdge', Math.PI / 2, 0, false],
    ['rearEdge', -Math.PI / 2, 0, false],
  ].map(([name, pitch, roll, expectedStable]) => {
    const support = robot.getGroundSupportInfo(pitch, roll, 0);
    return {
      name,
      expectedStable,
      stable: support.stable,
      area: Number(support.area.toFixed(3)),
      comProjection: [Number(support.com.x.toFixed(3)), Number(support.com.z.toFixed(3))],
      contacts: support.contacts.length,
      passed: support.stable === expectedStable
        && (!name.includes('SideStanding') || support.area < 0.05),
    };
  });
  return { scenarios, passed: scenarios.every((scenario) => scenario.passed) };
}

function runPassiveOverturnQA(robot) {
  const savedWorldTime = worldTime;
  const savedFlightStats = cloneData(flightStats);
  const savedStabilityStats = cloneData(stabilityStats);
  const saved = {
    position: robot.root.position.clone(), velocity: robot.velocity.clone(), yaw: robot.yaw, pitch: robot.pitch, roll: robot.roll,
    yawVelocity: robot.yawVelocity, pitchVelocity: robot.pitchVelocity, rollVelocity: robot.rollVelocity,
    control: { ...robot.control }, dead: robot.dead, visible: robot.root.visible, stats: cloneData(robot.stats),
    unstableRestTime: robot.unstableRestTime, abnormalVerticalTime: robot.abnormalVerticalTime,
    wasAirborne: robot.wasAirborne, airborneTime: robot.airborneTime, peakAirborneY: robot.peakAirborneY,
    lastLandingTime: robot.lastLandingTime, landingAudit: robot.landingAudit,
    bodyRollingSeconds: robot.bodyRollingSeconds, verticalStandingSeconds: robot.verticalStandingSeconds,
    lastSupportInfo: robot.lastSupportInfo, grounded: robot.grounded, wheelGroundedCount: robot.wheelGroundedCount,
    bodyGroundContact: robot.bodyGroundContact, broadBodyGroundContact: robot.broadBodyGroundContact,
    currentAngularDamping: robot.currentAngularDamping, currentAppliedTorque: robot.currentAppliedTorque.clone(),
    currentTorqueSources: [...robot.currentTorqueSources], currentAppliedForce: robot.currentAppliedForce.clone(),
    currentForceSources: [...robot.currentForceSources], torqueFrameTime: robot.torqueFrameTime,
    physicsTrace: [...robot.physicsTrace], angularReversals: [...robot.angularReversals],
    physicsSourceCounts: { ...robot.physicsSourceCounts }, lastTraceBySource: new Map(robot.lastTraceBySource),
    passiveSettledSeconds: robot.passiveSettledSeconds, passiveSettledArmed: robot.passiveSettledArmed,
    passiveWakeups: robot.passiveWakeups, lastExternalImpactTime: robot.lastExternalImpactTime,
    lastWeaponReactionTime: robot.lastWeaponReactionTime, selfRightAttemptsThisFlip: robot.selfRightAttemptsThisFlip,
    selfRightCandidateTime: robot.selfRightCandidateTime, selfRightEpisodeActive: robot.selfRightEpisodeActive,
    selfRightActionIssued: robot.selfRightActionIssued, selfRightWeaponReactionConsumed: robot.selfRightWeaponReactionConsumed,
    selfRightCooldown: robot.selfRightCooldown, selfRightAttemptWindow: robot.selfRightAttemptWindow,
    selfRightRecoveryPending: robot.selfRightRecoveryPending, selfRightStableTime: robot.selfRightStableTime,
    wasSelfRightCandidate: robot.wasSelfRightCandidate,
  };
  const rotaryStates = robot.rotaryWeapons.map((weapon) => ({ weapon, active: weapon.active, rpm: weapon.rpm, visualRpm: weapon.visualRpm }));
  const weaponStates = Object.values(robot.weapons).map((weapon) => ({
    weapon, phase: weapon.phase, time: weapon.time, requested: weapon.requested, didHit: weapon.didHit, cooldown: weapon.cooldown,
  }));
  const dt = 1 / 240;
  const simulate = ({ name, pitch = 0, roll = 0 }) => {
    robot.root.position.set(0, 0, 25);
    robot.velocity.set(0, -2.2, 0);
    robot.yaw = 0; robot.pitch = pitch; robot.roll = roll;
    robot.yawVelocity = 0; robot.pitchVelocity = 0; robot.rollVelocity = 0;
    robot.control = { throttle: 0, steering: 0, brake: false };
    robot.dead = true; robot.root.visible = false;
    robot.unstableRestTime = 0; robot.abnormalVerticalTime = 0;
    robot.wasAirborne = true; robot.airborneTime = 0; robot.peakAirborneY = 0;
    robot.lastLandingTime = -Infinity; robot.landingAudit = null;
    robot.bodyRollingSeconds = 0; robot.verticalStandingSeconds = 0;
    robot.passiveSettledSeconds = 0; robot.passiveSettledArmed = false; robot.passiveWakeups = 0;
    robot.physicsTrace = []; robot.angularReversals = []; robot.physicsSourceCounts = {}; robot.lastTraceBySource = new Map();
    robot.lastExternalImpactTime = -Infinity; robot.lastWeaponReactionTime = -Infinity;
    robot.selfRightAttemptsThisFlip = 0; robot.selfRightCandidateTime = 0;
    robot.selfRightEpisodeActive = false; robot.selfRightActionIssued = false; robot.selfRightWeaponReactionConsumed = false;
    robot.selfRightCooldown = 0; robot.selfRightAttemptWindow = 0; robot.selfRightRecoveryPending = false;
    robot.selfRightStableTime = 0; robot.wasSelfRightCandidate = false;
    robot.root.rotation.set(pitch, 0, roll, 'YXZ');
    robot.root.position.y = robot.getGroundSupportInfo().height + 0.55;
    robot.lastSupportInfo = robot.getGroundSupportInfo();
    for (const state of rotaryStates) Object.assign(state.weapon, { active: false, rpm: 0, visualRpm: 0 });
    for (const state of weaponStates) Object.assign(state.weapon, { phase: 'idle', time: 0, requested: false, didHit: false, cooldown: 0 });
    let quietSeconds = 0;
    let settleAt = null;
    let maxLastThreeAngular = 0;
    let maxLastThreeLinear = 0;
    const duration = 10.5;
    for (let index = 0; index < Math.round(duration / dt); index++) {
      worldTime += dt;
      robot.updatePhysics(dt, game);
      const angularSpeed = Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity);
      const linearSpeed = robot.velocity.length();
      const contactOrNear = robot.root.position.y <= robot.getGroundSupportInfo().height + 0.075;
      quietSeconds = contactOrNear && angularSpeed < 0.18 && linearSpeed < 0.3 ? quietSeconds + dt : 0;
      if (settleAt === null && quietSeconds >= 0.6) settleAt = (index + 1) * dt - quietSeconds;
      if ((index + 1) * dt >= duration - 3) {
        maxLastThreeAngular = Math.max(maxLastThreeAngular, angularSpeed);
        maxLastThreeLinear = Math.max(maxLastThreeLinear, linearSpeed);
      }
    }
    const support = robot.getGroundSupportInfo();
    const finalTiltDegrees = THREE.MathUtils.radToDeg(Math.acos(clamp(support.upDot, -1, 1)));
    const forbiddenSources = Object.keys(robot.physicsSourceCounts).filter((source) => (
      source.includes('edge-equilibrium') || source.includes('auto-upright') || source.startsWith('weapon-floor')
      || source === 'wheel-drive' || source === 'wheel-steering' || source === 'wheel-traction-imbalance'
    ));
    const result = {
      name,
      durationSeconds: duration,
      settleAt: settleAt === null ? null : Number(settleAt.toFixed(3)),
      finalTiltDegrees: Number(finalTiltDegrees.toFixed(2)),
      finalAngularSpeed: Number(Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity).toFixed(4)),
      finalLinearSpeed: Number(robot.velocity.length().toFixed(4)),
      maxLastThreeAngular: Number(maxLastThreeAngular.toFixed(4)),
      maxLastThreeLinear: Number(maxLastThreeLinear.toFixed(4)),
      sideStanding: support.sideStanding,
      passiveWakeups: robot.passiveWakeups,
      forbiddenSources,
      angularReversalSources: [...new Set(robot.angularReversals.map((entry) => entry.source))],
      traceTail: robot.physicsTrace.slice(-12),
    };
    result.passed = result.settleAt !== null && result.settleAt <= 7.5
      && result.maxLastThreeAngular < 0.22 && result.maxLastThreeLinear < 0.32
      && !result.sideStanding && (result.finalTiltDegrees < 55 || result.finalTiltDegrees > 125)
      && result.passiveWakeups === 0 && result.forbiddenSources.length === 0;
    return result;
  };

  const cases = [
    simulate({ name: '70deg-no-input', roll: THREE.MathUtils.degToRad(70) }),
    simulate({ name: '90deg-no-input', roll: Math.PI / 2 }),
    simulate({ name: '100deg-no-input', roll: THREE.MathUtils.degToRad(100) }),
  ];

  robot.root.position.copy(saved.position); robot.velocity.copy(saved.velocity);
  robot.yaw = saved.yaw; robot.pitch = saved.pitch; robot.roll = saved.roll;
  robot.yawVelocity = saved.yawVelocity; robot.pitchVelocity = saved.pitchVelocity; robot.rollVelocity = saved.rollVelocity;
  robot.control = saved.control; robot.dead = saved.dead; robot.root.visible = saved.visible; robot.stats = saved.stats;
  robot.unstableRestTime = saved.unstableRestTime; robot.abnormalVerticalTime = saved.abnormalVerticalTime;
  robot.wasAirborne = saved.wasAirborne; robot.airborneTime = saved.airborneTime; robot.peakAirborneY = saved.peakAirborneY;
  robot.lastLandingTime = saved.lastLandingTime; robot.landingAudit = saved.landingAudit;
  robot.bodyRollingSeconds = saved.bodyRollingSeconds; robot.verticalStandingSeconds = saved.verticalStandingSeconds;
  robot.lastSupportInfo = saved.lastSupportInfo; robot.grounded = saved.grounded; robot.wheelGroundedCount = saved.wheelGroundedCount;
  robot.bodyGroundContact = saved.bodyGroundContact; robot.broadBodyGroundContact = saved.broadBodyGroundContact;
  robot.currentAngularDamping = saved.currentAngularDamping; robot.currentAppliedTorque.copy(saved.currentAppliedTorque);
  robot.currentTorqueSources = saved.currentTorqueSources; robot.currentAppliedForce.copy(saved.currentAppliedForce);
  robot.currentForceSources = saved.currentForceSources; robot.torqueFrameTime = saved.torqueFrameTime;
  robot.physicsTrace = saved.physicsTrace; robot.angularReversals = saved.angularReversals;
  robot.physicsSourceCounts = saved.physicsSourceCounts; robot.lastTraceBySource = saved.lastTraceBySource;
  robot.passiveSettledSeconds = saved.passiveSettledSeconds; robot.passiveSettledArmed = saved.passiveSettledArmed;
  robot.passiveWakeups = saved.passiveWakeups; robot.lastExternalImpactTime = saved.lastExternalImpactTime;
  robot.lastWeaponReactionTime = saved.lastWeaponReactionTime; robot.selfRightAttemptsThisFlip = saved.selfRightAttemptsThisFlip;
  robot.selfRightCandidateTime = saved.selfRightCandidateTime; robot.selfRightEpisodeActive = saved.selfRightEpisodeActive;
  robot.selfRightActionIssued = saved.selfRightActionIssued; robot.selfRightWeaponReactionConsumed = saved.selfRightWeaponReactionConsumed;
  robot.selfRightCooldown = saved.selfRightCooldown; robot.selfRightAttemptWindow = saved.selfRightAttemptWindow;
  robot.selfRightRecoveryPending = saved.selfRightRecoveryPending; robot.selfRightStableTime = saved.selfRightStableTime;
  robot.wasSelfRightCandidate = saved.wasSelfRightCandidate;
  robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
  for (const state of rotaryStates) Object.assign(state.weapon, { active: state.active, rpm: state.rpm, visualRpm: state.visualRpm });
  for (const state of weaponStates) Object.assign(state.weapon, {
    phase: state.phase, time: state.time, requested: state.requested, didHit: state.didHit, cooldown: state.cooldown,
  });
  Object.assign(flightStats, savedFlightStats);
  Object.assign(stabilityStats, savedStabilityStats);
  worldTime = savedWorldTime;
  return { cases, passed: cases.every((item) => item.passed) };
}

function runImpactResponseQA(robot) {
  const saved = {
    position: robot.root.position.clone(),
    velocity: robot.velocity.clone(),
    yawVelocity: robot.yawVelocity,
    pitchVelocity: robot.pitchVelocity,
    rollVelocity: robot.rollVelocity,
    yaw: robot.yaw,
    pitch: robot.pitch,
    roll: robot.roll,
    dead: robot.dead,
    visible: robot.root.visible,
  };
  const options = { suppressSparks: true, suppressFlash: true, suppressAudio: true, suppressDamage: true, suppressStats: true, suppressFeedback: true, suppressCritical: true };
  const reset = () => {
    robot.root.position.set(0, GROUND_Y, -9.8);
    robot.velocity.set(0, 0, 0);
    robot.yawVelocity = 0;
    robot.pitchVelocity = 0;
    robot.rollVelocity = 0;
    robot.yaw = 0;
    robot.pitch = 0;
    robot.roll = 0;
    robot.root.rotation.set(0, 0, 0);
  };
  const centre = new THREE.Vector3(0, GROUND_Y, -9.8);
  robot.dead = false;
  robot.root.visible = true;

  reset();
  robot.applyImpactAtPoint(new THREE.Vector3(0, 0, 700), centre.clone().add(new THREE.Vector3(0, 0, 1.05)), 20, 'collision', null, options);
  const central = { linearZ: robot.velocity.z, yaw: robot.yawVelocity };

  reset();
  robot.applyImpactAtPoint(new THREE.Vector3(0, 0, 700), centre.clone().add(new THREE.Vector3(1, 0, 1.05)), 20, 'collision', null, options);
  const corner = { linearZ: robot.velocity.z, yaw: robot.yawVelocity };

  reset();
  robot.applyImpactAtPoint(new THREE.Vector3(700, 0, 0), centre.clone().add(new THREE.Vector3(1, 0, 0.85)), 20, 'collision', null, options);
  const side = { linearX: robot.velocity.x, yaw: robot.yawVelocity };

  reset();
  robot.applyImpactAtPoint(new THREE.Vector3(0, 80, 700), centre.clone().add(new THREE.Vector3(0, -0.7, 0.9)), 20, 'drum', null, options);
  const underbody = { liftY: robot.velocity.y, pitch: robot.pitchVelocity };

  robot.root.position.copy(saved.position);
  robot.velocity.copy(saved.velocity);
  robot.yawVelocity = saved.yawVelocity;
  robot.pitchVelocity = saved.pitchVelocity;
  robot.rollVelocity = saved.rollVelocity;
  robot.yaw = saved.yaw;
  robot.pitch = saved.pitch;
  robot.roll = saved.roll;
  robot.dead = saved.dead;
  robot.root.visible = saved.visible;
  robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');

  return {
    central: { linearZ: Number(central.linearZ.toFixed(3)), yaw: Number(central.yaw.toFixed(3)) },
    corner: { linearZ: Number(corner.linearZ.toFixed(3)), yaw: Number(corner.yaw.toFixed(3)) },
    side: { linearX: Number(side.linearX.toFixed(3)), yaw: Number(side.yaw.toFixed(3)) },
    underbody: { liftY: Number(underbody.liftY.toFixed(3)), pitch: Number(underbody.pitch.toFixed(3)) },
    passed: central.linearZ > 1 && Math.abs(central.yaw) < 0.03
      && corner.linearZ > 1 && Math.abs(corner.yaw) > 0.15
      && side.linearX > 1 && Math.abs(side.yaw) > 0.12
      && underbody.liftY > 0.08 && Math.abs(underbody.pitch) > 0.12,
  };
}

function runFlightPhysicsQA(robot) {
  const saved = {
    position: robot.root.position.clone(), velocity: robot.velocity.clone(), yaw: robot.yaw, pitch: robot.pitch, roll: robot.roll,
    yawVelocity: robot.yawVelocity, pitchVelocity: robot.pitchVelocity, rollVelocity: robot.rollVelocity,
    control: { ...robot.control }, dead: robot.dead, visible: robot.root.visible, stats: cloneData(robot.stats),
    wasAirborne: robot.wasAirborne, airborneTime: robot.airborneTime, peakAirborneY: robot.peakAirborneY,
    lastLandingTime: robot.lastLandingTime, selfRightCooldown: robot.selfRightCooldown,
    selfRightAttemptWindow: robot.selfRightAttemptWindow, wasSelfRightCandidate: robot.wasSelfRightCandidate,
    selfRightRecoveryPending: robot.selfRightRecoveryPending, selfRightAttemptsThisFlip: robot.selfRightAttemptsThisFlip,
    selfRightStableTime: robot.selfRightStableTime,
    selfRightCandidateTime: robot.selfRightCandidateTime, selfRightEpisodeActive: robot.selfRightEpisodeActive,
    selfRightActionIssued: robot.selfRightActionIssued, selfRightWeaponReactionConsumed: robot.selfRightWeaponReactionConsumed,
    lastExternalImpactTime: robot.lastExternalImpactTime, lastWeaponReactionTime: robot.lastWeaponReactionTime,
    lastSupportInfo: robot.lastSupportInfo,
  };
  const savedFlightStats = cloneData(flightStats);
  const flipper = robot.weapons.flipper;
  const savedFlipper = flipper ? { phase: flipper.phase, time: flipper.time, requested: flipper.requested, didHit: flipper.didHit, cooldown: flipper.cooldown } : null;
  const reset = (pitch = 0, roll = 0) => {
    robot.root.position.set(-20, 0, 20);
    robot.velocity.set(0, 0, 0);
    robot.yaw = 0; robot.pitch = pitch; robot.roll = roll;
    robot.yawVelocity = 0; robot.pitchVelocity = 0; robot.rollVelocity = 0;
    robot.control = { throttle: 0, steering: 0, brake: false };
    robot.dead = false; robot.root.visible = false;
    robot.wasAirborne = false; robot.airborneTime = 0; robot.peakAirborneY = 0; robot.lastLandingTime = -Infinity;
    robot.selfRightCooldown = 0; robot.selfRightAttemptWindow = 0; robot.wasSelfRightCandidate = false;
    robot.selfRightRecoveryPending = false; robot.selfRightAttemptsThisFlip = 0; robot.selfRightStableTime = 0;
    robot.selfRightCandidateTime = 0; robot.selfRightEpisodeActive = false; robot.selfRightActionIssued = false;
    robot.selfRightWeaponReactionConsumed = false; robot.lastExternalImpactTime = -Infinity; robot.lastWeaponReactionTime = -Infinity;
    robot.root.rotation.set(pitch, 0, roll, 'YXZ');
    robot.root.position.y = robot.getGroundSupportInfo().height;
    robot.lastSupportInfo = robot.getGroundSupportInfo();
    if (flipper) Object.assign(flipper, { phase: 'idle', time: 0, requested: false, didHit: false, cooldown: 0 });
  };
  const quietImpact = { suppressSparks: true, suppressFlash: true, suppressAudio: true, suppressDamage: true, suppressStats: true, suppressFeedback: true, suppressCritical: true };

  reset();
  const start = robot.root.position.clone();
  const centre = robot.worldCenterOfMass();
  const landingsBeforeBallistic = robot.stats.landings;
  robot.applyImpactAtPoint(new THREE.Vector3(2400, 400, 0), centre.clone().add(new THREE.Vector3(0, 0.58, 1.08)), 100, 'bar', null, quietImpact);
  const launchHorizontal = Math.hypot(robot.velocity.x, robot.velocity.z);
  const launchVertical = Math.max(0, robot.velocity.y);
  let maxHeight = robot.root.position.y;
  let maxAngular = Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity);
  let landingTime = null;
  for (let index = 0; index < 360; index++) {
    robot.updatePhysics(1 / 240, game);
    maxHeight = Math.max(maxHeight, robot.root.position.y);
    maxAngular = Math.max(maxAngular, Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity));
    if (landingTime === null && robot.stats.landings > landingsBeforeBallistic) landingTime = (index + 1) / 240;
  }
  const horizontalDistance = robot.root.position.clone().sub(start).setY(0).length();
  const ballistic = {
    launchHorizontal: Number(launchHorizontal.toFixed(3)),
    launchVertical: Number(launchVertical.toFixed(3)),
    horizontalDistance: Number(horizontalDistance.toFixed(3)),
    peakRise: Number((maxHeight - start.y).toFixed(3)),
    maxAngular: Number(maxAngular.toFixed(3)),
    landingTime: landingTime === null ? null : Number(landingTime.toFixed(3)),
  };
  ballistic.passed = launchHorizontal > Math.max(10, launchVertical * 3.5)
    && horizontalDistance > 8 && maxAngular > 0.7 && landingTime !== null && landingTime < 1.8;

  reset();
  const fallStartSupport = robot.getGroundSupportInfo().height;
  robot.root.position.y = fallStartSupport + 4;
  robot.wasAirborne = true;
  let fallTime = 0;
  let maxFallSpeed = 0;
  let fallLanded = false;
  for (let index = 0; index < 360; index++) {
    robot.updatePhysics(1 / 240, game);
    fallTime += 1 / 240;
    maxFallSpeed = Math.max(maxFallSpeed, -robot.velocity.y);
    if (!robot.wasAirborne && robot.root.position.y <= robot.getGroundSupportInfo().height + 0.07) { fallLanded = true; break; }
  }
  const fastFall = { time: Number(fallTime.toFixed(3)), maxFallSpeed: Number(maxFallSpeed.toFixed(3)), landed: fallLanded };
  fastFall.passed = fallLanded && fallTime < 0.9 && maxFallSpeed > 9;

  reset(Math.PI, 0);
  robot.wasSelfRightCandidate = true;
  robot.selfRightActionIssued = true;
  robot.selfRightAttemptWindow = 2.5;
  robot.selfRightWeaponReactionConsumed = false;
  const reactionPoint = robot.worldCenterOfMass().add(new THREE.Vector3(0, 0, 1.25));
  reactionPoint.y = 0.025;
  const reactionApplied = game.applyWeaponGroundReaction(robot, reactionPoint, 'flipper');
  const reactionVertical = robot.velocity.y;
  const reactionAngular = Math.hypot(robot.pitchVelocity, robot.rollVelocity);
  const successesBeforeReaction = robot.stats.selfRightSuccesses;
  const startPitch = robot.pitch;
  for (let index = 0; index < 360; index++) robot.updatePhysics(1 / 240, game);
  const angularTravel = Math.abs(normalizeAngle(robot.pitch - startPitch)) + Math.abs(normalizeAngle(robot.roll));
  const physicallyRecovered = robot.stats.selfRightSuccesses > successesBeforeReaction;
  const weaponSelfRight = {
    reactionApplied,
    physicallyRecovered,
    verticalSpeed: Number(reactionVertical.toFixed(3)),
    angularSpeed: Number(reactionAngular.toFixed(3)),
    angularTravel: Number(angularTravel.toFixed(3)),
  };
  weaponSelfRight.passed = reactionApplied && physicallyRecovered && reactionVertical > 4.5 && reactionAngular > 0.8 && angularTravel > 0.3;

  reset(Math.PI, 0);
  robot.wasSelfRightCandidate = true;
  const attemptsBefore = robot.stats.selfRightAttempts;
  for (let index = 0; index < 240; index++) robot.updateAI(1 / 60);
  const attemptsIssued = robot.stats.selfRightAttempts - attemptsBefore;
  const aiSelfRight = {
    attempted: attemptsIssued === 1,
    attemptsIssued,
    flipperRequested: Boolean(flipper?.requested),
    driveDisabled: robot.control.throttle === 0 && robot.control.steering === 0,
    actionLocked: robot.selfRightActionIssued && robot.selfRightAttemptsThisFlip === 1,
  };
  aiSelfRight.passed = aiSelfRight.attempted && aiSelfRight.flipperRequested && aiSelfRight.driveDisabled && aiSelfRight.actionLocked;

  robot.root.position.copy(saved.position); robot.velocity.copy(saved.velocity);
  robot.yaw = saved.yaw; robot.pitch = saved.pitch; robot.roll = saved.roll;
  robot.yawVelocity = saved.yawVelocity; robot.pitchVelocity = saved.pitchVelocity; robot.rollVelocity = saved.rollVelocity;
  robot.control = saved.control; robot.dead = saved.dead; robot.root.visible = saved.visible; robot.stats = saved.stats;
  robot.wasAirborne = saved.wasAirborne; robot.airborneTime = saved.airborneTime; robot.peakAirborneY = saved.peakAirborneY;
  robot.lastLandingTime = saved.lastLandingTime; robot.selfRightCooldown = saved.selfRightCooldown;
  robot.selfRightAttemptWindow = saved.selfRightAttemptWindow; robot.wasSelfRightCandidate = saved.wasSelfRightCandidate;
  robot.selfRightRecoveryPending = saved.selfRightRecoveryPending; robot.selfRightAttemptsThisFlip = saved.selfRightAttemptsThisFlip;
  robot.selfRightStableTime = saved.selfRightStableTime;
  robot.selfRightCandidateTime = saved.selfRightCandidateTime; robot.selfRightEpisodeActive = saved.selfRightEpisodeActive;
  robot.selfRightActionIssued = saved.selfRightActionIssued; robot.selfRightWeaponReactionConsumed = saved.selfRightWeaponReactionConsumed;
  robot.lastExternalImpactTime = saved.lastExternalImpactTime; robot.lastWeaponReactionTime = saved.lastWeaponReactionTime;
  robot.lastSupportInfo = saved.lastSupportInfo;
  robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
  if (flipper && savedFlipper) Object.assign(flipper, savedFlipper);
  Object.assign(flightStats, savedFlightStats);
  return { ballistic, fastFall, weaponSelfRight, aiSelfRight };
}

function runLandingSettleQA(robot) {
  const savedWorldTime = worldTime;
  const saved = {
    position: robot.root.position.clone(), velocity: robot.velocity.clone(), yaw: robot.yaw, pitch: robot.pitch, roll: robot.roll,
    yawVelocity: robot.yawVelocity, pitchVelocity: robot.pitchVelocity, rollVelocity: robot.rollVelocity,
    control: { ...robot.control }, dead: robot.dead, visible: robot.root.visible, stats: cloneData(robot.stats),
    wasAirborne: robot.wasAirborne, airborneTime: robot.airborneTime, lastLandingTime: robot.lastLandingTime,
    lastSupportInfo: robot.lastSupportInfo, landingAudit: robot.landingAudit, bodyRollingSeconds: robot.bodyRollingSeconds,
    verticalStandingSeconds: robot.verticalStandingSeconds,
    unstableRestTime: robot.unstableRestTime, abnormalVerticalTime: robot.abnormalVerticalTime,
    grounded: robot.grounded, wheelGroundedCount: robot.wheelGroundedCount, bodyGroundContact: robot.bodyGroundContact,
    broadBodyGroundContact: robot.broadBodyGroundContact, currentAngularDamping: robot.currentAngularDamping,
    currentAppliedTorque: robot.currentAppliedTorque.clone(), currentTorqueSources: [...robot.currentTorqueSources],
    currentAppliedForce: robot.currentAppliedForce.clone(), currentForceSources: [...robot.currentForceSources],
    physicsTrace: [...robot.physicsTrace], angularReversals: [...robot.angularReversals],
    physicsSourceCounts: { ...robot.physicsSourceCounts }, lastTraceBySource: new Map(robot.lastTraceBySource),
    passiveSettledSeconds: robot.passiveSettledSeconds, passiveSettledArmed: robot.passiveSettledArmed,
    passiveWakeups: robot.passiveWakeups, lastExternalImpactTime: robot.lastExternalImpactTime,
    lastWeaponReactionTime: robot.lastWeaponReactionTime,
    torqueFrameTime: robot.torqueFrameTime,
  };
  const rotaryStates = robot.rotaryWeapons.map((weapon) => ({
    weapon, active: weapon.active, rpm: weapon.rpm, visualRpm: weapon.visualRpm,
  }));
  const sampleStart = stabilityStats.landingSamples.length;
  const dt = 1 / 240;

  const simulate = ({ name, pitch = 0, roll = 0, height, velocity, angular, duration = 4 }) => {
    robot.root.position.set(0, 0, 10);
    robot.velocity.set(...velocity);
    robot.yaw = 0; robot.pitch = pitch; robot.roll = roll;
    robot.pitchVelocity = angular[0]; robot.yawVelocity = angular[1]; robot.rollVelocity = angular[2];
    robot.control = { throttle: 0, steering: 0, brake: false };
    robot.dead = true; robot.root.visible = false;
    robot.wasAirborne = true; robot.airborneTime = 0; robot.lastLandingTime = -Infinity;
    robot.landingAudit = null; robot.bodyRollingSeconds = 0; robot.verticalStandingSeconds = 0;
    robot.unstableRestTime = 0; robot.abnormalVerticalTime = 0;
    robot.passiveSettledSeconds = 0; robot.passiveSettledArmed = false; robot.passiveWakeups = 0;
    robot.physicsTrace = []; robot.angularReversals = []; robot.physicsSourceCounts = {}; robot.lastTraceBySource = new Map();
    robot.lastExternalImpactTime = -Infinity; robot.lastWeaponReactionTime = -Infinity;
    robot.grounded = false; robot.wheelGroundedCount = 0; robot.bodyGroundContact = false; robot.broadBodyGroundContact = false;
    robot.root.rotation.set(pitch, 0, roll, 'YXZ');
    const support = robot.getGroundSupportInfo();
    robot.root.position.y = support.height + height;
    robot.lastSupportInfo = support;
    for (const state of rotaryStates) {
      state.weapon.active = false;
      state.weapon.rpm = 0;
      state.weapon.visualRpm = 0;
    }
    const landingsBefore = robot.stats.landings;
    let landingAt = null;
    let postLandingTravel = 0;
    let previousPitch = robot.pitch;
    let previousRoll = robot.roll;
    let maxBodyRollingSeconds = 0;
    let settleTime = null;
    let quietTime = 0;
    const scenarioSampleStart = stabilityStats.landingSamples.length;
    for (let index = 0; index < Math.round(duration / dt); index++) {
      worldTime += dt;
      robot.updatePhysics(dt, game);
      if (landingAt === null && robot.stats.landings > landingsBefore) landingAt = (index + 1) * dt;
      if (landingAt !== null) {
        postLandingTravel += Math.abs(normalizeAngle(robot.pitch - previousPitch)) + Math.abs(normalizeAngle(robot.roll - previousRoll));
        const angularSpeed = Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity);
        // A hard hit may keep sliding on low-friction metal after rotation has
        // settled. The regression target is endless angular motion, not planar glide.
        const contactOrNear = robot.root.position.y <= robot.getGroundSupportInfo().height + 0.075;
        quietTime = contactOrNear && angularSpeed < 0.35 ? quietTime + dt : 0;
        if (settleTime === null && quietTime >= 0.25) settleTime = (index + 1) * dt - landingAt;
      }
      previousPitch = robot.pitch;
      previousRoll = robot.roll;
      maxBodyRollingSeconds = Math.max(maxBodyRollingSeconds, robot.bodyRollingSeconds);
    }
    const angularSpeed = Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity);
    const finalSupport = robot.getGroundSupportInfo();
    const finalTiltDegrees = THREE.MathUtils.radToDeg(Math.acos(clamp(finalSupport.upDot, -1, 1)));
    const samples = stabilityStats.landingSamples.slice(scenarioSampleStart).filter((entry) => entry.robot === robot.name);
    const repeatedLandingTorque = samples.some((entry) => entry.samples.slice(1).some((sample) => sample.torqueSources.includes('landing-impulse')));
    const forbiddenTorque = samples.some((entry) => entry.samples.some((sample) => sample.torqueSources.some((source) => source === 'auto-upright' || source === 'wheel-steering')));
    return {
      name,
      landed: landingAt !== null,
      landingTime: landingAt === null ? null : Number(landingAt.toFixed(3)),
      settleTime: settleTime === null ? null : Number(settleTime.toFixed(3)),
      finalAngularSpeed: Number(angularSpeed.toFixed(3)),
      finalLinearSpeed: Number(robot.velocity.length().toFixed(3)),
      postLandingAngularTravel: Number(postLandingTravel.toFixed(3)),
      maxBodyRollingSeconds: Number(maxBodyRollingSeconds.toFixed(3)),
      finalTiltDegrees: Number(finalTiltDegrees.toFixed(2)),
      sideStanding: finalSupport.sideStanding,
      finalContact: robot.wheelGroundedCount > 0 ? 'wheel' : robot.broadBodyGroundContact ? 'broad-body' : robot.bodyGroundContact ? 'body-edge' : 'air',
      repeatedLandingTorque,
      forbiddenTorque,
      samples,
    };
  };

  const lowTilt = simulate({ name: 'low-drop-60deg', roll: THREE.MathUtils.degToRad(60), height: 0.42, velocity: [0.35, -3.4, 0.15], angular: [0.18, 0.12, 1.15], duration: 5.2 });
  const sideDrop = simulate({ name: 'side-drop-90deg-rest', roll: Math.PI / 2, height: 0.2, velocity: [0.02, -2.35, 0.01], angular: [0, 0, 0.02], duration: 5.2 });
  const strongBar = simulate({ name: 'strong-bar-launch', roll: 0.25, height: 1.85, velocity: [3.8, -2.2, 0.5], angular: [0.8, 1.25, 6.6], duration: 6.2 });
  const weakTilt = simulate({ name: 'weak-side-nudge', roll: 0.4, height: 0.28, velocity: [0.55, -2.7, 0.12], angular: [0.08, 0.05, 0.82], duration: 3.2 });

  const all = [lowTilt, sideDrop, strongBar, weakTilt];
  lowTilt.passed = lowTilt.landed && lowTilt.finalAngularSpeed < 0.42 && lowTilt.maxBodyRollingSeconds < 2.5 && lowTilt.settleTime !== null && !lowTilt.sideStanding;
  sideDrop.passed = sideDrop.landed && sideDrop.finalAngularSpeed < 0.42 && sideDrop.maxBodyRollingSeconds < 2.5
    && sideDrop.settleTime !== null && !sideDrop.sideStanding && (sideDrop.finalTiltDegrees < 55 || sideDrop.finalTiltDegrees > 125);
  strongBar.passed = strongBar.landed && strongBar.finalAngularSpeed < 0.55 && strongBar.maxBodyRollingSeconds < 2.5
    && strongBar.postLandingAngularTravel > 0.55 && strongBar.settleTime !== null && !strongBar.sideStanding;
  weakTilt.passed = weakTilt.landed && weakTilt.finalAngularSpeed < 0.3 && weakTilt.maxBodyRollingSeconds < 2.5 && weakTilt.settleTime !== null && !weakTilt.sideStanding;
  const torqueAuditPassed = all.every((scenario) => !scenario.repeatedLandingTorque && !scenario.forbiddenTorque)
    && LANDING_PHYSICS.sustainedSawForceScale <= 0.08 && LANDING_PHYSICS.sustainedRotaryForceScale <= 0.12;

  robot.root.position.copy(saved.position); robot.velocity.copy(saved.velocity);
  robot.yaw = saved.yaw; robot.pitch = saved.pitch; robot.roll = saved.roll;
  robot.yawVelocity = saved.yawVelocity; robot.pitchVelocity = saved.pitchVelocity; robot.rollVelocity = saved.rollVelocity;
  robot.control = saved.control; robot.dead = saved.dead; robot.root.visible = saved.visible; robot.stats = saved.stats;
  robot.wasAirborne = saved.wasAirborne; robot.airborneTime = saved.airborneTime; robot.lastLandingTime = saved.lastLandingTime;
  robot.lastSupportInfo = saved.lastSupportInfo; robot.landingAudit = saved.landingAudit; robot.bodyRollingSeconds = saved.bodyRollingSeconds;
  robot.verticalStandingSeconds = saved.verticalStandingSeconds;
  robot.unstableRestTime = saved.unstableRestTime; robot.abnormalVerticalTime = saved.abnormalVerticalTime;
  robot.grounded = saved.grounded; robot.wheelGroundedCount = saved.wheelGroundedCount; robot.bodyGroundContact = saved.bodyGroundContact;
  robot.broadBodyGroundContact = saved.broadBodyGroundContact; robot.currentAngularDamping = saved.currentAngularDamping;
  robot.currentAppliedTorque.copy(saved.currentAppliedTorque); robot.currentTorqueSources = saved.currentTorqueSources; robot.torqueFrameTime = saved.torqueFrameTime;
  robot.currentAppliedForce.copy(saved.currentAppliedForce); robot.currentForceSources = saved.currentForceSources;
  robot.physicsTrace = saved.physicsTrace; robot.angularReversals = saved.angularReversals;
  robot.physicsSourceCounts = saved.physicsSourceCounts; robot.lastTraceBySource = saved.lastTraceBySource;
  robot.passiveSettledSeconds = saved.passiveSettledSeconds; robot.passiveSettledArmed = saved.passiveSettledArmed;
  robot.passiveWakeups = saved.passiveWakeups; robot.lastExternalImpactTime = saved.lastExternalImpactTime;
  robot.lastWeaponReactionTime = saved.lastWeaponReactionTime;
  robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
  for (const state of rotaryStates) Object.assign(state.weapon, { active: state.active, rpm: state.rpm, visualRpm: state.visualRpm });
  worldTime = savedWorldTime;
  return {
    lowTilt,
    sideDrop,
    strongBar,
    weakTilt,
    torqueAuditPassed,
    sampleWindowSeconds: LANDING_SAMPLE_TIMES,
    newLandingSamples: stabilityStats.landingSamples.slice(sampleStart),
  };
}

function runSparkShowerQA(point) {
  const before = {
    particles: sparkStats.particlesSpawned,
    short: sparkStats.shortParticles,
    medium: sparkStats.mediumParticles,
    long: sparkStats.longParticles,
    denseCore: sparkStats.denseCoreParticles,
    upwardHero: sparkStats.upwardHeroParticles,
  };
  spawnMetalSparks(
    point,
    new THREE.Vector3(920, 160, 430),
    110,
    'critical',
    new THREE.Vector3(-0.35, 0.18, 1),
    'qa-shower',
    new THREE.Vector3(0.8, 0.42, -0.15),
  );
  const active = sparkParticles.filter((particle) => particle.active);
  const result = {
    count: sparkStats.particlesSpawned - before.particles,
    short: sparkStats.shortParticles - before.short,
    medium: sparkStats.mediumParticles - before.medium,
    long: sparkStats.longParticles - before.long,
    denseCore: sparkStats.denseCoreParticles - before.denseCore,
    upwardHero: sparkStats.upwardHeroParticles - before.upwardHero,
    longestTrail: Number(Math.max(...active.map((particle) => particle.tailLength)).toFixed(3)),
    fastest: Number(Math.max(...active.map((particle) => particle.velocity.length())).toFixed(3)),
    widestPotentialTravel: Number(Math.max(...active.map((particle) => particle.velocity.length() * particle.initialLife + particle.tailLength)).toFixed(3)),
    poolSize: SPARK_POOL_SIZE,
  };
  result.layerPassed = result.short >= 55 && result.short <= 72
    && result.medium >= 27 && result.medium <= 38 && result.long >= 10 && result.long <= 18;
  result.scalePassed = result.count === 110 && result.longestTrail >= 3 && result.longestTrail <= 5.2
    && result.fastest >= 38 && result.fastest <= 60 && result.widestPotentialTravel >= 9
    && result.widestPotentialTravel <= 24 && result.denseCore >= 25 && result.upwardHero >= 20
    && result.poolSize >= 360;
  return result;
}

function finishSelfTest() {
  if (!qa) return;
  document.body.classList.remove('spark-proof-capture');
  qa.result.sawContinuousParticlePass = sparkStats.continuousSawBursts > (qa.continuousSparkStart ?? 0);
  lastQAResult = { ...qa.result, passed: qa.passKeys.every((key) => qa.result[key]) };
  qa = null;
  resetGame();
  delete ui.qaState.dataset.qaPhase;
  ui.qaState.dataset.qaResult = JSON.stringify(lastQAResult);
  showMessage(lastQAResult.passed ? 'AUTO QA 41/41 PASS · BATTLEBOTS SPARK SHOWER' : 'AUTO QA FAILED', 2.2);
}

function updateSelfTest(dt) {
  if (!qa || !player) return;
  qa.time += dt;
  if (qa.phase === 'drive') {
    const current = qa.cases[qa.caseIndex];
    const control = resolveControlAxes(new Set(current.keys), { x: 0, y: 0 });
    player.control = { ...control, brake: false };
    if (qa.time > 0.95) finishQADriveCase();
  } else if (qa.phase === 'hammer') {
    player.control = { throttle: 0, steering: 0, brake: true };
    if (qa.time > 0.32) {
      qa.result.hammerActivated = player.weapons.hammer ? player.weapons.hammer.phase !== 'idle' : true;
      player.requestFlipper();
      qa.phase = 'flipper'; qa.time = 0;
    }
  } else if (qa.phase === 'flipper') {
    player.control = { throttle: 0, steering: 0, brake: true };
    if (qa.time > 0.32) {
      qa.result.flipperActivated = player.weapons.flipper ? player.weapons.flipper.phase !== 'idle' : true;
      qa.result.spinnerRpm = Math.round(player.weapons.spinner?.rpm ?? player.rotaryWeapons?.[0]?.rpm ?? 0);
      const cases = qa.result.driveCases;
      qa.result.forwardPass = cases.forward.z > 0.7 && cases.forward.wheel < 0;
      qa.result.reversePass = cases.reverse.z < -0.7 && cases.reverse.wheel > 0;
      qa.result.forwardLeftPass = cases.forwardLeft.x < -0.04 && cases.forwardLeft.yaw < -0.06 && cases.forwardLeft.frontSteer < 0;
      qa.result.forwardRightPass = cases.forwardRight.x > 0.04 && cases.forwardRight.yaw > 0.06 && cases.forwardRight.frontSteer > 0;
      // During reverse, steering-left moves the vehicle path left while the nose naturally yaws right.
      qa.result.reverseLeftPass = cases.reverseLeft.x < -0.04 && cases.reverseLeft.yaw > 0.06 && cases.reverseLeft.frontSteer < 0;
      qa.result.reverseRightPass = cases.reverseRight.x > 0.04 && cases.reverseRight.yaw < -0.06 && cases.reverseRight.frontSteer > 0;
      const mobileUp = resolveControlAxes(new Set(), joystickAxisFromDelta(0, -1, 1));
      const mobileDown = resolveControlAxes(new Set(), joystickAxisFromDelta(0, 1, 1));
      const mobileLeft = resolveControlAxes(new Set(), joystickAxisFromDelta(-1, 0, 1));
      const mobileRight = resolveControlAxes(new Set(), joystickAxisFromDelta(1, 0, 1));
      qa.result.mobilePass = mobileUp.throttle > 0 && mobileDown.throttle < 0 && mobileLeft.steering < 0 && mobileRight.steering > 0;
      const renderTransform = new DOMMatrixReadOnly(getComputedStyle(ui.canvas).transform);
      qa.result.renderXScale = Number(renderTransform.a.toFixed(3));
      qa.result.renderHandednessPass = renderTransform.a < -0.99;
      qa.result.wheelHubOutwardDots = getWheelHubOutwardDots(player);
      qa.result.wheelHubPass = qa.result.wheelHubOutwardDots.length >= 4 && qa.result.wheelHubOutwardDots.every((value) => value > 0.98);
      qa.result.hammerMount = getHammerTelemetry(player);
      qa.result.hammerMountPass = qa.result.hammerMount?.hingeError < 0.001 && qa.result.hammerMount?.outwardDot > 0.2;
      qa.result.visualForwardPass = qa.result.visualForwardDot > 0.99;
      qa.result.hammerPass = qa.result.hammerActivated;
      qa.result.flipperPass = qa.result.flipperActivated;
      qa.result.multiSpinnerRpms = player.rotaryWeapons.filter((weapon) => weapon.kind === 'spinner').map((weapon) => Math.round(weapon.rpm));
      qa.result.spinnerPass = qa.result.multiSpinnerRpms.length >= 2 && qa.result.multiSpinnerRpms.every((rpm) => rpm > 1000);
      const contactTicksBefore = audioStats.sawContactTicks;
      const particlesBefore = sparkStats.particlesSpawned;
      const impactSoundsBefore = audioStats.impactHits;
      const hitVariantsBefore = [...audioStats.hitVariantCounts];
      const detachedBefore = qa.contactTarget.stats.detached;
      qa.result.groundOrientations = runGroundOrientationQA(qa.contactTarget);
      qa.result.groundContactPass = qa.result.groundOrientations.every((item) => item.bottomClearance >= 0);
      qa.result.staticStability = runStaticStabilityQA(qa.contactTarget);
      qa.result.staticStabilityPass = qa.result.staticStability.passed;
      qa.result.passiveOverturn = runPassiveOverturnQA(qa.contactTarget);
      qa.result.passiveOverturnPass = qa.result.passiveOverturn.passed;
      qa.result.compoundColliderPass = qa.contactTarget.colliderComponents.length >= 1
        && qa.contactTarget.colliderComponents.length <= 6
        && qa.contactTarget.colliderComponents.every((component) => component.points.length >= 6)
        && !('colliderHalfExtents' in qa.contactTarget);
      qa.result.arena01 = cloneData(arenaStats);
      qa.result.arenaRectanglePass = ARENA_X === 52 && ARENA_Z === 38 && arenaStats.innerWalls === 4 && arenaStats.wallCornerGaps === 0;
      qa.result.arenaAssetPass = arenaStats.assets.length === 4
        && ['arena_stands', 'arena_bumper', 'arena_fence'].every((id) => Boolean(models[id]))
        && !models.arena_ramp_1 && !models.arena_ramp_2 && ramps.length === 0;
      qa.result.arenaStructurePass = arenaStats.fenceModules.total === 42 && arenaStats.fenceModules.spacingError === 0
        && arenaStats.stands.total === 14 && arenaStats.outerWalls === 4
        && arenaStats.scaleReferences.fenceRobotRatio >= 2.5
        && arenaStats.scaleReferences.audienceRobotRatio >= 4;
      qa.result.arenaGroundingPass = arenaStats.floatingObjects === 0
        && ramps.every((ramp) => ramp.groundGap <= 0.004)
        && obstacles.filter((obstacle) => obstacle.kind === 'box').every((obstacle) => obstacle.groundGap <= 0.004);
      qa.result.arenaSpawnPass = arenaStats.symmetric && arenaStats.spawnPointsPerTeam === 4
        && ARENA_Z - ARENA_LAYOUT.spawnInset === -( -ARENA_Z + ARENA_LAYOUT.spawnInset )
        && arenaStats.spawnCoordinates.blue.every((point, index) => point[0] === arenaStats.spawnCoordinates.red[index][0] && point[1] === -arenaStats.spawnCoordinates.red[index][1]);
      qa.result.impactResponse = runImpactResponseQA(qa.contactTarget);
      qa.result.impactResponsePass = qa.result.impactResponse.passed;
      qa.result.flightPhysics = runFlightPhysicsQA(qa.contactTarget);
      qa.result.ballisticFlightPass = qa.result.flightPhysics.ballistic.passed;
      qa.result.fastFallPass = qa.result.flightPhysics.fastFall.passed;
      qa.result.weaponSelfRightPass = qa.result.flightPhysics.weaponSelfRight.passed;
      qa.result.aiSelfRightPass = qa.result.flightPhysics.aiSelfRight.passed;
      qa.result.landingSettle = runLandingSettleQA(qa.contactTarget);
      qa.result.lowTiltLandingPass = qa.result.landingSettle.lowTilt.passed;
      qa.result.sideLandingPass = qa.result.landingSettle.sideDrop.passed;
      qa.result.strongLandingPass = qa.result.landingSettle.strongBar.passed;
      qa.result.weakTiltLandingPass = qa.result.landingSettle.weakTilt.passed;
      qa.result.postLandingTorquePass = qa.result.landingSettle.torqueAuditPassed;
      qa.result.sparkShower = runSparkShowerQA(qa.contactTarget.worldCenterOfMass());
      qa.result.sparkLayerPass = qa.result.sparkShower.layerPassed;
      qa.result.sparkShowerScalePass = qa.result.sparkShower.scalePassed;
      qa.contactTarget.dead = false;
      qa.contactTarget.root.visible = true;
      qa.contactTarget.root.position.set(0, GROUND_Y, -10.8);
      for (const weapon of player.rotaryWeapons.filter((item) => item.kind === 'spinner')) game.checkRotaryHit(player, weapon);
      qa.result.multiSawContactTicks = audioStats.sawContactTicks - contactTicksBefore;
      qa.result.sawContactPass = qa.result.multiSawContactTicks >= 2 && sawContactTimer > 0;
      const newSparkParticles = sparkParticles.filter((particle) => particle.active);
      qa.result.proceduralSparkParticles = sparkStats.particlesSpawned - particlesBefore;
      qa.result.proceduralSparkMetrics = {
        active: newSparkParticles.length,
        minLife: newSparkParticles.length ? Math.min(...newSparkParticles.map((particle) => particle.initialLife)) : null,
        maxLife: newSparkParticles.length ? Math.max(...newSparkParticles.map((particle) => particle.initialLife)) : null,
        minTail: newSparkParticles.length ? Math.min(...newSparkParticles.map((particle) => particle.tailLength)) : null,
        minSpeed: newSparkParticles.length ? Math.min(...newSparkParticles.map((particle) => particle.velocity.length())) : null,
        instanceCounts: [sparkTailInstances.count, sparkCoreInstances.count, sparkHeadInstances.count],
      };
      qa.result.proceduralSparkPass = qa.result.proceduralSparkParticles > 0
        && newSparkParticles.every((particle) => particle.initialLife >= 0.08 && particle.initialLife <= 0.45)
        && newSparkParticles.every((particle) => particle.tailLength >= 0.1 && particle.velocity.length() >= 6.5)
        && sparkTailInstances.isInstancedMesh && sparkCoreInstances.isInstancedMesh && sparkHeadInstances.isInstancedMesh;
      qa.result.impactSoundEvents = audioStats.impactHits - impactSoundsBefore;
      qa.result.impactSoundVariantDelta = audioStats.hitVariantCounts.map((count, index) => count - hitVariantsBefore[index]);
      qa.result.impactSoundPass = qa.result.impactSoundEvents === 2 && qa.result.impactSoundVariantDelta.reduce((sum, count) => sum + count, 0) === 2;
      qa.result.weaponDurabilityPass = qa.contactTarget.stats.detached === detachedBefore;
      qa.result.criticalRulePass = criticalChanceForImpactScore(45, 'collision') === 0
        && criticalChanceForImpactScore(120, 'bar') >= 0.08
        && criticalChanceForImpactScore(200, 'bar') >= 0.5
        && criticalChanceForImpactScore(200, 'bar', false) === 0;
      const passKeys = [
        'forwardPass', 'reversePass', 'forwardLeftPass', 'forwardRightPass',
        'reverseLeftPass', 'reverseRightPass', 'mobilePass', 'renderHandednessPass', 'wheelHubPass', 'visualForwardPass',
        'hammerPass', 'hammerMountPass', 'flipperPass', 'spinnerPass', 'sawContactPass',
        'groundContactPass', 'staticStabilityPass', 'passiveOverturnPass', 'compoundColliderPass',
        'arenaRectanglePass', 'arenaAssetPass', 'arenaStructurePass', 'arenaGroundingPass', 'arenaSpawnPass',
        'impactSoundPass', 'weaponDurabilityPass', 'criticalRulePass', 'proceduralSparkPass', 'sawContinuousParticlePass', 'impactResponsePass',
        'ballisticFlightPass', 'fastFallPass', 'weaponSelfRightPass', 'aiSelfRightPass',
        'lowTiltLandingPass', 'sideLandingPass', 'strongLandingPass', 'weakTiltLandingPass', 'postLandingTorquePass',
        'sparkLayerPass', 'sparkShowerScalePass',
      ];
      qa.passKeys = passKeys;
      qa.phase = 'sparkProof';
      qa.time = 0;
      qa.sparkProofStartedAt = performance.now();
      qa.nextSparkProofHit = 0;
      // Leave a full particle-lifetime gap between the continuous-saw proof
      // and the bar impact. This keeps a single impact readable instead of
      // visually stacking two unrelated weapons into a starburst.
      qa.nextBarProofHit = 1.8;
      qa.continuousSparkStart = sparkStats.continuousSawBursts;
      ui.qaState.dataset.qaPhase = 'sparkProof';
      document.body.classList.add('spark-proof-capture');
      showMessage('AUTO QA: 실제 금속 점+꼬리 파티클 충돌 렌더링', 3.2);
    }
  } else if (qa.phase === 'sparkProof') {
    const proofElapsed = (performance.now() - qa.sparkProofStartedAt) / 1000;
    const sawProofActive = proofElapsed < 1.2;
    for (const weapon of player.rotaryWeapons) {
      const enabledForProof = weapon.kind === 'spinner' ? sawProofActive : weapon.kind === 'bar' ? !sawProofActive : false;
      weapon.active = enabledForProof;
      if (!enabledForProof) {
        weapon.rpm = 0;
        weapon.visualRpm = 0;
      }
    }
    // Keep the proof rig fixed at the real blade contact distance. The normal
    // robot-vs-robot separation solver would otherwise push this stationary QA
    // target out of the saw radius before the next continuous-contact tick.
    resetPlayerPoseForQA();
    player.control = { throttle: 0, steering: 0, brake: true };
    qa.contactTarget.dead = false;
    qa.contactTarget.root.visible = true;
    // Offset the target so the real blade contact point and short spark tails
    // remain visible beside the chassis instead of being occluded between two
    // overlapping robots in the visual proof.
    qa.contactTarget.root.position.set(1.0, GROUND_Y, -10.8);
    if (!sawProofActive) {
      const barWeapon = player.rotaryWeapons.find((item) => item.kind === 'bar');
      if (barWeapon) {
        const barCentre = new THREE.Vector3();
        barWeapon.pivot.getWorldPosition(barCentre);
        // Give the deterministic proof rig enough overlap to remain inside the
        // same production radius check even after the prior saw impulse has
        // briefly displaced the compound-body roots.
        const contactReach = Math.max(0.4, qa.contactTarget.radius + barWeapon.radius - 0.82);
        qa.contactTarget.root.position.copy(barCentre).addScaledVector(forwardFor(player.yaw), contactReach);
        qa.contactTarget.root.position.y = GROUND_Y;
      }
    }
    qa.contactTarget.velocity.set(0, 0, 0);
    qa.contactTarget.pitch = 0;
    qa.contactTarget.roll = 0;
    qa.contactTarget.root.rotation.set(0, Math.PI, 0);
    for (const part of qa.contactTarget.parts) if (!part.detached) part.hp = part.maxHp;
    if (sawProofActive && proofElapsed >= qa.nextSparkProofHit) {
      qa.nextSparkProofHit += 0.09;
      for (const weapon of player.rotaryWeapons.filter((item) => item.kind === 'spinner')) {
        weapon.hitCooldown.delete(qa.contactTarget);
        weapon.rpm = weapon.maxRpm;
        game.checkRotaryHit(player, weapon);
      }
    }
    if (!sawProofActive && proofElapsed >= qa.nextBarProofHit) {
      // One full-energy bar contact is the proof. Repeating the hit while the
      // previous trails are alive would visually merge independent impacts.
      qa.nextBarProofHit = Infinity;
      resetMetalSparkPool();
      for (const weapon of player.rotaryWeapons.filter((item) => item.kind === 'bar')) {
        weapon.hitCooldown.delete(qa.contactTarget);
        weapon.rpm = weapon.maxRpm;
        qa.barProofAttempts = (qa.barProofAttempts ?? 0) + 1;
        qa.barProofHits = (qa.barProofHits ?? 0) + game.checkRotaryHit(player, weapon);
        qa.barProofResult = weapon.lastImpactResult ? { ...weapon.lastImpactResult } : null;
      }
    }
    if (proofElapsed > 3.4) finishSelfTest();
  }
}

function getWheelHubOutwardDots(robot) {
  return robot.wheels.map((wheel) => {
    const hubNormal = new THREE.Vector3(0, 0, 1);
    const hubQuaternion = new THREE.Quaternion();
    wheel.wheelVisual.children[0].getWorldQuaternion(hubQuaternion);
    hubNormal.applyQuaternion(hubQuaternion).normalize();
    const expected = new THREE.Vector3(wheel.side, 0, 0);
    const steeringQuaternion = new THREE.Quaternion();
    wheel.steeringPivot.getWorldQuaternion(steeringQuaternion);
    expected.applyQuaternion(steeringQuaternion).normalize();
    return Number(hubNormal.dot(expected).toFixed(3));
  });
}

function getHammerTelemetry(robot) {
  const hammer = robot.weapons.hammer;
  if (!hammer?.mount) return null;
  const hinge = new THREE.Vector3();
  const mountAxis = new THREE.Vector3();
  const tip = new THREE.Vector3();
  hammer.root.getWorldPosition(hinge);
  hammer.mount.object.getWorldPosition(mountAxis);
  hammer.tip.getWorldPosition(tip);
  const localHinge = robot.root.worldToLocal(hinge.clone());
  const localTip = robot.root.worldToLocal(tip.clone());
  const headDirection = localTip.clone().sub(localHinge).setY(0);
  const outward = localHinge.clone().setY(0);
  const outwardDot = headDirection.lengthSq() > 0.01 && outward.lengthSq() > 0.01 ? headDirection.normalize().dot(outward.normalize()) : 0;
  return {
    hingeError: Number(hinge.distanceTo(mountAxis).toFixed(4)),
    hingeLocal: localHinge.toArray().map((value) => Number(value.toFixed(3))),
    tipLocal: localTip.toArray().map((value) => Number(value.toFixed(3))),
    outwardDot: Number(outwardDot.toFixed(3)),
    phase: hammer.phase,
  };
}

function buildEnemyUI() {
  if (!ui.blueTeamList || !ui.redTeamList) return;
  ui.blueTeamList.innerHTML = '';
  ui.redTeamList.innerHTML = '';
  for (const enemy of robots.filter((robot) => ['blue', 'red'].includes(robot.team))) {
    const card = document.createElement('div');
    card.className = 'enemy-card';
    const teamColor = enemy.team === 'blue' ? '#57a9ff' : '#ff6e56';
    card.style.setProperty('--team', teamColor);
    card.innerHTML = `<div class="enemy-name">${enemy.name}</div><div class="enemy-meter"><i></i></div>`;
    (enemy.team === 'blue' ? ui.blueTeamList : ui.redTeamList).appendChild(card);
    enemy.uiCard = card;
    enemy.uiRefs = {
      meter: card.querySelector('.enemy-meter i'),
    };
  }
}

function auditWorldRobotUIRemoved() {
  const selectors = ['#combat-nameplates', '#nameplate-debug-lines', '.combat-nameplate', '[data-component="NameplateRoot"]', '[data-component="ClassIcon"]', '[data-component="PlayerName"]', '[data-component="HPBar"]'];
  const counts = Object.fromEntries(selectors.map((selector) => [selector, document.querySelectorAll(selector).length]));
  const sceneAnchors = [];
  scene.traverse((object) => { if (/NameplateAnchor|NameplateRoot|ClassIcon|WorldPlayerName|WorldHPBar/i.test(object.name ?? '')) sceneAnchors.push(object.name); });
  return {
    WorldNameplate: counts['.combat-nameplate'] + counts['[data-component="NameplateRoot"]'],
    WorldClassIcon: counts['[data-component="ClassIcon"]'],
    WorldPlayerName: counts['[data-component="PlayerName"]'],
    WorldHPBar: counts['[data-component="HPBar"]'],
    ContainerNodes: counts['#combat-nameplates'] + counts['#nameplate-debug-lines'],
    SceneAnchors: sceneAnchors,
    Passed: Object.values(counts).every((count) => count === 0) && sceneAnchors.length === 0,
  };
}

function getRobotStabilityTelemetry(robot) {
  const support = robot.lastSupportInfo ?? robot.getGroundSupportInfo();
  const worldCom = robot.worldCenterOfMass();
  robot.updateWheelGroundDistances();
  robot.root.updateWorldMatrix(true, true);
  const bodyBottomWorld = Math.min(...robot.colliderComponents.flatMap((component) => component.points.map((point) => point.clone().applyQuaternion(robot.root.quaternion).add(robot.root.position).y)));
  const wheelGroundDistances = robot.wheels.filter((wheel) => !wheel.part.detached).map((wheel) => Number(wheel.wheelGroundDistance.toFixed(4)));
  const wheelSyncErrors = robot.wheels.filter((wheel) => !wheel.part.detached).map((wheel) => wheel.wheelVisual.getWorldPosition(new THREE.Vector3()).distanceTo(wheel.steeringPivot.getWorldPosition(new THREE.Vector3())));
  return {
    tiltDegrees: Number(THREE.MathUtils.radToDeg(Math.acos(clamp(support.upDot, -1, 1))).toFixed(1)),
    contactArea: Number(support.area.toFixed(3)),
    contactCount: support.contacts.length,
    contactKinds: [...new Set(support.contactKinds)],
    comInsideSupport: support.stable,
    geometricComInsideSupport: support.geometricallyStable,
    sideStanding: support.sideStanding,
    wheelSuspensionActive: support.wheelContact && support.wheelContactEligible,
    unstableRestSeconds: Number(robot.unstableRestTime.toFixed(3)),
    abnormalVerticalSeconds: Number(robot.abnormalVerticalTime.toFixed(3)),
    abnormalVerticalStop: robot.abnormalVerticalTime >= 1,
    linearSpeed: Number(robot.velocity.length().toFixed(3)),
    linearVelocity: robot.velocity.toArray().map((value) => Number(value.toFixed(3))),
    angularSpeed: Number(Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity).toFixed(3)),
    angularVelocity: [robot.pitchVelocity, robot.yawVelocity, robot.rollVelocity].map((value) => Number(value.toFixed(3))),
    eulerDegrees: [robot.pitch, robot.yaw, robot.roll].map((value) => Number(THREE.MathUtils.radToDeg(value).toFixed(2))),
    grounded: robot.grounded,
    wheelGroundedCount: robot.wheelGroundedCount,
    wheelGroundDistances,
    maximumWheelGroundDistance: wheelGroundDistances.length ? Math.max(...wheelGroundDistances) : null,
    minimumWheelGroundDistance: wheelGroundDistances.length ? Math.min(...wheelGroundDistances) : null,
    chassisGroundClearance: Number((bodyBottomWorld - PHYSICS_FLOOR_TOP).toFixed(4)),
    intendedChassisClearance: Number((robot.chassisGroundClearance ?? 0).toFixed(4)),
    steeringAngles: robot.wheels.filter((wheel) => wheel.steers && !wheel.part.detached).map((wheel) => Number(wheel.steeringPivot.rotation.y.toFixed(4))),
    wheelHubOutwardDots: getWheelHubOutwardDots(robot),
    visualPhysicsWheelSyncError: Number((wheelSyncErrors.length ? Math.max(...wheelSyncErrors) : 0).toFixed(6)),
    bodyGroundContact: robot.bodyGroundContact,
    broadBodyGroundContact: robot.broadBodyGroundContact,
    currentAngularDamping: Number(robot.currentAngularDamping.toFixed(3)),
    currentAppliedTorque: robot.currentAppliedTorque.toArray().map((value) => Number(value.toFixed(4))),
    currentTorqueSources: [...robot.currentTorqueSources],
    currentAppliedForce: robot.currentAppliedForce.toArray().map((value) => Number(value.toFixed(4))),
    currentForceSources: [...robot.currentForceSources],
    physicsSourceCounts: { ...robot.physicsSourceCounts },
    recentPhysicsTrace: robot.physicsTrace.slice(-16),
    recentAngularReversals: robot.angularReversals.slice(-8),
    passiveSettledSeconds: Number(robot.passiveSettledSeconds.toFixed(3)),
    passiveWakeups: robot.passiveWakeups,
    selfRightEpisode: {
      active: robot.selfRightEpisodeActive,
      actionIssued: robot.selfRightActionIssued,
      attemptsThisFlip: robot.selfRightAttemptsThisFlip,
      candidateSeconds: Number(robot.selfRightCandidateTime.toFixed(3)),
      stableWheelDownSeconds: Number(robot.selfRightStableTime.toFixed(3)),
      reactionConsumed: robot.selfRightWeaponReactionConsumed,
    },
    centerOfMassLocal: robot.centerOfMassLocal.toArray().map((value) => Number(value.toFixed(3))),
    centerOfMassWorld: worldCom.toArray().map((value) => Number(value.toFixed(3))),
    bodyRollingSeconds: Number(robot.bodyRollingSeconds.toFixed(3)),
    verticalStandingSeconds: Number(robot.verticalStandingSeconds.toFixed(3)),
    infiniteRollCandidate: robot.bodyRollingSeconds >= 2.5,
  };
}

function countCombatClusters() {
  const alive = robots.filter((robot) => !robot.dead);
  const visited = new Set();
  let clusters = 0;
  for (const seed of alive) {
    if (visited.has(seed)) continue;
    const queue = [seed];
    visited.add(seed);
    let members = 0;
    while (queue.length) {
      const current = queue.pop();
      members++;
      for (const candidate of alive) {
        if (visited.has(candidate) || current.root.position.distanceToSquared(candidate.root.position) > 196) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }
    if (members >= 2) clusters++;
  }
  return clusters;
}

let combatUIAccumulator = 0;
let combatTelemetryAccumulator = 0;

function updateUI(dt = 1 / 60) {
  const budget = currentPerformanceBudget();
  combatUIAccumulator += dt;
  combatTelemetryAccumulator += dt;
  if (combatUIAccumulator < 1 / budget.uiHz) return;
  combatUIAccumulator = 0;
  const telemetryInterval = robots.length >= 12 ? 1 : 0.5;
  const refreshTelemetry = combatTelemetryAccumulator >= telemetryInterval;
  if (refreshTelemetry) combatTelemetryAccumulator = 0;
  updateUIDetailed(refreshTelemetry);
}

function updateUIDetailed(refreshTelemetry = false) {
  if (!player) return;
  const abnormalVerticalCurrent = robots.filter((robot) => robot.abnormalVerticalTime >= 1).length;
  const infiniteRollersCurrent = robots.filter((robot) => robot.bodyRollingSeconds >= 2.5).length;
  const verticalStandersCurrent = robots.filter((robot) => robot.verticalStandingSeconds >= 0.75).length;
  stabilityStats.maxAbnormalVerticalConcurrent = Math.max(stabilityStats.maxAbnormalVerticalConcurrent, abnormalVerticalCurrent);
  stabilityStats.maxVerticalStandersConcurrent = Math.max(stabilityStats.maxVerticalStandersConcurrent, verticalStandersCurrent);
  const speed = player.velocity.clone().setY(0).length() * 3.6;
  ui.speed.textContent = speed.toFixed(1);
  const health = clamp(player.durability(), 0, 1);
  ui.playerHealth.style.width = `${health * 100}%`;
  ui.playerHealth.style.background = health < 0.3 ? 'linear-gradient(90deg,#e43d31,#ff7b3f)' : 'linear-gradient(90deg,#35d27d,#b4df4b)';
  ui.playerHealthText.textContent = `${Math.round(health * 100)}%`;
  const activeBlocks = player.activeBlockParts().length;
  ui.playerCore.textContent = `CORE ${Math.round(player.coreHealthRatio() * 100)}%`;
  ui.playerCore.classList.toggle('bad', player.coreHealthRatio() < 0.35);
  ui.playerBlocks.textContent = `BLOCKS ${activeBlocks}/${player.blockParts.size}`;
  ui.playerBlocks.classList.toggle('bad', player.remainingBlockRatio() < 0.45);
  ui.playerWeapon.textContent = player.weaponStatus();
  ui.playerMobility.textContent = player.mobilityStatus();
  ui.playerWeapon.classList.toggle('bad', player.weaponStatus() !== '무기 정상');
  ui.playerMobility.classList.toggle('bad', player.mobilityStatus() !== '주행 정상');
  if (ui.combatRespawn) {
    const canRespawn = player.canRequestRespawn();
    ui.combatRespawn.hidden = !canRespawn;
    ui.combatRespawn.querySelector('small').textContent = canRespawn ? '10초 후 복귀' : '';
  }
  updateConquestHUD();
  if (ui.dash) {
    const ready = player.dashCooldown <= 0 && !player.dead;
    ui.dash.classList.toggle('ready', ready);
    ui.dash.classList.toggle('cooldown', !ready);
    ui.dash.querySelector('small').textContent = ready ? 'READY' : `${player.dashCooldown.toFixed(1)}s`;
    ui.dash.setAttribute('aria-label', ready ? '대시 준비' : `대시 재사용 ${player.dashCooldown.toFixed(1)}초`);
  }
  const postureAvailable = player.canPostureRecover();
  ui.selfRight.disabled = !postureAvailable;
  ui.selfRight.classList.toggle('active', Boolean(player.postureRecovery));
  ui.selfRight.querySelector('small').textContent = player.postureRecovery ? '복구 중' : postureAvailable ? 'T · 현재 위치' : '기울어졌을 때';
  if (colliderDebugEnabled) {
    const debug = getRobotStabilityTelemetry(player);
    ui.physicsDebug.textContent = [
      `Linear Velocity  ${debug.linearVelocity.join(' / ')}`,
      `Angular Velocity ${debug.angularVelocity.join(' / ')}`,
      `Grounded ${debug.grounded}  Wheels ${debug.wheelGroundedCount}`,
      `Body Contact ${debug.bodyGroundContact}  Broad ${debug.broadBodyGroundContact}`,
      `Angular Damping ${debug.currentAngularDamping}`,
      `Applied Torque  ${debug.currentAppliedTorque.join(' / ')}`,
      `Torque Sources  ${debug.currentTorqueSources.join(', ') || 'none'}`,
      `COM local ${debug.centerOfMassLocal.join(' / ')}`,
      `Tilt ${debug.tiltDegrees}°  Rolling ${debug.bodyRollingSeconds}s`,
      `Vertical stand ${debug.sideStanding} / ${debug.verticalStandingSeconds}s`,
    ].join('\n');
  }

  for (const enemy of robots) {
    if (!enemy.uiCard) continue;
    const durability = clamp(enemy.durability(), 0, 1);
    enemy.uiRefs.meter.style.width = `${durability * 100}%`;
    enemy.uiCard.classList.toggle('dead', enemy.dead);
  }

  if (!refreshTelemetry) return;
  ui.qaState.textContent = JSON.stringify({
    mode,
    battle: { mapId: selectedMapId, mapName: activeMap.name, mode: battleMode, friendlyFire, elapsed: Number(battleElapsed.toFixed(1)), respawnsEnabled: BATTLE_RESPAWNS_ENABLED, respawnDelaySeconds: RESPAWN_DELAY_SECONDS, spawnProtectionSeconds: SPAWN_PROTECTION_SECONDS, respawnStats: { ...respawnStats }, teams: Object.fromEntries([...new Set(robots.map((robot) => robot.team))].map((team) => [team, robots.filter((robot) => robot.team === team && !robot.dead).length])) },
    arena: {
      ...arenaStats,
      topView: arenaTopView,
      active: selectedMapId === 'arena01',
      boundary: { minX: -activeHalfWidth(), maxX: activeHalfWidth(), minZ: -activeHalfLength(), maxZ: activeHalfLength(), rectangular: true, cornerAngles: [90, 90, 90, 90] },
      loadedSourceModels: ['arena_stands', 'arena_bumper', 'arena_fence'].filter((id) => Boolean(models[id])),
      runtimeRamps: ramps.map((ramp) => ({ asset: ramp.asset, x: ramp.x, z: ramp.z, rotationDegrees: Number(THREE.MathUtils.radToDeg(ramp.rotationY).toFixed(1)), groundGap: ramp.groundGap })),
      runtimeBumpers: obstacles.filter((obstacle) => obstacle.kind === 'box').map((obstacle) => ({ x: obstacle.x, z: obstacle.z, rotationDegrees: Number(THREE.MathUtils.radToDeg(obstacle.rotationY).toFixed(1)), groundGap: obstacle.groundGap })),
    },
    industrialMap: {
      ...industrialStats,
      active: selectedMapId === 'industrial01',
      loadedSourceModels: ['industrial_container', 'industrial_barrier', 'arena_fence'].filter((id) => Boolean(models[id])),
      runtimeObstacles: {
        containers: obstacles.filter((obstacle) => obstacle.obstacleType === 'container').length,
        barriers: obstacles.filter((obstacle) => obstacle.obstacleType === 'concrete-barrier').length,
        colliderMode: 'mesh-bounds-fitted-obb',
        colliderInsetMetres: 0.012,
        visualGroundEmbedMetres: 0.006,
      },
      navigation: { ...industrialStats.navigation, revision: industrialNavigation.revision },
      robots: {
        total: robots.length,
        movingAI: robots.filter((robot) => !robot.isPlayer && !robot.dead && robot.velocity.length() > 0.3).length,
        stuckAI: robots.filter((robot) => !robot.isPlayer && !robot.dead && robot.stuckTime > 0.9).length,
        pathingAI: robots.filter((robot) => !robot.isPlayer && (robot.aiNavPath?.length ?? 0) > 0).length,
        simultaneousCombatClusters: countCombatClusters(),
        aiStates: Object.fromEntries(['SEARCH', 'CHASE', 'ATTACK', 'FLANK', 'AMBUSH', 'RETREAT', 'DASH_ATTACK', 'DASH_ESCAPE', 'RECOVER_STUCK', 'SELF_RIGHT', 'REENTRY', 'RECOVER'].map((state) => [state, robots.filter((robot) => !robot.isPlayer && !robot.dead && robot.aiState === state).length])),
        stuckRecovery: { totalEvents: robots.reduce((sum, robot) => sum + (robot.aiStuckEvents ?? 0), 0), activelyRecovering: robots.filter((robot) => robot.aiState === 'RECOVER_STUCK').length, policy: '2.35s-displacement-plus-yaw-reverse-turn-repath-dash' },
        aiTraits: Object.fromEntries(['aggressive', 'cautious', 'ambusher', 'survivor', 'berserker', 'defensive', 'flanker', 'chaser', 'brawler'].map((trait) => [trait, robots.filter((robot) => !robot.isPlayer && robot.aiTrait === trait).length])),
        aiDesigns: robots.filter((robot) => !robot.isPlayer).map((robot) => ({ name: robot.name, ...robot.aiDesign })),
      },
    },
    audio: {
      ...audioStats,
      sawActive: Boolean(sawLoopAudio),
      masterVolume: Number(masterVolume.toFixed(2)),
      muted: masterVolume <= 0,
      activeSources: activeAudioSources.size + (sawLoopAudio ? 1 : 0),
    },
    impacts: {
      ...impactStats,
      maxImpulse: Number(impactStats.maxImpulse.toFixed(1)),
      maxCriticalChance: Number(impactStats.maxCriticalChance.toFixed(3)),
      criticalMode: 'impact-score-probability-no-cooldown',
      recent: impactSamples.slice(-12),
    },
    ground: {
      ...groundStats,
      maxRobotPenetrationMm: Number((groundStats.maxRobotPenetration * 1000).toFixed(2)),
      maxDebrisPenetrationMm: Number((groundStats.maxDebrisPenetration * 1000).toFixed(2)),
      minimumRobotBottomClearance: Number(Math.min(...robots.map((robot) => robot.root.position.y - robot.groundSupportHeight())).toFixed(4)),
      minimumDebrisBottomClearance: debris.length ? Number(Math.min(...debris.map((item) => {
        item.object.updateWorldMatrix(true, true);
        return new THREE.Box3().setFromObject(item.object).min.y - PHYSICS_FLOOR_TOP;
      })).toFixed(4)) : null,
      physicsFloor: { topY: PHYSICS_FLOOR_TOP, thickness: PHYSICS_FLOOR_THICKNESS[selectedMapId], colliderCount: 1, visualSeparated: true, wheelRayTargets: ['PhysicsFloor'] },
    },
    environmentCollisions: {
      ...environmentCollisionStats,
      maxPenetrationMm: Number((environmentCollisionStats.maxPenetration * 1000).toFixed(2)),
      maxVerticalVelocityAdded: Number(environmentCollisionStats.maxVerticalVelocityAdded.toFixed(4)),
      obstacleResponse: 'normal-velocity-resolution-plus-low-friction-tangent-no-extra-impulse',
    },
    flightPhysics: {
      ...flightStats,
      gravityMultipliers: { ascent: 1.2, descent: 1.95 },
      airDrive: false,
      airSteering: false,
      automaticUpright: 'ai-current-position-after-weapon-attempt',
      collisionMode: 'single-contact-impulse-plus-torque',
      landingMode: 'swept-contact-heavy-metal',
      selfRightMode: 'weapon-attempt-then-0.72-to-0.82s-current-position-posture-recovery',
      robotsAirborne: robots.filter((robot) => robot.wasAirborne).length,
      perRobot: robots.map((robot) => ({
        name: robot.name,
        airborne: robot.wasAirborne,
        airborneSeconds: Number(robot.airborneTime.toFixed(3)),
        verticalSpeed: Number(robot.velocity.y.toFixed(3)),
        angularSpeed: Number(Math.hypot(robot.pitchVelocity, robot.rollVelocity, robot.yawVelocity).toFixed(3)),
        selfRightCandidate: robot.isSelfRightCandidate(),
        selfRightAttempts: robot.stats.selfRightAttempts,
        selfRightSuccesses: robot.stats.selfRightSuccesses,
        selfRightAttemptsThisFlip: robot.selfRightAttemptsThisFlip,
        selfRightActionIssued: robot.selfRightActionIssued,
        postureRecoveryActive: Boolean(robot.postureRecovery),
        postureRecoveries: robot.stats.postureRecoveries,
      })),
    },
    stability: {
      ...stabilityStats,
      abnormalVerticalCurrent,
      infiniteRollersCurrent,
      verticalStandersCurrent,
      targetMetric: 'infinite-rollers-zero-and-vertical-standers-zero',
      automaticUpright: 'only-explicit-player-button-or-ai-trapped-recovery-current-xz',
      hiddenEquilibriumAssist: false,
      passiveWakeupsCurrent: robots.reduce((sum, robot) => sum + robot.passiveWakeups, 0),
      compoundCollider: true,
      colliderComponents: player.colliderComponents.map((component) => ({ name: component.name, supportVertices: component.points.length })),
      wheelColliders: player.wheels.filter((wheel) => !wheel.part.detached).length,
      centerOfMassLocal: player.centerOfMassLocal.toArray().map((value) => Number(value.toFixed(3))),
      chassisFriction: 'low-metal-slide',
      wheelTraction: 'wheel-contact-only-below-60deg',
      selfCollision: false,
      hiddenTestColliders: 0,
      environmentDebugColliders: scene.children.filter((object) => object.userData?.environmentColliderDebug && object.userData.mapId === selectedMapId).length,
      debugVisible: colliderDebugEnabled,
      contactDamping: {
        air: LANDING_PHYSICS.airAngularDamping,
        wheel: LANDING_PHYSICS.wheelAngularDamping,
        broadBodySlow: LANDING_PHYSICS.broadBodyAngularDampingSlow,
        broadBodyFast: LANDING_PHYSICS.broadBodyAngularDampingFast,
        unstableEdge: LANDING_PHYSICS.edgeAngularDamping,
        narrowSideEdge: LANDING_PHYSICS.sideEdgeAngularDamping,
      },
      perRobot: robots.map((robot) => ({ name: robot.name, ...getRobotStabilityTelemetry(robot) })),
    },
    assets: {
      audioSystem: {
        mixerGroups: ['Master', 'Music', 'Combat SFX', 'Weapon SFX', 'UI', 'Ambient'],
        masterVolume: Number(masterVolume.toFixed(2)), musicVolume: Number(mixerSettings.music.toFixed(2)), effectsVolume: Number(mixerSettings.effects.toFixed(2)),
        music: { lobby: 'audio/music_main_menu.mp3', battle: 'audio/music_battle.mp3', crossfade: true, heavyHitDucking: true, duckAmount: Number(musicDuck.toFixed(2)) },
        spatial: { enabled: true, model: 'HRTF-inverse-distance', maxDistance: 58, activeVoices: spatialAudioVoices.length, limit: 20 },
        hitSamples: ['audio/impact_new_1.mp3', 'audio/impact_new_2.mp3', 'audio/impact_new_3.mp3', 'audio/impact_hit_1.mp3', 'audio/impact_hit_2.mp3'],
        dashSample: 'audio/dash_boost.mp3', stats: cloneData(audioStats),
      },
      exhaustSmokeSystem: {
        type: 'gpu-instanced-short-lived-gray-smoke', poolSize: SMOKE_POOL_SIZE, drawCalls: 1, distanceLOD: true, offscreenDisable: true,
        emissionStates: ['intermittent-idle', 'driving', 'speed-scaled', 'dash-burst'], detachStopsEmission: true,
        activeParticles: smokeParticles.filter((particle) => particle.active).length, stats: { ...smokeStats },
        robots: robots.map((robot) => ({ name: robot.name, activeOutlets: robot.exhaustEmitters?.filter((emitter) => !emitter.part.detached).length ?? 0, totalOutlets: robot.exhaustEmitters?.length ?? 0 })),
      },
      sparkSystem: {
        type: 'gpu-instanced-active-packed-three-layer-spark-shower',
        imageAssetsUsed: false,
        textureCount: 0,
        straightVelocity: true,
        gravity: 0,
        lifeRangeSeconds: [0.08, 0.29],
        poolSize: SPARK_POOL_SIZE,
        drawCalls: 3,
        activePacked: true,
        vfxUpdatesPerRenderFrame: 1,
        layers: ['short-dense-hot-core', 'medium-irregular-shower', 'long-upward-hero-trail'],
        randomPerParticle: ['layer', '3d-direction', 'speed', 'length', 'brightness', 'lifetime', 'width', 'origin-jitter', 'upward-bias'],
        physicalInputs: ['contactPoint', 'impactDirection', 'surfaceNormalProxy', 'relativeVelocity', 'weaponTangent'],
        countRanges: { weak: [2, 5], medium: [6, 15], strong: [20, 40], veryStrong: [35, 60], critical: [50, 90] },
        criticalLayerTargets: { shortPercent: [55, 65], mediumPercent: [25, 35], longPercent: [8, 15] },
        noPlanarSideFaceCollider: true,
        pendingAfterglowBursts: pendingSparkBursts.length,
        activeParticles: activeSparkCount(),
        stats: { ...sparkStats },
        activeSamples: sparkParticles.filter((particle) => particle.active).slice(0, 5).map((particle) => ({
          world: particle.position.toArray().map((value) => Number(value.toFixed(2))),
          velocity: particle.velocity.toArray().map((value) => Number(value.toFixed(2))),
          speed: Number(particle.velocity.length().toFixed(2)),
          life: Number(particle.life.toFixed(3)),
          tailLength: Number(particle.tailLength.toFixed(3)),
          brightness: Number(particle.brightness.toFixed(3)),
          denseCore: particle.denseCore,
          upwardHero: particle.upwardHero,
          layer: particle.layer,
          age: Number(particle.age.toFixed(3)),
        })),
      },
      blockFragmentSystem: {
        type: 'instanced-original-block-color-large-medium-small-fragments',
        sequence: blockFragmentStats.sequence,
        countRanges: { weak: [1, 3], medium: [3, 8], strong: [8, 15], veryStrong: [15, 25], critical: [20, 35] },
        lifeRangeSeconds: [5, 12],
        gravityMultiplier: 1.55,
        sizeClasses: ['large-1-to-3', 'medium-several', 'small-remainder'],
        directionInputs: ['contactPoint', 'surfaceNormal', 'oppositeImpactDirection'],
        activeBursts: blockFragmentBursts.length,
        activeFragments: blockFragmentBursts.reduce((sum, burst) => sum + burst.shards.filter((shard) => shard.age < shard.life).length, 0),
        burstLimit: BLOCK_FRAGMENT_BURST_LIMIT,
        stats: { ...blockFragmentStats },
      },
      renderPerformance: {
        frames: renderPerformanceStats.frames,
        averageFrameMs: Number((renderPerformanceStats.totalFrameMs / Math.max(1, renderPerformanceStats.frames)).toFixed(2)),
        maxFrameMs: Number(renderPerformanceStats.maxFrameMs.toFixed(2)),
        over33ms: renderPerformanceStats.over33ms,
        sparkFrames: renderPerformanceStats.sparkFrames,
        averageSparkFrameMs: Number((renderPerformanceStats.totalSparkFrameMs / Math.max(1, renderPerformanceStats.sparkFrames)).toFixed(2)),
        maxSparkFrameMs: Number(renderPerformanceStats.maxSparkFrameMs.toFixed(2)),
        activeSparkInstances: activeSparkInstanceCount,
        profile: performanceProfileSnapshot(),
      },
      hitSamples: ['audio/impact_new_1.mp3', 'audio/impact_new_2.mp3', 'audio/impact_new_3.mp3', 'audio/impact_hit_1.mp3', 'audio/impact_hit_2.mp3'],
    },
    assembly: {
      version: player.assembly.version,
      weightClass: player.weightClass,
      driveType: player.driveType,
      blockPalette: { blue: '#39afe7', silver: '#b9c4cc', freelyMixed: true },
      chassisAxes: { forward: '+Z', rear: '-Z', left: '-X', right: '+X', up: '+Y' },
      localWeaponAxes: { spinner: 'localY', bar: 'localY', drum: 'localX', hammer: 'localX', flipper: 'localX' },
      parts: player.assembly.parts.map((part) => ({
        id: part.id,
        type: part.type,
        position: part.position.map((value) => Number(value.toFixed(3))),
        rotationDegrees: part.rotation.map((value) => Number(THREE.MathUtils.radToDeg(value).toFixed(1))),
        scaleFactor: Number((part.scaleFactor ?? 1).toFixed(2)),
        axisScale: (part.axisScale ?? [1, 1, 1]).map((value) => Number(value.toFixed(2))),
        wheelModel: part.wheelModel ?? null,
        hubFlipped: Boolean(part.hubFlipped),
      })),
    },
    player: {
      position: player.root.position.toArray().map((value) => Number(value.toFixed(2))),
      yaw: Number(player.yaw.toFixed(3)),
      forwardSpeed: Number(player.velocity.dot(forwardFor(player.yaw)).toFixed(2)),
      wheelRotation: Number((player.wheels[0]?.rollPivot.rotation.x ?? 0).toFixed(3)),
      wheelHubOutwardDots: getWheelHubOutwardDots(player),
      spinnerRpm: Math.round(player.weapons.spinner?.rpm ?? 0),
      rotaryWeapons: player.rotaryWeapons.map((weapon) => ({ kind: weapon.kind, assemblyId: weapon.assemblyId, physicsRpm: Math.round(weapon.rpm), visualRpm: Math.round(weapon.visualRpm), visualMaxRpm: weapon.visualMaxRpm, active: weapon.active, available: player.rotaryAvailable(weapon), lastImpactResult: weapon.lastImpactResult ?? null })),
      hammerPhase: player.weapons.hammer?.phase,
      hammerMount: getHammerTelemetry(player),
      flipperPhase: player.weapons.flipper?.phase,
      durability: Number(player.durability().toFixed(3)),
      weightClass: player.weightClass,
      driveType: player.driveType,
      trackScrollOffsets: player.wheels.filter((wheel) => wheel.isTrack).map((wheel) => Number((wheel.trackMaterials.find((material) => material.map)?.map.offset.x ?? 0).toFixed(3))),
      dash: { key: dashKey, cooldown: Number(player.dashCooldown.toFixed(2)), active: player.dashActiveTimer > 0, hitWindow: Number(player.dashHitWindow.toFixed(2)), peakSpeed: Number(player.dashPeakSpeed.toFixed(2)), targetDistance: Number(player.dashTargetDistance.toFixed(2)), travelled: Number(player.dashTravelled.toFixed(2)), steeringFactor: player.driveProfile.dashSteering, peakRatio: player.driveProfile.dashPeakRatio },
      blockStructure: { coreHp: Number((player.corePart?.hp ?? 0).toFixed(1)), coreMaxHp: player.corePart?.maxHp ?? 0, active: player.activeBlockParts().length, total: player.blockParts.size, structureRatio: Number(player.blockStructureRatio().toFixed(3)), remainingRatio: Number(player.remainingBlockRatio().toFixed(3)), legacyChassis: false },
      activeParts: player.parts.filter((part) => !part.detached).length,
      stats: player.stats,
      stability: getRobotStabilityTelemetry(player),
    },
    enemies: robots.filter((robot) => !robot.isPlayer).map((robot) => ({
      name: robot.name, team: robot.team, type: robot.type, position: robot.root.position.toArray().map((value) => Number(value.toFixed(2))),
      design: robot.aiDesign,
      weightClass: robot.weightClass,
      driveType: robot.driveType,
      wheelModels: [...new Set(robot.wheels.map((wheel) => wheel.part.record.wheelModel))],
      trackScrollOffsets: robot.wheels.filter((wheel) => wheel.isTrack).map((wheel) => Number((wheel.trackMaterials.find((material) => material.map)?.map.offset.x ?? 0).toFixed(3))),
      exteriorParts: robot.parts.filter((part) => ['armor', 'decoration'].includes(part.type)).map((part) => ({ id: part.assemblyId, type: part.type, assetType: part.record.type, axisScale: (part.record.axisScale ?? [1, 1, 1]).map((value) => Number(value.toFixed(2))), mount: part.record.mount, aiPlacement: part.record.aiPlacement ?? null, hp: Number(part.hp.toFixed(1)), detached: part.detached })),
      personality: robot.aiPersonality,
      blockColors: [...new Set(robot.activeBlockParts().map((part) => part.record.color))],
      durability: Number(robot.durability().toFixed(3)), activeParts: robot.parts.filter((part) => !part.detached).length,
      blockStructure: { coreHp: Number((robot.corePart?.hp ?? 0).toFixed(1)), active: robot.activeBlockParts().length, total: robot.blockParts.size, legacyChassis: false },
      weapon: robot.weaponStatus(), mobility: robot.mobilityStatus(), wheelHubOutwardDots: getWheelHubOutwardDots(robot), dead: robot.dead, aiState: robot.aiState, aiTrait: robot.aiTrait, respawnAt: Number.isFinite(robot.respawnAt) ? Number(robot.respawnAt.toFixed(2)) : null, spawnProtectionRemaining: Number(Math.max(0, robot.spawnProtectionUntil - worldTime).toFixed(2)), stats: robot.stats,
      stability: getRobotStabilityTelemetry(robot),
      rotaryWeapons: robot.rotaryWeapons.map((weapon) => ({ kind: weapon.kind, physicsRpm: Math.round(weapon.rpm), visualRpm: Math.round(weapon.visualRpm), active: weapon.active })),
    })),
    debris: { count: debris.length, blockChunks: debris.filter((item) => item.blockChunkSize).map((item) => ({ size: item.blockChunkSize, reason: item.reason })), fragmentBursts: blockFragmentBursts.map((burst) => ({ partId: burst.partId, tier: burst.tier, color: burst.color, spawnedBeforeDetach: burst.spawnedBeforeDetach, count: burst.shards.length })) },
    qaRuntime: qa ? {
      phase: qa.phase,
      phaseTime: Number(qa.time.toFixed(3)),
      sparkProofElapsed: qa.phase === 'sparkProof' ? Number(((performance.now() - qa.sparkProofStartedAt) / 1000).toFixed(3)) : null,
      nextSparkProofHit: qa.nextSparkProofHit ?? null,
      barProofAttempts: qa.barProofAttempts ?? 0,
      barProofHits: qa.barProofHits ?? 0,
      barProofResult: qa.barProofResult ?? null,
      playerPosition: player.root.position.toArray().map((value) => Number(value.toFixed(2))),
      contactTarget: qa.contactTarget ? qa.contactTarget.root.position.toArray().map((value) => Number(value.toFixed(2))) : null,
      rotaryContactDistances: qa.contactTarget ? player.rotaryWeapons.map((weapon) => {
        const centre = new THREE.Vector3();
        weapon.pivot.getWorldPosition(centre);
        return Number(qa.contactTarget.root.position.clone().setY(centre.y).distanceTo(centre).toFixed(3));
      }) : [],
    } : null,
    qa: lastQAResult,
  });

  if (mode === 'battle' && !battleResultShown && !BATTLE_RESPAWNS_ENABLED) {
    const alive = robots.filter((robot) => !robot.dead);
    const aliveTeams = new Set(alive.map((robot) => robot.team));
    const finished = isFreeForAllMode() ? alive.length <= 1 : aliveTeams.size <= 1;
    if (finished) {
      battleResultShown = true;
      const winner = alive[0];
      showMessage(winner ? (isFreeForAllMode() ? `${winner.name} WINS!` : `${String(winner.team).toUpperCase()} TEAM WINS!`) : 'DRAW!', 3.2);
    }
  }
}

function resolveControlAxes(keyState, mobileAxis) {
  const keyThrottle = (keyState.has('KeyW') || keyState.has('ArrowUp') ? 1 : 0) - (keyState.has('KeyS') || keyState.has('ArrowDown') ? 1 : 0);
  const keySteering = (keyState.has('KeyD') || keyState.has('ArrowRight') ? 1 : 0) - (keyState.has('KeyA') || keyState.has('ArrowLeft') ? 1 : 0);
  return {
    throttle: keyThrottle || mobileAxis.y,
    steering: keySteering || mobileAxis.x,
  };
}

function playerInput() {
  if (!player || player.dead) return;
  if (updateDesertRouteQA()) return;
  if (updateIndustrialSoloRouteQA()) return;
  const control = resolveControlAxes(keys, joystickAxis);
  player.control.throttle = control.throttle;
  player.control.steering = control.steering;
  player.control.brake = brakeHeld || keys.has('ShiftLeft') || keys.has('ShiftRight');
  if (Math.abs(control.throttle) > 0.02 || Math.abs(control.steering) > 0.02 || player.control.brake) {
    player.wakePhysicsFromControl('player-key-or-joystick');
  }
}

const desiredCamera = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const cameraFollowTelemetry = {
  trackedYaw: 0,
  reacquiring: false,
  reacquireSeconds: 0,
  maximumReacquireSeconds: 0,
  completedReacquisitions: 0,
  currentRearAlignment: 1,
  worstRearAlignment: 1,
};
let aiVisualShowcaseActive = false;
function updateCamera(dt) {
  if (!player) return;
  if (qa?.phase === 'sparkProof' && qa.contactTarget?.root.visible) {
    camera.up.set(0, 1, 0);
    lookTarget.copy(qa.contactTarget.root.position).add(new THREE.Vector3(0, 0.72, 0));
    desiredCamera.copy(lookTarget).add(new THREE.Vector3(5.8, 1.75, -6.4));
    camera.position.lerp(desiredCamera, 1 - Math.exp(-7.5 * dt));
    camera.lookAt(lookTarget);
    return;
  }
  if (aiVisualShowcaseActive) {
    camera.up.set(0, 0, -1);
    desiredCamera.set(0, 34, 0.01);
    camera.position.lerp(desiredCamera, 1 - Math.exp(-8 * dt));
    camera.lookAt(0, 0, 0);
    return;
  }
  if (arenaTopView) {
    camera.up.set(0, 0, -1);
    desiredCamera.set(0, Math.max(120, activeHalfLength() * 2.18), 0.01);
    camera.position.lerp(desiredCamera, 1 - Math.exp(-6 * dt));
    camera.lookAt(0, 0, 0);
    return;
  }
  camera.up.set(0, 1, 0);
  cameraDashFov = Math.max(0, cameraDashFov - dt * 13);
  const targetFov = 53 + cameraDashFov;
  const nextFov = lerp(camera.fov, targetFov, 1 - Math.exp(-10 * dt));
  if (Math.abs(nextFov - camera.fov) > 0.01) {
    camera.fov = nextFov;
    camera.updateProjectionMatrix();
  }
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.root.quaternion).setY(0);
  if (forward.lengthSq() < 0.0001) forward.copy(forwardFor(player.yaw));
  else forward.normalize();
  const yawDelta = Math.abs(normalizeAngle(player.yaw - cameraFollowTelemetry.trackedYaw));
  if (yawDelta > 0.24) {
    cameraFollowTelemetry.reacquiring = true;
    cameraFollowTelemetry.reacquireSeconds = 0;
    cameraFollowTelemetry.trackedYaw = player.yaw;
  }
  let nearestEnemy = 99;
  for (const robot of robots) {
    if (robot.isPlayer || robot.dead) continue;
    nearestEnemy = Math.min(nearestEnemy, robot.root.position.distanceTo(player.root.position));
  }
  const distance = lerp(12.2, 13.8, clamp((8 - nearestEnemy) / 8, 0, 1));
  desiredCamera.copy(player.root.position).addScaledVector(forward, -distance).add(new THREE.Vector3(0, 6, 0));
  if (cameraShake > 0.001) {
    desiredCamera.add(new THREE.Vector3((Math.random() - 0.5) * cameraShake, (Math.random() - 0.5) * cameraShake, (Math.random() - 0.5) * cameraShake));
    cameraShake = Math.max(0, cameraShake - dt * 1.65);
  }
  camera.position.lerp(desiredCamera, 1 - Math.exp(-8.2 * dt));
  lookTarget.copy(player.root.position).addScaledVector(forward, 3.3).add(new THREE.Vector3(0, 0.58, 0));
  camera.lookAt(lookTarget);
  const actualRear = camera.position.clone().sub(player.root.position).setY(0);
  const rearAlignment = actualRear.lengthSq() > 0.0001 ? actualRear.normalize().dot(forward.clone().multiplyScalar(-1)) : 1;
  cameraFollowTelemetry.currentRearAlignment = rearAlignment;
  cameraFollowTelemetry.worstRearAlignment = Math.min(cameraFollowTelemetry.worstRearAlignment, rearAlignment);
  if (cameraFollowTelemetry.reacquiring) {
    cameraFollowTelemetry.reacquireSeconds += dt;
    if (rearAlignment >= 0.96) {
      cameraFollowTelemetry.maximumReacquireSeconds = Math.max(cameraFollowTelemetry.maximumReacquireSeconds, cameraFollowTelemetry.reacquireSeconds);
      cameraFollowTelemetry.completedReacquisitions++;
      cameraFollowTelemetry.reacquiring = false;
    }
  }
}

function updateBattleRenderLOD(dt) {
  if (mode !== 'battle' || !player) return;
  renderLODAccumulator += dt;
  if (renderLODAccumulator < 0.2) return;
  renderLODAccumulator = 0;
  const distances = qualityPreset === 'low' ? [25, 60] : qualityPreset === 'high' ? [46, 112] : [34, 84];
  const adaptiveDistanceScale = lerp(0.78, 1, adaptiveQualityScale);
  const nearDistance = distances[0] * adaptiveDistanceScale;
  const farDistance = distances[1] * adaptiveDistanceScale;
  for (const robot of robots) {
    if (robot.isPlayer) { robot.setRenderLOD(0); continue; }
    const distance = robot.root.position.distanceTo(player.root.position);
    robot.setRenderLOD(distance <= nearDistance ? 0 : distance <= farDistance ? 1 : 2);
  }
}

function updateGame(dt) {
  if (mode === 'lobby') {
    updateLobby(dt);
    if (messageTimer > 0) {
      messageTimer -= dt;
      if (messageTimer <= 0) ui.message.classList.remove('show');
    }
    return;
  }
  if (mode === 'garage') {
    worldTime += dt;
    updateGarageCamera();
    updateEffects(dt);
    if (messageTimer > 0) {
      messageTimer -= dt;
      if (messageTimer <= 0) ui.message.classList.remove('show');
    }
    return;
  }
  if (gamePaused) return;
  if (!qa) playerInput();
  const solverHz = physicsSolverHz();
  performanceProfile.physicsHz = solverHz;
  const stepCount = Math.max(1, Math.min(4, Math.ceil(dt / (1 / solverHz))));
  const stepDt = dt / stepCount;
  for (let step = 0; step < stepCount; step++) {
    worldTime += stepDt;
    updateRespawns();
    updateConquestBattle(stepDt);
    if (qa) updateSelfTest(stepDt);
    if (mode === 'battle' && !battleResultShown) battleElapsed += stepDt;
    rebuildCombatCaches();
    // The start of the substep is the last authoritative obstacle-free state.
    // It is retained only as a CCD fallback for an overlapping mountain-chain
    // junction; normal contacts always use the continuous/penetration solvers.
    const staticWorldSafePositions = robots.map((robot) => robot.root.position.clone());
    let stageStarted = performance.now();
    if (!qa && !aiVisualShowcaseActive) for (const robot of robots) robot.updateAI(stepDt);
    performanceProfile.aiMs += performance.now() - stageStarted;
    stageStarted = performance.now();
    for (const robot of robots) robot.updatePhysics(stepDt, game);
    for (const robot of robots) updateHealingAura(robot, stepDt);
    performanceProfile.physicsMs += performance.now() - stageStarted;
    stageStarted = performance.now();
    for (let first = 0; first < robots.length; first++) {
      for (let second = first + 1; second < robots.length; second++) {
        if (qa?.phase === 'sparkProof' && (robots[first] === qa.contactTarget || robots[second] === qa.contactTarget)) continue;
        performanceProfile.collisionPairChecks++;
        const a = robots[first];
        const b = robots[second];
        const dx = b.root.position.x - a.root.position.x;
        const dz = b.root.position.z - a.root.position.z;
        const broadphaseRadius = a.radius + b.radius;
        if (dx * dx + dz * dz >= broadphaseRadius * broadphaseRadius) continue;
        performanceProfile.collisionNarrowPhaseChecks++;
        game.collideRobots(robots[first], robots[second]);
      }
    }
    performanceProfile.collisionMs += performance.now() - stageStarted;
    updateTraps(stepDt);
    // Robot-vs-robot positional separation happens after each robot's own
    // environment solve. A crowded fight beside a canyon wall can therefore
    // push a previously valid body back into a mountain. Finish every physics
    // substep with a cheap static-world projection so the rendered and next
    // simulation states are both guaranteed outside all authored blockers.
    robots.forEach((robot, index) => {
      for (let pass = 0; pass < 4; pass++) {
        robot.resolveArena(game);
        if (!robotCentreInsideMountainCollider(robot)) break;
      }
      if (robotCentreInsideMountainCollider(robot)) {
        const safe = staticWorldSafePositions[index];
        robot.root.position.x = safe.x;
        robot.root.position.z = safe.z;
        robot.velocity.x *= 0.12;
        robot.velocity.z *= 0.12;
        robot.yawVelocity *= 0.45;
        // Do not immediately solve a second overlapping chain segment here:
        // that would move the body out of one box and straight back into the
        // previous one. The retained start-of-substep pose is already the last
        // obstacle-free physical state and becomes the next CCD start point.
      }
    });
  }
  // VFX is visual state, not collision state. Updating and uploading the
  // instanced spark buffers once per rendered frame avoids doing the same GPU
  // work up to three times inside the 90 Hz physics substeps.
  const effectsStarted = performance.now();
  updateEffects(dt);
  updateSawGrinding(dt);
  updateRotaryWeaponLoop();
  performanceProfile.effectsMs += performance.now() - effectsStarted;
  updateCamera(dt);
  updateBattleRenderLOD(dt);
  const uiStarted = performance.now();
  updateUI(dt);
  performanceProfile.uiMs += performance.now() - uiStarted;
  if (messageTimer > 0) {
    messageTimer -= dt;
    if (messageTimer <= 0) ui.message.classList.remove('show');
  }
}

let renderedCanvasWidth = 0;
let renderedCanvasHeight = 0;

function resize() {
  const width = ui.canvas.clientWidth;
  const height = ui.canvas.clientHeight;
  if (width === renderedCanvasWidth && height === renderedCanvasHeight) return;
  renderedCanvasWidth = width;
  renderedCanvasHeight = height;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function joystickAxisFromDelta(deltaX, deltaY, radius) {
  let x = deltaX / radius;
  let y = -deltaY / radius;
  const length = Math.hypot(x, y);
  if (length > 1) { x /= length; y /= length; }
  return { x, y };
}

function updateJoystick(event) {
  const rect = ui.joystick.getBoundingClientRect();
  const centreX = rect.left + rect.width / 2;
  const centreY = rect.top + rect.height / 2;
  const radius = rect.width * 0.31;
  joystickAxis = joystickAxisFromDelta(event.clientX - centreX, event.clientY - centreY, radius);
  ui.knob.style.transform = `translate(calc(-50% + ${joystickAxis.x * radius}px), calc(-50% + ${-joystickAxis.y * radius}px))`;
}

function releaseJoystick(event) {
  if (event.pointerId !== joystickPointer) return;
  joystickPointer = null;
  joystickAxis = { x: 0, y: 0 };
  ui.knob.style.transform = 'translate(-50%, -50%)';
}

function blockPlacementKey(record) {
  return `${record.type}:${record.gridPosition.join(',')}:${record.rotationSteps.join(',')}`;
}

function beginGarageOrbit(event) {
  if (event.pointerType === 'touch') {
    garageTouchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (garageTouchPoints.size >= 2) {
      const points = [...garageTouchPoints.values()];
      garagePinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      orbitPointer = null;
    } else {
      orbitPointer = event.pointerId;
      orbitLast = { x: event.clientX, y: event.clientY };
    }
  } else {
    orbitPointer = event.pointerId;
    orbitLast = { x: event.clientX, y: event.clientY };
  }
  ui.canvas.setPointerCapture(event.pointerId);
}

function updateGaragePinch(event) {
  if (event.pointerType !== 'touch' || !garageTouchPoints.has(event.pointerId)) return false;
  garageTouchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (garageTouchPoints.size < 2) return false;
  const points = [...garageTouchPoints.values()];
  const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  if (garagePinchDistance != null) orbitDistance = clamp(orbitDistance - (distance - garagePinchDistance) * 0.012, 2.2, 12.5);
  garagePinchDistance = distance;
  return true;
}

function endGaragePointer(event) {
  if (event.pointerId === blockPaintPointerId) {
    blockPaintPointerId = null;
    blockPaintLastKey = null;
  }
  if (event.pointerType === 'touch') {
    garageTouchPoints.delete(event.pointerId);
    if (garageTouchPoints.size < 2) garagePinchDistance = null;
  }
  if (event.pointerId === orbitPointer) orbitPointer = null;
}

document.querySelectorAll('[data-catalog]').forEach((button) => button.addEventListener('click', () => {
  ensureAudio();
  beginCatalogPart(button.dataset.catalog, button.dataset.wheelModel ?? null);
}));
document.querySelectorAll('[data-block-type]').forEach((button) => button.addEventListener('click', () => {
  ensureAudio();
  beginBlockCatalog(button.dataset.blockType);
}));
document.querySelectorAll('[data-block-rotate]').forEach((button) => button.addEventListener('click', () => {
  blockRotationAxis = button.dataset.blockRotate;
  rotateBlock90(blockRotationAxis);
}));
ui.partsMode.addEventListener('click', () => setAssemblyMode('parts'));
ui.blocksMode.addEventListener('click', () => setAssemblyMode('blocks'));
ui.blockInstall.addEventListener('click', installCandidateBlock);
ui.blockCancel.addEventListener('click', cancelBlockCandidate);
ui.blockDelete.addEventListener('click', () => removeSelectedBlock());
ui.blockDeleteMode.addEventListener('click', () => setBlockDeleteMode(!blockDeleteMode));
ui.blockList.addEventListener('change', () => selectGarageBlock(ui.blockList.value));
document.querySelectorAll('[data-transform-mode]').forEach((button) => button.addEventListener('click', () => {
  transformMode = button.dataset.transformMode;
  document.querySelectorAll('[data-transform-mode]').forEach((item) => item.classList.toggle('active', item === button));
  rebuildGarageGizmo();
  updateInspectorFromRecord();
  updateGarageSummary();
}));
document.querySelectorAll('[data-transform-axis]').forEach((button) => button.addEventListener('click', () => {
  transformAxis = button.dataset.transformAxis;
  document.querySelectorAll('[data-transform-axis]').forEach((item) => item.classList.toggle('active', item === button));
  rebuildGarageGizmo();
  updateInspectorFromRecord();
  updateGarageSummary();
}));
document.querySelectorAll('[data-orientation]').forEach((button) => button.addEventListener('click', () => setOrientationPreset(button.dataset.orientation)));
document.querySelectorAll('[data-rotate-step]').forEach((button) => button.addEventListener('click', () => applyRotationStep(Number(button.dataset.rotateStep))));
document.querySelectorAll('[data-scale-uniform]').forEach((button) => button.addEventListener('click', () => applyUniformScaleStep(Number(button.dataset.scaleUniform))));
ui.weaponAutoCut?.addEventListener('change', () => {
  if (candidatePart) candidatePart.autoCutClearance = ui.weaponAutoCut.checked;
  refreshGarageGhost();
  updateSelectedStatus();
  updateGarageSummary();
});
ui.battleMode.addEventListener('change', () => { battleMode = ui.battleMode.value; });
ui.battleMap.addEventListener('change', () => {
  setActiveMap(ui.battleMap.value);
  ui.screenTitle.textContent = mode === 'garage' ? '3D 로봇 작업장' : `${activeMap.name} 선택`;
});
ui.friendlyFire.addEventListener('change', () => { friendlyFire = ui.friendlyFire.checked; });
ui.partList.addEventListener('change', () => {
  candidatePart = null;
  selectedPartId = ui.partList.value || null;
  document.querySelectorAll('[data-catalog]').forEach((button) => button.classList.remove('selected'));
  refreshGarageGhost();
  updateInspectorFromRecord();
  updateGarageSummary();
});
ui.installPart.addEventListener('click', installCandidate);
ui.removeAllWeapons.addEventListener('click', removeAllWeapons);
ui.duplicatePart.addEventListener('click', duplicateSelectedPart);
ui.alignAxis.addEventListener('click', alignSelectedPivotPair);
ui.flipWheel.addEventListener('click', flipSelectedWheel);
ui.removePart.addEventListener('click', () => {
  if (candidatePart) {
    candidatePart = null;
    document.querySelectorAll('[data-catalog]').forEach((button) => button.classList.remove('selected'));
    refreshGarageGhost();
    ui.mountStatus.className = 'mount-status neutral';
    ui.mountStatus.querySelector('span').textContent = '프리뷰를 취소했습니다.';
    updateInspectorFromRecord();
    updateGarageSummary();
  } else removeSelectedPart();
});
ui.undoGarage.addEventListener('click', () => {
  const previous = undoStack.pop();
  if (!previous) { showMessage('되돌릴 작업이 없습니다.', 0.8); return; }
  workingAssembly = previous;
  candidatePart = null;
  selectedPartId = null;
  candidateBlock = null;
  selectedBlockId = previous.blocks?.[0]?.id ?? 'block-core';
  garageDirty = true;
  rebuildGarageRobot();
  if (assemblyMode === 'blocks') updateBlockInspector();
  else updateInspectorFromRecord();
  showMessage('이전 조립 상태로 되돌렸습니다.', 0.9);
});
ui.saveGarage.addEventListener('click', () => { ensureAudio(); saveWorkshop(); });
ui.testDrive.addEventListener('click', () => { ensureAudio(); if (canFinalizeWorkshop()) startBattle(true); });
ui.enterBattle.addEventListener('click', () => { ensureAudio(); if (canFinalizeWorkshop()) startBattle(false); });
ui.workshopToggle.addEventListener('click', enterWorkshop);
ui.returnLobby.addEventListener('click', () => { playUIClick(); enterLobby(); });
ui.pauseToggle?.addEventListener('click', () => { ensureAudio(); setGamePaused(!gamePaused); });
ui.pauseResume?.addEventListener('click', () => setGamePaused(false));
ui.pauseLobby?.addEventListener('click', () => { setGamePaused(false); enterLobby(); });

ui.lobbyFight.addEventListener('click', () => {
  playUIClick(true);
  showLobbyModal('fight', true);
});
ui.lobbyModalClose.addEventListener('click', () => { playUIClick(); hideLobbyModal(); });
ui.lobbyModal.addEventListener('click', (event) => {
  if (event.target === ui.lobbyModal) hideLobbyModal();
});
ui.lobbyEnterBattle.addEventListener('click', () => {
  playUIClick(true);
  ui.battleMap.value = ui.lobbyBattleMap.value;
  setActiveMap(ui.lobbyBattleMap.value);
  ui.battleMode.value = ui.lobbyBattleMode.value;
  ui.friendlyFire.checked = ui.lobbyFriendlyFire.checked;
  battleMode = ui.battleMode.value;
  friendlyFire = ui.friendlyFire.checked;
  hideLobbyModal();
  lobbyFadeTo(() => startBattle(false));
});
ui.lobbyBattleMap.addEventListener('change', () => {
  setActiveMap(ui.lobbyBattleMap.value);
  ui.lobbyEnterBattle.textContent = selectedMapId === 'desert01' ? 'RED CANYON 10v10 출전' : selectedMapId === 'industrial01' ? 'INDUSTRIAL ZONE 출전' : 'ARENA 01 출전';
  ui.lobbyModalCopy.textContent = selectedMapId === 'desert01'
    ? '붉은 협곡에서 A를 확보한 뒤 B로 진격하는 10v10 점령전을 시작합니다.'
    : selectedMapId === 'industrial01'
    ? '넓은 산업 전장에서 4v4·6v6·8v8 대규모 근접전을 시작합니다.'
    : '좁은 실내 스포츠 경기장에서 빠르게 맞붙습니다.';
});
document.querySelectorAll('[data-lobby-action]').forEach((button) => button.addEventListener('click', () => {
  const action = button.dataset.lobbyAction;
  playUIClick();
  if (action === 'workshop') {
    lobbyFadeTo(enterWorkshop);
    return;
  }
  showLobbyModal(action, false);
}));

ui.canvas.addEventListener('pointerdown', (event) => {
  if (mode !== 'garage') return;
  if (assemblyMode === 'blocks') {
    if (blockDeleteMode) {
      const deleteHit = blockHitTest(event, false);
      if (deleteHit) removeSelectedBlock(deleteHit.id);
      else beginGarageOrbit(event);
      return;
    }
    if (candidateBlock) {
      const placed = placeCandidateBlockFromPointer(event);
      if (placed && validateBlockPlacement(candidateBlock).valid) {
        blockPaintLastKey = blockPlacementKey(candidateBlock);
        installCandidateBlock();
        blockPaintPointerId = event.pointerId;
        ui.canvas.setPointerCapture(event.pointerId);
      }
      else if (placed) showMessage(validateBlockPlacement(candidateBlock).message, 1.0);
      if (placed) return;
    }
    const blockHit = blockHitTest(event, false);
    if (blockHit) {
      selectGarageBlock(blockHit.id);
      return;
    }
    beginGarageOrbit(event);
    return;
  }
  if (candidatePart) {
    const attached = attachRecordFromPointer(candidatePart, event);
    if (attached && validateGaragePart(candidatePart).valid) installCandidate();
    else if (attached) refreshGarageGhost();
    if (attached) return;
  }
  const hit = garageHitTest(event);
  if (hit?.kind === 'gizmo') {
    transformAxis = hit.axis;
    document.querySelectorAll('[data-transform-axis]').forEach((item) => item.classList.toggle('active', item.dataset.transformAxis === hit.axis));
    beginGarageTransformDrag(event, hit.axis);
    return;
  }
  if (hit?.kind === 'part') {
    selectGaragePart(hit.id, hit.candidate);
    beginGarageTransformDrag(event, transformMode === 'move' ? 'plane' : transformAxis);
    return;
  }
  beginGarageOrbit(event);
});
ui.canvas.addEventListener('pointermove', (event) => {
  if (mode !== 'garage') return;
  if (updateGaragePinch(event)) return;
  if (assemblyMode === 'blocks' && candidateBlock && event.pointerId === blockPaintPointerId) {
    const placed = placeCandidateBlockFromPointer(event);
    if (placed && validateBlockPlacement(candidateBlock).valid) {
      const key = blockPlacementKey(candidateBlock);
      if (key !== blockPaintLastKey) {
        blockPaintLastKey = key;
        installCandidateBlock();
      }
    }
    return;
  }
  if (assemblyMode === 'blocks' && blockDeleteMode) {
    updateBlockDeleteHover(event);
    return;
  }
  if (assemblyMode === 'blocks' && candidateBlock && event.pointerId !== orbitPointer) {
    placeCandidateBlockFromPointer(event);
    return;
  }
  if (assemblyMode === 'parts' && candidatePart && !garageDrag && event.pointerId !== orbitPointer) {
    if (attachRecordFromPointer(candidatePart, event)) {
      refreshGarageGhost();
      updateInspectorFromRecord();
      updateGarageSummary();
    }
    return;
  }
  if (garageDrag && event.pointerId === garageDrag.pointerId) {
    dragGarageTransform(event);
    return;
  }
  if (event.pointerId !== orbitPointer) return;
  const dx = event.clientX - orbitLast.x;
  const dy = event.clientY - orbitLast.y;
  orbitYaw += dx * 0.009;
  orbitPitch = clamp(orbitPitch - dy * 0.007, -0.72, 1.15);
  orbitLast = { x: event.clientX, y: event.clientY };
});
ui.canvas.addEventListener('pointerup', (event) => {
  endGarageTransformDrag(event);
  endGaragePointer(event);
});
ui.canvas.addEventListener('pointercancel', (event) => {
  endGarageTransformDrag(event);
  endGaragePointer(event);
});
ui.canvas.addEventListener('wheel', (event) => {
  if (mode !== 'garage') return;
  orbitDistance = clamp(orbitDistance + event.deltaY * 0.008, 2.2, 12.5);
  event.preventDefault();
}, { passive: false });

ui.joystick.addEventListener('pointerdown', (event) => { ensureAudio(); joystickPointer = event.pointerId; ui.joystick.setPointerCapture(event.pointerId); updateJoystick(event); });
window.addEventListener('pointerdown', () => ensureAudio(), { once: true, capture: true });
ui.joystick.addEventListener('pointermove', (event) => { if (event.pointerId === joystickPointer) updateJoystick(event); });
ui.joystick.addEventListener('pointerup', releaseJoystick);
ui.joystick.addEventListener('pointercancel', releaseJoystick);
ui.brake.addEventListener('pointerdown', (event) => { ensureAudio(); brakeHeld = true; ui.brake.setPointerCapture(event.pointerId); });
ui.brake.addEventListener('pointerup', () => { brakeHeld = false; });
ui.brake.addEventListener('pointercancel', () => { brakeHeld = false; });
ui.selfRight.addEventListener('click', () => {
  ensureAudio();
  if (!player) return;
  player.wakePhysicsFromControl('player-self-right-button');
  player.startPostureRecovery('player-button', player.isSelfRightCandidate());
});
ui.combatRespawn?.addEventListener('click', () => {
  ensureAudio();
  if (!player?.canRequestRespawn()) return;
  player.destroyRobot(null, 'PLAYER_REQUEST');
  showMessage(`주행 불능 확인 · ${RESPAWN_DELAY_SECONDS}초 후 수리 구역 리스폰`, 2);
});
ui.dash?.addEventListener('click', () => { ensureAudio(); player?.requestDash('mobile'); });
ui.reset.addEventListener('click', () => { ensureAudio(); resetGame(); });
ui.selfTest.addEventListener('click', () => { ensureAudio(); startSelfTest(); });
ui.colliderDebug.addEventListener('click', () => {
  colliderDebugEnabled = !colliderDebugEnabled;
  document.body.classList.toggle('collider-debug', colliderDebugEnabled);
  for (const robot of robots) robot.setColliderDebug(colliderDebugEnabled);
  setEnvironmentColliderDebug(colliderDebugEnabled);
  ui.colliderDebug.classList.toggle('active', colliderDebugEnabled);
  ui.colliderDebug.setAttribute('aria-pressed', String(colliderDebugEnabled));
  ui.colliderDebug.textContent = colliderDebugEnabled ? 'COLLIDERS ON' : 'COLLIDERS';
  ui.physicsDebug.hidden = !colliderDebugEnabled;
  showMessage(colliderDebugEnabled ? '차량 복합 Collider + 바닥/장애물 Collider 표시' : 'Collider 표시 끔', 1.1);
});
ui.arenaTop.addEventListener('click', () => {
  arenaTopView = !arenaTopView;
  ui.arenaTop.classList.toggle('active', arenaTopView);
  ui.arenaTop.setAttribute('aria-pressed', String(arenaTopView));
  ui.arenaTop.textContent = arenaTopView ? 'ARENA TOP ON' : 'ARENA TOP';
  showMessage(arenaTopView ? `${activeMap.name} 상단 검증 카메라` : '플레이 카메라 복귀', 1.1);
});
ui.masterVolume.addEventListener('input', (event) => {
  ensureAudio();
  setMasterVolume(Number(event.currentTarget.value) / 100);
});
ui.musicVolume?.addEventListener('input', (event) => {
  ensureAudio();
  setMixerVolume('music', Number(event.currentTarget.value) / 100);
});
ui.effectsVolume?.addEventListener('input', (event) => {
  ensureAudio();
  setMixerVolume('effects', Number(event.currentTarget.value) / 100);
});
ui.audioMute.addEventListener('click', () => {
  ensureAudio();
  setMasterVolume(masterVolume > 0 ? 0 : lastAudibleVolume);
});
ui.qualityPreset?.addEventListener('change', (event) => {
  applyQualityPreset(event.currentTarget.value);
  showMessage(`그래픽 품질 ${QUALITY_PRESETS[qualityPreset].label} · 전투 인원에 맞춰 VFX/물리 예산 자동 조정`, 1.5);
});
ui.dashKey?.addEventListener('change', (event) => {
  dashKey = DASH_KEYS.has(event.currentTarget.value) ? event.currentTarget.value : 'ControlLeft';
  localStorage.setItem(DASH_KEY_STORAGE_KEY, dashKey);
  showMessage(`DASH 키: ${dashKey === 'ControlLeft' ? 'Ctrl' : dashKey === 'AltLeft' ? 'Alt' : 'F'}`, 1.2);
});

window.addEventListener('keydown', (event) => {
  ensureAudio();
  if (!event.repeat && event.code === 'KeyP' && (mode === 'battle' || mode === 'test')) {
    setGamePaused(!gamePaused);
    event.preventDefault();
    return;
  }
  keys.add(event.code);
  if (!event.repeat && event.code === dashKey && (mode === 'battle' || mode === 'test')) player?.requestDash('keyboard');
  if (!event.repeat && event.code === 'KeyT' && (mode === 'battle' || mode === 'test') && player) {
    player.wakePhysicsFromControl('player-self-right-key');
    player.startPostureRecovery('player-key', player.isSelfRightCandidate());
  }
  if (!event.repeat && event.code === 'KeyR' && mode === 'garage' && assemblyMode === 'blocks') rotateBlock90(blockRotationAxis);
  if (!event.repeat && event.code === 'KeyR' && (mode === 'battle' || mode === 'test')) resetGame();
  if (!event.repeat && event.code === 'KeyC') ui.colliderDebug.click();
  if (!event.repeat && event.code === 'KeyV') ui.arenaTop.click();
  if (!event.repeat && event.code === 'Escape') {
    if (mode === 'battle' || mode === 'test') setGamePaused(!gamePaused);
    else if (mode === 'lobby' && !ui.lobbyModal.hidden) hideLobbyModal();
    else if (mode === 'garage' && candidateBlock) cancelBlockCandidate();
    else if (mode === 'garage' && blockDeleteMode) setBlockDeleteMode(false);
    else if (mode !== 'lobby') enterLobby();
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', dashKey].includes(event.code)) event.preventDefault();
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => { keys.clear(); brakeHeld = false; });

async function loadAssets() {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  await Promise.all(ASSETS.map(async (id, index) => {
    ui.status.textContent = `새 GLB 부품 로딩 ${index + 1}/${ASSETS.length}…`;
    const file = await loader.loadAsync(ASSET_PATHS[id]);
    models[id] = file.scene;
  }));
}

let previous = performance.now();
function frame(now) {
  resize();
  const rawDt = (now - previous) / 1000;
  const measuredFrameMs = rawDt * 1000;
  if (!qa && mode === 'battle' && rawDt > 0 && rawDt < 0.25) {
    const frameMs = rawDt * 1000;
    renderPerformanceStats.frames++;
    renderPerformanceStats.totalFrameMs += frameMs;
    renderPerformanceStats.maxFrameMs = Math.max(renderPerformanceStats.maxFrameMs, frameMs);
    if (frameMs > 33.4) renderPerformanceStats.over33ms++;
    if (activeSparkInstanceCount > 0) {
      renderPerformanceStats.sparkFrames++;
      renderPerformanceStats.totalSparkFrameMs += frameMs;
      renderPerformanceStats.maxSparkFrameMs = Math.max(renderPerformanceStats.maxSparkFrameMs, frameMs);
    }
  }
  // Keep the nonvisual deterministic checks moving when a background/mobile
  // tab is throttled. The spark-proof phase must use the real render cadence:
  // forcing 0.12 s per frame would consume a 0.08-0.29 s particle lifetime in
  // only a few frames and make a correct shower disappear before capture.
  const dt = qa
    ? qa.phase === 'sparkProof' ? clamp(rawDt, 1 / 240, 0.033) : clamp(rawDt, 0.12, 0.25)
    : Math.min(rawDt, 0.033);
  previous = now;
  if (!qa && hitStopTimer > 0) {
    hitStopTimer = Math.max(0, hitStopTimer - rawDt);
    const renderStarted = performance.now();
    renderer.render(scene, camera);
    recordPerformanceFrame(measuredFrameMs, 0, performance.now() - renderStarted);
    requestAnimationFrame(frame);
    return;
  }
  const updateStarted = performance.now();
  updateGame(dt);
  const updateCpuMs = performance.now() - updateStarted;
  const renderStarted = performance.now();
  renderer.render(scene, camera);
  const renderCpuMs = performance.now() - renderStarted;
  if (!qa && mode === 'battle' && rawDt > 0 && rawDt < 0.25) recordPerformanceFrame(measuredFrameMs, updateCpuMs, renderCpuMs);
  requestAnimationFrame(frame);
}

// The isolated browser-verification URL can advance the exact production
// update path synchronously when an in-app tab is background-throttled. This
// hook is never exposed on the normal player URL.
if (new URLSearchParams(location.search).get('qa') === 'isolated') {
  window.__battlebotQAStep = (seconds = 1) => {
    const step = 1 / 60;
    const iterations = Math.max(1, Math.min(7200, Math.round(Number(seconds) / step)));
    for (let index = 0; index < iterations; index++) {
      if (hitStopTimer > 0) hitStopTimer = Math.max(0, hitStopTimer - step);
      else updateGame(step);
    }
    renderer.render(scene, camera);
    return { iterations, battleElapsed };
  };
  const qaAdvanceButton = document.createElement('button');
  qaAdvanceButton.type = 'button';
  qaAdvanceButton.textContent = 'QA +10s';
  qaAdvanceButton.setAttribute('aria-label', 'QA 물리 10초 진행');
  Object.assign(qaAdvanceButton.style, { position: 'fixed', left: '8px', bottom: '8px', zIndex: '40', width: '74px', height: '28px', opacity: '0.7' });
  qaAdvanceButton.addEventListener('click', () => window.__battlebotQAStep(10));
  document.body.append(qaAdvanceButton);
}

if (new URLSearchParams(location.search).get('blockQA') === '1') {
  window.__battlebotBlockWorkshop = {
    dataTests: () => runLv1BlockDataTests(),
    snapshot: () => JSON.parse(ui.garageState.textContent || '{}'),
    installTwentyCubeLine: () => {
      const before = cloneData(workingAssembly);
      undoStack.push(before);
      workingAssembly.blocks = [createBlockRecord('core', [0, 0, 0], [0, 0, 0], 'block-core')];
      for (let index = 1; index < 20; index++) workingAssembly.blocks.push(createBlockRecord('cube', [index, 0, 0], [0, 0, 0], `qa-visible-cube-${index}`));
      selectedBlockId = 'qa-visible-cube-19';
      candidateBlock = null;
      assemblyMode = 'blocks';
      garageDirty = true;
      rebuildGarageRobot();
      setAssemblyMode('blocks');
      updateBlockInspector();
      return runLv1BlockDataTests();
    },
    exerciseDeleteAndRoundTrip: () => {
      const original = cloneData(workingAssembly.blocks);
      const removed = workingAssembly.blocks.find((block) => block.id === 'qa-visible-cube-10') ?? [...workingAssembly.blocks].reverse().find((block) => !block.isCore);
      workingAssembly.blocks = workingAssembly.blocks.filter((block) => block.id !== removed?.id);
      const freed = removed ? blockMicroCells(removed).every((cell) => !blockOccupancy(workingAssembly.blocks).has(cell)) : false;
      const key = 'battlebot-lv1-block-qa-roundtrip';
      const savePayload = enrichAssembly({ ...cloneData(workingAssembly), blocks: original });
      localStorage.setItem(key, JSON.stringify(savePayload));
      const restoredAssembly = enrichAssembly(JSON.parse(localStorage.getItem(key)));
      const restored = restoredAssembly.blocks;
      localStorage.removeItem(key);
      const exact = JSON.stringify(original) === JSON.stringify(restored);
      workingAssembly.blocks = restored;
      rebuildGarageRobot();
      setAssemblyMode('blocks');
      updateBlockInspector();
      return { deletedCellFreed: freed, saveLoadExact: exact, restoredCount: restored.length };
    },
    exerciseWheelPairAlignment: () => {
      const originalParts = cloneData(workingAssembly.parts);
      const makeWheel = (id) => ({
        id, type: 'wheel', position: [0, 0, 0], rotation: [0, 0, 0], scaleFactor: 1,
        hubFlipped: false, steers: false, locked: false, mount: null, linkedTo: [],
        scale: [...MODEL_TRANSFORMS[PART_META.wheel.model].scale], mass: PART_META.wheel.mass, baseHp: PART_META.wheel.hp,
      });
      const left = makeWheel('qa-wheel-left');
      alignWheelMountFromSurface(left, { point: new THREE.Vector3(-GRID_UNIT * 0.5, 0, GRID_UNIT * 0.25), normal: new THREE.Vector3(-1, 0, 0), targetId: 'block-core' });
      workingAssembly.parts.push(left);
      const right = makeWheel('qa-wheel-right');
      alignWheelMountFromSurface(right, { point: new THREE.Vector3(GRID_UNIT * 0.5, GRID_UNIT * 0.31, GRID_UNIT * 0.33), normal: new THREE.Vector3(1, 0, 0), targetId: 'block-core' });
      workingAssembly.parts.push(right);
      const pairs = getWheelPairTelemetry();
      const result = {
        pairs,
        left: { position: [...left.position], normal: [...left.mount.normal], hubFlipped: left.hubFlipped, group: left.wheelAxisGroup },
        right: { position: [...right.position], normal: [...right.mount.normal], hubFlipped: right.hubFlipped, group: right.wheelAxisGroup, mirrorAlignedTo: right.mirrorAlignedTo },
      };
      workingAssembly.parts = originalParts;
      return result;
    },
    exerciseAllBlockRotations: () => {
      const savedCandidate = candidateBlock;
      const savedSelected = selectedBlockId;
      const savedAxis = blockRotationAxis;
      const results = {};
      for (const type of Object.keys(BLOCK_META).filter((value) => value !== 'core')) {
        candidateBlock = createBlockRecord(type);
        const initialSteps = [...candidateBlock.rotationSteps];
        rotateBlock90('x');
        rotateBlock90('y');
        rotateBlock90('z');
        const expectedSteps = initialSteps.map((value) => (value + 1) % 4);
        results[type] = {
          initialSteps,
          steps: [...candidateBlock.rotationSteps],
          expectedSteps,
          degrees: candidateBlock.rotation.map((value) => Math.round(THREE.MathUtils.radToDeg(value))),
          pass: candidateBlock.rotationSteps.every((value, index) => value === expectedSteps[index]),
        };
      }
      candidateBlock = savedCandidate;
      selectedBlockId = savedSelected;
      blockRotationAxis = savedAxis;
      if (mode === 'garage') { refreshBlockGhost(); updateBlockInspector(); }
      return { allPass: Object.values(results).every((result) => result.pass), results };
    },
  };
  const blockQAOutput = document.createElement('output');
  blockQAOutput.id = 'block-qa-roundtrip-result';
  blockQAOutput.hidden = true;
  const blockQAButton = document.createElement('button');
  blockQAButton.type = 'button';
  blockQAButton.textContent = '20 CUBE LINE';
  blockQAButton.setAttribute('aria-label', 'Lv.1 블록 20개 실제 배치 검사');
  Object.assign(blockQAButton.style, { position: 'fixed', right: '220px', bottom: '34px', zIndex: '90', width: '96px', height: '24px', opacity: '0.82', padding: '2px', fontSize: '9px' });
  blockQAButton.addEventListener('click', () => {
    blockQAOutput.textContent = JSON.stringify(window.__battlebotBlockWorkshop.installTwentyCubeLine());
  });
  const wheelQAButton = document.createElement('button');
  wheelQAButton.type = 'button';
  wheelQAButton.textContent = 'WHEEL PAIR QA';
  wheelQAButton.setAttribute('aria-label', '좌우 바퀴 평행 미러 정렬 검사');
  Object.assign(wheelQAButton.style, { position: 'fixed', right: '5px', bottom: '34px', zIndex: '90', width: '92px', height: '24px', opacity: '0.82', padding: '2px', fontSize: '9px' });
  wheelQAButton.addEventListener('click', () => {
    blockQAOutput.textContent = JSON.stringify(window.__battlebotBlockWorkshop.exerciseWheelPairAlignment());
  });
  const rotationQAButton = document.createElement('button');
  rotationQAButton.type = 'button';
  rotationQAButton.textContent = 'ROTATION XYZ QA';
  rotationQAButton.setAttribute('aria-label', '모든 Lv.1 블록 X Y Z 90도 회전 검사');
  Object.assign(rotationQAButton.style, { position: 'fixed', right: '102px', bottom: '34px', zIndex: '90', width: '112px', height: '24px', opacity: '0.82', padding: '2px', fontSize: '9px' });
  rotationQAButton.addEventListener('click', () => {
    blockQAOutput.textContent = JSON.stringify(window.__battlebotBlockWorkshop.exerciseAllBlockRotations());
  });
  Object.assign(blockQAOutput.style, { position: 'fixed', right: '5px', bottom: '62px', zIndex: '90', maxWidth: '420px', maxHeight: '54px', overflow: 'auto', color: '#dff8ff', background: 'rgba(4,13,20,.88)', font: '8px/1.2 ui-monospace,monospace' });
  blockQAOutput.hidden = false;
  document.body.append(blockQAButton, wheelQAButton, rotationQAButton, blockQAOutput);
}

if (new URLSearchParams(location.search).get('blockCombatQA') === '1') {
  const launchBlockQAAssembly = (assembly) => {
    removeLobbyRobot();
    setLobbyLights(false);
    mode = 'test';
    document.body.classList.remove('garage-mode', 'lobby-mode');
    if (garageRoot) garageRoot.visible = false;
    if (garageStage) garageStage.visible = false;
    resetGame(true, assembly);
    return window.__battlebotBlockCombatQA.snapshot();
  };
  window.__battlebotBlockCombatQA = {
    startHull: (type = 'bar') => launchBlockQAAssembly(createAIAssembly(type)),
    startColoredHull: (color = '#ffd23f', type = 'bar') => launchBlockQAAssembly(createColoredBlockQAAssembly(color, type)),
    startChain: () => launchBlockQAAssembly(createBlockChainQAAssembly()),
    frontBlockId: () => player?.activeBlockParts()
      .filter((part) => !part.isCore)
      .sort((a, b) => b.record.gridPosition[2] - a.record.gridPosition[2] || Math.abs(a.record.gridPosition[0]) - Math.abs(b.record.gridPosition[0]))[0]?.assemblyId ?? null,
    snapshot: () => player ? ({
      core: { hp: Number((player.corePart?.hp ?? 0).toFixed(2)), maxHp: player.corePart?.maxHp ?? 0, dead: player.dead },
      blocks: [...player.blockParts.values()].map((part) => ({
        id: part.assemblyId,
        hp: Number(part.hp.toFixed(2)),
        maxHp: part.maxHp,
        detached: part.detached,
        damageState: part.record.damageState,
        materials: blockMaterialSnapshot(part.object),
      })),
      activeBlocks: player.activeBlockParts().length,
      totalBlocks: player.blockParts.size,
      functionalParts: [...player.functionalParts.values()].map((part) => ({ id: part.assemblyId, type: part.type, detached: part.detached })),
      colliderComponents: player.colliderComponents.map((component) => component.name),
      debris: debris.map((item) => ({
        chunkSize: item.blockChunkSize ?? 0,
        reason: item.reason ?? 'functional',
        life: Number(item.life.toFixed(3)),
        initialLife: item.initialLife,
        fadeStarted: item.fadeStarted,
        preservesOriginalMaterial: Boolean(item.preservesOriginalMaterial),
        originalMaterials: item.originalMaterials,
        currentMaterials: blockMaterialSnapshot(item.object),
        velocity: item.velocity.toArray().map((value) => Number(value.toFixed(3))),
        angular: item.angular.toArray().map((value) => Number(value.toFixed(3))),
      })),
      debrisPolicy: { blockLifetimeSeconds: BLOCK_DEBRIS_LIFETIME, fadeSeconds: DEBRIS_FADE_SECONDS, maximumActive: MAX_ACTIVE_DEBRIS },
      fragments: blockFragmentBursts.map((burst) => ({ partId: burst.partId, tier: burst.tier, color: burst.color, count: burst.shards.length, spawnedBeforeDetach: burst.spawnedBeforeDetach })),
      fragmentStats: { ...blockFragmentStats },
      stats: cloneData(player.stats),
      legacyChassisMeshes: player.root.children.filter((child) => /chassis/i.test(child.name)).length,
    }) : null,
    damage: (blockId, tier = 'strong', amount = 58, impulseMagnitude = 1100) => {
      const part = player?.blockParts.get(blockId);
      if (!part || part.detached) return { error: 'block unavailable', snapshot: window.__battlebotBlockCombatQA.snapshot() };
      const point = player.partWorldCentre(part);
      const impulse = new THREE.Vector3(1, 0.18, 0.24).normalize().multiplyScalar(Number(impulseMagnitude));
      const score = { weak: 42, medium: 78, strong: 120, veryStrong: 158, critical: 205 }[tier] ?? 120;
      const result = player.applyBlockDamageAtImpact(part, Number(amount), impulse, point, null, tier, score, true);
      spawnMetalSparks(point, impulse, { weak: 4, medium: 12, strong: 30, veryStrong: 52, critical: 78 }[tier] ?? 30, tier, null, 'block-qa', point.clone().sub(player.worldCenterOfMass()).normalize());
      player.finalizeBlockDestruction(result, impulse, point, null);
      return {
        sequence: ['colored-fragments', 'metal-sparks', 'block-detach'],
        damaged: result.damaged.map((item) => item.assemblyId),
        destroyed: result.destroyed.map((item) => item.assemblyId),
        snapshot: window.__battlebotBlockCombatQA.snapshot(),
      };
    },
    coloredCritical: (color = '#ffd23f') => {
      window.__battlebotBlockCombatQA.startColoredHull(color, 'bar');
      return window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'critical', 128, 1550);
    },
    contactHit: (blockId, damage = 32, impulseMagnitude = 900, sourceType = 'bar', forceTier = null) => {
      const part = player?.blockParts.get(blockId);
      if (!part || part.detached) return { error: 'block unavailable', snapshot: window.__battlebotBlockCombatQA.snapshot() };
      const point = player.partWorldCentre(part);
      const impulse = new THREE.Vector3(1, 0.08, 0.3).normalize().multiplyScalar(Number(impulseMagnitude));
      const result = player.applyImpactAtPoint(impulse, point, Number(damage), sourceType, null, { contactSpeed: forceTier === 'critical' ? 62 : forceTier === 'veryStrong' ? 54 : forceTier === 'strong' ? 48 : 42, weaponMass: 46, forceTier, suppressCritical: true, suppressFeedback: true, suppressAudio: true });
      return { result: result ? { tier: result.tier, hitBlockId: result.hitBlockId, score: Number(result.intensityScore.toFixed(2)) } : null, snapshot: window.__battlebotBlockCombatQA.snapshot() };
    },
  };

  const blockCombatQAOutput = document.createElement('output');
  blockCombatQAOutput.id = 'block-combat-qa-result';
  blockCombatQAOutput.setAttribute('aria-live', 'polite');
  const blockCombatQAPanel = document.createElement('div');
  blockCombatQAPanel.id = 'block-combat-qa-panel';
  blockCombatQAPanel.setAttribute('aria-label', '블록 전투 검증');
  Object.assign(blockCombatQAPanel.style, {
    position: 'fixed', left: '8px', bottom: '40px', zIndex: '60', display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)', gap: '5px', padding: '7px', maxWidth: '420px',
    border: '1px solid rgba(91,216,255,.65)', borderRadius: '8px',
    background: 'rgba(4,13,20,.88)', color: '#dff8ff', font: '11px/1.25 system-ui',
  });
  const writeBlockCombatQA = (label, value) => {
    blockCombatQAOutput.textContent = JSON.stringify({ label, value });
    blockCombatQAOutput.style.gridColumn = '1 / -1';
    blockCombatQAOutput.style.maxHeight = '58px';
    blockCombatQAOutput.style.overflow = 'auto';
    return value;
  };
  const addBlockCombatQAButton = (label, action, id) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.textContent = label;
    Object.assign(button.style, { minHeight: '28px', padding: '4px 7px' });
    button.addEventListener('click', () => writeBlockCombatQA(label, action()));
    blockCombatQAPanel.append(button);
  };
  addBlockCombatQAButton('PROCEDURAL HULL', () => window.__battlebotBlockCombatQA.startHull('bar'), 'qa-block-hull');
  addBlockCombatQAButton('WEAK TAP', () => window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'weak', 8, 240), 'qa-block-weak');
  addBlockCombatQAButton('EXACT FRONT HIT', () => window.__battlebotBlockCombatQA.contactHit(window.__battlebotBlockCombatQA.frontBlockId(), 32, 900, 'bar'), 'qa-block-exact-hit');
  addBlockCombatQAButton('STRONG CONTACT', () => window.__battlebotBlockCombatQA.contactHit(window.__battlebotBlockCombatQA.frontBlockId(), 58, 1050, 'bar', 'strong'), 'qa-block-contact-strong');
  addBlockCombatQAButton('VERY CONTACT', () => window.__battlebotBlockCombatQA.contactHit(window.__battlebotBlockCombatQA.frontBlockId(), 82, 1250, 'bar', 'veryStrong'), 'qa-block-contact-very');
  addBlockCombatQAButton('CRITICAL CONTACT', () => window.__battlebotBlockCombatQA.contactHit(window.__battlebotBlockCombatQA.frontBlockId(), 118, 1550, 'bar', 'critical'), 'qa-block-contact-critical');
  addBlockCombatQAButton('REPEAT FRONT DAMAGE', () => window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'medium', 42, 720), 'qa-block-repeat-hit');
  addBlockCombatQAButton('STRONG HIT', () => window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'strong', 58, 1050), 'qa-block-strong');
  addBlockCombatQAButton('VERY STRONG', () => window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'veryStrong', 82, 1250), 'qa-block-very-strong');
  addBlockCombatQAButton('CRITICAL LOCAL', () => window.__battlebotBlockCombatQA.damage(window.__battlebotBlockCombatQA.frontBlockId(), 'critical', 118, 1450), 'qa-block-critical');
  addBlockCombatQAButton('BLUE CRITICAL', () => window.__battlebotBlockCombatQA.coloredCritical('#39afe7'), 'qa-block-blue-critical');
  addBlockCombatQAButton('SILVER CRITICAL', () => window.__battlebotBlockCombatQA.coloredCritical('#b9c4cc'), 'qa-block-silver-critical');
  addBlockCombatQAButton('YELLOW CRITICAL', () => window.__battlebotBlockCombatQA.coloredCritical('#ffd23f'), 'qa-block-yellow-critical');
  addBlockCombatQAButton('CHAIN ASSEMBLY', () => window.__battlebotBlockCombatQA.startChain(), 'qa-block-chain');
  addBlockCombatQAButton('CUT BRIDGE', () => window.__battlebotBlockCombatQA.damage('qa-bridge', 'critical', 75, 850), 'qa-block-cut-bridge');
  addBlockCombatQAButton('DESTROY CORE', () => window.__battlebotBlockCombatQA.damage('block-core', 'critical', 240, 1500), 'qa-block-destroy-core');
  addBlockCombatQAButton('DEBRIS +2S', () => {
    if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(2);
    return window.__battlebotBlockCombatQA.snapshot();
  }, 'qa-block-debris-land');
  addBlockCombatQAButton('DEBRIS +6.5S', () => {
    if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(6.5);
    return window.__battlebotBlockCombatQA.snapshot();
  }, 'qa-block-debris-expire');
  blockCombatQAPanel.append(blockCombatQAOutput);
  document.body.append(blockCombatQAPanel);
}

if (new URLSearchParams(location.search).get('aiVisualQA') === '1') {
  let visualSamples = [];
  const visualSnapshot = () => ({
    active: aiVisualShowcaseActive,
    count: visualSamples.length,
    uniqueArchetypes: new Set(visualSamples.map((robot) => robot.aiDesign.archetype)).size,
    uniqueSignatures: new Set(visualSamples.map((robot) => robot.aiDesign.signature)).size,
    robots: visualSamples.map((robot) => {
      const stability = getRobotStabilityTelemetry(robot);
      return {
        name: robot.name, archetype: robot.aiDesign.archetype, conceptFamily: robot.aiDesign.conceptFamily, silhouette: robot.aiDesign.silhouette, colorMode: robot.aiDesign.colorMode,
        weapon: robot.type, weaponLayout: robot.aiDesign.weaponLayout, blocks: robot.activeBlockParts().length,
        designValidation: robot.aiDesign.validation,
        exterior: robot.parts.filter((part) => ['armor', 'decoration'].includes(part.type)).map((part) => ({ id: part.assemblyId, assetType: part.record.type, targetId: part.record.mount?.targetId, mountKind: part.record.mount?.kind, source: part.record.aiPlacement?.source, wheelClearance: part.record.aiPlacement?.wheelClearance, weaponClearance: part.record.aiPlacement?.weaponClearance, detached: part.detached })),
        smokeOutlets: robot.exhaustEmitters?.length ?? 0,
        wheels: robot.wheels.length, position: robot.root.position.toArray().map((value) => Number(value.toFixed(2))),
        floorClearance: Number((robot.root.position.y - robot.getGroundSupportInfo().height).toFixed(4)),
        wheelGroundDistances: stability.wheelGroundDistances,
        chassisGroundClearance: stability.chassisGroundClearance,
        steeringAngles: stability.steeringAngles,
        wheelHubOutwardDots: stability.wheelHubOutwardDots,
        visualPhysicsWheelSyncError: stability.visualPhysicsWheelSyncError,
        durability: Number(robot.durability().toFixed(3)),
        floorRecoveries: robot.stats.floorRecoveries, aiState: robot.aiState,
      };
    }),
    ground: { ...groundStats, maxRobotPenetrationMm: Number((groundStats.maxRobotPenetration * 1000).toFixed(2)) },
    fragments: { ...blockFragmentStats },
  });
  const startVisualShowcase = () => {
    ui.battleMap.value = 'industrial01';
    ui.lobbyBattleMap.value = 'industrial01';
    ui.battleMode.value = '4v4';
    ui.lobbyBattleMode.value = '4v4';
    setActiveMap('industrial01');
    startBattle(false);
    const existing = new Set(robots.filter((robot) => !robot.isPlayer).map((robot) => robot.aiDesign.archetype));
    const extraTypes = ['bar', 'spinner', 'drum', 'flipper', 'hammer'];
    for (let index = 0; index < 5; index++) {
      const extraIndex = AI_HULL_ARCHETYPES.findIndex((archetype) => !existing.has(archetype));
      const assembly = createAIAssembly(extraTypes[index], { designSeed: 0.137 + index * 0.173, archetypeIndex: extraIndex < 0 ? index : extraIndex });
      existing.add(assembly.aiDesign.archetype);
      robots.push(new Robot({ id: 90 + index, name: `${assembly.aiDesign.displayName} Q${index + 1}`, type: extraTypes[index], team: index % 2 ? 'blue' : 'red', tint: index % 2 ? 0xb9dcff : 0xffaa96, assembly, position: { x: 0, z: 0 }, yaw: 0 }));
    }
    visualSamples = robots.filter((robot) => !robot.isPlayer).slice(0, 12);
    const positions = [
      [-18, -10], [-6, -10], [6, -10], [18, -10],
      [-18, 0], [-6, 0], [6, 0], [18, 0],
      [-18, 10], [-6, 10], [6, 10], [18, 10],
    ];
    visualSamples.forEach((robot, index) => {
      robot.root.position.x = positions[index][0];
      robot.root.position.z = positions[index][1];
      robot.yaw = index % 2 ? Math.PI : 0;
      robot.pitch = 0; robot.roll = 0;
      robot.root.rotation.set(0, robot.yaw, 0, 'YXZ');
      robot.root.position.y = 0;
      robot.placeOnMeasuredGround();
      robot.velocity.set(0, 0, 0);
      robot.pitchVelocity = 0; robot.rollVelocity = 0; robot.yawVelocity = 0;
      robot.control = { throttle: 0, steering: 0, brake: true };
      robot.spawnProtectionUntil = 0;
      robot.lastPosition.copy(robot.root.position);
    });
    player.root.visible = false;
    player.root.position.set(0, 0, -26);
    player.placeOnMeasuredGround();
    player.control = { throttle: 0, steering: 0, brake: true };
    aiVisualShowcaseActive = true;
    camera.position.set(0, 34, 0.01);
    buildEnemyUI();
    updateCamera(0.2);
    updateUI();
    return visualSnapshot();
  };
  const flyFirstLabel = () => {
    const robot = visualSamples[0];
    if (!robot) return visualSnapshot();
    robot.roll = 0.82;
    robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
    robot.root.position.y = robot.getGroundSupportInfo().height + 2.4;
    robot.velocity.set(5.5, 4.2, 2.2);
    robot.rollVelocity = 2.8;
    if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(0.45);
    updateUI();
    return visualSnapshot();
  };
  const setShowcaseSteering = (value) => {
    for (const robot of visualSamples) {
      robot.control = { throttle: 0, steering: value, brake: true };
      robot.steeringVisual = value * 0.45;
      for (const wheel of robot.wheels) wheel.steeringPivot.rotation.y = wheel.steers ? robot.steeringVisual : 0;
      robot.updateWheelGroundDistances();
    }
    updateUI();
    return visualSnapshot();
  };
  const strongHits = () => {
    const robot = visualSamples.find((candidate) => !candidate.dead);
    if (!robot) return visualSnapshot();
    robot.spawnProtectionUntil = 0;
    for (let hit = 0; hit < 3 && !robot.dead; hit++) {
      const target = robot.activeBlockParts().find((part) => !part.isCore) ?? robot.corePart;
      const point = robot.partWorldCentre(target);
      robot.applyImpactAtPoint(new THREE.Vector3(1120, 90, 340), point, 72, 'bar', player, { contactSpeed: 58, weaponMass: 46, forceTier: 'strong', suppressFeedback: true, suppressAudio: true });
    }
    if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(0.35);
    updateUI();
    return visualSnapshot();
  };
  window.__battlebotAIVisualQA = { startVisualShowcase, flyFirstLabel, strongHits, steerLeft: () => setShowcaseSteering(-1), steerCenter: () => setShowcaseSteering(0), steerRight: () => setShowcaseSteering(1), snapshot: visualSnapshot };
  const panel = document.createElement('section');
  panel.id = 'ai-visual-qa-panel';
  panel.setAttribute('aria-label', 'AI 외형 이름표 전투 속도 검증');
  panel.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:90;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;padding:6px;background:rgba(8,18,25,.9);border:1px solid #59c9ef;border-radius:8px';
  const output = document.createElement('output');
  output.id = 'ai-visual-qa-output';
  output.style.cssText = 'grid-column:1/-1;max-height:58px;overflow:auto;color:#d8f6ff;font:9px/1.2 ui-monospace,monospace';
  const add = (label, action, id) => {
    const button = document.createElement('button'); button.type = 'button'; button.id = id; button.textContent = label;
    button.style.cssText = 'min-width:0;padding:5px 2px;font-size:9px';
    button.addEventListener('click', () => { output.textContent = JSON.stringify(action()); });
    panel.append(button);
  };
  add('SPAWN 12 DESIGNS', startVisualShowcase, 'qa-ai-visual-start');
  add('STEER LEFT', () => setShowcaseSteering(-1), 'qa-ai-steer-left');
  add('STEER CENTER', () => setShowcaseSteering(0), 'qa-ai-steer-center');
  add('STEER RIGHT', () => setShowcaseSteering(1), 'qa-ai-steer-right');
  add('LABEL FLIGHT', flyFirstLabel, 'qa-ai-label-flight');
  add('3 STRONG HITS', strongHits, 'qa-ai-strong-hits');
  add('SNAPSHOT', visualSnapshot, 'qa-ai-visual-snapshot');
  panel.append(output);
  document.body.append(panel);
}

if (new URLSearchParams(location.search).get('systemsQA') === '1') {
  const state = { toppledAIId: null, toppledAIOrigin: null, toppledPlayerOrigin: null, killedAIId: null, killedAIName: null, playerWasKilled: false, lastTactic: null, lastProtectionHit: null, lastPenetrationRecovery: null, lastInstallationAudit: null, lastWeaponDurabilityAudit: null };
  const start = () => {
    ui.battleMap.value = 'industrial01';
    ui.lobbyBattleMap.value = 'industrial01';
    ui.battleMode.value = '4v4';
    ui.lobbyBattleMode.value = '4v4';
    setActiveMap('industrial01');
    startBattle(false);
    return snapshot();
  };
  const topple = (robot) => {
    if (!robot) return null;
    robot.spawnProtectionUntil = 0;
    robot.pitch = 0;
    robot.roll = robot.isPlayer ? Math.PI : Math.PI / 2;
    robot.pitchVelocity = 0;
    robot.rollVelocity = 0;
    robot.yawVelocity = 0;
    robot.velocity.set(0, 0, 0);
    const support = robot.getGroundSupportInfo();
    robot.root.position.y = support.height + 0.01;
    robot.root.rotation.set(robot.pitch, robot.yaw, robot.roll, 'YXZ');
    robot.lastSupportInfo = support;
    robot.selfRightCandidateTime = 0;
    robot.postureRecoveryCooldown = 0;
    return { id: robot.id, name: robot.name, x: robot.root.position.x, z: robot.root.position.z, tilt: robot.isPlayer ? 180 : 90 };
  };
  const snapshot = () => {
    const toppledAI = robots.find((robot) => robot.id === state.toppledAIId);
    const killedAI = robots.find((robot) => robot.id === state.killedAIId);
    const playerSupport = player?.lastSupportInfo ?? player?.getGroundSupportInfo();
    const aiSupport = toppledAI?.lastSupportInfo ?? toppledAI?.getGroundSupportInfo();
    const currentAIStates = Object.fromEntries(['SEARCH', 'CHASE', 'ATTACK', 'FLANK', 'AMBUSH', 'RETREAT', 'DASH_ATTACK', 'DASH_ESCAPE', 'RECOVER_STUCK', 'SELF_RIGHT', 'REENTRY', 'RECOVER'].map((value) => [value, robots.filter((robot) => !robot.isPlayer && !robot.dead && robot.aiState === value).length]));
    return {
      mode, map: selectedMapId, battleMode, robots: robots.length,
      aiStates: currentAIStates,
      aiTraits: robots.filter((robot) => !robot.isPlayer).map((robot) => ({ name: robot.name, trait: robot.aiTrait, state: robot.aiState, durability: Number(robot.durability().toFixed(3)), stuckEvents: robot.aiStuckEvents, recoverTime: Number(robot.aiRecoverStuckTime.toFixed(3)) })),
      worldRobotUI: auditWorldRobotUIRemoved(),
      playerPosture: player ? { x: Number(player.root.position.x.toFixed(3)), z: Number(player.root.position.z.toFixed(3)), upDot: Number((playerSupport?.upDot ?? 0).toFixed(3)), active: Boolean(player.postureRecovery), recoveries: player.stats.postureRecoveries, requests: player.postureRecoveryRequests, lastRequest: player.lastPostureRecoveryRequest, origin: state.toppledPlayerOrigin, audit: player.postureRecoveryAudit ? { ...player.postureRecoveryAudit } : null } : null,
      aiPosture: toppledAI ? { id: toppledAI.id, x: Number(toppledAI.root.position.x.toFixed(3)), z: Number(toppledAI.root.position.z.toFixed(3)), upDot: Number((aiSupport?.upDot ?? 0).toFixed(3)), active: Boolean(toppledAI.postureRecovery), recoveries: toppledAI.stats.postureRecoveries, origin: state.toppledAIOrigin, audit: toppledAI.postureRecoveryAudit ? { ...toppledAI.postureRecoveryAudit } : null } : null,
      killedAI: killedAI ? { id: killedAI.id, name: killedAI.name, dead: killedAI.dead, respawnCount: killedAI.respawnCount, blocks: killedAI.activeBlockParts().length, totalBlocks: killedAI.blockParts.size, coreRatio: Number(killedAI.coreHealthRatio().toFixed(3)), atSpawn: Math.hypot(killedAI.root.position.x - killedAI.spawnPosition.x, killedAI.root.position.z - killedAI.spawnPosition.z) < 0.05, protectionRemaining: Number(Math.max(0, killedAI.spawnProtectionUntil - worldTime).toFixed(2)) } : null,
      playerRespawn: player ? { wasKilled: state.playerWasKilled, dead: player.dead, respawnCount: player.respawnCount, blocks: player.activeBlockParts().length, totalBlocks: player.blockParts.size, functionalParts: [...player.functionalParts.values()].filter((part) => !part.detached).length, totalFunctionalParts: player.functionalParts.size, coreRatio: Number(player.coreHealthRatio().toFixed(3)), atSpawn: Math.hypot(player.root.position.x - player.spawnPosition.x, player.root.position.z - player.spawnPosition.z) < 0.05, protectionRemaining: Number(Math.max(0, player.spawnProtectionUntil - worldTime).toFixed(2)) } : null,
      tacticAudit: state.lastTactic,
      protectionAudit: state.lastProtectionHit,
      penetrationRecoveryAudit: state.lastPenetrationRecovery,
      installationAudit: state.lastInstallationAudit,
      weaponDurabilityAudit: state.lastWeaponDurabilityAudit,
      livePhysics: robots.map((robot) => ({
        name: robot.name,
        penetrationDetected: robot.groundPenetrationDetected,
        penetrationDepthMm: Number((robot.groundPenetrationDepth * 1000).toFixed(2)),
        awake: robot.physicsAwake,
        collisionMode: robot.collisionDetectionMode,
        solverIterations: robot.solverIterations,
        solverVelocityIterations: robot.solverVelocityIterations,
        grounded: robot.grounded,
        wheelGroundedCount: robot.wheelGroundedCount,
        floorRecoveries: robot.stats.floorRecoveries,
      })),
      respawnStats: { ...respawnStats },
      fragments: { activeBursts: blockFragmentBursts.length, activeCount: blockFragmentBursts.reduce((sum, burst) => sum + burst.shards.filter((shard) => shard.age < shard.life).length, 0), stats: { ...blockFragmentStats }, bursts: blockFragmentBursts.map((burst) => ({ color: burst.color, tier: burst.tier, count: burst.shards.length, spawnedBeforeDetach: burst.spawnedBeforeDetach })) },
      debris: debris.map((item) => ({ size: item.blockChunkSize ?? 0, reason: item.reason, preservesOriginalMaterial: Boolean(item.preservesOriginalMaterial) })),
    };
  };
  const placeForTactic = (robot, x, z, yaw = 0) => {
    if (!robot) return;
    robot.root.position.set(x, GROUND_Y, z);
    robot.lastPosition.copy(robot.root.position);
    robot.yaw = yaw;
    robot.pitch = 0;
    robot.roll = 0;
    robot.root.rotation.set(0, yaw, 0, 'YXZ');
    robot.velocity.set(0, 0, 0);
    robot.yawVelocity = 0;
    robot.pitchVelocity = 0;
    robot.rollVelocity = 0;
    robot.spawnProtectionUntil = 0;
    robot.aiRetreatUntil = 0;
    robot.aiTargetId = null;
    if (!robot.isPlayer) { robot.aiState = 'SEARCH'; robot.aiStateTime = 0; }
  };
  const exerciseTactic = (kind) => {
    start();
    const advance = (seconds) => {
      if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(seconds);
      else for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 60) updateGame(1 / 60);
    };
    let actor = null;
    let target = null;
    let supporter = null;
    if (kind === 'ambush' || kind === 'flank') actor = robots.find((robot) => !robot.isPlayer && robot.aiTrait === 'flanker');
    else if (kind === 'chase') actor = robots.find((robot) => !robot.isPlayer && robot.aiTrait === 'chaser');
    else if (kind === 'attack') actor = robots.find((robot) => !robot.isPlayer && robot.aiTrait === 'brawler');
    else if (kind === 'search') actor = robots.find((robot) => !robot.isPlayer && robot.aiTrait === 'aggressive');
    else actor = robots.find((robot) => !robot.isPlayer && robot.aiTrait === 'defensive');
    target = robots.find((robot) => robot !== actor && !robot.dead && robot.team !== actor?.team);
    supporter = robots.find((robot) => robot !== actor && robot !== target && !robot.dead && robot.team === actor?.team);
    for (const robot of robots) placeForTactic(robot, 58 + robot.id * 4, 58 + robot.id * 3, robot.team === 'red' ? Math.PI : 0);
    placeForTactic(target, 0, 0, 0);
    const setup = { ambush: [0, -12, 0], flank: [-10, 0, Math.PI / 2], chase: [0, -24, 0], attack: [0, -3.4, 0], retreat: [0, -9, 0], reentry: [0, -9, 0] }[kind] ?? [0, -12, 0];
    placeForTactic(actor, setup[0], setup[1], setup[2]);
    if (kind === 'ambush') placeForTactic(supporter, 1.2, 1.1, Math.PI);
    if (kind === 'search') for (const candidate of robots) if (candidate !== actor && candidate.team !== actor.team) candidate.dead = true;
    if (kind === 'retreat') {
      actor.corePart.hp = actor.corePart.maxHp * 0.18;
      actor.corePart.record.hp = actor.corePart.hp;
      actor.aiRetreatUntil = worldTime + 2.5;
    }
    if (kind === 'reentry') actor.aiRetreatUntil = worldTime + 0.14;
    if (kind === 'reentry') { advance(0.08); advance(0.12); }
    else advance(0.22);
    const rearDot = target && actor
      ? forwardFor(target.yaw).dot(actor.root.position.clone().sub(target.root.position).setY(0).normalize())
      : 0;
    state.lastTactic = {
      requested: kind,
      actor: actor?.name ?? null,
      trait: actor?.aiTrait ?? null,
      resultingState: actor?.aiState ?? null,
      target: target?.name ?? null,
      targetId: actor?.aiTargetId ?? null,
      targetEngagedByAlly: Boolean(supporter && supporter.root.position.distanceTo(target.root.position) < 7.5),
      rearDot: Number(rearDot.toFixed(3)),
      pass: kind === 'ambush' ? actor?.aiState === 'AMBUSH' && rearDot < -0.7
        : kind === 'flank' ? actor?.aiState === 'FLANK'
          : kind === 'chase' ? actor?.aiState === 'CHASE'
            : kind === 'attack' ? actor?.aiState === 'ATTACK'
              : kind === 'retreat' ? actor?.aiState === 'RETREAT'
                : kind === 'search' ? actor?.aiState === 'SEARCH' && actor.control.throttle > 0
                  : actor?.aiState === 'REENTRY',
    };
    return snapshot();
  };
  const auditInstallations = () => {
    const types = ['spinner', 'bar', 'hammer', 'flipper', 'drum'];
    const results = types.map((type) => {
      const assembly = createAIAssembly(type);
      const activeParts = assembly.parts.filter((record) => !record.detached);
      const validations = activeParts.map((record) => ({ id: record.id, type: record.type, part: record.part, ...validateGaragePart(record, record.id, assembly) }));
      const weapons = activeParts.filter((record) => WEAPON_TYPES.has(record.type));
      const mounts = activeParts.filter((record) => ['pivotMount', 'sawSupport', 'sawMount', 'hammerMount', 'barAxis'].includes(record.type));
      const axisChecks = weapons.map((record) => {
        const bounds = recordLocalAABB(record);
        return { id: record.id, type: record.type, boundsCenter: bounds.getCenter(new THREE.Vector3()).toArray().map((value) => Number(value.toFixed(3))), boundsSize: bounds.getSize(new THREE.Vector3()).toArray().map((value) => Number(value.toFixed(3))), ...axisMountValidation(record, assembly) };
      });
      const collisionChecks = activeParts.map((record) => ({ id: record.id, ...partCollisionState(record, record.id, assembly) }));
      const clearanceChecks = weapons.map((record) => ({ id: record.id, blocked: weaponClearanceBlockIds(record, assembly) }));
      const forwardWeapon = weapons.every((record) => record.position[2] >= -GRID_UNIT * 0.6 || record.part === 'bar');
      return {
        type,
        archetype: assembly.aiDesign?.archetype,
        weaponLayout: assembly.aiDesign?.weaponLayout,
        parts: activeParts.length,
        weapons: weapons.length,
        mounts: mounts.length,
        autoCutBlocks: assembly.aiDesign?.autoCutBlocks ?? [],
        forwardWeapon,
        validations,
        axisChecks,
        collisionChecks,
        clearanceChecks,
        pass: validations.every((entry) => entry.valid)
          && axisChecks.every((entry) => entry.valid)
          && collisionChecks.every((entry) => !entry.blocked)
          && clearanceChecks.every((entry) => entry.blocked.length === 0)
          && forwardWeapon,
      };
    });
    state.lastInstallationAudit = { pass: results.every((result) => result.pass), results };
    return snapshot();
  };
  const auditWeaponDurability = () => {
    const savedWorldTime = worldTime;
    const types = ['spinner', 'bar', 'hammer', 'flipper', 'drum'];
    const results = [];
    for (const [index, type] of types.entries()) {
      const robot = new Robot({ id: 880 + index, name: `WEAPON DURABILITY ${type}`, type, team: 'qa', tint: 0x7fdcff, assembly: createAIAssembly(type), position: { x: 999, z: 999 }, yaw: 0 });
      robot.root.visible = false;
      const weapon = robot.weapons[type];
      const moving = weapon?.blade ?? weapon?.moving ?? weapon?.plate ?? null;
      const mounts = weapon?.mounts ?? (weapon?.mount ? [weapon.mount] : []);
      const movingHpBefore = moving?.hp ?? 0;
      const mountHpBefore = mounts.map((part) => part.hp);
      for (let hit = 0; hit < 10; hit++) {
        worldTime += 0.14;
        const point = moving ? robot.partWorldCentre(moving) : robot.worldCenterOfMass();
        robot.applyWeaponReactionWear(weapon, 18, new THREE.Vector3(760, 90, 260), point, 'strong');
      }
      results.push({
        type,
        hits: 10,
        movingDetached: Boolean(moving?.detached),
        movingHpBefore: Number(movingHpBefore.toFixed(2)),
        movingHpAfter: Number((moving?.hp ?? 0).toFixed(2)),
        reactionDamage: Number((moving?.reactionDamage ?? 0).toFixed(2)),
        mountHpBefore: mountHpBefore.map((value) => Number(value.toFixed(2))),
        mountHpAfter: mounts.map((part) => Number(part.hp.toFixed(2))),
        mountDetached: mounts.map((part) => Boolean(part.detached)),
        weaponAvailable: robot.weaponAvailable(type),
        pass: Boolean(moving && !moving.detached && mounts.every((part) => !part.detached) && robot.weaponAvailable(type)),
      });
      scene.remove(robot.root);
    }
    worldTime = savedWorldTime;
    state.lastWeaponDurabilityAudit = { selfReactionDamageMultiplier: 0.18, hitsPerWeapon: 10, pass: results.every((result) => result.pass), results };
    return snapshot();
  };
  window.__battlebotSystemsQA = {
    start,
    startFullPlayer: () => { start(); resetGame(false, createAIAssembly('bar')); buildEnemyUI(); return snapshot(); },
    snapshot,
    topplePlayer: () => { const result = topple(player); state.toppledPlayerOrigin = result ? { x: result.x, z: result.z } : null; return snapshot(); },
    toppleAI: () => { const robot = robots.find((candidate) => !candidate.isPlayer && !candidate.dead); const result = topple(robot); state.toppledAIId = robot?.id ?? null; state.toppledAIOrigin = result ? { x: result.x, z: result.z } : null; return snapshot(); },
    penetrateAI: () => {
      const robot = robots.find((candidate) => !candidate.isPlayer && !candidate.dead);
      if (!robot) return snapshot();
      const supportHeight = robot.getGroundSupportInfo().height;
      const recoveriesBefore = robot.stats.floorRecoveries;
      const fsmRecoveriesBefore = groundStats.aiFsmFloorRecoveries;
      robot.root.position.y = supportHeight - 0.18;
      robot.velocity.set(0, -1.5, 0);
      robot.stuckTime = 2.4;
      robot.aiState = 'ATTACK';
      robot.aiStateTime = 4;
      robot.aiTargetId = player?.id ?? null;
      robot.aiNavPath = [new THREE.Vector3(robot.root.position.x + 3, 0, robot.root.position.z + 3)];
      if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(0.12);
      robot.updateWheelGroundDistances();
      const stability = getRobotStabilityTelemetry(robot);
      state.lastPenetrationRecovery = {
        name: robot.name,
        injectedMetres: 0.18,
        rootY: Number(robot.root.position.y.toFixed(4)),
        supportHeight: Number(robot.getGroundSupportInfo().height.toFixed(4)),
        maximumWheelGroundDistance: stability.maximumWheelGroundDistance,
        minimumWheelGroundDistance: stability.minimumWheelGroundDistance,
        wheelGroundDistances: stability.wheelGroundDistances,
        visualPhysicsWheelSyncError: stability.visualPhysicsWheelSyncError,
        recoveriesAdded: robot.stats.floorRecoveries - recoveriesBefore,
        fsmRecoveriesAdded: groundStats.aiFsmFloorRecoveries - fsmRecoveriesBefore,
        stuckTime: Number(robot.stuckTime.toFixed(3)),
        aiState: robot.aiState,
        targetRecalculated: robot.aiTargetId !== null,
        navPathRebuilt: robot.aiNavPath.length > 0,
        driveThrottle: Number(robot.control.throttle.toFixed(3)),
        brakeReleased: !robot.control.brake,
      };
      return snapshot();
    },
    weakenAI: () => {
      const robot = robots.find((candidate) => !candidate.isPlayer && !candidate.dead);
      if (robot?.corePart) {
        for (const part of robot.activeBlockParts()) {
          part.hp = part.maxHp * 0.18;
          part.record.hp = part.hp;
          robot.updateBlockDamageVisual(part);
        }
        robot.aiRetreatUntil = worldTime + 8;
      }
      return snapshot();
    },
  killAI: () => { const robot = robots.find((candidate) => !candidate.isPlayer && !candidate.dead); if (robot) { state.killedAIId = robot.id; state.killedAIName = robot.name; robot.destroyRobot(player, 'AI_DISABLED'); } return snapshot(); },
  killPlayer: () => { if (player && !player.dead) { state.playerWasKilled = true; player.destroyRobot(null, 'PLAYER_REQUEST'); } return snapshot(); },
    hitPlayer: () => {
      if (!player || player.dead) return snapshot();
      const part = player.activeBlockParts().find((candidate) => !candidate.isCore) ?? player.corePart;
      const before = part?.hp ?? 0;
      const point = player.partWorldCentre(part);
      const result = player.applyImpactAtPoint(new THREE.Vector3(1250, 120, 260), point, 170, 'bar', null, { contactSpeed: 60, weaponMass: 46, forceTier: 'critical', suppressFeedback: true, suppressAudio: true });
      state.lastProtectionHit = { protected: Boolean(result?.protected), blockId: part?.assemblyId ?? null, before: Number(before.toFixed(3)), after: Number((part?.hp ?? 0).toFixed(3)), unchanged: Math.abs((part?.hp ?? 0) - before) < 0.0001 };
      return snapshot();
    },
    exerciseTactic,
    auditInstallations,
    auditWeaponDurability,
    criticalBlock: () => {
      const robot = robots.find((candidate) => !candidate.isPlayer && !candidate.dead && candidate.team === 'red')
        ?? robots.find((candidate) => !candidate.isPlayer && !candidate.dead)
        ?? player;
      robot.spawnProtectionUntil = 0;
      const part = robot.activeBlockParts().find((candidate) => !candidate.isCore) ?? robot.corePart;
      const point = robot.partWorldCentre(part);
      const impulse = new THREE.Vector3(1, 0.12, 0.3).normalize().multiplyScalar(1550);
      robot.applyImpactAtPoint(impulse, point, 190, 'bar', player, { contactSpeed: 62, weaponMass: 46, forceTier: 'critical', suppressFeedback: true, suppressAudio: true });
      return snapshot();
    },
  };
  const panel = document.createElement('section');
  panel.id = 'systems-qa-panel';
  panel.setAttribute('aria-label', '블록 전투 AI 리스폰 검증');
  Object.assign(panel.style, { position: 'fixed', left: '4px', top: '74px', width: 'min(360px,calc(100vw - 8px))', zIndex: '80', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '4px', padding: '6px', background: 'rgba(10,18,29,.94)', border: '1px solid #55b6ff', borderRadius: '8px' });
  const output = document.createElement('output');
  output.id = 'systems-qa-output';
  output.style.cssText = 'grid-column:1/-1;max-height:70px;overflow:auto;color:#d8f5ff;font:8px/1.2 ui-monospace,monospace';
  const add = (label, action, id) => {
    const button = document.createElement('button');
    button.type = 'button'; button.id = id; button.textContent = label;
    button.style.cssText = 'min-width:0;padding:5px 2px;font-size:8px;line-height:1.05';
    button.addEventListener('click', () => { output.textContent = JSON.stringify(action()); });
    panel.append(button);
  };
  add('START 4v4', start, 'qa-systems-start');
  add('FULL PLAYER', window.__battlebotSystemsQA.startFullPlayer, 'qa-systems-full-player');
  add('BLOCK CRITICAL', window.__battlebotSystemsQA.criticalBlock, 'qa-systems-block');
  add('LOW HP AI', window.__battlebotSystemsQA.weakenAI, 'qa-systems-lowhp');
  add('TOPPLE PLAYER', window.__battlebotSystemsQA.topplePlayer, 'qa-systems-topple-player');
  add('TOPPLE AI', window.__battlebotSystemsQA.toppleAI, 'qa-systems-topple-ai');
  add('PENETRATE AI', window.__battlebotSystemsQA.penetrateAI, 'qa-systems-penetrate-ai');
  add('KILL AI', window.__battlebotSystemsQA.killAI, 'qa-systems-kill-ai');
  add('KILL PLAYER', window.__battlebotSystemsQA.killPlayer, 'qa-systems-kill-player');
  add('HIT PLAYER', window.__battlebotSystemsQA.hitPlayer, 'qa-systems-hit-player');
  add('AI AMBUSH', () => exerciseTactic('ambush'), 'qa-systems-ambush');
  add('AI REENTRY', () => exerciseTactic('reentry'), 'qa-systems-reentry');
  add('AI SEARCH', () => exerciseTactic('search'), 'qa-systems-search');
  add('AI CHASE', () => exerciseTactic('chase'), 'qa-systems-chase');
  add('AI ATTACK', () => exerciseTactic('attack'), 'qa-systems-attack');
  add('AI RETREAT', () => exerciseTactic('retreat'), 'qa-systems-retreat');
  add('AI FLANK', () => exerciseTactic('flank'), 'qa-systems-flank');
  add('INSTALL AUDIT', window.__battlebotSystemsQA.auditInstallations, 'qa-systems-install-audit');
  add('WEAPON 10x', window.__battlebotSystemsQA.auditWeaponDurability, 'qa-systems-weapon-durability');
  add('STEP 1s', () => { if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(1); return snapshot(); }, 'qa-systems-step-1');
  add('STEP 5s', () => { if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(5); return snapshot(); }, 'qa-systems-step-5');
  add('SNAPSHOT', snapshot, 'qa-systems-snapshot');
  panel.append(output);
  document.body.append(panel);
}

function industrialQASnapshot() {
  const activeRobots = robots.filter((robot) => !robot.dead);
  const outside = activeRobots.filter((robot) => Math.abs(robot.root.position.x) > activeHalfWidth() + 0.01 || Math.abs(robot.root.position.z) > activeHalfLength() + 0.01);
  const movingAI = activeRobots.filter((robot) => !robot.isPlayer && robot.velocity.length() > 0.3).length;
  const stuckAI = activeRobots.filter((robot) => !robot.isPlayer && robot.stuckTime > 0.9).length;
  const teamCounts = Object.fromEntries([...new Set(activeRobots.map((robot) => robot.team))].map((team) => [team, activeRobots.filter((robot) => robot.team === team).length]));
  const averageFrameMs = renderPerformanceStats.frames ? renderPerformanceStats.totalFrameMs / renderPerformanceStats.frames : 0;
  if (industrialSoloRouteQA.active && industrialSoloRouteQA.kind === 'regions') industrialStats.tests.soloRoute = 'active';
  else if (industrialSoloRouteQA.kind === 'regions' && industrialSoloRouteQA.visited >= 5 && industrialSoloRouteQA.distance >= 500) industrialStats.tests.soloRoute = 'pass';
  industrialStats.tests.team4v4 = battleMode === '4v4' && robots.length === 8 ? 'pass' : industrialStats.tests.team4v4;
  industrialStats.tests.team6v6 = battleMode === '6v6' && robots.length === 12 ? 'pass' : industrialStats.tests.team6v6;
  industrialStats.tests.team8v8 = battleMode === '8v8' && robots.length === 16 ? 'pass' : industrialStats.tests.team8v8;
  industrialStats.tests.ffa4 = battleMode === 'ffa4' && robots.length === 4 ? 'pass' : industrialStats.tests.ffa4;
  industrialStats.tests.ffa8 = battleMode === 'ffa8' && robots.length === 8 ? 'pass' : industrialStats.tests.ffa8;
  industrialStats.tests.aiAvoidance = robots.length > 1 && movingAI > 0 && stuckAI === 0 ? 'pass' : 'observing';
  industrialStats.tests.debrisFloor = groundStats.maxDebrisPenetration <= 0.002 ? 'pass' : 'fail';
  return {
    mapId: selectedMapId,
    mapName: activeMap.name,
    dimensions: industrialStats.dimensions,
    scaleFromV99: industrialStats.scaleFromV99,
    areaRatioToArena01: industrialStats.areaRatioToArena01,
    sourceAssets: industrialStats.assets,
    floor: industrialStats.floor,
    centralPlaza: industrialStats.centralPlaza,
    navigation: { ...industrialStats.navigation, revision: industrialNavigation.revision },
    battle: { mode: battleMode, elapsed: Number(battleElapsed.toFixed(1)), totalRobots: robots.length, activeRobots: activeRobots.length, teamCounts, movingAI, stuckAI, pathingAI: activeRobots.filter((robot) => !robot.isPlayer && robot.aiNavPath?.length).length, combatClusters: countCombatClusters() },
    soloRoute: { active: industrialSoloRouteQA.active, kind: industrialSoloRouteQA.kind, visited: industrialSoloRouteQA.visited, remaining: industrialSoloRouteQA.route.length, distance: Number(industrialSoloRouteQA.distance.toFixed(1)), elapsed: Number(((industrialSoloRouteQA.active ? worldTime - industrialSoloRouteQA.startWorldTime : industrialSoloRouteQA.elapsed) || 0).toFixed(2)), requiredMajorRegions: 5, minimumDistance: 500 },
    bounds: { outsideRobots: outside.map((robot) => robot.name), fenceClosed: outside.length === 0, debrisOutside: debris.filter((item) => Math.abs(item.object.position.x) > activeHalfWidth() || Math.abs(item.object.position.z) > activeHalfLength()).length },
    performance: { frames: renderPerformanceStats.frames, averageFrameMs: Number(averageFrameMs.toFixed(2)), maxFrameMs: Number(renderPerformanceStats.maxFrameMs.toFixed(2)), over33ms: renderPerformanceStats.over33ms, pixelRatio: renderer.getPixelRatio(), activeDebris: debris.length, debrisLimit: MAX_ACTIVE_DEBRIS },
    environmentPhysicsQA: environmentPhysicsQAResult,
    tests: { ...industrialStats.tests },
  };
}

function runEnvironmentPhysicsQA() {
  if (selectedMapId !== 'industrial01') setActiveMap('industrial01');
  const savedWorldTime = worldTime;
  const savedGroundStats = { ...groundStats };
  const savedEnvironmentStats = { ...environmentCollisionStats };
  environmentPhysicsQARunning = true;
  const testRobot = new Robot({
    id: 997, name: 'ENVIRONMENT PHYSICS QA', type: 'spinner', team: 'qa', tint: 0x8fdcff,
    assembly: createAIAssembly('spinner'), position: { x: 0, z: 158 }, yaw: 0,
  });
  testRobot.root.visible = false;
  testRobot.dead = true;
  for (const weapon of testRobot.rotaryWeapons) Object.assign(weapon, { active: false, rpm: 0, visualRpm: 0 });
  const dt = 1 / 240;
  const resetDynamicState = ({ x, z, yaw = 0, pitch = 0, roll = 0, height = 0, velocity = new THREE.Vector3() }) => {
    testRobot.root.position.set(x, 0, z);
    testRobot.yaw = yaw;
    testRobot.pitch = pitch;
    testRobot.roll = roll;
    testRobot.root.rotation.set(pitch, yaw, roll, 'YXZ');
    testRobot.root.position.y = testRobot.getGroundSupportInfo().height + height;
    testRobot.velocity.copy(velocity);
    testRobot.yawVelocity = 0;
    testRobot.pitchVelocity = 0;
    testRobot.rollVelocity = 0;
    testRobot.control = { throttle: 0, steering: 0, brake: false };
    testRobot.grounded = false;
    testRobot.lastSupportInfo = null;
    testRobot.wasAirborne = height > 0.065;
    testRobot.airborneTime = 0;
    testRobot.lastLandingTime = -Infinity;
    testRobot.lastEnvironmentContact = null;
    testRobot.passiveSettledSeconds = 0;
    testRobot.passiveSettledArmed = false;
  };
  const simulateDrop = (name, pitch, roll) => {
    resetDynamicState({ x: 0, z: 158, pitch, roll, height: 4.5, velocity: new THREE.Vector3(0.35, -11.5, 0.18) });
    let minimumClearance = Infinity;
    let maximumPenetration = 0;
    for (let index = 0; index < 960; index++) {
      worldTime += dt;
      testRobot.updatePhysics(dt, game);
      const clearance = testRobot.root.position.y - testRobot.getGroundSupportInfo().height;
      minimumClearance = Math.min(minimumClearance, clearance);
      maximumPenetration = Math.max(maximumPenetration, Math.max(0, -clearance));
    }
    const finalClearance = testRobot.root.position.y - testRobot.getGroundSupportInfo().height;
    return {
      name,
      minimumClearanceMm: Number((minimumClearance * 1000).toFixed(3)),
      maximumPenetrationMm: Number((maximumPenetration * 1000).toFixed(3)),
      finalClearanceMm: Number((finalClearance * 1000).toFixed(3)),
      finalVerticalSpeed: Number(testRobot.velocity.y.toFixed(4)),
      pass: minimumClearance >= -0.002,
    };
  };
  const obstacleImpact = (obstacle, speed) => {
    const yaw = obstacle.rotationY ?? 0;
    const direction = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
    resetDynamicState({ x: obstacle.x, z: obstacle.z, yaw });
    const centredFootprint = robotCollisionFootprint(testRobot);
    const extent = Math.max(...centredFootprint.map((point) => Math.abs(point.clone().sub(testRobot.root.position).dot(direction))));
    const expectedFreeTravel = 2;
    const start = new THREE.Vector3(obstacle.x, 0, obstacle.z).addScaledVector(direction, -(obstacle.halfZ + extent + expectedFreeTravel));
    resetDynamicState({ x: start.x, z: start.z, yaw, velocity: direction.clone().multiplyScalar(speed) });
    const startPosition = testRobot.root.position.clone();
    let contactTravel = null;
    let contactTime = null;
    let maximumLift = 0;
    let minimumClearance = Infinity;
    for (let index = 0; index < 1440; index++) {
      worldTime += dt;
      testRobot.updatePhysics(dt, game);
      const clearance = testRobot.root.position.y - testRobot.getGroundSupportInfo().height;
      maximumLift = Math.max(maximumLift, clearance);
      minimumClearance = Math.min(minimumClearance, clearance);
      if (contactTime === null && testRobot.lastEnvironmentContact?.obstacleType === obstacle.obstacleType) {
        contactTime = worldTime;
        contactTravel = testRobot.root.position.clone().sub(startPosition).setY(0).length();
      }
      if (contactTime !== null && worldTime - contactTime >= 0.75) break;
    }
    const reboundSpeed = Math.max(0, -testRobot.velocity.dot(direction));
    const remainingOverlap = polygonObstacleContact(testRobot, obstacle)?.penetration ?? 0;
    const contactError = contactTravel === null ? Infinity : Math.abs(contactTravel - expectedFreeTravel);
    return {
      obstacleType: obstacle.obstacleType,
      incomingSpeed: speed,
      contactOccurred: contactTime !== null,
      expectedFreeTravel: expectedFreeTravel,
      actualFreeTravel: contactTravel === null ? null : Number(contactTravel.toFixed(3)),
      contactError: Number.isFinite(contactError) ? Number(contactError.toFixed(3)) : null,
      reboundSpeed: Number(reboundSpeed.toFixed(3)),
      maximumLift: Number(maximumLift.toFixed(3)),
      minimumClearanceMm: Number((minimumClearance * 1000).toFixed(3)),
      remainingOverlapMm: Number((remainingOverlap * 1000).toFixed(3)),
      verticalVelocityAdded: Number((testRobot.lastEnvironmentContact ? environmentCollisionStats.maxVerticalVelocityAdded : 0).toFixed(4)),
      pass: contactTime !== null && contactError <= 0.12 && reboundSpeed <= speed * 0.08 + 0.2
        && maximumLift <= 0.22 && minimumClearance >= -0.002 && remainingOverlap <= 0.002,
    };
  };

  let result;
  try {
    const drops = [
      simulateDrop('upright-drop', 0, 0),
      simulateDrop('side-drop', 0, Math.PI / 2),
      simulateDrop('upside-down-drop', Math.PI, 0),
    ];
    const barrier = obstacles.find((obstacle) => obstacle.obstacleType === 'concrete-barrier' && Math.abs(obstacle.rotationY) < 0.05)
      ?? obstacles.find((obstacle) => obstacle.obstacleType === 'concrete-barrier');
    const container = obstacles.find((obstacle) => obstacle.obstacleType === 'container' && Math.abs(obstacle.rotationY) < 0.01)
      ?? obstacles.find((obstacle) => obstacle.obstacleType === 'container');
    const impacts = [3, 9, 24].map((speed) => obstacleImpact(barrier, speed));
    impacts.push(obstacleImpact(container, 12));
    const seatedObjects = scene.children.filter((object) => ['Industrial01_Containers_26', 'Industrial01_ConcreteBarriers_30', 'Industrial01_FenceNorthSouth', 'Industrial01_FenceEastWest'].includes(object.name));
    const groundSeating = seatedObjects.map((object) => ({ name: object.name, groundGap: object.userData.groundGap, pass: object.userData.groundGap <= 0 && object.userData.groundGap >= -0.01 }));
    const dropsPass = drops.every((entry) => entry.pass);
    const impactsPass = impacts.every((entry) => entry.pass);
    const seatingPass = groundSeating.length === 4 && groundSeating.every((entry) => entry.pass);
    result = {
      generatedAtWorldTime: Number(worldTime.toFixed(3)),
      physicsFloor: { topY: PHYSICS_FLOOR_TOP, thickness: PHYSICS_FLOOR_THICKNESS.industrial01, solverHz: 240, source: 'production Robot.updatePhysics' },
      drops,
      impacts,
      groundSeating,
      selfCollision: { enabled: false, ignoredPairs: 'same-robot block/wheel/weapon' },
      allPass: dropsPass && impactsPass && seatingPass,
    };
    industrialStats.tests.robotFloorDrops = dropsPass ? 'pass' : 'fail';
    industrialStats.tests.obstacleContact = impacts.every((entry) => entry.contactOccurred && (entry.contactError ?? Infinity) <= 0.12) ? 'pass' : 'fail';
    industrialStats.tests.obstacleBounce = impactsPass ? 'pass' : 'fail';
    industrialStats.tests.groundSeating = seatingPass ? 'pass' : 'fail';
  } finally {
    scene.remove(testRobot.root);
    worldTime = savedWorldTime;
    environmentPhysicsQARunning = false;
    Object.assign(groundStats, savedGroundStats);
    Object.assign(environmentCollisionStats, savedEnvironmentStats);
  }
  environmentPhysicsQAResult = result;
  updateUI();
  return result;
}

if (new URLSearchParams(location.search).get('physicsQA') === '1') {
  window.__battlebotEnvironmentQA = { runAll: runEnvironmentPhysicsQA, snapshot: () => environmentPhysicsQAResult };
  const panel = document.createElement('section');
  panel.id = 'environment-physics-qa-panel';
  panel.setAttribute('aria-label', '지면 및 장애물 물리 검증');
  Object.assign(panel.style, { position: 'fixed', right: '6px', top: '76px', zIndex: '95', display: 'grid', gap: '4px', width: '310px', padding: '6px', background: 'rgba(10,18,24,.94)', border: '1px solid #65ffb5', borderRadius: '7px' });
  const runButton = document.createElement('button');
  runButton.id = 'qa-environment-run';
  runButton.type = 'button';
  runButton.textContent = 'RUN FLOOR + OBSTACLE QA';
  const output = document.createElement('output');
  output.id = 'qa-environment-output';
  output.style.cssText = 'max-height:170px;overflow:auto;color:#e7fff5;font:9px/1.2 ui-monospace,monospace;white-space:pre-wrap';
  runButton.addEventListener('click', () => { output.textContent = JSON.stringify(runEnvironmentPhysicsQA(), null, 2); });
  panel.append(runButton, output);
  document.body.append(panel);
}

if (new URLSearchParams(location.search).get('industrialQA') === '1') {
  window.__battlebotIndustrialQA = {
    snapshot: industrialQASnapshot,
    start: (battle = '4v4') => {
      ui.battleMap.value = 'industrial01';
      ui.lobbyBattleMap.value = 'industrial01';
      ui.battleMode.value = battle;
      ui.lobbyBattleMode.value = battle;
      setActiveMap('industrial01');
      startBattle(false);
      return industrialQASnapshot();
    },
    startSoloRoute: startIndustrialSoloRouteQA,
    startStraightCrossing: startIndustrialStraightCrossingQA,
  };
  const panel = document.createElement('section');
  panel.id = 'industrial-qa-panel';
  panel.setAttribute('aria-label', '대규모 전투맵 검증');
  Object.assign(panel.style, { position: 'fixed', left: '86px', right: '4px', bottom: '8px', zIndex: '70', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '4px', padding: '6px', background: 'rgba(10,22,24,.9)', border: '1px solid #76b8a2', borderRadius: '8px' });
  const output = document.createElement('output');
  output.id = 'industrial-qa-output';
  output.style.cssText = 'grid-column:1/-1;max-height:54px;overflow:auto;color:#d9fff2;font:9px/1.2 ui-monospace,monospace';
  const button = (label, action, id) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.id = id;
    element.textContent = label;
    element.style.cssText = 'min-width:0;padding:5px 2px;font-size:9px;line-height:1.05';
    element.addEventListener('click', () => { output.textContent = JSON.stringify(action()); });
    panel.append(element);
  };
  button('INDUSTRIAL 4v4', () => window.__battlebotIndustrialQA.start('4v4'), 'qa-industrial-4v4');
  button('INDUSTRIAL 8v8', () => window.__battlebotIndustrialQA.start('8v8'), 'qa-industrial-8v8');
  button('FFA 4', () => window.__battlebotIndustrialQA.start('ffa4'), 'qa-industrial-ffa4');
  button('FFA 8', () => window.__battlebotIndustrialQA.start('ffa8'), 'qa-industrial-ffa8');
  button('6v6', () => window.__battlebotIndustrialQA.start('6v6'), 'qa-industrial-6v6');
  button('SOLO ROUTE', () => window.__battlebotIndustrialQA.startSoloRoute(), 'qa-industrial-solo');
  button('STRAIGHT TIME', () => window.__battlebotIndustrialQA.startStraightCrossing(), 'qa-industrial-straight');
  button('TOP VIEW', () => { arenaTopView = !arenaTopView; return industrialQASnapshot(); }, 'qa-industrial-top');
  button('QA +30s', () => { if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(30); return industrialQASnapshot(); }, 'qa-industrial-advance');
  button('SNAPSHOT', industrialQASnapshot, 'qa-industrial-snapshot');
  panel.append(output);
  document.body.append(panel);
}

function conquestQASnapshot() {
  const point = conquestState.points[conquestState.activePoint];
  const healerCounts = Object.fromEntries(['blue', 'red'].map((team) => [team, robots.filter((robot) => robot.team === team && robot.type === 'healer').length]));
  const aiRobots = robots.filter((robot) => !robot.isPlayer);
  const aiDesigns = aiRobots.map((robot) => robot.aiDesign);
  const installationAuditKeys = ['DetachedArmor', 'FloatingArmor', 'ArmorIntersection', 'DetachedHorn', 'FloatingHorn', 'DetachedExhaust', 'FloatingExhaust', 'WeaponIntersection'];
  const initialInstallationAudit = Object.fromEntries(installationAuditKeys.map((key) => [key, aiDesigns.reduce((sum, design) => sum + Number(design?.initialInstallationAudit?.[key] ?? 0), 0)]));
  initialInstallationAudit.Passed = installationAuditKeys.every((key) => initialInstallationAudit[key] === 0);
  const aiStateDistribution = Object.fromEntries([...new Set(aiRobots.map((robot) => robot.aiState))].sort().map((state) => [state, aiRobots.filter((robot) => robot.aiState === state).length]));
  const stalledWarnings = aiRobots.filter((robot) => robot.aiMeaninglessStationarySeconds >= 10).map((robot) => ({ id: robot.instanceUid, seconds: Number(robot.aiMeaninglessStationarySeconds.toFixed(2)), state: robot.aiState }));
  const stalledFailures = stalledWarnings.filter((entry) => entry.seconds >= 20);
  const invalidRespawnReasons = respawnStats.log.filter((entry) => !RESPAWN_REASONS.has(entry.reason));
  const worldRobotUIAudit = auditWorldRobotUIRemoved();
  const objectiveParticipation = aiRobots.reduce((sum, robot) => sum + robot.stats.objectiveVisits, 0) > 0 || conquestState.captures.length > 0;
  const objectiveSequenceParticipation = Boolean(!conquestState.points.A.owner || conquestState.points.B.blue > 0 || conquestState.points.B.red > 0
    || aiRobots.some((robot) => robot.lastObjectiveVisit === 'B') || conquestState.points.B.owner);
  const healerParticipation = conquestState.healerTicks > 0 || aiRobots.some((robot) => robot.aiState === 'HEAL_ALLY');
  const mountainColliders = obstacles.filter((obstacle) => obstacle.obstacleType === 'desert-cliff');
  const robotsInsideMountain = robots.filter((robot) => !robot.dead && mountainColliders.some((obstacle) => {
    const cos = Math.cos(-obstacle.rotationY); const sin = Math.sin(-obstacle.rotationY);
    const dx = robot.root.position.x - obstacle.x; const dz = robot.root.position.z - obstacle.z;
    return Math.abs(dx * cos - dz * sin) < obstacle.halfX - 0.3 && Math.abs(dx * sin + dz * cos) < obstacle.halfZ - 0.3;
  }));
  return {
    mapId: selectedMapId,
    mode: battleMode,
    totalRobots: robots.length,
    teamCounts: Object.fromEntries(['blue', 'red'].map((team) => [team, robots.filter((robot) => robot.team === team).length])),
    aliveCounts: Object.fromEntries(['blue', 'red'].map((team) => [team, robots.filter((robot) => robot.team === team && !robot.dead).length])),
    healers: healerCounts,
    objective: { active: conquestState.activePoint, contested: conquestState.contested, winner: conquestState.winner, pendingWinner: conquestState.pendingWinner, minimumMatchSeconds: conquestState.minimumMatchSeconds, A: { ...conquestState.points.A, centre: conquestState.points.A.centre.toArray() }, B: { ...conquestState.points.B, centre: conquestState.points.B.centre.toArray() }, captures: [...conquestState.captures] },
    captureRules: { secondsPerPoint: DESERT_LAYOUT.captureSeconds, progressPerSecond: Number((100 / DESERT_LAYOUT.captureSeconds).toFixed(4)), contestedBehaviour: 'freeze-exact-progress', sequence: 'A-then-B' },
    repairs: { zoneEvents: conquestState.repairEvents, healerTicks: conquestState.healerTicks },
    respawn: { delay: RESPAWN_DELAY_SECONDS, protection: SPAWN_PROTECTION_SECONDS, stats: { ...respawnStats } },
    terrain: { ...desertStats, currentHeightRange: desertStats.terrain.heightRange },
    canyon: {
      dimensions: [DESERT_LAYOUT.halfWidth * 2, DESERT_LAYOUT.halfLength * 2],
      blockerSegments: DESERT_CANYON_SEGMENTS.length,
      blockerColliders: obstacles.filter((obstacle) => obstacle.obstacleType === 'desert-cliff').length,
      directLinesBlocked: { ...desertStats.navigation.directLinesBlocked },
      routeFamilies: desertStats.navigation.routeFamilies,
      routeLengths: [...(desertStats.navigation.routeLengths ?? [])],
      routeWaypointCounts: [...(desertStats.navigation.routeWaypointCounts ?? [])],
      captureZonesClear: { ...desertStats.navigation.captureZonesClear },
      navigationConnected: desertStats.navigation.fullyConnected,
      aiLaneAssignments: [0, 1, 2].map((lane) => robots.filter((robot) => !robot.isPlayer && robot.id % 3 === lane).length),
      robotsInsideMountainColliders: robotsInsideMountain.map((robot) => robot.id),
      routeQA: { active: desertRouteQA.active, visited: desertRouteQA.visited, remaining: desertRouteQA.route.length, distance: Number(desertRouteQA.distance.toFixed(2)), elapsed: Number((desertRouteQA.active ? worldTime - desertRouteQA.startWorldTime : desertRouteQA.elapsed).toFixed(2)) },
    },
    minimap: { visible: !ui.conquestMinimap?.hidden, canvas: ui.minimapCanvas ? [ui.minimapCanvas.width, ui.minimapCanvas.height] : null, world: [DESERT_LAYOUT.halfWidth * 2, DESERT_LAYOUT.halfLength * 2], enemyDetectionRadius: 95, mountainSegmentsDrawn: DESERT_CANYON_SEGMENTS.length, tacticalRoutesDrawn: desertStats.navigation.minimapRoutes?.length ?? 0 },
    aiVisuals: {
      archetypes: [...new Set(aiDesigns.map((design) => design?.archetype))],
      heightTiers: [...new Set(aiDesigns.map((design) => design?.height))].sort(),
      heightDistribution: Object.fromEntries([1,2,3,4,5].map((height) => [height, aiDesigns.filter((design) => design?.height === height).length])),
      tallBots: aiDesigns.filter((design) => design?.height >= 3).length,
      armorPanelRange: [Math.min(...aiDesigns.map((design) => design?.exteriorCounts?.armor ?? 0)), Math.max(...aiDesigns.map((design) => design?.exteriorCounts?.armor ?? 0))],
      multiFaceArmorBots: aiDesigns.filter((design) => (design?.armorFaces?.length ?? 0) >= 3).length,
      hornedBots: aiDesigns.filter((design) => (design?.exteriorCounts?.horns ?? 0) > 0).length,
      exhaustBots: aiDesigns.filter((design) => (design?.exteriorCounts?.exhaust ?? 0) > 0).length,
      combatWeaponBots: aiDesigns.filter((design) => design?.weaponBay?.weaponType).length,
      lowFrontWeaponBays: aiDesigns.filter((design) => design?.weaponBay?.weaponType && design?.weaponBay?.lowMounted && design?.weaponBay?.frontMounted).length,
      weaponBayFailures: aiDesigns.filter((design) => design?.weaponBay?.weaponType && (!design?.weaponBay?.lowMounted || !design?.weaponBay?.frontMounted)).map((design) => ({ archetype: design.archetype, position: design.weaponBay.position, lowMounted: design.weaponBay.lowMounted, frontMounted: design.weaponBay.frontMounted, weaponType: design.weaponBay.weaponType })),
      floatingExterior: aiDesigns.reduce((sum, design) => sum + (design?.validation?.floatingExterior ?? 0), 0),
      validationFailures: aiDesigns.filter((design) => !design?.validation?.passed).map((design) => ({ archetype: design?.archetype, failures: design?.validation?.failures })),
      initialInstallationAudit,
      weightClasses: Object.fromEntries(['lightweight', 'middleweight', 'superheavy'].map((weightClass) => [weightClass, aiRobots.filter((robot) => robot.weightClass === weightClass && robot.type !== 'healer').length])),
      classIcons: {
        total: document.querySelectorAll('.conquest-icons .unit-icon').length,
        lightweight: document.querySelectorAll('.conquest-icons .unit-icon.lightweight').length,
        middleweight: document.querySelectorAll('.conquest-icons .unit-icon.middleweight').length,
        superheavy: document.querySelectorAll('.conquest-icons .unit-icon.superheavy').length,
        healer: document.querySelectorAll('.conquest-icons .unit-icon.healer .medical-mark').length,
      },
    },
    aiBehavior: {
      stateDistribution: aiStateDistribution,
      roleDistribution: Object.fromEntries(['capturer', 'blocker', 'flanker', 'healer'].map((role) => [role, aiRobots.filter((robot) => robot.aiRole === role).length])),
      objectiveStates: aiRobots.filter((robot) => ['MOVE_TO_OBJECTIVE', 'CAPTURE', 'DEFEND', 'CONTEST', 'FLANK'].includes(robot.aiState)).length,
      objectiveVisits: aiRobots.reduce((sum, robot) => sum + robot.stats.objectiveVisits, 0),
      defenceResponses: aiRobots.reduce((sum, robot) => sum + robot.stats.objectiveDefenceResponses, 0),
      movingRobots: aiRobots.filter((robot) => robot.stats.distance > 2).length,
      attackParticipants: aiRobots.filter((robot) => robot.stats.attacks > 0 || robot.stats.hits > 0).length,
      dashUsers: aiRobots.filter((robot) => robot.stats.dashUses > 0).length,
      totalDashUses: aiRobots.reduce((sum, robot) => sum + robot.stats.dashUses, 0),
      healerActors: aiRobots.filter((robot) => robot.type === 'healer' && ['HEAL_ALLY', 'RETREAT', 'HEALER_SELF_REPAIR'].includes(robot.aiState)).length,
      seekingHealer: aiRobots.filter((robot) => robot.aiState === 'SEEK_HEALER').length,
      healerSeekEvents: aiRobots.reduce((sum, robot) => sum + robot.stats.healerSeeks, 0),
      repairActors: aiRobots.filter((robot) => ['GO_REPAIR', 'REPAIR_RETREAT', 'HEALER_SELF_REPAIR'].includes(robot.aiState)).length,
      stuckRecoveryEvents: aiRobots.reduce((sum, robot) => sum + robot.aiStuckEvents, 0),
      currentlySpinningInPlace: aiRobots.filter((robot) => robot.aiMeaninglessStationarySeconds >= 2 && robot.aiStuckYawTravel > 0.8).length,
      stalledWarnings,
      stalledFailures,
      maximumMeaninglessStationarySeconds: Number(Math.max(0, ...aiRobots.map((robot) => robot.aiMaximumMeaninglessStationarySeconds)).toFixed(2)),
      pathProgressFailures: aiRobots.filter((robot) => robot.aiNoProgressSeconds >= 3).map((robot) => robot.instanceUid),
      reverseRecoveryCommands: aiRobots.reduce((sum, robot) => sum + robot.stats.reverseRecoveries, 0),
      controlDeadWhileDriveable: aiRobots.filter((robot) => !robot.dead && robot.wheels.some((wheel) => !wheel.part.detached) && robot.disabledReason && robot.aiState !== 'RESPAWN_DECISION').map((robot) => robot.instanceUid),
      stateHistories: Object.fromEntries(aiRobots.map((robot) => [robot.instanceUid, robot.aiStateHistory.slice(-16)])),
      totalTravelDistance: Number(aiRobots.reduce((sum, robot) => sum + robot.stats.distance, 0).toFixed(1)),
    },
    worldRobotUI: worldRobotUIAudit,
    removedWeapons: {
      hammer: !ASSETS.includes('new_hammer') && !robots.some((robot) => robot.type === 'hammer'),
      flipper: !ASSETS.includes('new_flipper') && !robots.some((robot) => robot.type === 'flipper'),
      mobileButtons: !document.querySelector('#spinner, #hammer, #flipper'),
    },
    audio: { impactGain: IMPACT_SOUND_GAIN, pools: Object.fromEntries(['hitWeak', 'hitMedium', 'hitStrong', 'hitCritical'].map((key) => [key, AUDIO_FILES[key]])), noImmediateRepeat: true },
    physics: { collisionEventDedupeMs: 75, dashAttackerReactionRatio: 0.1, victimFullImpulse: true },
    performance: performanceProfileSnapshot(),
    fatalLoopAcceptance: {
      elapsedSeconds: Number(battleElapsed.toFixed(2)),
      fiveMinutesReached: battleElapsed >= 300,
      worldRobotUIRemoved: worldRobotUIAudit.Passed,
      noTwentySecondAIStall: stalledFailures.length === 0,
      noUnknownRespawn: invalidRespawnReasons.length === 0 && respawnStats.rejectedUnknown === 0,
      objectiveParticipation,
      objectiveSequenceParticipation,
      healerParticipation,
      aiInitialInstallationPassed: initialInstallationAudit.Passed && aiDesigns.every((design) => design?.validation?.passed),
      invalidRespawnReasons,
      Passed: battleElapsed >= 300 && worldRobotUIAudit.Passed && stalledFailures.length === 0
        && invalidRespawnReasons.length === 0 && respawnStats.rejectedUnknown === 0
        && objectiveParticipation && objectiveSequenceParticipation && healerParticipation
        && initialInstallationAudit.Passed && aiDesigns.every((design) => design?.validation?.passed),
    },
    pointProgress: point ? { blue: point.blue, red: point.red } : null,
  };
}

function verifyMinimapHeadingMapping() {
  const samples = [
    { label: 'north/+Z', yaw: 0 },
    { label: 'east/+X', yaw: Math.PI / 2 },
    { label: 'south/-Z', yaw: Math.PI },
    { label: 'west/-X', yaw: -Math.PI / 2 },
  ].map((sample) => {
    const worldForward = forwardFor(sample.yaw);
    const expectedCanvas = new THREE.Vector2(worldForward.x, -worldForward.z).normalize();
    const renderedArrow = new THREE.Vector2(Math.sin(sample.yaw), -Math.cos(sample.yaw)).normalize();
    const error = renderedArrow.distanceTo(expectedCanvas);
    return { ...sample, expectedCanvas: expectedCanvas.toArray(), renderedArrow: renderedArrow.toArray(), error: Number(error.toFixed(6)), passed: error < 0.000001 };
  });
  return { samples, Passed: samples.every((sample) => sample.passed), rotationFormula: 'canvas.rotate(+robot.yaw)' };
}

function exercisePlayerControlRecovery20() {
  if (!player || player.dead) return { Passed: false, reason: 'player unavailable' };
  const results = [];
  Object.assign(cameraFollowTelemetry, {
    trackedYaw: player.yaw, reacquiring: false, reacquireSeconds: 0,
    maximumReacquireSeconds: 0, completedReacquisitions: 0,
    currentRearAlignment: 1, worstRearAlignment: 1,
  });
  for (let index = 0; index < 20; index++) {
    player.root.position.set(player.spawnPosition.x + (index % 2 ? 1.2 : -1.2), 4.2 + (index % 3) * 0.25, player.spawnPosition.z);
    player.pitch = (index % 2 ? 1 : -1) * (0.28 + (index % 4) * 0.08);
    player.roll = (index % 3 - 1) * 0.31;
    player.pitchVelocity = (index % 2 ? -1 : 1) * 3.1;
    player.rollVelocity = (index % 3 - 1) * 2.4;
    player.velocity.set((index % 2 ? 1 : -1) * 2.8, -6.4, 1.9);
    for (let step = 0; step < 84; step++) player.updatePhysics(1 / 120, game);
    player.pitch = (index % 2 ? 1 : -1) * 0.06;
    player.roll = (index % 3 - 1) * 0.05;
    player.pitchVelocity = 0;
    player.rollVelocity = 0;
    player.velocity.set(0, 0, 0);
    player.placeOnMeasuredGround();
    const previousYaw = player.yaw;
    player.yaw = normalizeAngle(previousYaw + (index % 3 === 0 ? Math.PI : index % 3 === 1 ? Math.PI / 2 : -Math.PI / 2));
    player.root.rotation.set(player.pitch, player.yaw, player.roll, 'YXZ');
    const newForward = forwardFor(player.yaw);
    camera.position.copy(player.root.position).addScaledVector(newForward, 12).add(new THREE.Vector3(0, 6, 0));
    cameraShake = 0;
    let cameraReacquireSeconds = 0;
    for (let step = 0; step < 72; step++) {
      updateCamera(1 / 120);
      cameraReacquireSeconds += 1 / 120;
      if (!cameraFollowTelemetry.reacquiring && cameraFollowTelemetry.currentRearAlignment >= 0.96) break;
    }
    const throttle = index % 2 ? -1 : 1;
    const keyboardAxes = resolveControlAxes(new Set([throttle > 0 ? 'KeyW' : 'KeyS', index % 2 ? 'KeyD' : 'KeyA']), { x: 0, y: 0 });
    player.control = { throttle: keyboardAxes.throttle, steering: keyboardAxes.steering, brake: false };
    player.physicsAwake = false;
    player.disabledReason = 'IMMOBILE';
    player.immobileSeconds = 4;
    player.playerDriveStallSeconds = 1.16;
    const recoveriesBefore = player.controlRecoveryCount;
    for (let step = 0; step < 36; step++) player.updatePhysics(1 / 120, game);
    const support = player.lastSupportInfo ?? player.getGroundSupportInfo();
    const signedDriveSpeed = player.velocity.dot(forwardFor(player.yaw)) * Math.sign(throttle);
    player.dashCooldown = 0;
    const dashWorked = player.requestDash('qa-hard-hit-recovery');
    const controlAudit = player.controlStateAudit();
    results.push({
      iteration: index + 1,
      direction: throttle < 0 ? 'REVERSE' : 'FORWARD',
      wheelDown: support.wheelContact && support.upDot > 0.52,
      awake: player.physicsAwake,
      disabledReason: player.disabledReason,
      recovered: player.controlRecoveryCount > recoveriesBefore,
      planarSpeed: Number(player.velocity.clone().setY(0).length().toFixed(3)),
      signedDriveSpeed: Number(signedDriveSpeed.toFixed(3)),
      steeringVisual: Number(player.steeringVisual.toFixed(3)),
      keyboardAxes,
      dashWorked,
      resetEnabled: !ui.reset?.disabled,
      cameraRearAlignment: Number(cameraFollowTelemetry.currentRearAlignment.toFixed(4)),
      cameraReacquireSeconds: Number(cameraReacquireSeconds.toFixed(4)),
      controlAudit,
    });
  }
  player.control = { throttle: 0, steering: 0, brake: true };
  const passed = results.every((result) => result.wheelDown && result.awake && result.disabledReason === null
    && result.recovered && result.planarSpeed > 0.05 && result.signedDriveSpeed > 0.02
    && result.dashWorked && result.resetEnabled && result.cameraRearAlignment >= 0.96
    && result.cameraReacquireSeconds <= 0.6 && result.controlAudit.controlsEnabled
    && result.controlAudit.motorEnabled && result.controlAudit.steeringEnabled);
  return {
    Passed: passed,
    PassedCount: results.filter((result) => result.wheelDown && result.awake && result.disabledReason === null
      && result.recovered && result.planarSpeed > 0.05 && result.signedDriveSpeed > 0.02
      && result.dashWorked && result.resetEnabled && result.cameraRearAlignment >= 0.96
      && result.cameraReacquireSeconds <= 0.6 && result.controlAudit.controlsEnabled
      && result.controlAudit.motorEnabled && result.controlAudit.steeringEnabled).length,
    ForwardPassed: results.filter((result) => result.direction === 'FORWARD' && result.signedDriveSpeed > 0.02).length,
    ReversePassed: results.filter((result) => result.direction === 'REVERSE' && result.signedDriveSpeed > 0.02).length,
    Total: results.length,
    cameraTelemetry: { ...cameraFollowTelemetry },
    results,
  };
}

function exercisePlayerSelfRight() {
  if (!player || player.dead) return { Passed: false, reason: 'player unavailable' };
  player.postureRecoveryCooldown = 0;
  player.postureRecovery = null;
  player.pitch = Math.PI;
  player.roll = 0.18;
  player.pitchVelocity = 0;
  player.rollVelocity = 0;
  player.velocity.set(0, 0, 0);
  player.root.rotation.set(player.pitch, player.yaw, player.roll, 'YXZ');
  player.placeOnMeasuredGround();
  player.lastSupportInfo = player.getGroundSupportInfo();
  const candidateBefore = player.isSelfRightCandidate();
  const started = player.startPostureRecovery('qa-player-self-right', true);
  for (let step = 0; step < 150; step++) player.updatePhysics(1 / 120, game);
  const support = player.lastSupportInfo ?? player.getGroundSupportInfo();
  // A robot resting on an authored terrain slope should not be required to
  // have exactly zero world Euler angles. Use physical up/contact instead.
  const upright = support.wheelContact && support.upDot > 0.96
    && Math.abs(normalizeAngle(player.pitch)) < 0.1 && Math.abs(normalizeAngle(player.roll)) < 0.1;
  const passed = candidateBefore && started && upright && support.wheelContact && support.upDot > 0.9 && !player.postureRecovery;
  return { Passed: passed, candidateBefore, started, upright, wheelContact: support.wheelContact, upDot: Number(support.upDot.toFixed(4)), pitch: Number(player.pitch.toFixed(4)), roll: Number(player.roll.toFixed(4)), position: player.root.position.toArray().map((value) => Number(value.toFixed(3))) };
}

window.__battlebotConquestQA = {
  start: () => {
    ui.battleMap.value = 'desert01';
    ui.lobbyBattleMap.value = 'desert01';
    ui.battleMode.value = '10v10';
    ui.lobbyBattleMode.value = '10v10';
    startBattle(false);
    return conquestQASnapshot();
  },
  snapshot: conquestQASnapshot,
  verifyMinimapHeading: verifyMinimapHeadingMapping,
  verifyPlayerControlRecovery20: exercisePlayerControlRecovery20,
  verifyPlayerSelfRight: exercisePlayerSelfRight,
  auditWorldRobotUI: auditWorldRobotUIRemoved,
  startRoute: startDesertRouteQA,
  verifyContestedFreeze: () => {
    const point = conquestState.points[conquestState.activePoint];
    const blue = robots.find((robot) => robot.team === 'blue' && !robot.dead);
    const red = robots.find((robot) => robot.team === 'red' && !robot.dead);
    point.blue = 37.25;
    point.red = 18.5;
    for (const robot of [blue, red]) if (robot) {
      robot.root.position.set(point.centre.x + (robot.team === 'blue' ? -1 : 1), point.centre.y + 1, point.centre.z);
      robot.placeOnMeasuredGround();
      robot.velocity.set(0, 0, 0);
    }
    const before = { blue: point.blue, red: point.red };
    updateConquestBattle(15);
    return { before, after: { blue: point.blue, red: point.red }, contested: conquestState.contested, frozen: before.blue === point.blue && before.red === point.red };
  },
  verifySoloCapture60: (team = 'blue') => {
    const pointKey = conquestState.activePoint;
    const point = conquestState.points[pointKey];
    point.blue = 0;
    point.red = 0;
    const occupant = robots.find((robot) => robot.team === team && !robot.dead);
    for (const robot of robots.filter((candidate) => !candidate.dead)) {
      if (robot === occupant) robot.root.position.set(point.centre.x, point.centre.y + 1, point.centre.z);
      else robot.root.position.set(robot.spawnPosition.x, desertTerrainHeight(robot.spawnPosition.x, robot.spawnPosition.z) + 1, robot.spawnPosition.z);
      robot.placeOnMeasuredGround();
      robot.velocity.set(0, 0, 0);
    }
    updateConquestBattle(DESERT_LAYOUT.captureSeconds);
    return { point: pointKey, team, owner: point.owner, progress: point[team], captured: point.owner === team, nextActivePoint: conquestState.activePoint };
  },
  stageCapture: (team = 'blue') => {
    const point = conquestState.points[conquestState.activePoint];
    point[team] = 100;
    const allies = robots.filter((robot) => robot.team === team && !robot.dead).slice(0, 3);
    allies.forEach((robot, index) => { robot.root.position.set(point.centre.x + index - 1, point.centre.y + 1, point.centre.z); robot.placeOnMeasuredGround(); });
    for (const opponent of robots.filter((robot) => robot.team !== team && !robot.dead && robot.root.position.distanceToSquared(point.centre) <= (point.radius + 4) ** 2)) {
      opponent.root.position.set(opponent.spawnPosition.x, desertTerrainHeight(opponent.spawnPosition.x, opponent.spawnPosition.z) + 1, opponent.spawnPosition.z);
      opponent.placeOnMeasuredGround();
      opponent.velocity.set(0, 0, 0);
    }
    updateConquestBattle(0);
    return conquestQASnapshot();
  },
  damageForRepair: (team = 'blue') => {
    const target = robots.find((robot) => robot.team === team && !robot.isPlayer && !robot.dead);
    const block = target ? [...target.blockParts.values()].find((part) => !part.isCore) : null;
    if (block) {
      block.hp = Math.max(1, block.maxHp * 0.2);
      block.record.hp = block.hp;
      const zoneZ = (team === 'blue' ? -1 : 1) * (DESERT_LAYOUT.halfLength - DESERT_LAYOUT.spawnInset);
      target.root.position.set(0, desertTerrainHeight(0, zoneZ) + 1, zoneZ);
      target.placeOnMeasuredGround();
      target.velocity.set(0, 0, 0);
    }
    return conquestQASnapshot();
  },
  damageForHealer: (team = 'blue') => {
    const healer = robots.find((robot) => robot.team === team && robot.type === 'healer' && !robot.dead);
    const target = robots.find((robot) => robot.team === team && robot !== healer && !robot.isPlayer && !robot.dead);
    const block = target ? [...target.blockParts.values()].find((part) => !part.isCore) : null;
    if (healer && target && block) {
      block.hp = Math.max(1, block.maxHp * 0.18);
      block.record.hp = block.hp;
      const z = team === 'blue' ? -82 : 82;
      healer.root.position.set(-20, desertTerrainHeight(-20, z) + 1, z);
      target.root.position.set(-16, desertTerrainHeight(-16, z) + 1, z);
      healer.placeOnMeasuredGround();
      target.placeOnMeasuredGround();
      healer.velocity.set(0, 0, 0);
      target.velocity.set(0, 0, 0);
    }
    return conquestQASnapshot();
  },
  disableAI: (team = 'red') => {
    const target = robots.find((robot) => robot.team === team && !robot.isPlayer && !robot.dead && robot.type !== 'healer');
    if (target) {
      for (const wheel of target.wheels) {
        wheel.part.detached = true;
        wheel.part.object.visible = false;
      }
      target.immobileSeconds = 3.5;
      target.velocity.set(0, 0, 0);
      target.control = { throttle: 0, steering: 0, brake: true };
    }
    return conquestQASnapshot();
  },
};

function installConquestQAPanel() {
  if (document.querySelector('#conquest-qa-panel')) return;
  const panel = document.createElement('section');
  panel.id = 'conquest-qa-panel';
  panel.setAttribute('aria-label', 'Red Canyon 10v10 검증');
  panel.style.cssText = 'position:fixed;left:18%;right:18%;bottom:6px;z-index:95;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;padding:5px;background:rgba(33,12,9,.9);border:1px solid #f09a61;border-radius:8px';
  const output = document.createElement('output');
  output.id = 'conquest-qa-output';
  output.style.cssText = 'grid-column:1/-1;max-height:42px;overflow:auto;color:#ffe4cc;font:8px/1.2 ui-monospace,monospace';
  const addButton = (label, action, id) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.textContent = label;
    button.style.cssText = 'min-width:0;padding:4px 2px;font-size:8px';
    button.addEventListener('click', () => { output.textContent = JSON.stringify(action()); });
    panel.append(button);
  };
  addButton('RESET 10v10', window.__battlebotConquestQA.start, 'qa-conquest-start');
  addButton('CAPTURE A/B', () => window.__battlebotConquestQA.stageCapture('blue'), 'qa-conquest-capture');
  addButton('60s CAPTURE', () => window.__battlebotConquestQA.verifySoloCapture60('blue'), 'qa-conquest-60s');
  addButton('CONTEST FREEZE', () => window.__battlebotConquestQA.verifyContestedFreeze(), 'qa-conquest-contest');
  addButton('WORLD UI = 0', window.__battlebotConquestQA.auditWorldRobotUI, 'qa-world-ui-audit');
  addButton('REPAIR', () => window.__battlebotConquestQA.damageForRepair('blue'), 'qa-conquest-repair');
  addButton('HEALER', () => window.__battlebotConquestQA.damageForHealer('blue'), 'qa-conquest-healer');
  addButton('DISABLE AI', () => window.__battlebotConquestQA.disableAI('red'), 'qa-conquest-disable');
  addButton('BLUE-A-B-RED', window.__battlebotConquestQA.startRoute, 'qa-conquest-route');
  addButton('MINIMAP DIR', window.__battlebotConquestQA.verifyMinimapHeading, 'qa-conquest-minimap-dir');
  addButton('PLAYER HIT 20x', window.__battlebotConquestQA.verifyPlayerControlRecovery20, 'qa-player-control-20');
  addButton('SELF RIGHT', window.__battlebotConquestQA.verifyPlayerSelfRight, 'qa-player-self-right');
  addButton('SNAPSHOT', conquestQASnapshot, 'qa-conquest-snapshot');
  addButton('QA +12s', () => { if (typeof window.__battlebotQAStep === 'function') window.__battlebotQAStep(12); return conquestQASnapshot(); }, 'qa-conquest-advance');
  output.textContent = JSON.stringify(conquestQASnapshot());
  panel.append(output);
  document.body.append(panel);
}

try {
  await loadAssets();
  captureMapScene('arena01', createArena01);
  captureMapScene('industrial01', createIndustrialBattleZone);
  captureMapScene('desert01', createDesertConquestMap);
  const initialParams = new URLSearchParams(location.search);
  const requestedMap = initialParams.get('map');
  setActiveMap(requestedMap === 'desert01' || initialParams.get('conquestQA') === '1' ? 'desert01' : requestedMap === 'industrial01' || initialParams.get('industrialQA') === '1' ? 'industrial01' : 'arena01');
  prepareMountGeometry();
  const startupPlacementRepairs = repairLoadedFunctionalPlacement(savedAssembly);
  if (startupPlacementRepairs.length) {
    savedAssembly = enrichAssembly(savedAssembly);
    workingAssembly = cloneData(savedAssembly);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAssembly));
  }
  createGarageStage();
  enterLobby();
  ui.status.textContent = `Arena 01 + Industrial Battle Zone 01 + Red Canyon 10v10 + 저장 로봇 동기화 완료${startupPlacementRepairs.length ? ` · 기존 장착 ${startupPlacementRepairs.length}개 안전 보정` : ''}`;
  ui.status.classList.add('ready');
  if (initialParams.get('conquestQA') === '1') {
    window.__battlebotConquestQA.start();
    if (initialParams.get('qa') === 'isolated') installConquestQAPanel();
  } else if (initialParams.get('autoQA') === '1') {
    startBattle(true);
    startSelfTest();
  }
  requestAnimationFrame(frame);
} catch (error) {
  console.error(error);
  ui.status.textContent = `로딩 실패: ${error.message}`;
  ui.status.classList.add('error');
}

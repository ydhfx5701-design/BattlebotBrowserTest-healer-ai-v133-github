import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const checks = [];

function assert(name, condition, details = '') {
  checks.push({ name, pass: Boolean(condition), details });
  if (!condition) throw new Error(`${name}${details ? `: ${details}` : ''}`);
}

const newEnvironmentFiles = [
  'assets_lowpoly_environment/stands.glb',
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

assert('Arena01 only sparse low-steel set', app.includes("'Arena01_LowSteelObstacles_8'") && app.includes('moduleCount: arenaLowSteelPlacements.length'));
assert('Arena01 has no runtime legacy fence', !app.includes("addInstancedArenaModules('arena_fence'"));
assert('BattleZone new containers installed', app.includes("'Industrial01_LowPolyContainers_12'"));
assert('BattleZone new concrete installed', app.includes("'Industrial01_LowPolyConcreteBarriers_12'"));
assert('BattleZone new low steel installed', app.includes("'Industrial01_LowSteelBarriers_8'"));
assert('BattleZone old fence disabled', app.includes('industrialStats.assets.fenceModules = 0'));

assert('armor absorbs incoming first', app.includes('const armorDamage = Math.min(this.armor, incoming);'));
assert('only residual damage can reach structure', app.includes('survivalDamageResult.residual / survivalDamageResult.incoming'));
assert('player destruction QA exists', app.includes('playerBlockDestruction()'));
assert('block rendering is instanced', app.includes('buildBlockRenderBatches()') && app.includes('new THREE.InstancedMesh(getBlockGeometry'));
assert('destroyed block becomes real debris', app.includes('this.hideBlockRenderInstance(part);') && app.includes('chunk.attach(part.object);'));
assert('one compound body profile remains', app.includes('this.colliderComponents = createBlockColliderProfile(this.assembly.blocks);'));

assert('mobile quality scale low', app.includes('renderScale: 0.85') && app.includes('pixelRatio: 1.25'));
assert('mobile quality scale medium', app.includes('renderScale: 0.9') && app.includes('pixelRatio: 1.4'));
assert('mobile quality scale high', app.includes('renderScale: 1') && app.includes('pixelRatio: 1.5'));
assert('sustained thermal frame lock', app.includes('[THERMAL FRAME LOCK]') && app.includes('thermalFrameRateLimit > 45'));
assert('top FPS meter uses effective limit', app.includes('effectiveFrameRateLimit()') && app.includes('LOCK ${activeLimit}'));
assert('cachebuster updated', index.includes('20260829-lowpoly-damage-154'));

console.log(JSON.stringify({
  ok: checks.every((check) => check.pass),
  checks: checks.length,
  environmentBytes: newEnvironmentFiles.reduce((sum, relative) => sum + fs.statSync(path.join(root, relative)).size, 0),
  root,
}, null, 2));

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// Load the pure TypeScript detectors without adding a test framework.
const base = new URL('../src/services/pose/exercises/', import.meta.url);
const moduleUrls = new Map();
function moduleUrl(name) {
    if (moduleUrls.has(name)) return moduleUrls.get(name);
    const output = ts.transpileModule(readFileSync(new URL(name, base), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.ESNext },
    }).outputText.replace(/from ['"]\.\/([^'"]+)['"]/g, (_, dependency) => `from ${JSON.stringify(moduleUrl(`${dependency}.ts`))}`);
    const url = `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`;
    moduleUrls.set(name, url);
    return url;
}
async function load(name) { return import(moduleUrl(name)); }
const { AutoExerciseDetector } = await load('AutoExerciseDetector.ts');
const { detectSitUp } = await load('SitUpDetector.ts');
const { detectJumpingJack } = await load('JumpingJackDetector.ts');
const { detectPushUp } = await load('PushUpDetector.ts');
const blank = () => Array.from({ length: 33 }, () => ({ x: 0, y: 0, z: 0, visibility: 1 }));
function sitUp(raised) {
    const p = blank();
    for (const [s, h, k, a] of [[11, 23, 25, 27], [12, 24, 26, 28]]) {
        p[s] = { ...p[s], x: raised ? 0.2 : 0.1, y: raised ? 0.4 : 0.7 };
        p[h] = { ...p[h], x: 0.5, y: 0.7 };
        p[k] = { ...p[k], x: 0.8, y: 0.45 };
        p[a] = { ...p[a], x: 1, y: 0.7 };
    }
    return p;
}
function jack(open, arms = open) {
    const p = blank();
    for (const [s, w, h, a, sign] of [[11, 15, 23, 27, -1], [12, 16, 24, 28, 1]]) {
        p[s] = { ...p[s], x: 0.5 + sign * 0.15, y: 0.3 };
        p[w] = { ...p[w], x: 0.5 + sign * 0.3, y: arms ? 0.1 : 0.65 };
        p[h] = { ...p[h], x: 0.5 + sign * 0.1, y: 0.6 };
        p[a] = { ...p[a], x: 0.5 + sign * (open ? 0.35 : 0.1), y: 0.95 };
    }
    return p;
}
test('partial sit-up counts only after a full return and cannot start at the peak', () => {
    assert.equal(detectSitUp(sitUp(true), 'waiting').state, 'waiting');
    let r = detectSitUp(sitUp(false), 'waiting');
    assert.equal(r.state, 'ready');
    r = detectSitUp(sitUp(true), r.state);
    assert.equal(r.state, 'active');
    assert.equal(r.result.completed, false);
    r = detectSitUp(sitUp(false), r.state);
    assert.equal(r.result.completed, true);
    assert.equal(detectSitUp(sitUp(false), r.state).result.completed, false);
});
test('jumping jack requires both arms and feet and counts on closing', () => {
    let r = detectJumpingJack(jack(false), 'waiting');
    assert.equal(r.state, 'ready');
    assert.equal(detectJumpingJack(jack(false, true), r.state).state, 'ready');
    assert.equal(detectJumpingJack(jack(true, false), r.state).state, 'ready');
    r = detectJumpingJack(jack(true), r.state);
    assert.equal(r.state, 'active');
    assert.equal(detectJumpingJack(jack(false), r.state).result.completed, true);
});
test('lost pose resets the pending repetition in every detector', () => {
    for (const detector of [detectSitUp, detectJumpingJack, detectPushUp]) {
        assert.deepEqual(detector([], 'active'), { state: 'waiting', result: { completed: false } });
    }
    const hidden = jack(true);
    hidden[15].visibility = 0;
    assert.equal(detectJumpingJack(hidden, 'active').state, 'waiting');
});
function frontPushUp(down) {
    const p = blank();
    const world = blank();
    for (const [s, e, w, h, a, sign] of [[11, 13, 15, 23, 27, -1], [12, 14, 16, 24, 28, 1]]) {
        p[s].y = 0.4;
        p[w].y = 0.7;
        world[s] = { ...world[s], x: sign * 0.2, y: 0, z: 0 };
        world[w] = { ...world[w], x: sign * 0.4, y: 0.5, z: 0 };
        world[e] = { ...world[e], x: sign * (down ? 0.45 : 0.3), y: down ? 0.1 : 0.25, z: 0 };
        world[h] = { ...world[h], x: sign * 0.2, y: 0, z: 0.5 };
        world[a] = { ...world[a], x: sign * 0.2, y: 0, z: 1 };
    }
    return [p, world];
}
test('frontal push-up uses both 3D arms and rejects upright torso', () => {
    const [p, up] = frontPushUp(false);
    const [, down] = frontPushUp(true);
    let r = detectPushUp(p, 'waiting', 'front', up);
    assert.equal(r.state, 'ready');
    r = detectPushUp(p, r.state, 'front', down);
    assert.equal(r.state, 'active');
    r = detectPushUp(p, r.state, 'front', up);
    assert.equal(r.result.completed, true);
    const upright = structuredClone(up);
    upright[23].y = upright[24].y = 0.6;
    assert.equal(detectPushUp(p, 'active', 'front', upright).state, 'waiting');
    assert.equal(detectPushUp(p, 'active', 'front', []).state, 'waiting');
});
test('side push-up retains a complete down-up cycle', () => {
    const p = blank();
    for (const [s, e, w, h, a] of [[11, 13, 15, 23, 27], [12, 14, 16, 24, 28]]) {
        p[s] = { ...p[s], x: 0.2, y: 0.3 };
        p[e] = { ...p[e], x: 0.2, y: 0.5 };
        p[w] = { ...p[w], x: 0.2, y: 0.7 };
        p[h] = { ...p[h], x: 0.5, y: 0.3 };
        p[a] = { ...p[a], x: 0.9, y: 0.3 };
    }
    let r = detectPushUp(p, 'waiting');
    assert.equal(r.state, 'ready');
    const down = structuredClone(p);
    down[13].x = down[14].x = 0.5;
    r = detectPushUp(down, r.state);
    assert.equal(r.state, 'active');
    assert.equal(detectPushUp(p, r.state).result.completed, true);
});

const { detectSquat } = await load('SquatDetector.ts');
const clocks = new WeakMap();
function stable(auto, points, world = [], duration = 160) {
    let time = clocks.get(auto) ?? 0;
    let result;
    let completed = false;
    for (let elapsed = 0; elapsed < duration; elapsed += 40) {
        time += 40;
        result = auto.detect(points, world, time);
        completed ||= result.result.completed;
    }
    clocks.set(auto, time);
    return { ...result, result: { ...result.result, completed } };
}
function squat(lowered, front = false) {
    const p = blank();
    for (const [s, h, k, a, offset] of [[11, 23, 25, 27, 0], [12, 24, 26, 28, 0.25]]) {
        p[s] = { ...p[s], x: 0.2 + offset, y: lowered ? 0.4 : 0.2 };
        p[h] = { ...p[h], x: 0.2 + offset, y: lowered ? 0.7 : 0.5 };
        p[k] = { ...p[k], x: 0.2 + offset + (lowered && !front ? 0.25 : 0), y: 0.75 };
        p[a] = { ...p[a], x: 0.2 + offset, y: 1 };
        p[15 + (s - 11)] = { ...p[s], y: 0.65 };
    }
    return p;
}
test('automatic recognition switches exercises without selection or duplicate counts', () => {
    const auto = new AutoExerciseDetector();
    stable(auto, jack(false));
    let r = stable(auto, jack(true));
    assert.equal(r.exercise, 'jumpingJack');
    assert.equal(r.result.completed, false);
    assert.equal(stable(auto, jack(false)).result.completed, true);
    assert.equal(stable(auto, jack(false)).result.completed, false);
    stable(auto, sitUp(false));
    assert.equal(stable(auto, sitUp(true)).exercise, 'sitUp');
    assert.equal(stable(auto, sitUp(false)).result.completed, true);
    const [p, up] = frontPushUp(false);
    const [, down] = frontPushUp(true);
    stable(auto, p, up);
    assert.equal(stable(auto, p, down).exercise, 'pushUp');
    assert.equal(stable(auto, p, up).result.completed, true);
    assert.equal(stable(auto, p, up).result.completed, false);
    stable(auto, squat(false));
    assert.equal(stable(auto, squat(true)).exercise, 'squat');
    assert.equal(stable(auto, squat(false)).result.completed, true);
});
test('brief tracking loss preserves a rep, prolonged loss discards it', () => {
    const auto = new AutoExerciseDetector();
    stable(auto, jack(false));
    stable(auto, jack(true));
    stable(auto, []);
    assert.equal(stable(auto, jack(false)).result.completed, true);
    stable(auto, jack(true));
    assert.equal(stable(auto, [], [], 600).exercise, null);
    assert.equal(stable(auto, jack(false)).result.completed, false);
});
test('one noisy peak frame does not create a repetition', () => {
    const auto = new AutoExerciseDetector();
    stable(auto, jack(false));
    stable(auto, jack(true), [], 40);
    assert.equal(stable(auto, jack(false)).result.completed, false);
});
test('squats count only after standing back up, from side and front', () => {
    for (const front of [false, true]) {
        let r = detectSquat(squat(true, front), 'waiting');
        assert.equal(r.result.completed, false);
        assert.equal(r.state, 'waiting');
        r = detectSquat(squat(false, front), 'waiting');
        assert.equal(r.state, 'ready');
        r = detectSquat(squat(true, front), r.state);
        assert.equal(r.state, 'active');
        assert.equal(detectSquat(squat(false, front), r.state).result.completed, true);
    }
    assert.equal(detectSquat(sitUp(false), 'ready').state, 'waiting');
    assert.equal(detectSquat([], 'active').state, 'waiting');
});
test('standing and arm-only movements do not count as squats or jumping jacks', () => {
    const auto = new AutoExerciseDetector();
    stable(auto, squat(false));
    for (let i = 0; i < 4; i++) {
        assert.equal(stable(auto, squat(false)).result.completed, false);
    }
    stable(auto, jack(false));
    assert.equal(stable(auto, jack(false, true)).result.completed, false);
    assert.equal(stable(auto, jack(false)).result.completed, false);
});
test('camera stalls cannot complete a pending repetition', () => {
    const auto = new AutoExerciseDetector();
    stable(auto, jack(false));
    stable(auto, jack(true));
    clocks.set(auto, (clocks.get(auto) ?? 0) + 1000);
    assert.equal(stable(auto, jack(false)).result.completed, false);
});

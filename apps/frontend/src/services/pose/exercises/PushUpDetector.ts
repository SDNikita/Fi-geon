import {
    advance, calculateAngle, calculateAngle3D, hasVisible,
    type Detection, type Landmark, type MovementState,
} from './ExerciseDetector';

export type PushUpState = MovementState;
export type PushUpView = 'side' | 'front';

export function detectPushUp(
    points: Landmark[], state: PushUpState,
    view: PushUpView = 'side', world: Landmark[] = [],
): Detection {
    const invalid: Detection = { state: 'waiting', result: { completed: false } };
    const sides = [[11, 13, 15, 23, 27], [12, 14, 16, 24, 28]];
    const visible = sides.filter((side) => hasVisible(points, side));
    if (!visible.length) return invalid;
    let angles: number[];
    if (view === 'front') {
        if (visible.length !== 2 || !world.length) return invalid;
        for (const [s, , w, h, a] of sides) {
            if (![s, w, h, a].every((i) => world[i] &&
                [world[i].x, world[i].y, world[i].z].every(Number.isFinite))) return invalid;
            const torsoLength = Math.hypot(world[s].x - world[h].x,
                world[s].y - world[h].y, world[s].z - world[h].z);
            if (torsoLength < 0.1 || Math.abs(world[s].y - world[h].y) > torsoLength * 0.65
                || points[w].y < points[s].y
                || calculateAngle3D(world[s], world[h], world[a]) < 145) return invalid;
        }
        angles = sides.map(([s, e, w]) => calculateAngle3D(world[s], world[e], world[w]));
    } else {
        visible.sort((a, b) => b.reduce((sum, i) => sum + (points[i].visibility ?? 0), 0)
            - a.reduce((sum, i) => sum + (points[i].visibility ?? 0), 0));
        const [s, e, w, h, a] = visible[0].map((i) => points[i]);
        const torsoAngle = Math.atan2(Math.abs(h.y - s.y), Math.abs(h.x - s.x)) * 180 / Math.PI;
        if (torsoAngle > 45 || w.y < s.y || calculateAngle(s, h, a) < 135) return invalid;
        angles = [calculateAngle(s, e, w)];
    }
    if (!angles.every(Number.isFinite)) return invalid;
    const detection = advance(state, angles.every((a) => a > 150), angles.every((a) => a < 110));
    return { ...detection, result: { ...detection.result,
        angle: angles.reduce((sum, a) => sum + a, 0) / angles.length } };
}

import { advance, calculateAngle, calculateAngle3D, hasVisible,
    type Detection, type Landmark, type MovementState } from './ExerciseDetector';

export function detectSquat(points: Landmark[], state: MovementState, world: Landmark[] = []): Detection {
    const sides = [[11, 23, 25, 27], [12, 24, 26, 28]];
    const visible = sides.filter((side) => hasVisible(points, side));
    if (!visible.length) return { state: 'waiting', result: { completed: false } };
    visible.sort((a, b) => b.reduce((sum, i) => sum + (points[i].visibility ?? 0), 0)
        - a.reduce((sum, i) => sum + (points[i].visibility ?? 0), 0));
    const [s, h, k, a] = visible[0];
    const shoulder = points[s], hip = points[h], knee = points[k], ankle = points[a];
    const torso = Math.hypot(shoulder.x - hip.x, shoulder.y - hip.y);
    // Shoulders above hips, feet below hips: reject floor exercises.
    if (torso < 0.06 || hip.y - shoulder.y < torso * 0.35 || ankle.y - hip.y < torso * 0.35) {
        return { state: 'waiting', result: { completed: false } };
    }
    const angle2D = calculateAngle(hip, knee, ankle);
    const metric = [h, k, a].every((i) => world[i]
        && [world[i].x, world[i].y, world[i].z].every(Number.isFinite));
    const angle3D = metric ? calculateAngle3D(world[h], world[k], world[a]) : NaN;
    // Frontal knee angles in 2D can stay straight during a squat. The hip's
    // height above the knee supplies a fallback when 3D is unreliable/unavailable.
    const angle = Number.isFinite(angle3D) ? angle3D : angle2D;
    const hipHeight = (knee.y - hip.y) / torso;
    const standing = angle > 155 && hipHeight > 0.55;
    const lowered = angle < 125 || hipHeight < 0.4;
    const detection = advance(state, standing, lowered);
    return { ...detection, result: { ...detection.result, angle } };
}

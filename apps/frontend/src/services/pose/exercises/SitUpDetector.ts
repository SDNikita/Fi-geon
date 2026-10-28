import { advance, calculateAngle, hasVisible, type Detection, type Landmark, type MovementState } from './ExerciseDetector';

// Side view: bent knees, shoulders near the floor -> partial rise -> floor.
export function detectSitUp(points: Landmark[], state: MovementState): Detection {
    const sides = [[11, 23, 25, 27], [12, 24, 26, 28]];
    const visible = sides.filter((side) => hasVisible(points, side));
    visible.sort((a, b) => b.reduce((s, i) => s + (points[i].visibility ?? 0), 0)
        - a.reduce((s, i) => s + (points[i].visibility ?? 0), 0));
    if (!visible.length) return { state: 'waiting', result: { completed: false } };
    const [shoulder, hip, knee, ankle] = visible[0].map((i) => points[i]);
    const length = Math.hypot(shoulder.x - hip.x, shoulder.y - hip.y);
    const kneeAngle = calculateAngle(hip, knee, ankle);
    // Reject upright standing/squatting and an unobservable torso.
    if (length < 0.06 || kneeAngle > 160 || Math.abs(hip.y - ankle.y) > length * 0.85
        || knee.y > hip.y - length * 0.08) {
        return { state: 'waiting', result: { completed: false } };
    }
    const elevation = Math.asin(Math.max(-1, Math.min(1, (hip.y - shoulder.y) / length))) * 180 / Math.PI;
    const detection = advance(state, elevation < 15, elevation > 35);
    return { ...detection, result: { ...detection.result, angle: elevation } };
}

import { advance, hasVisible, type Detection, type Landmark, type MovementState } from './ExerciseDetector';

export function detectJumpingJack(points: Landmark[], state: MovementState): Detection {
    if (!hasVisible(points, [11, 12, 15, 16, 23, 24, 27, 28])) {
        return { state: 'waiting', result: { completed: false } };
    }
    const shoulderWidth = Math.abs(points[11].x - points[12].x);
    const shoulderY = (points[11].y + points[12].y) / 2;
    const hipY = (points[23].y + points[24].y) / 2;
    const torso = hipY - shoulderY;
    if (shoulderWidth < 0.05 || torso < 0.08) {
        return { state: 'waiting', result: { completed: false } };
    }
    const feet = Math.abs(points[27].x - points[28].x) / shoulderWidth;
    const handsDown = points[15].y > shoulderY + torso * 0.6
        && points[16].y > shoulderY + torso * 0.6;
    const handsUp = points[15].y < shoulderY - torso * 0.3
        && points[16].y < shoulderY - torso * 0.3;
    return advance(state, handsDown && feet < 1.35, handsUp && feet > 1.5);
}

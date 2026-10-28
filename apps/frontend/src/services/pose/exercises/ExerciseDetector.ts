export type ExerciseType = 'pushUp' | 'sitUp' | 'jumpingJack' | 'squat';

export type MovementState = 'waiting' | 'ready' | 'active';
export type Detection = { state: MovementState; result: ExerciseResult };

export function hasVisible(landmarks: Landmark[], indices: number[]) {
    return indices.every((index) => {
        const point = landmarks[index];
        return point && Number.isFinite(point.x) && Number.isFinite(point.y)
            && (point.visibility ?? 0) >= 0.35;
    });
}

// A repetition must begin in the starting pose and return to it.
export function advance(state: MovementState, atStart: boolean, atPeak: boolean): Detection {
    if (atStart) return { state: 'ready', result: { completed: state === 'active' } };
    if (state === 'ready' && atPeak) return { state: 'active', result: { completed: false } };
    return { state, result: { completed: false } };
}

export function calculateAngle3D(a: Landmark, b: Landmark, c: Landmark) {
    const u = [a.x - b.x, a.y - b.y, a.z - b.z];
    const v = [c.x - b.x, c.y - b.y, c.z - b.z];
    const length = Math.hypot(...u) * Math.hypot(...v);
    if (length < 1e-8) return NaN;
    const cosine = u.reduce((sum, value, i) => sum + value * v[i], 0) / length;
    return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}

export type Point = {
    x: number;
    y: number;
};

export type Landmark = {
    x: number;
    y: number;
    z: number;
    visibility?: number;
};
export type ExerciseResult = {
    completed: boolean;
    angle?: number;
};
// a плечо
// b локоть
// c запастье
export function calculateAngle(a:Point, b:Point,c:Point){
    const angle = Math.atan2(c.y-b.y,c.x-b.x) - Math.atan2(a.y-b.y,a.x-b.x);
    //перевод радионов
    let degrees = Math.abs(angle*180/Math.PI);

    //человеческий сустав не гнется больше чем на 180
    if (degrees > 180){
        degrees= 360-degrees;
    }

    return degrees;
}

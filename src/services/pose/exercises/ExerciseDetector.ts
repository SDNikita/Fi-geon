export type ExerciseType =| 'pushUp'| 'squat'| 'sitUp';

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
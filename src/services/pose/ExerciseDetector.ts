export type PushUpState = 'up'|'down'

type Point = {//2д точка
    x: number;
    y: number;
};

type Landmark = {
    x: number;
    y: number;
    z: number;
    visibility?: number;
};
const VISIBILITY_THRESHOLD = 0.5;
// Определяем, какая сторона тела лучше видна
export function getBestElbowSide(landmarks: Landmark[]) {
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    const leftVisibility =
        (leftShoulder.visibility ?? 0) +
        (leftElbow.visibility ?? 0) +
        (leftWrist.visibility ?? 0);

    const rightVisibility =
        (rightShoulder.visibility ?? 0) +
        (rightElbow.visibility ?? 0) +
        (rightWrist.visibility ?? 0);

    if (leftVisibility >= rightVisibility) {
        return {
            shoulder: leftShoulder,
            elbow: leftElbow,
            wrist: leftWrist,
        };
    }

    return {
        shoulder: rightShoulder,
        elbow: rightElbow,
        wrist: rightWrist,
    };
}

//проверка на позу для ожимания
export function isPushUpPosition(landmarks:Landmark[]){
    const shoulder = landmarks[11];
    const hip = landmarks[23];
    const ankle = landmarks[27];

    if (!shoulder || !hip || !ankle) {
        return false;
    }
    if ((shoulder.visibility ?? 0) < VISIBILITY_THRESHOLD ||
        (hip.visibility ?? 0) < VISIBILITY_THRESHOLD ||
        (ankle.visibility ?? 0) < VISIBILITY_THRESHOLD){
        return false;
    }

    //отколение тела относительно горизонтли
    const dx = ankle.x - shoulder.x;
    const dy = ankle.y - shoulder.y;

    const angle = Math.abs(Math.atan2(dy,dx)*180/Math.PI);

    // Приводим угол к диапазону 0-90
    const horizontalAngle = Math.min(angle,180 - angle);
    // Тело должно быть примерно горизонтальным
    return horizontalAngle < 35;
}

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
//фаза отжиманий
export function detectPushUp(angle:number, state:PushUpState){
    //если опустился
    if (state === 'up' && angle<100){
        return {
            state: 'down' as PushUpState,
            completed: false,
        };
    }
    //если поднялся
    if (state === 'down' && angle > 160) {
        return {
            state: 'up' as PushUpState,
            completed: true,
        };
    }

    return {
        state,
        completed: false,
    };

}
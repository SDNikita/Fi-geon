import {calculateAngle,type ExerciseResult,type Landmark,} from './ExerciseDetector';

export type PushUpState = 'up'|'down'


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
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder ||!rightShoulder ||!leftHip ||!rightHip) {
        return false;
    }
    const shoulderVisibility = (leftShoulder.visibility ?? 0) + (rightShoulder.visibility ?? 0);

    const hipVisibility =(leftHip.visibility ?? 0) +(rightHip.visibility ?? 0);

    if (shoulderVisibility < 0.8 ||hipVisibility < 0.8) {
        return false;
    }

    // Центр плеч
    const shoulderCenter = {x: (leftShoulder.x + rightShoulder.x) / 2,y: (leftShoulder.y + rightShoulder.y) / 2,};

    // Центр таза
    const hipCenter = {x: (leftHip.x + rightHip.x) / 2,y: (leftHip.y + rightHip.y) / 2,};

    //отколение тела относительно горизонтли
    const dx = hipCenter.x - shoulderCenter.x;
    const dy = hipCenter.y - shoulderCenter.y;

    const angle = Math.abs(Math.atan2(dy,dx)*180/Math.PI);

    // Приводим угол к диапазону 0-90
    const horizontalAngle = Math.min(angle,180 - angle);
    // Тело должно быть примерно горизонтальным
    return horizontalAngle < 40;
}


export function detectPushUp(landmarks: Landmark[],state: PushUpState): {
    state: PushUpState;
    result: ExerciseResult;
} {
    const elbowSide = getBestElbowSide(landmarks);

    const shoulder = elbowSide.shoulder;
    const elbow = elbowSide.elbow;
    const wrist = elbowSide.wrist;

    if (
        (shoulder.visibility ?? 0) < 0.5 ||
        (elbow.visibility ?? 0) < 0.5 ||
        (wrist.visibility ?? 0) < 0.5
    ) {
        return {
            state,
            result: {completed: false,},
        };
    }

    const angle = calculateAngle(shoulder,elbow,wrist);

    if (state === 'up' && angle < 100) {
        return {
            state: 'down',
            result: {
                completed: false,
                angle,
            },
        };
    }

    if (state === 'down' && angle > 160) {
        return {
            state: 'up',
            result: {
                completed: true,
                angle,
            },
        };
    }

    return {
        state,
        result: {
            completed: false,
            angle,
        },
    };
}
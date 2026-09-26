export type PushUpState = 'up'|'down'

type Point = {//2д точка
    x: number;
    y: number;
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
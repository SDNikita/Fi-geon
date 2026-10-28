import { BODY_LANDMARKS, BODY_CONNECTIONS } from './poseSkeleton';

type Landmark = {
    x: number;
    y: number;
    visibility?: number;
};

const VISIBILITY_THRESHOLD = 0.5;

function isVisible(landmark: Landmark) {
    return (landmark.visibility ?? 0) >= VISIBILITY_THRESHOLD;
}

export function drawPose(
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
) {
    //точки
    for (const index of BODY_LANDMARKS) {
        const landmark = landmarks[index];

        if (!landmark || !isVisible(landmark)) {
            continue;
        }

        const x = landmark.x * width;
        const y = landmark.y * height;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);

        ctx.fillStyle = 'red';
        ctx.fill();
    }
    //линии
    for (const connection of BODY_CONNECTIONS) {
        const start = landmarks[connection[0]];
        const end = landmarks[connection[1]];

        if (!start || !end) {
            continue;
        }

        if (!isVisible(start) || !isVisible(end)) {
            continue;
        }

        const startX = start.x * width;
        const startY = start.y * height;

        const endX = end.x * width;
        const endY = end.y * height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
import {
    FilesetResolver,
    PoseLandmarker,
} from '@mediapipe/tasks-vision';

let poseLandmarker: PoseLandmarker | null = null;

export async function createPoseDetector() {
    const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath: '/models/pose_landmarker_lite.task',
            },

            runningMode: 'VIDEO',

            numPoses: 1,
        }
    );

    return poseLandmarker;
}
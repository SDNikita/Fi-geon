import { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../services/pose/PoseDetector';
import { LandmarkSmoother } from '../services/pose/LandmarkSmoother';
import { AutoExerciseDetector } from '../services/pose/exercises/AutoExerciseDetector';


import type { ExerciseType, MovementState } from '../services/pose/exercises/ExerciseDetector';
import { drawPose } from '../services/pose/PoseRenderer';
import '../style/Camera.css';

const names = { pushUp: 'Отжимания', sitUp: 'Пресс', jumpingJack: 'Jumping jack', squat: 'Приседания' };
const phases = { waiting: 'Примите исходное положение', ready: 'Исходное положение', active: 'Вернитесь в исходное положение' };

function CameraSession() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [counts, setCounts] = useState<Record<ExerciseType, number>>({ pushUp: 0, sitUp: 0, jumpingJack: 0, squat: 0 });
    const [exercise, setExercise] = useState<ExerciseType | null>(null);
    const [phase, setPhase] = useState<MovementState>('waiting');
    const [angle, setAngle] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [hint, setHint] = useState('Загрузка камеры и распознавания…');

    useEffect(() => {
        let cancelled = false;
        let generation = 0;
        let stopSession = () => {};
        const smoother = new LandmarkSmoother();
        const worldSmoother = new LandmarkSmoother();

        function stop() {
            generation++;
            stopSession();
            stopSession = () => {};
            smoother.reset();
            worldSmoother.reset();
        }

        async function start() {
            stop();
            if (cancelled || document.visibilityState !== 'visible') return;
            const token = generation;
            let stream: MediaStream | null = null;
            let detector: Awaited<ReturnType<typeof createPoseDetector>> | null = null;
            let frame = 0;
            const recognizer = new AutoExerciseDetector();
            let lastTime = -1;
            const stale = () => cancelled || generation !== token;
            const release = () => {
                cancelAnimationFrame(frame);
                stream?.getTracks().forEach((track) => track.stop());
                detector?.close();
                detector = null;
                const video = videoRef.current;
                if (video && video.srcObject === stream) {
                    video.pause();
                    video.srcObject = null;
                }
            };
            stopSession = release;
            try {
                setError('');
                setPhase('waiting');
                setExercise(null);
                setAngle(null);
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
                if (stale()) { release(); return; }
                const video = videoRef.current;
                if (!video) { release(); return; }
                video.srcObject = stream;
                await video.play();
                if (stale()) { release(); return; }
                detector = await createPoseDetector();
                if (stale()) { release(); return; }

                function detect() {
                    if (stale()) return;
                    try {
                        const canvas = canvasRef.current;
                        if (!canvas || !video || !detector) return;
                        if (video.readyState >= 2 && video.currentTime !== lastTime) {
                            lastTime = video.currentTime;
                            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                            }
                            const ctx = canvas.getContext('2d');
                            const result = detector.detectForVideo(video, performance.now());
                            ctx?.clearRect(0, 0, canvas.width, canvas.height);
                            const raw = result.landmarks[0];
                            if (raw) {
                                const smoothed = smoother.smooth(raw);
                                const points = smoothed.map((p) => ({ ...p, x: p.x * video.videoWidth / video.videoHeight }));
                                const detection = recognizer.detect(points, result.worldLandmarks[0] ? worldSmoother.smooth(result.worldLandmarks[0]) : []);
                                setExercise(detection.exercise);
                                setHint(detection.hint);
                                setPhase(detection.state);
                                setAngle(detection.result.angle === undefined ? null : Math.round(detection.result.angle));
                                if (detection.result.completed && detection.exercise) {
                                    const completed = detection.exercise;
                                    setCounts((values) => ({ ...values, [completed]: values[completed] + 1 }));
                                }
                                if (ctx) drawPose(ctx, smoothed, canvas.width, canvas.height);
                            } else {
                                const detection = recognizer.detect([]);
                                setExercise(detection.exercise);
                                setPhase(detection.state);
                                setHint(detection.hint);
                                smoother.reset();
                                worldSmoother.reset();
                                setAngle(null);
                            }
                        }
                        frame = requestAnimationFrame(detect);
                    } catch (cause) {
                        release();
                        if (!stale()) setError(cause instanceof Error ? cause.message : 'Ошибка распознавания');
                    }
                }
                detect();
            } catch (cause) {
                release();
                if (!stale()) setError(cause instanceof Error ? cause.message : 'Не удалось запустить камеру');
            }
        }
        function visibilityChanged() {
            if (document.visibilityState === 'visible') void start();
            else stop();
        }
        document.addEventListener('visibilitychange', visibilityChanged);
        void start();
        return () => {
            cancelled = true;
            document.removeEventListener('visibilitychange', visibilityChanged);
            stop();
        };
    }, []);

    return <>
        {error && <p className="camera-error" role="alert">{error}</p>}
        <div className="camera-container">
            <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
            <canvas ref={canvasRef} className="camera-canvas" />
        </div>
        <div className="pose-debug">
            <div>{exercise ? `Распознано: ${names[exercise]}` : 'Ожидание движения — начните упражнение'}</div>
            {(Object.keys(names) as ExerciseType[]).map((type) => <div key={type}>{names[type]}: {counts[type]}</div>)}
            {angle !== null && <div>Угол: {angle}°</div>}
            <div>{phases[phase]}</div>
            <p role="status">{hint}</p>
        </div>
    </>;
}

export default function Camera() {
    const [session, setSession] = useState(0);
    return <div>
        <div className="exercise-controls">
            <button onClick={() => setSession((value) => value + 1)}>Начать заново</button>
        </div>
        <p className="exercise-hint">Упражнение определяется автоматически. Всё тело должно быть в кадре.
            Для приседаний лучше расположить камеру сбоку или под небольшим углом. Для пресса расположите камеру сбоку, для jumping jack — спереди.
            Отжимания распознаются сбоку и спереди. Начните с исходного положения и выполните полный цикл движения.</p>
        <CameraSession key={session} />
    </div>;
}

import { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../services/pose/PoseDetector';
import '../style/Camera.css';
import { LandmarkSmoother } from '../services/pose/LandmarkSmoother';
import {calculateAngle,detectPushUp,} from '../services/pose/ExerciseDetector';

import type { PushUpState } from '../services/pose/ExerciseDetector';
import { drawPose } from '../services/pose/PoseRenderer';

function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const pushUpStateRef = useRef<PushUpState>('up');
    const pushUpsRef = useRef(0);

    const [pushUps, setPushUps] = useState(0);
    const [elbowAngle, setElbowAngle] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const smoother = new LandmarkSmoother();

        // Остановка камеры и обработки
        function stopCamera() {
            console.log('Останавливаем камеру');

            // Останавливаем requestAnimationFrame
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }

            // Останавливаем камеру
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            // Отсоединяем камеру от video
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }

            // Сбрасываем сглаживание
            smoother.reset();
        }

        async function startCamera() {
            try {
                if (document.visibilityState !== 'visible') {
                    return;
                }

                console.log('Запускаем камеру');

                // Получаем доступ к камере
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                // Пока камера запускалась, вкладка могла стать неактивной
                if (cancelled || document.visibilityState !== 'visible') {
                    mediaStream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = mediaStream;

                const video = videoRef.current;

                if (!video) {
                    stopCamera();
                    return;
                }

                // Подключаем камеру к video
                video.srcObject = mediaStream;

                // Запускаем видео
                video.play().catch((error) => {
                    if (error.name !== 'AbortError') {
                        console.error('Ошибка запуска видео:', error);
                    }
                });

                // Создаём MediaPipe
                const poseLandmarker = await createPoseDetector();

                console.log('MediaPipe готов');

                if (cancelled || document.visibilityState !== 'visible') {
                    stopCamera();
                    return;
                }

                // Обрабатываем кадры
                function detectPose() {
                    if (
                        cancelled ||
                        !videoRef.current ||
                        !canvasRef.current ||
                        document.visibilityState !== 'visible'
                    ) {
                        stopCamera();
                        return;
                    }

                    const video = videoRef.current;
                    const canvas = canvasRef.current;

                    // Ждём, пока видео получит размеры
                    if (video.videoWidth === 0 || video.videoHeight === 0) {
                        animationIdRef.current = requestAnimationFrame(detectPose);
                        return;
                    }

                    // Устанавливаем размер canvas только если он изменился
                    if (
                        canvas.width !== video.videoWidth ||
                        canvas.height !== video.videoHeight
                    ) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                    }

                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        return;
                    }

                    // Получаем landmarks
                    const result = poseLandmarker.detectForVideo(
                        video,
                        performance.now()
                    );

                    // Очищаем canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Если найден человек
                    if (result.landmarks.length > 0) {
                        const landmarks = smoother.smooth(
                            result.landmarks[0]
                        );

                        // Получаем точки для локтя
                        const shoulder = landmarks[11];
                        const elbow = landmarks[13];
                        const wrist = landmarks[15];

                        // Рассчитываем угол локтя
                        const angle = calculateAngle(
                            shoulder,
                            elbow,
                            wrist
                        );

                        setElbowAngle(Math.round(angle));

                        // Проверяем состояние отжимания
                        const pushUpResult = detectPushUp(
                            angle,
                            pushUpStateRef.current
                        );

                        pushUpStateRef.current = pushUpResult.state;

                        // Если отжимание завершено
                        if (pushUpResult.completed) {
                            pushUpsRef.current += 1;
                            setPushUps(pushUpsRef.current);
                        }

                        // Рисуем скелет
                        drawPose(
                            ctx,
                            landmarks,
                            canvas.width,
                            canvas.height
                        );
                    }

                    // Следующий кадр
                    animationIdRef.current =
                        requestAnimationFrame(detectPose);
                }

                detectPose();
            } catch (error) {
                console.error('Ошибка:', error);

                if (error instanceof DOMException) {
                    setError(
                        `Ошибка: ${error.name} — ${error.message}`
                    );
                } else {
                    setError('Не удалось запустить MediaPipe');
                }
            }
        }

        // Отслеживаем состояние вкладки
        function handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                stopCamera();
            } else {
                startCamera();
            }
        }

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        );

        // Первый запуск
        startCamera();

        // Очистка при удалении компонента
        return () => {
            cancelled = true;

            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );

            stopCamera();
        };
    }, []);

    if (error) {
        return (
            <p className="camera-error">
                {error}
            </p>
        );
    }

    return (
        <div className="camera-container">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
            />

            <canvas
                ref={canvasRef}
                className="camera-canvas"
            />

            <div className="pose-debug">
                <div>Отжимания: {pushUps}</div>
                <div>Угол локтя: {elbowAngle}°</div>
                <div>Состояние: {pushUpStateRef.current}</div>
            </div>
        </div>
    );
}

export default Camera;
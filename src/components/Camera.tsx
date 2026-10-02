import { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../services/pose/PoseDetector';
import '../style/Camera.css';
import { LandmarkSmoother } from '../services/pose/LandmarkSmoother';
import { detectPushUp } from '../services/pose/exercises/PushUpDetector';
import type { PushUpState } from '../services/pose/exercises/PushUpDetector';
import { drawPose } from '../services/pose/PoseRenderer';

function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const animationIdRef = useRef<number | null>(null);

    // Состояние и количество отжиманий
    const pushUpStateRef = useRef<PushUpState>('up');
    const pushUpsRef = useRef(0);

    const [pushUps, setPushUps] = useState(0);
    const [elbowAngle, setElbowAngle] = useState(0);
    const [error, setError] = useState('');

    // Хук запускается при создании компонента
    useEffect(() => {
        let cancelled = false;

        // Создаём сглаживатель координат
        const smoother = new LandmarkSmoother();

        // Остановка камеры и обработки кадров
        function stopCamera() {
            console.log('Останавливаем камеру');

            // Останавливаем requestAnimationFrame
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }

            // Останавливаем все потоки камеры
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });

                streamRef.current = null;
            }

            // Отсоединяем камеру от video
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }

            // Сбрасываем состояние сглаживания
            smoother.reset();
        }

        // Запуск камеры
        async function startCamera() {
            try {
                // Не запускаем камеру, если вкладка скрыта
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
                if (
                    cancelled ||
                    document.visibilityState !== 'visible'
                ) {
                    mediaStream.getTracks().forEach((track) => {
                        track.stop();
                    });

                    return;
                }

                streamRef.current = mediaStream;

                const video = videoRef.current;

                // Проверяем, существует ли video
                if (!video) {
                    stopCamera();
                    return;
                }

                // Подключаем камеру к video
                video.srcObject = mediaStream;

                // Запускаем видео
                video.play().catch((error) => {
                    // AbortError может возникнуть при остановке камеры
                    if (error.name !== 'AbortError') {
                        console.error(
                            'Ошибка запуска видео:',
                            error
                        );
                    }
                });

                // Создаём MediaPipe
                const poseLandmarker = await createPoseDetector();

                console.log('MediaPipe готов');

                // Проверяем, что компонент всё ещё активен
                if (
                    cancelled ||
                    document.visibilityState !== 'visible'
                ) {
                    stopCamera();
                    return;
                }

                // Обработка кадров камеры
                function detectPose() {
                    // Если компонент удалён или вкладка скрыта,
                    // останавливаем обработку
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

                    // Ждём, пока видео получит реальные размеры
                    if (
                        video.videoWidth === 0 ||
                        video.videoHeight === 0
                    ) {
                        animationIdRef.current =
                            requestAnimationFrame(detectPose);

                        return;
                    }

                    // Размер canvas должен совпадать
                    // с исходным размером видео
                    if (canvas.width !== video.videoWidth ||canvas.height !== video.videoHeight) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                    }

                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        return;
                    }

                    // Получаем landmarks через MediaPipe
                    const result = poseLandmarker.detectForVideo(video,performance.now());

                    // Очищаем предыдущий кадр
                    ctx.clearRect(0, 0,canvas.width,canvas.height);

                    // Если MediaPipe нашёл человека
                    if (result.landmarks.length > 0) {
                        // Исходные координаты MediaPipe
                        const rawLandmarks = result.landmarks[0];

                        // Сглаженные координаты используются
                        // для отображения скелета
                        const landmarks =smoother.smooth(rawLandmarks);

                        // Передаём landmarks детектору отжиманий.
                        // Вся логика отжиманий находится
                        // внутри PushUpDetector.ts
                        const pushUpResult = detectPushUp(rawLandmarks,pushUpStateRef.current);

                        // Сохраняем новое состояние отжимания
                        pushUpStateRef.current = pushUpResult.state;

                        // Если детектор получил угол локтя,
                        // показываем его на экране
                        if (pushUpResult.result.angle !== undefined) {
                            setElbowAngle(Math.round(pushUpResult.result.angle));
                        }

                        // Если отжимание завершено,
                        // увеличиваем счётчик
                        if (pushUpResult.result.completed) {
                            pushUpsRef.current += 1;
                            setPushUps(pushUpsRef.current);
                        }

                        // Рисуем сглаженный скелет
                        drawPose(ctx,landmarks,canvas.width,canvas.height);
                    }

                    // Запускаем обработку следующего кадра
                    animationIdRef.current =requestAnimationFrame(detectPose);
                }

                // Запускаем обработку камеры
                detectPose();
            } catch (error) {
                console.error('Ошибка:', error);

                if (error instanceof DOMException) {
                    setError(
                        `Ошибка: ${error.name} — ${error.message}`
                    );
                } else {
                    setError(
                        'Не удалось запустить MediaPipe'
                    );
                }
            }
        }

        // Отслеживаем состояние вкладки
        function handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                // Вкладка скрыта — останавливаем камеру
                stopCamera();
            } else {
                // Вкладка снова открыта — запускаем камеру
                startCamera();
            }
        }

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        );

        // Первый запуск камеры
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

    // Показываем ошибку, если камера или MediaPipe
    // не смогли запуститься
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

            {/* Отладочная информация */}
            <div className="pose-debug">
                <div>Отжимания: {pushUps}</div>
                <div>Угол локтя: {elbowAngle}°</div>
                <div>
                    Состояние: {pushUpStateRef.current}
                </div>
            </div>
        </div>
    );
}

export default Camera;
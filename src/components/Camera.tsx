import { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../services/pose/PoseDetector';
import '../style/Camera.css';
import { BODY_LANDMARKS, BODY_CONNECTIONS } from '../services/pose/poseSkeleton';

function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const [error, setError] = useState('');

    //хук
    useEffect(() => {
        let cancelled = false;

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

                    // Размер canvas = размер видео
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        return;
                    }

                    // Получаем landmarks
                    const result = poseLandmarker.detectForVideo(video, performance.now());

                    // Очищаем canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Если найден человек
                    if (result.landmarks.length > 0) {
                        const landmarks = result.landmarks[0];

                        // Рисуем точки
                        for (const index of BODY_LANDMARKS) {
                            const landmark = landmarks[index];

                            const x = landmark.x * canvas.width;
                            const y = landmark.y * canvas.height;

                            ctx.beginPath();
                            ctx.arc(x, y, 6, 0, Math.PI * 2);

                            ctx.fillStyle = 'red';
                            ctx.fill();
                        }

                        // Рисуем линии
                        for (const connection of BODY_CONNECTIONS) {
                            const start = landmarks[connection[0]];
                            const end = landmarks[connection[1]];

                            const startX = start.x * canvas.width;
                            const startY = start.y * canvas.height;

                            const endX = end.x * canvas.width;
                            const endY = end.y * canvas.height;

                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);

                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 3;
                            ctx.stroke();
                        }
                    }

                    // Следующий кадр
                    animationIdRef.current = requestAnimationFrame(detectPose);
                }

                detectPose();

            } catch (error) {
                console.error('Ошибка:', error);

                if (error instanceof DOMException) {
                    setError(`Ошибка: ${error.name} — ${error.message}`);
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

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Первый запуск
        startCamera();

        // Очистка при удалении компонента
        return () => {
            cancelled = true;

            document.removeEventListener('visibilitychange', handleVisibilityChange);

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
        </div>
    );
}

export default Camera;
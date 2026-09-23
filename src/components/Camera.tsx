import { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../services/pose/PoseDetector';
import '../style/Camera.css';
import {BODY_LANDMARKS,BODY_CONNECTIONS,} from '../services/pose/poseSkeleton';
function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [error, setError] = useState('');

    useEffect(() => {
        let mediaStream: MediaStream | null = null;
        let animationId: number;
        let cancelled = false;

        async function startCamera() {
            try {
                // Получаем доступ к камере
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (cancelled) {
                    mediaStream.getTracks().forEach((track) => {
                        track.stop();
                    });

                    return;
                }

                const video = videoRef.current;

                if (!video) {
                    return;
                }

                // Подключаем камеру к video
                video.srcObject = mediaStream;

                // Запускаем видео
                video.play().catch((error) => {
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

                // Обрабатываем кадры
                function detectPose() {
                    if (cancelled || !videoRef.current ||!canvasRef.current) {
                        return;
                    }

                    const video = videoRef.current;
                    const canvas = canvasRef.current;

                    // Ждём, пока видео получит размеры
                    if (video.videoWidth === 0 ||video.videoHeight === 0) {
                        animationId = requestAnimationFrame(detectPose);
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
                    const result = poseLandmarker.detectForVideo(video,performance.now());

                    // Очищаем canvas
                    ctx.clearRect(0,0,canvas.width,canvas.height);

                    // Если найден человек
                    if (result.landmarks.length > 0) {
                        const landmarks = result.landmarks[0];

                        // Рисуем все 33 точки
                        for (const index of BODY_LANDMARKS) {
                            const landmark = landmarks[index];
                            const x =landmark.x * canvas.width;

                            const y =landmark.y * canvas.height;

                            ctx.beginPath();

                            ctx.arc(x,y,6,0,Math.PI * 2);

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
                    animationId =requestAnimationFrame(detectPose);
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

        startCamera();

        // Очистка
        return () => {
            cancelled = true;

            cancelAnimationFrame(animationId);

            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
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
                className="camera-video"/>

            <canvas ref={canvasRef} className="camera-canvas"/>
        </div>
    );
}

export default Camera;
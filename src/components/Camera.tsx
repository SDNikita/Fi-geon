import { useEffect, useRef, useState } from 'react';

function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [error, setError] = useState('');

    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error(error);
                setError('Не удалось получить доступ к камере');
            }
        }

        startCamera();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <video ref={videoRef} autoPlay playsInline/>
    );
}

export default Camera;
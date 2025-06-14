
import { useState, useEffect, useRef } from 'react';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let streamInstance: MediaStream | null = null;
    const enableStream = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Your browser does not support camera access.");
          return;
        }
        streamInstance = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = streamInstance;
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setError("Camera permission denied. Please allow camera access in browser settings.");
          } else {
            setError("Could not access camera. Ensure it's connected and not in use.");
          }
        } else {
          setError("An unknown error occurred while accessing the camera.");
        }
      }
    };

    enableStream();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, error };
};

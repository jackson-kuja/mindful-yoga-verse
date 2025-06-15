
import { useEffect, RefObject } from "react";

export function useWebcamStream(ws: WebSocket | null, videoRef: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    let processor: MediaStreamTrackProcessor<VideoFrame> | undefined;
    let reader: ReadableStreamDefaultReader<VideoFrame> | undefined;
    let stream: MediaStream | undefined;
    let keepStreaming = true;

    const startStreaming = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 180, frameRate: 5 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const [track] = stream.getVideoTracks();
        processor = new MediaStreamTrackProcessor({ track });
        reader = processor.readable.getReader();

        while (keepStreaming) {
          const { value, done } = await reader.read();
          if (done) break;
          
          if (ws.readyState === WebSocket.OPEN) {
            // The user's guide uses an unofficial method 'clone().encode()'.
            // A more standard way is to draw to canvas and get a blob.
            const canvas = document.createElement('canvas');
            canvas.width = value.displayWidth;
            canvas.height = value.displayHeight;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.drawImage(value, 0, 0);
                const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                if (blob) {
                    const buf = await blob.arrayBuffer();
                    ws.send(buf);
                }
            }
          }
          value.close();
        }
      } catch (err) {
        console.error("Webcam streaming error:", err);
      }
    };
    
    startStreaming();

    return () => {
      keepStreaming = false;
      reader?.cancel();
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [ws, videoRef]);
}

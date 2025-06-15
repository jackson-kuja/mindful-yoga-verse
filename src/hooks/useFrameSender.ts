
import { useEffect } from "react";

export function useFrameSender(ws: WebSocket | null, stream: MediaStream | null) {
  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !stream || stream.getVideoTracks().length === 0) {
        return;
    }

    let processor: MediaStreamTrackProcessor<VideoFrame> | undefined;
    let reader: ReadableStreamDefaultReader<VideoFrame> | undefined;
    let keepSending = true;

    const startSending = async () => {
      try {
        const [track] = stream.getVideoTracks();
        // The framerate is already limited by the stream from useWebcam, 
        // but MediaStreamTrackProcessor is more efficient than setInterval.
        processor = new MediaStreamTrackProcessor({ track });
        reader = processor.readable.getReader();

        while (keepSending) {
          if (ws.readyState !== WebSocket.OPEN) {
            break;
          }
          const { value, done } = await reader.read();
          if (done) break;
          
          if (value) {
            const canvas = document.createElement('canvas');
            // Using a standard small resolution for performance
            canvas.width = 320;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.drawImage(value, 0, 0, canvas.width, canvas.height);
                const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                if (blob && ws.readyState === WebSocket.OPEN) {
                    const buf = await blob.arrayBuffer();
                    ws.send(buf);
                }
            }
            value.close();
          }
        }
      } catch (err) {
        // AbortError is expected on cleanup, so we can ignore it.
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
           console.error("Frame sending error:", err);
        }
      }
    };
    
    startSending();

    return () => {
      keepSending = false;
      reader?.cancel().catch(() => {});
    };
  }, [ws, stream]);
}

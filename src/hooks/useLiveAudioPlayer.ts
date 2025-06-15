
import { useEffect } from "react";

export function useLiveAudioPlayer(ws: WebSocket | null) {
  useEffect(() => {
    if (!ws) return;

    const ctx = new AudioContext({ sampleRate: 24000 });
    const queue: Float32Array[] = [];
    let isPlaying = false;

    ws.onmessage = async (e) => {
      if (!(e.data instanceof ArrayBuffer)) return;
      
      const pcm = new Int16Array(e.data);
      const f32 = new Float32Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) {
        f32[i] = pcm[i] / 32768;
      }

      queue.push(f32);
      if (!isPlaying) {
        pump();
      }
    };

    async function pump() {
      if (queue.length === 0) {
        isPlaying = false;
        return;
      }
      isPlaying = true;

      const chunk = queue[0];
      const buf = ctx.createBuffer(1, chunk.length, 24000);
      buf.getChannelData(0).set(chunk);
      
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();

      src.onended = () => {
        queue.shift();
        pump();
      };
    }

    return () => {
        ctx.close();
    }
  }, [ws]);
}

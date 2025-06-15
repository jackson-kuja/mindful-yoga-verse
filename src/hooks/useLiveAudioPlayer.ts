
import { useEffect } from "react";

export function useLiveAudioPlayer(ws: WebSocket | null) {
  useEffect(() => {
    if (!ws) return;
    console.log("useLiveAudioPlayer: Hook activated with WebSocket.");

    const ctx = new AudioContext({ sampleRate: 24000 });
    const queue: Float32Array[] = [];
    let isPlaying = false;
    console.log("useLiveAudioPlayer: AudioContext created.");

    const resumeContext = () => {
      if (ctx.state === "suspended") {
        ctx.resume().catch((e) =>
          console.error("useLiveAudioPlayer: AudioContext resume error:", e)
        );
      }
      document.removeEventListener("click", resumeContext);
    };

    if (ctx.state === "suspended") {
      document.addEventListener("click", resumeContext);
    }


    ws.onmessage = async (e) => {
      console.log("useLiveAudioPlayer: Received WebSocket message.", e);
      if (!(e.data instanceof ArrayBuffer)) {
        console.log("useLiveAudioPlayer: Message data is not an ArrayBuffer, skipping.", typeof e.data);
        return;
      }
      
      console.log(`useLiveAudioPlayer: Received ArrayBuffer of size ${e.data.byteLength}`);
      const pcm = new Int16Array(e.data);
      const f32 = new Float32Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) {
        f32[i] = pcm[i] / 32768;
      }

      queue.push(f32);
      if (!isPlaying) {
        console.log("useLiveAudioPlayer: Starting audio pump.");
        pump();
      } else {
        console.log("useLiveAudioPlayer: Queueing audio chunk.");
      }
    };

    async function pump() {
      if (queue.length === 0) {
        isPlaying = false;
        console.log("useLiveAudioPlayer: Queue empty, stopping pump.");
        return;
      }
      isPlaying = true;

      const chunk = queue[0];
      console.log(`useLiveAudioPlayer: Playing chunk of size ${chunk.length}`);
      const buf = ctx.createBuffer(1, chunk.length, 24000);
      buf.getChannelData(0).set(chunk);
      
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      console.log("useLiveAudioPlayer: Audio source started.");


      src.onended = () => {
        console.log("useLiveAudioPlayer: Chunk finished playing.");
        queue.shift();
        pump();
      };
    }

    return () => {
        console.log("useLiveAudioPlayer: Cleaning up.");
        ctx.close();
    }
  }, [ws]);
}

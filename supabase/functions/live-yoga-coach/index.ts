
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, types as T } from "https://esm.sh/@google/generative-ai@0.15.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

class LiveYogaSession {
  private client: Client;
  private session!: T.LiveSession;
  private poseIdx = 0;
  private started = Date.now();
  private timerId: number | undefined;

  constructor(private sendPCM: (buf: ArrayBuffer) => void) {
    const apiKey = Deno.env.get("GEMINI_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_KEY is not set in environment variables");
    }
    this.client = new Client({ apiKey });
    this.startSession();
  }

  async pushFrame(jpeg: Uint8Array) {
    if (Date.now() - this.started > 110 * 1000) {
      await this.restart();
    }
    if (this.session) {
      try {
        await this.session.send_realtime_input({
          video: T.Blob.fromBinary(jpeg, "image/jpeg"),
        });
      } catch (e) {
         console.error("Error sending frame:", e)
      }
    }
  }
  
  public close() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.session?.close();
  }

  private async startSession() {
    console.log("Starting new Gemini Live session...");
    try {
      this.session = await this.client.aio.live.connect({
        model: "gemini-1.5-flash-preview-0514", // Using a stable model, preview one may not be available
        config: {
          response_modalities: ["AUDIO"],
          media_resolution: T.MediaResolution.MEDIA_RESOLUTION_LOW,
          speech_config: {
            voice_config: { prebuilt_voice_config: { voice_name: "Kore" } },
          },
        },
        setup_message: {
          system_instruction: {
            parts: [{ text: Deno.env.get("SYSTEM_PROMPT") || "You are a helpful yoga instructor." }],
          },
        },
      });

      console.log("Session started. Waiting for responses...");

      (async () => {
        try {
            for await (const resp of this.session.receive()) {
              if (resp.data) {
                this.sendPCM(resp.data);
              }
            }
        } catch(e) {
            console.error("Error receiving data:", e);
        }
      })();

      this.sendPoseTurn();
    } catch (e) {
      console.error("Failed to start Gemini session:", e);
    }
  }

  private async sendPoseTurn() {
    const poseSequence = Deno.env.get("POSE_SEQUENCE")?.split(",") || ["Mountain Pose"];
    const pose = poseSequence[this.poseIdx];
    
    console.log(`Sending instruction for pose: ${pose}`);

    if (this.session) {
      try {
          await this.session.send_client_content({
            turns: {
              role: "user",
              parts: [{ text: `For the next minute the user should be in ${pose}. Watch and coach.` }],
            },
            turn_complete: true,
          });
      } catch(e) {
          console.error("Error sending pose turn:", e)
      }
    }

    this.poseIdx = (this.poseIdx + 1) % poseSequence.length;
    this.timerId = setTimeout(() => this.sendPoseTurn(), 60 * 1000);
  }

  private async restart() {
    console.log("Restarting session...");
    await this.session.close();
    if(this.timerId) clearTimeout(this.timerId);
    this.started = Date.now();
    await this.startSession();
  }
}

serve(async (req) => {
  if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return new Response("request isn't a websocket upgrade", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let liveSession: LiveYogaSession | null = null;
  
  socket.onopen = () => {
    console.log("Client connected");
    try {
      liveSession = new LiveYogaSession((pcm) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(pcm);
        }
      });
    } catch (e) {
      console.error("Failed to start session:", e.message);
      socket.close(1011, e.message);
    }
  };
  
  socket.onmessage = (event) => {
    if (liveSession && event.data instanceof ArrayBuffer) {
      liveSession.pushFrame(new Uint8Array(event.data));
    }
  };
  
  socket.onclose = () => {
    console.log("Client disconnected");
    liveSession?.close();
  };
  
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    liveSession?.close();
  };

  return response;
});

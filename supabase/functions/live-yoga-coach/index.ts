
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  try {
    if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("request isn't a websocket upgrade", { status: 400 });
    }

    console.log("WebSocket upgrade request received.");
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("WebSocket connection opened successfully.");
      socket.send("Connection established!");
    };
    
    socket.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        console.log(`Received a frame of size: ${event.data.byteLength}`);
        // Acknowledge frame receipt
        socket.send("Frame received");
      } else {
        console.log("Received message:", event.data);
      }
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return response;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("Fatal error in serve handler:", errorMessage);
    if (e instanceof Error && e.stack) {
        console.error("Stack trace:", e.stack);
    }
    return new Response(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
});

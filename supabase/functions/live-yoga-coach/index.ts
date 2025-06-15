
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== Edge Function Called ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log("Handling CORS preflight request");
      return new Response('ok', { headers: corsHeaders });
    }

    // Check for WebSocket upgrade header
    const upgrade = req.headers.get("upgrade");
    console.log("Upgrade header:", upgrade);
    
    if (upgrade?.toLowerCase() !== "websocket") {
      console.log("Not a WebSocket upgrade request");
      return new Response("Expected WebSocket upgrade", { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log("Attempting WebSocket upgrade...");
    const { socket, response } = Deno.upgradeWebSocket(req);
    console.log("WebSocket upgrade successful");
    
    socket.onopen = () => {
      console.log("WebSocket connection opened");
      try {
        socket.send(JSON.stringify({
          type: "connection",
          message: "AI Coach connected successfully!"
        }));
      } catch (err) {
        console.error("Error sending welcome message:", err);
      }
    };
    
    socket.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
      try {
        if (event.data instanceof ArrayBuffer) {
          console.log(`Received video frame of size: ${event.data.byteLength} bytes`);
          // Echo back acknowledgment
          socket.send(JSON.stringify({
            type: "frame_ack",
            message: "Frame received and processed"
          }));
        } else {
          console.log("Received text message:", event.data);
          // Echo back the message
          socket.send(JSON.stringify({
            type: "echo",
            message: `Echo: ${event.data}`
          }));
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    console.log("Returning WebSocket response");
    return response;
    
  } catch (error) {
    console.error("=== FATAL ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        type: error.constructor.name
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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
    const { socket: browserSocket, response } = Deno.upgradeWebSocket(req);
    console.log("WebSocket upgrade successful");

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash-live-preview-04-09";

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY env var not set");
    }

    const geminiUrl = `wss://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=proto&key=${GEMINI_API_KEY}`;
    console.log("Connecting to Gemini at", geminiUrl);
    const gemini = new WebSocket(geminiUrl);

    gemini.binaryType = "arraybuffer";
    browserSocket.binaryType = "arraybuffer";

    gemini.onopen = () => {
      console.log("Connected to Gemini. Sending setup message.");
      const setup = {
        model: GEMINI_MODEL,
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { audioEncoding: "LINEAR16" }
        }
      };
      gemini.send(JSON.stringify(setup));
      browserSocket.send(JSON.stringify({ type: "connection", message: "AI Coach connected" }));
    };

    gemini.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        console.log(`Forwarding audio frame ${e.data.byteLength} bytes`);
        browserSocket.send(e.data);
      } else {
        browserSocket.send(e.data);
      }
    };

    gemini.onerror = (err) => {
      console.error("Gemini socket error", err);
      browserSocket.close(1011, "Gemini error");
    };

    gemini.onclose = (ev) => {
      console.log("Gemini socket closed", ev.code, ev.reason);
      browserSocket.close(ev.code, ev.reason);
    };

    browserSocket.onmessage = (event) => {
      if (gemini.readyState === WebSocket.OPEN) {
        gemini.send(event.data);
      }
    };

    browserSocket.onerror = (err) => {
      console.error("Browser socket error", err);
      gemini.close(1011, "Browser error");
    };

    browserSocket.onclose = (ev) => {
      console.log("Browser socket closed", ev.code, ev.reason);
      gemini.close(ev.code, ev.reason);
    };

    const keepAlive = setInterval(() => {
      if (browserSocket.readyState === WebSocket.OPEN) {
        browserSocket.send(JSON.stringify({ type: "ping" }));
      }
      if (gemini.readyState === WebSocket.OPEN) {
        gemini.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    browserSocket.onclose = () => {
      clearInterval(keepAlive);
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

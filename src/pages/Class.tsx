
import { useEffect, useRef, useState } from 'react';
import { useWebcamStream } from '@/hooks/useWebcamStream';
import { useLiveAudioPlayer } from '@/hooks/useLiveAudioPlayer';
import { Card } from '@/components/ui/card';

// The URL for the Supabase Edge Function WebSocket
const WS_URL = "wss://rcqmlylbhdgouyfzfdtz.functions.supabase.co/live-yoga-coach";

const ClassPage = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState('Connecting...');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    
    socket.onopen = () => {
      setStatus('Connected. Starting session...');
      setWs(socket);
    };

    socket.onclose = () => {
      setStatus('Connection lost. Please refresh.');
      setWs(null);
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setStatus('Connection error.');
      setWs(null);
    };

    return () => {
      socket.close();
    };
  }, []);

  useWebcamStream(ws, videoRef);
  useLiveAudioPlayer(ws);

  return (
    <main className="container py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <h1 className="text-4xl font-bold mb-4">Live Yoga Coach</h1>
        <p className="text-muted-foreground mb-8">{status}</p>

        <Card className="w-full max-w-2xl aspect-video overflow-hidden shadow-2xl">
            <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
            aria-label="Your webcam feed"
            />
        </Card>
    </main>
  );
};

export default ClassPage;

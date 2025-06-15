import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSessionById } from '@/data/sessions';
import InstructionPane from '@/components/practice/InstructionPane';
import WebcamPane from '@/components/practice/WebcamPane';
import NotFound from './NotFound';
import { useWebcam } from '@/hooks/useWebcam';
import { useLiveAudioPlayer } from '@/hooks/useLiveAudioPlayer';
import { useFrameSender } from '@/hooks/useFrameSender';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const WS_URL = `wss://rcqmlylbhdgouyfzfdtz.functions.supabase.co/live-yoga-coach`;

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAiMode = queryParams.get('mode') === 'ai';

  const session = id ? getSessionById(id) : undefined;
  const { videoRef, error, stream } = useWebcam();
  
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [aiStatus, setAiStatus] = useState('Disconnected');

  useEffect(() => {
    if (!isAiMode) return;

    console.log("AI mode enabled. Attempting to connect WebSocket...");
    setAiStatus('Connecting...');
    const socket = new WebSocket(WS_URL);
    
    socket.onopen = () => {
      console.log("WebSocket connection established successfully.");
      setAiStatus('Connected');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed message:", data);
      } catch (err) {
        console.log("Non-JSON message received:", event.data);
      }
    };

    socket.onclose = (event) => {
      console.error(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
      setAiStatus('Disconnected');
      setWs(null);
    };

    socket.onerror = (err) => {
      console.error('A WebSocket error occurred:', err);
      setAiStatus('Error');
      setWs(null);
    };

    return () => {
      console.log("Closing WebSocket connection due to component unmount or re-render.");
      socket.close();
    };
  }, [isAiMode]);

  useFrameSender(ws, stream);
  useLiveAudioPlayer(ws);

  useEffect(() => {
    if (session) {
      document.title = `Practice • ${session.name}`;
    }
    // Cleanup function to reset title
    return () => {
      document.title = 'Yoga AI';
    };
  }, [session]);

  const handleFinishSession = () => {
    ws?.close();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (session) {
      navigate(`/sessions/${session.id}`);
    }
  };

  if (!session) {
    return <NotFound />;
  }

  const hasProgram = session.program && session.program.length > 0;

  const getStatusIndicator = () => {
    switch (aiStatus) {
      case 'Connected':
        return <Badge variant="secondary" className="bg-green-600 text-white"><Wifi className="mr-2 h-4 w-4" />AI Coach Connected</Badge>;
      case 'Connecting...':
        return <Badge variant="secondary">Connecting to AI Coach...</Badge>;
      case 'Error':
        return <Badge variant="destructive"><WifiOff className="mr-2 h-4 w-4" />AI Coach Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <main className="h-screen w-screen bg-black relative">
      <div className="absolute inset-0">
        <WebcamPane videoRef={videoRef} error={error} />
      </div>

      {isAiMode && (
        <div className="absolute top-4 left-4 z-10">
          {getStatusIndicator()}
        </div>
      )}
      
      <div className="absolute inset-0">
        {hasProgram ? (
          <InstructionPane session={session} onFinish={handleFinishSession} />
        ) : (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <Button onClick={handleFinishSession} size="lg">Finish Session</Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PracticePage;

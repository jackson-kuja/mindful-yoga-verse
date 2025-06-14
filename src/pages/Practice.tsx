
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '@/data/sessions';
import InstructionPane from '@/components/practice/InstructionPane';
import WebcamPane from '@/components/practice/WebcamPane';
import NotFound from './NotFound';
import { useWebcam } from '@/hooks/useWebcam';
import { Button } from '@/components/ui/button';

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = id ? getSessionById(id) : undefined;
  const { videoRef, error } = useWebcam();

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

  return (
    <main className="h-screen w-screen bg-black relative">
      <div className="absolute inset-0">
        <WebcamPane videoRef={videoRef} error={error} />
      </div>
      
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

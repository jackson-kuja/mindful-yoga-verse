
import { useNavigate } from 'react-router-dom';
import { useWebcam } from '@/hooks/useWebcam';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { CameraOff } from 'lucide-react';
import type { Session } from '@/data/sessions';

interface WebcamPaneProps {
  session: Session;
}

const WebcamPane = ({ session }: WebcamPaneProps) => {
  const navigate = useNavigate();
  const { videoRef, error } = useWebcam();
  const { setProgress } = useProgress();

  const handleFinishSession = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setProgress(session.id, 100);
    navigate(`/sessions/${session.id}`);
  };

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4 gap-6">
      <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
        {error ? (
          <div className="text-center text-destructive p-4">
            <CameraOff className="mx-auto h-12 w-12" />
            <p className="mt-2 font-semibold">Camera Error</p>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
            aria-label="User camera feed"
          />
        )}
      </div>
      <Button 
        onClick={handleFinishSession}
        aria-label="Finish session and mark as complete"
        size="lg"
      >
        Finish Session
      </Button>
    </div>
  );
};

export default WebcamPane;

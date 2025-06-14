
import { RefObject } from 'react';
import { CameraOff } from 'lucide-react';

interface WebcamPaneProps {
  videoRef: RefObject<HTMLVideoElement>;
  error: string | null;
}

const WebcamPane = ({ videoRef, error }: WebcamPaneProps) => {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
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
  );
};

export default WebcamPane;

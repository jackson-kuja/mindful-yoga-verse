import { useState, useEffect, useMemo } from 'react';
import type { Session } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Play, Pause, SkipForward, RotateCcw, X } from 'lucide-react';

interface PracticePlayerProps {
  session: Session;
  onFinish?: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const PracticePlayer = ({ session, onFinish }: PracticePlayerProps) => {
    const program = session.program || [];
    const totalDuration = useMemo(() => program.reduce((sum, pose) => sum + pose.duration, 0), [program]);

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying || elapsedTime >= totalDuration) {
            if (elapsedTime >= totalDuration) setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, elapsedTime, totalDuration]);

    const { currentPose, currentPoseIndex, nextPose, timeInCurrentPose } = useMemo(() => {
        let cumulativeTime = 0;
        for (let i = 0; i < program.length; i++) {
            const pose = program[i];
            if (elapsedTime < cumulativeTime + pose.duration) {
                return {
                    currentPose: pose,
                    currentPoseIndex: i,
                    nextPose: program[i + 1] || null,
                    timeInCurrentPose: elapsedTime - cumulativeTime,
                };
            }
            cumulativeTime += pose.duration;
        }
        return {
            currentPose: program[program.length - 1],
            currentPoseIndex: program.length - 1,
            nextPose: null,
            timeInCurrentPose: program[program.length - 1]?.duration || 0,
        };
    }, [elapsedTime, program]);

    const poseProgress = currentPose ? (timeInCurrentPose / currentPose.duration) * 100 : 0;
    const totalProgress = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0;
    const isFinished = elapsedTime >= totalDuration;

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setElapsedTime(0);
        setIsPlaying(true);
    };
    const handleSkip = () => {
        if (!nextPose) return;
        let cumulativeTime = 0;
        for (let i = 0; i <= currentPoseIndex; i++) {
            cumulativeTime += program[i].duration;
        }
        setElapsedTime(cumulativeTime);
    };

    const handleFinish = () => {
        setIsPlaying(false);
        onFinish?.();
    }

    if (program.length === 0) return null;

    return (
        <div className="relative w-full h-full text-white pointer-events-none">
            {/* TOP-LEFT: Picture-in-Picture & Pose Timer */}
            <div className="absolute top-4 left-4 flex items-start gap-4">
                <div className="w-48 lg:w-64 rounded-lg overflow-hidden shadow-2xl bg-black/30 backdrop-blur-sm pointer-events-auto">
                    <img src={currentPose.image} alt={currentPose.name} className="w-full h-auto object-cover animate-fade-in" />
                </div>
                <div className="hidden sm:block">
                     <CircularProgress value={isFinished ? 100 : poseProgress} size={100} strokeWidth={8}>
                        <div className="text-2xl font-bold">
                            {isFinished ? 'Done' : formatTime(currentPose.duration - timeInCurrentPose)}
                        </div>
                    </CircularProgress>
                </div>
            </div>

            {/* BOTTOM: Info, Controls, Progress */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                 <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-1 animate-fade-in">{currentPose.name}</h2>
                        <p className="text-neutral-300 animate-fade-in">{currentPose.cue}</p>
                    </div>

                    {nextPose && !isFinished && (
                        <div className="bg-white/10 rounded-lg px-3 py-1 text-sm backdrop-blur-sm animate-fade-in">
                            <span className="text-neutral-400">Up Next: </span>
                            <span className="font-semibold">{nextPose.name}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4 pointer-events-auto">
                        <Button variant="ghost" size="icon" className="w-14 h-14 text-white hover:bg-white/20" onClick={handleReset} aria-label="Reset Practice">
                            <RotateCcw className="w-7 h-7" />
                        </Button>
                        <Button size="icon" className="w-20 h-20 rounded-full bg-white text-black hover:bg-neutral-200" onClick={handlePlayPause} disabled={isFinished} aria-label={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="w-14 h-14 text-white hover:bg-white/20" onClick={handleSkip} disabled={!nextPose || isFinished} aria-label="Skip to Next Pose">
                            <SkipForward className="w-7 h-7" />
                        </Button>
                    </div>

                    <div className="w-full mt-2">
                        <div className="flex items-center justify-between mb-1 text-xs">
                            <span>{formatTime(elapsedTime)}</span>
                            <span>{formatTime(totalDuration)}</span>
                        </div>
                        <Progress value={totalProgress} className="h-1 bg-white/20 [&>div]:bg-white" />
                    </div>
                 </div>
            </div>

            {/* TOP-RIGHT: Finish Button */}
            <div className="absolute top-4 right-4 pointer-events-auto">
                <Button onClick={handleFinish} variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm">
                    <X className="w-6 h-6" />
                    <span className="sr-only">Finish Session</span>
                </Button>
            </div>
        </div>
    );
}

export default PracticePlayer;

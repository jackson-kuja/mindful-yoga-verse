
import { useState, useEffect, useMemo } from 'react';
import type { Session } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PracticePlayerProps {
  session: Session;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const PracticePlayer = ({ session }: PracticePlayerProps) => {
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

    if (program.length === 0) return <div className="p-4">This session has no program.</div>;

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-background text-foreground">
            <div className="lg:w-2/3 h-[50vh] lg:h-full bg-black flex items-center justify-center relative">
                <img src={currentPose.image} alt={currentPose.name} className="max-w-full max-h-full object-contain animate-fade-in" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{formatTime(elapsedTime)}</span>
                        <span className="text-sm font-medium text-white">{formatTime(totalDuration)}</span>
                    </div>
                    <Progress value={totalProgress} className="h-2" />
                </div>
            </div>

            <div className="lg:w-1/3 h-[50vh] lg:h-full flex flex-col p-6 overflow-y-auto">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <CircularProgress value={isFinished ? 100 : poseProgress} size={200} strokeWidth={10} className="mb-6">
                        <div className="text-4xl font-bold">
                            {isFinished ? 'Done!' : formatTime(currentPose.duration - timeInCurrentPose)}
                        </div>
                    </CircularProgress>

                    <h2 className="text-3xl font-bold mb-2">{currentPose.name}</h2>
                    <p className="text-muted-foreground mb-8">{currentPose.cue}</p>
                </div>

                <div className="flex-shrink-0">
                    {nextPose && !isFinished && (
                        <Card className="mb-6 bg-secondary/50 animate-fade-in">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Up Next</p>
                                <p className="font-semibold">{nextPose.name}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center justify-center gap-4">
                        <Button variant="ghost" size="icon" className="w-16 h-16" onClick={handleReset} aria-label="Reset Practice">
                            <RotateCcw className="w-8 h-8" />
                        </Button>
                        <Button size="icon" className="w-24 h-24 rounded-full" onClick={handlePlayPause} disabled={isFinished} aria-label={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="w-16 h-16" onClick={handleSkip} disabled={!nextPose || isFinished} aria-label="Skip to Next Pose">
                            <SkipForward className="w-8 h-8" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PracticePlayer;

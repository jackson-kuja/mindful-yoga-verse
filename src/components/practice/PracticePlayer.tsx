
import { useState, useEffect, useMemo } from 'react';
import type { Session, Pose } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, RotateCcw, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PracticePlayerProps {
  session: Session;
  onFinish?: () => void;
}

const REST_DURATION = 5; // 5-second rest between poses

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const PracticePlayer = ({ session, onFinish }: PracticePlayerProps) => {
    const program = session.program || [];

    const programWithRests = useMemo<(Pose | { type: 'rest', duration: number })[]>(() => {
        const result: (Pose | { type: 'rest', duration: number })[] = [];
        program.forEach((pose, index) => {
            result.push(pose);
            if (index < program.length - 1) {
                result.push({ type: 'rest', duration: REST_DURATION });
            }
        });
        return result;
    }, [program]);
    
    const totalDuration = useMemo(() => programWithRests.reduce((sum, item) => sum + item.duration, 0), [programWithRests]);

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying || elapsedTime >= totalDuration) {
            if (elapsedTime >= totalDuration) setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(prev => Math.min(prev + 1, totalDuration));
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, elapsedTime, totalDuration]);

    const { currentItem, nextPose, timeInCurrentItem } = useMemo(() => {
        let cumulativeTime = 0;
        if (!programWithRests || programWithRests.length === 0) {
            return { currentItem: null, nextPose: null, timeInCurrentItem: 0 };
        }

        for (let i = 0; i < programWithRests.length; i++) {
            const item = programWithRests[i];
            if (elapsedTime < cumulativeTime + item.duration) {
                const nextActualPose = programWithRests.slice(i + 1).find(p => 'name' in p) as Pose | undefined;
                return {
                    currentItem: item,
                    nextPose: nextActualPose || null,
                    timeInCurrentItem: elapsedTime - cumulativeTime,
                };
            }
            cumulativeTime += item.duration;
        }
        
        return {
            currentItem: programWithRests[programWithRests.length - 1],
            nextPose: null,
            timeInCurrentItem: programWithRests[programWithRests.length - 1]?.duration || 0,
        };
    }, [elapsedTime, programWithRests]);

    const isResting = currentItem && !('name' in currentItem);
    const currentPose = currentItem && 'name' in currentItem ? currentItem : null;

    const poseProgress = currentPose ? (timeInCurrentItem / currentPose.duration) * 100 : 0;
    const totalProgress = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0;
    const isFinished = elapsedTime >= totalDuration;
    const remainingPoseSeconds = currentPose ? Math.max(0, Math.round(currentPose.duration - timeInCurrentItem)) : 0;
    const remainingTotalSeconds = totalDuration > 0 ? Math.max(0, totalDuration - elapsedTime) : 0;

    const imageToDisplay = (isResting ? nextPose?.image : currentPose?.image) || '';
    const nameToDisplay = (isResting ? nextPose?.name : currentPose?.name) || '';

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setElapsedTime(0);
        setIsPlaying(true);
    };
    const handleSkip = () => {
        if (!nextPose) return;
        let cumulativeTime = 0;
        for (const item of programWithRests) {
            if ('name' in item && item.name === nextPose.name) {
                setElapsedTime(cumulativeTime);
                return;
            }
            cumulativeTime += item.duration;
        }
    };

    const handleFinish = () => {
        setIsPlaying(false);
        onFinish?.();
    }

    if (program.length === 0) return null;
    if (!currentItem) return null;

    return (
        <div className="relative w-full h-full text-white pointer-events-none">
            {isResting && nextPose && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 pointer-events-auto">
                    <div className="text-center animate-fade-in -mt-48"> {/* Pushed up to make space for the image */}
                        <p className="text-lg text-neutral-300 mb-2">Get Ready For</p>
                        <h3 className="text-4xl font-bold mb-4">{nextPose.name}</h3>
                    </div>
                </div>
            )}

            {/* Unified and animated pose image container */}
            {imageToDisplay && (
                <div className={cn(
                    "absolute rounded-lg overflow-hidden shadow-2xl bg-black/30 backdrop-blur-sm transition-all duration-700 ease-in-out pointer-events-auto z-30",
                    isResting 
                        ? "w-[512px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%-6rem)]" // Centered with offset
                        : "w-48 lg:w-64 top-4 left-4"
                )}>
                    <div className={cn(
                        "relative w-full",
                        isResting ? "h-[341px]" : "aspect-[512/341]"
                    )}>
                        <img src={imageToDisplay} alt={nameToDisplay} className="w-full h-full object-cover" />
                        
                        {isResting && currentItem.type === 'rest' && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                <span className="text-9xl font-bold text-yellow-400 drop-shadow-lg">
                                    {Math.ceil(currentItem.duration - timeInCurrentItem)}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {!isResting && currentPose && (
                        <div className="p-2 space-y-1">
                            <Progress value={isFinished ? 100 : poseProgress} className="h-1 bg-white/30 [&>div]:bg-white" />
                            <div className="text-xs text-right text-neutral-300 font-mono">
                                {isFinished ? 'Done' : `${remainingPoseSeconds} ${remainingPoseSeconds === 1 ? 'second' : 'seconds'} left`}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className={cn("transition-opacity duration-500", isResting ? 'opacity-20' : 'opacity-100')}>
                {/* BOTTOM: Info, Controls, Progress */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                     <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
                        {currentPose && (
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{currentPose.name}</h2>
                                <p className="text-neutral-300">{currentPose.cue}</p>
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
                                <span>-{formatTime(remainingTotalSeconds)}</span>
                            </div>
                            <Progress value={totalProgress} className="h-1 bg-white/20 [&>div]:bg-white" />
                        </div>
                     </div>
                </div>

                {/* TOP-RIGHT: Finish Button */}
                <div className="absolute top-4 right-4 pointer-events-auto">
                    <Button onClick={handleFinish} variant="ghost" className="rounded-full bg-black/30 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm">
                        End Session
                        <X />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PracticePlayer;

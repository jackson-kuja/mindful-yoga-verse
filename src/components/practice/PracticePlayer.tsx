import { useState, useEffect, useMemo } from 'react';
import type { Session, Pose } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, RotateCcw, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import SessionResults from './SessionResults';

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
    const [showResults, setShowResults] = useState(false);

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

    const isFinished = useMemo(() => totalDuration > 0 && elapsedTime >= totalDuration, [elapsedTime, totalDuration]);

    useEffect(() => {
        if (!isPlaying || isFinished) {
            if (isFinished) {
                setIsPlaying(false);
                setShowResults(true);
            }
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(prev => Math.min(prev + 1, totalDuration));
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, elapsedTime, totalDuration, isFinished]);

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
    const totalPoses = program.length;
    const currentPoseNumber = currentPose ? program.findIndex(p => p.name === currentPose.name) + 1 : 0;

    const poseProgress = currentPose ? (timeInCurrentItem / currentPose.duration) * 100 : 0;
    const totalProgress = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0;
    const remainingPoseSeconds = currentPose ? Math.max(0, Math.round(currentPose.duration - timeInCurrentItem)) : 0;
    const remainingTotalSeconds = totalDuration > 0 ? Math.max(0, totalDuration - elapsedTime) : 0;

    const imageToDisplay = (isResting ? nextPose?.image : currentPose?.image) || '';
    const nameToDisplay = (isResting ? nextPose?.name : currentPose?.name) || '';

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setElapsedTime(0);
        setIsPlaying(true);
        setShowResults(false);
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
        setShowResults(true);
    }

    const handleCloseResults = () => {
        setShowResults(false);
        onFinish?.();
    }

    if (program.length === 0) return null;
    if (!currentItem) return null;

    return (
        <div className="relative w-full h-full text-white pointer-events-none">
            {isResting && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 pointer-events-auto" />
            )}
            {isResting && nextPose && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">
                    <div className="text-center animate-fade-in" style={{ transform: 'translateY(-16rem)' }}>
                        <p className="text-lg text-neutral-300 mb-2">Get Ready For</p>
                        <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">{nextPose.name}</h3>
                    </div>
                </div>
            )}

            {/* Unified and animated pose image container */}
            {imageToDisplay && (
                <div className={cn(
                    "absolute rounded-lg overflow-hidden shadow-2xl bg-black/30 backdrop-blur-sm pointer-events-auto z-30",
                    !isResting ? "transition-all duration-700 ease-in-out" : "",
                    isResting 
                        ? "w-[512px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
                {/* BOTTOM: Player Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        {/* Controls & Info */}
                        <div className="flex items-center justify-between">
                            {/* Left: Pose Info */}
                            <div className="w-1/3 text-left">
                                {currentPose && (
                                    <div className="animate-fade-in">
                                        <h2 className="text-xl font-bold truncate">{currentPose.name}</h2>
                                        <p className="text-sm text-neutral-300 truncate">
                                            Pose {currentPoseNumber} of {totalPoses}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Center: Controls */}
                            <div className="flex-shrink-0 flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" className="w-12 h-12 text-white hover:bg-white/20" onClick={handleReset} aria-label="Reset Practice">
                                    <RotateCcw className="w-6 h-6" />
                                </Button>
                                <Button size="icon" className="w-16 h-16 rounded-full bg-white text-black hover:bg-neutral-200 shadow-lg" onClick={handlePlayPause} disabled={isFinished} aria-label={isPlaying ? "Pause" : "Play"}>
                                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="w-12 h-12 text-white hover:bg-white/20" onClick={handleSkip} disabled={!nextPose || isFinished} aria-label="Skip to Next Pose">
                                    <SkipForward className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Right: Next Pose Preview */}
                            <div className="w-1/3 text-right overflow-hidden">
                                {nextPose && !isResting && (
                                    <div className="flex items-center justify-end gap-2 animate-slide-in-right">
                                        <div className="text-right">
                                            <span className="text-xs text-neutral-400">Next up</span>
                                            <p className="text-sm font-medium truncate">{nextPose.name}</p>
                                        </div>
                                        <img src={nextPose.image} alt={nextPose.name} className="w-16 h-10 object-cover rounded-md" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-3 w-full mt-2">
                            <span className="text-xs font-mono text-neutral-400">{formatTime(elapsedTime)}</span>
                            <Progress value={totalProgress} className="h-1.5 w-full bg-white/20 [&>div]:bg-white" />
                            <span className="text-xs font-mono text-neutral-400">-{formatTime(remainingTotalSeconds)}</span>
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
            <SessionResults
                open={showResults}
                onClose={handleCloseResults}
                session={session}
                elapsedTime={elapsedTime}
            />
        </div>
    );
}

export default PracticePlayer;

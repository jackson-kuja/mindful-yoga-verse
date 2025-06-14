import React from 'react';
import type { Session } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Award, Clock, Flame } from 'lucide-react';

interface SessionResultsProps {
  session: Session;
  elapsedTime: number; // in seconds
  posesCompleted: number;
  totalPoses: number;
  onClose: () => void;
  open: boolean;
}

const formatTime = (seconds: number) => {
  seconds = Math.round(seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  if (secs === 0 && mins === 0) return "0s";
  return `${secs}s`;
};

const SessionResults = ({ session, elapsedTime, posesCompleted, totalPoses, onClose, open }: SessionResultsProps) => {
  const caloriesPerMinute = 25 / 10;
  const elapsedMinutes = elapsedTime / 60;
  const caloriesBurned = Math.round(elapsedMinutes * caloriesPerMinute);
  
  const isCompleted = posesCompleted === totalPoses && totalPoses > 0;
  const title = isCompleted ? "Session Complete!" : "Practice Stopped";
  const description = isCompleted
    ? `Great job completing your practice of ${session.name}.`
    : "Great effort! Every pose is a step forward.";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md pointer-events-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <span className="font-medium">Duration</span>
            </div>
            <span className="font-bold text-lg">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-destructive" />
              <span className="font-medium">Est. Calories Burned</span>
            </div>
            <span className="font-bold text-lg">{caloriesBurned} kcal</span>
          </div>
          {posesCompleted > 0 && (
             <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <span className="font-medium">Poses Completed</span>
                </div>
                <span className="font-bold text-lg">{posesCompleted} / {totalPoses}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionResults;

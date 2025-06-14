
import React from 'react';
import { Button } from '@/components/ui/button';
import SessionCard from '@/components/SessionCard';
import type { Session } from '@/data/sessions';

interface QuizResultsProps {
  results: Session[];
  onReset: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, onReset }) => {
  return (
    <div className="space-y-6 text-center">
      <h3 className="text-2xl font-bold tracking-tight">Your Recommended Sessions</h3>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No sessions match your answers. Try different options!</p>
      )}
      <Button onClick={onReset} variant="outline">Take Quiz Again</Button>
    </div>
  );
};

export default QuizResults;

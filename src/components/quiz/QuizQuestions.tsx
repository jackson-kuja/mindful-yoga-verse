
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { QuizAnswers } from '@/lib/types';

interface QuizQuestionsProps {
  answers: QuizAnswers;
  onAnswerChange: (question: keyof QuizAnswers, value: string) => void;
  onSubmit: () => void;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({ answers, onAnswerChange, onSubmit }) => {
  const isSubmitDisabled = !answers.length || !answers.goal || !answers.difficulty;
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Question 1: Length */}
        <div className="space-y-3">
          <h4 className="font-semibold">1. Preferred session length?</h4>
          <RadioGroup value={answers.length} onValueChange={(value) => onAnswerChange('length', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0-15" id="q1-opt1" />
              <Label htmlFor="q1-opt1">Under 15 min</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="16-30" id="q1-opt2" />
              <Label htmlFor="q1-opt2">16-30 min</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="31-999" id="q1-opt3" />
              <Label htmlFor="q1-opt3">Over 30 min</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Question 2: Goal */}
        <div className="space-y-3">
          <h4 className="font-semibold">2. Primary goal?</h4>
          <RadioGroup value={answers.goal} onValueChange={(value) => onAnswerChange('goal', value)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Energise" id="q2-opt1" /><Label htmlFor="q2-opt1">Energise</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Strength" id="q2-opt2" /><Label htmlFor="q2-opt2">Strength</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Flexibility" id="q2-opt3" /><Label htmlFor="q2-opt3">Flexibility</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Relax" id="q2-opt4" /><Label htmlFor="q2-opt4">Relax</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Desk Relief" id="q2-opt5" /><Label htmlFor="q2-opt5">Desk Relief</Label></div>
          </RadioGroup>
        </div>

        {/* Question 3: Difficulty */}
        <div className="space-y-3">
          <h4 className="font-semibold">3. Current level?</h4>
          <RadioGroup value={answers.difficulty} onValueChange={(value) => onAnswerChange('difficulty', value)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Beginner" id="q3-opt1" /><Label htmlFor="q3-opt1">Beginner</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Intermediate" id="q3-opt2" /><Label htmlFor="q3-opt2">Intermediate</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Advanced" id="q3-opt3" /><Label htmlFor="q3-opt3">Advanced</Label></div>
          </RadioGroup>
        </div>
      </div>
      <div className="text-center mt-8">
        <Button type="submit" size="lg" disabled={isSubmitDisabled}>Find My Flow</Button>
      </div>
    </form>
  );
};

export default QuizQuestions;

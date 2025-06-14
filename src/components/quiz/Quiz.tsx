
import React, { useState } from 'react';
import { sessions } from '@/data/sessions';
import type { Session } from '@/data/sessions';
import type { QuizAnswers } from '@/lib/types';
import QuizQuestions from './QuizQuestions';
import QuizResults from './QuizResults';

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<QuizAnswers>({
    length: '',
    goal: '',
    difficulty: '',
  });
  const [results, setResults] = useState<Session[] | null>(null);

  const handleAnswerChange = (question: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleReset = () => {
    setAnswers({ length: '', goal: '', difficulty: '' });
    setResults(null);
  };

  const handleSubmit = () => {
    const [min, max] = answers.length.split('-').map(Number);
    
    const filtered = sessions.filter(s => {
      const lengthMatch = s.length >= min && s.length <= max;
      const goalMatch = s.category === answers.goal;
      const difficultyMatch = answers.difficulty === 'Advanced' 
        ? s.difficulty === 'Advanced' 
        : s.difficulty === answers.difficulty || s.difficulty === 'All-Levels';
      
      return lengthMatch && goalMatch && difficultyMatch;
    });

    setResults(filtered.slice(0, 3));
  };

  return (
    <section className="container py-16 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
        {results === null ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Find Your Flow</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">Answer three questions to find the perfect session for you right now.</p>
          </div>
        ) : null}
        
        {results === null ? (
          <QuizQuestions answers={answers} onAnswerChange={handleAnswerChange} onSubmit={handleSubmit} />
        ) : (
          <QuizResults results={results} onReset={handleReset} />
        )}
      </div>
    </section>
  );
};

export default Quiz;

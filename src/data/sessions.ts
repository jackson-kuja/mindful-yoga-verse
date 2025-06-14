
export interface Session {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: number; // in minutes
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  focus: 'Flexibility' | 'Strength' | 'Relaxation';
  // TODO: Add real video source
  videoUrl?: string;
}

export const sessions: Session[] = [
  { id: 1, slug: 'morning-flow', title: 'Morning Flow', description: 'Start your day with energy.', duration: 15, level: 'Beginner', focus: 'Relaxation' },
  { id: 2, slug: 'power-vinyasa', title: 'Power Vinyasa', description: 'A dynamic, challenging practice.', duration: 45, level: 'Intermediate', focus: 'Strength' },
  { id: 3, slug: 'deep-stretch', title: 'Deep Stretch', description: 'Increase your flexibility.', duration: 30, level: 'All Levels', focus: 'Flexibility' },
  { id: 4, slug: 'evening-unwind', title: 'Evening Unwind', description: 'Relax and release tension.', duration: 20, level: 'Beginner', focus: 'Relaxation' },
  { id: 5, slug: 'core-strength', title: 'Core Strength', description: 'Build a strong and stable core.', duration: 25, level: 'Intermediate', focus: 'Strength' },
  { id: 6, slug: 'mindful-hips', title: 'Mindful Hips', description: 'Open your hips and find release.', duration: 35, level: 'All Levels', focus: 'Flexibility' },
];

export const getSessionBySlug = (slug: string): Session | undefined => {
  return sessions.find(session => session.slug === slug);
};


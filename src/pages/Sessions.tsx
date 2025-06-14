import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import SessionCard from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { sessions } from "@/data/sessions";
import type { Session } from "@/data/sessions";

const allCategories = ['All', ...Array.from(new Set(sessions.map(s => s.category)))];
const allLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All-Levels'];
const allDurations = [
    { label: "All", value: "all" },
    { label: "Under 15 min", value: "0-15" },
    { label: "16-30 min", value: "16-30" },
    { label: "Over 30 min", value: "31-999" },
];

const Sessions = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
  });

  const handleResetFilters = () => {
    setFilters({ category: 'all', level: 'all', duration: 'all' });
  };
  
  // Matcher functions for filtering
  const categoryMatch = (session: Session, category: string) => category === 'all' || session.category === category;
  
  const levelMatch = (session: Session, level: string) => {
    if (level === 'all') return true;
    // A session is included if its difficulty matches, or if it's an 'All-Levels' session (except for 'Advanced' filter)
    return session.difficulty === level || (level !== 'Advanced' && session.difficulty === 'All-Levels');
  };

  const durationMatch = (session: Session, duration: string) => {
    if (duration === 'all') return true;
    const [min, max] = duration.split('-').map(Number);
    return session.length >= min && session.length <= max;
  };

  // Dynamically calculate available options based on other active filters
  const availableCategories = allCategories.filter(category => {
    if (category === 'All') return true;
    const categoryValue = category === 'All' ? 'all' : category;
    return sessions.some(s => s.category === categoryValue && levelMatch(s, filters.level) && durationMatch(s, filters.duration));
  });

  const availableLevels = allLevels.filter(level => {
    if (level === 'All') return true;
    const levelValue = level === 'All' ? 'all' : level;
    return sessions.some(s => categoryMatch(s, filters.category) && levelMatch(s, levelValue) && durationMatch(s, filters.duration));
  });

  const availableDurations = allDurations.filter(d => {
    if (d.value === 'all') return true;
    return sessions.some(s => categoryMatch(s, filters.category) && levelMatch(s, filters.level) && durationMatch(s, d.value));
  });

  const filteredSessions = sessions.filter(session => {
    return categoryMatch(session, filters.category) && levelMatch(session, filters.level) && durationMatch(session, filters.duration);
  });

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    (acc[session.category] = acc[session.category] || []).push(session);
    return acc;
  }, {} as Record<Session['category'], Session[]>);

  return (
    <>
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters} 
        availableCategories={availableCategories}
        availableLevels={availableLevels}
        availableDurations={availableDurations}
      />
      <div className="container py-12">
        {Object.entries(groupedSessions).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedSessions).map(([category, sessionsInCategory]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {sessionsInCategory.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <h2 className="text-2xl font-bold">No sessions found</h2>
            <p className="mt-2">Try adjusting your filters to find the perfect session for you.</p>
            <Button onClick={handleResetFilters} className="mt-6">Clear Filters</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sessions;

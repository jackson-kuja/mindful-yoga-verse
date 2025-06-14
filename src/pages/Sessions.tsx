
import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import SessionCard from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { sessions } from "@/data/sessions";
import type { Session } from "@/data/sessions";

const Sessions = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
  });

  const handleResetFilters = () => {
    setFilters({ category: 'all', level: 'all', duration: 'all' });
  };
  
  const filteredSessions = sessions.filter(session => {
    const categoryMatch = filters.category === 'all' || session.category === filters.category;
    const levelMatch = filters.level === 'all' || session.difficulty === filters.level || (filters.level !== 'Advanced' && session.difficulty === 'All-Levels');
    
    const [min, max] = filters.duration.split('-').map(Number);
    const durationMatch = filters.duration === 'all' || (session.length >= min && session.length <= max);

    return categoryMatch && levelMatch && durationMatch;
  });

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    (acc[session.category] = acc[session.category] || []).push(session);
    return acc;
  }, {} as Record<Session['category'], Session[]>);

  return (
    <>
      <FilterBar filters={filters} onFilterChange={setFilters} />
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

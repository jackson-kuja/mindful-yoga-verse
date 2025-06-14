
import FilterBar from "@/components/FilterBar";
import SessionCard from "@/components/SessionCard";
import { sessions } from "@/data/sessions";

const Sessions = () => {
  // TODO: Implement actual filtering based on FilterBar state
  const filteredSessions = sessions;

  return (
    <>
      <FilterBar />
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Sessions Library</h1>
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <p>No sessions match your criteria.</p>
            {/* TODO: Add a "Clear Filters" button here */}
          </div>
        )}
      </div>
    </>
  );
};

export default Sessions;


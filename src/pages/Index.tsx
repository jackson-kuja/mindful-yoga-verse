
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sessions } from "@/data/sessions";
import type { Session } from "@/data/sessions";
import SessionCard from "@/components/SessionCard";

const Index = () => {
  const groupedSessions = sessions.reduce((acc, session) => {
    (acc[session.category] = acc[session.category] || []).push(session);
    return acc;
  }, {} as Record<Session['category'], Session[]>);

  // Pick a few categories to feature on the home page
  const featuredCategories = ["Energise", "Strength", "Relax"];

  return (
    <>
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '75vh' }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/lovable-uploads/20250614_1126_Tranquil Yoga Flow_simple_compose_01jxqgrf3kegmrv2c0wpjb2hen.mp4"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="relative z-20 container text-center px-4 md:px-6">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
              Find Your Flow, Anytime.
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
              Discover on-demand yoga sessions to calm your mind, strengthen your body, and uplift your spirit.
            </p>
            <Button asChild size="lg" aria-label="Browse all yoga sessions">
              <Link to="/sessions">Browse All Sessions</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <div className="border-b" />

      <section className="container py-16 md:py-24 lg:py-32">
        <div className="space-y-12">
          {featuredCategories.map(category => (
             groupedSessions[category] && (
              <div key={category}>
                <h2 className="text-3xl font-bold tracking-tight mb-6">{category}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {groupedSessions[category].slice(0, 4).map(session => (
                    <SessionCard 
                      key={session.id} 
                      session={session} 
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;

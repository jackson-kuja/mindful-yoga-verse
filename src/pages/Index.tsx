
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <section
        className="flex items-center justify-center bg-white"
        style={{ minHeight: '75vh' }}
      >
        <div className="container text-center px-4 md:px-6">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Flow, Anytime.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover on-demand yoga sessions to calm your mind, strengthen your body, and uplift your spirit.
            </p>
            <Button asChild size="lg" aria-label="Browse all yoga sessions">
              <Link to="/sessions">Browse Sessions</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="border-b" />

      <section className="container py-16 md:py-24 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Sanctuary for Modern Wellness</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">This is a placeholder for a brief mission blurb to explain the philosophy behind Yoga AI.</p>
            <Button asChild variant="link" className="mt-4 text-primary" aria-label="Learn more about Yoga AI">
                <Link to="/about">Learn More About Us</Link>
            </Button>
        </div>
      </section>
    </>
  );
};

export default Index;


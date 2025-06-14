
import { useParams, Link } from 'react-router-dom';
import { getSessionBySlug } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, BarChart3, Target } from "lucide-react";
import NotFound from './NotFound';

const SessionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const session = slug ? getSessionBySlug(slug) : undefined;

  if (!session) {
    return <NotFound />;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link to="/sessions" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Sessions
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-6">
            {/* TODO: Implement actual video player */}
            <p className="text-muted-foreground">Video Player Placeholder</p>
          </div>
          <h1 className="text-4xl font-bold mb-2">{session.title}</h1>
          <p className="text-lg text-muted-foreground">{session.description}</p>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-muted-foreground">{session.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Level</p>
                  <p className="text-muted-foreground">{session.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Focus</p>
                  <p className="text-muted-foreground">{session.focus}</p>
                </div>
              </div>
               <Button size="lg" className="w-full mt-4" aria-label={`Start ${session.title} practice`}>Start Practice</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;


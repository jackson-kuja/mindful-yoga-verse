
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSessionById } from '@/data/sessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, BarChart3, Star, User, Play } from "lucide-react";
import NotFound from './NotFound';

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = id ? getSessionById(id) : undefined;

  if (!session) {
    return <NotFound />;
  }
  
  const handleStartPractice = () => {
    navigate(`/practice/${session.id}`);
  };

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
          <div className="aspect-[3/2] bg-secondary rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
            {/* TODO: Implement actual video player */}
            <img src={session.thumbnail} alt={session.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="w-24 h-24 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Play video"
                onClick={handleStartPractice}
              >
                <Play className="w-16 h-16 text-white fill-white" />
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{session.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">{session.description}</p>
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
                  <p className="text-muted-foreground">{session.length} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Level</p>
                  <p className="text-muted-foreground">{session.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Category</p>
                  <p className="text-muted-foreground">{session.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Instructor</p>
                  <p className="text-muted-foreground">{session.instructor}</p>
                </div>
              </div>
               <Button size="lg" className="w-full mt-4" onClick={handleStartPractice} aria-label={`Start ${session.name} practice`}>Start Practice</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;

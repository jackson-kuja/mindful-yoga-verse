
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/data/sessions";
import ProgressRing from "./ProgressRing";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface SessionCardProps {
  session: Session;
  showProgress?: boolean;
  progress?: number;
}

const SessionCard = ({ session, showProgress = false, progress = 0 }: SessionCardProps) => {
  const navigate = useNavigate();

  const handleStartPractice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/practice/${session.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col transition-shadow duration-300 group-hover:shadow-lg overflow-hidden">
      <Link to={`/sessions/${session.id}`} className="block group flex-grow flex flex-col" aria-label={`View details for ${session.name}`}>
        <div className="relative aspect-[3/2] bg-secondary">
          {/* TODO: Replace with actual session thumbnail image */}
          <img src={session.thumbnail} alt={session.name} className="w-full h-full object-cover" />
          {showProgress && (
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full">
              <ProgressRing progress={progress} />
            </div>
          )}
        </div>
        <CardHeader className="flex-grow">
          <CardTitle className="text-xl">{session.name}</CardTitle>
          <CardDescription className="text-sm">{session.instructor}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-1.5" title="Duration">
            <Clock className="w-4 h-4" />
            <span>{session.length} min</span>
          </div>
          <Badge variant="outline">{session.difficulty}</Badge>
        </CardContent>
      </Link>
      <CardFooter className="p-4 border-t mt-auto">
        <Button onClick={handleStartPractice} className="w-full" size="sm" aria-label={`Start ${session.name} practice`}>
          Start Practice
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;

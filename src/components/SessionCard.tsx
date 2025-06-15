import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/data/sessions";
import { Clock, ArrowRight, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { isFuture, formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: Session;
}

const SessionCard = ({ session }: SessionCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const isLocked = session.releaseDate && isFuture(new Date(session.releaseDate));

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLocked) {
      e.preventDefault();
      toast({
        title: "Session Locked",
        description: `This session will be available in ${formatDistanceToNow(new Date(session.releaseDate!))}.`,
      });
    }
  };

  const handleStartPractice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) {
      toast({
        title: "Session Locked",
        description: `This session will be available in ${formatDistanceToNow(new Date(session.releaseDate!))}.`,
      });
      return;
    }
    navigate(`/practice/${session.id}`);
  };
  
  return (
    <Card className={cn(
      "h-full flex flex-col transition-shadow duration-300 overflow-hidden",
      !isLocked && "group-hover:shadow-lg"
    )}>
      <Link
        to={isLocked ? '#' : `/sessions/${session.id}`}
        onClick={handleCardClick}
        className="block group flex-grow flex flex-col"
        aria-label={`View details for ${session.name}`}
      >
        <div className="relative aspect-[3/2] bg-secondary">
          <img src={session.thumbnail} alt={session.name} className="w-full h-full object-cover" />
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
        <Button
          onClick={handleStartPractice}
          className="w-full"
          size="sm"
          aria-label={isLocked ? `Session ${session.name} is locked` : `Start ${session.name} practice`}
          disabled={isLocked}
        >
          {isLocked ? `Unlocks in ${formatDistanceToNow(new Date(session.releaseDate!))}` : 'Start Practice'}
          {!isLocked && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;

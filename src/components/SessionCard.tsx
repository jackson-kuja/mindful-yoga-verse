
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/data/sessions";
import ProgressRing from "./ProgressRing";
import { Clock } from "lucide-react";

interface SessionCardProps {
  session: Session;
  showProgress?: boolean;
  progress?: number;
}

const SessionCard = ({ session, showProgress = false, progress = 0 }: SessionCardProps) => {
  return (
    <Link to={`/sessions/${session.id}`} className="block group" aria-label={`View details for ${session.name}`}>
      <Card className="h-full flex flex-col transition-shadow duration-300 group-hover:shadow-lg overflow-hidden">
        <div className="relative aspect-video bg-secondary">
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
      </Card>
    </Link>
  );
};

export default SessionCard;

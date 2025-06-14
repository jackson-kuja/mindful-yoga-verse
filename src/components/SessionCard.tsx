
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Session } from "@/data/sessions";
import { Clock, BarChart3, Target } from "lucide-react";

interface SessionCardProps {
  session: Session;
}

const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <Link to={`/sessions/${session.slug}`} className="block group" aria-label={`View details for ${session.title}`}>
      <Card className="h-full transition-shadow duration-300 group-hover:shadow-lg overflow-hidden">
        <div className="h-40 bg-secondary flex items-center justify-center">
          {/* TODO: Replace with actual session thumbnail image */}
          <p className="text-sm text-muted-foreground">Image Placeholder</p>
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{session.title}</CardTitle>
          <CardDescription>{session.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-1.5" title="Duration">
            <Clock className="w-4 h-4" />
            <span>{session.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5" title="Level">
            <BarChart3 className="w-4 h-4" />
            <span>{session.level}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Focus">
            <Target className="w-4 h-4" />
            <span>{session.focus}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SessionCard;


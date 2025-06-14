
import type { Session } from '@/data/sessions';
import PracticePlayer from './PracticePlayer';

interface InstructionPaneProps {
  session: Session;
}

const InstructionPane = ({ session }: InstructionPaneProps) => {
  // Check if a structured program exists for this session
  if (session.program && session.program.length > 0) {
    return <PracticePlayer session={session} />;
  }

  // Fallback to showing the thumbnail if no program is available
  return (
    <div className="w-full h-full bg-secondary flex items-center justify-center p-4">
      {/* TODO: Replace with real instructional videos/images */}
      <img
        src={session.thumbnail}
        alt={`Instructional reference for ${session.name}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default InstructionPane;


import type { Session } from '@/data/sessions';

interface InstructionPaneProps {
  session: Session;
}

const InstructionPane = ({ session }: InstructionPaneProps) => {
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

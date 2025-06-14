
import type { Session } from '@/data/sessions';
import PracticePlayer from './PracticePlayer';

interface InstructionPaneProps {
  session: Session;
  onFinish?: () => void;
}

const InstructionPane = ({ session, onFinish }: InstructionPaneProps) => {
  // The parent PracticePage ensures a program exists.
  return <PracticePlayer session={session} onFinish={onFinish} />;
};

export default InstructionPane;

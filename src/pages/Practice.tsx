
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionById } from '@/data/sessions';
import InstructionPane from '@/components/practice/InstructionPane';
import WebcamPane from '@/components/practice/WebcamPane';
import NotFound from './NotFound';

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const session = id ? getSessionById(id) : undefined;

  useEffect(() => {
    if (session) {
      document.title = `Practice • ${session.name}`;
    }
    // Cleanup function to reset title
    return () => {
      document.title = 'Yoga AI';
    };
  }, [session]);

  if (!session) {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 h-[40vh] md:h-full">
        <InstructionPane session={session} />
      </div>
      <div className="md:w-1/2 h-[60vh] md:h-full">
        <WebcamPane session={session} />
      </div>
    </main>
  );
};

export default PracticePage;

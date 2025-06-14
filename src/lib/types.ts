
import type { Session } from "@/data/sessions";

export interface QuizAnswers {
  length: '0-15' | '16-30' | '31-999' | '';
  goal: Session['category'] | '';
  difficulty: Session['difficulty'] | '';
}

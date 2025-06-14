
import type { Session } from "@/data/sessions";

export interface QuizAnswers {
  length: '0-15' | '16-30' | '31-999' | '';
  category: Session['category'] | '';
  difficulty: Session['difficulty'] | '';
}

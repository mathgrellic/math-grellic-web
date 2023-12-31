import type { RecordStatus } from '#/core/models/core.model';

export type ExamQuestionChoiceFormData = {
  id: number;
  orderNumber: number;
  text: string;
  isExpression: boolean;
  isCorrect: boolean;
};

export type ExamQuestionFormData = {
  id: number;
  orderNumber: number;
  text: string;
  choices: ExamQuestionChoiceFormData[];
};

export type ExamUpsertFormData = {
  orderNumber: number | null;
  status: RecordStatus;
  title: string;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  pointsPerQuestion: number;
  passingPoints: number;
  questions: ExamQuestionFormData[];
  slug?: string;
  description?: string;
  excerpt?: string;
  coveredLessonIds?: number[];
  // Schedule
  startDate?: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  studentIds?: number[];
};

export type ExamScheduleUpsertFormData = {
  examId: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  studentIds: number[];
};

export type ExamAnswerFormData = {
  questionId: number;
  selectedQuestionChoiceId: number;
};

export type StudentExamFormData = {
  id: number;
  scheduleId: number;
  answers: ExamAnswerFormData[];
};

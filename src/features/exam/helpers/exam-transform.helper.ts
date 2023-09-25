import dayjs from 'dayjs';

import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type {
  Exam,
  ExamQuestion,
  ExamQuestionChoice,
  ExamQuestionChoiceFormData,
  ExamQuestionFormData,
  ExamSchedule,
  ExamUpsertFormData,
} from '../models/exam.model';

export function transformToExam({
  id,
  createdAt,
  updatedAt,
  status,
  orderNumber,
  title,
  slug,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  description,
  excerpt,
  coveredLessons,
  questions,
  schedules,
}: any): Exam {
  const transformedCoveredLessons =
    coveredLessons?.map((lesson: any) => ({ id: lesson.id })) || [];

  const transformedQuestions =
    questions?.map((question: any) => transformToExamQuestion(question)) || [];

  const transformedSchedules = schedules
    ? schedules.map((schedule: any) => transformToExamSchedule(schedule))
    : undefined;

  return {
    status,
    orderNumber,
    title,
    slug,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    description,
    excerpt,
    coveredLessons: transformedCoveredLessons,
    questions: transformedQuestions,
    schedules: transformedSchedules,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamQuestion({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  choices,
}: any): ExamQuestion {
  const transformedChoices = choices
    ? choices.map((choice: any) => transformToExamQuestionChoice(choice))
    : [];

  return {
    ...transformToBaseModel(id, createdAt, updatedAt),
    orderNumber,
    text,
    choices: transformedChoices,
  };
}

export function transformToExamQuestionChoice({
  id,
  createdAt,
  updatedAt,
  text,
  isCorrect,
}: any): ExamQuestionChoice {
  return {
    ...transformToBaseModel(id, createdAt, updatedAt),
    text,
    isCorrect,
  };
}

export function transformToExamSchedule({
  id,
  createdAt,
  updatedAt,
  startDate,
  endDate,
  students,
  exam,
}: any): Partial<ExamSchedule> {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  const transformedExam = exam ? transformToExam(exam) : undefined;

  return {
    ...transformToBaseModel(id, createdAt, updatedAt),
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    students: transformedStudents,
    exam: transformedExam,
  };
}

export function transformToExamFormData({
  status,
  orderNumber,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  description,
  excerpt,
  coveredLessons,
  questions,
  schedules,
}: any): ExamUpsertFormData {
  let startDate = undefined;
  let startTime = undefined;
  let endDate = undefined;
  let endTime = undefined;
  let studentIds = undefined;

  if (schedules?.length === 1) {
    const dayJsStartDate = dayjs(schedules[0].startDate);
    const dayJsEndDate = dayjs(schedules[0].startDate);

    startDate = dayJsStartDate.toDate();
    startTime = dayJsStartDate.format('hh:mm A');
    endDate = dayJsEndDate.toDate();
    endTime = dayJsEndDate.format('hh:mm A');
    studentIds =
      schedules[0].students?.map((student: StudentUserAccount) => student.id) ||
      [];
  }

  const coveredLessonIds =
    coveredLessons?.map((lesson: Partial<Lesson>) => lesson.id) || [];

  const transformedQuestions =
    questions?.map((question: any) =>
      transformToExamQuestionFormData(question),
    ) || [];

  return {
    status,
    orderNumber,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    description,
    excerpt,
    coveredLessonIds,
    questions: transformedQuestions,
    startDate,
    startTime,
    endDate,
    endTime,
    studentIds,
  };
}

export function transformToExamQuestionFormData({
  id,
  orderNumber,
  text,
  choices,
}: any): ExamQuestionFormData {
  const transformedChoices =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceFormData(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    choices: transformedChoices,
  };
}

export function transformToExamQuestionChoiceFormData({
  id,
  text,
  isCorrect,
}: any): ExamQuestionChoiceFormData {
  return {
    id,
    text,
    isCorrect,
  };
}

export function transformToExamUpsertDto({
  status,
  orderNumber,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  description,
  excerpt,
  coveredLessonIds,
  questions,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  const questionsDto =
    questions?.map((question: any) =>
      transformToExamQuestionUpsertDto(question),
    ) || [];

  return {
    status,
    orderNumber,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    description,
    excerpt,
    coveredLessonIds,
    questions: questionsDto,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToExamQuestionUpsertDto({
  id,
  orderNumber,
  text,
  choices,
}: any) {
  const choicesDto =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceUpsertDto(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    choicesDto: choicesDto,
  };
}

export function transformToExamQuestionChoiceUpsertDto({
  id,
  text,
  isCorrect,
}: any) {
  return {
    id,
    text,
    isCorrect,
  };
}

export function transformToExamScheduleCreateDto({
  examId,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    examId,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToExamScheduleUpdateDto({
  startDate,
  endDate,
  startTime,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}
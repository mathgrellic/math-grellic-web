import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { createExam as createExamApi } from '../api/teacher-exam.api';

import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createExam: (data: ExamUpsertFormData) => Promise<Exam>;
};

export function useExamCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createExam } = useMutation(
    createExamApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryExamKey.list,
        });
      },
    }),
  );

  return { isDone, setIsDone, createExam };
}

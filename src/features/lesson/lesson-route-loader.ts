import {
  getLessonBySlugAndCurrentTeacherUser,
  getPaginatedLessonsByCurrentTeacherUser,
} from './api/lesson-teacher.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export const getLessonBySlugLoader =
  (
    queryClient: QueryClient,
    queryParams?: { exclude?: string; include?: string },
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getLessonBySlugAndCurrentTeacherUser(keys);

    return (
      queryClient.getQueryData(query.queryKey as string[]) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const getPaginatedLessonsLoader =
  (queryClient: QueryClient) => async () => {
    const query = getPaginatedLessonsByCurrentTeacherUser();

    return (
      queryClient.getQueryData(query.queryKey as string[]) ??
      (await queryClient.fetchQuery(query))
    );
  };

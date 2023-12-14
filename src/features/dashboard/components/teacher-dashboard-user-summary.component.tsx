import { memo, useMemo } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';
import { DashboardShortcutMenu } from './dashboard-shortcut-menu.component';

import type { ComponentProps } from 'react';
import type { GroupLink } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';
import type { TeacherClassPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  classPerformance: TeacherClassPerformance | null;
  loading?: boolean;
};

const links = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.createTo}`,
    label: 'New lesson',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'chalkboard-teacher' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.createTo}`,
    label: 'New exam',
    icons: [{ name: 'plus', size: 16 }, { name: 'exam' }] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.activity.to}/${teacherRoutes.activity.createTo}`,
    label: 'New activity',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'game-controller' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
    label: 'Schedule meeting',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'calendar' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.student.to}/${teacherRoutes.student.createTo}`,
    label: 'Enroll student',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'users-four' },
    ] as GroupLink['icons'],
  },
];

export const TeacherDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  classPerformance,
  ...moreProps
}: Props) {
  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = classPerformance || {};

    return [
      {
        value: overallLessonCompletionPercent || 0,
        performace: StudentPerformanceType.Lesson,
        label: 'Lessons',
      },
      {
        value: overallExamCompletionPercent || 0,
        performace: StudentPerformanceType.Exam,
        label: 'Exams',
      },
      {
        value: overallActivityCompletionPercent || 0,
        performace: StudentPerformanceType.Activity,
        label: 'Activities',
      },
    ];
  }, [classPerformance]);

  return (
    <BaseSurface
      className={cx(
        'flex gap-4',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex min-w-[400px] animate-fastFadeIn flex-col gap-4'>
            {user && <DashboardUserWelcome user={user} />}
            <BaseDivider />
            <DashboardShortcutMenu
              className='h-full min-h-[100px]'
              links={links}
            />
          </div>
          <div>
            <BaseDivider vertical />
          </div>
          <div className='animate-fastFadeIn'>
            <div className='mb-4'>
              <h3 className='text-lg'>Overall Class Progress</h3>
              <span className='text-sm'>
                Track your class overall completion
              </span>
            </div>
            <div className='flex items-start gap-6'>
              {performances.map(({ value, performace, label }, index) => (
                <BaseProgressCircle
                  key={`progress-${index}`}
                  percent={value}
                  performance={performace}
                  label={label}
                  bottomLabelPosition
                />
              ))}
            </div>
          </div>
        </>
      )}
    </BaseSurface>
  );
});

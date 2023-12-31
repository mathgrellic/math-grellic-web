import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import dayjs from '#/config/dayjs.config';
import cx from 'classix';

import {
  convertSecondsToDuration,
  generateCountdownDate,
} from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
  primary?: boolean;
  upcomingDuration?: Duration | null;
};

export const StudentLessonSingleCard = memo(function ({
  className,
  lesson,
  primary,
  upcomingDuration,
  ...moreProps
}: Props) {
  const [singleTo, orderNumber, title, excerpt, isCompleted, duration] =
    useMemo(
      () => [
        lesson.slug,
        lesson.orderNumber,
        lesson.title,
        lesson.excerpt,
        !!lesson.completions?.length,
        convertSecondsToDuration(lesson.durationSeconds || 0, true),
      ],
      [lesson],
    );

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  const formattedUpcomingDate = useMemo(() => {
    if (!upcomingDuration) {
      return null;
    }
    return generateCountdownDate(upcomingDuration);
  }, [upcomingDuration]);

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface
        className={cx(
          'flex w-full flex-col gap-2.5 !py-2.5 !pl-2.5 !pr-5 transition-all group-hover:-translate-y-1 group-hover:ring-1',
          primary
            ? 'primary !border-accent !bg-primary group-hover:!border-primary-focus group-hover:ring-primary-focus group-hover:drop-shadow-primary'
            : 'group-hover:ring-primary-focus group-hover:drop-shadow-primary',
          className,
        )}
        rounded='sm'
        {...moreProps}
      >
        <div className='flex w-full items-center gap-4'>
          {/* Image */}
          <div
            className={`flex h-[90px] w-[161px] items-center justify-center overflow-hidden rounded border border-primary bg-primary-focus-light/30 text-primary
              [.primary_&]:h-[117px] [.primary_&]:w-[209px] [.primary_&]:border-accent [.primary_&]:bg-white/50 [.primary_&]:text-accent`}
          >
            <BaseIcon name='chalkboard-teacher' size={40} weight='light' />
          </div>
          <div className='flex flex-1'>
            <div className='flex flex-1 flex-col gap-3'>
              {/* Title and status */}
              <div className='flex w-full items-center'>
                <h2 className='flex-1 font-body text-lg font-medium tracking-normal text-accent [.primary_&]:text-white'>
                  {title}
                </h2>
                {!formattedUpcomingDate && (
                  <div className='flex w-20 justify-center'>
                    {!isCompleted ? (
                      <BaseIcon
                        name='circle-dashed'
                        size={44}
                        className='text-accent/50 [.primary_&]:text-white/60'
                      />
                    ) : (
                      <div className='relative flex items-center justify-center'>
                        <BaseIcon
                          name='check-circle'
                          weight='fill'
                          className='relative z-10 text-green-500'
                          size={44}
                        />
                        <div className='absolute h-6 w-6 bg-white' />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Info chips */}
              <div className='flex w-full items-center justify-between [.primary_&]:text-white'>
                <div className='flex items-center gap-2.5'>
                  <BaseChip iconName='chalkboard-teacher'>
                    Lesson {orderNumber}
                  </BaseChip>
                  <BaseDivider
                    className='!h-6 [.primary_&]:border-white/20'
                    vertical
                  />
                  <BaseChip iconName='hourglass'>{duration}</BaseChip>
                </div>
                {!formattedUpcomingDate && scheduleDate && (
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                )}
              </div>
            </div>
          </div>
          {formattedUpcomingDate && scheduleDate && (
            <div className='w-[276px]'>
              <small className='mb-1 flex w-full items-center justify-end font-medium uppercase [.primary_&]:text-white'>
                <span className='relative mr-4 flex gap-1'>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light [.primary_&]:bg-white'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-100 [.primary_&]:bg-white'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-200 [.primary_&]:bg-white'></span>
                </span>
                Available In
              </small>
              <div className='w-full overflow-hidden rounded border border-accent [.primary_&]:border-white'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary [.primary_&]:bg-white'>
                  <span className='text-sm font-medium uppercase text-white [.primary_&]:text-primary'>
                    {formattedUpcomingDate}
                  </span>
                </div>
                <div className='flex w-full items-center justify-center gap-2.5 border-t border-t-accent [.primary_&]:border-t-white [.primary_&]:text-white'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseDivider
                    className='!h-6 [.primary_&]:border-white/20'
                    vertical
                  />
                  <BaseChip iconName='calendar-check'>{scheduleTime}</BaseChip>
                </div>
              </div>
            </div>
          )}
        </div>
        {excerpt && (
          <div className='pb-1.5 [.primary_&]:text-white'>
            <p className='line-clamp-2 h-10 text-sm'>{excerpt}</p>
          </div>
        )}
      </BaseSurface>
    </Link>
  );
});

export const StudentLessonSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse items-center justify-between gap-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-5'>
      <div className='h-[90px] w-[161px] rounded bg-accent/20' />
      <div className='flex h-fit flex-1 flex-col gap-5'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='h-6 w-28 rounded bg-accent/20' />
            <div className='h-6 w-28 rounded bg-accent/20' />
          </div>
          <div className='h-6 w-28 rounded bg-accent/20' />
        </div>
      </div>
    </div>
  );
});

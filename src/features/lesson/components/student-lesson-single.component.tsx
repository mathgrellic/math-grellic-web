import { memo, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { cx } from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { LessonVideo } from './lesson-video.component';

import type { ComponentProps } from 'react';
import type { Lesson, LessonCompletion } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
  loading?: boolean;
  preview?: boolean;
  upcoming?: boolean;
  onSetCompletion?: (isComplete: boolean) => Promise<LessonCompletion | null>;
};

export const StudentLessonSingle = memo(function LessonSingle({
  className,
  loading,
  lesson,
  preview,
  upcoming,
  // TODO upcoming countdown
  onSetCompletion,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const videoUrl = useMemo(() => lesson.videoUrl, [lesson]);
  const excerpt = useMemo(() => lesson.excerpt, [lesson]);
  const isCompleted = useMemo(() => !!lesson.completions?.length, [lesson]);

  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );

  const descriptionHtml = useMemo(
    () => ({ __html: DOMPurify.sanitize(lesson.description || '') }),
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

  const markAsButtonLabel = useMemo(
    () =>
      isCompleted ? 'Unmark Lesson as Completed' : 'Mark Lesson as Completed',
    [isCompleted],
  );

  const handleOnSetCompletion = useCallback(async () => {
    if (preview || upcoming || !onSetCompletion) {
      return;
    }

    try {
      const result = await onSetCompletion(!isCompleted);
      toast.success(
        result ? 'Lesson marked as completed' : 'Lesson unmarked as completed',
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [preview, upcoming, isCompleted, onSetCompletion]);

  return (
    <div
      className={cx('flex w-full flex-col items-center', className)}
      {...moreProps}
    >
      {upcoming ? (
        <div className='mb-8 mt-5 h-[500px] w-full overflow-hidden rounded-lg bg-black'>
          <div className='mx-auto flex h-full w-full max-w-compact flex-col items-center justify-center bg-blue-100/70'>
            <div className='w-[276px]'>
              <small className='mb-1 block w-full text-right font-medium uppercase text-white'>
                Available On
              </small>
              <div className='w-full overflow-hidden rounded border border-accent drop-shadow-primary'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary'>
                  <small className='font-medium uppercase text-white'>
                    {/* TODO countdown */}
                    10 days : 16 hrs : 30 mins
                  </small>
                </div>
                <div className='flex w-full items-center justify-center gap-2.5 border-t border-t-accent bg-white'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='calendar-check'>{scheduleTime}</BaseChip>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LessonVideo className='mb-8 mt-5' url={videoUrl} title={title} />
      )}
      <div className='w-full max-w-compact px-4'>
        <div className='flex h-[70px] w-full items-center justify-between rounded-lg border border-primary-border-light bg-white px-5 py-2.5'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
          </div>
          {!upcoming && (
            <div className='flex items-center gap-2.5'>
              {isCompleted ? (
                <BaseIcon
                  name='check-circle'
                  className='text-green-500'
                  size={36}
                  weight='fill'
                />
              ) : (
                <BaseIcon
                  name='circle-dashed'
                  className='text-black/40'
                  size={36}
                />
              )}
              <BaseButton
                className='w-72'
                loading={loading}
                disabled={preview}
                onClick={handleOnSetCompletion}
              >
                {markAsButtonLabel}
              </BaseButton>
            </div>
          )}
        </div>
        {upcoming ? (
          <div className='w-full'>{excerpt}</div>
        ) : (
          <div
            className='base-rich-text rt-output py-8'
            dangerouslySetInnerHTML={descriptionHtml}
          />
        )}
      </div>
    </div>
  );
});

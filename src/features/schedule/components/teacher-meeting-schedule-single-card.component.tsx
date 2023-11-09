import { memo, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import dayjs from 'dayjs';
import cx from 'classix';

import { getDayJsDuration, convertSecondsToDuration } from '#/utils/time.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<typeof BaseSurface> & {
  meetingSchedule: MeetingSchedule;
  onDetails?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const TeacherMeetingScheduleSingleCard = memo(function ({
  className,
  meetingSchedule,
  onDetails,
  onEdit,
  ...moreProps
}: Props) {
  const [title, meetingUrl] = useMemo(
    () => [meetingSchedule.title, meetingSchedule.meetingUrl],
    [meetingSchedule],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    const date = dayjs(meetingSchedule.startDate).format('MMM DD, YYYY');

    const time = `${dayjs(meetingSchedule.startDate).format(
      'hh:mm A',
    )} — ${dayjs(meetingSchedule.endDate).format('hh:mm A')}`;

    const duration = getDayJsDuration(
      meetingSchedule.endDate,
      meetingSchedule.startDate,
    ).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [meetingSchedule]);

  return (
    <BaseSurface
      className={cx(
        'flex h-[106px] w-full items-center gap-5 !p-2.5',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex h-full flex-1 items-start gap-4'>
        <div className='flex h-full flex-1 items-center gap-4'>
          <div className='flex h-full w-[121px] items-center justify-center overflow-hidden rounded border border-primary bg-primary-focus-light/30 text-primary'>
            <BaseIcon name='presentation' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col justify-between gap-2 py-1.5'>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {title}
            </h2>
            <div className='flex justify-start'>
              <BaseLink
                to={meetingUrl}
                target='_blank'
                className='!font-body font-medium'
                rightIconName='arrow-square-out'
                size='sm'
              >
                {meetingUrl}
              </BaseLink>
            </div>
          </div>
        </div>
        <div className='flex min-w-[190px] flex-col gap-1'>
          <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
          <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
          <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
        </div>
      </div>
      <div className='relative h-12 w-7'>
        <BaseDropdownMenu
          customMenuButton={
            <div className='relative h-12 w-7'>
              <Menu.Button
                as={BaseIconButton}
                name='dots-three-vertical'
                variant='link'
                className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                iconProps={menuIconProps}
              />
            </div>
          }
        >
          <Menu.Item
            as={BaseDropdownButton}
            iconName='article'
            onClick={onDetails}
          >
            Details
          </Menu.Item>
          <BaseDivider className='my-1' />
          <Menu.Item as={BaseDropdownButton} iconName='pencil' onClick={onEdit}>
            Edit
          </Menu.Item>
        </BaseDropdownMenu>
      </div>
    </BaseSurface>
  );
});

export const TeacherMeetingScheduleSingleCardSkeleton = memo(function () {
  return (
    <div className='flex min-h-[106px] w-full animate-pulse justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='h-full w-[120px] rounded bg-accent/20' />
      <div className='flex h-full flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='h-6 w-72 rounded bg-accent/20' />
      </div>
      <div className='flex h-full gap-5'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
        </div>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
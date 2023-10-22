import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import {
  ActivityCategoryLevel,
  ActivityCategoryType,
  activityGameLabel,
  categoryLevel,
} from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  Activity,
  ActivityCategory,
  ActivityGame,
} from '../models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  activity: Activity;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const TeacherActivitySingleCard = memo(function ({
  className,
  activity,
  onDetails,
  onPreview,
  onEdit,
  ...moreProps
}: Props) {
  const [orderNumber, title, game, categories, isDraft] = useMemo(
    () => [
      activity.orderNumber,
      activity.title,
      activity.game,
      activity.categories,
      activity.status === RecordStatus.Draft,
    ],
    [activity],
  );

  const gameName = useMemo(
    () => activityGameLabel[game.name as ActivityGame],
    [game],
  );

  const getCategoryValue = useCallback(
    (category: ActivityCategory) => {
      if (game.type === ActivityCategoryType.Point) {
        const durationText = convertSecondsToDuration(
          category.typePoint?.durationSeconds || 0,
          true,
        );
        return `${durationText}`;
      } else {
        const answerText =
          (category.typeTime?.correctAnswerCount || 0) > 1 ? 'Points' : 'Point';
        return `${category.typeTime?.correctAnswerCount} ${answerText}`;
      }
    },
    [game],
  );

  const getLevelIconName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].iconName as IconName,
    [],
  );

  const getLevelName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].levelName,
    [],
  );

  return (
    <BaseSurface
      className={cx('flex w-full items-center gap-5 !p-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex h-full flex-1 items-start gap-4'>
        <div className='flex h-full flex-1 items-start gap-4'>
          {/* TODO Image */}
          <div className='flex h-[88px] w-[121px] items-center justify-center overflow-hidden rounded border border-primary bg-primary-hue-teal/30 font-medium'>
            <BaseIcon name='game-controller' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col justify-between gap-2 py-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='game-controller'>
                Activity {orderNumber}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='dice-three'>{gameName}</BaseChip>
              {isDraft && (
                <>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='file-dashed'>Draft</BaseChip>
                </>
              )}
            </div>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {title}
            </h2>
          </div>
        </div>
        {/* Category info */}
        {!!categories.length && (
          <div>
            {categories.map((category, index) => (
              <div
                key={`cat-${index}`}
                className='flex items-center gap-2.5 pt-1'
              >
                <BaseChip iconName={getLevelIconName(category.level)}>
                  {getCategoryValue(category)}
                </BaseChip>
                <span className='text-sm uppercase'>
                  ({getLevelName(category.level)})
                </span>
              </div>
            ))}
          </div>
        )}
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
          <Menu.Item
            as={BaseDropdownButton}
            iconName='file-text'
            onClick={onPreview}
          >
            Preview
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
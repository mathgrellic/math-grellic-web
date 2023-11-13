import { memo, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import {
  formatPhoneNumber,
  generateFullName,
} from '#/user/helpers/user.helper';
import { UserApprovalStatus } from '#/user/models/user.model';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentUserAccount;
  onDetails?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const StudentUserSingleCard = memo(function ({
  className,
  student,
  onDetails,
  onEdit,
  ...moreProps
}: Props) {
  const [publicId, email, approvalStatus, gender, phoneNumber] = useMemo(
    () => [
      student.publicId,
      student.email,
      student.approvalStatus,
      student.gender,
      formatPhoneNumber(student.phoneNumber),
    ],
    [student],
  );

  const fullName = useMemo(
    () =>
      generateFullName(student.firstName, student.lastName, student.middleName),
    [student],
  );

  const [statusLabel, statusIconName] = useMemo(() => {
    switch (approvalStatus) {
      case UserApprovalStatus.Approved:
        return ['Enrolled', 'check-square'];
      case UserApprovalStatus.Rejected:
        return [approvalStatus, 'x-square'];
      default:
        return [approvalStatus, 'minus-square'];
    }
  }, [approvalStatus]);

  return (
    <BaseSurface
      className={cx('flex w-full items-center gap-5 !p-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-1 items-center gap-4'>
        <div className='flex flex-1 items-center gap-4'>
          <UserAvatarImg gender={gender} size='lg' />
          <div className='flex h-full flex-1 flex-col gap-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='identification-badge'>{phoneNumber}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName={statusIconName as IconName}>
                {statusLabel}
              </BaseChip>
            </div>
            {/* Title + email */}
            <div>
              <h2 className='font-body text-lg font-medium leading-tight tracking-normal text-accent'>
                {fullName}
              </h2>
              <span className='text-sm font-medium'>{email}</span>
            </div>
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
            <Menu.Item
              as={BaseDropdownButton}
              iconName='pencil'
              onClick={onEdit}
            >
              Edit
            </Menu.Item>
          </BaseDropdownMenu>
        </div>
      </div>
    </BaseSurface>
  );
});

export const StudentUserSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse items-center justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='h-[80px] w-[80px] rounded bg-accent/20' />
      <div className='flex h-full flex-1 flex-col justify-between gap-5 py-2.5'>
        <div className='h-6 w-[240px] rounded bg-accent/20' />
        <div className='h-6 w-[180px] rounded bg-accent/20' />
      </div>
      <div className='flex h-full gap-5'>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});

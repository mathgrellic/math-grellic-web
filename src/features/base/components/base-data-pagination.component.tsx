import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseButton } from './base-button.components';

import type { ComponentProps } from 'react';
import type { QueryPagination } from '../models/base.model';
import { BaseIconButton } from './base-icon-button.component';

type Props = ComponentProps<'div'> & {
  totalCount?: number;
  pagination?: QueryPagination;
  onNext?: () => void;
  onPrev?: () => void;
};

export const BaseDataPagination = memo(function ({
  className,
  totalCount = 0,
  pagination = { take: 0, skip: 0 },
  onNext,
  onPrev,
  ...moreProps
}: Props) {
  const entriesText = useMemo(() => {
    const { take, skip } = pagination;
    const startCount = skip + 1;
    const endCount = Math.min(totalCount, skip + take);
    return `Showing entries ${startCount} to ${endCount} of ${totalCount}`;
  }, [totalCount, pagination]);

  const pagesText = useMemo(() => {
    const { take, skip } = pagination;
    const currentPage = skip / take + 1;
    const totalPage = Math.ceil(totalCount / take);
    return `Page ${currentPage} of ${totalPage}`;
  }, [totalCount, pagination]);

  return (
    <div
      className={cx(
        'bg-gradient sticky bottom-0 w-full bg-gradient-to-t from-backdrop from-60% to-transparent pb-3 pt-10',
        className,
      )}
      {...moreProps}
    >
      <div className='flex min-h-[46px] w-full items-center justify-between'>
        <div className='text-sm'>{entriesText}</div>
        <div className='flex items-center gap-x-2'>
          <div className='flex items-center'>
            <BaseIconButton
              name='caret-circle-left'
              variant='link'
              onClick={onPrev}
            />
            <BaseIconButton
              name='caret-circle-right'
              variant='link'
              onClick={onNext}
            />
          </div>
          <BaseButton
            className='pointer-events-none !px-3.5 !font-body !font-medium !tracking-normal'
            variant='border'
            size='sm'
          >
            {pagesText}
          </BaseButton>
        </div>
      </div>
    </div>
  );
});

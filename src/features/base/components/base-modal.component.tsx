import { Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import cx from 'classix';

import {
  dialogBackdropTransition,
  dialogPanelTransition,
} from '#/utils/animation.util';
import { BaseSurface } from './base-surface.component';
import { BaseControlButton } from './base-control-button.component';

import type { ComponentProps, ReactNode } from 'react';
import type { ModalSize } from '../models/base.model';

type Props = Omit<ComponentProps<typeof BaseSurface>, 'children'> & {
  open: boolean;
  onClose?: () => void;
  size?: ModalSize;
  children?: ReactNode;
};

export function BaseModal({
  className,
  open,
  size = 'base',
  children,
  onClose,
  ...moreProps
}: Props) {
  const handleClose = useCallback(() => {
    !!onClose && onClose();
  }, [onClose]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' onClose={handleClose}>
        <Transition.Child as={Fragment} {...dialogBackdropTransition}>
          <div className='fixed inset-0 z-max bg-black/20 backdrop-blur-lg' />
        </Transition.Child>
        <div className='fixed inset-0 z-max w-screen overflow-y-auto'>
          <Transition.Child as={Fragment} {...dialogPanelTransition}>
            <div className='flex min-h-full items-center justify-center'>
              <Dialog.Panel
                className={cx(
                  'w-full max-w-[700px] transition-all',
                  size === 'xs' && '!max-w-sm',
                  size === 'sm' && '!max-w-xl',
                  size === 'lg' && '!max-w-[968px]',
                  size === 'none' && '!max-w-none',
                )}
              >
                <BaseSurface
                  className={cx(
                    'relative min-h-[150px] w-full overflow-hidden !bg-backdrop shadow-md',
                    onClose ? 'pt-14' : 'pt-8',
                    className,
                  )}
                  rounded='lg'
                  {...moreProps}
                >
                  {!!onClose && (
                    <BaseControlButton
                      className='absolute right-5 top-5'
                      leftIconName='x'
                      onClick={onClose}
                    >
                      Close
                    </BaseControlButton>
                  )}
                  {children}
                </BaseSurface>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

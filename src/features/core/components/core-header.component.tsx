import { memo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { useAuth } from '#/user/hooks/use-auth.hook';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { useScroll } from '../hooks/use-scroll.hook';
import { CoreClock } from './core-clock.component';

import type { ComponentProps } from 'react';

export const CoreHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const { isScrollTop } = useScroll();
  const { logout } = useAuth();

  // TODO notification and user menu

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={cx(
        'fixed right-10 top-4 z-20 w-fit rounded-lg border  border-transparent bg-backdrop px-0 transition-all duration-300',
        !isScrollTop && '!border-accent/20 !px-2.5 drop-shadow-sm',
        className,
      )}
      {...moreProps}
    >
      <div className='flex h-[48px] items-center justify-center gap-2.5'>
        <div className='flex items-center gap-1.5'>
          {/* <BaseIconButton name='bell' variant='solid' size='sm' /> */}
          <BaseDropdownMenu
            customMenuButton={
              <div>
                <Menu.Button
                  as={BaseIconButton}
                  name='user'
                  variant='solid'
                  size='sm'
                />
              </div>
            }
          >
            <Menu.Item
              as={BaseDropdownButton}
              iconName='person-arms-spread'
              onClick={handleLogout}
              disabled
            >
              Account
            </Menu.Item>
            <BaseDivider className='my-1' />
            <Menu.Item
              as={BaseDropdownButton}
              iconName='sign-out'
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </BaseDropdownMenu>
        </div>
        <BaseDivider vertical />
        <CoreClock className='h-full' isCompact={!isScrollTop} />
      </div>
    </header>
  );
});

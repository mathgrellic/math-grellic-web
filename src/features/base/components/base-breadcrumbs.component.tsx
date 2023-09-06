import { Fragment, memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classix';

import type { ComponentProps } from 'react';

export const BaseBreadcrumbs = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'ol'>) {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => {
    const labels = pathname.split('/').filter((path) => path.trim());

    const link: string[] = [];
    return labels.map((label, index) => {
      link.push('/' + labels[index]);

      if (index === labels.length - 1) {
        return <li>{label}</li>;
      }

      return (
        <li className='flex after:mx-1.5 after:content-["/"] hover:text-primary'>
          <Link to={link.join('')}>{label}</Link>
        </li>
      );
    });
  }, [pathname]);

  return (
    <ol
      className={cx('flex items-center text-sm text-accent/80', className)}
      {...moreProps}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={`bc-${index}`}>{breadcrumb}</Fragment>
      ))}
    </ol>
  );
});

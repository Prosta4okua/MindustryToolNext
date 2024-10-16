'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import InternalLink from '@/components/common/internal-link';

type Props = {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
};

export default function NavLink({ id, href, label, icon }: Props) {
  const pathname = usePathname();
  const firstSlash = pathname.indexOf('/', 1);
  const route = pathname.slice(firstSlash);

  return (
    <InternalLink
      className={cn('flex h-12 snap-center items-center gap-2 text-nowrap text-sm font-semibold opacity-70 transition-[gap] hover:text-white hover:opacity-100', {
        'border-b-[3px] border-b-foreground text-white opacity-100': (route.endsWith(href) && href !== '') || (id !== '' && href === '' && route === `/servers/${id}`),
      })}
      key={href}
      href={`/servers/${id}/${href}`}
    >
      <div className="flex px-2 gap-1 py-2 hover:bg-muted justify-center rounded-md">
        {icon}
        <span className={cn('overflow-hidden transition-[width] duration-200')}>{label}</span>
      </div>
    </InternalLink>
  );
}

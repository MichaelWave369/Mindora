'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  '/',
  '/onboarding',
  '/journal',
  '/mood',
  '/breathing',
  '/resources',
  '/settings',
  '/packet',
  '/share',
  '/privacy'
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 py-3">
      {items.map((href) => (
        <Link
          key={href}
          href={href}
          className={`rounded px-3 py-1 text-sm ${
            path === href
              ? 'bg-slate-900 text-white'
              : 'border border-slate-300 bg-white'
          }`}
        >
          {href === '/' ? 'Home' : href.slice(1)}
        </Link>
      ))}
    </nav>
  );
}

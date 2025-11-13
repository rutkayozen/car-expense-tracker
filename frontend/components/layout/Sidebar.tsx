'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/settings/subscription', label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-sm">
      <div className="px-6 py-4 text-xl font-semibold">AI Expense Tracker</div>
      <nav className="mt-4 space-y-1">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                active ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Settings, History, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/lookup', label: 'New Lookup', icon: Search },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-white/10 bg-onyx-dark/50 backdrop-blur-md sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-emerald-mid flex items-center justify-center">
            <span className="font-display font-bold text-ivory text-xl leading-none">B</span>
          </div>
          <span className="font-display font-medium text-xl text-ivory tracking-wide">
            BidSmart
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-mid/10 text-emerald-bright border-l-2 border-emerald-mid'
                  : 'text-ivory/60 hover:text-ivory hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-sm text-ivory/60 hover:text-burgundy-bright hover:bg-burgundy-dark/20 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

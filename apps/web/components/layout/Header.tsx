'use client';

import { useAuthStore } from '@/lib/store/auth';
import { Avatar } from '../ui/Avatar';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/10 bg-onyx-dark/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-emerald-mid flex items-center justify-center">
              <span className="font-display font-bold text-ivory text-xl leading-none">B</span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1" />

        <div className="flex items-center gap-4">
          <button className="p-2 text-ivory/60 hover:text-ivory transition-colors rounded-sm hover:bg-white/5 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-mid" />
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-2" />
          
          <Link href="/settings" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-ivory group-hover:text-emerald-bright transition-colors">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-ivory/50 capitalize">
                {user?.tier} Tier
              </p>
            </div>
            <Avatar 
              src={user?.avatarUrl} 
              initials={user?.name?.charAt(0).toUpperCase()} 
              size="sm"
              className="ring-2 ring-transparent group-hover:ring-emerald-mid transition-all"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

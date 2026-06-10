'use client';

import { Toaster as Sonner } from 'sonner';

export function ToastProvider() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        className: 'font-body rounded-sm border border-white/10 bg-onyx-mid text-ivory shadow-xl',
        style: {
          background: '#1A1A1C', // onyx-mid
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FAF9F6', // ivory
        },
      }}
    />
  );
}

'use client';

import { useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

interface UseGoogleAuthOptions {
  onSuccess: (idToken: string) => void | Promise<void>;
  onError?: (error: string) => void;
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  
  return new Promise((resolve) => {
    if (scriptLoading) {
      loadCallbacks.push(resolve);
      return;
    }
    
    scriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions) {
  const initializedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || initializedRef.current) return;

    loadGoogleScript().then(() => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string; error?: string }) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.(response.error || 'Google sign-in failed');
          }
        },
      });
    });
  }, [onSuccess, onError]);

  const triggerGoogleSignIn = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      onError?.('Google OAuth is not configured');
      return;
    }

    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      onError?.('Google Sign-In is still loading. Please try again.');
    }
  }, [onError]);

  return { triggerGoogleSignIn };
}

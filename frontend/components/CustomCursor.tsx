'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const hoveredRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dotRef.current) {
      dotRef.current.style.left = `${e.clientX}px`;
      dotRef.current.style.top = `${e.clientY}px`;
    }
    ringPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    try {
      document.body.style.cursor = 'none';
    } catch {}

    window.addEventListener('mousemove', handleMouseMove);

    const delegateOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-hover]')) {
        hoveredRef.current = true;
        if (ringRef.current) {
          ringRef.current.style.transform = 'translate(-50%, -50%) scale(1.8)';
        }
      }
    };
    const delegateOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-hover]')) {
        hoveredRef.current = false;
        if (ringRef.current) {
          ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      }
    };

    document.addEventListener('mouseover', delegateOver);
    document.addEventListener('mouseout', delegateOut);

    const lerp = () => {
      if (ringRef.current) {
        const currentLeft = parseFloat(ringRef.current.style.left) || -100;
        const currentTop = parseFloat(ringRef.current.style.top) || -100;
        ringRef.current.style.left = `${currentLeft + (ringPos.current.x - currentLeft) * 0.1}px`;
        ringRef.current.style.top = `${currentTop + (ringPos.current.y - currentTop) * 0.1}px`;
      }
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);

    return () => {
      try {
        document.body.style.cursor = '';
      } catch {}
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', delegateOver);
      document.removeEventListener('mouseout', delegateOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-ivory"
        style={{ left: -100, top: -100 }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-ivory/25"
        style={{
          left: -100,
          top: -100,
          transform: 'translate(-50%, -50%) scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
      />
    </>
  );
}

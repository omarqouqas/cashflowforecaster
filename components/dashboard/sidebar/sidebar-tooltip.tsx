'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SidebarTooltipProps {
  content: string;
  children: React.ReactNode;
  show: boolean;
}

export function SidebarTooltip({ content, children, show }: SidebarTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  }, [isVisible]);

  if (!show) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] px-2.5 py-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-800 text-zinc-100 rounded-md shadow-lg border border-zinc-700 whitespace-nowrap"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateY(-50%)',
          }}
          role="tooltip"
        >
          {content}
          {/* Arrow pointing left */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-zinc-900 dark:bg-zinc-800 border-l border-b border-zinc-700 rotate-45" />
        </div>,
        document.body
      )}
    </div>
  );
}

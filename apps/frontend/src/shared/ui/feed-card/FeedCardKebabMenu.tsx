'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedCardKebabMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FeedCardKebabMenu({ onEdit, onDelete }: FeedCardKebabMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1.5 -m-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="더보기"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full mt-1 z-10',
            'min-w-[120px] bg-background rounded-lg border border-gray-100 shadow-md',
            'overflow-hidden',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="w-full inline-flex items-center gap-2 px-3 py-2 text-c01-m text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={14} />
              <span>수정</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="w-full inline-flex items-center gap-2 px-3 py-2 text-c01-m text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              <span>삭제</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

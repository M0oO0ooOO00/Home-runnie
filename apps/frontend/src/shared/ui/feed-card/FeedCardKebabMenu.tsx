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
        className="-m-2 rounded-full p-2 text-gray-600 transition-colors hover:text-gray-700"
        aria-label="더보기"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={28} strokeWidth={2.6} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-10 mt-5',
            'min-w-[160px] rounded-xl bg-card',
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
              className="inline-flex w-full items-center gap-4 px-5 py-4 text-b02-m text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Pencil size={20} strokeWidth={1.8} />
              <span>수정하기</span>
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
              className="inline-flex w-full items-center gap-4 px-5 py-4 text-b02-m text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={20} strokeWidth={1.8} />
              <span>삭제하기</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

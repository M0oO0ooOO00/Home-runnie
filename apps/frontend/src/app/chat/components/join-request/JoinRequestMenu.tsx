'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import JoinRequestDropdown from '@/app/chat/components/join-request/JoinRequestDropdown';

interface JoinRequestMenuProps {
  roomId: string;
  count?: number;
  onOpen?: () => void;
}

const JoinRequestMenu = ({ roomId, count = 0, onOpen }: JoinRequestMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        onOpen?.();
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative p-1 rounded transition-colors cursor-pointer ${
          isOpen ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100'
        }`}
        aria-label="참여 요청"
        aria-expanded={isOpen}
      >
        <Mail className="w-6 h-6 text-gray-600" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </button>
      {isOpen && <JoinRequestDropdown roomId={roomId} />}
    </div>
  );
};

export default JoinRequestMenu;

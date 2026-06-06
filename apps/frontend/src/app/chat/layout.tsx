'use client';

import ChatLayoutShell from './components/ChatLayoutShell';
import { ChatSocketProvider } from '@/hooks/chat/ChatSocketProvider';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatSocketProvider>
      <ChatLayoutShell>{children}</ChatLayoutShell>
    </ChatSocketProvider>
  );
}

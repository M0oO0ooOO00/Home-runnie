'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CommentInteractionContextValue {
  viewerMemberId: number | null;
  replyingTo: number | null;
  isCreatingReply: (commentId: number) => boolean;
  isUpdatingComment: boolean;
}

const CommentInteractionContext = createContext<CommentInteractionContextValue | null>(null);

export function CommentInteractionProvider({
  value,
  children,
}: {
  value: CommentInteractionContextValue;
  children: ReactNode;
}) {
  return (
    <CommentInteractionContext.Provider value={value}>
      {children}
    </CommentInteractionContext.Provider>
  );
}

export function useCommentInteraction() {
  const context = useContext(CommentInteractionContext);
  if (!context) {
    throw new Error('useCommentInteraction must be used within CommentInteractionProvider');
  }
  return context;
}

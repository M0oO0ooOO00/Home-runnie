'use client';

import type { Team } from '@homerunnie/shared';
import { useFeedCommentsQuery } from '@/hooks/feed/useFeedCommentsQuery';
import { CommentInteractionProvider } from './CommentInteractionContext';
import { CommentListView } from './CommentListView';
import { useFeedCommentActions } from './useFeedCommentActions';

interface CommentListProps {
  postId: number;
  viewerMemberId: number | null;
  viewerSupportTeam?: Team | string | null;
  onAuthRequired: (message: string) => void;
}

export function CommentList({
  postId,
  viewerMemberId,
  viewerSupportTeam,
  onAuthRequired,
}: CommentListProps) {
  const { data: comments, isLoading, isError, error } = useFeedCommentsQuery(postId);
  const { commentsQueryState, commentActions, interactionValue, isLogged, submitRootComment } =
    useFeedCommentActions({
      postId,
      viewerMemberId,
      onAuthRequired,
    });

  return (
    <CommentInteractionProvider value={interactionValue}>
      <CommentListView
        comments={comments}
        queryState={{
          isLoading,
          isError,
          errorMessage: error?.message,
        }}
        composer={{
          isLogged,
          isSubmitting: commentsQueryState.isRootCommentSubmitting,
          supportTeam: viewerSupportTeam,
          onSubmit: submitRootComment,
        }}
        actions={commentActions}
      />
    </CommentInteractionProvider>
  );
}

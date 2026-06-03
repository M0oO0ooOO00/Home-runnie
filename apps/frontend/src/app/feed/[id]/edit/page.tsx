'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStatus } from '@/hooks/auth/useLoginStatus';
import { useLoginRequiredModal } from '@/hooks/auth/useLoginRequiredModal';
import { useFeedImagePicker } from '@/hooks/feed/useFeedImagePicker';
import { useFeedPostQuery } from '@/hooks/feed/useFeedPostQuery';
import { useUpdateFeedPostMutation } from '@/hooks/feed/useUpdateFeedPostMutation';
import { useUploadImagesMutation } from '@/hooks/upload/useUploadImagesMutation';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';
import { FeedPostForm } from '@/app/feed/components/FeedPostForm';
import { FEED_POST_MAX_CONTENT, FEED_POST_MAX_IMAGES } from '@/app/feed/constants';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

interface FeedEditPageProps {
  params: { id: string };
}

interface FeedEditFormProps {
  postId: number;
  post: FeedPost;
}

export default function FeedEditPage({ params }: FeedEditPageProps) {
  const postId = Number(params.id);
  const { data: post, isLoading, isError, error } = useFeedPostQuery(postId);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="size-7 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
          <p className="text-b02-sb text-gray-700">게시글을 불러오지 못했어요.</p>
          <p className="text-c01-r text-gray-500">{error?.message}</p>
        </div>
      )}

      {post && <FeedEditForm key={post.id} postId={postId} post={post} />}
    </>
  );
}

function FeedEditForm({ postId, post }: FeedEditFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { images, formImages, newFiles, addFiles, removeImage } = useFeedImagePicker({
    maxImages: FEED_POST_MAX_IMAGES,
    initialImages: post.images,
  });

  const { profile, isLogged, isLoading: isLoginLoading } = useLoginStatus();
  const { loginModalOpen, setLoginModalOpen } = useLoginRequiredModal({
    isLoading: isLoginLoading,
    isLogged,
  });

  useEffect(() => {
    if (profile?.memberId && post.author.id !== profile.memberId) {
      router.replace(`/feed/${postId}`);
    }
  }, [post.author.id, profile?.memberId, router, postId]);

  const {
    mutate,
    isPending: isUpdating,
    isError: isMutateError,
    error: mutateError,
  } = useUpdateFeedPostMutation({
    onSuccess: () => router.replace(`/feed/${postId}`),
  });

  const { mutateAsync: uploadImagesAsync, isPending: isUploading } = useUploadImagesMutation();

  const isPending = isUploading || isUpdating;

  const isUnchanged = useMemo(() => {
    if (content !== post.content) return false;
    if (images.length !== post.images.length) return false;
    return images.every((img, index) => img.kind === 'existing' && img.url === post.images[index]);
  }, [content, images, post.content, post.images]);

  const canSubmit =
    content.trim().length > 0 &&
    content.length <= FEED_POST_MAX_CONTENT &&
    !isPending &&
    !isUnchanged;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setUploadError(null);

    try {
      const uploaded = newFiles.length > 0 ? await uploadImagesAsync(newFiles) : { urls: [] };

      let uploadIdx = 0;
      const finalUrls = images.map((img) =>
        img.kind === 'existing' ? img.url : uploaded.urls[uploadIdx++],
      );

      mutate({
        id: postId,
        body: {
          content: content !== post.content ? content.trim() : undefined,
          images: finalUrls,
        },
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const submitLabel = isUploading ? '업로드 중...' : isUpdating ? '저장 중...' : '저장';
  const mutationError = isMutateError ? `저장 실패: ${(mutateError as Error)?.message}` : null;

  return (
    <>
      <FeedPostForm
        value={{ content, images: formImages }}
        submitLabel={submitLabel}
        submitDisabled={!canSubmit}
        isSubmitting={isPending}
        errorMessage={uploadError ?? mutationError}
        actions={{
          onContentChange: setContent,
          onFilesSelected: addFiles,
          onRemoveImage: removeImage,
          onBack: () => router.back(),
          onSubmit,
        }}
      />

      <LoginRequiredModal
        open={loginModalOpen}
        onOpenChange={(open) => {
          setLoginModalOpen(open);
          if (!open && !isLogged) {
            router.replace('/feed');
          }
        }}
        onConfirm={() => router.push('/login')}
        title="로그인이 필요해요"
        description="글을 수정하려면 로그인이 필요합니다."
        confirmText="로그인 하러가기"
        cancelText="피드로 돌아가기"
        showCancel
      />
    </>
  );
}

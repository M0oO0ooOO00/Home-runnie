'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateFeedPostMutation } from '@/hooks/feed/useCreateFeedPostMutation';
import { useFeedImagePicker } from '@/hooks/feed/useFeedImagePicker';
import { useUploadImagesMutation } from '@/hooks/upload/useUploadImagesMutation';
import { useLoginStatus } from '@/hooks/auth/useLoginStatus';
import { useLoginRequiredModal } from '@/hooks/auth/useLoginRequiredModal';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';
import { FeedPostForm } from '@/app/feed/components/FeedPostForm';
import { FEED_POST_MAX_CONTENT, FEED_POST_MAX_IMAGES } from '@/app/feed/constants';

export default function FeedNewPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { formImages, newFiles, addFiles, removeImage } = useFeedImagePicker({
    maxImages: FEED_POST_MAX_IMAGES,
  });

  const { isLogged, isLoading: isLoginLoading } = useLoginStatus();
  const { loginModalOpen, setLoginModalOpen } = useLoginRequiredModal({
    isLoading: isLoginLoading,
    isLogged,
  });

  const { mutateAsync: uploadImagesAsync, isPending: isUploading } = useUploadImagesMutation();

  const {
    mutate,
    isPending: isCreating,
    isError,
    error,
  } = useCreateFeedPostMutation({
    onSuccess: () => router.push('/feed'),
  });

  const isSubmitting = isUploading || isCreating;

  const canSubmit =
    content.trim().length > 0 && content.length <= FEED_POST_MAX_CONTENT && !isSubmitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setUploadError(null);

    try {
      const uploaded = newFiles.length > 0 ? await uploadImagesAsync(newFiles) : { urls: [] };

      mutate({
        content: content.trim(),
        images: uploaded.urls,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const submitLabel = isUploading ? '업로드 중...' : isCreating ? '게시 중...' : '게시';
  const mutationError = isError ? `게시 실패: ${(error as Error)?.message}` : null;

  return (
    <>
      <FeedPostForm
        value={{ content, images: formImages }}
        submitLabel={submitLabel}
        submitDisabled={!canSubmit}
        isSubmitting={isSubmitting}
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
        description="글을 작성하려면 로그인이 필요합니다."
        confirmText="로그인 하러가기"
        cancelText="피드로 돌아가기"
        showCancel
      />
    </>
  );
}

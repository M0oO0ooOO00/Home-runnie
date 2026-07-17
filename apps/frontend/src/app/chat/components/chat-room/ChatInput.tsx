'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { CHAT_IMAGE_MAX_FILES, validateChatImageFiles } from '@/apis/chat/chat';
import { showToast, ToastIconType } from '@/shared/ui/toast/toast';

interface ChatInputProps {
  connected: boolean;
  onSend: (message: string, imageFiles: File[]) => Promise<void>;
}

interface SelectedChatImage {
  file: File;
  previewUrl: string;
}

const ChatInput = ({ connected, onSend }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedChatImage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewImagesRef = useRef<SelectedChatImage[]>([]);

  useEffect(() => {
    return () => {
      previewImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSelectedImages = () => {
    previewImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    previewImagesRef.current = [];
    setSelectedImages([]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingFileCount = CHAT_IMAGE_MAX_FILES - selectedImages.length;
    if (files.length > remainingFileCount) {
      showToast(
        `채팅 이미지는 최대 ${CHAT_IMAGE_MAX_FILES}장까지 선택할 수 있어요.`,
        ToastIconType.INFO,
      );
      resetFileInput();
      return;
    }

    try {
      validateChatImageFiles(files);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '업로드할 수 없는 이미지가 포함되어 있어요.',
        ToastIconType.INFO,
      );
      resetFileInput();
      return;
    }

    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    previewImagesRef.current = [...previewImagesRef.current, ...newImages];
    setSelectedImages((previousImages) => [...previousImages, ...newImages]);
    resetFileInput();
  };

  const handleRemoveImage = (index: number) => {
    const removedImage = selectedImages[index];
    if (!removedImage) return;

    URL.revokeObjectURL(removedImage.previewUrl);
    previewImagesRef.current = previewImagesRef.current.filter(
      (_, imageIndex) => imageIndex !== index,
    );
    setSelectedImages((previousImages) =>
      previousImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    const hasContent = trimmedMessage.length > 0 || selectedImages.length > 0;
    if (!hasContent || isSending || !connected) return;

    setIsSending(true);
    try {
      await onSend(
        trimmedMessage,
        selectedImages.map((selectedImage) => selectedImage.file),
      );
      setMessage('');
      clearSelectedImages();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '메시지를 전송하지 못했어요.',
        ToastIconType.INFO,
      );
    } finally {
      setIsSending(false);
    }
  };

  const hasContent = message.trim().length > 0 || selectedImages.length > 0;
  const isSubmitDisabled = !connected || !hasContent || isSending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg bg-white p-2 shadow-sm">
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2 px-1" aria-label="선택한 이미지 미리보기">
          {selectedImages.map((image, index) => (
            <div
              key={image.previewUrl}
              className="relative aspect-square overflow-hidden rounded-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label={`${index + 1}번째 이미지 삭제`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={selectedImages.length >= CHAT_IMAGE_MAX_FILES || isSending}
          className="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
          aria-label="이미지 선택"
        >
          <ImagePlus size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="하고싶은 말을 적어보세요"
          disabled={isSending}
          className="grow bg-transparent px-2 focus:outline-none disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`shrink-0 rounded-md px-6 py-2 text-b03-r transition-colors ${
            !isSubmitDisabled
              ? 'cursor-pointer bg-green-500 text-white hover:bg-green-600'
              : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          {isSending && <Loader2 className="mr-1 inline animate-spin" size={14} />}
          {isSending ? '전송 중' : '전송'}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

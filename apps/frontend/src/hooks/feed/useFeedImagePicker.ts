'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ExistingFeedImage {
  kind: 'existing';
  url: string;
}

export interface NewFeedImage {
  kind: 'new';
  previewUrl: string;
  file: File;
}

export type FeedImageItem = ExistingFeedImage | NewFeedImage;

interface UseFeedImagePickerOptions {
  maxImages: number;
  initialImages?: string[];
}

const revokePreviewUrl = (image: FeedImageItem) => {
  if (image.kind === 'new') {
    URL.revokeObjectURL(image.previewUrl);
  }
};

export function useFeedImagePicker({ maxImages, initialImages = [] }: UseFeedImagePickerOptions) {
  const [images, setImages] = useState<FeedImageItem[]>(() =>
    initialImages.map((url) => ({ kind: 'existing', url })),
  );
  const imagesRef = useRef<FeedImageItem[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(revokePreviewUrl);
    };
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      setImages((prev) => {
        const remaining = maxImages - prev.length;
        const accepted = files.slice(0, remaining);

        if (accepted.length === 0) return prev;

        const newItems: NewFeedImage[] = accepted.map((file) => ({
          kind: 'new',
          previewUrl: URL.createObjectURL(file),
          file,
        }));

        return [...prev, ...newItems];
      });
    },
    [maxImages],
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (!target) return prev;

      revokePreviewUrl(target);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const replaceWithExistingImages = useCallback((urls: string[]) => {
    setImages((prev) => {
      prev.forEach(revokePreviewUrl);
      return urls.map((url) => ({ kind: 'existing', url }));
    });
  }, []);

  const formImages = images.map((image) => {
    const src = image.kind === 'new' ? image.previewUrl : image.url;
    return {
      key: src,
      src,
    };
  });

  const newFiles = images.flatMap((image) => (image.kind === 'new' ? [image.file] : []));

  return {
    images,
    formImages,
    newFiles,
    addFiles,
    removeImage,
    replaceWithExistingImages,
  };
}

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
  const imagesRef = useRef<FeedImageItem[]>(images);

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
      const currentImages = imagesRef.current;
      const remaining = maxImages - currentImages.length;

      if (files.length === 0 || remaining <= 0 || files.length > remaining) return;

      const newItems: NewFeedImage[] = files.map((file) => ({
        kind: 'new',
        previewUrl: URL.createObjectURL(file),
        file,
      }));

      const nextImages = [...currentImages, ...newItems];
      imagesRef.current = nextImages;
      setImages(nextImages);
    },
    [maxImages],
  );

  const removeImage = useCallback((index: number) => {
    const currentImages = imagesRef.current;
    const target = currentImages[index];

    if (!target) return;

    const nextImages = currentImages.filter((_, i) => i !== index);
    imagesRef.current = nextImages;
    setImages(nextImages);
    revokePreviewUrl(target);
  }, []);

  const replaceWithExistingImages = useCallback((urls: string[]) => {
    const currentImages = imagesRef.current;
    const nextImages: ExistingFeedImage[] = urls.map((url) => ({ kind: 'existing', url }));

    imagesRef.current = nextImages;
    setImages(nextImages);
    currentImages.forEach(revokePreviewUrl);
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

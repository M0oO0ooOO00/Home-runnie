'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadImages, type UploadImagesResponse } from '@/apis/upload/upload';

interface Options {
  onSuccess?: (response: UploadImagesResponse) => void;
  onError?: (error: Error) => void;
}

export const useUploadImagesMutation = ({ onSuccess, onError }: Options = {}) => {
  return useMutation<UploadImagesResponse, Error, File[]>({
    mutationFn: (files) => uploadImages(files),
    onSuccess,
    onError,
  });
};

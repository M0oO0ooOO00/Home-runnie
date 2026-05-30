import { apiClient } from '@/lib/fetchClient';

export interface UploadImagesResponse {
  urls: string[];
}

export async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  if (files.length === 0) return { urls: [] };

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return apiClient.postFormData<UploadImagesResponse>('/upload/images', formData, {
    authRequired: true,
  });
}

import { apiClient } from '@/lib/fetchClient';

export const UPLOAD_IMAGE_MAX_SIZE_MB = 15;
export const UPLOAD_IMAGE_MAX_SIZE_BYTES = UPLOAD_IMAGE_MAX_SIZE_MB * 1024 * 1024;

export interface UploadImagesResponse {
  urls: string[];
}

export function validateUploadImageFiles(files: File[]) {
  const oversizedFile = files.find((file) => file.size > UPLOAD_IMAGE_MAX_SIZE_BYTES);

  if (oversizedFile) {
    throw new Error(`이미지는 파일당 ${UPLOAD_IMAGE_MAX_SIZE_MB}MB 이하만 업로드할 수 있어요.`);
  }
}

export async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  if (files.length === 0) return { urls: [] };
  validateUploadImageFiles(files);

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return apiClient.postFormData<UploadImagesResponse>('/upload/images', formData, {
    authRequired: true,
  });
}

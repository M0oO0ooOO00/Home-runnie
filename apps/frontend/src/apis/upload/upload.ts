import { apiClient } from '@/lib/fetchClient';

export const UPLOAD_IMAGE_MAX_SIZE_MB = 15;
export const UPLOAD_IMAGE_MAX_SIZE_BYTES = UPLOAD_IMAGE_MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;
const ALLOWED_IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|heic|heif)$/i;

export interface UploadImagesResponse {
  urls: string[];
}

interface PresignedImageUpload {
  uploadUrl: string;
  imageUrl: string;
}

interface PresignedImageResponse {
  files: PresignedImageUpload[];
}

function getImageMimeType(file: File): string {
  if (file.type.trim()) return file.type.trim();

  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypesByExtension: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
  };

  return extension ? (mimeTypesByExtension[extension] ?? '') : '';
}

export function validateUploadImageFiles(files: File[]) {
  const invalidFile = files.find((file) => {
    const mimeType = file.type.trim();
    const hasValidMimeType = ALLOWED_IMAGE_MIME.test(mimeType);
    const hasValidExtension = ALLOWED_IMAGE_EXTENSION.test(file.name);

    return mimeType ? !hasValidMimeType : !hasValidExtension;
  });

  if (invalidFile) {
    throw new Error('PNG, JPEG, GIF, WebP, HEIC 이미지만 업로드할 수 있어요.');
  }

  const oversizedFile = files.find((file) => file.size > UPLOAD_IMAGE_MAX_SIZE_BYTES);

  if (oversizedFile) {
    throw new Error(`이미지는 파일당 ${UPLOAD_IMAGE_MAX_SIZE_MB}MB 이하만 업로드할 수 있어요.`);
  }
}

export async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  if (files.length === 0) return { urls: [] };
  validateUploadImageFiles(files);

  const { files: presignedFiles } = await apiClient.post<PresignedImageResponse>(
    '/upload/images/presign',
    {
      files: files.map((file) => ({
        fileName: file.name,
        mimeType: getImageMimeType(file),
        fileSize: file.size,
      })),
    },
    {
      authRequired: true,
      retries: 0,
    },
  );

  if (presignedFiles.length !== files.length) {
    throw new Error('이미지 업로드 URL 응답을 확인할 수 없습니다.');
  }

  await Promise.all(
    presignedFiles.map(async (presignedFile, index) => {
      const file = files[index];
      if (!file) throw new Error('업로드할 원본 이미지를 찾을 수 없습니다.');

      const response = await fetch(presignedFile.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': getImageMimeType(file),
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }),
  );

  return { urls: presignedFiles.map((file) => file.imageUrl) };
}

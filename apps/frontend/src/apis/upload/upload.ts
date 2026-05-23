export interface UploadImagesResponse {
  urls: string[];
}

export async function uploadImages(files: File[]): Promise<UploadImagesResponse> {
  if (files.length === 0) return { urls: [] };

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch('/api/upload/images', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      (data && (data.message || data.data?.message)) || `이미지 업로드 실패: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

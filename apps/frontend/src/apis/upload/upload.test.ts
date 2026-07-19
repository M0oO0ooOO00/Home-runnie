import { apiClient } from '@/lib/fetchClient';
import { uploadImages, validateUploadImageFiles } from './upload';

jest.mock('@/lib/fetchClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const postMock = apiClient.post as jest.Mock;
const fetchMock = jest.fn();

const createFile = (type: string, size = 1, name = 'feed-image.png') =>
  new File([new Uint8Array(size)], name, { type });

describe('validateUploadImageFiles', () => {
  it('rejects unsupported files before requesting an upload URL', () => {
    expect(() => validateUploadImageFiles([createFile('application/pdf', 1, 'file.pdf')])).toThrow(
      'PNG, JPEG, GIF, WebP, HEIC 이미지만 업로드할 수 있어요.',
    );
  });
});

describe('uploadImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue({ ok: true });
  });

  it('requests presigned URLs and uploads files directly to S3', async () => {
    const file = createFile('image/png', 3);
    postMock.mockResolvedValue({
      files: [
        {
          uploadUrl: 'https://s3.example.com/presigned-upload',
          imageUrl: 'https://s3.example.com/feed/2/image.png',
        },
      ],
    });

    await expect(uploadImages([file])).resolves.toEqual({
      urls: ['https://s3.example.com/feed/2/image.png'],
    });

    expect(postMock).toHaveBeenCalledWith(
      '/upload/images/presign',
      {
        files: [
          {
            fileName: 'feed-image.png',
            mimeType: 'image/png',
            fileSize: file.size,
          },
        ],
      },
      { authRequired: true, retries: 0 },
    );
    expect(fetchMock).toHaveBeenCalledWith('https://s3.example.com/presigned-upload', {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: file,
    });
  });
});

import { CHAT_IMAGE_MAX_FILES, CHAT_IMAGE_MAX_SIZE_BYTES, validateChatImageFiles } from './chat';

const createFile = (type: string, size = 1) =>
  new File([new Uint8Array(size)], 'chat-image', { type });

describe('validateChatImageFiles', () => {
  it(`allows up to ${CHAT_IMAGE_MAX_FILES} supported image files`, () => {
    expect(() =>
      validateChatImageFiles([
        createFile('image/png'),
        createFile('image/jpeg'),
        createFile('image/webp'),
        createFile('image/heic'),
      ]),
    ).not.toThrow();
  });

  it('rejects more than the maximum number of files', () => {
    const files = Array.from({ length: CHAT_IMAGE_MAX_FILES + 1 }, () => createFile('image/png'));

    expect(() => validateChatImageFiles(files)).toThrow(
      `채팅 이미지는 최대 ${CHAT_IMAGE_MAX_FILES}장까지 선택할 수 있어요.`,
    );
  });

  it('rejects unsupported MIME types', () => {
    expect(() => validateChatImageFiles([createFile('application/pdf')])).toThrow(
      'PNG, JPEG, GIF, WebP, HEIC 이미지만 업로드할 수 있어요.',
    );
  });

  it('rejects files larger than the size limit', () => {
    expect(() =>
      validateChatImageFiles([createFile('image/png', CHAT_IMAGE_MAX_SIZE_BYTES + 1)]),
    ).toThrow('이미지는 파일당 15MB 이하만 업로드할 수 있어요.');
  });
});

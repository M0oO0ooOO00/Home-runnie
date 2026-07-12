export interface CommentSubmitValue {
  content: string;
  imageFile?: File;
  imageUrl?: string | null;
}

export interface CommentItemActions {
  toggleReply: (commentId: number) => void;
  submitReply: (parentId: number, value: CommentSubmitValue) => void;
  like: (commentId: number) => void;
  delete: (commentId: number) => void;
  update: (commentId: number, value: CommentSubmitValue) => void;
}

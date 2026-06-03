export interface CommentItemActions {
  toggleReply: (commentId: number) => void;
  submitReply: (parentId: number, content: string) => void;
  like: (commentId: number) => void;
  delete: (commentId: number) => void;
  update: (commentId: number, content: string) => void;
}

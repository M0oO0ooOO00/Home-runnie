export enum ReactionTargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export const ReactionTargetTypeDescription = {
  [ReactionTargetType.POST]: '게시글',
  [ReactionTargetType.COMMENT]: '댓글',
} as const;

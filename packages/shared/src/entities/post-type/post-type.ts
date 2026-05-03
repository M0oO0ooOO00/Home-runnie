export enum PostType {
  RECRUITMENT = 'RECRUITMENT',
  TIPS = 'TIPS',
  FEED = 'FEED',
}

export const PostTypeDescription = {
  [PostType.RECRUITMENT]: '직관메이트 모집',
  [PostType.TIPS]: '직관꿀팁',
  [PostType.FEED]: '피드',
} as const;

import { ReactionTargetType } from '@/reaction/domain';

export const FEED_REACTION_READER = Symbol('FEED_REACTION_READER');

export interface FeedReactionReader {
  countLikes(targetType: ReactionTargetType, targetId: number): Promise<number>;
  countLikesByTargetIds(
    targetType: ReactionTargetType,
    targetIds: number[],
  ): Promise<Record<number, number>>;
  findLikedTargetIds(
    memberId: number,
    targetType: ReactionTargetType,
    targetIds: number[],
  ): Promise<Set<number>>;
}

import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, count, eq, inArray } from 'drizzle-orm';
import { Like, ReactionTargetType } from '@/reaction/domain';
import { DATABASE_CONNECTION } from '@/common';

@Injectable()
export class ReactionRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async findLike(memberId: number, targetType: ReactionTargetType, targetId: number) {
    const [row] = await this.db
      .select()
      .from(Like)
      .where(
        and(
          eq(Like.memberId, memberId),
          eq(Like.targetType, targetType),
          eq(Like.targetId, targetId),
          eq(Like.deleted, false),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async createLike(memberId: number, targetType: ReactionTargetType, targetId: number) {
    const [row] = await this.db.insert(Like).values({ memberId, targetType, targetId }).returning();
    return row;
  }

  async softDeleteLike(id: number) {
    await this.db.update(Like).set({ deleted: true, updatedAt: new Date() }).where(eq(Like.id, id));
  }

  async countLikes(targetType: ReactionTargetType, targetId: number): Promise<number> {
    const [result] = await this.db
      .select({ count: count() })
      .from(Like)
      .where(
        and(eq(Like.targetType, targetType), eq(Like.targetId, targetId), eq(Like.deleted, false)),
      );
    return result?.count ?? 0;
  }

  async countLikesByTargetIds(
    targetType: ReactionTargetType,
    targetIds: number[],
  ): Promise<Record<number, number>> {
    if (targetIds.length === 0) return {};

    const rows = await this.db
      .select({
        targetId: Like.targetId,
        cnt: count(),
      })
      .from(Like)
      .where(
        and(
          eq(Like.targetType, targetType),
          inArray(Like.targetId, targetIds),
          eq(Like.deleted, false),
        ),
      )
      .groupBy(Like.targetId);

    return rows.reduce<Record<number, number>>((acc, row) => {
      acc[row.targetId] = Number(row.cnt);
      return acc;
    }, {});
  }

  async findLikedTargetIds(
    memberId: number,
    targetType: ReactionTargetType,
    targetIds: number[],
  ): Promise<Set<number>> {
    if (targetIds.length === 0) return new Set();

    const rows = await this.db
      .select({ targetId: Like.targetId })
      .from(Like)
      .where(
        and(
          eq(Like.memberId, memberId),
          eq(Like.targetType, targetType),
          inArray(Like.targetId, targetIds),
          eq(Like.deleted, false),
        ),
      );

    return new Set(rows.map((r) => r.targetId));
  }
}

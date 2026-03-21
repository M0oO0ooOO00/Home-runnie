import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '@/common';
import { Scrap } from '@/scrap/domain';

@Injectable()
export class ScrapRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async findByMemberAndPost(memberId: number, postId: number) {
    const [scrap] = await this.db
      .select()
      .from(Scrap)
      .where(and(eq(Scrap.memberId, memberId), eq(Scrap.postId, postId)));

    return scrap || null;
  }

  async createScrap(memberId: number, postId: number) {
    const [scrap] = await this.db.insert(Scrap).values({ memberId, postId }).returning();

    return scrap;
  }

  async softDeleteScrap(memberId: number, postId: number) {
    const [updated] = await this.db
      .update(Scrap)
      .set({ deleted: true })
      .where(and(eq(Scrap.memberId, memberId), eq(Scrap.postId, postId), eq(Scrap.deleted, false)))
      .returning({ id: Scrap.id });

    return updated ?? null;
  }

  async restoreScrap(memberId: number, postId: number) {
    const [updated] = await this.db
      .update(Scrap)
      .set({ deleted: false })
      .where(and(eq(Scrap.memberId, memberId), eq(Scrap.postId, postId), eq(Scrap.deleted, true)))
      .returning({ id: Scrap.id });

    return updated ?? null;
  }
}

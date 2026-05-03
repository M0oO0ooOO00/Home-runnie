import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { Post } from '@/post/shared/domain';
import { DATABASE_CONNECTION } from '@/common';

@Injectable()
export class PostSharedRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async softDelete(postId: number) {
    const [updated] = await this.db
      .update(Post)
      .set({ deleted: true })
      .where(and(eq(Post.id, postId), eq(Post.deleted, false)))
      .returning({ id: Post.id });

    return updated ?? null;
  }
}

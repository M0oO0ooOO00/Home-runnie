import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Post, RecruitmentDetail } from '@/post/domain';
import { PostType } from '@homerunnie/shared';
import { PostStatusEnum } from '@/common/enums/post-status.enum';
import { TicketingType } from '@/common/enums/ticketing-type.enum';
import { PreferGender } from '@/common/enums/prefer-gender.enum';
import { Stadium } from '@/common/enums/stadium.enum';
import { Team } from '@/common/enums/team.enum';
import { DATABASE_CONNECTION } from '@/common';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createRecruitmentPost(
    authorId: number,
    title: string,
    gameDate: Date,
    stadium: Stadium,
    teamHome: Team,
    teamAway: Team,
    recruitmentLimit: number,
    preferGender: PreferGender,
    message: string | null,
    ticketingType: TicketingType | null,
    supportTeam: Team | null,
  ) {
    // Post 생성
    const [post] = await this.db
      .insert(Post)
      .values({
        title,
        post_type: PostType.RECRUITMENT,
        postStatus: PostStatusEnum.ACTIVE,
        authorId,
      })
      .returning();

    if (!post) {
      throw new Error('게시글 생성 실패');
    }

    // RecruitmentDetail 생성
    const [recruitmentDetail] = await this.db
      .insert(RecruitmentDetail)
      .values({
        postId: post.id,
        gameDate: gameDate.toISOString(),
        gameTime: gameDate.toISOString(), // gameTime도 gameDate와 동일하게 설정
        stadium: stadium.toString(),
        teamHome: teamHome.toString(),
        teamAway: teamAway.toString(),
        recruitmentLimit,
        preferGender,
        message: message || null,
        ticketingType: ticketingType || null,
        supportTeam: supportTeam?.toString() || null,
      })
      .returning();

    return {
      post,
      recruitmentDetail,
    };
  }
}

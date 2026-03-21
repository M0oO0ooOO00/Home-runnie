import { Injectable } from '@nestjs/common';
import { ScrapRepository } from '@/scrap/repository';

@Injectable()
export class ScrapService {
  constructor(private readonly scrapRepository: ScrapRepository) {}

  async toggleScrap(memberId: number, postId: number) {
    const existing = await this.scrapRepository.findByMemberAndPost(memberId, postId);

    if (!existing) {
      await this.scrapRepository.createScrap(memberId, postId);
      return { scrapped: true };
    }

    if (existing.deleted) {
      await this.scrapRepository.restoreScrap(memberId, postId);
      return { scrapped: true };
    }

    await this.scrapRepository.softDeleteScrap(memberId, postId);
    return { scrapped: false };
  }
}

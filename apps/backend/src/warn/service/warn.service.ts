import { Injectable } from '@nestjs/common';
import { WarnRepository } from '@/warn/repository/index.js';

@Injectable()
export class WarnService {
    constructor(private readonly warnRepository: WarnRepository) {}

    async findByMemberId(memberId: number) {
        return await this.warnRepository.findByMemberId(memberId);
    }
}

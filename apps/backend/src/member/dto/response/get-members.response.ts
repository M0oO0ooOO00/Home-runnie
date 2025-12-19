import { ApiProperty } from '@nestjs/swagger';
import { GetMemberResponse } from '@/member/dto/response/get-member.response.js';
import { Member } from '@/member/domain/index.js';

interface GetMembersResponseInterface {
    members: GetMemberResponse[];
}

export class GetMembersResponse implements GetMembersResponseInterface {
    @ApiProperty({ type: [GetMemberResponse] })
    members: GetMemberResponse[];

    constructor(members: GetMemberResponse[]) {
        this.members = members;
    }

    static from(members: (typeof Member.$inferSelect)[]): GetMembersResponse {
        return new GetMembersResponse(members);
    }
}

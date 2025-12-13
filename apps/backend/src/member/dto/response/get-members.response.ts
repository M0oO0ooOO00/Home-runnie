import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../domain';
import { GetMemberResponse, GetMembersResponse } from '@homerunnie/shared';
import { GetMemberResponseDto } from './get-member.response';

export class GetMembersResponseDto implements GetMembersResponse {
    @ApiProperty({ type: [GetMemberResponseDto] })
    members: GetMemberResponse[];

    constructor(members: GetMemberResponse[]) {
        this.members = members;
    }

    static from(members: (typeof Member.$inferSelect)[]): GetMembersResponse {
        return new GetMembersResponseDto(members);
    }
}

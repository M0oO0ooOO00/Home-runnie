import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@/member/domain';
import { GetMemberResponse, GetMembersResponse } from '@homerunnie/shared';
import { GetMemberResponseDto } from '@/member/dto/response/get-member.response.dto';

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

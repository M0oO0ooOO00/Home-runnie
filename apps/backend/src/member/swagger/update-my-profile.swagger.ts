import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GetMyProfileResponseDto, UpdateMyProfileRequestDto } from '../dto';

export const UpdateMyProfileSwagger = applyDecorators(
    ApiOperation({
        summary: '내 프로필 수정',
        description: '닉네임과 응원 팀을 수정합니다.',
    }),
    ApiBody({
        type: UpdateMyProfileRequestDto,
        description: '수정할 프로필 정보',
    }),
    ApiResponse({
        status: 200,
        description: '프로필 수정 성공',
        type: GetMyProfileResponseDto,
    }),
    ApiResponse({
        status: 404,
        description: '존재하지 않는 회원',
    }),
);

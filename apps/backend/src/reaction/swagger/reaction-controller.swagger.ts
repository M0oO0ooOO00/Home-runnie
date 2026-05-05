import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ReactionControllerSwagger = applyDecorators(ApiTags('리액션 (좋아요)'));

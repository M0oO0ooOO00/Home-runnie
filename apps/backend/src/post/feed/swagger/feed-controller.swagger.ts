import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const FeedControllerSwagger = applyDecorators(ApiTags('피드'));
